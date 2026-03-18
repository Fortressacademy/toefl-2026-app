// src/pages/ListeningSet.jsx
import { useMemo, useState, useEffect, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { LISTENING_BANK } from "../data/listening/listeningBank";

function getQueryIndex(search) {
  const sp = new URLSearchParams(search);
  const n = parseInt(sp.get("i") || "0", 10);
  return Number.isFinite(n) ? n : 0;
}

/** TTS (임시) */
function speakTTS(text, { rate = 0.98, pitch = 1, lang = "en-US", voice = null } = {}) {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve();
    const synth = window.speechSynthesis;
    if (!synth || !window.SpeechSynthesisUtterance) return resolve();

    try {
      synth.cancel();
    } catch {}

    const u = new SpeechSynthesisUtterance(String(text || ""));
    u.lang = lang;
    u.rate = rate;
    u.pitch = pitch;
    if (voice) u.voice = voice;

    u.onend = () => resolve();
    u.onerror = () => resolve();
    synth.speak(u);
  });
}

function pickTwoVoices(voices, lang = "en-US") {
  const list = (voices || []).filter((v) =>
    (v.lang || "").toLowerCase().startsWith(lang.slice(0, 2).toLowerCase())
  );
  if (list.length === 0) return { vA: null, vB: null };

  const byName = (kw) => list.find((v) => (v.name || "").toLowerCase().includes(kw));

  const female = byName("female") || byName("woman") || byName("zira") || byName("susan") || null;
  const male = byName("male") || byName("man") || byName("david") || byName("mark") || null;

  let vA = female || list[0] || null;
  let vB = male || list.find((v) => v !== vA) || list[0] || null;

  if (vA === vB) vB = list.find((v) => v !== vA) || null;

  return { vA, vB };
}

