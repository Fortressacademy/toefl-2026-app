// src/pages/MyVocab.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { getShortCategory } from "../utils/categoryShort";

const LS_MYVOCAB = "my_vocab_v1";
const LS_HIDE_MEANING = "myvocab_hide_meaning_v1";

/* ================= utils ================= */

function safeArr(v) {
  return Array.isArray(v) ? v.filter(Boolean) : [];
}
function toStr(v) {
  return String(v ?? "");
}
function lower(v) {
  return toStr(v).toLowerCase();
}
function formatDate(iso) {
  try {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString();
  } catch {
    return "";
  }
}
function titleCase(s) {
  const v = toStr(s).trim();
  if (!v) return "General";
  return v.slice(0, 1).toUpperCase() + v.slice(1);
}
function readBool(key, fallback = false) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return raw === "1";
  } catch {
    return fallback;
  }
}
function saveBool(key, v) {
  try {
    localStorage.setItem(key, v ? "1" : "0");
  } catch {
    // ignore
  }
}

/** ✅ 기존 저장 데이터(구버전)까지 깨지지 않게 정규화 */
function normalizeEntry(x) {
  const word = toStr(x?.word).trim();

  // 과거 필드 호환: hint / sentence / example
  const sentence = toStr(x?.sentence || "");
  const example = toStr(x?.example || sentence || "");

  // 뜻(meaning) 호환
  const meaning = toStr(x?.meaning || x?.hint || "").trim();

  // 동의어(synonyms) 호환
  const synonyms =
    safeArr(x?.synonyms).length > 0 ? safeArr(x?.synonyms) : safeArr(x?.syns) || [];

  // 품사/파생형(forms) 호환
  const forms = x?.forms && typeof x.forms === "object" ? x.forms : null;

  // 과목(subject) 호환
  const subject = toStr(x?.subject || "general").trim() || "general";

  return {
    id: toStr(x?.id || `v_${Date.now()}_${Math.random().toString(16).slice(2)}`),
    word,
    meaning,
    synonyms,
    forms,
    subject,
    example,
    sentence,
    source: toStr(x?.source || ""),
    addedAt: x?.addedAt || new Date().toISOString(),
  };
}

function loadVocab() {
  try {
    const raw = localStorage.getItem(LS_MYVOCAB);
    const arr = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(arr)) return [];
    return arr.map(normalizeEntry).filter((x) => x.word);
  } catch {
    return [];
  }
}

function saveVocab(list) {
  localStorage.setItem(LS_MYVOCAB, JSON.stringify(list));
}

/* ================= ✅ QUIZ utils (ADD ONLY) ================= */

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function uniq(arr) {
  return Array.from(new Set(arr));
}
function pickN(arr, n) {
  const a = shuffle(arr);
  return a.slice(0, Math.max(0, n));
}
function normalizeMeaningText(s) {
  return toStr(s)
    .replace(/\([^)]*\)/g, " ")
    .replace(/[\u2022•]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}
function buildMeaningOptions(items, correctItem) {
  const pool = items
    .map((x) => x?.meaning)
    .map((m) => toStr(m).trim())
    .filter(Boolean);

  const correct = toStr(correctItem?.meaning).trim();
  if (!correct) return null;

  const correctKey = normalizeMeaningText(correct);
  const distract = uniq(
    pool.filter((m) => normalizeMeaningText(m) && normalizeMeaningText(m) !== correctKey)
  );

  const wrong3 = pickN(distract, 3);
  const options = shuffle([correct, ...wrong3]).slice(0, 4);

  // 4개가 안되면(뜻이 빈 게 많거나 중복이 심하면) null → synonym 모드로 우회
  if (options.length < 4) return null;

  const idx = options.findIndex((x) => normalizeMeaningText(x) === correctKey);
  return { options, answerIndex: idx < 0 ? 0 : idx };
}
function buildSynOptions(items, correctItem) {
  const syns = safeArr(correctItem?.synonyms).map((s) => toStr(s).trim()).filter(Boolean);
  if (syns.length === 0) return null;

  const correct = syns[0];

  const pool = uniq(
    items
      .flatMap((x) => safeArr(x?.synonyms))
      .map((s) => toStr(s).trim())
      .filter(Boolean)
      .filter((s) => s.toLowerCase() !== correct.toLowerCase())
  );

  const wrong3 = pickN(pool, 3);
  const options = shuffle([correct, ...wrong3]).slice(0, 4);
  if (options.length < 4) return null;

  const ans = options.findIndex((x) => x.toLowerCase() === correct.toLowerCase());
  return { options, answerIndex: ans < 0 ? 0 : ans };
}
function makeQuizDeck(items) {
  // 의미가 있는 항목만 출제 대상으로
  const base = items
    .map((x) => x)
    .filter((x) => toStr(x?.word).trim())
    .filter((x) => toStr(x?.meaning).trim() || safeArr(x?.synonyms).length > 0);

  const deck = shuffle(base).map((it) => {
    const meaningPack = buildMeaningOptions(base, it);
    if (meaningPack) {
      return {
        id: it.id,
        mode: "meaning",
        prompt: it.word,
        options: meaningPack.options,
        answerIndex: meaningPack.answerIndex,
        extra: {
          subject: it.subject,
          meaning: it.meaning,
          synonyms: it.synonyms,
          example: it.example,
        },
      };
    }

    const synPack = buildSynOptions(base, it);
    if (synPack) {
      return {
        id: it.id,
        mode: "syn",
        prompt: it.word,
        options: synPack.options,
        answerIndex: synPack.answerIndex,
        extra: {
          subject: it.subject,
          meaning: it.meaning,
          synonyms: it.synonyms,
          example: it.example,
        },
      };
    }

    // 둘 다 안되면(희박한 케이스) 스킵
    return null;
  });

  return deck.filter(Boolean);
}

