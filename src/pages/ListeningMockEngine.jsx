import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { loadListeningMockById } from "../data/listening/mockLoader";
import ListeningQuestionPanel from "../components/listening/ListeningQuestionPanel";
import {
  speakTTS,
  speakDialogueTurns,
  stopTTS,
  getEnglishVoices,
  pickVoiceByAccent,
  getLangFromAccent,
} from "../utils/listeningTTS";

const LS_LISTENING_MOCK_PROGRESS = "listening_mock_progress_v2";

const MODULE1_TIME = 12 * 60;
const MODULE2_TIME = 8 * 60;

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
  return safeJsonParse(localStorage.getItem(LS_LISTENING_MOCK_PROGRESS), {});
}

function saveAllProgress(all) {
  localStorage.setItem(LS_LISTENING_MOCK_PROGRESS, JSON.stringify(all));
}

function removeProgress(mockId) {
  const all = loadAllProgress();
  delete all[mockId];
  saveAllProgress(all);
}

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function formatClock(sec) {
  const s = Math.max(0, Number(sec || 0));
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

function toastDedup(setToast, lastRef, msg, ms = 1100) {
  const now = Date.now();
  if (lastRef.current.msg === msg && now - lastRef.current.at < 700) return;
  lastRef.current = { msg, at: now };
  setToast(msg);
  window.clearTimeout(toastDedup._t);
  toastDedup._t = window.setTimeout(() => setToast(null), ms);
}

/* ================= units ================= */
function buildScreenUnits(module) {
  const units = [];
  const sections = module?.sections || [];

  for (const sec of sections) {
    if (!sec) continue;
    for (const item of sec.items || []) {
      units.push({
        kind: "listening",
        sectionType: sec.type,
        sectionId: sec.title || sec.id || sec.type,
        sectionTitle: sec.title || sec.type,
        item,
      });
    }
  }

  return units;
}

function getTotalPointsForModule(module) {
  let total = 0;
  const sections = module?.sections || [];
  for (const sec of sections) total += (sec?.items || []).length;
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
    const key = `item:${moduleId}:${unit.item.id}`;
    const saved = answers?.[key];
    total += 1;

    if (saved?.submitted && Number.isFinite(saved.correct) && saved.correct === 1) {
      correct += 1;
    } else {
      wrong += 1;
    }
  }

  return { total, correct, wrong };
}

function getTaskLabel(type) {
  const raw = String(type || "").toLowerCase();
  if (raw === "choose_response") return "Listen and Choose a Response";
  if (raw === "conversation") return "Listen to a Conversation";
  if (raw === "announcement") return "Listen to an Announcement";
  if (raw === "academic_lecture" || raw === "academic_talk") return "Listen to an Academic Talk";
  return "Listening Task";
}

