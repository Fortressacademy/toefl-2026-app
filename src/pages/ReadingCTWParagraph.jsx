// src/pages/ReadingCTWParagraph.jsx
import { useMemo, useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { CTW_TRACK_MAP } from "../data/reading/ctwIndex";

const LS_MYVOCAB = "my_vocab_v1";

/* ================= utils ================= */
function hasKorean(s) {
  return /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(String(s || ""));
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
      } else break;
    } else {
      if (cnt > 0) break;
    }
  }
  return out;
}
// ✅ 슬롯 렌더: "_ _ _" 형태
function renderSlots(typedPart, len) {
  const out = [];
  for (let i = 0; i < len; i++) out.push(typedPart[i] || "_");
  return out.join(" ");
}

export default function ReadingCTWParagraph() {
  const nav = useNavigate();
  const { trackKey } = useParams();
  const pack = CTW_TRACK_MAP[trackKey] || null;

  const items = pack?.items || [];
  const total = items.length;

  const [idx, setIdx] = useState(0);
  const cur = items[idx] || null;

  // paragraph: blank 여러 개
  const [typedMap, setTypedMap] = useState({}); // { "01": "rep...", "02": "sig..." }
  const [activeKey, setActiveKey] = useState(null);
  const [result, setResult] = useState(null); // null | "correct" | "wrong"
  const [toast, setToast] = useState(null);
  const [showHint, setShowHint] = useState(false);

  // ✅ 오답 표시용
  const [wrongKeys, setWrongKeys] = useState([]); // ["07","08"]
  const [wrongDetails, setWrongDetails] = useState([]); // [{ key, correct, typed }]

  const inputRef = useRef(null);
  const lastToastRef = useRef({ msg: "", at: 0 });

  const showToast = (msg) => {
    const now = Date.now();
    const last = lastToastRef.current;
    if (last.msg === msg && now - last.at < 600) return;
    lastToastRef.current = { msg, at: now };

    setToast(msg);
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), 1300);
  };

  const focusInput = () => {
    const el = inputRef.current;
    if (!el) return;
    el.focus();
    requestAnimationFrame(() => {
      try {
        const len = el.value.length;
        el.setSelectionRange(len, len);
      } catch {}
    });
  };

  // blanks -> map
  const blankMap = useMemo(() => {
    const m = {};
    (cur?.blanks || []).forEach((b) => (m[b.key] = b));
    return m;
  }, [cur]);

  // paragraph tokenization: text / blank
const tokens = useMemo(() => {
  const text = String(cur?.paragraph || "");
  if (!text) return [];

  const regex = /{{\s*(\d+)\s*}}/g;
  let lastIndex = 0;
  let match;
  const result = [];

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      result.push({ t: "text", v: text.slice(lastIndex, match.index) });
    }
    result.push({ t: "blank", key: match[1] });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    result.push({ t: "text", v: text.slice(lastIndex) });
  }

  return result;
}, [cur]);

  const progress = useMemo(() => {
    if (!total) return 0;
    return Math.round(((idx + 1) / total) * 100);
  }, [idx, total]);

  const synonymsText = useMemo(() => {
    const arr = Array.isArray(cur?.synonyms) ? cur.synonyms : [];
    return arr.filter(Boolean).join(", ");
  }, [cur]);

  const subjectText = useMemo(() => String(cur?.subject || "general").trim(), [cur]);

  const activeBlank = useMemo(() => (activeKey ? blankMap[activeKey] : null), [activeKey, blankMap]);
  const activeAnswer = useMemo(() => String(activeBlank?.answer || "").trim(), [activeBlank]);

  const prefLen = useMemo(() => {
    const v = Number.isFinite(activeBlank?.prefixLen) ? activeBlank.prefixLen : 2;
    return Math.max(0, Math.min(4, v));
  }, [activeBlank]);

  const letters = useMemo(() => onlyLetters(activeAnswer), [activeAnswer]);
  const restLetters = useMemo(() => letters.slice(prefLen), [letters, prefLen]);
  const restLen = restLetters.length;