/* ================= component ================= */

export default function MyVocab() {
  const nav = useNavigate();

  const [list, setList] = useState(() => loadVocab());
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState(null);
  const [toast, setToast] = useState(null);

  // ✅ 뜻 가리기/보기 (글로벌)
  const [hideMeaning, setHideMeaning] = useState(() => readBool(LS_HIDE_MEANING, false));

  // ✅ Duolingo-ish: subject 필터(선택)
  const subjects = useMemo(() => {
    const map = new Map();
    list.forEach((it) => map.set(it.subject || "general", true));
    return ["all", ...Array.from(map.keys()).sort()];
  }, [list]);
  const [subject, setSubject] = useState("all");

  // ================= ✅ QUIZ states (ADD ONLY) =================
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizDeck, setQuizDeck] = useState([]);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizPicked, setQuizPicked] = useState(null);
  const [quizCorrect, setQuizCorrect] = useState(0);
  const [quizWrong, setQuizWrong] = useState(0);
  const [quizReveal, setQuizReveal] = useState(false);
  const [quizDone, setQuizDone] = useState(false);

  useEffect(() => {
    saveVocab(list);
  }, [list]);

  useEffect(() => {
    saveBool(LS_HIDE_MEANING, hideMeaning);
  }, [hideMeaning]);

  const showToast = (msg) => {
    setToast(msg);
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), 1200);
  };

  const filtered = useMemo(() => {
    const k = q.trim().toLowerCase();

    return list.filter((it) => {
      if (subject !== "all" && (it.subject || "general") !== subject) return false;
      if (!k) return true;

      const w = lower(it.word);
      const m = lower(it.meaning);
      const e = lower(it.example || it.sentence);
      const s = safeArr(it.synonyms).join(", ").toLowerCase();
      const subj = lower(it.subject);

      const formsStr = it.forms
        ? Object.values(it.forms)
            .flat()
            .map((v) => toStr(v))
            .join(", ")
            .toLowerCase()
        : "";

      return (
        w.includes(k) ||
        m.includes(k) ||
        e.includes(k) ||
        s.includes(k) ||
        subj.includes(k) ||
        formsStr.includes(k)
      );
    });
  }, [list, q, subject]);

  const removeOne = (id) => {
    setList((prev) => prev.filter((x) => x.id !== id));
    if (openId === id) setOpenId(null);
    showToast("삭제됨");
  };

  const clearAll = () => {
    if (!window.confirm("단어장을 모두 비울까요?")) return;
    setList([]);
    setOpenId(null);
    showToast("전체 삭제됨");
  };

  const toggleOpen = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  // ✅ forms 렌더 유틸 (빈 값/—는 숨김)
  const renderForms = (forms) => {
    if (!forms) return null;

    const rows = [
      ["V", forms.verb],
      ["PART", forms.part],
      ["ADJ", forms.adj],
      ["ADV", forms.adv],
      ["N", forms.noun],
    ]
      .map(([label, arr]) => [
        label,
        safeArr(arr).filter((v) => toStr(v).trim() && toStr(v).trim() !== "—"),
      ])
      .filter(([, arr]) => arr.length > 0);

    if (rows.length === 0) return null;

    return (
      <FormsGrid>
        {rows.map(([label, arr]) => (
          <FormRow key={label}>
            <Tag $tone={label}>{label}</Tag>
            <FormText>{arr.join(", ")}</FormText>
          </FormRow>
        ))}
      </FormsGrid>
    );
  };

  // ================= ✅ QUIZ handlers (ADD ONLY) =================
  const quizTitle =
    subject === "all" ? "단어장 퀴즈 (All)" : `단어장 퀴즈 (${titleCase(subject)})`;

  const openQuiz = () => {
    const deck = makeQuizDeck(filtered);
    if (deck.length === 0) {
      showToast("퀴즈로 낼 단어가 없어요");
      return;
    }
    setQuizDeck(deck);
    setQuizIdx(0);
    setQuizPicked(null);
    setQuizCorrect(0);
    setQuizWrong(0);
    setQuizReveal(false);
    setQuizDone(false);
    setQuizOpen(true);
  };

  const closeQuiz = () => {
    setQuizOpen(false);
  };

  const currentQ = quizDeck[quizIdx] || null;

  const pickOption = (i) => {
    if (!currentQ) return;
    if (quizReveal) return;
    setQuizPicked(i);
    setQuizReveal(true);

    const ok = i === currentQ.answerIndex;
    if (ok) setQuizCorrect((v) => v + 1);
    else setQuizWrong((v) => v + 1);
  };

  const nextQuestion = () => {
    if (!currentQ) return;
    const last = quizIdx >= quizDeck.length - 1;
    if (last) {
      setQuizDone(true);
      return;
    }
    setQuizIdx((v) => v + 1);
    setQuizPicked(null);
    setQuizReveal(false);
  };

  const restartQuiz = () => {
    const deck = makeQuizDeck(filtered);
    if (deck.length === 0) {
      showToast("퀴즈로 낼 단어가 없어요");
      return;
    }
    setQuizDeck(deck);
    setQuizIdx(0);
    setQuizPicked(null);
    setQuizCorrect(0);
    setQuizWrong(0);
    setQuizReveal(false);
    setQuizDone(false);
  };

  // ESC로 닫기
  useEffect(() => {
    if (!quizOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeQuiz();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [quizOpen]);

  return (
    <Page>
      <Wrap>
        <Header>
          <HeaderLeft>
            <Title>나의 단어장</Title>
            <Sub>틀린 단어를 저장하고, 형태까지 한 번에 정리해요.</Sub>
          </HeaderLeft>

          <HeaderRight>
  <PillBtn onClick={() => nav("/")}>← Home</PillBtn>

  {/* 기존 PillBtn -> QuizPillBtn 으로만 교체 */}
  <QuizPillBtn onClick={openQuiz}>
    <QuizSpark aria-hidden>✨</QuizSpark>
    퀴즈 풀기
  </QuizPillBtn>

  <DangerPill onClick={clearAll}>전체 삭제</DangerPill>
</HeaderRight>
        </Header>

        <Board>
          <SearchRow>
            <SearchIcon aria-hidden>⌕</SearchIcon>

            <Search
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="단어 / 뜻 / 동의어 / 예문 / 과목 / 파생형 검색"
            />

            {/* ✅ 모바일에서도 튕김 없이 한 덩어리로 고정 */}
            <RightMini>
              <HideToggle $active={hideMeaning} onClick={() => setHideMeaning((v) => !v)}>
                <LockIcon>{hideMeaning ? "🔒" : "🔓"}</LockIcon>
                {hideMeaning ? "뜻 가림" : "뜻 보기"}
              </HideToggle>

              <CountPill aria-label="total count">{filtered.length}</CountPill>
            </RightMini>
          </SearchRow>

          {/* ✅ Duolingo-ish chips */}
          <ChipBar>
            {subjects.map((s) => {
              const active = subject === s;
              const label = s === "all" ? "All" : titleCase(s);
              return (
                <ChipBtn key={s} $active={active} onClick={() => setSubject(s)} type="button">
                  {label}
                </ChipBtn>
              );
            })}
          </ChipBar>

          {filtered.length === 0 ? (
            <Empty>
              아직 저장된 단어가 없어요. <br />
              CTW에서 틀린 단어를 “단어장에 추가”로 모아보자.
            </Empty>
          ) : (
            <List>
              {filtered.map((it) => {
                const isOpen = openId === it.id;
                const hideNow = hideMeaning && !isOpen;

                // ✅ 접힘 모드: 뜻 숨김 ON + 닫힘 상태일 때는 "단어만" 카드
                const isCompact = hideMeaning && !isOpen;

                const synTop = safeArr(it.synonyms).slice(0, 2);
                const synMore = safeArr(it.synonyms).length > synTop.length;

                return (
                  <Card key={it.id} $open={isOpen} $compact={isCompact}>
                    <CardTop
                      $compact={isCompact}
                      onClick={() => toggleOpen(it.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggleOpen(it.id);
                        }
                      }}
                    >
                      <CardLeft>
                        <WordBlock>
                          <Word title={it.word}>{it.word}</Word>
                          <BadgeRow>
                            <SubjectBadge>{getShortCategory(it.subject)}</SubjectBadge>
                          </BadgeRow>
                        </WordBlock>

                        {/* ✅ Compact 모드에서는 Summary(뜻/동의어) 자체를 숨김 */}
                        {!isCompact ? (
                          <Summary>
                            <SumBlock>
                              <SumLabel>뜻</SumLabel>
                              <SumValue>{hideNow ? "••••••" : it.meaning || "—"}</SumValue>
                            </SumBlock>

                            {synTop.length > 0 ? (
                              <SumBlock>
                                <SumLabel>동의어</SumLabel>
                                <SumValue $clamp>
                                  {synTop.join(", ")}
                                  {synMore ? " …" : ""}
                                </SumValue>
                              </SumBlock>
                            ) : null}
                          </Summary>
                        ) : null}
                      </CardLeft>

                      <CardRight>
                        <Stamp>{formatDate(it.addedAt)}</Stamp>
                        <IconBtn
                          title="삭제"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeOne(it.id);
                          }}
                        >
                          ✕
                        </IconBtn>
                      </CardRight>
                    </CardTop>

                    {isOpen ? (
                      <CardBody>
                        {it.meaning ? (
                          <DetailRow>
                            <DetailLabel>뜻</DetailLabel>
                            <DetailValue>{hideNow ? "••••••" : it.meaning}</DetailValue>
                          </DetailRow>
                        ) : null}

                        {safeArr(it.synonyms).length > 0 ? (
                          <DetailRow>
                            <DetailLabel>동의어</DetailLabel>
                            <DetailValue>{safeArr(it.synonyms).join(", ")}</DetailValue>
                          </DetailRow>
                        ) : null}

                        {renderForms(it.forms)}
                        {it.example ? <Example>“{it.example}”</Example> : null}

                        <FooterRow>
                          {it.source ? <Source>source: {it.source}</Source> : <span />}
                          <PrimaryMini
                            onClick={() => {
                              navigator.clipboard?.writeText(it.word);
                              showToast("단어 복사됨");
                            }}
                          >
                            단어 복사
                          </PrimaryMini>
                        </FooterRow>
                      </CardBody>
                    ) : null}
                  </Card>
                );
              })}
            </List>
          )}
        </Board>

        {toast ? <Toast role="status">{toast}</Toast> : null}
      </Wrap>

      {/* ================= ✅ QUIZ MODAL (ADD ONLY) ================= */}
      {quizOpen ? (
        <QuizOverlay
  role="dialog"
  aria-modal="true"
  onClick={(e) => {
    if (e.target === e.currentTarget) closeQuiz();
  }}
>
          <QuizSheet>
            <QuizTop>
              <QuizTitle>{quizTitle}</QuizTitle>
              <QuizClose onClick={closeQuiz} aria-label="close">
                ✕
              </QuizClose>
            </QuizTop>

            <QuizMeta>
              <MetaPill>
                {quizDone ? "완료" : `${quizIdx + 1} / ${quizDeck.length}`}
              </MetaPill>
              <MetaPill $ok>정답 {quizCorrect}</MetaPill>
              <MetaPill $bad>오답 {quizWrong}</MetaPill>
            </QuizMeta>

            {!quizDone && currentQ ? (
              <>
                <QuizCard>
                  <QuizPrompt>{currentQ.prompt}</QuizPrompt>
                  <QuizSub>
                    {currentQ.mode === "meaning"
                      ? "뜻을 고르세요"
                      : "가장 적절한 동의어를 고르세요"}
                  </QuizSub>

                  <OptGrid>
                    {currentQ.options.map((opt, i) => {
                      const isAns = i === currentQ.answerIndex;
                      const isPick = quizPicked === i;
                      const show = quizReveal;

                      return (
                        <OptBtn
                          key={`${currentQ.id}_${i}`}
                          onClick={() => pickOption(i)}
                          disabled={quizReveal}
                          $picked={isPick}
                          $reveal={show}
                          $correct={show && isAns}
                          $wrong={show && isPick && !isAns}
                        >
                          <OptKey>{String.fromCharCode(65 + i)}</OptKey>
                          <OptText>{opt}</OptText>
                          {show && isAns ? <OptMark>✓</OptMark> : null}
                          {show && isPick && !isAns ? <OptMark>✕</OptMark> : null}
                        </OptBtn>
                      );
                    })}
                  </OptGrid>

                  {quizReveal ? (
                    <ExplainBox>
                      <ExplainRow>
                        <ExplainLabel>정답</ExplainLabel>
                        <ExplainVal>
                          {String.fromCharCode(65 + currentQ.answerIndex)}.{" "}
                          {currentQ.options[currentQ.answerIndex]}
                        </ExplainVal>
                      </ExplainRow>

                      {/* ✅ 뜻 가림 ON이어도 “퀴즈에서는 항상 공개” */}
                      {toStr(currentQ.extra?.meaning).trim() ? (
                        <ExplainRow>
                          <ExplainLabel>뜻</ExplainLabel>
                          <ExplainVal>{currentQ.extra.meaning}</ExplainVal>
                        </ExplainRow>
                      ) : null}

                      {safeArr(currentQ.extra?.synonyms).length > 0 ? (
                        <ExplainRow>
                          <ExplainLabel>동의어</ExplainLabel>
                          <ExplainVal>{safeArr(currentQ.extra.synonyms).join(", ")}</ExplainVal>
                        </ExplainRow>
                      ) : null}

                      {toStr(currentQ.extra?.example).trim() ? (
                        <ExplainRow>
                          <ExplainLabel>예문</ExplainLabel>
                          <ExplainVal>“{currentQ.extra.example}”</ExplainVal>
                        </ExplainRow>
                      ) : null}
                    </ExplainBox>
                  ) : null}
                </QuizCard>

                <QuizBottom>
                  <QuizMini onClick={restartQuiz} type="button">
                    다시 섞기
                  </QuizMini>
                  <QuizPrimary
                    onClick={nextQuestion}
                    type="button"
                    disabled={!quizReveal}
                    title={!quizReveal ? "정답을 하나 선택하세요" : ""}
                  >
                    {quizIdx >= quizDeck.length - 1 ? "결과 보기" : "다음"}
                  </QuizPrimary>
                </QuizBottom>
              </>
            ) : (
              <DoneBox>
                <DoneTitle>퀴즈 완료</DoneTitle>
                <DoneScore>
                  정답 <b>{quizCorrect}</b> / {quizDeck.length}
                </DoneScore>
                <DoneSub>오답 단어는 단어장에서 다시 눌러서 복습하면 딱 좋아요.</DoneSub>

                <DoneActions>
                  <QuizMini onClick={restartQuiz} type="button">
                    다시 풀기
                  </QuizMini>
                  <QuizPrimary onClick={closeQuiz} type="button">
                    닫기
                  </QuizPrimary>
                </DoneActions>
              </DoneBox>
            )}
          </QuizSheet>
        </QuizOverlay>
      ) : null}
    </Page>
  );
}

