import { useEffect, useMemo, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";

/**
 * GoalBoard.jsx (대형앱급 UI/UX 리디자인)
 * - 일일/주간 목표 (세그먼트)
 * - 목표 추가: 프리셋(가로 스크롤) + 직접 입력
 * - 체크(완료) / 수정 / 삭제
 * - 정렬: 위/아래 이동(모바일/웹 안정적)
 * - 최대 5개 유지
 * - 로컬스토리지 저장/로드
 * - 완료율/요약/마이크로카피 강화
 */

const LS_DAILY = "fortress_goals_daily_v2";
const LS_WEEKLY = "fortress_goals_weekly_v2";
const MAX = 5;

function safeParse(json, fallback) {
  try {
    const v = JSON.parse(json);
    return Array.isArray(v) ? v : fallback;
  } catch {
    return fallback;
  }
}

function normalizeGoal(text) {
  return (text || "")
    .replace(/\s+/g, " ")
    .replace(/\u00A0/g, " ")
    .trim();
}

function cryptoId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `g_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

function clampGoals(arr) {
  return (Array.isArray(arr) ? arr : []).slice(0, MAX);
}

function startOfWeekMonday(d = new Date()) {
  const date = new Date(d);
  const day = date.getDay(); // 0 Sun ... 6 Sat
  const diff = (day === 0 ? -6 : 1) - day; // Monday 기준
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function formatKoreanDate(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${dd}`;
}