export default function ListeningMockEngine() {
  const nav = useNavigate();
  const { mockId } = useParams();
  const mock = useMemo(() => loadListeningMockById(mockId), [mockId]);

  const [toast, setToast] = useState(null);
  const lastToastRef = useRef({ msg: "", at: 0 });

  const [exitModalOpen, setExitModalOpen] = useState(false);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const [savedSnapshot, setSavedSnapshot] = useState(null);

  const [screenMode, setScreenMode] = useState("sectionIntro");
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

  const [picked, setPicked] = useState(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const [voices, setVoices] = useState([]);
  const lockRef = useRef(false);

  // idle | playing | ready_to_answer
  const [playState, setPlayState] = useState("idle");

  /* ================= voices ================= */
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const synth = window.speechSynthesis;

    const load = () => {
      const v = getEnglishVoices();
      setVoices(v || []);
    };

    load();
    synth.onvoiceschanged = load;

    return () => {
      synth.onvoiceschanged = null;
    };
  }, []);

  /* ================= init / resume ================= */
  const applyFreshStart = useCallback(() => {
    if (!mock) return;

    stopTTS();
    lockRef.current = false;

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
    setPlayState("idle");
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

      setPicked(null);
      setPlayState("idle");
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

  /* ================= timer ================= */
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

  /* ================= current item ================= */
  const activeModule = mock?.modules?.[activeModuleId] || null;
  const units = useMemo(() => buildScreenUnits(activeModule), [activeModule]);
  const unitIdx = clamp(cursor.unitIdx || 0, 0, Math.max(0, units.length - 1));
  const unit = units[unitIdx] || null;
  const totalUnits = units.length || 1;
  const item = unit?.item || null;
  const itemKey = item ? `item:${activeModuleId}:${item.id}` : null;

  const progressText = `Question ${unitIdx + 1} of ${totalUnits}`;
  const headerClock = formatClock(timeLeft);

  /* ================= TTS play ================= */
  const playMockTTS = useCallback(async () => {
    if (!item) return;
    if (lockRef.current) return;

    stopTTS();
    lockRef.current = true;
    setPlayState("playing");

    const accent = item?.accent || "us";
    const lang = getLangFromAccent(accent);

    try {
      if (Array.isArray(item?.dialogue) && item.dialogue.length > 0) {
        await speakDialogueTurns(item.dialogue, {
          voices,
          accent,
          baseLang: lang,
          speakerMap: {
            A: {
              rate: Number(item?.speakerA?.rate ?? 1.01),
              pitch: Number(item?.speakerA?.pitch ?? 1.06),
              baseGap: Number(item?.speakerA?.baseGap ?? 110),
            },
            B: {
              rate: Number(item?.speakerB?.rate ?? 0.94),
              pitch: Number(item?.speakerB?.pitch ?? 0.96),
              baseGap: Number(item?.speakerB?.baseGap ?? 135),
            },
          },
          turnGapMin: 180,
          turnGapMax: 320,
        });
      } else if (item?.transcript) {
        const voice = pickVoiceByAccent(voices, accent);

        await speakTTS(item.transcript, {
          voice,
          lang,
          rate: Number(item?.rate ?? 0.98),
          pitch: Number(item?.pitch ?? 1.0),
          baseGap: Number(item?.baseGap ?? 120),
        });
      } else if (item?.audioText) {
        const voice = pickVoiceByAccent(voices, accent);

        await speakTTS(item.audioText, {
          voice,
          lang,
          rate: Number(item?.rate ?? 0.98),
          pitch: Number(item?.pitch ?? 1.0),
          baseGap: Number(item?.baseGap ?? 120),
        });
      }
    } finally {
      lockRef.current = false;
      setPlayState("ready_to_answer");
    }
  }, [item, voices]);

  /* ================= item load ================= */
  useEffect(() => {
    if (!itemKey) return;

    stopTTS();
    lockRef.current = false;
    setPlayState("idle");
  }, [itemKey]);

  useEffect(() => {
    if (!itemKey) return;

    const saved = answers?.[itemKey];
    setPicked(saved?.picked || null);
  }, [itemKey, answers]);

  /* ================= auto play on entry ================= */
  useEffect(() => {
    if (screenMode !== "testing") return;
    if (!itemKey) return;
    if (playState !== "idle") return;

    let cancelled = false;

    const autoStart = async () => {
      await new Promise((r) => setTimeout(r, 250));
      if (cancelled) return;
      await playMockTTS();
    };

    autoStart();

    return () => {
      cancelled = true;
    };
  }, [screenMode, itemKey, playState, playMockTTS]);

  /* ================= timer end ================= */
  useEffect(() => {
    if (!isHydrated || !mock) return;
    if (screenMode !== "testing") return;
    if (timeLeft > 0) return;

    stopTTS();
    lockRef.current = false;

    if (activeModuleId === "m1") {
      const m1Result = getModuleResult(mock?.modules?.m1, "m1", answers);
      const cut = Number.isFinite(mock?.branching?.wrongCut) ? mock.branching.wrongCut : 2;
      const passTo = mock?.branching?.passTo || "m2";
      const failTo = mock?.branching?.failTo || "m3";
      const nextId = m1Result.wrong >= cut ? failTo : passTo;

      setModule1WrongCount(m1Result.wrong);
      setTakenSecondModuleId(nextId);
    }

    setScreenMode("moduleEnd");
  }, [timeLeft, screenMode, activeModuleId, answers, mock, isHydrated]);

  useEffect(() => {
    return () => {
      stopTTS();
      lockRef.current = false;
    };
  }, []);

  if (!mock) return null;

  const saveAnswer = (key, payload) => {
    setAnswers((prev) => ({ ...prev, [key]: payload }));
  };

  const addScore = (deltaCorrect) => {
    setScore((s) => s + (Number.isFinite(deltaCorrect) ? deltaCorrect : 0));
  };

  const addWrongCount = (deltaWrong) => {
    if (activeModuleId !== "m1") return;
    setModule1WrongCount((w) => w + (Number.isFinite(deltaWrong) ? deltaWrong : 0));
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

    stopTTS();
    lockRef.current = false;
    nav("/listening");
  };

  const startCurrentModule = () => {
    setCursor({ unitIdx: 0 });
    setScreenMode("testing");
    setTimeLeft(activeModuleId === "m1" ? MODULE1_TIME : MODULE2_TIME);
  };

  const moveToSecondModuleIntro = () => {
    const m1Result = getModuleResult(mock?.modules?.m1, "m1", answers);

    const cut = Number.isFinite(mock?.branching?.wrongCut) ? mock.branching.wrongCut : 2;
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

    stopTTS();
    lockRef.current = false;

    nav(`/listening/mock/${mockId}/result`, { replace: true });
  };

  const goNextUnit = () => {
    if (unitIdx < totalUnits - 1) {
      setCursor({ unitIdx: unitIdx + 1 });
      return;
    }

    if (activeModuleId === "m1") {
      moveToSecondModuleIntro();
      return;
    }

    finishExamAndGoResult();
  };

  const pickChoice = (ch) => {
    if (!item || !itemKey) return;
    if (playState !== "ready_to_answer") return;

    setPicked(ch);
    saveAnswer(itemKey, {
      ...(answers?.[itemKey] || {}),
      type: unit.sectionType,
      moduleId: activeModuleId,
      itemId: item.id,
      picked: ch,
      at: new Date().toISOString(),
      submitted: false,
    });
  };

  const submitItem = () => {
    if (!item || !itemKey) return;
    if (!picked) {
      toastDedup(setToast, lastToastRef, "보기를 선택하세요");
      return;
    }

    const already = answers?.[itemKey]?.submitted;
    const isCorrect = picked === item.answer;

    if (!already) {
      addScore(isCorrect ? 1 : 0);
      addWrongCount(isCorrect ? 0 : 1);
    }

    saveAnswer(itemKey, {
      ...(answers?.[itemKey] || {}),
      submitted: true,
      correct: isCorrect ? 1 : 0,
      answer: item.answer,
    });

    goNextUnit();
  };

  const getStatusText = () => {
    if (playState === "playing") return "Listening...";
    if (playState === "ready_to_answer") return "Select the best answer.";
    return "Preparing audio...";
  };

  /* ================= screens ================= */
  const renderSectionIntro = () => (
    <CenterScreen>
      <IntroInner>
        <IntroTitle>Listening Section</IntroTitle>
        <IntroRule />
        <IntroText>
          In the Listening section, you will answer questions about spoken English in academic and everyday situations.
        </IntroText>
        <IntroText>Task types in this section include the following:</IntroText>

        <TaskTable>
          <thead>
            <tr>
              <th>Type of Task</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Listen and Choose a Response</td>
              <td>Select the best response to a short question or statement.</td>
            </tr>
            <tr>
              <td>Listen to a Conversation</td>
              <td>Answer a question about a short conversation.</td>
            </tr>
            <tr>
              <td>Listen to an Announcement</td>
              <td>Answer a question about an announcement.</td>
            </tr>
            <tr>
              <td>Listen to an Academic Talk</td>
              <td>Answer a question about an academic talk.</td>
            </tr>
          </tbody>
        </TaskTable>

        <IntroText>In an actual test, you will not be able to return to previous questions.</IntroText>

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
          {activeModuleId === "m1" ? "Listening Section, Module 1" : `Listening Section, ${activeModule?.title || "Module"}`}
        </IntroTitle>
        <IntroRule />
        <IntroText>The clock will show you how much time you have to complete each question.</IntroText>
        <IntroText>You can use Next to move to the next question.</IntroText>
        <IntroText>You WILL NOT be able to return to previous questions.</IntroText>

        <IntroBtnRow>
          <BlackBtn onClick={startCurrentModule}>Continue</BlackBtn>
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
          Your time for {activeModuleId === "m1" ? "Module 1" : activeModule?.title || "this module"} of the listening section has ended.
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
              if (activeModuleId === "m1") moveToSecondModuleIntro();
              else finishExamAndGoResult();
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
          <NextBtn type="button" onClick={submitItem}>
            Next
          </NextBtn>
        </ExamTopRight>
      </ExamTopBar>

      <ExamSubBar>
        <ExamMetaLeft>
          <b>LISTENING</b>
          <span>|</span>
          <span>{progressText}</span>
        </ExamMetaLeft>

        <ExamMetaRight>
          {showTime ? <span>{headerClock}</span> : <span>--:--</span>}
          <HideTimeBtn onClick={() => setShowTime((v) => !v)}>
            {showTime ? "Hide Time" : "Show Time"}
          </HideTimeBtn>
        </ExamMetaRight>
      </ExamSubBar>

      <ExamBody>
        <TaskTypePill>{getTaskLabel(item?.type)}</TaskTypePill>

        <StatusBox $playing={playState === "playing"}>
          <StatusTitle>{playState === "playing" ? "Listening" : "Question"}</StatusTitle>
          <StatusText>{getStatusText()}</StatusText>
        </StatusBox>

        <ListeningQuestionPanel
          itemType={item?.type}
          title={item?.question || "Choose the best answer."}
          options={item?.options || {}}
          picked={picked}
          onPick={pickChoice}
          canAnswer={playState === "ready_to_answer"}
        />
      </ExamBody>
    </ExamPage>
  );

  return (
    <Page>
      {screenMode === "sectionIntro" && renderSectionIntro()}
      {screenMode === "moduleIntro" && renderModuleIntro()}
      {screenMode === "moduleEnd" && renderModuleEnd()}
      {screenMode === "testing" && renderTesting()}

      {exitModalOpen ? (
        <ExitOverlay onClick={() => setExitModalOpen(false)}>
          <ExitModal onClick={(e) => e.stopPropagation()}>
            <ExitTitle>Exit this test?</ExitTitle>
            <ExitText>Your progress will be saved and you can continue later.</ExitText>

            <ExitBtnRow>
              <ExitGhost onClick={() => setExitModalOpen(false)}>Cancel</ExitGhost>
              <ExitPrimary
                onClick={() => {
                  setExitModalOpen(false);
                  onSaveAndExit();
                }}
              >
                Save & Exit
              </ExitPrimary>
            </ExitBtnRow>
          </ExitModal>
        </ExitOverlay>
      ) : null}

      {resumeModalOpen ? (
        <ResumeOverlay onClick={() => {}}>
          <ResumeModal onClick={(e) => e.stopPropagation()}>
            <ResumeTitle>Saved progress found</ResumeTitle>
            <ResumeText>Would you like to continue where you left off or start over?</ResumeText>

            <ResumeBtnRow>
              <ResumeGhost
                onClick={() => {
                  removeProgress(mockId);
                  applyFreshStart();
                }}
              >
                Start Over
              </ResumeGhost>
              <ResumePrimary
                onClick={() => {
                  if (savedSnapshot) applySavedProgress(savedSnapshot);
                }}
              >
                Continue
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

const CenterScreen = styled.div`
  min-height: 100vh;
  background: #f3f3f1;
  border-top: ${({ $topline }) => ($topline ? "6px solid #133ea7" : "none")};
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 44px 28px;
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
`;

const TaskTable = styled.table`
  width: 100%;
  margin-top: 36px;
  border-collapse: collapse;
  table-layout: fixed;

  thead th {
    text-align: left;
    padding: 16px 12px;
    background: #dddfe2;
    font-size: 17px;
    font-weight: 800;
  }

  tbody td {
    padding: 22px 12px;
    border-bottom: 1px solid #e2e2e2;
    vertical-align: middle;
    font-size: 17px;
    line-height: 1.5;
  }
`;

const IntroBtnRow = styled.div`
  margin-top: 40px;
  display: flex;
  gap: 14px;
  justify-content: flex-end;
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
`;

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
`;

const ExamTopLeft = styled.div`
  display: flex;
  align-items: center;
`;

const ExamTopRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
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
`;

const NextBtn = styled.button`
  height: 52px;
  padding: 0 24px;
  border: none;
  border-radius: 18px;
  background: #1f1f1f;
  color: white;
  font-size: 15px;
  font-weight: 900;
  cursor: pointer;
`;

const ExamSubBar = styled.div`
  min-height: 64px;
  background: #f7f7f5;
  border-bottom: 1px solid #dbdbdb;
  padding: 0 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ExamMetaLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #111;
  font-size: 15px;

  b {
    font-weight: 1000;
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
`;

const ExamBody = styled.div`
  max-width: 980px;
  margin: 0 auto;
  padding: 40px 24px 56px;
`;

const TaskTypePill = styled.div`
  display: inline-flex;
  align-items: center;
  height: 34px;
  padding: 0 14px;
  border-radius: 999px;
  background: rgba(30, 94, 255, 0.08);
  color: #1e5eff;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
`;

const StatusBox = styled.div`
  margin-top: 20px;
  border: 1px solid ${({ $playing }) => ($playing ? "rgba(19,62,167,.25)" : "#dcdcdc")};
  background: ${({ $playing }) => ($playing ? "rgba(19,62,167,.05)" : "#fff")};
  border-radius: 18px;
  padding: 22px 22px;
`;

const StatusTitle = styled.div`
  font-size: 14px;
  font-weight: 900;
  color: #4b5563;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const StatusText = styled.div`
  margin-top: 8px;
  font-size: 30px;
  line-height: 1.2;
  font-weight: 1000;
  color: #111;
`;

const ExitOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1300;
  background: rgba(10, 18, 30, 0.45);
  display: grid;
  place-items: center;
  padding: 18px;
`;

const ExitModal = styled.div`
  width: min(460px, 100%);
  background: white;
  border-radius: 22px;
  padding: 22px 20px;
`;

const ExitTitle = styled.div`
  font-size: 22px;
  font-weight: 1000;
`;

const ExitText = styled.div`
  margin-top: 10px;
  font-size: 14px;
  line-height: 1.6;
  color: rgba(16, 24, 39, 0.68);
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
`;

const ResumeOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1350;
  background: rgba(10, 18, 30, 0.48);
  display: grid;
  place-items: center;
  padding: 18px;
`;

const ResumeModal = styled.div`
  width: min(460px, 100%);
  background: white;
  border-radius: 22px;
  padding: 22px 20px;
`;

const ResumeTitle = styled.div`
  font-size: 22px;
  font-weight: 1000;
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
`;