/* ================= styles ================= */

const Page = styled.div`
  min-height: 100vh;
  background:
    radial-gradient(900px 520px at 15% -10%, rgba(88, 201, 255, 0.24), transparent 62%),
    radial-gradient(900px 520px at 95% 0%, rgba(78, 255, 206, 0.18), transparent 62%),
    linear-gradient(180deg, #f7fbff, #f6f7fb);
`;

const Wrap = styled.div`
  max-width: 1060px;
  margin: 0 auto;
  padding: 24px;

  @media (max-width: 420px) {
    padding: 18px 14px 22px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
`;

const HeaderLeft = styled.div`
  display: grid;
  gap: 6px;
`;

const Title = styled.div`
  font-size: 28px;
  font-weight: 950;
  letter-spacing: -0.7px;
  color: #0f172a;

  @media (max-width: 420px) {
    font-size: 24px;
  }
`;

const Sub = styled.div`
  font-size: 13px;
  font-weight: 850;
  color: rgba(15, 23, 42, 0.62);
`;

const HeaderRight = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;

  /* ✅ 모바일에서 버튼들이 “예쁘게” 정렬되도록 강제 */
  @media (max-width: 420px) {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;  /* Home | 퀴즈 */
    gap: 10px;

    /* 전체 삭제는 아래 한 줄 전부 먹기 */
    & > button:last-child {
      grid-column: 1 / -1;
    }
  }