function moveItem(list, from, to) {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export default function GoalBoard() {
  const [mode, setMode] = useState("daily"); // "daily" | "weekly"
  const [input, setInput] = useState("");

  const [dailyGoals, setDailyGoals] = useState([]);
  const [weeklyGoals, setWeeklyGoals] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState("");

  const inputRef = useRef(null);

  // load
  useEffect(() => {
    const d = clampGoals(safeParse(localStorage.getItem(LS_DAILY) || "[]", []));
    const w = clampGoals(safeParse(localStorage.getItem(LS_WEEKLY) || "[]", []));

    // 마이그레이션(혹시 v1 구조 {id,text}로 남아있어도 대응)
    const normalize = (arr) =>
      arr.map((g) => ({
        id: g?.id ?? cryptoId(),
        text: normalizeGoal(g?.text ?? ""),
        done: Boolean(g?.done),
        createdAt: typeof g?.createdAt === "number" ? g.createdAt : Date.now(),
      })).filter((g) => g.text);

    setDailyGoals(clampGoals(normalize(d)));
    setWeeklyGoals(clampGoals(normalize(w)));
  }, []);

  // save
  useEffect(() => {
    localStorage.setItem(LS_DAILY, JSON.stringify(clampGoals(dailyGoals)));
  }, [dailyGoals]);

  useEffect(() => {
    localStorage.setItem(LS_WEEKLY, JSON.stringify(clampGoals(weeklyGoals)));
  }, [weeklyGoals]);

  const goals = mode === "daily" ? dailyGoals : weeklyGoals;
  const setGoals = mode === "daily" ? setDailyGoals : setWeeklyGoals;

  const isFull = goals.length >= MAX;

  const doneCount = useMemo(() => goals.filter((g) => g.done).length, [goals]);
  const progress = useMemo(() => {
    if (goals.length === 0) return 0;
    return Math.round((doneCount / goals.length) * 100);
  }, [doneCount, goals.length]);

  const labelPeriod = useMemo(() => {
    if (mode === "daily") return `오늘 · ${formatKoreanDate(new Date())}`;
    const s = startOfWeekMonday(new Date());
    const e = new Date(s);
    e.setDate(s.getDate() + 6);
    return `이번 주 · ${formatKoreanDate(s)} ~ ${formatKoreanDate(e)}`;
  }, [mode]);

  const presets = useMemo(
    () => [
      { id: "vocab20", label: "Vocab 20", emoji: "🧠", value: "Vocab 20" },
      { id: "read1", label: "Reading 1 passage", emoji: "📘", value: "Reading 1 passage" },
      { id: "listen1", label: "Listening 1 set", emoji: "🎧", value: "Listening 1 set" },
      { id: "speakP3", label: "Speaking Part 3", emoji: "🗣️", value: "Speaking Part 3" },
      { id: "writeT1", label: "Writing Task 1", emoji: "✍️", value: "Writing Task 1" },
      { id: "reviewWrong", label: "Review wrong notes", emoji: "🧾", value: "Review wrong notes" },
      { id: "mockMini", label: "Mini mock (10Q)", emoji: "⏱️", value: "Mini mock (10Q)" },
    ],
    []
  );

  const addGoal = (raw) => {
    const text = normalizeGoal(raw);
    if (!text) return;

    setGoals((prev) => {
      if (prev.length >= MAX) return prev;

      const key = text.toLowerCase();
      const has = prev.some((g) => (g.text || "").toLowerCase() === key);
      if (has) return prev;

      const next = [
        ...prev,
        { id: cryptoId(), text, done: false, createdAt: Date.now() },
      ];
      return clampGoals(next);
    });

    setInput("");
    requestAnimationFrame(() => inputRef.current?.focus?.());
  };

  const toggleDone = (id) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, done: !g.done } : g))
    );
  };

  const removeGoal = (id) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setEditDraft("");
    }
  };

  const resetGoals = () => {
    setGoals([]);
    setInput("");
    setEditingId(null);
    setEditDraft("");
    requestAnimationFrame(() => inputRef.current?.focus?.());
  };

  const startEdit = (g) => {
    setEditingId(g.id);
    setEditDraft(g.text);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDraft("");
  };

  const saveEdit = () => {
    const nextText = normalizeGoal(editDraft);
    if (!editingId) return;

    if (!nextText) {
      // 빈 값이면 삭제로 처리(실사용 UX에서 흔함)
      removeGoal(editingId);
      return;
    }

    setGoals((prev) => {
      const key = nextText.toLowerCase();
      const duplicate = prev.some((g) => g.id !== editingId && (g.text || "").toLowerCase() === key);
      if (duplicate) return prev; // 중복이면 저장 안 함

      return prev.map((g) => (g.id === editingId ? { ...g, text: nextText } : g));
    });

    setEditingId(null);
    setEditDraft("");
  };

  const moveUp = (index) => {
    if (index <= 0) return;
    setGoals((prev) => moveItem(prev, index, index - 1));
  };

  const moveDown = (index) => {
    if (index >= goals.length - 1) return;
    setGoals((prev) => moveItem(prev, index, index + 1));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    addGoal(input);
  };

  const hint = useMemo(() => {
    if (goals.length === 0) {
      return mode === "daily"
        ? "오늘의 목표 1~3개만 잡아도 충분해요. 작게 시작해서 매일 반복!"
        : "이번 주 목표는 ‘현실적으로 유지 가능한 루틴’이 정답이에요.";
    }
    if (progress === 100) {
      return mode === "daily"
        ? "완료! 오늘 할 일 끝. 내일은 더 가볍게 시작해요."
        : "이번 주 목표 완료! 다음 주는 난이도를 살짝 올려볼까요?";
    }
    return mode === "daily"
      ? "완료 체크가 쌓이면 루틴이 됩니다. 오늘은 ‘한 개만’ 끝내도 성공."
      : "중간 점검: 무리하지 말고, 남은 목표를 더 작게 쪼개도 좋아요.";
  }, [goals.length, mode, progress]);

  return (
    <Shell>
      <Header>
        <HeaderLeft>
          <AppIcon aria-hidden>
            <Dot />
          </AppIcon>
          <HeaderText>
            <Title>목표 설정</Title>
            <Sub>{labelPeriod}</Sub>
          </HeaderText>
        </HeaderLeft>

        <HeaderRight>
          <Kpi>
            <KpiLabel>진행</KpiLabel>
            <KpiValue>{goals.length === 0 ? "—" : `${progress}%`}</KpiValue>
          </Kpi>
          <PrimaryGhost type="button" onClick={resetGoals} disabled={goals.length === 0}>
            초기화
          </PrimaryGhost>
        </HeaderRight>
      </Header>

      <SegRow>
        <Segment role="tablist" aria-label="목표 모드">
          <SegBtn
            type="button"
            role="tab"
            aria-selected={mode === "daily"}
            $active={mode === "daily"}
            onClick={() => setMode("daily")}
          >
            일일
          </SegBtn>
          <SegBtn
            type="button"
            role="tab"
            aria-selected={mode === "weekly"}
            $active={mode === "weekly"}
            onClick={() => setMode("weekly")}
          >
            주간
          </SegBtn>
        </Segment>

        <CountPill aria-live="polite">
          {doneCount}/{goals.length || 0} 완료 · {goals.length}/{MAX}
        </CountPill>
      </SegRow>

      <ProgressCard>
        <Ring aria-hidden>
          <RingSvg viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="48" className="bg" />
            <circle
              cx="60"
              cy="60"
              r="48"
              className="fg"
              style={{
                strokeDasharray: `${2 * Math.PI * 48}`,
                strokeDashoffset: `${(1 - progress / 100) * (2 * Math.PI * 48)}`,
              }}
            />
          </RingSvg>
          <RingCenter>
            <RingPct>{goals.length === 0 ? "—" : `${progress}%`}</RingPct>
            <RingCap>완료율</RingCap>
          </RingCenter>
        </Ring>

        <ProgressRight>
          <ProgressTitle>
            {mode === "daily" ? "오늘의 핵심 목표" : "이번 주 핵심 목표"}
          </ProgressTitle>
          <ProgressDesc>
            목표는 <b>최대 5개</b>. 너무 많으면 유지가 깨져요.
            <br />
            완료 체크는 기록이 되고, 다음 루틴 설계에 도움이 됩니다.
          </ProgressDesc>

          <PresetRail aria-label="빠른 추가 프리셋">
            {presets.map((p) => (
              <PresetChip
                key={p.id}
                type="button"
                disabled={isFull}
                onClick={() => addGoal(p.value)}
                title={isFull ? "최대 5개까지 저장됩니다." : p.value}
              >
                <span aria-hidden>{p.emoji}</span>
                <span>{p.label}</span>
              </PresetChip>
            ))}
          </PresetRail>
        </ProgressRight>
      </ProgressCard>

      <Composer onSubmit={onSubmit}>
        <ComposerLeft>
          <ComposerLabel>새 목표</ComposerLabel>
          <ComposerInput
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "daily" ? "예) Reading 1 passage" : "예) Mock 2회 완주"}
            disabled={isFull}
            inputMode="text"
          />
        </ComposerLeft>

        <ComposerRight>
          <AddButton type="submit" disabled={isFull || !normalizeGoal(input)}>
            + 추가
          </AddButton>
        </ComposerRight>
      </Composer>

      <ListCard>
        <ListHeader>
          <ListTitle>
            {mode === "daily" ? "목표 리스트" : "주간 리스트"}
          </ListTitle>
          <ListMeta>{isFull ? "가득 찼어요" : "추가 가능"}</ListMeta>
        </ListHeader>

        <ListBody>
          {goals.length === 0 ? (
            <EmptyState>
              <EmptyIcon aria-hidden>📌</EmptyIcon>
              <EmptyTitle>목표를 추가해 보세요</EmptyTitle>
              <EmptyDesc>프리셋을 누르거나 직접 입력해서 빠르게 만들 수 있어요.</EmptyDesc>
            </EmptyState>
          ) : (
            goals.map((g, idx) => {
              const isEditing = editingId === g.id;

              return (
                <Item key={g.id} $done={g.done}>
                  <ItemMain>
                    <Check
                      type="button"
                      onClick={() => toggleDone(g.id)}
                      aria-pressed={g.done}
                      title={g.done ? "완료 해제" : "완료 처리"}
                    >
                      {g.done ? "✓" : ""}
                    </Check>

                    {!isEditing ? (
                      <TextBlock>
                        <ItemText title={g.text}>{g.text}</ItemText>
                        <ItemSub>
                          {g.done ? "완료됨" : "진행 중"} · {idx + 1}번째
                        </ItemSub>
                      </TextBlock>
                    ) : (
                      <EditBlock>
                        <EditInput
                          value={editDraft}
                          onChange={(e) => setEditDraft(e.target.value)}
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Escape") cancelEdit();
                            if (e.key === "Enter") saveEdit();
                          }}
                        />
                        <EditActions>
                          <TinyBtn type="button" onClick={cancelEdit}>
                            취소
                          </TinyBtn>
                          <TinyPrimary type="button" onClick={saveEdit}>
                            저장
                          </TinyPrimary>
                        </EditActions>
                      </EditBlock>
                    )}
                  </ItemMain>

                  <ItemActions>
                    <IconBtn
                      type="button"
                      onClick={() => moveUp(idx)}
                      disabled={idx === 0}
                      title="위로"
                      aria-label="위로 이동"
                    >
                      ↑
                    </IconBtn>
                    <IconBtn
                      type="button"
                      onClick={() => moveDown(idx)}
                      disabled={idx === goals.length - 1}
                      title="아래로"
                      aria-label="아래로 이동"
                    >
                      ↓
                    </IconBtn>

                    {!isEditing ? (
                      <IconBtn
                        type="button"
                        onClick={() => startEdit(g)}
                        title="수정"
                        aria-label="수정"
                      >
                        ✎
                      </IconBtn>
                    ) : (
                      <IconBtn
                        type="button"
                        onClick={cancelEdit}
                        title="닫기"
                        aria-label="수정 닫기"
                      >
                        ✕
                      </IconBtn>
                    )}

                    <DangerBtn
                      type="button"
                      onClick={() => removeGoal(g.id)}
                      title="삭제"
                      aria-label="삭제"
                    >
                      삭제
                    </DangerBtn>
                  </ItemActions>
                </Item>
              );
            })
          )}
        </ListBody>

        <HintBar>
          <HintDot aria-hidden />
          <HintText>{hint}</HintText>
        </HintBar>
      </ListCard>
    </Shell>
  );
}

