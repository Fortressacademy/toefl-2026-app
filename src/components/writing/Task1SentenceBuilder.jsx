// src/components/writing/Task1SentenceBuilder.jsx
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useDroppable,
  useDraggable,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

/* ================= utils ================= */
function normSpaces(s) {
  return String(s ?? "").replace(/\s+/g, " ").trim();
}

function joinForSentence(parts, filled) {
  let bi = 0;
  const out = [];

  for (const p of parts) {
    if (p.t === "text") out.push(p.v);
    else {
      out.push(filled[bi] || "_____");
      bi += 1;
    }
  }

  return out
    .join(" ")
    .replace(/\s+([?.!,;:])/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function countBlanks(parts) {
  return parts.filter((p) => p.t === "blank").length;
}

function getBlankDropId(idx) {
  return `blank:${idx}`;
}
function parseBlankDropId(id) {
  const s = String(id || "");
  if (!s.startsWith("blank:")) return null;
  const n = Number(s.slice("blank:".length));
  return Number.isFinite(n) ? n : null;
}

const BANK_DROP_ID = "bank";

function shuffleArray(arr) {
  const a = [...(arr || [])];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function formatMMSS(sec) {
  const s = Math.max(0, Math.floor(sec || 0));
  return `${pad2(Math.floor(s / 60))}:${pad2(s % 60)}`;
}

/* ================= component ================= */

export default function Task1SentenceBuilder({
  items,
  value,
  onChange,
  timeLeft,
}) {
  return (
    <Wrap>
      {(items || []).map((it) => (
        <ExamCard key={it.no}>
          <ExamTopBar>
            <TopBarLeft>
              <ExamBrand>TOEFL iBT</ExamBrand>
              <QuestionBadge>Q {String(it.no).padStart(2, "0")}</QuestionBadge>
            </TopBarLeft>

            <ExamTopBtns>
              <TopTimer>{formatMMSS(timeLeft)}</TopTimer>

              <MiniBtn type="button" disabled>
                Back
              </MiniBtn>
              <MiniBtn type="button" disabled>
                Next
              </MiniBtn>
            </ExamTopBtns>
          </ExamTopBar>

          <ExamBody>
            <ExamContent>
              <TitleRow>
                <QuestionNo>{String(it.no).padStart(2, "0")}</QuestionNo>
                <ExamTitleWrap>
                  <ExamTitle>Make an appropriate sentence.</ExamTitle>
                  <ExamSubTitle>
                    Drag the words into the blanks to complete the response.
                  </ExamSubTitle>
                </ExamTitleWrap>
              </TitleRow>

              <DndBuilder
                no={it.no}
                promptTop={it.promptTop}
                parts={it.parts}
                wordBank={it.wordBank || []}
                value={value?.[it.no]}
                onSentence={(s) => onChange(it.no, s)}
              />
            </ExamContent>
          </ExamBody>
        </ExamCard>
      ))}
    </Wrap>
  );
}

function DndBuilder({ no, promptTop, parts, wordBank, onSentence }) {
  const blankCount = useMemo(() => countBlanks(parts), [parts]);

  const shuffledWordBank = useMemo(() => shuffleArray(wordBank), [no, wordBank]);

  const tokens = useMemo(
    () => shuffledWordBank.map((text, i) => ({ id: `${no}_tok_${i}`, text })),
    [shuffledWordBank, no]
  );

  const [placed, setPlaced] = useState(() => Array(blankCount).fill(null));

  useEffect(() => {
    setPlaced(Array(blankCount).fill(null));
  }, [blankCount]);

  const tokenMap = useMemo(() => {
    const m = new Map();
    tokens.forEach((t) => m.set(t.id, t.text));
    return m;
  }, [tokens]);

  const usedIds = useMemo(() => new Set(placed.filter(Boolean)), [placed]);

  const availableTokens = useMemo(
    () => tokens.filter((t) => !usedIds.has(t.id)),
    [tokens, usedIds]
  );

  const filledTexts = useMemo(
    () => placed.map((id) => (id ? tokenMap.get(id) || "" : "")),
    [placed, tokenMap]
  );

  const builtSentence = useMemo(
    () => joinForSentence(parts, filledTexts),
    [parts, filledTexts]
  );

  useEffect(() => {
    const clean = normSpaces(builtSentence.replace(/_____+/g, ""));
    onSentence(clean);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [builtSentence]);

  const reset = () => setPlaced(Array(blankCount).fill(null));

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 120, tolerance: 8 },
    })
  );

  const [activeTokenId, setActiveTokenId] = useState(null);
  const activeTokenText = activeTokenId ? tokenMap.get(activeTokenId) : "";

  const findTokenBlankIndex = (tokenId, arr) =>
    arr.findIndex((x) => x === tokenId);

  const onDragStart = (event) => {
    const id = event.active?.id;
    setActiveTokenId(id ? String(id) : null);
  };

  const onDragCancel = () => setActiveTokenId(null);

  const onDragEnd = (event) => {
    const activeId = String(event.active?.id || "");
    const overId = event.over?.id ? String(event.over.id) : "";
    setActiveTokenId(null);
    if (!activeId) return;

    if (overId === BANK_DROP_ID) {
      setPlaced((prev) => {
        const next = [...prev];
        const fromIdx = findTokenBlankIndex(activeId, next);
        if (fromIdx !== -1) next[fromIdx] = null;
        return next;
      });
      return;
    }

    const targetBlank = parseBlankDropId(overId);
    if (targetBlank == null) return;

    setPlaced((prev) => {
      const next = [...prev];
      const fromIdx = findTokenBlankIndex(activeId, next);
      const targetToken = next[targetBlank];

      if (fromIdx === -1) {
        next[targetBlank] = activeId;
        return next;
      }

      if (fromIdx === targetBlank) return prev;

      next[targetBlank] = activeId;
      next[fromIdx] = targetToken || null;
      return next;
    });
  };

  return (
    <Inner>
      <UtilityRow>
        <ResetBtn type="button" onClick={reset}>
          Reset
        </ResetBtn>
      </UtilityRow>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={onDragStart}
        onDragCancel={onDragCancel}
        onDragEnd={onDragEnd}
      >
        <DialogueBlock>
          <SpeakerRow>
            <Avatar>A</Avatar>
            <SpeakerBubble>{promptTop}</SpeakerBubble>
          </SpeakerRow>

          <SpeakerRow>
            <Avatar>B</Avatar>
            <ComposerWrap>
              <SentenceComposer
                parts={parts}
                placed={placed}
                tokenMap={tokenMap}
              />
            </ComposerWrap>
          </SpeakerRow>
        </DialogueBlock>

        <WordBankSection>
          <WordBankTitle>Word Bank</WordBankTitle>

          <WordBankWrap>
            <DroppableBank>
              <WordBankLine>
                {availableTokens.map((t, idx) => (
                  <DraggableToken
                    key={`${t.id}_${idx}`}
                    id={t.id}
                    text={t.text}
                    disabled={false}
                    placedStyle={false}
                  />
                ))}
              </WordBankLine>

              {availableTokens.length === 0 && (
                <EmptyBank>
                  모든 단어를 사용했습니다. 빈칸의 단어를 아래 영역으로 드래그하면 다시 돌아옵니다.
                </EmptyBank>
              )}
            </DroppableBank>
          </WordBankWrap>
        </WordBankSection>

        <DragOverlay dropAnimation={null}>
          {activeTokenId ? <OverlayTok>{activeTokenText}</OverlayTok> : null}
        </DragOverlay>
      </DndContext>
    </Inner>
  );
}

