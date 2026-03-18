// src/pages/DailyLifeSet.jsx
import { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import styled from "styled-components";

import { DAILY_LIFE_BANK } from "../data/reading/dailyLifeBank";
import DocFrame from "../components/reading/DocFrame";
import EmailDoc from "../components/reading/EmailDoc";
import NoticeDoc from "../components/reading/NoticeDoc";
import ScheduleDoc from "../components/reading/ScheduleDoc";
import QuestionPanel from "../components/reading/QuestionPanel";
import AdsDoc from "../components/reading/AdsDoc";
import TextMessageDoc from "../components/reading/TextMessageDoc";

const LS_DAILY_PROGRESS = "daily_life_progress_v1";

function safeParse(raw, fallback) {
  try {
    const v = JSON.parse(raw);
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

function saveProgressForDoc(docId, done, total, correct) {
  const saved = safeParse(localStorage.getItem(LS_DAILY_PROGRESS), {});
  saved[docId] = { done, total, correct };
  localStorage.setItem(LS_DAILY_PROGRESS, JSON.stringify(saved));
}

export default function DailyLifeSet() {
  const nav = useNavigate();
  const { type } = useParams(); // notices | emails | schedules | ads | mixed
  const [sp] = useSearchParams();

  const items = useMemo(() => {
    const list = DAILY_LIFE_BANK?.[type] || DAILY_LIFE_BANK?.mixed || [];
    return Array.isArray(list) ? list : [];
  }, [type]);

  // ✅ set index: ?i=0~4
  const iParam = Number(sp.get("i") ?? 0);
  const safeI = Number.isFinite(iParam)
    ? Math.max(0, Math.min(items.length - 1, iParam))
    : 0;

  const item = items[safeI];
  const questions = Array.isArray(item?.questions) ? item.questions : [];

  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionId]: "A"|"B"|"C"|"D" }
  const [showResult, setShowResult] = useState(false);


useEffect(() => {
  if (!showResult) return;

  const prev = document.body.style.overflow;
  document.body.style.overflow = "hidden";

  return () => {
    document.body.style.overflow = prev;
  };
}, [showResult]);

  // type / set 바뀌면 초기화
  useEffect(() => {
    setQIdx(0);
    setAnswers({});
    setShowResult(false);
  }, [type, safeI]);

  const currentQ = questions[qIdx];
  const totalQs = questions.length;
  const isLastQ = qIdx >= totalQs - 1;

  const renderDoc = () => {
    if (!item) return <Empty>자료가 없습니다.</Empty>;
    const t = item.docType || item.type; // ✅ docType 없으면 type 사용(ads1처럼)
if (t === "email") return <EmailDoc doc={item} highlight={currentQ?.highlight} />;
    if (t === "notice") return <NoticeDoc doc={item} />;
    if (t === "schedule") return <ScheduleDoc doc={item} />;
    if (t === "ads") return <AdsDoc doc={item} />;
    if (t === "textmessage") return <TextMessageDoc doc={item} />;
    return <NoticeDoc doc={item} />;
  };

  const onSelect = (choice) => {
    if (!currentQ) return;
    setAnswers((prev) => ({ ...prev, [currentQ.id]: choice }));
  };

  const goPrevQ = () => setQIdx((p) => Math.max(0, p - 1));

  const score = useMemo(() => {
    if (!item) return { correct: 0, total: 0, done: 0, wrong: [] };

    let correct = 0;
    let done = 0;
    const wrong = [];

    for (const q of questions) {
      const picked = answers[q.id];
      if (!picked) continue;
      done += 1;
      if (picked === q.answer) correct += 1;
      else wrong.push({ ...q, picked });
    }

    return { correct, total: questions.length, done, wrong };
  }, [item, questions, answers]);

  // ✅ 답이 바뀔 때마다 progress 저장
  useEffect(() => {
    if (!item?.id) return;
    saveProgressForDoc(item.id, score.done, score.total, score.correct);
  }, [item, score.done, score.total, score.correct]);

  const goNextOrFinish = () => {
    if (!currentQ) return;

    const picked = answers[currentQ.id];
    if (!picked) return;

    if (!isLastQ) {
      setQIdx((p) => p + 1);
      return;
    }
    setShowResult(true);
  };

  const resetSet = () => {
    setQIdx(0);
    setAnswers({});
    setShowResult(false);
    if (item?.id) saveProgressForDoc(item.id, 0, questions.length || 0, 0);
  };

  return (
    <Wrap>
      <Top>
        <BackBtn onClick={() => nav(-1)}>← EXIT</BackBtn>
        <Title>
          Read in Daily Life · {type} · <b>Set {safeI + 1}</b>
        </Title>
        <Counter>
          {qIdx + 1} / {totalQs || 0}
        </Counter>
      </Top>

      <Grid>
        {/* ✅ RIGHT: Document (지문 먼저 렌더링) */}
        <RightCard className="right">
          <DocFrame
            headerLeft="TOEFL iBT READING"
            headerRight={`[${String(safeI + 1).padStart(2, "0")}] Read in Daily Life`}
            footerLeft={`Progress: ${score.done}/${score.total}`}
            footerRight={
              <>
                <NavBtn onClick={() => setShowResult(true)} disabled={!item}>
                  Result
                </NavBtn>
                <NavBtn onClick={resetSet} disabled={!item}>
                  Reset
                </NavBtn>
              </>
            }
          >
            {renderDoc()}
          </DocFrame>
        </RightCard>

        {/* ✅ LEFT: Question */}
        <LeftCard className="left">
          <QuestionPanel
            docType={item?.docType || item?.type}
            docTitle={item?.title || item?.subject || "Untitled"}
            docIndex={safeI + 1}
            docTotal={Math.min(items.length, 5) || items.length || 0}
            qIndex={qIdx + 1}
            qTotal={totalQs}
            question={currentQ}
            picked={currentQ ? answers[currentQ.id] : null}
            onPick={onSelect}
            onPrev={goPrevQ}
            onNext={goNextOrFinish}
            canPrev={qIdx > 0}
            canNext={!!(currentQ && answers[currentQ.id])}
            nextLabel={isLastQ ? "Finish" : "Next"}
          />
        </LeftCard>
      </Grid>

     {showResult && item ? (
  <ResultOverlay onClick={() => setShowResult(false)}>
    {/* ✅ 바깥 클릭 닫기 + 내부 클릭 버블링 방지 */}
    <ResultModal onClick={(e) => e.stopPropagation()}>
      <ResultHeader>
        <div className="topRow">
          <div>
            <h2>Set Result</h2>
            <p>
              Set <b>{safeI + 1}</b> · Score <b>{score.correct}/{score.total}</b>
            </p>
          </div>

          <ScorePill>
            <span className="label">SCORE</span>
            <span className="val">
              {Math.round((score.correct / Math.max(1, score.total)) * 100)}%
            </span>
          </ScorePill>
        </div>

        <ProgressBar>
          <span style={{ width: `${(score.correct / Math.max(1, score.total)) * 100}%` }} />
        </ProgressBar>
      </ResultHeader>

      <ResultBody>
        {score.wrong.length ? (
          <>
            <WrongTitle>Wrong Review</WrongTitle>

            <WrongList>
              {score.wrong.map((w) => {
                const hasExp = !!(w.explanation && String(w.explanation).trim());
                return (
                  <WrongCard key={w.id}>
                    <div className="q">
                      <span className="qno">Q{w.qNo}.</span>
                      <span className="qtext">{w.question}</span>
                    </div>

                    <div className="chips">
                      <Chip $tone="your">Your: {w.picked}</Chip>
                      <Chip $tone="correct">Correct: {w.answer}</Chip>
                    </div>

                    {/* ✅ explanation 아코디언 */}
                    {hasExp ? (
                      <Accordion>
                        <AccSummary>
                          <span>Explanation</span>
                          <span className="hint">tap to {/**/}expand</span>
                        </AccSummary>
                        <AccBody>{w.explanation}</AccBody>
                      </Accordion>
                    ) : (
                      <NoExp>설명이 아직 없어요.</NoExp>
                    )}
                  </WrongCard>
                );
              })}
            </WrongList>
          </>
        ) : (
          <Perfect>Perfect! ✅</Perfect>
        )}
      </ResultBody>

      {/* ✅ 하단 버튼 sticky + bottom tab safe area */}
      <ResultBtns>
        <Btn onClick={() => setShowResult(false)}>Close</Btn>
        <BtnPrimary onClick={() => nav(-1)}>Exit</BtnPrimary>
      </ResultBtns>
    </ResultModal>
  </ResultOverlay>
) : null}
    </Wrap>
  );
}

/* ================= styles ================= */

/* ================= styles (ETS Patch) ================= */

const Wrap = styled.div`
  padding: 18px 16px 90px;

  @media (max-width: 768px) {
    padding: 14px 10px 90px;
  }
  @media (max-width: 520px) {
    padding: 10px 6px 90px;
  }
`;

const Top = styled.div`
  display: grid;
  grid-template-columns: 92px 1fr 92px;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;

  @media (max-width: 520px) {
    grid-template-columns: 1fr auto;
    grid-template-areas:
      "back counter"
      "title title";
    row-gap: 8px;
    margin-bottom: 8px;
  }
`;

const BackBtn = styled.button`
  height: 36px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid rgba(17, 24, 39, 0.14);
  background: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  font-weight: 800;
  letter-spacing: -0.2px;

  &:hover {
    background: #fff;
  }

  @media (max-width: 520px) {
    grid-area: back;
    justify-self: start;
  }
`;

const Title = styled.div`
  font-weight: 950;
  letter-spacing: -0.25px;
  text-align: center;
  white-space: normal;
  line-height: 1.22;
  font-size: clamp(14px, 3.6vw, 18px);
  color: #111827;

  @media (max-width: 520px) {
    grid-area: title;
    text-align: left;
    padding: 0 2px;
  }

  b {
    font-weight: 950;
  }
`;

const Counter = styled.div`
  text-align: right;
  opacity: 0.72;
  font-weight: 900;
  color: #111827;

  @media (max-width: 520px) {
    grid-area: counter;
    font-size: 12px;
  }
`;

/**
 * 데스크톱: 문제(420) + 지문(나머지)
 * 모바일: 지문(위) + 문제(아래)
 */
const Grid = styled.div`
  display: flex;
  gap: 14px;
  align-items: stretch;

  .left {
    width: 420px;
    flex: 0 0 420px;
  }

  .right {
    flex: 1;
    min-width: 0;
  }

  @media (max-width: 980px) {
    flex-direction: column;
    gap: 10px;

    .right {
      order: 1;
    }
    .left {
      order: 2;
      width: 100%;
      flex: 0 0 auto;
    }
  }

  @media (max-width: 520px) {
    gap: 8px;
  }
`;

const LeftCard = styled.div`
  border-radius: 14px;
  border: 1px solid rgba(17, 24, 39, 0.12);
  background: #fff;
  overflow: hidden;
  box-shadow: 0 1px 0 rgba(17, 24, 39, 0.04);

  @media (max-width: 520px) {
    border-radius: 12px;
  }
`;

const RightCard = styled.div`
  min-width: 0;
`;

const NavBtn = styled.button`
  height: 32px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid rgba(17, 24, 39, 0.14);
  background: rgba(255, 255, 255, 0.92);
  cursor: pointer;
  font-weight: 850;
  letter-spacing: -0.2px;
  color: #111827;

  &:hover {
    background: #fff;
  }

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.45;
    cursor: default;
    transform: none;
  }
`;

const Empty = styled.div`
  padding: 18px;
  opacity: 0.75;
  color: #111827;
  font-weight: 800;
`;

/* ✅ Result modal: 모바일 스크롤 + bottom tab 안 가림 */
const ResultOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(6px);
  display: grid;
  place-items: center;
  z-index: 1000;

  /* ✅ 모바일 safe-area + bottom tab 고려 */
  padding: 14px 14px calc(14px + env(safe-area-inset-bottom));
`;

const ResultModal = styled.div`
  width: min(780px, calc(100vw - 24px));
  max-height: min(82vh, 760px);
  background: #fff;
  border-radius: 22px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 30px 90px rgba(0, 0, 0, 0.35);

  display: flex;
  flex-direction: column;
  overflow: hidden; /* ✅ 바디만 스크롤 */
`;

const ResultHeader = styled.div`
  padding: 16px 16px 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  background: linear-gradient(180deg, rgba(59, 130, 246, 0.10), rgba(255, 255, 255, 0));

  .topRow {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: flex-start;
  }

  h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 950;
    letter-spacing: -0.2px;
    color: #0f172a;
  }

  p {
    margin: 6px 0 0;
    opacity: 0.78;
    font-weight: 850;
    font-size: 13px;
    color: #0f172a;
  }