export default function ListeningSet() {
  const nav = useNavigate();
  const { partKey } = useParams();
  const { search } = useLocation();
  const setIndex = getQueryIndex(search);

  const setData = useMemo(() => {
    const list = LISTENING_BANK?.[partKey] || [];
    return list?.[setIndex] || null;
  }, [partKey, setIndex]);

  const [qIdx, setQIdx] = useState(0);

  // ready | playing | choices | revealed
  const [phase, setPhase] = useState("ready");
  const [picked, setPicked] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  // ✅ 결과페이지용
  const [showResult, setShowResult] = useState(false);
  const [answersMap, setAnswersMap] = useState(() => ({})); // { [qIdx]: "A"|"B"|"C"|"D" }

  const lockRef = useRef(false);

  const [voices, setVoices] = useState([]);
  const voicePairRef = useRef({ vA: null, vB: null });

  // ✅ 결과 필터(훅 규칙 준수: 컴포넌트 내부)
  const [reviewFilter, setReviewFilter] = useState("wrong");

  useEffect(() => {
    setPhase("ready");
    setPicked(null);
    setIsCorrect(null);
    lockRef.current = false;

    if (typeof window !== "undefined" && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
  }, [qIdx, partKey, setIndex]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const synth = window.speechSynthesis;

    const load = () => {
      const v = synth.getVoices();
      setVoices(v || []);
      voicePairRef.current = pickTwoVoices(v || [], "en-US");
    };

    load();
    synth.onvoiceschanged = load;

    return () => {
      synth.onvoiceschanged = null;
    };
  }, []);

  // ✅ 세트/파트 바뀌면 결과/기록 리셋
  useEffect(() => {
    setShowResult(false);
    setAnswersMap({});
    setQIdx(0);
    setReviewFilter("wrong");
  }, [partKey, setIndex]);

  if (!setData) {
    return (
      <Page>
        <TopBar>
          <IconBtn onClick={() => nav("/listening")} type="button">
            ←
          </IconBtn>
          <TopTitle>Not found</TopTitle>
          <Spacer />
        </TopBar>
        <Shell>
          <BigCard>
            <CardTitle>세트를 찾을 수 없습니다.</CardTitle>
            <CardSub>경로 또는 bank 연결을 확인하세요.</CardSub>
            <WideBtn onClick={() => nav("/listening")} type="button">
              목록으로
            </WideBtn>
          </BigCard>
        </Shell>
      </Page>
    );
  }

  const total = setData.questions?.length || 0;

  const score = useMemo(() => {
    let c = 0;
    for (let i = 0; i < total; i++) {
      const qq = setData.questions?.[i];
      const a = answersMap[i];
      if (qq && a && a === qq.answer) c++;
    }
    return c;
  }, [answersMap, setData, total]);

  const accuracyPct = total ? Math.round((score / total) * 100) : 0;

  // ✅ 결과 페이지
  if (showResult) {
    return (
      <Page>
        <TopBar>
          <IconBtn onClick={() => nav("/listening")} type="button">
            ←
          </IconBtn>

          <TopCenter>
            <TopTitle>{setData.title}</TopTitle>
            <TopMeta>
              Result · <b>{score}</b> / {total}
            </TopMeta>
          </TopCenter>

          <Ring aria-label="progress" title={`${accuracyPct}%`}>
            <svg viewBox="0 0 36 36">
              <path
                className="bg"
                d="M18 2.5 a 15.5 15.5 0 0 1 0 31 a 15.5 15.5 0 0 1 0 -31"
              />
              <path
                className="bar"
                strokeDasharray={`${accuracyPct}, 100`}
                d="M18 2.5 a 15.5 15.5 0 0 1 0 31 a 15.5 15.5 0 0 1 0 -31"
              />
            </svg>
            <span>{accuracyPct}%</span>
          </Ring>
        </TopBar>

        <Shell>
          <ResultHero>
            <HeroGlow />
            <HeroInner>
              <HeroLeft>
                <HeroBadge>SESSION SUMMARY</HeroBadge>
                <HeroTitleBig>
                  {accuracyPct >= 80 ? "🔥 Great run!" : accuracyPct >= 60 ? "💪 Solid progress!" : "🧠 Keep building!"}
                </HeroTitleBig>
                <HeroSubText>
                  Listen-and-choose는 “질문 의도(이유/제안/확인/불평)”만 잡아도 정확도가 확 올라갑니다.
                </HeroSubText>

                <StatGrid>
                  <StatCard>
                    <div className="k">Score</div>
                    <div className="v">
                      {score} <span className="s">/ {total}</span>
                    </div>
                    <div className="d">맞힌 개수</div>
                  </StatCard>

                  <StatCard>
                    <div className="k">Accuracy</div>
                    <div className="v">{accuracyPct}%</div>
                    <div className="d">정답률</div>
                  </StatCard>

                  <StatCard>
                    <div className="k">Wrong</div>
                    <div className="v">{Math.max(0, total - score)}</div>
                    <div className="d">오답 개수</div>
                  </StatCard>
                </StatGrid>

                <HeroActions>
                  <HeroPrimary
                    type="button"
                    onClick={() => {
                      setShowResult(false);
                      setAnswersMap({});
                      setQIdx(0);
                      setPhase("ready");
                      setPicked(null);
                      setIsCorrect(null);
                      setReviewFilter("wrong");
                    }}
                  >
                    다시 풀기
                  </HeroPrimary>

                  <HeroGhost type="button" onClick={() => nav("/listening")}>
                    목록으로
                  </HeroGhost>
                </HeroActions>
              </HeroLeft>

              <HeroRight>
                <BigGauge aria-label="overall accuracy">
                  <svg viewBox="0 0 36 36">
                    <path
                      className="bg"
                      d="M18 2.5 a 15.5 15.5 0 0 1 0 31 a 15.5 15.5 0 0 1 0 -31"
                    />
                    <path
                      className="bar"
                      strokeDasharray={`${accuracyPct}, 100`}
                      d="M18 2.5 a 15.5 15.5 0 0 1 0 31 a 15.5 15.5 0 0 1 0 -31"
                    />
                  </svg>
                  <div className="num">{accuracyPct}%</div>
                  <div className="cap">Overall Accuracy</div>
                </BigGauge>

                <CoachMini>
                  <div className="t">COACH TIP</div>
                  <div className="b">
                    오답은 대부분 “답의 타입”이 어긋나서 생겨요. <b>Why</b>면 이유, <b>Do you mind</b>면
                    허락/조건, <b>Why don’t you</b>면 제안 수용/거절.
                  </div>
                </CoachMini>
              </HeroRight>
            </HeroInner>
          </ResultHero>

          <ReviewCard>
            <ReviewHead>
              <div>
                <ReviewTitle>Review</ReviewTitle>
                <ReviewSub>아래에서 오답 중심으로 해설을 빠르게 확인하세요.</ReviewSub>
              </div>
              <FilterPills>
                <PillBtn type="button" onClick={() => setReviewFilter("all")} $on={reviewFilter === "all"}>
                  All
                </PillBtn>
                <PillBtn type="button" onClick={() => setReviewFilter("wrong")} $on={reviewFilter === "wrong"}>
                  Wrong only
                </PillBtn>
                <PillBtn type="button" onClick={() => setReviewFilter("correct")} $on={reviewFilter === "correct"}>
                  Correct only
                </PillBtn>
              </FilterPills>
            </ReviewHead>

            <ReviewList>
              {(() => {
                const items = [];
                for (let i = 0; i < total; i++) {
                  const qq = setData.questions?.[i];
                  if (!qq) continue;
                  const ua = answersMap[i] || null;
                  const ok = ua && ua === qq.answer;

                  if (reviewFilter === "wrong" && ok) continue;
                  if (reviewFilter === "correct" && !ok) continue;

                  items.push(
                    <ReviewItem key={i} $ok={!!ok}>
                      <ReviewTopRow>
                        <div className="left">
                          <Badge $ok={!!ok}>{ok ? "CORRECT" : "WRONG"}</Badge>
                          <QLabel>Q{i + 1}</QLabel>
                        </div>
                        <div className="right">
                          <MiniAns>
                            You: <b>{ua || "—"}</b>
                          </MiniAns>
                          <MiniAns>
                            Ans: <b>{qq.answer}</b>
                          </MiniAns>
                        </div>
                      </ReviewTopRow>

                      {/* ✅ conversation 세트에서도 안전(2인대화 대응) */}
                      <PromptLine>“{qq.audioText || qq.prompt || "—"}”</PromptLine>

                      <OptionsGrid>
                        {Object.entries(qq.options || {}).map(([k, v]) => {
                          const isA = k === qq.answer;
                          const isU = k === ua;
                          return (
                            <OptChip key={k} $ans={isA} $you={isU} $ok={ok}>
                              <span className="k">{k}</span>
                              <span className="v">{v}</span>
                            </OptChip>
                          );
                        })}
                      </OptionsGrid>

                      <ExplainBlock>
                        {qq.explanation ? (
                          typeof qq.explanation === "string" ? (
                            <div className="txt">{qq.explanation}</div>
                          ) : (
                            <>
                              <div className="row">
                                <b>핵심</b> <span>{qq.explanation.core}</span>
                              </div>
                              <div className="row">
                                <b>정답 이유</b> <span>{qq.explanation.whyCorrect}</span>
                              </div>
                              {qq.explanation.whyWrong ? (
                                <div className="row">
                                  <b>오답 포인트</b>
                                  <ul>
                                    {Object.entries(qq.explanation.whyWrong).map(([kk, vv]) => (
                                      <li key={kk}>
                                        <b>{kk}</b>: {vv}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ) : null}
                            </>
                          )
                        ) : (
                          <div className="txt">해설이 없습니다.</div>
                        )}
                      </ExplainBlock>
                    </ReviewItem>
                  );
                }
                return items;
              })()}
            </ReviewList>

            <ReviewFoot>
              <FootGhost type="button" onClick={() => nav("/listening")}>
                목록으로
              </FootGhost>
              <FootPrimary
                type="button"
                onClick={() => {
                  setShowResult(false);
                  setQIdx(Math.max(0, total - 1));
                }}
              >
                마지막 문제로 돌아가기
              </FootPrimary>
            </ReviewFoot>
          </ReviewCard>
        </Shell>
      </Page>
    );
  }

  const q = setData.questions?.[qIdx];
  const progressPct = total ? Math.round(((qIdx + 1) / total) * 100) : 0;
  const isLast = qIdx >= total - 1;

  /* =========================
     ✅✅ 2인 대화(Conversation) 전용 로직만 추가
     - 기존 단일문항 playQuestion은 그대로 유지
  ========================= */

  const isConversation = !!setData?.conversation?.turns?.length;

  const playConversation = async () => {
    const turns = setData?.conversation?.turns || [];
    if (turns.length === 0) return;
    if (lockRef.current) return;
    lockRef.current = true;

    setPhase("playing");

    const { vA, vB } = voicePairRef.current || { vA: null, vB: null };

    for (const t of turns) {
      const text = t?.text || "";
      if (!text) continue;

      const voice = t?.spk === "B" ? vB : vA; // default A
      await speakTTS(text, { voice, rate: 0.98, pitch: 1, lang: "en-US" });
      await new Promise((r) => setTimeout(r, 160)); // 턴 간 짧은 간격
    }

    setPhase("choices");
    lockRef.current = false;
  };

  const playQuestion = async () => {
    // ✅ conversation이면 turns를 2인 음성으로 재생
    if (isConversation) return playConversation();

    // ✅ 기존 로직 그대로
    if (!q) return;
    if (lockRef.current) return;
    lockRef.current = true;

    setPhase("playing");
    await speakTTS(q.audioText);
    setPhase("choices");
    lockRef.current = false;
  };

  const stopQuestion = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    setPhase("choices");
    lockRef.current = false;
  };

  const pickChoice = (key) => {
    if (phase !== "choices") return;
    if (!q) return;

    setPicked(key);
    const ok = key === q.answer;
    setIsCorrect(ok);
    setPhase("revealed");

    // ✅ 기록
    setAnswersMap((prev) => ({ ...prev, [qIdx]: key }));
  };

  const goPrev = () => {
    if (qIdx === 0) return;
    setQIdx((p) => Math.max(0, p - 1));
  };

  const goNext = () => {
    if (isLast) {
      setShowResult(true);
      return;
    }
    setQIdx((p) => Math.min(total - 1, p + 1));
  };

  return (
    <Page>
      <TopBar>
        <IconBtn onClick={() => nav("/listening")} type="button">
          ←
        </IconBtn>

        <TopCenter>
          <TopTitle>{setData.title}</TopTitle>
          <TopMeta>
            Q <b>{qIdx + 1}</b> / {total}
          </TopMeta>
        </TopCenter>

        <Ring aria-label="progress" title={`${progressPct}%`}>
          <svg viewBox="0 0 36 36">
            <path
              className="bg"
              d="M18 2.5 a 15.5 15.5 0 0 1 0 31 a 15.5 15.5 0 0 1 0 -31"
            />
            <path
              className="bar"
              strokeDasharray={`${progressPct}, 100`}
              d="M18 2.5 a 15.5 15.5 0 0 1 0 31 a 15.5 15.5 0 0 1 0 -31"
            />
          </svg>
          <span>{progressPct}%</span>
        </Ring>
      </TopBar>

      <Shell>
        <BigCard>
          <CardHeader>
            <Chip>
              {phase === "ready" && "READY"}
              {phase === "playing" && "LISTENING"}
              {phase === "choices" && "CHOOSE"}
              {phase === "revealed" && "RESULT"}
            </Chip>

            <MiniTip>
              {phase === "ready" && "Play를 눌러 먼저 듣고, 끝나면 선택지가 열립니다."}
              {phase === "playing" && "집중. 질문은 화면에 표시되지 않습니다."}
              {phase === "choices" && "가장 자연스러운 응답을 고르세요."}
              {phase === "revealed" && "해설을 확인하고 다음으로 이동하세요."}
            </MiniTip>
          </CardHeader>

          {/* ✅ Big Audio Control */}
          <AudioPanel>
            <MascotBubble $state={phase}>
              {phase === "ready" && "🎧 Ready? Press Play!"}
              {phase === "playing" && "👂 Listening..."}
              {phase === "choices" && "✅ Now choose A–D!"}
              {phase === "revealed" && (isCorrect ? "🎉 Nice!" : "💡 Almost!")}
            </MascotBubble>

            <AudioButtons>
              <PlayBtn
                type="button"
                onClick={playQuestion}
                disabled={phase === "playing"}
                $active={phase === "playing"}
              >
                {phase === "playing" ? "Playing…" : "Play"}
              </PlayBtn>

              <StopBtn type="button" onClick={stopQuestion} disabled={phase !== "playing"}>
                Stop
              </StopBtn>
            </AudioButtons>
          </AudioPanel>

          {/* ✅ Choices */}
          {phase === "choices" || phase === "revealed" ? (
            <Choices>
              {Object.entries(q?.options || {}).map(([k, v]) => {
                const correct = phase === "revealed" && k === q.answer;
                const wrong = phase === "revealed" && picked === k && k !== q.answer;
                return (
                  <Choice
                    key={k}
                    type="button"
                    onClick={() => pickChoice(k)}
                    disabled={phase !== "choices"}
                    $active={picked === k}
                    $correct={correct}
                    $wrong={wrong}
                  >
                    <ChoiceLeft>
                      <Letter
                        $state={
                          correct ? "correct" : wrong ? "wrong" : picked === k ? "active" : "idle"
                        }
                      >
                        {k}
                      </Letter>
                      <div className="text">{v}</div>
                    </ChoiceLeft>
                    <RightMark>
                      {phase === "revealed" && correct
                        ? "✓"
                        : phase === "revealed" && wrong
                        ? "✕"
                        : "›"}
                    </RightMark>
                  </Choice>
                );
              })}
            </Choices>
          ) : (
            <Locked>
              <div className="icon">🔒</div>
              <div className="title">Choices locked</div>
              <div className="sub">먼저 듣기(Play)를 완료하면 선택지가 열려요.</div>
            </Locked>
          )}

          {/* ✅ Explanation (revealed) */}
          {phase === "revealed" ? (
            <Explain $ok={!!isCorrect}>
              <div className="headline">{isCorrect ? "Correct!" : `Incorrect · Answer: ${q?.answer}`}</div>

              {q?.explanation ? (
                typeof q.explanation === "string" ? (
                  <div className="body">{q.explanation}</div>
                ) : (
                  <div className="body">
                    <div className="row">
                      <b>핵심</b> <span>{q.explanation.core}</span>
                    </div>
                    <div className="row">
                      <b>정답 이유</b> <span>{q.explanation.whyCorrect}</span>
                    </div>
                    {q.explanation.whyWrong ? (
                      <div className="row">
                        <b>오답 포인트</b>
                        <ul>
                          {Object.entries(q.explanation.whyWrong).map(([kk, vv]) => (
                            <li key={kk}>
                              <b>{kk}</b>: {vv}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                )
              ) : null}
            </Explain>
          ) : null}

          {/* ✅ Bottom Nav */}
          <BottomNav>
            <NavBtn type="button" onClick={goPrev} disabled={qIdx === 0}>
              Prev
            </NavBtn>

            <MainNext
              type="button"
              onClick={goNext}
              disabled={phase !== "revealed"}
              $finish={isLast}
              title={isLast ? "Finish → Result" : "Next"}
            >
              {isLast ? "Finish" : "Next"}
            </MainNext>
          </BottomNav>
        </BigCard>
      </Shell>
    </Page>
  );
}

/* =================== UI TOKENS =================== */
const Y = {
  ink: "#0f172a",
  sub: "rgba(15,23,42,.66)",
  bg: "#F8FAFC",

  y50: "#FFFBEB",
  y100: "#FEF3C7",
  y200: "#FDE68A",
  y300: "#FCD34D",
  y400: "#FBBF24",
  y500: "#F59E0B",
  y600: "#D97706",

  green: "#16a34a",
  red: "#ef4444",
};

/* =================== animations =================== */
const pop = keyframes`
  0% { transform: scale(.98); opacity:.0; }
  100% { transform: scale(1); opacity:1; }
`;

const floaty = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-2px); }
  100% { transform: translateY(0px); }
`;

const shimmer = keyframes`
  0% { transform: translateX(-60%) rotate(10deg); opacity:.0; }
  20% { opacity:.6; }
  100% { transform: translateX(160%) rotate(10deg); opacity:0; }
`;

/* =================== layout =================== */
const Page = styled.div`
  min-height: calc(100vh - 64px);
  background:
    radial-gradient(900px 360px at 15% -5%, rgba(245,158,11,.12), transparent 60%),
    radial-gradient(700px 340px at 85% 10%, rgba(251,191,36,.10), transparent 55%),
    ${Y.bg};
  padding: 14px 14px 26px;
`;

const Shell = styled.div`
  width: min(720px, 100%);
  margin: 0 auto;
`;

const TopBar = styled.div`
  width: min(720px, 100%);
  margin: 0 auto 12px;
  display: grid;
  grid-template-columns: 46px 1fr 64px;
  align-items: center;
  gap: 10px;
`;

const IconBtn = styled.button`
  width: 46px;
  height: 46px;
  border-radius: 16px;
  border: 1px solid rgba(15, 23, 42, 0.10);
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 10px 20px rgba(15,23,42,.06);
  cursor: pointer;
  font-weight: 950;

  &:active { transform: translateY(1px); }
`;

const TopCenter = styled.div`
  display: grid;
  gap: 2px;
`;

const TopTitle = styled.div`
  font-weight: 950;
  color: ${Y.ink};
  letter-spacing: -0.2px;
  font-size: 18px;
`;

const TopMeta = styled.div`
  font-size: 12.5px;
  color: ${Y.sub};
  font-weight: 850;

  b { color: ${Y.ink}; }
`;

const Spacer = styled.div``;

const Ring = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 18px;
  background: rgba(255,255,255,.92);
  border: 1px solid rgba(15,23,42,.10);
  box-shadow: 0 10px 20px rgba(15,23,42,.06);
  display: grid;
  place-items: center;
  position: relative;

  svg { width: 46px; height: 46px; }
  .bg { fill: none; stroke: rgba(15,23,42,.10); stroke-width: 3.2; }
  .bar { fill: none; stroke: ${Y.y500}; stroke-width: 3.2; stroke-linecap: round; }
  span {
    position: absolute;
    font-size: 12px;
    font-weight: 950;
    color: rgba(15,23,42,.72);
  }
`;

const BigCard = styled.div`
  background: rgba(255,255,255,.92);
  border: 1px solid rgba(15,23,42,.08);
  border-radius: 26px;
  box-shadow: 0 18px 48px rgba(15,23,42,.10);
  padding: 16px;
  overflow: hidden;
`;

const CardHeader = styled.div`
  display: grid;
  gap: 10px;
  margin-bottom: 12px;
`;

const Chip = styled.div`
  display: inline-flex;
  width: fit-content;
  padding: 7px 12px;
  border-radius: 999px;
  font-weight: 950;
  font-size: 11px;
  letter-spacing: 0.6px;
  color: rgba(15,23,42,.72);
  background: rgba(15,23,42,.04);
  border: 1px solid rgba(15,23,42,.06);
`;

const MiniTip = styled.div`
  font-size: 13px;
  color: rgba(15,23,42,.62);
  font-weight: 800;
`;

/* =================== audio panel =================== */
const AudioPanel = styled.div`
  border-radius: 20px;
  padding: 14px;
  border: 1px solid rgba(15,23,42,.08);
  background:
    radial-gradient(850px 260px at 12% 0%, rgba(245,158,11,.14), transparent 62%),
    rgba(245,247,250,.70);
  box-shadow: 0 12px 30px rgba(245,158,11,.10);
`;

const MascotBubble = styled.div`
  font-weight: 950;
  color: ${Y.ink};
  letter-spacing: -0.2px;
  padding: 12px 12px;
  border-radius: 18px;
  background: rgba(255,255,255,.92);
  border: 1px solid rgba(15,23,42,.08);
  box-shadow: 0 10px 22px rgba(15,23,42,.06);
  animation: ${floaty} 1.8s ease-in-out infinite;

  ${(p) => (p.$state === "playing" ? `outline: 3px solid rgba(245,158,11,.18);` : "")}
`;

const AudioButtons = styled.div`
  margin-top: 12px;
  display: grid;
  grid-template-columns: 1fr 0.8fr;
  gap: 10px;
`;

const PlayBtn = styled.button`
  height: 50px;
  border-radius: 18px;
  border: none;
  cursor: pointer;
  font-weight: 950;
  font-size: 15px;
  color: #2b2100;
  background: linear-gradient(135deg, ${Y.y200}, ${Y.y500});
  box-shadow: 0 16px 30px rgba(245,158,11,.22);

  ${(p) => (p.$active ? `filter: brightness(1.02);` : "")}

  &:disabled { opacity: 0.7; cursor: default; }
  &:active { transform: translateY(1px); }
`;

const StopBtn = styled.button`
  height: 50px;
  border-radius: 18px;
  border: 1px solid rgba(15,23,42,.12);
  background: rgba(255,255,255,.86);
  cursor: pointer;
  font-weight: 950;
  color: rgba(15,23,42,.78);

  &:disabled { opacity: 0.35; cursor: default; }
  &:active { transform: translateY(1px); }
`;

/* =================== choices =================== */
const Choices = styled.div`
  margin-top: 14px;
  display: grid;
  gap: 10px;
  animation: ${pop} 160ms ease both;
`;

const Choice = styled.button`
  width: 100%;
  text-align: left;
  border-radius: 18px;
  padding: 14px 14px;
  border: 1px solid rgba(15,23,42,.10);
  background: rgba(255,255,255,.95);
  cursor: pointer;
  font-weight: 850;
  color: rgba(15,23,42,.92);
  box-shadow: 0 10px 20px rgba(15,23,42,.06);

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  transform: ${(p) => (p.$active ? "translateY(-1px)" : "translateY(0)")};
  border-color: ${(p) =>
    p.$correct
      ? "rgba(22,163,74,.35)"
      : p.$wrong
      ? "rgba(239,68,68,.35)"
      : p.$active
      ? "rgba(245,158,11,.30)"
      : "rgba(15,23,42,.10)"};

  background: ${(p) =>
    p.$correct
      ? "rgba(22,163,74,.08)"
      : p.$wrong
      ? "rgba(239,68,68,.06)"
      : p.$active
      ? "rgba(245,158,11,.10)"
      : "rgba(255,255,255,.95)"};

  &:hover {
    transform: translateY(-1px);
    border-color: rgba(245,158,11,.30);
  }

  &:disabled { cursor: default; opacity: 0.95; }
  &:active { transform: translateY(1px); }
`;

const ChoiceLeft = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;

  .text {
    font-size: 14.5px;
    line-height: 1.35;
    font-weight: 850;
  }
`;

const Letter = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  font-weight: 950;

  background: ${(p) =>
    p.$state === "correct"
      ? "rgba(22,163,74,.14)"
      : p.$state === "wrong"
      ? "rgba(239,68,68,.12)"
      : p.$state === "active"
      ? "rgba(245,158,11,.16)"
      : "rgba(15,23,42,.06)"};

  border: 1px solid
    ${(p) =>
      p.$state === "correct"
        ? "rgba(22,163,74,.24)"
        : p.$state === "wrong"
        ? "rgba(239,68,68,.22)"
        : p.$state === "active"
        ? "rgba(245,158,11,.22)"
        : "rgba(15,23,42,.10)"};

  color: rgba(15,23,42,.86);
`;

const RightMark = styled.div`
  font-weight: 950;
  opacity: 0.6;
  font-size: 18px;
`;

/* =================== locked =================== */
const Locked = styled.div`
  margin-top: 14px;
  border-radius: 20px;
  padding: 16px;
  border: 1px solid rgba(15,23,42,.10);
  background: rgba(245,247,250,.70);
  display: grid;
  gap: 6px;

  .icon { font-size: 18px; }
  .title { font-weight: 950; color: rgba(15,23,42,.86); }
  .sub {
    font-size: 13px;
    color: rgba(15,23,42,.60);
    font-weight: 800;
    line-height: 1.45;
  }
`;

/* =================== explanation =================== */
const Explain = styled.div`
  margin-top: 14px;
  border-radius: 20px;
  padding: 14px 14px;
  border: 1px solid rgba(15,23,42,.10);
  background: ${(p) => (p.$ok ? "rgba(22,163,74,.06)" : "rgba(239,68,68,.05)")};
  animation: ${pop} 160ms ease both;

  .headline {
    font-weight: 950;
    letter-spacing: -0.2px;
    color: rgba(15,23,42,.92);
  }
  .body {
    margin-top: 10px;
    font-size: 13px;
    color: rgba(15,23,42,.72);
    line-height: 1.55;
    font-weight: 850;
  }
  .row { margin-top: 8px; }
  ul { margin: 8px 0 0; padding-left: 18px; }
  li { margin: 6px 0; }
`;

/* =================== bottom nav =================== */
const BottomNav = styled.div`
  margin-top: 14px;
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 10px;
`;

const NavBtn = styled.button`
  height: 52px;
  border-radius: 18px;
  border: 1px solid rgba(15,23,42,.12);
  background: rgba(255,255,255,.90);
  cursor: pointer;
  font-weight: 950;
  color: rgba(15,23,42,.78);

  &:disabled { opacity: 0.35; cursor: default; }
  &:active { transform: translateY(1px); }
`;

const MainNext = styled.button`
  height: 52px;
  border-radius: 18px;
  border: none;
  cursor: pointer;
  font-weight: 950;
  color: #2b2100;
  background: linear-gradient(135deg, ${Y.y200}, ${Y.y500});
  box-shadow: 0 16px 30px rgba(245,158,11,.22);

  &:disabled {
    opacity: 0.45;
    cursor: default;
    box-shadow: none;
  }
  &:active { transform: translateY(1px); }
`;

const CardTitle = styled.div`
  font-weight: 950;
  font-size: 18px;
  color: ${Y.ink};
`;

const CardSub = styled.div`
  margin-top: 6px;
  font-size: 13px;
  color: ${Y.sub};
  font-weight: 850;
`;

const WideBtn = styled.button`
  margin-top: 12px;
  height: 48px;
  width: 100%;
  border-radius: 18px;
  border: none;
  cursor: pointer;
  font-weight: 950;
  color: #2b2100;
  background: linear-gradient(135deg, ${Y.y200}, ${Y.y500});
  box-shadow: 0 16px 30px rgba(245,158,11,.22);

  &:active { transform: translateY(1px); }
`;

/* =================== ✅ RESULT PAGE styles (FULL) =================== */
const ResultHero = styled.div`
  position: relative;
  border-radius: 26px;
  border: 1px solid rgba(15,23,42,.08);
  background: rgba(255,255,255,.92);
  box-shadow: 0 18px 48px rgba(15,23,42,.10);
  overflow: hidden;
`;

const HeroGlow = styled.div`
  position: absolute;
  inset: -80px;
  background:
    radial-gradient(1100px 420px at 18% -10%, rgba(245,158,11,0.22), transparent 62%),
    radial-gradient(900px 380px at 86% 12%, rgba(251,191,36,0.16), transparent 60%),
    radial-gradient(760px 320px at 52% 92%, rgba(245,158,11,0.10), transparent 60%);
  filter: blur(14px);
  opacity: 0.95;
`;

const HeroInner = styled.div`
  position: relative;
  z-index: 1;
  padding: 18px;
  display: grid;
  grid-template-columns: 1.35fr 0.65fr;
  gap: 14px;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

const HeroLeft = styled.div`
  display: grid;
  gap: 10px;
`;

const HeroBadge = styled.div`
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 12px;
  border-radius: 999px;
  font-weight: 950;
  font-size: 11px;
  letter-spacing: 0.7px;
  color: rgba(15,23,42,.72);
  background: rgba(255,255,255,.75);
  border: 1px solid rgba(15,23,42,.10);
`;

const HeroTitleBig = styled.div`
  font-weight: 1000;
  letter-spacing: -0.5px;
  color: ${Y.ink};
  font-size: clamp(22px, 4.6vw, 30px);
  line-height: 1.05;
`;

const HeroSubText = styled.div`
  font-size: 13px;
  font-weight: 850;
  color: rgba(15,23,42,.65);
  line-height: 1.55;
`;

const StatGrid = styled.div`
  margin-top: 4px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  border-radius: 18px;
  padding: 12px 12px;
  border: 1px solid rgba(15,23,42,.10);
  background: rgba(255,255,255,.86);
  box-shadow: 0 12px 26px rgba(15,23,42,.06);
  position: relative;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    top: -30%;
    left: -40%;
    width: 80%;
    height: 160%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.75), transparent);
    transform: rotate(10deg);
    animation: ${shimmer} 2.8s ease-in-out infinite;
    pointer-events: none;
  }

  .k {
    font-size: 11px;
    font-weight: 950;
    letter-spacing: 0.6px;
    color: rgba(15,23,42,.60);
  }

  .v {
    margin-top: 6px;
    font-weight: 1000;
    font-size: 22px;
    letter-spacing: -0.4px;
    color: rgba(15,23,42,.92);

    .s {
      font-weight: 950;
      font-size: 13px;
      color: rgba(15,23,42,.58);
      margin-left: 6px;
    }
  }

  .d {
    margin-top: 4px;
    font-size: 12.5px;
    font-weight: 850;
    color: rgba(15,23,42,.62);
  }
`;

const HeroActions = styled.div`
  margin-top: 4px;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 10px;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const HeroPrimary = styled.button`
  height: 52px;
  border-radius: 18px;
  border: none;
  cursor: pointer;
  font-weight: 950;
  color: #2b2100;
  background: linear-gradient(135deg, ${Y.y200}, ${Y.y500});
  box-shadow: 0 16px 30px rgba(245,158,11,.22);

  &:active { transform: translateY(1px); }
`;

const HeroGhost = styled.button`
  height: 52px;
  border-radius: 18px;
  border: 1px solid rgba(15,23,42,.12);
  background: rgba(255,255,255,.78);
  cursor: pointer;
  font-weight: 950;
  color: rgba(15,23,42,.78);

  &:active { transform: translateY(1px); }
`;

const HeroRight = styled.div`
  display: grid;
  gap: 10px;
  align-content: start;
`;

const BigGauge = styled.div`
  border-radius: 22px;
  border: 1px solid rgba(15,23,42,.10);
  background: rgba(255,255,255,.86);
  box-shadow: 0 12px 28px rgba(15,23,42,.08);
  padding: 14px;
  display: grid;
  place-items: center;
  position: relative;

  svg {
    width: 140px;
    height: 140px;
  }
  .bg {
    fill: none;
    stroke: rgba(15,23,42,.10);
    stroke-width: 3.4;
  }
  .bar {
    fill: none;
    stroke: ${Y.y500};
    stroke-width: 3.8;
    stroke-linecap: round;
  }

  .num {
    position: absolute;
    font-weight: 1000;
    font-size: 28px;
    color: rgba(15,23,42,.92);
    letter-spacing: -0.6px;
  }

  .cap {
    margin-top: 6px;
    font-size: 12px;
    font-weight: 900;
    color: rgba(15,23,42,.60);
  }
`;

const CoachMini = styled.div`
  border-radius: 20px;
  border: 1px solid rgba(15,23,42,.10);
  background: rgba(255,255,255,.80);
  box-shadow: 0 12px 26px rgba(15,23,42,.06);
  padding: 12px 12px;

  .t {
    font-size: 11px;
    font-weight: 950;
    letter-spacing: 0.7px;
    color: rgba(15,23,42,.60);
  }
  .b {
    margin-top: 8px;
    font-size: 12.8px;
    line-height: 1.55;
    font-weight: 850;
    color: rgba(15,23,42,.72);

    b {
      color: rgba(15,23,42,.92);
      font-weight: 950;
    }
  }
`;

const ReviewCard = styled.div`
  margin-top: 14px;
  border-radius: 26px;
  border: 1px solid rgba(15,23,42,.08);
  background: rgba(255,255,255,.92);
  box-shadow: 0 18px 48px rgba(15,23,42,.10);
  padding: 14px;
`;

const ReviewHead = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

const ReviewTitle = styled.div`
  font-weight: 1000;
  letter-spacing: -0.4px;
  color: rgba(15,23,42,.92);
  font-size: 18px;
`;

const ReviewSub = styled.div`
  margin-top: 4px;
  font-size: 12.8px;
  font-weight: 850;
  color: rgba(15,23,42,.62);
`;

const FilterPills = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PillBtn = styled.button`
  height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 950;
  font-size: 12px;
  border: 1px solid ${(p) => (p.$on ? "rgba(245,158,11,.28)" : "rgba(15,23,42,.12)")};
  background: ${(p) => (p.$on ? "rgba(245,158,11,.10)" : "rgba(255,255,255,.80)")};
  color: rgba(15,23,42,.78);

  &:active { transform: translateY(1px); }
`;

const ReviewList = styled.div`
  margin-top: 12px;
  display: grid;
  gap: 10px;
`;

const ReviewItem = styled.div`
  border-radius: 22px;
  border: 1px solid rgba(15,23,42,.10);
  background: rgba(255,255,255,.88);
  box-shadow: 0 12px 24px rgba(15,23,42,.06);
  padding: 12px 12px;
  overflow: hidden;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 22px;
    pointer-events: none;
    background: ${(p) =>
      p.$ok
        ? "radial-gradient(900px 240px at 12% 0%, rgba(22,163,74,.10), transparent 60%)"
        : "radial-gradient(900px 240px at 12% 0%, rgba(239,68,68,.08), transparent 60%)"};
  }

  > * {
    position: relative;
    z-index: 1;
  }
`;

const ReviewTopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;

  .left {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .right {
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;

const Badge = styled.div`
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 1000;
  letter-spacing: 0.7px;
  border: 1px solid ${(p) => (p.$ok ? "rgba(22,163,74,.22)" : "rgba(239,68,68,.22)")};
  background: ${(p) => (p.$ok ? "rgba(22,163,74,.10)" : "rgba(239,68,68,.08)")};
  color: rgba(15,23,42,.78);
`;

const QLabel = styled.div`
  font-weight: 1000;
  letter-spacing: -0.2px;
  color: rgba(15,23,42,.86);
`;

const MiniAns = styled.div`
  font-size: 12px;
  font-weight: 900;
  color: rgba(15,23,42,.62);

  b {
    color: rgba(15,23,42,.92);
  }
`;

const PromptLine = styled.div`
  margin-top: 10px;
  font-weight: 950;
  color: rgba(15,23,42,.92);
  letter-spacing: -0.2px;
  line-height: 1.35;
`;

const OptionsGrid = styled.div`
  margin-top: 10px;
  display: grid;
  gap: 8px;
`;

const OptChip = styled.div`
  display: grid;
  grid-template-columns: 28px 1fr;
  align-items: start;
  gap: 10px;
  padding: 10px 10px;
  border-radius: 16px;
  border: 1px solid rgba(15,23,42,.10);
  background: ${(p) =>
    p.$ans
      ? "rgba(245,158,11,.10)"
      : p.$you && !p.$ok
      ? "rgba(239,68,68,.06)"
      : p.$you && p.$ok
      ? "rgba(22,163,74,.08)"
      : "rgba(255,255,255,.85)"};

  .k {
    width: 28px;
    height: 28px;
    border-radius: 12px;
    display: grid;
    place-items: center;
    font-weight: 1000;
    border: 1px solid rgba(15,23,42,.12);
    background: rgba(15,23,42,.05);
    color: rgba(15,23,42,.86);
  }
  .v {
    font-size: 13.2px;
    font-weight: 850;
    color: rgba(15,23,42,.78);
    line-height: 1.35;
  }
`;

const ExplainBlock = styled.div`
  margin-top: 10px;
  border-radius: 18px;
  border: 1px solid rgba(15,23,42,.10);
  background: rgba(245,247,250,.75);
  padding: 10px 10px;

  .txt {
    font-size: 13px;
    font-weight: 850;
    color: rgba(15,23,42,.72);
    line-height: 1.55;
  }

  .row {
    margin-top: 8px;
    font-size: 13px;
    font-weight: 850;
    color: rgba(15,23,42,.72);
    line-height: 1.55;

    b {
      color: rgba(15,23,42,.92);
      font-weight: 950;
      margin-right: 6px;
    }
  }

  ul {
    margin: 8px 0 0;
    padding-left: 18px;
  }
  li {
    margin: 6px 0;
  }
`;

const ReviewFoot = styled.div`
  margin-top: 12px;
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 10px;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const FootGhost = styled.button`
  height: 52px;
  border-radius: 18px;
  border: 1px solid rgba(15,23,42,.12);
  background: rgba(255,255,255,.86);
  cursor: pointer;
  font-weight: 950;
  color: rgba(15,23,42,.78);

  &:active { transform: translateY(1px); }
`;

const FootPrimary = styled.button`
  height: 52px;
  border-radius: 18px;
  border: none;
  cursor: pointer;
  font-weight: 950;
  color: #2b2100;
  background: linear-gradient(135deg, ${Y.y200}, ${Y.y500});
  box-shadow: 0 16px 30px rgba(245,158,11,.22);

  &:active { transform: translateY(1px); }
`;