function SentenceComposer({ parts, placed, tokenMap }) {
  let bi = 0;

  return (
    <ComposerLine>
      {parts.map((p, idx) => {
        if (p.t === "text") {
          return <FixedText key={`t_${idx}`}>{p.v}</FixedText>;
        }

        const blankIndex = bi;
        const tokenId = placed[blankIndex];
        const tokenText = tokenId ? tokenMap.get(tokenId) : "";
        bi += 1;

        return (
          <DroppableBlank key={`b_${idx}`} blankIndex={blankIndex}>
            {tokenId ? (
              <DraggableToken
                id={tokenId}
                text={tokenText}
                disabled={false}
                placedStyle
              />
            ) : (
              <BlankGuide />
            )}
          </DroppableBlank>
        );
      })}
    </ComposerLine>
  );
}

/* ================= dnd-kit wrappers ================= */

function DroppableBlank({ blankIndex, children }) {
  const id = getBlankDropId(blankIndex);
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <BlankSlot ref={setNodeRef} data-over={isOver ? "1" : "0"}>
      {children}
    </BlankSlot>
  );
}

function DroppableBank({ children }) {
  const { setNodeRef, isOver } = useDroppable({ id: BANK_DROP_ID });

  return (
    <BankDrop ref={setNodeRef} data-over={isOver ? "1" : "0"}>
      {children}
    </BankDrop>
  );
}