`;

const PillBtn = styled.button`
  height: 42px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  background: rgba(255, 255, 255, 0.92);
  font-weight: 950;
  cursor: pointer;
  box-shadow: 0 10px 22px rgba(10, 18, 30, 0.05);
  transition: transform 0.06s ease;

  /* ✅ 텍스트 절대 줄바꿈 금지 */
  white-space: nowrap;

  /* ✅ 버튼 내부 정렬 안정화 */
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:active { transform: translateY(1px); }

  @media (max-width: 420px) {
    height: 40px;
    padding: 0 12px;
    font-size: 13px;
  }
`;

const DangerPill = styled.button`
  height: 42px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid rgba(255, 70, 70, 0.28);
  background: rgba(255, 70, 70, 0.10);
  color: rgba(180, 0, 0, 0.92);
  font-weight: 950;
  cursor: pointer;
  box-shadow: 0 10px 22px rgba(10, 18, 30, 0.05);
  transition: transform 0.06s ease;

  /* ✅ 텍스트 줄바꿈 방지 */
  white-space: nowrap;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:active { transform: translateY(1px); }

  @media (max-width: 420px) {
    height: 40px;
    padding: 0 12px;
    font-size: 13px;
  }
`;

const Board = styled.div`
  margin-top: 14px;
  border-radius: 24px;
  padding: 14px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 20px 60px rgba(10, 18, 30, 0.08);
  backdrop-filter: blur(10px);
