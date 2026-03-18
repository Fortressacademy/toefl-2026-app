import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { loadReadingMockById } from "../data/mocks/mockLoader";

import DocFrame from "../components/reading/DocFrame";
import EmailDoc from "../components/reading/EmailDoc";
import NoticeDoc from "../components/reading/NoticeDoc";
import AdsDoc from "../components/reading/AdsDoc";
import ScheduleDoc from "../components/reading/ScheduleDoc";
import TextMessageDoc from "../components/reading/TextMessageDoc";
import QuestionPanel from "../components/reading/QuestionPanel";

const LS_READING_MOCK_PROGRESS = "reading_mock_progress_v1";

const MODULE1_TIME = 20 * 60; // 20:00
const MODULE2_TIME = 8 * 60 + 30; // 8:30

/* ================= utils ================= */
function safeJsonParse(raw, fallback) {
  try {
    const v = JSON.parse(raw);
    return v ?? fallback;
  } catch {
    return fallback;
  }
}
function loadAllProgress() {
  if (typeof window === "undefined") return {};
  return safeJsonParse(localStorage.getItem(LS_READING_MOCK_PROGRESS), {});
}
function saveAllProgress(all) {
  localStorage.setItem(LS_READING_MOCK_PROGRESS, JSON.stringify(all));
}
function removeProgress(mockId) {
  const all = loadAllProgress();
  delete all[mockId];
  saveAllProgress(all);
}
function onlyLetters(s) {
  return String(s || "").replace(/[^a-zA-Z]/g, "").toLowerCase();
}
function hasKorean(s) {
  return /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(String(s || ""));
}
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
function renderSlots(typedPart, len) {
  const out = [];
  for (let i = 0; i < len; i++) out.push(typedPart[i] || "_");
  return out.join(" ");
}
function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}
function toastDedup(setToast, lastRef, msg, ms = 1100) {
  const now = Date.now();
  if (lastRef.current.msg === msg && now - lastRef.current.at < 700) return;
  lastRef.current = { msg, at: now };
  setToast(msg);
  window.clearTimeout(toastDedup._t);
  toastDedup._t = window.setTimeout(() => setToast(null), ms);
}
function formatClock(sec) {
  const s = Math.max(0, Number(sec || 0));
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

function escapeRegExp(str) {
  return String(str || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getQuestionHighlightText(qObj) {
  if (!qObj) return "";

  if (qObj.highlight) return String(qObj.highlight).trim();

  const qText = String(qObj.q || "");
  const quoted = qText.match(/'([^']+)'|"([^"]+)"/);
  if (quoted) return String(quoted[1] || quoted[2] || "").trim();

  return "";
}

function renderHighlightedPassage(text, highlight) {
  const rawText = String(text || "");
  const target = String(highlight || "").trim();

  if (!rawText) return rawText;
  if (!target) return rawText;

  const escaped = escapeRegExp(target);
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = rawText.split(regex);

  if (parts.length <= 1) return rawText;

  return parts.map((part, idx) =>
    part.toLowerCase() === target.toLowerCase() ? (
      <InlineHighlight key={`${part}-${idx}`}>{part}</InlineHighlight>
    ) : (
      <span key={`${part}-${idx}`}>{part}</span>
    )
  );
}

function isSentenceInsertionQuestion(qObj) {
  return qObj?.questionType === "sentence_insertion";
}

function parseSentenceInsertionQuestion(text) {
  const raw = String(text || "");
  const parts = raw.split("\n\n").map((s) => s.trim()).filter(Boolean);

  return {
    lead: parts[0] || "",
    sentence: String(parts[1] || "").replace(/^['"]|['"]$/g, ""),
    ask: parts[2] || "",
  };
}

function getInsertionSelectedLabel(picked) {
  if (!picked) return null;
  return `[${String(picked).trim().toUpperCase()}]`;
}

function inferDocType(passage, sectionType) {
  if (passage?.docType) {
    const raw = String(passage.docType).toLowerCase().trim();
    if (raw === "text_messages" || raw === "textmessage" || raw === "text_message") {
      return "textmessage";
    }
    if (raw === "advertisement") return "ads";
    return raw;
  }

  const title = String(passage?.title || "").toLowerCase().trim();

  if (title.includes("email")) return "email";
  if (title.includes("advertisement") || title === "ad" || title.includes("promo")) return "ads";
  if (title.includes("notice") || title.includes("memo")) return "notice";
  if (title.includes("schedule")) return "schedule";

  if (
    title.includes("text message") ||
    title.includes("text messages") ||
    title.includes("messages") ||
    title.includes("chat")
  ) {
    return "textmessage";
  }

  if (sectionType === "academic") return "article";
  if (sectionType === "daily_life") return "notice";

  return "article";
}

function getPassagePlainText(passage) {
  if (!passage) return "";
  if (typeof passage.body === "string") return passage.body;
  if (typeof passage.text === "string") return passage.text;
  if (Array.isArray(passage.paragraphs)) return passage.paragraphs.join("\n\n");
  return "";
}

function buildDocPayload(passage, sectionType) {
  const docType = inferDocType(passage, sectionType);
  const plainText = getPassagePlainText(passage);

  if (docType === "email") {
    return {
      docType,
      doc: {
        title: passage?.title || "Email",
        to: passage?.to || "Recipient",
        from: passage?.from || "Sender",
        date: passage?.date || "",
        subject: passage?.subject || passage?.title || "Message",
        body: passage?.body || plainText,
      },
    };
  }

  if (docType === "ads") {
    return {
      docType: "ads",
      doc: {
        title: passage?.title || "Advertisement",
        body: passage?.body || plainText,
        brand: passage?.brand || passage?.org || "",
        cta: passage?.cta || "Learn More",
        promoCode: passage?.promoCode || "",
      },
    };
  }

  if (docType === "schedule") {
    return {
      docType,
      doc: {
        title: passage?.title || "Schedule",
        subtitle: passage?.subtitle || "",
        columns: passage?.columns || [],
        rows: passage?.rows || [],
        note: passage?.note || "",
      },
    };
  }

  if (docType === "textmessage") {
    return {
      docType: "textmessage",
      doc: {
        title: passage?.title || "Messages",
        subtitle: passage?.subtitle || "",
        meta: passage?.meta || "",
        participants: passage?.participants || [],
        meId: passage?.meId || "me",
        messages: passage?.messages || [],
        note: passage?.note || "",
      },
    };
  }

  if (docType === "notice") {
    return {
      docType,
      doc: {
        title: passage?.title || "Notice",
        date: passage?.date || "",
        body: passage?.body || plainText,
      },
    };
  }

  return {
    docType: "article",
    doc: {
      title: passage?.title || "Passage",
      body: plainText,
    },
  };
}

function buildQuestionPanelQuestion(mcq) {
  if (!mcq) return null;

  if (mcq.questionType === "sentence_insertion") {
    const raw = String(mcq.q || "");
    const parts = raw.split("\n\n").map((s) => s.trim()).filter(Boolean);
    const sentence = String(parts[1] || "").replace(/^['"]|['"]$/g, "");

    return {
      qNo: mcq.qNo || "",
      type: "insertion",
      sentence,
      options: mcq.options || {},
    };
  }

  return {
    qNo: mcq.qNo || "",
    question: mcq.q,
    options: mcq.options || {},
  };
}

function renderPassageWithInsertionPreview(passageText, picked, insertSentence) {
  const raw = String(passageText || "");
  const label = getInsertionSelectedLabel(picked);
  const sentence = String(insertSentence || "").trim();

  if (!raw) return raw;
  if (!label || !sentence) return raw;

  const parts = raw.split(label);

  if (parts.length < 2) return raw;

  const out = [];
  for (let i = 0; i < parts.length; i++) {
    out.push(<span key={`txt-${i}`}>{parts[i]}</span>);

    if (i < parts.length - 1) {
      out.push(
        <React.Fragment key={`ins-${i}`}>
          <InsertionMarker>{label}</InsertionMarker>
          <InsertedSentencePreview>{sentence}</InsertedSentencePreview>
        </React.Fragment>
      );
    }
  }

  return out;
}

/* ================= CTW grading ================= */
function gradeCTWItem(item, typedMap) {
  const blanks = item?.blanks || [];
  const wrongKeys = [];

  for (const b of blanks) {
    const ansRaw = String(b.answer || "").trim();
    const pLen = clamp(Number.isFinite(b.prefixLen) ? b.prefixLen : 2, 0, 4);
    const need = onlyLetters(ansRaw).slice(pLen);
    const user = onlyLetters(String(typedMap?.[b.key] || ""));
    if (user !== need) wrongKeys.push(b.key);
  }

  const total = blanks.length;
  const wrong = wrongKeys.length;
  const correct = total - wrong;
  return { total, correct, wrong, wrongKeys };
}

/* ================= flatten sections -> screen units ================= */
function buildScreenUnits(module) {
  const units = [];
  const sections = module?.sections || [];

  for (const sec of sections) {
    if (!sec) continue;

    if (sec.type === "ctw_paragraph") {
      const items = sec.items || [];
      for (const item of items) {
        units.push({
          kind: "ctw",
          sectionType: "ctw_paragraph",
          sectionId: sec.title || sec.id || "ctw",
          sectionTitle: sec.title || "Complete the Words",
          title: sec.title || "Complete the Words",
          item,
        });
      }
      continue;
    }

    if (sec.type === "daily_life" || sec.type === "academic") {
      const qs = sec.questions || [];
      for (let qi = 0; qi < qs.length; qi++) {
        units.push({
          kind: "mcq",
          sectionType: sec.type,
          sectionId: sec.title || sec.id || sec.type,
          sectionTitle:
            sec.type === "daily_life" ? "Read in Daily Life" : "Read an Academic Passage",
          passage: sec.passage || null,
          q: qs[qi],
        });
      }
      continue;
    }
  }

  return units;
}

function getTotalPointsForModule(module) {
  let total = 0;
  const sections = module?.sections || [];
  for (const sec of sections) {
    if (!sec) continue;
    if (sec.type === "ctw_paragraph") {
      for (const it of sec.items || []) total += (it?.blanks || []).length;
    } else if (sec.type === "daily_life" || sec.type === "academic") {
      total += (sec.questions || []).length;
    }
  }
  return total;
}

function getTakenMaxScore(mock, secondModuleId) {
  const modules = mock?.modules || {};
  const m1 = getTotalPointsForModule(modules.m1);
  const second = secondModuleId ? getTotalPointsForModule(modules[secondModuleId]) : 0;
  return m1 + second;
}

function getModuleResult(module, moduleId, answers) {
  const units = buildScreenUnits(module);

  let total = 0;
  let correct = 0;
  let wrong = 0;

  for (const unit of units) {
    if (unit.kind === "ctw") {
      const key = `ctw:${moduleId}:${unit.item.id}`;
      const saved = answers?.[key];
      const blankCount = (unit.item?.blanks || []).length;

      total += blankCount;

      if (saved?.submitted) {
        correct += Number.isFinite(saved.correct) ? saved.correct : 0;
        wrong += Number.isFinite(saved.wrong) ? saved.wrong : blankCount;
      } else {
        wrong += blankCount; // ✅ 미응답 전부 오답
      }
      continue;
    }

    if (unit.kind === "mcq") {
      const key = `mcq:${moduleId}:${unit.q.id}`;
      const saved = answers?.[key];

      total += 1;

      if (saved?.submitted && Number.isFinite(saved.correct) && saved.correct === 1) {
        correct += 1;
      } else {
        wrong += 1; // ✅ 미응답도 오답
      }
    }
  }

  return { total, correct, wrong };
}

export default function ReadingMockEngine() {
  const nav = useNavigate();
  const { mockId } = useParams();
  const mock = useMemo(() => loadReadingMockById(mockId), [mockId]);

  const [toast, setToast] = useState(null);
  const lastToastRef = useRef({ msg: "", at: 0 });

  const [exitModalOpen, setExitModalOpen] = useState(false);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const [savedSnapshot, setSavedSnapshot] = useState(null);

  // flow states
  const [screenMode, setScreenMode] = useState("sectionIntro");
  // sectionIntro | moduleIntro | testing | moduleReviewGate | moduleEnd

  // persisted
  const [activeModuleId, setActiveModuleId] = useState("m1");
  const [cursor, setCursor] = useState({ unitIdx: 0 });

  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [module1WrongCount, setModule1WrongCount] = useState(0);
  const [takenSecondModuleId, setTakenSecondModuleId] = useState(null);
  const [completed, setCompleted] = useState(false);

  const [timeLeft, setTimeLeft] = useState(MODULE1_TIME);
  const [showTime, setShowTime] = useState(true);

  // CTW state
  const [ctwTypedMap, setCtwTypedMap] = useState({});
  const [ctwActiveKey, setCtwActiveKey] = useState(null);
  const [ctwLocked, setCtwLocked] = useState(false);
  const ctwInputRef = useRef(null);

  // MCQ state
  const [picked, setPicked] = useState(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  const applyFreshStart = useCallback(() => {
    if (!mock) return;

    setScreenMode("sectionIntro");
    setActiveModuleId("m1");
    setCursor({ unitIdx: 0 });
    setAnswers({});
    setScore(0);
    setMaxScore(getTotalPointsForModule(mock?.modules?.m1));
    setModule1WrongCount(0);
    setTakenSecondModuleId(null);
    setCompleted(false);
    setTimeLeft(MODULE1_TIME);
    setShowTime(true);

    setPicked(null);
    setCtwTypedMap({});
    setCtwActiveKey(null);
    setCtwLocked(false);

    setResumeModalOpen(false);
    setSavedSnapshot(null);
    setIsHydrated(true);
  }, [mock]);

  const applySavedProgress = useCallback(
    (p) => {
      if (!mock) return;

      if (p.activeModuleId) setActiveModuleId(p.activeModuleId);
      if (p.cursor?.unitIdx != null) setCursor({ unitIdx: p.cursor.unitIdx });

      setScreenMode(p.screenMode || "testing");
      setAnswers(p.answers || {});
      setScore(Number.isFinite(p.score) ? p.score : 0);
      setTakenSecondModuleId(p.takenSecondModuleId || null);
      setCompleted(!!p.completed);
      setModule1WrongCount(Number.isFinite(p.module1WrongCount) ? p.module1WrongCount : 0);
      setTimeLeft(Number.isFinite(p.timeLeft) ? p.timeLeft : MODULE1_TIME);
      setShowTime(p.showTime !== false);

      if (Number.isFinite(p.maxScore)) {
        setMaxScore(p.maxScore);
      } else {
        setMaxScore(getTakenMaxScore(mock, p.takenSecondModuleId || null));
      }

      setResumeModalOpen(false);
      setSavedSnapshot(null);
      setIsHydrated(true);
    },
    [mock]
  );

  useEffect(() => {
    if (!mockId || !mock) return;

    const all = loadAllProgress();
    const p = all?.[mockId];

    if (!p) {
      applyFreshStart();
      return;
    }

    setSavedSnapshot(p);
    setResumeModalOpen(true);
    setIsHydrated(false);
  }, [mockId, mock, applyFreshStart]);

  useEffect(() => {
    if (!mockId || !mock || !isHydrated || resumeModalOpen) return;

    const all = loadAllProgress();
    all[mockId] = {
      mockId,
      screenMode,
      activeModuleId,
      cursor,
      answers,
      score,
      maxScore: maxScore || getTakenMaxScore(mock, takenSecondModuleId),
      module1WrongCount,
      takenSecondModuleId,
      completed,
      timeLeft,
      showTime,
      updatedAt: new Date().toISOString(),
    };
    saveAllProgress(all);
  }, [
    mockId,
    mock,
    isHydrated,
    resumeModalOpen,
    screenMode,
    activeModuleId,
    cursor,
    answers,
    score,
    maxScore,
    module1WrongCount,
    takenSecondModuleId,
    completed,
    timeLeft,
    showTime,
  ]);

  // timer
  useEffect(() => {
    if (screenMode !== "testing") return;
    if (timeLeft <= 0) return;

    const t = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(t);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(t);
  }, [screenMode, timeLeft]);

  const activeModule = mock?.modules?.[activeModuleId] || null;
  const units = useMemo(() => buildScreenUnits(activeModule), [activeModule]);
  const unitIdx = clamp(cursor.unitIdx || 0, 0, Math.max(0, units.length - 1));
  const unit = units[unitIdx] || null;
  const totalUnits = units.length || 1;
  const moduleTitle = activeModule?.title || activeModuleId;
  const isModule1 = activeModuleId === "m1";

  const progressText = `Questions ${unitIdx + 1} - ${totalUnits} of ${totalUnits}`;
  const headerClock = formatClock(timeLeft);

  const passageTitle =
    unit?.passage?.title || (unit?.sectionType === "academic" ? "Academic Passage" : "Passage");

  const passageText = useMemo(() => {
    if (!unit?.passage) return "";
    if (typeof unit.passage.text === "string") return unit.passage.text;
    if (typeof unit.passage.body === "string") return unit.passage.body;
    if (Array.isArray(unit.passage.paragraphs)) {
      return unit.passage.paragraphs.join("\n\n");
    }
    return "";
  }, [unit]);

  /* ========================= MCQ unit ========================= */
  const mcq = unit?.kind === "mcq" ? unit.q : null;
  const mcqKey = mcq ? `mcq:${activeModuleId}:${mcq.id}` : null;

  const docBundle = useMemo(() => {
    if (!unit?.passage) return null;
    return buildDocPayload(unit.passage, unit.sectionType);
  }, [unit]);

  const panelQuestion = useMemo(() => {
    if (!mcq) return null;
    return buildQuestionPanelQuestion(mcq);
  }, [mcq]);

  const questionHighlight = useMemo(() => {
    if (!mcq) return "";
    return getQuestionHighlightText(mcq);
  }, [mcq]);

  const insertionParsed = useMemo(() => {
    if (!isSentenceInsertionQuestion(mcq)) return null;
    return parseSentenceInsertionQuestion(mcq?.q);
  }, [mcq]);

  useEffect(() => {
    if (!isHydrated || !mock) return;
    if (screenMode !== "testing") return;
    if (timeLeft > 0) return;

    if (activeModuleId === "m1") {
      const m1Result = getModuleResult(mock?.modules?.m1, "m1", answers);
      const cut = Number.isFinite(mock?.branching?.wrongCut) ? mock.branching.wrongCut : 3;
      const passTo = mock?.branching?.passTo || "m2";
      const failTo = mock?.branching?.failTo || "m3";
      const nextId = m1Result.wrong >= cut ? failTo : passTo;

      setModule1WrongCount(m1Result.wrong);
      setTakenSecondModuleId(nextId);
    }

    setScreenMode("moduleEnd");
  }, [timeLeft, screenMode, activeModuleId, answers, mock, isHydrated]);

  if (!mock) return null;

  const saveAnswer = (key, payload) => {
    setAnswers((prev) => ({ ...prev, [key]: payload }));
  };

  const addScore = (deltaCorrect) => {
    setScore((s) => s + (Number.isFinite(deltaCorrect) ? deltaCorrect : 0));
  };

  const addWrongCount = (deltaWrong) => {
    if (!isModule1) return;
    setModule1WrongCount((w) => w + (Number.isFinite(deltaWrong) ? deltaWrong : 0));
  };

  const onReset = () => {
    if (mockId) removeProgress(mockId);
    applyFreshStart();
    toastDedup(setToast, lastToastRef, "리셋 완료");
  };

  const onSaveAndExit = () => {
    try {
      const all = loadAllProgress();
      all[mockId] = {
        ...(all[mockId] || {}),
        mockId,
        screenMode,
        activeModuleId,
        cursor,
        answers,
        score,
        maxScore,
        module1WrongCount,
        takenSecondModuleId,
        completed,
        timeLeft,
        showTime,
        updatedAt: new Date().toISOString(),
      };
      saveAllProgress(all);
    } catch {}

    nav("/reading");
  };

  const startCurrentModule = () => {
    setCursor({ unitIdx: 0 });
    setScreenMode("testing");
    setTimeLeft(activeModuleId === "m1" ? MODULE1_TIME : MODULE2_TIME);
  };

  const moveToSecondModuleIntro = () => {
    const m1Result = getModuleResult(mock?.modules?.m1, "m1", answers);

    const cut = Number.isFinite(mock?.branching?.wrongCut) ? mock.branching.wrongCut : 3;
    const passTo = mock?.branching?.passTo || "m2";
    const failTo = mock?.branching?.failTo || "m3";
    const nextId = m1Result.wrong >= cut ? failTo : passTo;

    setModule1WrongCount(m1Result.wrong);
    setTakenSecondModuleId(nextId);
    setActiveModuleId(nextId);
    setCursor({ unitIdx: 0 });
    setMaxScore(getTakenMaxScore(mock, nextId));
    setScreenMode("moduleIntro");
    setTimeLeft(MODULE2_TIME);
  };

  const finishExamAndGoResult = () => {
    const finalSecondId = takenSecondModuleId || activeModuleId;
    const finalMaxScore = getTakenMaxScore(mock, finalSecondId);

    const all = loadAllProgress();
    all[mockId] = {
      ...(all[mockId] || {}),
      mockId,
      screenMode: "done",
      activeModuleId,
      cursor,
      answers,
      score,
      maxScore: finalMaxScore,
      module1WrongCount,
      takenSecondModuleId: finalSecondId,
      completed: true,
      completedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveAllProgress(all);

    setTakenSecondModuleId(finalSecondId);
    setMaxScore(finalMaxScore);
    setCompleted(true);

    nav(`/reading/mock/${mockId}/result`, { replace: true });
  };

  const goNextUnit = () => {
    if (unitIdx < totalUnits - 1) {
      setCursor({ unitIdx: unitIdx + 1 });
      return;
    }

    if (activeModuleId === "m1") {
      setScreenMode("moduleReviewGate");
      return;
    }

    if (activeModuleId === "m2" || activeModuleId === "m3") {
      finishExamAndGoResult();
    }
  };

  const goPrevUnit = () => {
    if (unitIdx <= 0) return;
    setCursor({ unitIdx: unitIdx - 1 });
  };

  /* ========================= CTW unit ========================= */
  const ctwItem = unit?.kind === "ctw" ? unit.item : null;

  const ctwTokens = useMemo(() => {
    const text = String(ctwItem?.paragraph || "");
    if (!text) return [];
    const regex = /{{\s*(\d+)\s*}}/g;
    let lastIndex = 0;
    let match;
    const out = [];
    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) out.push({ t: "text", v: text.slice(lastIndex, match.index) });
      out.push({ t: "blank", key: match[1] });
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) out.push({ t: "text", v: text.slice(lastIndex) });
    return out;
  }, [ctwItem]);

  const ctwBlankMap = useMemo(() => {
    const m = {};
    (ctwItem?.blanks || []).forEach((b) => (m[b.key] = b));
    return m;
  }, [ctwItem]);

  const ctwBlankKeys = useMemo(() => {
    const keys = (ctwTokens || []).filter((t) => t.t === "blank").map((t) => t.key);
    return Array.from(new Set(keys));
  }, [ctwTokens]);

  const getNeedLen = (key) => {
    const b = ctwBlankMap[key];
    if (!b) return 0;
    const ans = onlyLetters(String(b.answer || "").trim());
    const p = clamp(Number.isFinite(b.prefixLen) ? b.prefixLen : 2, 0, 4);
    return ans.slice(p).length;
  };

  const getFirstFillableKey = () => {
    for (const k of ctwBlankKeys) if (getNeedLen(k) > 0) return k;
    return ctwBlankKeys[0] || null;
  };

  const getNextFillableKey = (fromKey) => {
    const start = ctwBlankKeys.indexOf(fromKey);
    if (start < 0) return null;
    for (let i = start + 1; i < ctwBlankKeys.length; i++) {
      const k = ctwBlankKeys[i];
      if (getNeedLen(k) > 0) return k;
    }
    return null;
  };

  const activeBlank = useMemo(() => (ctwActiveKey ? ctwBlankMap[ctwActiveKey] : null), [
    ctwActiveKey,
    ctwBlankMap,
  ]);
  const activeAnswer = useMemo(() => String(activeBlank?.answer || "").trim(), [activeBlank]);
  const prefLen = useMemo(
    () => clamp(Number.isFinite(activeBlank?.prefixLen) ? activeBlank.prefixLen : 2, 0, 4),
    [activeBlank]
  );
  const letters = useMemo(() => onlyLetters(activeAnswer), [activeAnswer]);
  const restLetters = useMemo(() => letters.slice(prefLen), [letters, prefLen]);
  const restLen = restLetters.length;

  const ctwTyped = useMemo(() => {
    if (!ctwActiveKey) return "";
    return String(ctwTypedMap[ctwActiveKey] || "");
  }, [ctwTypedMap, ctwActiveKey]);

  const focusCTW = () => {
    const el = ctwInputRef.current;
    if (!el) return;
    el.focus();

    requestAnimationFrame(() => {
      try {
        const len = el.value.length;
        el.setSelectionRange(len, len);
      } catch {}
    });
  };

  useEffect(() => {
    if (!unit || unit.kind !== "ctw") return;

    setPicked(null);

    const key = `ctw:${activeModuleId}:${ctwItem?.id}`;
    const saved = answers?.[key];

    if (saved?.typedMap) {
      setCtwTypedMap(saved.typedMap);
      setCtwActiveKey(saved.activeKey || getFirstFillableKey());
    } else {
      setCtwTypedMap({});
      setCtwActiveKey(getFirstFillableKey());
    }

    setCtwLocked(false);
    setTimeout(focusCTW, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unitIdx, activeModuleId, unit?.kind]);

  const checkCTW = () => {
    if (!ctwItem) return;

    const ansKey = `ctw:${activeModuleId}:${ctwItem.id}`;
    const prev = answers?.[ansKey] || null;
    const g = gradeCTWItem(ctwItem, ctwTypedMap);

    const prevCorrect = Number.isFinite(prev?.correct) ? prev.correct : 0;
    const prevWrong = Number.isFinite(prev?.wrong) ? prev.wrong : 0;

    addScore(g.correct - prevCorrect);
    addWrongCount(g.wrong - prevWrong);

    saveAnswer(ansKey, {
      submitted: true,
      type: "ctw_paragraph",
      moduleId: activeModuleId,
      itemId: ctwItem.id,
      total: g.total,
      correct: g.correct,
      wrong: g.wrong,
      wrongKeys: g.wrongKeys,
      typedMap: ctwTypedMap,
      activeKey: ctwActiveKey,
      at: new Date().toISOString(),
    });

    setCtwLocked(false);
    toastDedup(setToast, lastToastRef, "Saved");
  };

  const resetCTWCurrent = () => {
    setCtwTypedMap({});
    setCtwLocked(false);
    setCtwActiveKey(getFirstFillableKey());
    setTimeout(focusCTW, 0);
  };

  const onCTWKeyDown = (e) => {
    if (!ctwActiveKey) return;
    if (ctwLocked) return;

    if (e.key === "Enter") {
      e.preventDefault();
      checkCTW();
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
      setCtwTypedMap((prev) => ({
        ...prev,
        [ctwActiveKey]: String(prev[ctwActiveKey] || "").slice(0, -1),
      }));
      requestAnimationFrame(focusCTW);
      return;
    }

    if (e.key.length === 1) {
      if (hasKorean(e.key)) {
        e.preventDefault();
        toastDedup(setToast, lastToastRef, "영어만 가능합니다");
        return;
      }

      const c = onlyLetters(e.key);
      if (!c) {
        e.preventDefault();
        return;
      }

      e.preventDefault();

      setCtwTypedMap((prev) => {
        const curTyped = String(prev[ctwActiveKey] || "");
        if (curTyped.length >= restLen) return prev;

        const nextTyped = (curTyped + c).slice(0, restLen);

        if (nextTyped.length >= restLen) {
          const nextKey = getNextFillableKey(ctwActiveKey);
          if (nextKey) {
            requestAnimationFrame(() => {
              setCtwActiveKey(nextKey);
              focusCTW();
            });
          }
        }

        return {
          ...prev,
          [ctwActiveKey]: nextTyped,
        };
      });
    }
  };

  const onCTWChange = (e) => {
    if (!ctwActiveKey) return;
    if (ctwLocked) return;

    const raw = e.target.value;
    if (hasKorean(raw)) {
      toastDedup(setToast, lastToastRef, "영어만 가능합니다");
    }

    const v = onlyLetters(raw).slice(0, restLen);

    setCtwTypedMap((prev) => ({
      ...prev,
      [ctwActiveKey]: v,
    }));

    if (v.length >= restLen) {
      const nextKey = getNextFillableKey(ctwActiveKey);
      if (nextKey) {
        requestAnimationFrame(() => {
          setCtwActiveKey(nextKey);
          focusCTW();
        });
      }
    }
  };

  const onCTWPaste = (e) => {
    if (!ctwActiveKey) return;
    if (ctwLocked) return;

    e.preventDefault();

    const text = e.clipboardData?.getData("text") || "";
    if (hasKorean(text)) {
      toastDedup(setToast, lastToastRef, "영어만 가능합니다");
      return;
    }

    const cleaned = onlyLetters(text);
    if (!cleaned) return;

    setCtwTypedMap((prev) => {
      const curTyped = String(prev[ctwActiveKey] || "");
      const nextTyped = (curTyped + cleaned).slice(0, restLen);

      if (nextTyped.length >= restLen) {
        const nextKey = getNextFillableKey(ctwActiveKey);
        if (nextKey) {
          requestAnimationFrame(() => {
            setCtwActiveKey(nextKey);
            focusCTW();
          });
        }
      }

      return {
        ...prev,
        [ctwActiveKey]: nextTyped,
      };
    });
  };

  const reviewItems = useMemo(() => {
    return units.map((u, idx) => {
      if (u.kind === "ctw") {
        const key = `ctw:${activeModuleId}:${u.item.id}`;
        const saved = answers?.[key];
        const answered = !!saved?.submitted;
        const wrongCount = Number.isFinite(saved?.wrong) ? saved.wrong : 0;

        return {
          idx,
          no: idx + 1,
          kind: "ctw",
          answered,
          flaggedWrong: answered && wrongCount > 0,
          label: `Q${idx + 1}`,
        };
      }

      const key = `mcq:${activeModuleId}:${u.q.id}`;
      const saved = answers?.[key];
      const answered = !!saved?.submitted || !!saved?.picked;

      return {
        idx,
        no: idx + 1,
        kind: "mcq",
        answered,
        flaggedWrong: false,
        label: `Q${idx + 1}`,
      };
    });
  }, [units, answers, activeModuleId]);

  const jumpToQuestion = (idx) => {
    setCursor({ unitIdx: idx });
    setReviewOpen(false);
    setScreenMode("testing");
  };

  useEffect(() => {
    if (!unit || unit.kind !== "mcq") return;

    setCtwTypedMap({});
    setCtwActiveKey(null);
    setCtwLocked(false);

    const saved = mcqKey ? answers?.[mcqKey] : null;
    setPicked(saved?.picked || null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unitIdx, activeModuleId, unit?.kind]);

  const pickChoice = (ch) => {
    if (!mcq || !mcqKey) return;
    setPicked(ch);
    saveAnswer(mcqKey, {
      ...(answers?.[mcqKey] || {}),
      type: unit.sectionType,
      moduleId: activeModuleId,
      qid: mcq.id,
      picked: ch,
      at: new Date().toISOString(),
      submitted: false,
    });
  };

  const submitMCQ = () => {
    if (!mcq || !mcqKey) return;
    if (!picked) {
      toastDedup(setToast, lastToastRef, "보기를 선택하세요");
      return;
    }

    const already = answers?.[mcqKey]?.submitted;
    const isCorrect = picked === mcq.answer;

    if (!already) {
      addScore(isCorrect ? 1 : 0);
      addWrongCount(isCorrect ? 0 : 1);
    }

    saveAnswer(mcqKey, {
      ...(answers?.[mcqKey] || {}),
      submitted: true,
      correct: isCorrect ? 1 : 0,
      answer: mcq.answer,
    });

    toastDedup(setToast, lastToastRef, "Saved");
    goNextUnit();
  };

  const renderSectionIntro = () => (
    <CenterScreen>
      <IntroInner>
        <IntroTitle>Reading section</IntroTitle>
        <IntroRule />
        <IntroText>
          In the Reading section, you will answer 35-50 questions to demonstrate how well you understand academic and
          non-academic texts in English.
        </IntroText>
        <IntroText>There are three types of tasks.</IntroText>

        <TaskTable>
          <thead>
            <tr>
              <th>Type of Task</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Complete the Words</td>
              <td>Fill in the missing letters in a paragraph.</td>
            </tr>
            <tr>
              <td>Read in Daily Life</td>
              <td>Answer questions about everyday reading material.</td>
            </tr>
            <tr>
              <td>Read an Academic Passage</td>
              <td>Answer questions about academic passages.</td>
            </tr>
          </tbody>
        </TaskTable>

        <IntroBtnRow>
          <BlackBtn onClick={() => setScreenMode("moduleIntro")}>Continue</BlackBtn>
        </IntroBtnRow>
      </IntroInner>
    </CenterScreen>
  );

  const renderModuleIntro = () => (
    <CenterScreen $topline>
      <IntroInner>
        <IntroTitle>
          {activeModuleId === "m1" ? "Module 1" : activeModuleId === "m2" ? "Module 2" : "Module 3"}
        </IntroTitle>
        <IntroRule />
        <IntroText>
          The clock will show you how much time you have to complete{" "}
          {activeModuleId === "m1" ? "Module 1" : activeModuleId === "m2" ? "Module 2" : "Module 3"}.
        </IntroText>
        <IntroText>
          You can use Next and Back to move to the next question or return to previous questions within the same
          module.
        </IntroText>
        <IntroText>
          You WILL NOT be able to return to{" "}
          {activeModuleId === "m1" ? "Module 1" : activeModuleId === "m2" ? "Module 2" : "Module 3"} once you leave
          this module.
        </IntroText>

        <IntroBtnRow>
          <BlackBtn onClick={startCurrentModule}>Continue</BlackBtn>
        </IntroBtnRow>
      </IntroInner>
    </CenterScreen>
  );

  const renderModuleReviewGate = () => (
    <CenterScreen>
      <IntroInner>
        <IntroTitle>Time Remaining</IntroTitle>
        <IntroRule />
        <IntroText>
          You have seen all the questions in this READING. As long as there is time remaining, you can check your
          work. Once you leave this module, you WILL NOT be able to return.
        </IntroText>
        <IntroText>
          Select <BlueWord>Back</BlueWord> to go back to the last question in the module.
        </IntroText>
        <IntroText>
          Select <BlueWord>Continue</BlueWord> to leave this module of the reading section.
        </IntroText>

        <IntroBtnRow>
          <WhiteBtn
            onClick={() => {
              setScreenMode("testing");
              setCursor({ unitIdx: Math.max(0, totalUnits - 1) });
            }}
          >
            Back
          </WhiteBtn>
          <BlackBtn onClick={moveToSecondModuleIntro}>Continue</BlackBtn>
        </IntroBtnRow>
      </IntroInner>
    </CenterScreen>
  );

  const renderModuleEnd = () => (
    <CenterScreen>
      <IntroInner>
        <IntroTitle>{activeModuleId === "m1" ? "End of Module 1" : "End of Module"}</IntroTitle>
        <IntroRule />
        <IntroText>
          Your time for {activeModuleId === "m1" ? "Module 1" : activeModuleId.toUpperCase()} of the reading section
          has ended.
        </IntroText>
        <IntroText>
          Select Continue to go to{" "}
          {activeModuleId === "m1"
            ? takenSecondModuleId === "m3"
              ? "Module 3"
              : "Module 2"
            : "the result page"}
          .
        </IntroText>

        <IntroBtnRow>
          <BlackBtn
            onClick={() => {
              if (activeModuleId === "m1") {
                moveToSecondModuleIntro();
              } else {
                finishExamAndGoResult();
              }
            }}
          >
            Continue
          </BlackBtn>
        </IntroBtnRow>
      </IntroInner>
    </CenterScreen>
  );

  const renderTesting = () => (
    <ExamPage>
      <ExamTopBar>
        <ExamTopLeft>
          <SaveBtn onClick={() => setExitModalOpen(true)}>Save & Exit</SaveBtn>
        </ExamTopLeft>

        <ExamTopRight>
          <DarkBtn type="button" onClick={() => setReviewOpen(true)}>
            Review
          </DarkBtn>
          <DarkBtn type="button" onClick={goPrevUnit} disabled={unitIdx <= 0}>
            Back
          </DarkBtn>
          <DarkBtn
            type="button"
            onClick={() => {
              if (unit?.kind === "ctw") {
                checkCTW();
                goNextUnit();
              } else {
                submitMCQ();
              }
            }}
          >
            Next
          </DarkBtn>
        </ExamTopRight>
      </ExamTopBar>

      <ExamSubBar>
        <ExamMetaLeft>
          <b>READING</b>
          <span>|</span>
          <span>{progressText}</span>
        </ExamMetaLeft>

        <ExamMetaRight>
          {showTime ? <span>{headerClock}</span> : <span>--:--</span>}
          <HideTimeBtn onClick={() => setShowTime((v) => !v)}>{showTime ? "Hide Time" : "Show Time"}</HideTimeBtn>
        </ExamMetaRight>
      </ExamSubBar>

      <ExamBody>
        {unit?.kind === "ctw" ? (
          <>
            <ExamTitle>Fill in the missing letters in the paragraph.</ExamTitle>

            <ExamPassage>
              {ctwTokens.map((tk, i) => {
                if (tk.t === "text") return <span key={i}>{tk.v}</span>;

                const b = ctwBlankMap[tk.key];
                if (!b) return null;

                const ansRaw = String(b.answer || "").trim();
                const pLen = clamp(Number.isFinite(b.prefixLen) ? b.prefixLen : 2, 0, 4);
                const pref = takeFirstNLettersOriginal(ansRaw, pLen);
                const rest = onlyLetters(ansRaw).slice(pLen);
                const user = String(ctwTypedMap[tk.key] || "");
                const isActive = tk.key === ctwActiveKey;

                return (
                  <ExamInlineBlank
                    key={i}
                    $active={isActive}
                    $locked={ctwLocked}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCtwActiveKey(tk.key);
                      setTimeout(focusCTW, 0);
                    }}
                  >
                    <WordPrefix>{pref}</WordPrefix>
                    {rest.length > 0 && <WordSlots>{renderSlots(user, rest.length)}</WordSlots>}
                  </ExamInlineBlank>
                );
              })}

              <HiddenInput
                ref={ctwInputRef}
                value={ctwTyped}
                readOnly={ctwLocked}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                onKeyDown={onCTWKeyDown}
                onChange={onCTWChange}
                onPaste={onCTWPaste}
                onFocus={focusCTW}
                aria-label="type letters"
              />
            </ExamPassage>
          </>
        ) : (
          <ExamSplit $isAcademic={docBundle?.docType === "article"}>
            <ExamLeft>
              <DocFrame
                headerLeft={docBundle?.docType?.toUpperCase() || "DOCUMENT"}
                headerRight={docBundle?.doc?.title || passageTitle}
                footerLeft={moduleTitle}
                footerRight={`Question ${unitIdx + 1} / ${totalUnits}`}
                fullBleed={docBundle?.docType === "ads" || docBundle?.docType === "textmessage"}
              >
                {docBundle?.docType === "email" ? (
                  <EmailDoc
                    doc={docBundle.doc}
                    highlight={questionHighlight}
                    insertion={
                      isSentenceInsertionQuestion(mcq)
                        ? {
                            picked,
                            sentence: insertionParsed?.sentence,
                          }
                        : null
                    }
                  />
                ) : docBundle?.docType === "ads" ? (
                  <AdsDoc doc={docBundle.doc} />
                ) : docBundle?.docType === "notice" ? (
                  <NoticeDoc doc={docBundle.doc} />
                ) : docBundle?.docType === "schedule" ? (
                  <ScheduleDoc doc={docBundle.doc} />
                ) : docBundle?.docType === "textmessage" ? (
                  <TextMessageDoc doc={docBundle.doc} />
                ) : (
                  <ArticleDocBody>
                    <h2>{docBundle?.doc?.title || passageTitle}</h2>
                    {passageText ? (
                      isSentenceInsertionQuestion(mcq) ? (
                        renderPassageWithInsertionPreview(passageText, picked, insertionParsed?.sentence)
                      ) : (
                        renderHighlightedPassage(passageText, questionHighlight)
                      )
                    ) : (
                      "—"
                    )}
                  </ArticleDocBody>
                )}
              </DocFrame>
            </ExamLeft>

            <ExamRight>
              <QuestionPanel
                docType={docBundle?.docType === "article" ? "academic" : docBundle?.docType || unit?.sectionType}
                docTitle={docBundle?.doc?.title || passageTitle}
                docIndex={1}
                docTotal={1}
                qIndex={unitIdx + 1}
                qTotal={totalUnits}
                question={panelQuestion}
                picked={picked}
                onPick={pickChoice}
                onPrev={goPrevUnit}
                onNext={submitMCQ}
                canPrev={unitIdx > 0}
                canNext={true}
                nextLabel="Next"
              />
            </ExamRight>
          </ExamSplit>
        )}
      </ExamBody>
    </ExamPage>
  );

  return (
    <Page>
      {screenMode === "sectionIntro" && renderSectionIntro()}
      {screenMode === "moduleIntro" && renderModuleIntro()}
      {screenMode === "moduleReviewGate" && renderModuleReviewGate()}
      {screenMode === "moduleEnd" && renderModuleEnd()}
      {screenMode === "testing" && renderTesting()}

      {reviewOpen ? (
        <ReviewOverlay onClick={() => setReviewOpen(false)}>
          <ReviewModal onClick={(e) => e.stopPropagation()}>
            <ReviewTop>
              <ReviewTitle>
                {activeModuleId === "m1" ? "Module 1 Review" : activeModuleId === "m2" ? "Module 2 Review" : "Module 3 Review"}
              </ReviewTitle>
              <ReviewClose onClick={() => setReviewOpen(false)}>닫기</ReviewClose>
            </ReviewTop>

            <ReviewSub>원하는 번호를 누르면 해당 문제로 바로 이동합니다.</ReviewSub>

            <ReviewGrid>
              {reviewItems.map((item) => (
                <ReviewChip
                  key={item.idx}
                  $active={item.idx === unitIdx}
                  $answered={item.answered}
                  onClick={() => jumpToQuestion(item.idx)}
                >
                  {item.no}
                </ReviewChip>
              ))}
            </ReviewGrid>
          </ReviewModal>
        </ReviewOverlay>
      ) : null}

      {exitModalOpen ? (
        <ExitOverlay onClick={() => setExitModalOpen(false)}>
          <ExitModal onClick={(e) => e.stopPropagation()}>
            <ExitTitle>모의고사를 종료하시겠습니까?</ExitTitle>
            <ExitText>
              현재 진행 상황은 저장되며, 다음에 <b>이어하기</b>로 다시 풀 수 있습니다.
            </ExitText>

            <ExitBtnRow>
              <ExitGhost onClick={() => setExitModalOpen(false)}>취소</ExitGhost>
              <ExitPrimary
                onClick={() => {
                  setExitModalOpen(false);
                  onSaveAndExit();
                }}
              >
                저장 후 종료
              </ExitPrimary>
            </ExitBtnRow>
          </ExitModal>
        </ExitOverlay>
      ) : null}

      {resumeModalOpen ? (
        <ResumeOverlay onClick={() => {}}>
          <ResumeModal onClick={(e) => e.stopPropagation()}>
            <ResumeTitle>이전에 풀던 기록이 있어요</ResumeTitle>
            <ResumeText>이어서 진행할까요, 아니면 처음부터 다시 시작할까요?</ResumeText>

            <ResumeBtnRow>
              <ResumeGhost
                onClick={() => {
                  removeProgress(mockId);
                  applyFreshStart();
                }}
              >
                처음부터
              </ResumeGhost>
              <ResumePrimary
                onClick={() => {
                  if (savedSnapshot) applySavedProgress(savedSnapshot);
                }}
              >
                이어하기
              </ResumePrimary>
            </ResumeBtnRow>
          </ResumeModal>
        </ResumeOverlay>
      ) : null}

      {toast ? <Toast role="status">{toast}</Toast> : null}
    </Page>
  );
}

/* ================= styles ================= */
/* ================= base ================= */
const Page = styled.div`
  min-height: 100vh;
  background: #f3f3f1;
  color: #111;
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
  z-index: 1000;
  padding: 10px 14px;
  border-radius: 999px;
  background: rgba(16, 24, 39, 0.92);
  color: white;
  font-weight: 900;
  font-size: 13px;
  box-shadow: 0 18px 40px rgba(10, 18, 30, 0.2);
  animation: ${toastIn} 0.14s ease-out;
`;

const HiddenInput = styled.input`
  position: fixed;
  left: -9999px;
  opacity: 0;
`;

const WordPrefix = styled.span`
  font: inherit;
  font-weight: 900;
  color: #111;
  user-select: none;
`;

const WordSlots = styled.span`
  font: inherit;
  font-weight: 900;
  letter-spacing: 1px;
  color: #222;
  user-select: none;
`;

/* ================= intro / instruction screens ================= */
const CenterScreen = styled.div`
  min-height: 100vh;
  background: #f3f3f1;
  border-top: ${({ $topline }) => ($topline ? "6px solid #133ea7" : "none")};
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 44px 28px;

  @media (max-width: 768px) {
    padding: 28px 18px;
  }
`;

const IntroInner = styled.div`
  width: min(1500px, 100%);
`;

const IntroTitle = styled.h1`
  margin: 0;
  font-size: 34px;
  line-height: 1.1;
  font-weight: 1000;
  color: #000;
  letter-spacing: -0.4px;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const IntroRule = styled.div`
  margin-top: 14px;
  height: 1px;
  background: rgba(0, 0, 0, 0.45);
`;

const IntroText = styled.p`
  margin: 26px 0 0;
  font-size: 22px;
  line-height: 1.7;
  color: #111;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 17px;
    line-height: 1.7;
  }
`;

const TaskTable = styled.table`
  width: 100%;
  margin-top: 36px;
  border-collapse: collapse;
  table-layout: fixed;
  background: transparent;

  thead th {
    text-align: left;
    padding: 16px 12px;
    background: #dddfe2;
    color: #333;
    font-size: 17px;
    font-weight: 800;
  }

  tbody td {
    padding: 22px 12px;
    border-bottom: 1px solid #e2e2e2;
    vertical-align: middle;
    font-size: 17px;
    color: #111;
    line-height: 1.5;
  }

  tbody td:first-child {
    width: 36%;
    font-weight: 500;
  }

  @media (max-width: 768px) {
    thead th,
    tbody td {
      font-size: 14px;
      padding: 14px 10px;
    }
  }
`;

const IntroBtnRow = styled.div`
  margin-top: 40px;
  display: flex;
  gap: 14px;
  justify-content: flex-end;
  flex-wrap: wrap;
`;

const BlackBtn = styled.button`
  min-width: 138px;
  height: 54px;
  padding: 0 22px;
  border: none;
  border-radius: 16px;
  background: #1f1f1f;
  color: white;
  font-size: 20px;
  font-weight: 900;
  cursor: pointer;

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  &:active {
    transform: translateY(1px);
  }

  @media (max-width: 768px) {
    min-width: 110px;
    height: 48px;
    font-size: 16px;
  }
`;

const WhiteBtn = styled.button`
  min-width: 138px;
  height: 54px;
  padding: 0 22px;
  border: 1px solid #d3d3d3;
  border-radius: 16px;
  background: #fff;
  color: #111;
  font-size: 20px;
  font-weight: 900;
  cursor: pointer;

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  &:active {
    transform: translateY(1px);
  }

  @media (max-width: 768px) {
    min-width: 110px;
    height: 48px;
    font-size: 16px;
  }
`;

const BlueWord = styled.span`
  color: #1e5eff;
  font-weight: 900;
`;

/* ================= exam layout ================= */
const ExamPage = styled.div`
  min-height: 100vh;
  background: #f3f3f1;
`;

const ExamTopBar = styled.div`
  height: 78px;
  background: #133ea7;
  padding: 0 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;

  @media (max-width: 900px) {
    padding: 0 14px;
    height: auto;
    min-height: 72px;
    flex-wrap: wrap;
    padding-top: 12px;
    padding-bottom: 12px;
  }
`;

const ExamTopLeft = styled.div`
  display: flex;
  align-items: center;
`;

const ExamTopRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const SaveBtn = styled.button`
  height: 40px;
  padding: 0 18px;
  border: none;
  border-radius: 999px;
  background: #e9eefc;
  color: #1451ff;
  font-size: 14px;
  font-weight: 900;
  cursor: pointer;

  &:active {
    transform: translateY(1px);
  }
`;

const DarkBtn = styled.button`
  height: 52px;
  padding: 0 24px;
  border: none;
  border-radius: 18px;
  background: #1f1f1f;
  color: white;
  font-size: 15px;
  font-weight: 900;
  cursor: pointer;
  white-space: nowrap;

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  &:active {
    transform: translateY(1px);
  }

  @media (max-width: 768px) {
    height: 46px;
    padding: 0 16px;
    border-radius: 14px;
    font-size: 14px;
  }
`;

const ExamSubBar = styled.div`
  min-height: 64px;
  background: #f7f7f5;
  border-bottom: 1px solid #dbdbdb;
  padding: 0 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;

  @media (max-width: 900px) {
    padding: 10px 14px;
    min-height: auto;
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ExamMetaLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #111;
  font-size: 15px;
  flex-wrap: wrap;

  b {
    font-size: 15px;
    font-weight: 1000;
    letter-spacing: 0;
  }

  span {
    color: #222;
    font-weight: 500;
  }
`;

const ExamMetaRight = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  color: #111;
  font-size: 17px;
  font-weight: 500;
`;

const HideTimeBtn = styled.button`
  border: none;
  background: transparent;
  color: #1e5eff;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  padding: 0;

  &:active {
    transform: translateY(1px);
  }
`;

const ExamBody = styled.div`
  padding: 34px 60px 56px;

  @media (max-width: 1100px) {
    padding: 26px 24px 42px;
  }

  @media (max-width: 768px) {
    padding: 20px 14px 32px;
  }
`;

const ExamTitle = styled.h2`
  margin: 0 0 30px;
  text-align: center;
  font-size: 34px;
  line-height: 1.25;
  font-weight: 1000;
  color: #000;
  letter-spacing: -0.4px;

  @media (max-width: 900px) {
    font-size: 27px;
  }

  @media (max-width: 768px) {
    font-size: 22px;
  }
`;

const ExamPassage = styled.div`
  width: 100%;
  max-width: 1540px;
  margin: 0 auto;
  font-size: 18px;
  line-height: 2.05;
  color: #111;
  font-weight: 500;
  word-break: keep-all;

  @media (max-width: 768px) {
    font-size: 16px;
    line-height: 1.95;
  }
`;

const ExamInlineBlank = styled.span`
  display: inline-flex;
  align-items: baseline;
  gap: 4px;
  min-width: 54px;
  padding: 0 4px 1px;
  margin: 0 1px;
  border-bottom: 1.8px solid #8c8c8c;
  background: ${({ $active }) => ($active ? "rgba(30,94,255,.06)" : "transparent")};
  cursor: ${({ $locked }) => ($locked ? "default" : "text")};
  border-radius: 0;
`;

const ExamSplit = styled.div`
  display: grid;
  grid-template-columns: ${({ $isAcademic }) =>
    $isAcademic ? "minmax(0, 1.32fr) minmax(320px, 0.78fr)" : "minmax(0, 1.02fr) minmax(360px, 0.98fr)"};
  gap: 28px;
  align-items: start;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;
const ExamLeft = styled.div`
  min-height: 420px;
  border-right: 1px solid #dbdbdb;
  padding-right: 26px;

  @media (max-width: 1100px) {
    border-right: none;
    padding-right: 0;
    border-bottom: 1px solid #dbdbdb;
    padding-bottom: 22px;
  }
`;

const ExamRight = styled.div`
  padding-left: 4px;

  @media (max-width: 1100px) {
    padding-left: 0;
  }
`;

const PassageHeading = styled.div`
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: 1000;
  color: #111;
`;

const PassagePre = styled.pre`
  margin: 0;
  white-space: pre-wrap;
  font-family: inherit;
  font-size: 16px;
  line-height: 1.9;
  color: #111;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 15px;
    line-height: 1.8;
  }
`;

const QuestionTitle = styled.h3`
  margin: 0 0 20px;
  font-size: 23px;
  line-height: 1.45;
  color: #111;
  font-weight: 1000;
  letter-spacing: -0.2px;

  @media (max-width: 768px) {
    font-size: 19px;
  }
`;

const OptionStack = styled.div`
  display: grid;
  gap: 12px;
`;

const OptionCard = styled.button`
  width: 100%;
  text-align: left;
  border: 1.5px solid ${({ $picked }) => ($picked ? "#1e5eff" : "#d6d6d6")};
  background: ${({ $picked }) => ($picked ? "rgba(30,94,255,.06)" : "#fff")};
  border-radius: 16px;
  padding: 16px 16px;
  cursor: pointer;
  display: grid;
  grid-template-columns: 38px 1fr;
  gap: 12px;
  align-items: start;
  color: #111;
  font-size: 15px;
  line-height: 1.6;
  font-weight: 500;

  &:active {
    transform: translateY(1px);
  }

  @media (max-width: 768px) {
    padding: 14px 14px;
    font-size: 14px;
  }
`;

const OptionBadge = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: #f2f4f8;
  color: #111;
  font-size: 13px;
  font-weight: 1000;
  border: 1px solid #dbdbdb;
`;

const ReviewOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1200;
  background: rgba(10, 18, 30, 0.42);
  backdrop-filter: blur(4px);
  display: grid;
  place-items: center;
  padding: 18px;
`;

const ReviewModal = styled.div`
  width: min(760px, 100%);
  border-radius: 22px;
  background: white;
  border: 1px solid rgba(16, 24, 39, 0.1);
  box-shadow: 0 28px 70px rgba(10, 18, 30, 0.22);
  padding: 18px;
`;

const ReviewTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const ReviewTitle = styled.div`
  font-size: 22px;
  font-weight: 1000;
  color: #111;
`;

const ReviewClose = styled.button`
  height: 40px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid rgba(16, 24, 39, 0.12);
  background: white;
  font-weight: 900;
  cursor: pointer;
`;

const ReviewSub = styled.div`
  margin-top: 10px;
  font-size: 13px;
  color: rgba(16, 24, 39, 0.62);
`;

const ReviewGrid = styled.div`
  margin-top: 18px;
  display: grid;
  grid-template-columns: repeat(8, minmax(0, 1fr));
  gap: 10px;

  @media (max-width: 640px) {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
`;

const ReviewChip = styled.button`
  height: 48px;
  border-radius: 14px;
  border: 1.5px solid
    ${({ $active, $answered }) =>
      $active ? "#111" : $answered ? "rgba(30,94,255,.35)" : "rgba(16,24,39,.10)"};
  background: ${({ $active, $answered }) => ($active ? "#111" : $answered ? "rgba(30,94,255,.08)" : "#fff")};
  color: ${({ $active }) => ($active ? "#fff" : "#111")};
  font-size: 15px;
  font-weight: 950;
  cursor: pointer;

  &:active {
    transform: translateY(1px);
  }
`;

const ExitOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1300;
  background: rgba(10, 18, 30, 0.45);
  backdrop-filter: blur(4px);
  display: grid;
  place-items: center;
  padding: 18px;
`;

const ExitModal = styled.div`
  width: min(460px, 100%);
  background: white;
  border-radius: 22px;
  border: 1px solid rgba(16, 24, 39, 0.1);
  box-shadow: 0 28px 70px rgba(10, 18, 30, 0.22);
  padding: 22px 20px;
`;

const ExitTitle = styled.div`
  font-size: 22px;
  font-weight: 1000;
  color: #111;
  letter-spacing: -0.2px;
`;

const ExitText = styled.div`
  margin-top: 10px;
  font-size: 14px;
  line-height: 1.6;
  color: rgba(16, 24, 39, 0.68);

  b {
    color: #111;
  }
`;

const ExitBtnRow = styled.div`
  margin-top: 18px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

const ExitGhost = styled.button`
  height: 46px;
  border-radius: 14px;
  border: 1px solid rgba(16, 24, 39, 0.14);
  background: white;
  color: #111;
  font-weight: 900;
  cursor: pointer;
`;

const ExitPrimary = styled.button`
  height: 46px;
  border-radius: 14px;
  border: none;
  background: linear-gradient(135deg, #1e88ff, #0055ff);
  color: white;
  font-weight: 950;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(0, 85, 255, 0.22);
`;

const ResumeOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1350;
  background: rgba(10, 18, 30, 0.48);
  backdrop-filter: blur(4px);
  display: grid;
  place-items: center;
  padding: 18px;
`;

const ResumeModal = styled.div`
  width: min(460px, 100%);
  background: white;
  border-radius: 22px;
  border: 1px solid rgba(16, 24, 39, 0.1);
  box-shadow: 0 28px 70px rgba(10, 18, 30, 0.22);
  padding: 22px 20px;
`;

const ResumeTitle = styled.div`
  font-size: 22px;
  font-weight: 1000;
  color: #111;
  letter-spacing: -0.2px;
`;

const ResumeText = styled.div`
  margin-top: 10px;
  font-size: 14px;
  line-height: 1.6;
  color: rgba(16, 24, 39, 0.68);
`;

const ResumeBtnRow = styled.div`
  margin-top: 18px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

const ResumeGhost = styled.button`
  height: 46px;
  border-radius: 14px;
  border: 1px solid rgba(16, 24, 39, 0.14);
  background: white;
  color: #111;
  font-weight: 900;
  cursor: pointer;
`;

const ResumePrimary = styled.button`
  height: 46px;
  border-radius: 14px;
  border: none;
  background: linear-gradient(135deg, #1e88ff, #0055ff);
  color: white;
  font-weight: 950;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(0, 85, 255, 0.22);
`;

const InlineHighlight = styled.mark`
  background: #fff3a3;
  color: #111;
  padding: 0 2px;
  border-radius: 4px;
  font-weight: 900;
`;

const InsertionQuestionBlock = styled.div`
  display: grid;
  gap: 16px;
  margin-bottom: 20px;
`;

const InsertionLead = styled.div`
  font-size: 21px;
  line-height: 1.6;
  color: #222;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 18px;
    line-height: 1.55;
  }
`;

const InsertionCardWrap = styled.div`
  display: grid;
  gap: 8px;
`;

const InsertionLabel = styled.div`
  font-size: 12px;
  line-height: 1;
  color: #5b6472;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const InsertionSentenceCard = styled.div`
  padding: 18px 20px;
  border-radius: 18px;
  background: #f7f8fb;
  border: 1px solid #d9deea;
  color: #111;
  font-size: 22px;
  line-height: 1.7;
  font-weight: 800;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.7);

  @media (max-width: 768px) {
    padding: 16px 16px;
    font-size: 18px;
    line-height: 1.65;
  }
`;

const InsertionAsk = styled.div`
  font-size: 21px;
  line-height: 1.5;
  color: #111;
  font-weight: 800;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const InsertionMarker = styled.span`
  display: inline;
  color: #4b5563;
  font-weight: 900;
`;

const InsertedSentencePreview = styled.span`
  display: inline;
  margin: 0 6px 0 4px;
  padding: 2px 8px;
  border-radius: 8px;
  background: rgba(30, 94, 255, 0.08);
  border: 1px solid rgba(30, 94, 255, 0.18);
  color: #0f172a;
  font-weight: 700;
`;

const ArticleDocBody = styled.div`
  white-space: pre-wrap;
  font-family: inherit;
  font-size: 16px;
  line-height: 1.7;
  color: #111;
  font-weight: 500;

  h2 {
    margin: 0 0 14px;
    font-family: inherit;
    font-size: 20px;
    line-height: 1.35;
    font-weight: 800;
    color: #111;
    letter-spacing: -0.2px;
  }
`;

/* ================= old structure compatibility ================= */
const TopBar = styled.div`
  display: none;
`;

const TopLeft = styled.div``;
const TopTitle = styled.div``;
const TopSub = styled.div``;
const TopRight = styled.div``;
const Pill = styled.div``;
const TopBtn = styled.button``;
const Shell = styled.div``;
const Grid = styled.div``;
const Pane = styled.div``;
const LeftPane = styled.div``;
const RightPane = styled.div``;
const PaneHeader = styled.div``;
const PaneLabel = styled.div``;
const Mini = styled.div``;
const PassageBox = styled.div``;
const Pre = styled.pre``;
const RightBody = styled.div``;
const HelpLine = styled.div``;
const QTitle = styled.div``;
const ChoiceList = styled.div``;
const Choice = styled.div``;
const Badge = styled.div``;
const BtnRow = styled.div``;
const Primary = styled.button``;
const Ghost = styled.button``;
const FootNote = styled.div``;
const CTWParagraphArea = styled.div``;
const CTWText = styled.div``;
const InlineBlank = styled.span``;