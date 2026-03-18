// src/pages/AcademicSet.jsx
import { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import styled from "styled-components";

import { ACADEMIC_BANK } from "../data/reading/academic";
import DocFrame from "../components/reading/DocFrame";
import QuestionPanel from "../components/reading/QuestionPanel";
import HighlightedPassage from "../components/reading/HighlightedPassage";

const LS_ACADEMIC_PROGRESS = "academic_progress_v1";

/* ================= util ================= */
function safeParse(raw, fallback) {
  try {
    const v = JSON.parse(raw);
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

function saveProgressForSet(setId, done, total, correct) {
  const saved = safeParse(localStorage.getItem(LS_ACADEMIC_PROGRESS), {});
  saved[setId] = { done, total, correct };
  localStorage.setItem(LS_ACADEMIC_PROGRESS, JSON.stringify(saved));
}

function toSafeIndex(v, maxLen) {
  const n = Number(v);
  if (!Number.isFinite(n)) return 0;
  if (!maxLen) return 0;
  return Math.max(0, Math.min(maxLen - 1, Math.floor(n)));
}

const SLOT_TO_LETTER = ["A", "B", "C", "D"];

function normalizeQuestions(setId, rawQuestions) {
  const qs = Array.isArray(rawQuestions) ? rawQuestions : [];

  return qs.map((q, idx) => {
    const id = q?.id ?? `${setId}_q${idx + 1}`;
    const qNo = q?.qNo ?? q?.no ?? idx + 1;

    return {
      id,
      qNo,
      question: q?.question ?? q?.q ?? "",
      options: q?.options ?? { A: "", B: "", C: "", D: "" },
      answer: q?.answer ?? "A",
      explanation: q?.explanation ?? q?.explain ?? "",

      // ✅ additional meta
      type: q?.type ?? q?.questionType ?? "",
      highlight: q?.highlight ?? null,
      paragraph: q?.paragraph ?? q?.para ?? null,

      // ✅ insertion support
      insertSentence: q?.insertSentence ?? q?.insert ?? "",
    };
  });
}

/* ================= component ================= */
export default function AcademicSet() {
  const nav = useNavigate();
  const { typeKey } = useParams();
  const [sp] = useSearchParams();

  const type = String(typeKey || "").toLowerCase();

  const items = useMemo(() => {
    const list = ACADEMIC_BANK?.[type] || [];
    return Array.isArray(list) ? list : [];
  }, [type]);

  const iRaw = sp.get("i");
  const safeI = useMemo(() => toSafeIndex(iRaw ?? 0, items.length), [iRaw, items.length]);

  const item = items[safeI];

  const questions = useMemo(() => {
    const setId = item?.id ?? `${type}_${safeI}`;
    return normalizeQuestions(setId, item?.questions);
  }, [item, type, safeI]);

  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    setQIdx(0);
    setAnswers({});
    setShowResult(false);
  }, [type, safeI]);

  const currentQ = questions[qIdx];
  const totalQs = questions.length;
  const isLastQ = qIdx >= totalQs - 1;

  const onSelect = (choice) => {
    if (!currentQ) return;
    setAnswers((prev) => ({ ...prev, [currentQ.id]: choice }));
  };

  // ✅ passage square click -> auto pick A/B/C/D
  const onPickInsertionSlot = (slotIndex) => {
    if (!currentQ) return;
    const letter = SLOT_TO_LETTER[slotIndex] || "A";
    onSelect(letter);
  };

  const goPrevQ = () => setQIdx((p) => Math.max(0, p - 1));

  const score = useMemo(() => {
    let correct = 0;
    let done = 0;
    const wrong = [];

    for (const q of questions) {
      const picked = answers[q.id];
      if (!picked) continue;
      done++;
      if (picked === q.answer) correct++;
      else wrong.push({ ...q, picked });
    }

    return { correct, total: questions.length, done, wrong };
  }, [questions, answers]);

  useEffect(() => {
  if (!showResult) return;

  const prev = document.body.style.overflow;
  document.body.style.overflow = "hidden";

  return () => {
    document.body.style.overflow = prev;
  };
}, [showResult]);

  useEffect(() => {
    if (!item?.id) return;
    saveProgressForSet(item.id, score.done, score.total, score.correct);
  }, [item, score.done, score.total, score.correct]);

  const goNextOrFinish = () => {
    if (!currentQ) return;
    if (!answers[currentQ.id]) return;

    if (!isLastQ) setQIdx((p) => p + 1);
    else setShowResult(true);
  };

  const resetSet = () => {
    setQIdx(0);
    setAnswers({});
    setShowResult(false);
    if (item?.id) saveProgressForSet(item.id, 0, questions.length, 0);
  };

  const prettyType =
    {
      detail: "Detail",
      inference: "Inference",
      purpose: "Purpose/Function",
      vocabulary: "Vocabulary",
      summary: "Summary",
      mixed: "MIXED",
    }[type] || type.toUpperCase();

  /* ================= passages (supports up to 3) ================= */
  const passages = useMemo(() => {
    if (!item) return [];

    const arr = [];

    const p1 = item?.passage ?? item?.text ?? item?.content ?? "";
    if (p1) {
      arr.push({
        key: "p1",
        label: "Passage 1",
        title: item?.passageTitle ?? "Passage 1",
        text: Array.isArray(p1) ? p1.join("\n") : String(p1),
      });
    }

    const p2 = item?.passage2 ?? "";
    if (p2) {
      arr.push({
        key: "p2",
        label: "Passage 2",
        title: item?.passage2Title ?? "Passage 2",
        text: Array.isArray(p2) ? p2.join("\n") : String(p2),
      });
    }

    const p3 = item?.passage3 ?? "";
    if (p3) {
      arr.push({
        key: "p3",
        label: "Passage 3",
        title: item?.passage3Title ?? "Passage 3",
        text: Array.isArray(p3) ? p3.join("\n") : String(p3),
      });
    }

    return arr;
  }, [item]);

  // ✅ default rule (no passageIndex in data):
  // 1~5 => p1, 6~10 => p2, 11~15 => p3
  const passageIndex = useMemo(() => {
    const qNumber = currentQ?.qNo ?? 1;
    const idx = Math.floor((qNumber - 1) / 5); // 0,1,2...
    const maxIdx = Math.max(0, passages.length - 1);
    return Math.max(0, Math.min(maxIdx, idx));
  }, [currentQ?.qNo, passages.length]);

  const currentPassage = passages[passageIndex] ?? {
    label: "Passage",
    title: "Passage",
    text: "",
  };

  // ✅ highlight: pass through + paragraph fallback
  const finalHighlight = useMemo(() => {
    const hl = currentQ?.highlight ? currentQ.highlight : null;
    if (!hl) return null;
    if (hl.paragraph == null && currentQ?.paragraph != null) {
      return { ...hl, paragraph: currentQ.paragraph };
    }
    return hl;
  }, [currentQ]);

const t = String(currentQ?.type || "").toLowerCase();
const isInsertion = t === "insertion" || t === "insert";

  return (
    <Wrap>
      <Top>
        <BackBtn onClick={() => nav(-1)}>← EXIT</BackBtn>
        <Title>
          Read an Academic Passage · {prettyType} · <b>Set {safeI + 1}</b>
        </Title>
        <Counter>
          {qIdx + 1} / {totalQs}
        </Counter>
      </Top>

      <Grid>
        {/* Passage */}
        <RightCard className="right">
          <DocFrame
            headerLeft="TOEFL iBT READING"
            headerRight={`[${String(safeI + 1).padStart(2, "0")}] Academic · ${prettyType}`}
            footerLeft={`Progress: ${score.done}/${score.total}`}
            footerRight={
              <>
                <NavBtn onClick={() => setShowResult(true)}>Result</NavBtn>
                <NavBtn onClick={resetSet}>Reset</NavBtn>
              </>
            }
          >
            <PassageWrap>
              <PassageTitle>
                <span className="label">{currentPassage.label}</span>
                <span className="title">{currentPassage.title}</span>
              </PassageTitle>

              <HighlightedPassage
                text={currentPassage.text}
                highlight={finalHighlight}
                insertion={
                  isInsertion
                    ? {
                        enabled: true,
                        selectedIndex: answers[currentQ?.id]
                          ? SLOT_TO_LETTER.indexOf(answers[currentQ.id])
                          : null,
                        onSelectIndex: onPickInsertionSlot,
                        previewSentence: currentQ?.insertSentence || "",
                      }
                    : { enabled: false }
                }
              />
            </PassageWrap>
          </DocFrame>
        </RightCard>

        {/* Question */}
        <LeftCard className="left">
          <QuestionPanel
            docType="academic"
            docTitle={item?.title}
            docIndex={safeI + 1}
            docTotal={items.length}
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
            insertionSentence={currentQ?.insertSentence || ""}
          />
        </LeftCard>
      </Grid>

     {showResult && item ? (
  <ResultOverlay onClick={() => setShowResult(false)}>
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
          <span
            style={{
              width: `${(score.correct / Math.max(1, score.total)) * 100}%`,
            }}
          />
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

                    {hasExp ? (
                      <Accordion>
                        <AccSummary>
                          <span>Explanation</span>
                          <span className="hint">tap to expand</span>
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
/* ================= styles ================= */
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

  /* ETS 느낌: 카드가 너무 둥글지 않게 + 깔끔 */
  box-shadow: 0 1px 0 rgba(17, 24, 39, 0.04);

  @media (max-width: 520px) {
    border-radius: 12px;
  }
`;

const RightCard = styled.div`
  min-width: 0;

  /* DocFrame 자체가 카드면 중복 그림자/테두리 안 겹치게 */
  .docframe {
    border-radius: 14px;
  }
`;

const PassageWrap = styled.div`
  padding: 18px 18px 20px;

  @media (max-width: 768px) {
    padding: 14px 12px 18px;
  }

  @media (max-width: 520px) {
    padding: 12px 10px 16px;
  }
`;

const PassageTitle = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin-bottom: 10px; /* 12 -> 10 */

  .label {
    font-weight: 700;          /* 950 -> 700 */
    font-size: 11px;
    padding: 3px 10px;
    border-radius: 999px;
    border: 1px solid rgba(17, 24, 39, 0.14);
    background: rgba(17, 24, 39, 0.03);
    color: rgba(17, 24, 39, 0.9);
    letter-spacing: 0.12em;    /* ETS 느낌 */
  }

  .title {
font-family: "Arial Black", Arial, Helvetica, sans-serif;
  font-weight: 900;
-webkit-text-stroke: 0.2px rgba(17,24,39,0.35); /* 선택: 더 진해 보임 */
  font-size: 18px;
}

  @media (max-width: 520px) {
    margin-bottom: 8px;

    .title {
      font-size: 17px;
      line-height: 1.22;
    }
  }
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
`;





/* Result modal */
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
  background: linear-gradient(
    180deg,
    rgba(59, 130, 246, 0.10),
    rgba(255, 255, 255, 0)
  );

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
    background: linear-gradient(
      90deg,
      rgba(59, 130, 246, 0.95),
      rgba(16, 185, 129, 0.95)
    );
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

const Accordion = styled.details`
  margin-top: 10px;
  border-radius: 12px;
  border: 1px solid rgba(15, 23, 42, 0.10);
  background: #fff;
  overflow: hidden;

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