`;

const SearchRow = styled.div`
  display: grid;
  grid-template-columns: 28px 1fr auto;
  align-items: center;
  gap: 10px;
  padding: 12px 12px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(15, 23, 42, 0.10);

  @media (max-width: 420px) {
    grid-template-columns: 28px 1fr;
    grid-template-rows: auto auto;
    row-gap: 10px;
  }
`;

const SearchIcon = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: rgba(88, 201, 255, 0.14);
  border: 1px solid rgba(88, 201, 255, 0.18);
  color: rgba(15, 23, 42, 0.75);
  font-weight: 950;
`;

const Search = styled.input`
  width: 100%;
  height: 42px;
  border-radius: 14px;
  border: none;
  padding: 0 4px;
  background: transparent;
  font-weight: 900;
  outline: none;
  color: rgba(15, 23, 42, 0.92);
  min-width: 0;

  &::placeholder {
    color: rgba(15, 23, 42, 0.35);
    font-weight: 850;
  }

  @media (max-width: 420px) {
    height: 40px;
  }
`;

const RightMini = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;

  @media (max-width: 420px) {
    justify-self: end;
    grid-column: 2;
    grid-row: 2;
  }
`;

const ToggleBtn = styled.button`
  height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  border: 1px solid ${({ $on }) => ($on ? "rgba(0,110,255,0.22)" : "rgba(15,23,42,0.12)")};
  background: ${({ $on }) => ($on ? "rgba(0,110,255,0.10)" : "rgba(255,255,255,0.92)")};
  color: rgba(15, 23, 42, 0.78);
  font-weight: 950;
  cursor: pointer;
  white-space: nowrap;
  transition: transform 0.06s ease;

  &:active {
    transform: translateY(1px);
  }

  @media (max-width: 420px) {
    height: 26px;
    padding: 0 10px;
    font-size: 12px;
  }
`;

const CountPill = styled.div`
  min-width: 44px;
  height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.06);
  border: 1px solid rgba(15, 23, 42, 0.08);
  font-weight: 950;
  color: rgba(15, 23, 42, 0.62);
`;

const ChipBar = styled.div`
  margin-top: 10px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const ChipBtn = styled.button`
  height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid ${({ $active }) => ($active ? "rgba(0, 110, 255, 0.22)" : "rgba(15, 23, 42, 0.10)")};
  background: ${({ $active }) => ($active ? "rgba(0, 110, 255, 0.10)" : "rgba(255, 255, 255, 0.92)")};
  color: rgba(15, 23, 42, 0.82);
  font-weight: 950;
  cursor: pointer;
  transition: transform 0.06s ease;
  &:active {
    transform: translateY(1px);
  }
`;

const Empty = styled.div`
  margin-top: 12px;
  border-radius: 18px;
  padding: 18px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(15, 23, 42, 0.08);
  color: rgba(15, 23, 42, 0.62);
  font-weight: 850;
  line-height: 1.6;
`;

const List = styled.div`
  margin-top: 12px;
  display: grid;
  gap: 12px;
`;

const Card = styled.div`
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: ${({ $open }) =>
    $open ? "0 24px 60px rgba(0, 110, 255, 0.10)" : "0 12px 30px rgba(10, 18, 30, 0.06)"};
  overflow: hidden;
  transition: transform 0.08s ease, box-shadow 0.18s ease, border-color 0.18s ease;

  ${({ $open }) =>
    $open &&
    `
    border-color: rgba(0, 110, 255, 0.18);
  `}

  /* ✅ Compact(닫힌) 상태는 더 “납작한 카드” 느낌 */
  ${({ $compact }) =>
    $compact &&
    `
    box-shadow: 0 10px 22px rgba(10, 18, 30, 0.05);
    border-color: rgba(15, 23, 42, 0.07);
  `}
`;