`;

const ScorePill = styled.div`
  flex: 0 0 auto;
  border-radius: 16px;
  padding: 10px 12px;
  border: 1px solid rgba(0, 0, 0, 0.10);
  background: rgba(255, 255, 255, 0.92);

  .label {
    display: block;
    font-size: 11px;
    font-weight: 950;
    opacity: 0.6;
    letter-spacing: 0.12em;
  }

  .val {
    display: block;
    margin-top: 4px;
    font-size: 18px;
    font-weight: 950;
    color: #0f172a;
  }
`;

const ProgressBar = styled.div`
  margin-top: 12px;
  height: 10px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.08);
  overflow: hidden;

  span {
    display: block;
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, rgba(59, 130, 246, 0.95), rgba(16, 185, 129, 0.95));
  }
`;

const ResultBody = styled.div`
  flex: 1;
  min-height: 0;
  overflow: auto;

  padding: 14px 16px 8px;
`;

const WrongTitle = styled.div`
  font-weight: 950;
  font-size: 16px;
  margin-bottom: 10px;
  color: #0f172a;
`;

const WrongList = styled.div`
  display: grid;
  gap: 12px;
  padding-bottom: 14px;
`;

const WrongCard = styled.div`
  border: 1px solid rgba(15, 23, 42, 0.10);
  border-radius: 14px;
  padding: 12px;
  background: rgba(15, 23, 42, 0.02);

  .q {
    display: flex;
    gap: 6px;
    line-height: 1.35;
    color: #0f172a;
  }

  .qno {
    font-weight: 950;
    flex: 0 0 auto;
  }

  .qtext {
    font-weight: 900;
  }

  .chips {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 8px;
  }