/* ===================== styles ===================== */

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Shell = styled.section`
  width: 100%;
  display: grid;
  gap: 12px;
  animation: ${fadeUp} 240ms ease-out;
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
`;

const AppIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 14px;
  background: radial-gradient(circle at 35% 25%, rgba(255, 169, 0, 0.35), transparent 55%),
    linear-gradient(180deg, #0f172a, #111827);
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.18);
  display: grid;
  place-items: center;
  flex: 0 0 auto;
`;

const Dot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #ffb020;
  box-shadow: 0 0 0 6px rgba(255, 176, 32, 0.16);
`;

const HeaderText = styled.div`
  min-width: 0;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 18px;
  line-height: 1.15;
  font-weight: 950;
  letter-spacing: -0.35px;
  color: #0b1220;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Sub = styled.div`
  margin-top: 4px;
  font-size: 12px;
  font-weight: 850;
  color: #64748b;
  letter-spacing: -0.2px;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 0 0 auto;
`;

const Kpi = styled.div`
  padding: 10px 12px;
  border-radius: 14px;
  border: 1px solid rgba(226, 232, 240, 0.9);
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 12px 26px rgba(15, 23, 42, 0.06);
  text-align: right;
`;

const KpiLabel = styled.div`
  font-size: 11px;
  font-weight: 900;
  color: #94a3b8;
