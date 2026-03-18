import { useEffect, useMemo, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";

const LS_DIAG = "fortress_diag_v2";

/**
 * MiniDiagnosticQuiz.jsx (대형앱급 리디자인)
 * - 상단: 카드 헤더 + 타입 배지 + 진행도(미니 바)
 * - 본문: 큰 질문/옵션 카드, 선택 시 부드러운 피드백
 * - 해설: "슬라이드-다운" 패널 + 핵심 요약
 * - 결과: 점수 + 약점 추천(유형 기반) + CTA
 * - 저장: 마지막 결과 localStorage
 * - 접근성: aria, 키보드 Enter/ESC
 */

/** ✅ 질문 풀 */
const QUESTION_POOL = [
  {
    id: "v1",
    type: "vocab",
    q: 'Q1. “Let me recap” likely means:',
    options: ["Change topic", "Review key points", "Start Q&A", "Interrupt politely"],
    answer: 1,
    explain:
      "‘recap’은 ‘요약하다/핵심을 다시 정리하다’라는 의미. 대화에서 ‘Let me recap’은 지금까지 핵심을 정리하겠다는 신호.",
  },
  {
    id: "v2",
    type: "vocab",
    q: 'Q2. “The proposal was rejected outright”에서 outright의 의미는?',
    options: ["천천히", "부분적으로", "완전히/단호하게", "우연히"],
    answer: 2,
    explain: "outright = completely, immediately, without reservation → ‘단호하게/완전히’ 거절.",
  },
  {
    id: "g1",
    type: "grammar",
    q: "Q3. Choose the best option: It is essential that every applicant ______ the form accurately.",
    options: ["completes", "complete", "completed", "will complete"],
    answer: 1,
    explain: "It is essential that ~ 는 당위(가정법 현재)로 that절 동사는 원형이 기본(3인칭 s X).",
  },
  {
    id: "g2",
    type: "grammar",
    q: "Q4. Choose the best option: Had the team prepared earlier, they ______ the deadline.",
    options: ["meet", "would meet", "would have met", "have met"],
    answer: 2,
    explain: "과거완료 가정법 도치(Had + p.p.) → 결과절 would have p.p.",
  },
  {
    id: "r1",
    type: "reading",
    q: "Q5. In reading questions, ‘inference’ most closely asks you to:",
    options: [
      "Find the exact same sentence",
      "Guess without evidence",
      "Conclude based on clues in the passage",
      "Choose the longest option",
    ],
    answer: 2,
    explain: "Inference는 ‘지문 근거(단서)를 바탕으로 합리적으로 추론’하는 유형.",
  },
];

/* ===================== helpers ===================== */

function safeParse(raw, fallback) {
  try {
    const v = JSON.parse(raw);
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickN(pool, n = 3) {
  return shuffle(pool).slice(0, n);
}

function typeMeta(type) {
  if (type === "vocab") return { label: "VOCAB", chip: "Vocab", desc: "어휘/표현" };
  if (type === "grammar") return { label: "GRAMMAR", chip: "Grammar", desc: "문법/구조" };
  return { label: "READING", chip: "Reading", desc: "독해/추론" };
}

function weaknessFrom(set, answersMap) {
  // answersMap: { [qid]: { picked, correct } }
  const missByType = { vocab: 0, grammar: 0, reading: 0 };
  set.forEach((q) => {
    const r = answersMap[q.id];
    if (!r) return;
    if (!r.correct) missByType[q.type] = (missByType[q.type] || 0) + 1;
  });
  const entries = Object.entries(missByType).sort((a, b) => b[1] - a[1]);
  const top = entries[0];
  if (!top || top[1] === 0) return null;
  return top[0]; // type
}

/* ===================== component ===================== */

export default function MiniDiagnosticQuiz() {
  const [set, setSet] = useState(() => pickN(QUESTION_POOL, 3));
  const [idx, setIdx] = useState(0);

  const [picked, setPicked] = useState(null); // number | null
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);

  // 선택 로그 (결과 추천용)
  const [answersMap, setAnswersMap] = useState({}); // { [qid]: { picked, correct } }

  const lastSavedRef = useRef(false);

  const cur = set[idx];

  const meta = useMemo(() => typeMeta(cur?.type), [cur?.type]);
  const total = set.length;

  const progressPct = useMemo(() => {
    if (!total) return 0;
    // 현재 문제를 "읽고 있는 상태"에서도 부드럽게 보이게: idx 기반 + 1
    return Math.round(((idx + 1) / total) * 100);
  }, [idx, total]);

  const choose = (i) => {
    if (done) return;
    if (!cur) return;
    if (picked !== null) return;

    setPicked(i);

    const isCorrect = i === cur.answer;
    if (isCorrect) setCorrectCount((c) => c + 1);

    setAnswersMap((m) => ({
      ...m,
      [cur.id]: { picked: i, correct: isCorrect },
    }));
  };

  const next = () => {
    if (picked === null) return;
    if (idx >= total - 1) {
      setDone(true);
      return;
    }
    setIdx((v) => v + 1);
    setPicked(null);
  };

  const reshuffle = () => {
    setSet(pickN(QUESTION_POOL, 3));
    setIdx(0);
    setPicked(null);
    setCorrectCount(0);
    setDone(false);
    setAnswersMap({});
    lastSavedRef.current = false;
  };

  // 결과 저장(끝났을 때만)
  useEffect(() => {
    if (!done) return;
    if (lastSavedRef.current) return;
    lastSavedRef.current = true;

    const weak = weaknessFrom(set, answersMap);
    const payload = {
      at: Date.now(),
      correctCount,
      total,
      weakType: weak, // "vocab" | "grammar" | "reading" | null
    };
    localStorage.setItem(LS_DIAG, JSON.stringify(payload));
  }, [done, set, answersMap, correctCount, total]);

  // 키보드 UX: 선택 후 Enter=다음, ESC=리셋(혹은 선택 초기화)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        // 진행 중이면 리셋 대신 "다시 뽑기"로 간단히
        reshuffle();
      }
      if (e.key === "Enter") {
        if (!done && picked !== null) next();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [picked, done, idx, total]);

  const weakType = useMemo(() => (done ? weaknessFrom(set, answersMap) : null), [done, set, answersMap]);
  const weakMeta = useMemo(() => (weakType ? typeMeta(weakType) : null), [weakType]);

  const resultTitle = useMemo(() => {
    if (!done) return "";
    if (correctCount === total) return "완벽 진단 ✅";
    if (correctCount === 0) return "오늘은 방향 잡는 날";
    return "진단 완료";
  }, [done, correctCount, total]);

  const resultLine = useMemo(() => {
    if (!done) return "";
    if (!weakType) return "전 유형이 고르게 안정적이에요. 오늘 목표는 ‘양’보다 ‘반복’으로!";
    if (weakType === "vocab") return "어휘/표현이 약점으로 보여요. 짧게 자주, 예문으로 고정하세요.";
    if (weakType === "grammar") return "문법/구조가 약점으로 보여요. 자주 틀리는 패턴을 ‘공식’처럼 외우세요.";
    return "독해/추론이 약점으로 보여요. 근거 문장 → 단서 → 결론 3단계로 고정하세요.";
  }, [done, weakType]);

  return (
    <Wrap>
      <Top>
        <TitleBox>
          <Title>미니 진단 퀴즈</Title>
          <Sub>3문항 · 약점 추천 · 30초 컷</Sub>
        </TitleBox>

        <RightTop>
          <Chip aria-label="현재 영역">
            <ChipDot aria-hidden />
            <span>{meta?.chip || "Mini"}</span>
          </Chip>
        </RightTop>
      </Top>

      <Card>
        <CardTop>
          <CardTopLeft>
            <Kicker>{meta?.label || "MINI"}</Kicker>
            <CardTitle>
              {!done ? (
                <>
                  <b>{idx + 1}</b> / {total} · {meta?.desc}
                </>
              ) : (
                <>{resultTitle}</>
              )}
            </CardTitle>
          </CardTopLeft>

          <MiniBar aria-hidden>
            <MiniBarFill style={{ width: `${done ? 100 : progressPct}%` }} />
          </MiniBar>
        </CardTop>

        <Body>
          {!done ? (
            <>
              <Question aria-live="polite">{cur?.q}</Question>

              <OptionList role="list">
                {cur?.options?.map((t, i) => {
                  const show = picked !== null;
                  const isCorrect = i === cur.answer;
                  const isPicked = i === picked;

                  const state = !show
                    ? "idle"
                    : isCorrect
                      ? "correct"
                      : isPicked
                        ? "wrong"
                        : "idle";

                  return (
                    <OptionBtn
                      key={i}
                      type="button"
                      onClick={() => choose(i)}
                      disabled={picked !== null}
                      $state={state}
                      aria-label={`선택지 ${i + 1}: ${t}`}
                    >
                      <LeftOpt>
                        <OptIndex aria-hidden>{String.fromCharCode(65 + i)}</OptIndex>
                        <OptText>{t}</OptText>
                      </LeftOpt>

                      <RightOpt aria-hidden>
                        {show && isCorrect && <Mark $ok>✓</Mark>}
                        {show && isPicked && !isCorrect && <Mark>✕</Mark>}
                      </RightOpt>
                    </OptionBtn>
                  );
                })}
              </OptionList>

              <Explain $open={picked !== null}>
                <ExplainHead>
                  <ExplainTitle>해설</ExplainTitle>
                  {picked !== null && (
                    <ExplainPill $ok={picked === cur.answer}>
                      {picked === cur.answer ? "정답" : "오답"}
                    </ExplainPill>
                  )}
                </ExplainHead>

                <ExplainText>{cur?.explain}</ExplainText>

                <ExplainHint>
                  {picked === null
                    ? "정답을 고르면 해설이 열려요."
                    : "다음 문제로 넘어갈 준비가 됐으면 ‘다음’ 버튼을 누르세요."}
                </ExplainHint>
              </Explain>

              <Footer>
                <Progress>
                  <b>{idx + 1}</b>/{total} · 정답 <b>{correctCount}</b>
                </Progress>

                <Btns>
                  <GhostBtn type="button" onClick={reshuffle}>
                    다시 뽑기
                  </GhostBtn>
                  <PrimaryBtn type="button" onClick={next} disabled={picked === null}>
                    {idx === total - 1 ? "결과 보기" : "다음"}
                  </PrimaryBtn>
                </Btns>
              </Footer>
            </>
          ) : (
            <Result>
              <ResultLeft>
                <ResultTitle>{resultTitle}</ResultTitle>
                <Score>
                  <ScoreNum>
                    {correctCount}
                    <span>/{total}</span>
                  </ScoreNum>
                  <ScoreSub>정답</ScoreSub>
                </Score>

                <Insight>
                  <InsightTitle>추천</InsightTitle>
                  <InsightText>{resultLine}</InsightText>
                </Insight>

                {weakMeta && (
                  <WeakCard>
                    <WeakLabel>약점 영역</WeakLabel>
                    <WeakChip>
                      <WeakDot aria-hidden />
                      <span>{weakMeta.chip}</span>
                    </WeakChip>
                    <WeakDesc>
                      오늘 목표에 <b>{weakMeta.desc}</b>를 1개라도 넣으면 효율이 확 올라가요.
                    </WeakDesc>
                  </WeakCard>
                )}

                {!weakMeta && (
                  <WeakCard>
                    <WeakLabel>컨디션</WeakLabel>
                    <WeakDesc>
                      오늘은 균형이 좋아요. 목표는 “짧게 자주”로 루틴 유지가 최우선!
                    </WeakDesc>
                  </WeakCard>
                )}

                <ResultBtns>
                  <PrimaryBtn type="button" onClick={reshuffle}>
                    새로 진단하기
                  </PrimaryBtn>
                </ResultBtns>
              </ResultLeft>

              <ResultRight aria-hidden>
                <BigBadge>
                  <BigBadgeTop>FORTRESS</BigBadgeTop>
                  <BigBadgeMid>DIAG</BigBadgeMid>
                  <BigBadgeBot>{correctCount === total ? "PERFECT" : "FOCUS"}</BigBadgeBot>
                </BigBadge>
              </ResultRight>
            </Result>
          )}
        </Body>
      </Card>
    </Wrap>
  );
}

/* ===================== STYLES ===================== */

const pop = keyframes`
  from { transform: translateY(6px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const glow = keyframes`
  0% { box-shadow: 0 16px 28px rgba(15,23,42,0.08); }
  50% { box-shadow: 0 18px 36px rgba(255,176,32,0.18); }
  100% { box-shadow: 0 16px 28px rgba(15,23,42,0.08); }
`;

const Wrap = styled.div`
  width: 100%;
  min-width: 0;
  animation: ${pop} 220ms ease-out;
`;

const Top = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
`;

const TitleBox = styled.div`
  display: grid;
  gap: 4px;
  min-width: 0;
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: 1000;
  letter-spacing: -0.35px;
  color: #0b1220;
`;

const Sub = styled.div`
  font-size: 12px;
  color: #94a3b8;
  font-weight: 900;
`;

const RightTop = styled.div`
  flex: 0 0 auto;
`;

const Chip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid rgba(226, 232, 240, 0.95);
  background: rgba(255, 255, 255, 0.92);
  font-size: 12px;
  font-weight: 1000;
  color: #0b1220;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.06);
`;

const ChipDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #ffb020;
  box-shadow: 0 0 0 6px rgba(255, 176, 32, 0.14);
`;

const Card = styled.div`
  border-radius: 18px;
  border: 1px solid rgba(226, 232, 240, 0.95);
  background:
    radial-gradient(900px 280px at 12% 0%, rgba(255, 176, 32, 0.14), transparent 55%),
    radial-gradient(800px 260px at 90% 10%, rgba(59, 130, 246, 0.10), transparent 55%),
    #ffffff;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
  overflow: hidden;
`;

const CardTop = styled.div`
  padding: 14px 14px 12px;
  display: grid;
  gap: 10px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.9);
  background: linear-gradient(180deg, rgba(248, 250, 252, 0.92), rgba(255, 255, 255, 0.92));
`;

const CardTopLeft = styled.div`
  display: grid;
  gap: 4px;
`;

const Kicker = styled.div`
  font-size: 11px;
  font-weight: 1000;
  letter-spacing: 0.9px;
  color: #64748b;
`;

const CardTitle = styled.div`
  font-size: 14px;
  font-weight: 1000;
  letter-spacing: -0.25px;
  color: #0b1220;

  b {
    font-weight: 1100;
  }
`;

const MiniBar = styled.div`
  height: 10px;
  border-radius: 999px;
  background: rgba(226, 232, 240, 0.85);
  overflow: hidden;
`;

const MiniBarFill = styled.div`
  height: 100%;
  width: 0%;
  border-radius: 999px;
  background: linear-gradient(90deg, #ffb020, #ffd27a);
  transition: width 220ms ease-out;
`;

const Body = styled.div`
  padding: 14px;
`;

const Question = styled.div`
  font-weight: 1050;
  font-size: 18px;
  letter-spacing: -0.35px;
  color: #0b1220;
  margin-bottom: 12px;
  overflow-wrap: anywhere;
`;

const OptionList = styled.div`
  display: grid;
  gap: 10px;
`;

const OptionBtn = styled.button`
  width: 100%;
  text-align: left;
  border-radius: 16px;
  padding: 14px 14px;
  cursor: pointer;
  border: 1px solid rgba(226, 232, 240, 0.95);
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 14px 26px rgba(15, 23, 42, 0.06);

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  color: #0b1220;
  transition: transform 120ms ease, box-shadow 160ms ease, border-color 160ms ease;

  ${({ $state }) =>
    $state === "correct"
      ? `
        border-color: rgba(34,197,94,0.55);
        background: linear-gradient(180deg, rgba(34,197,94,0.10), rgba(255,255,255,0.96));
      `
      : $state === "wrong"
        ? `
        border-color: rgba(239,68,68,0.55);
        background: linear-gradient(180deg, rgba(239,68,68,0.08), rgba(255,255,255,0.96));
      `
        : ``}

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 18px 34px rgba(15, 23, 42, 0.10);
  }

  &:active {
    transform: translateY(0.5px);
  }

  &:disabled {
    cursor: default;
    opacity: 0.98;
    transform: none;
  }
`;

const LeftOpt = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  min-width: 0;
`;

const OptIndex = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 10px;
  background: #0f172a;
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 1100;
  flex: 0 0 auto;
`;

const OptText = styled.div`
  min-width: 0;
  font-weight: 1000;
  letter-spacing: -0.2px;
  overflow-wrap: anywhere;
`;

const RightOpt = styled.div`
  flex: 0 0 auto;
`;

const Mark = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  font-weight: 1100;
  color: ${({ $ok }) => ($ok ? "#166534" : "#991b1b")};
  background: ${({ $ok }) => ($ok ? "rgba(34,197,94,0.14)" : "rgba(239,68,68,0.12)")};
  border: 1px solid ${({ $ok }) => ($ok ? "rgba(34,197,94,0.30)" : "rgba(239,68,68,0.30)")};
`;

const Explain = styled.div`
  margin-top: 12px;
  border-radius: 16px;
  border: 1px solid rgba(226, 232, 240, 0.95);
  background: rgba(248, 250, 252, 0.9);
  padding: 12px;

  max-height: ${({ $open }) => ($open ? "240px" : "0px")};
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  transform: ${({ $open }) => ($open ? "translateY(0)" : "translateY(-6px)")};
  transition: 200ms ease;
  overflow: hidden;
`;

const ExplainHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 8px;
`;

const ExplainTitle = styled.div`
  font-weight: 1100;
  color: #0b1220;
`;

const ExplainPill = styled.div`
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 1100;
  color: ${({ $ok }) => ($ok ? "#166534" : "#991b1b")};
  background: ${({ $ok }) => ($ok ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.10)")};
  border: 1px solid ${({ $ok }) => ($ok ? "rgba(34,197,94,0.26)" : "rgba(239,68,68,0.22)")};
`;

const ExplainText = styled.div`
  color: #334155;
  font-weight: 900;
  line-height: 1.55;
  overflow-wrap: anywhere;
`;

const ExplainHint = styled.div`
  margin-top: 8px;
  font-size: 12px;
  font-weight: 900;
  color: #94a3b8;
`;

const Footer = styled.div`
  margin-top: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;

  @media (max-width: 360px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Progress = styled.div`
  color: #64748b;
  font-weight: 1000;
  font-size: 12px;

  b {
    font-weight: 1150;
    color: #0b1220;
  }
`;

const Btns = styled.div`
  display: flex;
  gap: 10px;

  @media (max-width: 360px) {
    width: 100%;
  }
`;

const GhostBtn = styled.button`
  height: 42px;
  padding: 0 14px;
  border-radius: 14px;
  border: 1px solid rgba(226, 232, 240, 0.95);
  background: #fff;
  font-weight: 1100;
  color: #334155;
  cursor: pointer;

  &:active {
    transform: translateY(0.5px);
  }

  @media (max-width: 360px) {
    flex: 1;
  }
`;

const PrimaryBtn = styled.button`
  height: 42px;
  padding: 0 14px;
  border-radius: 14px;
  border: none;
  background: linear-gradient(180deg, #ffcc66, #ffb020);
  color: #0b1220;
  font-weight: 1150;
  cursor: pointer;
  box-shadow: 0 16px 28px rgba(255, 176, 32, 0.22);
  animation: ${glow} 2.2s ease-in-out infinite;

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    box-shadow: none;
    animation: none;
  }

  &:active {
    transform: translateY(0.5px);
  }

  @media (max-width: 360px) {
    flex: 1;
  }
`;

/* ===================== RESULT ===================== */

const Result = styled.div`
  display: grid;
  grid-template-columns: 1fr 180px;
  gap: 14px;
  align-items: stretch;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const ResultLeft = styled.div`
  display: grid;
  gap: 10px;
`;

const ResultRight = styled.div`
  display: grid;
  place-items: center;

  @media (max-width: 520px) {
    display: none;
  }
`;

const ResultTitle = styled.div`
  font-size: 18px;
  font-weight: 1150;
  letter-spacing: -0.35px;
  color: #0b1220;
`;

const Score = styled.div`
  display: flex;
  align-items: baseline;
  gap: 10px;
`;

const ScoreNum = styled.div`
  font-size: 40px;
  font-weight: 1200;
  letter-spacing: -1px;
  color: #0b1220;

  span {
    font-size: 16px;
    font-weight: 1000;
    color: #94a3b8;
    margin-left: 6px;
  }
`;

const ScoreSub = styled.div`
  font-size: 12px;
  font-weight: 1000;
  color: #64748b;
`;

const Insight = styled.div`
  border-radius: 16px;
  border: 1px solid rgba(226, 232, 240, 0.95);
  background: rgba(248, 250, 252, 0.92);
  padding: 12px;
`;

const InsightTitle = styled.div`
  font-size: 12px;
  font-weight: 1150;
  color: #0b1220;
  margin-bottom: 6px;
`;

const InsightText = styled.div`
  font-size: 12px;
  font-weight: 950;
  color: #334155;
  line-height: 1.55;
`;

const WeakCard = styled.div`
  border-radius: 16px;
  border: 1px solid rgba(226, 232, 240, 0.95);
  background: linear-gradient(180deg, rgba(255, 250, 235, 0.92), rgba(255, 255, 255, 0.96));
  padding: 12px;
  display: grid;
  gap: 8px;
`;

const WeakLabel = styled.div`
  font-size: 11px;
  font-weight: 1150;
  letter-spacing: 0.6px;
  color: #64748b;
`;

const WeakChip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid rgba(255, 176, 32, 0.28);
  background: rgba(255, 176, 32, 0.12);
  font-size: 12px;
  font-weight: 1150;
  color: #0b1220;
  width: fit-content;
`;

const WeakDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #ffb020;
  box-shadow: 0 0 0 6px rgba(255, 176, 32, 0.16);
`;

const WeakDesc = styled.div`
  font-size: 12px;
  font-weight: 950;
  color: #334155;
  line-height: 1.55;

  b {
    font-weight: 1150;
    color: #0b1220;
  }
`;

const ResultBtns = styled.div`
  margin-top: 2px;
`;

const BigBadge = styled.div`
  width: 180px;
  height: 180px;
  border-radius: 28px;
  border: 1px solid rgba(226, 232, 240, 0.95);
  background:
    radial-gradient(circle at 30% 25%, rgba(255, 176, 32, 0.24), transparent 55%),
    linear-gradient(180deg, #0f172a, #111827);
  color: #fff;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.22);
  display: grid;
  place-items: center;
  text-align: center;
  padding: 14px;
`;

const BigBadgeTop = styled.div`
  font-weight: 1100;
  letter-spacing: 1.2px;
  font-size: 12px;
  opacity: 0.85;
`;

const BigBadgeMid = styled.div`
  font-weight: 1200;
  letter-spacing: 2px;
  font-size: 24px;
`;

const BigBadgeBot = styled.div`
  font-weight: 1100;
  letter-spacing: 1.4px;
  font-size: 12px;
  opacity: 0.9;
`;