`;

/* ✅ Chip (에러 원인 해결) */
const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  font-weight: 900;
  font-size: 12px;
  letter-spacing: -0.1px;

  border: 1px solid rgba(15, 23, 42, 0.12);

  ${({ $tone }) =>
    $tone === "correct"
      ? `
    background: rgba(16, 185, 129, 0.10);
    color: rgba(15, 23, 42, 0.95);
  `
      : `
    background: rgba(59, 130, 246, 0.10);
    color: rgba(15, 23, 42, 0.95);
  `}
`;

/* ✅ Accordion: details/summary (모바일 최강, 구현 단순) */
const Accordion = styled.details`
  margin-top: 10px;
  border-radius: 12px;
  border: 1px solid rgba(15, 23, 42, 0.10);
  background: #fff;
  overflow: hidden;

  /* 열렸을 때 살짝 강조 */
  &[open] {
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
  }
`;

const AccSummary = styled.summary`
  list-style: none;
  cursor: pointer;
  user-select: none;

  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;

  padding: 10px 12px;
  font-weight: 950;
  color: #0f172a;

  /* 기본 화살표 제거 */
  &::-webkit-details-marker {
    display: none;
  }

  .hint {
    font-size: 12px;
    font-weight: 850;
    opacity: 0.65;
  }
`;