`;

const KpiValue = styled.div`
  margin-top: 2px;
  font-size: 14px;
  font-weight: 950;
  color: #0b1220;
`;

const PrimaryGhost = styled.button`
  height: 40px;
  padding: 0 12px;
  border-radius: 14px;
  border: 1px solid rgba(226, 232, 240, 0.95);
  background: #fff;
  font-weight: 950;
  color: #0b1220;
  cursor: pointer;

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
  &:active {
    transform: translateY(0.5px);
  }
`;

const SegRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const Segment = styled.div`
  display: inline-flex;
  padding: 4px;
  gap: 6px;
  border-radius: 16px;
  border: 1px solid rgba(226, 232, 240, 0.95);
  background: #f8fafc;
`;

const SegBtn = styled.button`
  border: none;
  height: 38px;
  padding: 0 14px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 950;
  letter-spacing: -0.2px;

  background: ${({ $active }) =>
    $active ? "linear-gradient(180deg, #0f172a, #111827)" : "transparent"};
  color: ${({ $active }) => ($active ? "#fff" : "#64748b")};

  &:active {
    transform: translateY(0.5px);
  }
`;

const CountPill = styled.div`
  padding: 10px 12px;
  border-radius: 999px;
  border: 1px solid rgba(226, 232, 240, 0.95);
  background: #fff;
  font-size: 12px;
  font-weight: 950;
  color: #334155;
`;

const ProgressCard = styled.div`
  border-radius: 18px;
  border: 1px solid rgba(226, 232, 240, 0.95);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(248, 250, 252, 0.92));
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
  padding: 14px;
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 12px;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const Ring = styled.div`
  position: relative;
  width: 140px;
  height: 140px;
  display: grid;
  place-items: center;
  margin: 0 auto;
`;