const blankKeys = useMemo(() => {
  const keys = (tokens || [])
    .filter((t) => t.t === "blank")
    .map((t) => t.key);

  // 중복 방지 + 등장 순서 유지
  return Array.from(new Set(keys));
}, [tokens]);
  const getNeedLen = (key) => {
    const b = blankMap[key];
    if (!b) return 0;
    const ans = onlyLetters(String(b.answer || "").trim());
    const p = Math.max(0, Math.min(4, Number.isFinite(b.prefixLen) ? b.prefixLen : 2));
    return ans.slice(p).length;
  };

  const getFirstFillableKey = () => {
    const keys = blankKeys || [];
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      if (getNeedLen(k) > 0) return k;
    }
    return keys[0] || null; // 모두 prefixLen로 끝나는 특수 케이스 fallback
  };

  const getNextFillableKey = (fromKey) => {
    const start = blankKeys.indexOf(fromKey);
    if (start < 0) return null;
    for (let i = start + 1; i < blankKeys.length; i++) {
      const k = blankKeys[i];
      if (getNeedLen(k) > 0) return k; // 입력할 글자 있는 blank만
    }
    return null;
  };

  const typed = useMemo(() => {
    if (!activeKey) return "";
    return String(typedMap[activeKey] || "");
  }, [typedMap, activeKey]);

  // ✅ track/idx 바뀌면: typedMap 초기화 + "입력 가능한 첫 blank" 활성
  useEffect(() => {
    setTypedMap({});
    setResult(null);
    setShowHint(false);
    setWrongKeys([]);
    setWrongDetails([]);
    setActiveKey(getFirstFillableKey());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackKey, idx]);

  // ✅ 현재 칸이 다 채워지면 다음 칸으로 자동 이동
  useEffect(() => {
    if (!activeKey || result !== null) return;

    const needLen = getNeedLen(activeKey);
    const user = String(typedMap[activeKey] || "");

    if (needLen > 0 && user.length >= needLen) {
      const next = getNextFillableKey(activeKey);
      if (next && next !== activeKey) {
        setActiveKey(next);
        requestAnimationFrame(focusInput);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typedMap, activeKey, result, blankKeys]);

  // ✅ 오답 디테일까지 만드는 채점
  const checkAll = () => {
    const blanks = cur?.blanks || [];

    const wrongs = [];
    const wrongKeyList = [];

    blanks.forEach((b) => {
      const ansRaw = String(b.answer || "").trim(); // 원문 정답
      const ans = onlyLetters(ansRaw); // 비교용 정답
      const p = Math.max(0, Math.min(4, Number.isFinite(b.prefixLen) ? b.prefixLen : 2));
      const need = ans.slice(p); // 사용자가 입력해야 할 부분

      const userRaw = String(typedMap[b.key] || ""); // 이미 letters only로 저장됨
      const user = onlyLetters(userRaw);

      if (user !== need) {
        wrongKeyList.push(b.key);

        // 화면 표시용 "완성 단어"
        const correctFull = takeFirstNLettersOriginal(ansRaw, p) + need;

        wrongs.push({
          key: b.key,
          typed: userRaw || "(빈칸)",
          correct: correctFull || ansRaw || "",
        });
      }
    });

    const ok = wrongKeyList.length === 0;
    setWrongKeys(wrongKeyList);
    setWrongDetails(wrongs);
    setResult(ok ? "correct" : "wrong");
    showToast(ok ? "정답!" : "오답");
  };

  const resetCurrent = () => {
    setTypedMap({});
    setResult(null);
    setWrongKeys([]);
    setWrongDetails([]);
    setActiveKey(getFirstFillableKey());
    requestAnimationFrame(focusInput);
  };

  const goNext = () => {
    if (!total) return;
    if (idx < total - 1) {
      setIdx((v) => v + 1);
      setTypedMap({});
      setResult(null);
      setWrongKeys([]);
      setWrongDetails([]);
      requestAnimationFrame(focusInput);
    } else {
      showToast("완료!");
      setTimeout(() => nav("/reading"), 350);
    }
  };

  const addAllWrongToMyVocab = () => {
    const blanks = cur?.blanks || [];
    if (!blanks.length) return;

    const list = loadJson(LS_MYVOCAB, []);
    let added = 0;

    blanks.forEach((b) => {
      const word = String(b?.answer || "").trim();
      if (!word) return;

      const ans = onlyLetters(word);
      const p = Math.max(0, Math.min(4, Number.isFinite(b.prefixLen) ? b.prefixLen : 2));
      const need = ans.slice(p);
      const user = onlyLetters(String(typedMap[b.key] || ""));
      const isWrong = user !== need;
      if (!isWrong) return;

      const exists = list.some((x) => normalize(x.word) === normalize(word));
      if (exists) return;

      list.unshift({
        id: `v_${Date.now()}_${b.key}`,
        word,
        meaning: b?.meaning || cur?.meaning || "",
        synonyms: Array.isArray(b?.synonyms)
          ? b.synonyms
          : Array.isArray(cur?.synonyms)
          ? cur.synonyms
          : [],
        forms: b?.forms || cur?.forms || null,
        subject: b?.subject || cur?.subject || "general",
        sentence: String(cur?.paragraph || "").trim(),
        source: pack?.id || "ctw_paragraph",
        addedAt: new Date().toISOString(),
      });
      added += 1;
    });

    saveJson(LS_MYVOCAB, list);
    showToast(added ? `단어장에 ${added}개 추가됨` : "추가할 단어가 없어요");
  };

  // ✅ typing (hidden input 1개)
  const onKeyDown = (e) => {
    if (!activeKey || result !== null) return;

    if (e.key === "Enter") {
      e.preventDefault();
      checkAll();
      return;
    }

    if (
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight" ||
      e.key === "ArrowUp" ||
      e.key === "ArrowDown" ||
      e.key === "Tab"
    ) {
      return;
    }

    if (e.key === "Backspace") {
      e.preventDefault();
      setTypedMap((prev) => ({
        ...prev,
        [activeKey]: String(prev[activeKey] || "").slice(0, -1),
      }));
      requestAnimationFrame(focusInput);
      return;
    }

    if (e.key.length === 1) {
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
      setTypedMap((prev) => {
        const curTyped = String(prev[activeKey] || "");
        if (curTyped.length >= restLen) return prev;
        return { ...prev, [activeKey]: (curTyped + c).slice(0, restLen) };
      });

      requestAnimationFrame(focusInput);
    }
  };

  const onChange = (e) => {
    if (!activeKey || result !== null) return;
    const raw = e.target.value;

    if (hasKorean(raw)) showToast("영어만 가능합니다");

    const v = onlyLetters(raw);
    setTypedMap((prev) => ({ ...prev, [activeKey]: v.slice(0, restLen) }));
  };

  const onPaste = (e) => {
    if (!activeKey || result !== null) return;
    e.preventDefault();

    const text = e.clipboardData?.getData("text") || "";
    if (hasKorean(text)) {
      showToast("영어만 가능합니다");
      return;
    }

    const cleaned = onlyLetters(text);
    if (!cleaned) return;

    setTypedMap((prev) => {
      const curTyped = String(prev[activeKey] || "");
      return { ...prev, [activeKey]: (curTyped + cleaned).slice(0, restLen) };
    });

    requestAnimationFrame(focusInput);
  };

  /* ===================== empty guards ===================== */
  if (!pack) return null;
  if (!total || !cur) return null;

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
                  onClick={() => setShowHint((v) => !v)}
                  aria-expanded={showHint}
                  aria-label="toggle synonyms hint"
                >
                  Hint <HintChevron $open={showHint}>▾</HintChevron>
                </HintBtn>

                {showHint && (
                  <HintBubble role="note" aria-label="synonyms">
                    Synonyms: <b>{synonymsText || "—"}</b>
                  </HintBubble>
                )}
              </HintWrap>
            </CardTop>

            <ParagraphBox onClick={focusInput} role="button" tabIndex={0} aria-label="paragraph blank area">
              <ParagraphText>
                {tokens.map((tk, i) => {
                  if (tk.t === "text") return <span key={i}>{tk.v}</span>;

                  const b = blankMap[tk.key];
                  if (!b) return null;

                  const ansRaw = String(b.answer || "").trim();
                  const pLen = Math.max(0, Math.min(4, Number.isFinite(b.prefixLen) ? b.prefixLen : 2));
                  const pref = takeFirstNLettersOriginal(ansRaw, pLen);
                  const rest = onlyLetters(ansRaw).slice(pLen);

                  const user = String(typedMap[tk.key] || "");
                  const isActive = tk.key === activeKey;
                  const isWrong = result === "wrong" && wrongKeys.includes(tk.key);

                  return (
                    <InlineBlank
                      key={i}
                      $active={isActive}
                      $wrong={isWrong}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (result !== null) return;

                        setActiveKey(tk.key);

                        // ✅ 클릭 시 해당 칸 지우고 다시 입력 가능
                        setTypedMap((prev) => ({ ...prev, [tk.key]: "" }));

                        setTimeout(focusInput, 0);
                      }}
                      aria-label={`blank ${tk.key}`}
                    >
                      <WordPrefix>{pref}</WordPrefix>
                      {rest.length > 0 && <WordSlots>{renderSlots(user, rest.length)}</WordSlots>}
                    </InlineBlank>
                  );
                })}

                {/* hidden input 1개 (active blank에만 연결) */}
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
              </ParagraphText>
            </ParagraphBox>

            <HelperRow>
              <HelperText>빈칸을 눌러 입력하세요. (Enter = Check)</HelperText>
              <MicroTag>
                subject: <b>{subjectText}</b>
              </MicroTag>
            </HelperRow>

            <Actions>
              {result === null && (
                <Primary onClick={checkAll} aria-label="check">
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
                  <SubAction onClick={addAllWrongToMyVocab}>틀린 단어 · 나의 단어장에 추가</SubAction>
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
              <>
                <Feedback>
                  <Dot />
                  Wrong · 아래에서 틀린 빈칸을 확인하세요
                </Feedback>

                {/* ✅ 오답 상세 */}
                {wrongDetails.length > 0 && (
                  <WrongList aria-label="wrong details">
                    {wrongDetails.map((w) => (
                      <WrongRow key={w.key}>
                        <WrongKey>#{w.key}</WrongKey>
                        <WrongText>
                          입력: <b>{w.typed}</b> → 정답: <b>{w.correct}</b>
                        </WrongText>
                      </WrongRow>
                    ))}
                  </WrongList>
                )}
              </>
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

const ParagraphBox = styled.div`
  border-radius: 18px;
  border: 1px solid rgba(16, 24, 39, 0.10);
  background: rgba(255, 255, 255, 0.70);
  padding: 14px 14px;
`;

const ParagraphText = styled.div`
  font-size: 18px;
  line-height: 1.75;
  font-weight: 900;
  letter-spacing: -0.2px;
  color: rgba(16, 24, 39, 0.92);

  @media (max-width: 420px) {
    font-size: 17px;
  }
`;

const InlineBlank = styled.span`
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
  padding: 4px 10px;
  margin: 0 4px;
  border-radius: 14px;
  cursor: text;

  border: 1px solid
    ${({ $wrong, $active }) =>
      $wrong ? "rgba(255,77,77,.45)" : $active ? "rgba(30,136,255,.35)" : "rgba(30,136,255,.18)"};

  background: ${({ $wrong, $active }) =>
    $wrong ? "rgba(255,77,77,.10)" : $active ? "rgba(30,136,255,.12)" : "rgba(30,136,255,.06)"};

  box-shadow: 0 10px 20px rgba(0, 90, 255, 0.06);
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

const HiddenInput = styled.input`
  position: fixed;
  left: -9999px;
  opacity: 0;
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

const WrongList = styled.div`
  margin-top: 10px;
  border-radius: 14px;
  border: 1px solid rgba(255, 77, 77, 0.18);
  background: rgba(255, 77, 77, 0.06);
  padding: 10px 12px;
  display: grid;
  gap: 8px;
`;

const WrongRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: baseline;
`;

const WrongKey = styled.div`
  min-width: 48px;
  font-weight: 950;
  color: rgba(16, 24, 39, 0.88);
`;

const WrongText = styled.div`
  font-size: 13px;
  font-weight: 900;
  color: rgba(16, 24, 39, 0.72);

  b {
    color: rgba(16, 24, 39, 0.92);
  }
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