function DraggableToken({ id, text, disabled, placedStyle = false }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
      disabled,
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.25 : 1,
  };

  return (
    <TokBtn
      ref={setNodeRef}
      type="button"
      style={style}
      data-disabled={disabled ? "1" : "0"}
      data-placed={placedStyle ? "1" : "0"}
      disabled={disabled}
      {...listeners}
      {...attributes}
      title={disabled ? "이미 사용중" : "드래그"}
    >
      {text}
    </TokBtn>
  );
}

/* ================= styles ================= */

const Wrap = styled.div`
  display: grid;
  gap: 14px;
`;

const ExamCard = styled.div`
  width: 100%;
  max-width: 1040px;
  margin: 0 auto;
  background: #f8f9fb;
  border: 1px solid #d7dde5;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);

  @media (max-width: 640px) {
    border-radius: 16px;
  }
`;

const ExamTopBar = styled.div`
  min-height: 58px;
  background: #8f98a3;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  @media (max-width: 640px) {
    align-items: flex-start;
    flex-direction: column;
    padding: 12px 12px 10px;
  }
`;

const TopBarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`;

const ExamBrand = styled.div`
  color: #ffffff;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 0.04em;
`;

const QuestionBadge = styled.div`
  display: none;

  @media (max-width: 640px) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 28px;
    padding: 0 10px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.18);
    color: #ffffff;
    font-size: 12px;
    font-weight: 800;
  }
`;

const ExamTopBtns = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;

  @media (max-width: 640px) {
    width: 100%;
    justify-content: space-between;
    gap: 8px;
  }
`;

const MiniBtn = styled.button`
  min-width: 64px;
  height: 34px;
  border: 1px solid rgba(255, 255, 255, 0.45);
  background: transparent;
  color: #ffffff;
  font-size: 13px;
  border-radius: 10px;
  cursor: default;
  opacity: 0.95;

  @media (max-width: 640px) {
    min-width: 58px;
    height: 32px;
    font-size: 12px;
  }
`;

const TopTimer = styled.div`
  min-width: 78px;
  height: 34px;
  padding: 0 12px;
  border: 1px solid rgba(255, 255, 255, 0.45);
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 0.02em;
  border-radius: 10px;

  @media (max-width: 640px) {
    flex: 1;
    justify-content: center;
    min-width: 0;
  }
`;

const ExamBody = styled.div`
  padding: 34px 36px 30px;
  background: #fbfbfc;

  @media (max-width: 640px) {
    padding: 18px 14px 18px;
  }
`;

const ExamContent = styled.div`
  min-width: 0;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 640px) {
    gap: 10px;
    margin-bottom: 18px;
  }
`;

const QuestionNo = styled.div`
  font-size: 42px;
  font-weight: 900;
  color: #2b6cff;
  min-width: 58px;
  line-height: 1;

  @media (max-width: 640px) {
    display: none;
  }
`;

const ExamTitleWrap = styled.div`
  min-width: 0;
`;

const ExamTitle = styled.h2`
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  color: #222;
  letter-spacing: -0.02em;

  @media (max-width: 640px) {
    font-size: 22px;
    line-height: 1.25;
  }
`;

const ExamSubTitle = styled.p`
  margin: 6px 0 0;
  color: rgba(34, 34, 34, 0.62);
  font-size: 14px;
  line-height: 1.5;

  @media (max-width: 640px) {
    font-size: 13px;
  }
`;

const Inner = styled.div`
  display: grid;
  gap: 18px;

  @media (max-width: 640px) {
    gap: 14px;
  }
`;

const UtilityRow = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ResetBtn = styled.button`
  height: 36px;
  padding: 0 14px;
  border: 1px solid #cfd6de;
  background: #ffffff;
  color: #444;
  font-size: 13px;
  font-weight: 700;
  border-radius: 10px;
  cursor: pointer;

  &:active {
    transform: translateY(1px);
  }
`;

const DialogueBlock = styled.div`
  display: grid;
  gap: 18px;
`;

const SpeakerRow = styled.div`
  display: grid;
  grid-template-columns: 46px 1fr;
  gap: 14px;
  align-items: start;

  @media (max-width: 640px) {
    grid-template-columns: 38px 1fr;
    gap: 10px;
  }
`;

const Avatar = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #cfd6de;
  color: #334155;
  display: grid;
  place-items: center;
  font-size: 20px;
  font-weight: 700;
  font-family: Georgia, serif;

  @media (max-width: 640px) {
    width: 34px;
    height: 34px;
    font-size: 16px;
  }