const RingSvg = styled.svg`
  width: 140px;
  height: 140px;
  transform: rotate(-90deg);

  .bg {
    fill: none;
    stroke: rgba(226, 232, 240, 1);
    stroke-width: 12;
  }
  .fg {
    fill: none;
    stroke: #ffb020; /* Fortress 느낌(오렌지 포인트) */
    stroke-width: 12;
    stroke-linecap: round;
    transition: stroke-dashoffset 240ms ease-out;
  }
`;

const RingCenter = styled.div`
  position: absolute;
  display: grid;
  place-items: center;
  gap: 2px;
`;

const RingPct = styled.div`
  font-size: 20px;
  font-weight: 1000;
  letter-spacing: -0.4px;
  color: #0b1220;
`;

const RingCap = styled.div`
  font-size: 11px;
  font-weight: 900;
  color: #64748b;
`;

const ProgressRight = styled.div`
  display: grid;
  align-content: start;
  gap: 10px;
  min-width: 0;
`;

const ProgressTitle = styled.div`
  font-size: 14px;
  font-weight: 1000;
  letter-spacing: -0.25px;
  color: #0b1220;
`;

const ProgressDesc = styled.div`
  font-size: 12px;
  font-weight: 850;
  color: #475569;
  line-height: 1.45;

  b {
    color: #0b1220;
    font-weight: 1000;
  }
`;

const PresetRail = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 2px;

  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const PresetChip = styled.button`
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 38px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid rgba(226, 232, 240, 0.95);
  background: rgba(255, 255, 255, 0.92);
  font-weight: 950;
  color: #0b1220;
  cursor: pointer;
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.06);

  &:active {
    transform: translateY(0.5px);
  }
  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const Composer = styled.form`
  border-radius: 18px;
  border: 1px solid rgba(226, 232, 240, 0.95);
  background: #fff;
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.06);
  padding: 12px;
  display: grid;
  grid-template-columns: 1fr 110px;
  gap: 10px;

  @media (max-width: 420px) {
    grid-template-columns: 1fr 94px;
  }
`;

const ComposerLeft = styled.div`
  min-width: 0;
`;

const ComposerLabel = styled.div`
  font-size: 11px;
  font-weight: 950;
  color: #94a3b8;
  margin-bottom: 6px;
`;

const ComposerInput = styled.input`
  width: 100%;
  height: 44px;
  border-radius: 14px;
  border: 1px solid rgba(226, 232, 240, 0.95);
  background: #f8fafc;
  padding: 0 14px;
  outline: none;
  font-weight: 900;
  color: #0b1220;

  &::placeholder {
    color: #94a3b8;
    font-weight: 850;
  }

  &:focus {
    background: #fff;
    border-color: rgba(255, 176, 32, 0.65);
    box-shadow: 0 0 0 4px rgba(255, 176, 32, 0.16);
  }

  &:disabled {
    opacity: 0.65;
  }
`;

const ComposerRight = styled.div`
  display: grid;
  align-content: end;
`;

const AddButton = styled.button`
  height: 44px;
  border-radius: 14px;
  border: none;
  cursor: pointer;
  font-weight: 1000;
  letter-spacing: -0.2px;
  color: #0b1220;
  background: linear-gradient(180deg, #ffcc66, #ffb020);
  box-shadow: 0 16px 28px rgba(255, 176, 32, 0.22);

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    box-shadow: none;
  }
  &:active {
    transform: translateY(0.5px);
  }
`;

const ListCard = styled.div`
  border-radius: 18px;
  border: 1px solid rgba(226, 232, 240, 0.95);
  background: #fff;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
  overflow: hidden;
`;

const ListHeader = styled.div`
  padding: 12px 14px;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.9);
  background: linear-gradient(180deg, rgba(248, 250, 252, 0.95), rgba(255, 255, 255, 0.95));
`;

const ListTitle = styled.div`
  font-size: 14px;
  font-weight: 1000;
  letter-spacing: -0.25px;
  color: #0b1220;
`;

const ListMeta = styled.div`
  font-size: 12px;
  font-weight: 950;
  color: #64748b;