const CardTop = styled.div`
  padding: 14px 14px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  cursor: pointer;

  @media (max-width: 420px) {
    padding: 12px 12px;
    gap: 10px;
  }

  /* ✅ 접힘 모드일 때(= 단어만 보일 때) 높이 줄이기 */
  ${({ $compact }) =>
    $compact &&
    `
    padding: 12px 14px;
    align-items: center;

    @media (max-width: 420px) {
      padding: 11px 12px;
    }
  `}
`;

const CardLeft = styled.div`
  min-width: 0;
`;

const WordLine = styled.div`
  display: grid;
  grid-template-columns: 1fr 64px; /* 단어 | 뱃지(고정폭) */
  align-items: center;
  gap: 10px;
  min-width: 0;

  ${({ $compact }) =>
    $compact &&
    `
    gap: 8px;
  `}
`;

const Word = styled.div`
  font-size: clamp(18px, 4.8vw, 20px);
  font-weight: 950;
  letter-spacing: -0.3px;
  color: rgba(15, 23, 42, 0.95);

  /* ✅ 단어는 무조건 다 보이게 */
  white-space: normal;
  word-break: break-word;
  overflow-wrap: anywhere;
`;

const WordBlock = styled.div`
  display: grid;
  gap: 8px;
  min-width: 0;
`;

const BadgeRow = styled.div`
  display: flex;
  align-items: center;
`;

const SubjectBadge = styled.div`
  height: 26px;
  width: 64px; /* ✅ 통일감 */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  border-radius: 999px;
  background: rgba(0, 110, 255, 0.10);
  border: 1px solid rgba(0, 110, 255, 0.16);
  font-size: 12px;
  font-weight: 950;
  color: rgba(15, 23, 42, 0.75);
  flex-shrink: 0;
`;

const Summary = styled.div`
  margin-top: 10px;
  display: grid;
  gap: 8px;
`;

const SumBlock = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr;
  gap: 10px;
  align-items: baseline;
`;

const SumLabel = styled.div`
  font-size: 12px;
  font-weight: 950;
  color: rgba(15, 23, 42, 0.45);
`;

const SumValue = styled.div`
  font-size: 13px;
  font-weight: 900;
  color: rgba(15, 23, 42, 0.78);
  line-height: 1.5;
  min-width: 0;

  ${({ $clamp }) =>
    $clamp &&
    `
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  `}
`;

const CardRight = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;

  @media (max-width: 420px) {
    gap: 8px;
  }
`;

const Stamp = styled.div`
  font-size: 12px;
  font-weight: 950;
  color: rgba(15, 23, 42, 0.55);
  white-space: nowrap;

  @media (max-width: 420px) {
    font-size: 11px;
  }
`;

const IconBtn = styled.button`
  width: 34px;
  height: 34px;
  border-radius: 12px;
  border: 1px solid rgba(15, 23, 42, 0.10);
  background: rgba(255, 255, 255, 0.94);
  font-weight: 950;
  cursor: pointer;
  color: rgba(15, 23, 42, 0.75);
  transition: transform 0.06s ease;
  &:active {
    transform: translateY(1px);
  }

  @media (max-width: 420px) {
    width: 32px;
    height: 32px;
    border-radius: 11px;
  }
`;

const CardBody = styled.div`
  padding: 0 14px 14px;

  @media (max-width: 420px) {
    padding: 0 12px 12px;
  }
`;

const DetailRow = styled.div`
  margin-top: 10px;
  display: grid;
  grid-template-columns: 48px 1fr;
  gap: 10px;
  align-items: baseline;
`;

const DetailLabel = styled.div`
  font-size: 12px;
  font-weight: 950;
  color: rgba(15, 23, 42, 0.50);
`;

const DetailValue = styled.div`
  font-size: 13px;
  font-weight: 900;
  color: rgba(15, 23, 42, 0.80);
  line-height: 1.6;
  word-break: break-word;
`;

const FormsGrid = styled.div`
  margin-top: 12px;
  display: grid;
  gap: 8px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 62px 1fr;
  gap: 10px;
  align-items: center;
`;

const Tag = styled.div`
  height: 26px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;

  border: 1px solid
    ${({ $tone }) =>
      $tone === "V"
        ? "rgba(0, 140, 255, 0.22)"
        : $tone === "PART"
        ? "rgba(120, 120, 255, 0.22)"
        : $tone === "ADJ"
        ? "rgba(255, 170, 0, 0.24)"
        : $tone === "ADV"
        ? "rgba(0, 200, 140, 0.22)"
        : "rgba(15, 23, 42, 0.14)"};

  background:
    ${({ $tone }) =>
      $tone === "V"
        ? "rgba(0, 140, 255, 0.10)"
        : $tone === "PART"
        ? "rgba(120, 120, 255, 0.10)"
        : $tone === "ADJ"
        ? "rgba(255, 170, 0, 0.10)"
        : $tone === "ADV"
        ? "rgba(0, 200, 140, 0.10)"
        : "rgba(15, 23, 42, 0.06)"};

  font-weight: 950;
  font-size: 12px;
  color: rgba(15, 23, 42, 0.78);
`;