const AccBody = styled.div`
  padding: 10px 12px 12px;
  border-top: 1px solid rgba(15, 23, 42, 0.08);
  line-height: 1.55;
  color: rgba(15, 23, 42, 0.82);
  font-weight: 750;
  white-space: pre-wrap;
`;

const NoExp = styled.div`
  margin-top: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.03);
  border: 1px solid rgba(15, 23, 42, 0.08);
  color: rgba(15, 23, 42, 0.72);
  font-weight: 850;
`;

const Perfect = styled.div`
  margin-top: 14px;
  padding: 12px;
  border-radius: 12px;
  background: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(15, 23, 42, 0.10);
  font-weight: 950;
  color: #0f172a;
`;

/* ✅ sticky 버튼: bottom tab에 절대 안 짤림 */
const ResultBtns = styled.div`
  position: sticky;
  bottom: 0;
  padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  border-top: 1px solid rgba(15, 23, 42, 0.08);

  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const Btn = styled.button`
  height: 40px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid rgba(15, 23, 42, 0.14);
  background: rgba(255, 255, 255, 0.92);
  cursor: pointer;
  font-weight: 900;
  color: #0f172a;

  &:hover {
    background: #fff;
  }
`;

const BtnPrimary = styled(Btn)`
  background: #0f172a;
  color: #fff;
  border-color: rgba(15, 23, 42, 0.9);

  &:hover {
    filter: brightness(1.05);
  }
`;


const ProgressText = styled.div`
  margin-left: auto;   /* ⭐ 핵심 */
  font-weight: 800;
  opacity: 0.7;
  padding: 0 4px;
`;