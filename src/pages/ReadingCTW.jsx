// src/pages/ReadingCTW.jsx
import { useMemo, useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { CTW_TRACK_MAP } from "../data/reading/ctwIndex";

const LS_MYVOCAB = "my_vocab_v1";

/* ================= utils ================= */
function hasKorean(s) {
  return /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(String(s || ""));
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function normalize(s) {
  return String(s || "").trim().toLowerCase();
}

function onlyLetters(s) {
  return String(s || "").replace(/[^a-zA-Z]/g, "").toLowerCase();
}

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ✅ 단어에서 "앞 n개의 알파벳"을 원문 형태로 뽑기 (대소문 유지)
function takeFirstNLettersOriginal(word, n) {
  if (!word || n <= 0) return "";
  let out = "";
  let cnt = 0;
  for (let i = 0; i < word.length; i++) {
    const ch = word[i];
    if (/[A-Za-z]/.test(ch)) {
      if (cnt < n) {
        out += ch;
        cnt += 1;
      } else {
        break;
      }
    } else {
      // 단어 내부에 하이픈/기호가 앞쪽에 끼어있는 케이스를
      // prefix 표시에서 굳이 포함시키지 않음
      if (cnt > 0) break;
    }
  }
  return out;
}

/* ================= component ================= */

export default function ReadingCTW() {
  const nav = useNavigate();
  const { trackKey } = useParams(); // ✅ /reading/ctw/:trackKey

const pack = CTW_TRACK_MAP[trackKey] || null;

// ✅ 매 진입/트랙 변경 때 섞인 items를 state로 보관
const [items, setItems] = useState([]);
const total = items.length;

const [idx, setIdx] = useState(0);
const cur = items[idx];

  const [typed, setTyped] = useState("");
  const [result, setResult] = useState(null); // "correct" | "wrong" | null
  const [toast, setToast] = useState(null);

  const inputRef = useRef(null);
  const [showHint, setShowHint] = useState(false);

  /* ===================== ✅ ANSWER LOGIC (multi-word prefix) ===================== */

  // 원본 정답(띄어쓰기 유지)
  const rawAnswer = useMemo(() => String(cur?.answer || "").trim(), [cur]);

  // ✅ 단어 배열 (공백 기준). 예: "elliptical galaxy" -> ["elliptical","galaxy"]
  const words = useMemo(() => rawAnswer.split(/\s+/).filter(Boolean), [rawAnswer]);

  // ✅ prefix 규칙
  // - 1번째 단어: cur.prefixLen(기본 2)
  // - 2번째 단어: cur.prefixLen2(기본 1)  ← 필요하면 데이터에서 2로 올리면 됨
  const w1PrefLen = useMemo(() => {
    const v = Number.isFinite(cur?.prefixLen) ? cur.prefixLen : 2;
    return Math.max(0, Math.min(3, v)); // 2~3 케이스 안전
  }, [cur]);

  const w2PrefLen = useMemo(() => {
    const v = Number.isFinite(cur?.prefixLen2) ? cur.prefixLen2 : 1;
    return Math.max(0, Math.min(2, v)); // 1~2
  }, [cur]);

  // ✅ 단어별로 (표시 prefix / 입력해야 할 rest 길이 / typed 분배)
  const wordDisplay = useMemo(() => {
    let cursor = 0;

    return words.map((w, i) => {
      const letters = onlyLetters(w); // 입력/채점 기준
      const maxLen = letters.length;

      const prefLen =
        i === 0 ? Math.min(w1PrefLen, maxLen) : i === 1 ? Math.min(w2PrefLen, maxLen) : 0;

      const prefixText = takeFirstNLettersOriginal(w, prefLen);
      const restLetters = letters.slice(prefLen); // 복수형 s 포함하여 여기로 들어감
      const restLen = restLetters.length;

      const typedPart = typed.slice(cursor, cursor + restLen);
      cursor += restLen;

      return {
        word: w,
        prefixText,
        restLetters, // 정답 rest(채점용)
        restLen,
        typedPart, // 화면 슬롯에 들어갈 입력
      };
    });
  }, [words, typed, w1PrefLen, w2PrefLen]);

  // ✅ 전체 입력해야 하는 길이
  const restLen = useMemo(
    () => wordDisplay.reduce((sum, w) => sum + (w.restLen || 0), 0),
    [wordDisplay]
  );

  // ✅ 채점용 정답: (각 단어의 restLetters를 이어붙인 것)
  const answerRest = useMemo(
    () => wordDisplay.map((w) => w.restLetters).join(""),
    [wordDisplay]
  );

  // ✅ 슬롯 렌더: "_ _ _" 형태
  const renderSlots = (typedPart, len) => {
    const out = [];
    for (let i = 0; i < len; i++) out.push(typedPart[i] || "_");
    return out.join(" ");
  };

  /* ===================== sentence split (✅ 복수형 s 남는 문제 해결) ===================== */

  const parts = useMemo(() => {
    if (!cur?.sentence) return { before: "", after: "" };

    const s = String(cur.sentence);

    // 1) answer 완전 일치 우선 (복수형 포함)
    const ansRaw = String(cur?.answer || "").trim();
    if (ansRaw) {
      const iAns = s.indexOf(ansRaw);
      if (iAns >= 0) {
        return { before: s.slice(0, iAns), after: s.slice(iAns + ansRaw.length) };
      }
    }

    // 2) targetWord로 찾기
    const tRaw = String(cur?.targetWord || "").trim();
    if (!tRaw) return { before: s, after: "" };

    const i = s.indexOf(tRaw);
    if (i < 0) return { before: s, after: "" };

    // 3) targetWord 뒤에 s가 붙어 있으면 같이 제거
    let cutLen = tRaw.length;
    if (s[i + cutLen] === "s") cutLen += 1;

    return { before: s.slice(0, i), after: s.slice(i + cutLen) };
  }, [cur]);

  /* ===================== UI helpers ===================== */

  const progress = useMemo(() => {
    if (!total) return 0;
    return Math.round(((idx + 1) / total) * 100);
  }, [idx, total]);

  const synonymsText = useMemo(() => {
    const arr = Array.isArray(cur?.synonyms) ? cur.synonyms : [];
    return arr.filter(Boolean).join(", ");
  }, [cur]);

  const subjectText = useMemo(() => String(cur?.subject || "general").trim(), [cur]);

  const focusInput = () => {
    const el = inputRef.current;
    if (!el) return;
    el.focus();
    requestAnimationFrame(() => {
      try {
        const len = el.value.length;
        el.setSelectionRange(len, len);
      } catch {
        // ignore
      }
    });
  };

  const lastToastRef = useRef({ msg: "", at: 0 });

const showToast = (msg) => {
  const now = Date.now();
  const last = lastToastRef.current;

  // 같은 메시지 600ms 이내 재호출이면 무시
  if (last.msg === msg && now - last.at < 600) return;

  lastToastRef.current = { msg, at: now };

  setToast(msg);
  window.clearTimeout(showToast._t);
  showToast._t = window.setTimeout(() => setToast(null), 1300);
};

  

  const resetCurrent = () => {
    setTyped("");
    setResult(null);
    requestAnimationFrame(focusInput);
  };

  const goNext = () => {
    if (!total) return;

    if (idx < total - 1) {
      setIdx((v) => v + 1);
      setTyped("");
      setResult(null);
      requestAnimationFrame(focusInput);
    } else {
      showToast("완료!");
      setTimeout(() => nav("/reading"), 350);
    }
  };

  const check = () => {
    const user = normalize(typed);
    const ok = user === answerRest;
    setResult(ok ? "correct" : "wrong");
    showToast(ok ? "정답!" : "오답");
  };

  const addToMyVocab = () => {
    const list = loadJson(LS_MYVOCAB, []);
    const word = String(cur?.answer || "").trim();
    if (!word) return;

    const exists = list.some((x) => normalize(x.word) === normalize(word));
    if (exists) {
      showToast("이미 단어장에 있어요");
      return;
    }

    const entry = {
      id: `v_${Date.now()}`,
      word,
      meaning: cur?.meaning || "",
      synonyms: Array.isArray(cur?.synonyms) ? cur.synonyms : [],
      forms: cur?.forms || null,
      subject: cur?.subject || "general",
      sentence: cur?.sentence || "",
      source: pack?.id || "ctw",
      addedAt: new Date().toISOString(),
    };

    saveJson(LS_MYVOCAB, [entry, ...list]);
    showToast("단어장에 추가됨");
  };

  // ✅ 트랙 바뀌면 인덱스 초기화
 // 트랙 바뀔 때: 전체 초기화 + 힌트 닫기


    useEffect(() => {
  const base = pack?.items || [];
  setItems(shuffleArray(base));   // ✅ 여기 추가

  setIdx(0);
  setTyped("");
  setResult(null);
  setShowHint(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [trackKey]);

  useEffect(() => {
    setShowHint(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);
 const onKeyDown = (e) => {
  if (result !== null) return;

  if (e.key === "Enter") {
    e.preventDefault();
    check();
    return;
  }

  if (
    e.key === "ArrowLeft" ||
    e.key === "ArrowRight" ||
    e.key === "ArrowUp" ||
    e.key === "ArrowDown" ||
    e.key === "Tab"
  ) return;

  if (e.key === "Backspace") {
    e.preventDefault();
    setTyped((prev) => prev.slice(0, -1));
    requestAnimationFrame(focusInput);
    return;
  }

  if (e.key.length === 1) {
    // ✅ 한글 입력 감지
    if (hasKorean(e.key)) {
      e.preventDefault();
      showToast("영어만 가능합니다");
      return;
    }

    const c = onlyLetters(e.key);
    if (!c) {
      e.preventDefault();
      return;
    }

    e.preventDefault();
    setTyped((prev) => {
      if (prev.length >= restLen) return prev;
      return (prev + c).slice(0, restLen);
    });

    requestAnimationFrame(focusInput);
  }
};

     

const onChange = (e) => {
  if (result !== null) return;

  const raw = e.target.value;

  // ✅ 한글 입력 감지
  if (hasKorean(raw)) {
    showToast("영어만 가능합니다");
  }

  const v = onlyLetters(raw);
  setTyped(v.slice(0, restLen));
};

 const onPaste = (e) => {
  if (result !== null) return;
  e.preventDefault();

  const text = e.clipboardData?.getData("text") || "";

  // ✅ 한글 포함 시 경고
  if (hasKorean(text)) {
    showToast("영어만 가능합니다");
    return;
  }

  const cleaned = onlyLetters(text);
  if (!cleaned) return;

  setTyped((prev) => (prev + cleaned).slice(0, restLen));
  requestAnimationFrame(focusInput);
};

  /* ===================== empty guards ===================== */

  if (!pack) {
    return (
      <Page>
        <Shell>
          <AppBar>
            <Brand>
              <BrandDot />
              <BrandText>Complete the Words</BrandText>
            </Brand>
            <BackBtn onClick={() => nav("/reading")}>← Reading</BackBtn>
          </AppBar>

          <Panel>
            <EmptyCard>
              <EmptyTitle>트랙을 찾을 수 없습니다</EmptyTitle>
              <EmptyDesc>/reading/ctw/{String(trackKey)} 가 CTW_TRACKS에 등록되어 있는지 확인하세요.</EmptyDesc>
            </EmptyCard>
          </Panel>
        </Shell>
      </Page>
    );
  }

  if (!total || !cur) {
    return (
      <Page>
        <Shell>
          <AppBar>
            <Brand>
              <BrandDot />
              <BrandText>{pack.title}</BrandText>
            </Brand>
            <BackBtn onClick={() => nav("/reading")}>← Reading</BackBtn>
          </AppBar>

          <Panel>
            <EmptyCard>
              <EmptyTitle>데이터가 비어있습니다</EmptyTitle>
              <EmptyDesc>{pack.id}.items 를 확인하세요.</EmptyDesc>
            </EmptyCard>
          </Panel>
        </Shell>
      </Page>
    );
  }

  /* ===================== render ===================== */

  return (
    <Page>
      <Shell>
        <AppBar>
          <Brand>
            <BrandDot />
            <BrandText>{pack.title}</BrandText>
          </Brand>

          <RightGroup>
            <ProgressPill aria-label="progress">
              <span>
                {idx + 1}/{total}
              </span>
              <PillBar>
                <PillFill style={{ width: `${progress}%` }} />
              </PillBar>
              <strong>{progress}%</strong>
            </ProgressPill>

            <BackBtn onClick={() => nav("/reading")}>← Reading</BackBtn>
          </RightGroup>
        </AppBar>

        <Panel>
          <Card $state={result}>
            <CardTop>
  <Badge>{String(trackKey || "").toUpperCase()}</Badge>

  <HintWrap>
    <HintBtn
      type="button"
      onClick={() => setShowHint(v => !v)}
      aria-expanded={showHint}
      aria-label="toggle synonyms hint"
    >
      Hint
      <HintChevron $open={showHint}>▾</HintChevron>
    </HintBtn>

    {showHint && (
      <HintBubble role="note" aria-label="synonyms">
        Synonyms: <b>{synonymsText || "—"}</b>
      </HintBubble>
    )}
  </HintWrap>
</CardTop>

            <Sentence>
              <span>{parts.before}</span>

              <BlankWrap onClick={focusInput} role="button" tabIndex={0} aria-label="blank area">
                <SlotsWrap>
                  {wordDisplay.map((w, i) => (
                    <WordChunk key={`${w.word}_${i}`} aria-hidden>
                      <WordPrefix>{w.prefixText}</WordPrefix>
                      {w.restLen > 0 && <WordSlots>{renderSlots(w.typedPart, w.restLen)}</WordSlots>}
                      {i < wordDisplay.length - 1 && <BetweenWords>{"   "}</BetweenWords>}
                    </WordChunk>
                  ))}

                  {/* 실제 입력은 hidden input 1개 */}
                  <HiddenInput
                    ref={inputRef}
                    value={typed}
                    readOnly={result !== null}
                    inputMode="text"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    onKeyDown={onKeyDown}
                    onChange={onChange}
                    onPaste={onPaste}
                    onFocus={focusInput}
                    aria-label="type the letters"
                  />
                </SlotsWrap>
              </BlankWrap>

              <span>{parts.after}</span>
            </Sentence>

            <HelperRow>
              <HelperText>빈칸을 눌러 입력하세요. (Enter = Check)</HelperText>
              <MicroTag>
                subject: <b>{subjectText}</b>
              </MicroTag>
            </HelperRow>

            <Actions>
              {result === null && (
                <Primary onClick={check} aria-label="check">
                  Check
                </Primary>
              )}

              {result === "correct" && (
                <Primary onClick={goNext} aria-label="next">
                  Next
                </Primary>
              )}

              {result === "wrong" && (
                <>
                  <Grid2>
                    <Ghost onClick={resetCurrent}>다시 풀기</Ghost>
                    <Primary onClick={goNext}>다음 문제</Primary>
                  </Grid2>
                  <SubAction onClick={addToMyVocab}>틀린 단어 · 나의 단어장에 추가</SubAction>
                </>
              )}
            </Actions>

            {result === "correct" && (
              <Feedback $ok>
                <Dot $ok />
                Correct
              </Feedback>
            )}

            {result === "wrong" && (
              <Feedback>
                <Dot />
                Wrong · 정답: <b>{cur.answer}</b>
              </Feedback>
            )}
          </Card>

          {toast && <Toast role="status">{toast}</Toast>}
        </Panel>
      </Shell>
    </Page>
  );
}

/* ================= styles ================= */

const Page = styled.div`
  min-height: 100vh;
  background:
    radial-gradient(900px 480px at 20% 0%, rgba(54, 162, 255, 0.14), transparent 60%),
    radial-gradient(900px 480px at 90% 10%, rgba(0, 230, 160, 0.10), transparent 60%),
    linear-gradient(180deg, rgba(245, 248, 255, 1), rgba(245, 247, 252, 1));
`;

const Shell = styled.div`
  max-width: 760px;
  margin: 0 auto;
  padding: 18px 16px 28px;
`;

const AppBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 10px 14px;
`;

const Brand = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`;

const BrandDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: linear-gradient(135deg, #1e88ff, #00e6a0);
  box-shadow: 0 10px 22px rgba(0, 90, 255, 0.18);
`;

const BrandText = styled.div`
  font-size: 16px;
  font-weight: 950;
  letter-spacing: -0.3px;
  color: rgba(16, 24, 39, 0.92);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const RightGroup = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
`;

const BackBtn = styled.button`
  border: 1px solid rgba(16, 24, 39, 0.12);
  background: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  border-radius: 14px;
  padding: 10px 12px;
  font-weight: 900;
  color: rgba(16, 24, 39, 0.78);
  transition: transform 0.06s ease, box-shadow 0.18s ease;

  &:active {
    transform: translateY(1px);
  }
`;

const ProgressPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 999px;
  border: 1px solid rgba(16, 24, 39, 0.10);
  background: rgba(255, 255, 255, 0.85);
  box-shadow: 0 12px 24px rgba(10, 18, 30, 0.06);
  font-size: 12px;
  font-weight: 900;
  color: rgba(16, 24, 39, 0.72);

  strong {
    color: rgba(16, 24, 39, 0.92);
  }
`;

const PillBar = styled.div`
  width: 110px;
  height: 10px;
  border-radius: 999px;
  background: rgba(16, 24, 39, 0.08);
  overflow: hidden;

  @media (max-width: 420px) {
    width: 84px;
  }
`;

const PillFill = styled.div`
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(135deg, #1e88ff, #0055ff);
`;

const Panel = styled.div`
  padding: 4px 10px 0;
`;

const Card = styled.div`
  border-radius: 22px;
  padding: 18px 16px 16px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(16, 24, 39, 0.10);
  box-shadow: 0 18px 40px rgba(10, 18, 30, 0.08);
  backdrop-filter: blur(10px);

  ${({ $state }) =>
    $state === "correct" &&
    `
    border-color: rgba(0, 190, 120, 0.22);
    box-shadow: 0 18px 40px rgba(0, 190, 120, 0.12);
  `}

  ${({ $state }) =>
    $state === "wrong" &&
    `
    border-color: rgba(255, 77, 77, 0.22);
    box-shadow: 0 18px 40px rgba(255, 77, 77, 0.10);
  `}
`;

const CardTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 950;
  letter-spacing: 0.4px;
  color: rgba(16, 24, 39, 0.78);
  background: rgba(30, 136, 255, 0.10);
  border: 1px solid rgba(30, 136, 255, 0.18);
`;

const MiniHint = styled.div`
  font-size: 12px;
  font-weight: 850;
  color: rgba(16, 24, 39, 0.62);

  b {
    color: rgba(16, 24, 39, 0.92);
  }
`;

const Sentence = styled.div`
  font-size: 18px;
  line-height: 1.65;
  font-weight: 900;
  letter-spacing: -0.2px;
  color: rgba(16, 24, 39, 0.92);

  @media (max-width: 420px) {
    font-size: 17px;
  }
`;

const BlankWrap = styled.span`
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
  padding: 4px 10px;
  margin: 0 4px;
  border-radius: 14px;
  border: 1px solid rgba(30, 136, 255, 0.18);
  background: rgba(30, 136, 255, 0.06);
  box-shadow: 0 10px 20px rgba(0, 90, 255, 0.06);
  cursor: text;
  max-width: 100%;
  flex-wrap: wrap;
`;

const SlotsWrap = styled.span`
  position: relative;
  display: inline-flex;
  align-items: baseline;
  flex-wrap: wrap;
`;

const WordChunk = styled.span`
  display: inline-flex;
  align-items: baseline;
  white-space: pre;
`;

const WordPrefix = styled.span`
  font: inherit;
  font-weight: 950;
  color: rgba(16, 24, 39, 0.95);
  user-select: none;
`;

const WordSlots = styled.span`
  font: inherit;
  font-weight: 950;
  letter-spacing: 1px;
  color: rgba(16, 24, 39, 0.90);
  user-select: none;
`;

const BetweenWords = styled.span`
  white-space: pre;
  user-select: none;
`;

const HiddenInput = styled.input`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  border: none;
  outline: none;
  background: transparent;
`;

const HelperRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 10px;
  flex-wrap: wrap;
`;

const HelperText = styled.div`
  font-size: 12px;
  font-weight: 850;
  color: rgba(16, 24, 39, 0.58);
`;

const MicroTag = styled.div`
  font-size: 12px;
  font-weight: 900;
  color: rgba(16, 24, 39, 0.62);
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid rgba(16, 24, 39, 0.10);
  background: rgba(255, 255, 255, 0.75);

  b {
    color: rgba(16, 24, 39, 0.92);
  }
`;

const Actions = styled.div`
  margin-top: 14px;
  display: grid;
  gap: 10px;
`;

const Grid2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;

  @media (max-width: 420px) {
    grid-template-columns: 1fr;
  }
`;

const Primary = styled.button`
  width: 100%;
  height: 48px;
  border-radius: 14px;
  border: none;
  cursor: pointer;

  background: linear-gradient(135deg, #1e88ff, #0055ff);
  color: white;
  font-weight: 950;
  letter-spacing: -0.2px;

  box-shadow: 0 14px 26px rgba(0, 90, 255, 0.18);

  &:active {
    transform: translateY(1px);
    filter: brightness(0.98);
  }
`;

const Ghost = styled.button`
  width: 100%;
  height: 48px;
  border-radius: 14px;
  border: 1px solid rgba(16, 24, 39, 0.14);
  background: rgba(255, 255, 255, 0.92);
  cursor: pointer;

  color: rgba(16, 24, 39, 0.88);
  font-weight: 950;

  &:active {
    transform: translateY(1px);
  }
`;

const SubAction = styled.button`
  width: 100%;
  height: 48px;
  border-radius: 14px;
  border: 1px solid rgba(0, 190, 120, 0.18);
  background: rgba(0, 230, 160, 0.08);
  color: rgba(16, 24, 39, 0.88);
  cursor: pointer;
  font-weight: 950;

  &:active {
    transform: translateY(1px);
  }
`;

const Feedback = styled.div`
  margin-top: 12px;
  padding: 12px 12px;
  border-radius: 14px;

  display: flex;
  align-items: center;
  gap: 10px;

  font-size: 13px;
  font-weight: 950;
  color: rgba(16, 24, 39, 0.82);

  background: rgba(16, 24, 39, 0.04);
  border: 1px solid rgba(16, 24, 39, 0.08);

  ${({ $ok }) =>
    $ok &&
    `
    background: rgba(0, 230, 160, 0.10);
    border-color: rgba(0, 190, 120, 0.18);
  `}

  b {
    color: rgba(16, 24, 39, 0.96);
  }
`;

const Dot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: rgba(255, 77, 77, 0.9);

  ${({ $ok }) =>
    $ok &&
    `
    background: rgba(0, 190, 120, 0.95);
  `}
`;

const toastIn = keyframes`
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0px); opacity: 1; }
`;

const Toast = styled.div`
  position: fixed;
  left: 50%;
  bottom: 22px;
  transform: translateX(-50%);
  z-index: 50;

  padding: 10px 14px;
  border-radius: 999px;
  background: rgba(16, 24, 39, 0.92);
  color: white;
  font-weight: 950;
  font-size: 13px;

  box-shadow: 0 18px 40px rgba(10, 18, 30, 0.20);
  animation: ${toastIn} 0.14s ease-out;
`;

const EmptyCard = styled.div`
  margin-top: 14px;
  padding: 18px 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(16, 24, 39, 0.10);
  box-shadow: 0 18px 40px rgba(10, 18, 30, 0.08);
`;

const EmptyTitle = styled.div`
  font-size: 16px;
  font-weight: 950;
  color: rgba(16, 24, 39, 0.92);
`;

const EmptyDesc = styled.div`
  margin-top: 6px;
  font-size: 13px;
  font-weight: 850;
  color: rgba(16, 24, 39, 0.62);
`;


const HintWrap = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

const HintBtn = styled.button`
  border: 1px solid rgba(16, 24, 39, 0.12);
  background: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  border-radius: 999px;
  padding: 8px 10px;
  font-size: 12px;
  font-weight: 950;
  color: rgba(16, 24, 39, 0.72);
  display: inline-flex;
  align-items: center;
  gap: 6px;

  &:active {
    transform: translateY(1px);
  }
`;

const HintChevron = styled.span`
  display: inline-block;
  transition: transform 0.14s ease;
  transform: rotate(${({ $open }) => ($open ? "180deg" : "0deg")});
`;

const HintBubble = styled.div`
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  z-index: 5;

  max-width: min(320px, 70vw);
  padding: 10px 12px;
  border-radius: 14px;

  background: rgba(255, 255, 255, 0.98);
  border: 1px solid rgba(16, 24, 39, 0.10);
  box-shadow: 0 18px 40px rgba(10, 18, 30, 0.10);

  font-size: 12px;
  font-weight: 850;
  color: rgba(16, 24, 39, 0.66);

  b {
    color: rgba(16, 24, 39, 0.92);
  }
`;