`;

const ListBody = styled.div`
  padding: 12px;
  display: grid;
  gap: 10px;
`;

const EmptyState = styled.div`
  border-radius: 16px;
  border: 1px dashed rgba(148, 163, 184, 0.6);
  background: rgba(248, 250, 252, 0.8);
  padding: 18px 14px;
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 20px;
`;

const EmptyTitle = styled.div`
  margin-top: 6px;
  font-size: 14px;
  font-weight: 1000;
  color: #0b1220;
`;

const EmptyDesc = styled.div`
  margin-top: 6px;
  font-size: 12px;
  font-weight: 850;
  color: #64748b;
  line-height: 1.45;
`;

const Item = styled.div`
  border-radius: 16px;
  border: 1px solid rgba(226, 232, 240, 0.95);
  background: ${({ $done }) =>
    $done
      ? "linear-gradient(180deg, rgba(255, 250, 235, 0.9), rgba(255, 255, 255, 0.92))"
      : "rgba(255, 255, 255, 0.95)"};
  padding: 12px;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.05);
`;

const ItemMain = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
`;

const Check = styled.button`
  width: 34px;
  height: 34px;
  border-radius: 12px;
  border: 1px solid rgba(226, 232, 240, 0.95);
  background: #fff;
  cursor: pointer;
  font-weight: 1100;
  color: #0b1220;
  display: grid;
  place-items: center;

  &:active {
    transform: translateY(0.5px);
  }
`;

const TextBlock = styled.div`
  min-width: 0;
`;

const ItemText = styled.div`
  font-size: 14px;
  font-weight: 1000;
  letter-spacing: -0.2px;
  color: #0b1220;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ItemSub = styled.div`
  margin-top: 4px;
  font-size: 11px;
  font-weight: 900;
  color: #94a3b8;
`;

const ItemActions = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

const IconBtn = styled.button`
  height: 34px;
  min-width: 34px;
  padding: 0 10px;
  border-radius: 12px;
  border: 1px solid rgba(226, 232, 240, 0.95);
  background: #fff;
  cursor: pointer;
  font-weight: 1000;
  color: #334155;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  &:active {
    transform: translateY(0.5px);
  }
`;

const DangerBtn = styled.button`
  height: 34px;
  padding: 0 10px;
  border-radius: 12px;
  border: 1px solid rgba(254, 202, 202, 0.9);
  background: rgba(254, 242, 242, 0.9);
  cursor: pointer;
  font-weight: 1000;
  color: #991b1b;

  &:active {
    transform: translateY(0.5px);
  }
`;

const EditBlock = styled.div`
  min-width: 0;
  width: 100%;
  display: grid;
  gap: 8px;
`;

const EditInput = styled.input`
  width: 100%;
  height: 40px;
  border-radius: 14px;
  border: 1px solid rgba(226, 232, 240, 0.95);
  background: #fff;
  padding: 0 12px;
  outline: none;
  font-weight: 950;
  color: #0b1220;

  &:focus {
    border-color: rgba(255, 176, 32, 0.65);
    box-shadow: 0 0 0 4px rgba(255, 176, 32, 0.16);
  }
`;

const EditActions = styled.div`
  display: flex;
  gap: 8px;
`;

const TinyBtn = styled.button`
  height: 34px;
  padding: 0 12px;
  border-radius: 12px;
  border: 1px solid rgba(226, 232, 240, 0.95);
  background: #fff;
  cursor: pointer;
  font-weight: 1000;
  color: #334155;

  &:active {
    transform: translateY(0.5px);
  }
`;

const TinyPrimary = styled.button`
  height: 34px;
  padding: 0 12px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(180deg, #0f172a, #111827);
  cursor: pointer;
  font-weight: 1000;
  color: #fff;

  &:active {
    transform: translateY(0.5px);
  }
`;

const HintBar = styled.div`
  padding: 12px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-top: 1px solid rgba(226, 232, 240, 0.9);
  background: rgba(248, 250, 252, 0.9);
`;

const HintDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #ffb020;
  box-shadow: 0 0 0 6px rgba(255, 176, 32, 0.12);
  flex: 0 0 auto;
`;

const HintText = styled.div`
  font-size: 12px;
  font-weight: 900;
  color: #475569;
  letter-spacing: -0.2px;
  line-height: 1.35;
  min-width: 0;
`;