`;

const SpeakerBubble = styled.div`
  padding-top: 4px;
  color: #1f2937;
  font-size: 20px;
  line-height: 1.7;
  word-break: keep-all;

  @media (max-width: 640px) {
    font-size: 16px;
    line-height: 1.65;
  }
`;

const ComposerWrap = styled.div`
  min-width: 0;
  padding-top: 4px;
`;

const ComposerLine = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 10px 8px;
  min-height: 64px;

  @media (max-width: 640px) {
    gap: 8px 6px;
    min-height: 54px;
  }
`;

const FixedText = styled.span`
  color: #222;
  font-size: 20px;
  line-height: 1.7;
  white-space: pre-wrap;
  word-break: keep-all;

  @media (max-width: 640px) {
    font-size: 16px;
    line-height: 1.65;
  }
`;

const BlankSlot = styled.div`
  min-width: 110px;
  min-height: 40px;
  border-bottom: 2px solid #666;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 6px 4px;
  transition: box-shadow 0.12s ease, border-color 0.12s ease, background 0.12s ease;

  &[data-over="1"] {
    border-bottom-color: #2a84ff;
    background: rgba(42, 132, 255, 0.06);
    box-shadow: inset 0 -2px 0 #2a84ff;
  }

  @media (max-width: 640px) {
    min-width: 78px;
    min-height: 34px;
    padding: 0 4px 3px;
  }
`;

const BlankGuide = styled.div`
  width: 100%;
  height: 1px;
`;

const WordBankSection = styled.div`
  margin-top: 6px;
`;

const WordBankTitle = styled.div`
  margin-bottom: 8px;
  color: #111827;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.02em;
`;

const WordBankWrap = styled.div``;

const BankDrop = styled.div`
  min-height: 72px;
  padding: 10px 10px 6px;
  border-radius: 14px;
  background: #f3f5f8;
  border: 1px solid #e3e8ef;
  transition: box-shadow 0.12s ease, background 0.12s ease, border-color 0.12s ease;

  &[data-over="1"] {
    background: rgba(255, 106, 0, 0.05);
    box-shadow: inset 0 0 0 2px rgba(255, 106, 0, 0.18);
    border-color: rgba(255, 106, 0, 0.2);
  }

  @media (max-width: 640px) {
    min-height: 64px;
    padding: 8px 8px 4px;
    border-radius: 12px;
  }
`;

const WordBankLine = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px 8px;
  align-items: center;
  min-height: 40px;

  @media (max-width: 640px) {
    gap: 8px 6px;
  }
`;

const TokBtn = styled.button`
  min-height: 38px;
  padding: 4px 10px;
  border: ${({ "data-placed": placed }) =>
    placed === "1" ? "none" : "1px solid #d5d9de"};
  border-radius: ${({ "data-placed": placed }) =>
    placed === "1" ? "0" : "10px"};
  background: ${({ "data-placed": placed }) =>
    placed === "1" ? "transparent" : "#ffffff"};

  color: #222;
  font-size: 18px;
  line-height: 1.4;
  font-weight: 500;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  cursor: grab;
  user-select: none;
  touch-action: none;
  white-space: nowrap;
  box-shadow: ${({ "data-placed": placed }) =>
    placed === "1" ? "none" : "0 1px 2px rgba(15, 23, 42, 0.04)"};

  &:active {
    cursor: grabbing;
  }

  &:disabled,
  &[data-disabled="1"] {
    opacity: 0.35;
    cursor: not-allowed;
  }

  @media (max-width: 640px) {
    min-height: 36px;
    font-size: 15px;
    padding: 4px 8px;
    border-radius: ${({ "data-placed": placed }) =>
      placed === "1" ? "0" : "9px"};
  }
`;

const OverlayTok = styled.div`
  min-height: 38px;
  padding: 4px 10px;
  border: 1px solid #d5d9de;
  border-radius: 10px;
  background: #ffffff;
  color: #222;
  font-size: 18px;
  line-height: 1.4;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  box-shadow: 0 14px 32px rgba(15, 23, 42, 0.18);

  @media (max-width: 640px) {
    font-size: 15px;
    min-height: 36px;
    padding: 4px 8px;
  }
`;

const EmptyBank = styled.div`
  padding-top: 8px;
  color: rgba(34, 34, 34, 0.58);
  font-size: 13px;
  line-height: 1.5;
`;