const FormText = styled.div`
  font-size: 13px;
  font-weight: 900;
  color: rgba(15, 23, 42, 0.78);
  line-height: 1.55;
`;

const Example = styled.div`
  margin-top: 12px;
  padding: 12px 12px;
  border-radius: 16px;
  background: rgba(15, 23, 42, 0.04);
  border: 1px solid rgba(15, 23, 42, 0.06);
  font-size: 13px;
  font-weight: 850;
  color: rgba(15, 23, 42, 0.62);
  line-height: 1.6;
`;

const FooterRow = styled.div`
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
`;

const Source = styled.div`
  font-size: 12px;
  font-weight: 900;
  color: rgba(15, 23, 42, 0.52);
`;

const PrimaryMini = styled.button`
  height: 36px;
  padding: 0 14px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  font-weight: 950;
  color: white;
  background: linear-gradient(135deg, rgba(0, 110, 255, 1), rgba(0, 170, 255, 1));
  box-shadow: 0 16px 30px rgba(0, 110, 255, 0.18);
  transition: transform 0.06s ease;
  &:active {
    transform: translateY(1px);
  }
`;

const toastIn = keyframes`
  from { transform: translate(-50%, 10px); opacity: 0; }
  to { transform: translate(-50%, 0px); opacity: 1; }
`;

const Toast = styled.div`
  position: fixed;
  left: 50%;
  bottom: 22px;
  transform: translateX(-50%);
  z-index: 50;

  padding: 10px 14px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.92);
  color: white;
  font-weight: 950;
  font-size: 13px;

  box-shadow: 0 18px 40px rgba(10, 18, 30, 0.20);
  animation: ${toastIn} 0.14s ease-out;
`;

const HideToggle = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;

  ${({ $active }) =>
    $active
      ? `
    background: linear-gradient(135deg, #ff3b3b, #ff6b6b);
    color: white;
    box-shadow: 0 6px 16px rgba(255, 59, 59, 0.35);
  `
      : `
    background: linear-gradient(135deg, #006eff, #5aa9ff);
    color: white;
    box-shadow: 0 6px 16px rgba(0, 110, 255, 0.3);
  `}

  &:hover {
    transform: translateY(-1px);
    opacity: 0.92;
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
  }
`;

const LockIcon = styled.span`
  font-size: 14px;
`;

/* ================= ✅ QUIZ styles (ADD ONLY) ================= */
const sheetIn = keyframes`
  from {
    transform: translate3d(0, 10px, 0) scale(0.98);
    opacity: 0;
  }
  to {
    transform: translate3d(0, 0, 0) scale(1);
    opacity: 1;
  }
`;

const QuizOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(2, 6, 23, 0.48);
  backdrop-filter: blur(6px);

  /* ✅ iOS/안드로이드 모두 안정적인 뷰포트 */
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 12px;
  padding-top: calc(12px + env(safe-area-inset-top));
  padding-bottom: calc(12px + env(safe-area-inset-bottom));

  /* ✅ 모달이 커져도 배경은 고정 */
  overflow: hidden;
`;

/* ✅ 핵심: max-height + flex column + overflow hidden */
const QuizSheet = styled.div`
  width: min(560px, 100%);
  max-height: calc(100dvh - 24px - env(safe-area-inset-top) - env(safe-area-inset-bottom));
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(15, 23, 42, 0.10);
  box-shadow: 0 30px 90px rgba(0, 0, 0, 0.25);

  display: flex;
  flex-direction: column;

  overflow: hidden;
  animation: ${sheetIn} 0.14s ease-out;
`;

/* ✅ 상단바는 항상 보이게 sticky */
const QuizTop = styled.div`
  position: sticky;
  top: 0;
  z-index: 5;

  padding: 14px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;

  background: linear-gradient(180deg, rgba(0, 110, 255, 0.10), rgba(255, 255, 255, 0.92));
  backdrop-filter: blur(6px);
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);
`;

/* ✅ 본문 영역만 스크롤 */
const QuizCard = styled.div`
  padding: 12px 14px 14px;

  flex: 1;
  overflow: auto;
  -webkit-overflow-scrolling: touch; /* iOS 스크롤 */
`;



/* ✅ 하단 버튼도 sticky로 고정(선택) */
const QuizBottom = styled.div`
  position: sticky;
  bottom: 0;
  z-index: 5;

  padding: 12px 14px 14px;
  display: flex;
  justify-content: space-between;
  gap: 10px;

  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(6px);
  border-top: 1px solid rgba(15, 23, 42, 0.06);
`;

const QuizTitle = styled.div`
  font-weight: 950;
  letter-spacing: -0.3px;
  color: rgba(15, 23, 42, 0.92);
`;

const QuizClose = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 14px;
  border: 1px solid rgba(15, 23, 42, 0.10);
  background: rgba(255, 255, 255, 0.92);
  cursor: pointer;
  font-weight: 950;
  color: rgba(15, 23, 42, 0.72);
  touch-action: manipulation;

  &:active {
    transform: translateY(1px);
  }
`;

const QuizMeta = styled.div`
  padding: 0 14px 12px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const MetaPill = styled.div`
  height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  border: 1px solid rgba(15, 23, 42, 0.10);
  background: rgba(15, 23, 42, 0.04);
  font-weight: 900;
  font-size: 12px;
  color: rgba(15, 23, 42, 0.72);

  ${({ $ok }) =>
    $ok &&
    `
    background: rgba(0, 180, 120, 0.10);
    border-color: rgba(0, 180, 120, 0.18);
  `}

  ${({ $bad }) =>
    $bad &&
    `
    background: rgba(255, 70, 70, 0.10);
    border-color: rgba(255, 70, 70, 0.18);
  `}
`;


const QuizPrompt = styled.div`
  font-size: 22px;
  font-weight: 950;
  letter-spacing: -0.4px;
  color: rgba(15, 23, 42, 0.96);
`;

const QuizSub = styled.div`
  margin-top: 6px;
  font-size: 13px;
  font-weight: 850;
  color: rgba(15, 23, 42, 0.58);
`;

const OptGrid = styled.div`
  margin-top: 12px;
  display: grid;
  gap: 10px;
`;

const OptBtn = styled.button`
  width: 100%;
  text-align: left;
  border-radius: 16px;
  border: 1px solid rgba(15, 23, 42, 0.10);
  background: rgba(255, 255, 255, 0.94);
  padding: 12px 12px;
  cursor: pointer;
  display: grid;
  grid-template-columns: 26px 1fr 22px;
  align-items: center;
  gap: 10px;
  font-weight: 900;
  color: rgba(15, 23, 42, 0.86);
  transition: transform 0.06s ease, border-color 0.14s ease, background 0.14s ease;

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    cursor: default;
    opacity: 0.98;
  }

  ${({ $picked }) =>
    $picked &&
    `
    border-color: rgba(0, 110, 255, 0.22);
    background: rgba(0, 110, 255, 0.06);
  `}

  ${({ $reveal, $correct }) =>
    $reveal &&
    $correct &&
    `
    border-color: rgba(0, 180, 120, 0.32);
    background: rgba(0, 180, 120, 0.10);
  `}

  ${({ $reveal, $wrong }) =>
    $reveal &&
    $wrong &&
    `
    border-color: rgba(255, 70, 70, 0.32);
    background: rgba(255, 70, 70, 0.08);
  `}
`;

const OptKey = styled.div`
  width: 26px;
  height: 26px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(15, 23, 42, 0.12);
  background: rgba(15, 23, 42, 0.04);
  font-weight: 950;
  color: rgba(15, 23, 42, 0.72);
`;

const OptText = styled.div`
  min-width: 0;
  line-height: 1.35;
`;

const OptMark = styled.div`
  font-weight: 950;
  color: rgba(15, 23, 42, 0.72);
  text-align: right;
`;

const ExplainBox = styled.div`
  margin-top: 12px;
  border-radius: 16px;
  padding: 12px;
  background: rgba(15, 23, 42, 0.04);
  border: 1px solid rgba(15, 23, 42, 0.06);
  display: grid;
  gap: 8px;
`;

const ExplainRow = styled.div`
  display: grid;
  grid-template-columns: 54px 1fr;
  gap: 10px;
  align-items: baseline;
`;

const ExplainLabel = styled.div`
  font-size: 12px;
  font-weight: 950;
  color: rgba(15, 23, 42, 0.55);
`;

const ExplainVal = styled.div`
  font-size: 13px;
  font-weight: 900;
  color: rgba(15, 23, 42, 0.78);
  line-height: 1.55;
`;



const QuizMini = styled.button`
  height: 40px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  background: rgba(255, 255, 255, 0.92);
  font-weight: 950;
  cursor: pointer;
  &:active {
    transform: translateY(1px);
  }
`;

const QuizPrimary = styled.button`
  height: 40px;
  padding: 0 16px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  font-weight: 950;
  color: white;
  background: linear-gradient(135deg, rgba(0, 110, 255, 1), rgba(0, 170, 255, 1));
  box-shadow: 0 16px 30px rgba(0, 110, 255, 0.18);
  &:active {
    transform: translateY(1px);
  }
  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }
`;

const DoneBox = styled.div`
  padding: 22px 14px 16px;
  display: grid;
  gap: 10px;
  text-align: center;
`;

const DoneTitle = styled.div`
  font-size: 18px;
  font-weight: 950;
  color: rgba(15, 23, 42, 0.92);
`;

const DoneScore = styled.div`
  font-size: 14px;
  font-weight: 900;
  color: rgba(15, 23, 42, 0.78);

  b {
    font-weight: 950;
    color: rgba(0, 110, 255, 0.95);
  }
`;

const DoneSub = styled.div`
  font-size: 12.5px;
  font-weight: 850;
  color: rgba(15, 23, 42, 0.55);
  line-height: 1.5;
`;

const DoneActions = styled.div`
  margin-top: 6px;
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const QuizPillBtn = styled.button`
  height: 42px;
  padding: 0 16px;
  border-radius: 999px;
  border: 1px solid rgba(0, 110, 255, 0.22);
  cursor: pointer;
  font-weight: 950;
  color: white;
  background: linear-gradient(135deg, rgba(0, 110, 255, 1), rgba(0, 170, 255, 1));
  box-shadow: 0 14px 34px rgba(0, 110, 255, 0.26);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.08s ease, box-shadow 0.18s ease, filter 0.18s ease;

  &:hover {
    transform: translateY(-1px);
    filter: brightness(1.02);
    box-shadow: 0 18px 44px rgba(0, 110, 255, 0.30);
  }
  &:active {
    transform: translateY(0px);
    box-shadow: 0 10px 26px rgba(0, 110, 255, 0.22);
  }

  @media (max-width: 420px) {
    height: 40px;
    padding: 0 14px;
  }
`;

const QuizSpark = styled.span`
  font-size: 16px;
  line-height: 1;
`;