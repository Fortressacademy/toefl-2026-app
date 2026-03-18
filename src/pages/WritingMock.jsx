// src/pages/WritingMock.jsx
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import {
  Clock,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Scissors,
  Clipboard,
  Undo2,
  Redo2,
  EyeOff,
  Eye,
} from "lucide-react";

import { getMockById } from "../data/writing/writingIndex";
import {
  gradeTask1,
  LS_WRITING_PROGRESS,
  LS_WRITING_REPORT,
  loadJson,
  saveJson,
} from "../data/writing/writingStore";

import Task1SentenceBuilder from "../components/writing/Task1SentenceBuilder";

/* ================= utils ================= */
const pad2 = (n) => String(n).padStart(2, "0");

function formatMMSS(sec) {
  const s = Math.max(0, Math.floor(sec));
  return `${pad2(Math.floor(s / 60))}:${pad2(s % 60)}`;
}
function safeArr(v) {
  return Array.isArray(v) ? v : [];
}
function wordCount(text) {
  return String(text || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}
function getInitials(name) {
  const raw = String(name || "").trim();
  if (!raw) return "?";
  const parts = raw.split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}
function plainTextFromHtml(html) {
  return String(html || "").replace(/<[^>]+>/g, " ");
}

/* ================= editor helpers ================= */
function applyTextChange(textarea, updater) {
  if (!textarea) return null;

  const value = textarea.value ?? "";
  const start = textarea.selectionStart ?? value.length;
  const end = textarea.selectionEnd ?? value.length;

  const nextValue = updater(value, start, end);
  return nextValue;
}

async function pasteFromClipboard(textarea, setValue) {
  try {
    const clip = await navigator.clipboard.readText();
    if (!textarea) {
      setValue((prev) => `${prev}${clip}`);
      return;
    }

    const next = applyTextChange(textarea, (value, start, end) => {
      return value.slice(0, start) + clip + value.slice(end);
    });

    if (next != null) {
      setValue(next);
      requestAnimationFrame(() => {
        const pos = (textarea.selectionStart ?? 0) + clip.length;
        textarea.focus();
        textarea.setSelectionRange(pos, pos);
      });
    }
  } catch {
    // clipboard permission fail 무시
  }
}

async function cutSelection(textarea, setValue) {
  if (!textarea) return;

  const value = textarea.value ?? "";
  const start = textarea.selectionStart ?? 0;
  const end = textarea.selectionEnd ?? 0;
  const selected = value.slice(start, end);
  if (!selected) return;

  try {
    await navigator.clipboard.writeText(selected);
  } catch {
    // clipboard permission fail 무시
  }

  const next = value.slice(0, start) + value.slice(end);
  setValue(next);

  requestAnimationFrame(() => {
    textarea.focus();
    textarea.setSelectionRange(start, start);
  });
}

function doUndo(textarea) {
  if (!textarea) return;
  textarea.focus();
  document.execCommand("undo");
}
function doRedo(textarea) {
  if (!textarea) return;
  textarea.focus();
  document.execCommand("redo");
}

/* ================= main ================= */
export default function WritingMock() {
  const nav = useNavigate();
  const { mockId } = useParams();
  const [sp] = useSearchParams();

  const mock = useMemo(() => getMockById(mockId), [mockId]);
  const tasks = useMemo(() => safeArr(mock?.tasks), [mock]);
  const taskLimits = useMemo(() => safeArr(mock?.taskTimeLimitsSec), [mock]);
  const totalTasks = tasks.length;

  useEffect(() => {
    if (!mock?.id) nav("/writing");
  }, [mock, nav]);

  const initial = useMemo(() => {
    const resume = sp.get("resume") === "1";
    const savedAll = loadJson(LS_WRITING_PROGRESS, {});
    const saved = savedAll?.[mock?.id];

    if (resume && saved && typeof saved === "object") {
      return saved;
    }

    const limits = taskLimits.map((x) => (typeof x === "number" ? x : 0));

    return {
      startedAt: new Date().toISOString(),
      finishedAt: null,
      screen: "taskIntro",
      taskIndex: 0,
      task1ItemIndex: 0,
      timeLeftByTask: limits,
      answers: {
        task1: {},
        task2: { subject: "", body: "" },
        task3: { body: "" },
      },
    };
  }, [mock?.id, sp, taskLimits]);

  const [screen, setScreen] = useState(initial.screen || "taskIntro");
  const [taskIndex, setTaskIndex] = useState(
    Number.isFinite(initial.taskIndex) ? initial.taskIndex : 0
  );
  const [task1ItemIndex, setTask1ItemIndex] = useState(
    Number.isFinite(initial.task1ItemIndex) ? initial.task1ItemIndex : 0
  );
  const [timeLeftByTask, setTimeLeftByTask] = useState(() => {
    const init = safeArr(initial.timeLeftByTask);
    if (init.length) return init;
    return taskLimits.map((x) => (typeof x === "number" ? x : 0));
  });
  const [answers, setAnswers] = useState(initial.answers);

  const [hideEmailWordCount, setHideEmailWordCount] = useState(false);
  const [hideDiscussionWordCount, setHideDiscussionWordCount] = useState(false);

  const emailBodyRef = useRef(null);
  const discussionBodyRef = useRef(null);

  const startedAtRef = useRef(initial.startedAt ?? new Date().toISOString());
  const autoSaveTick = useRef(0);

  const screenRef = useRef(screen);
  const taskIndexRef = useRef(taskIndex);

  useEffect(() => {
    screenRef.current = screen;
  }, [screen]);

  useEffect(() => {
    taskIndexRef.current = taskIndex;
  }, [taskIndex]);

  useEffect(() => {
    setScreen(initial.screen || "taskIntro");
    setTaskIndex(Number.isFinite(initial.taskIndex) ? initial.taskIndex : 0);
    setTask1ItemIndex(
      Number.isFinite(initial.task1ItemIndex) ? initial.task1ItemIndex : 0
    );

    const initTL = safeArr(initial.timeLeftByTask);
    setTimeLeftByTask(
      initTL.length
        ? initTL
        : taskLimits.map((x) => (typeof x === "number" ? x : 0))
    );

    setAnswers(
      initial.answers || {
        task1: {},
        task2: { subject: "", body: "" },
        task3: { body: "" },
      }
    );
    startedAtRef.current = initial.startedAt ?? new Date().toISOString();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mock?.id]);

  const curTask = tasks[taskIndex];
  const curTimeLeft = timeLeftByTask?.[taskIndex] ?? 0;

  const currentTask1Item =
    curTask?.type === "task1_reorder"
      ? safeArr(curTask?.items)?.[task1ItemIndex] || null
      : null;

  const totalTask1Items =
    curTask?.type === "task1_reorder" ? safeArr(curTask?.items).length : 0;

  /* ================= autosave ================= */
  useEffect(() => {
    if (!mock?.id) return;

    autoSaveTick.current += 1;
    if (autoSaveTick.current % 2 !== 0) return;

    const savedAll = loadJson(LS_WRITING_PROGRESS, {});
    saveJson(LS_WRITING_PROGRESS, {
      ...savedAll,
      [mock.id]: {
        startedAt: startedAtRef.current,
        finishedAt: null,
        screen,
        taskIndex,
        task1ItemIndex,
        timeLeftByTask,
        answers,
      },
    });
  }, [answers, screen, taskIndex, task1ItemIndex, timeLeftByTask, mock?.id]);

  /* ================= timer ================= */
  useEffect(() => {
    const t = setInterval(() => {
      if (screenRef.current !== "task") return;

      setTimeLeftByTask((prev) => {
        const idx = taskIndexRef.current;
        const next = [...(prev || [])];
        const cur = Number(next[idx] ?? 0);
        if (cur <= 0) return prev;
        next[idx] = cur - 1;
        return next;
      });
    }, 1000);

    return () => clearInterval(t);
  }, []);

  /* ================= submit ================= */
  const onSubmit = useCallback(
    (auto = false) => {
      if (!mock?.id) return;

      const finishedAt = new Date().toISOString();

      const task1Def = tasks.find((t) => t?.type === "task1_reorder");
      const task1Items = task1Def?.items;
      const task1Grade = gradeTask1(task1Items, answers?.task1 || {});

      const reportAll = loadJson(LS_WRITING_REPORT, {});
      const report = {
        mockId: mock.id,
        title: mock.title,
        submittedAt: finishedAt,
        startedAt: startedAtRef.current,
        autoSubmitted: !!auto,
        timeUsedByTaskSec: taskLimits.map((limit, i) => {
          const left = Number(timeLeftByTask?.[i] ?? 0);
          const lim = Number(limit ?? 0);
          return Math.max(0, lim - left) | 0;
        }),
        task1: task1Grade,
        task2: {
          subject: answers?.task2?.subject ?? "",
          body: answers?.task2?.body ?? "",
        },
        task3: {
          body: answers?.task3?.body ?? "",
        },
      };

      saveJson(LS_WRITING_REPORT, { ...reportAll, [mock.id]: report });

      const progAll = loadJson(LS_WRITING_PROGRESS, {});
      saveJson(LS_WRITING_PROGRESS, {
        ...progAll,
        [mock.id]: {
          startedAt: startedAtRef.current,
          finishedAt,
          screen,
          taskIndex,
          task1ItemIndex,
          timeLeftByTask,
          answers,
        },
      });

      nav(`/writing/report?mock=${encodeURIComponent(mock.id)}`);
    },
    [
      mock,
      tasks,
      answers,
      taskLimits,
      timeLeftByTask,
      screen,
      taskIndex,
      task1ItemIndex,
      nav,
    ]
  );

  /* ================= time over behavior ================= */
  useEffect(() => {
    if (screen !== "task") return;
    if (curTimeLeft !== 0) return;

    if (taskIndex < totalTasks - 1) {
      setTaskIndex((i) => Math.min(totalTasks - 1, i + 1));
      setScreen("taskIntro");
      setTask1ItemIndex(0);
      return;
    }

    onSubmit(true);
  }, [curTimeLeft, screen, taskIndex, totalTasks, onSubmit]);

  /* ================= answer setters ================= */
  const setTask1Answer = (no, sentence) => {
    setAnswers((prev) => ({
      ...prev,
      task1: { ...(prev.task1 || {}), [no]: sentence },
    }));
  };

  const setTask2 = (patch) => {
    setAnswers((prev) => ({
      ...prev,
      task2: { ...(prev.task2 || { subject: "", body: "" }), ...patch },
    }));
  };

  const setTask3 = (patch) => {
    setAnswers((prev) => ({
      ...prev,
      task3: { ...(prev.task3 || { body: "" }), ...patch },
    }));
  };

  /* ================= navigation helpers ================= */
  const goTaskIntro = (idx) => {
    const safe = Math.max(0, Math.min(totalTasks - 1, idx));
    setTaskIndex(safe);
    setScreen("taskIntro");
  };

  const onContinue = () => {
    if (screen === "taskIntro") setScreen("task");
  };

  const onSkip = () => {
    if (screen === "taskIntro") setScreen("task");
  };

  const onPrev = () => {
    if (screen !== "task") return;

    if (curTask?.type === "task1_reorder") {
      if (task1ItemIndex > 0) {
        setTask1ItemIndex((prev) => prev - 1);
      }
      return;
    }

    if (taskIndex === 0) return;
    goTaskIntro(taskIndex - 1);
  };

  const onNext = () => {
    if (screen !== "task") return;

    if (curTask?.type === "task1_reorder") {
      const total = safeArr(curTask?.items).length;

      if (task1ItemIndex < total - 1) {
        setTask1ItemIndex((prev) => prev + 1);
        return;
      }

      if (taskIndex < totalTasks - 1) {
        setTask1ItemIndex(0);
        goTaskIntro(taskIndex + 1);
      }
      return;
    }

    if (taskIndex >= totalTasks - 1) return;
    goTaskIntro(taskIndex + 1);
  };

  /* ================= intro content ================= */
  const intro = useMemo(() => {
    if (screen !== "taskIntro") return null;

    if (taskIndex === 0) {
      return {
        bigTitle: "Build a Sentence",
        lines: [
          "You will complete 10 questions.",
          "For each question, move the words in the boxes to create a grammatical sentence.",
          "",
          "You will answer one question at a time.",
        ],
      };
    }
    if (taskIndex === 1) {
      return {
        bigTitle: "Write an Email",
        lines: [
          "You will read some information and use the information to write an email.",
          "",
          "You will have 7 minutes to write the email.",
        ],
      };
    }
    return {
      bigTitle: "Write for an Academic Discussion",
      lines: [
        "A professor has posted a question about a topic and students have responded with their thoughts and ideas.",
        "Make a contribution to the discussion.",
        "",
        "You will have 10 minutes to write.",
      ],
    };
  }, [screen, taskIndex]);

  const showTimer = screen === "task";
  const showSubmit = screen === "task";
  const danger = showTimer && curTimeLeft <= 60;

  /* ================= derived data for UI ================= */
  const emailToName =
    curTask?.to ||
    curTask?.toName ||
    curTask?.recipient ||
    curTask?.recipientName ||
    "Recipient";

  const emailBodyValue = answers?.task2?.body ?? "";
  const discussionStudents = safeArr(curTask?.students);
  const discussionBodyValue = answers?.task3?.body ?? "";

  if (!mock?.id) return null;

  return (
    <Page>
      <TopBar>
        <TopLeft>
          <BtnIcon type="button" onClick={() => nav("/writing")} title="Back">
            <ArrowLeft size={18} />
          </BtnIcon>

          <TopTitle>
            <b>{mock.title}</b>
            <span>
              {curTask?.type === "task1_reorder"
                ? `Question ${Math.min(task1ItemIndex + 1, totalTask1Items)} of ${totalTask1Items}`
                : `Task ${Math.min(taskIndex + 1, totalTasks)} / ${totalTasks}`}
            </span>
          </TopTitle>
        </TopLeft>

        <TopRight>
          {showTimer && (
            <TimerPill data-danger={danger ? "1" : "0"}>
              <Clock size={16} />
              <span>{formatMMSS(curTimeLeft)}</span>
            </TimerPill>
          )}

          {showSubmit && (
            <BtnSubmit type="button" onClick={() => onSubmit(false)}>
              <CheckCircle2 size={18} />
              Submit
            </BtnSubmit>
          )}
        </TopRight>
      </TopBar>

      <Body>
        {screen === "taskIntro" && intro && (
          <IntroCard>
            <IntroTitle>{intro.bigTitle}</IntroTitle>
            <IntroText>
              {intro.lines.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </IntroText>

            <IntroBtns>
              <IntroBtnGhost type="button" onClick={onSkip}>
                Skip
              </IntroBtnGhost>
              <IntroBtnPrimary type="button" onClick={onContinue}>
                Continue
              </IntroBtnPrimary>
            </IntroBtns>
          </IntroCard>
        )}

        {screen === "task" && (
          <TaskScreenCard>
            <TaskScreenHeader>
              <TaskHeaderLeft>
                <TaskModeLabel>WRITING</TaskModeLabel>
                <TaskHeaderMeta>
                  {curTask?.type === "task1_reorder"
                    ? `Question ${Math.min(task1ItemIndex + 1, totalTask1Items)} of ${totalTask1Items}`
                    : `Task ${taskIndex + 1} of ${totalTasks}`}
                </TaskHeaderMeta>
              </TaskHeaderLeft>
            </TaskScreenHeader>

            {/* ================= TASK 1 ================= */}
            {curTask?.type === "task1_reorder" && (
              <Task1Wrap>
                <PanelHead>
                  <h2>{curTask?.title}</h2>
                  <p>{curTask?.instruction}</p>
                </PanelHead>

                <PanelBody>
                 <Task1SentenceBuilder
  items={currentTask1Item ? [currentTask1Item] : []}
  value={
    currentTask1Item
      ? {
          [currentTask1Item.no]:
            answers?.task1?.[currentTask1Item.no] || "",
        }
      : {}
  }
  onChange={setTask1Answer}
  timeLeft={curTimeLeft}
/>
                </PanelBody>
              </Task1Wrap>
            )}

            {/* ================= TASK 2 : EMAIL ================= */}
            {curTask?.type === "task2_email" && (
              <WritingSplit>
                <PromptPane>
                  <PromptInner>
                    <PromptParagraph>{curTask?.situation}</PromptParagraph>

                    {!!safeArr(curTask?.bullets).length && (
                      <PromptBlock>
                        <PromptBlockTitle>
                          Write an email to the manager of the mentoring
                          program, {emailToName}. In the email, do each of the
                          following:
                        </PromptBlockTitle>

                        <PromptBulletList>
                          {safeArr(curTask?.bullets).map((b, i) => (
                            <li key={i}>{b}</li>
                          ))}
                        </PromptBulletList>
                      </PromptBlock>
                    )}

                    {(curTask?.recommendedWords || curTask?.minWords) && (
                      <PromptFoot>
                        Write as much as you can and in complete sentences.
                      </PromptFoot>
                    )}
                  </PromptInner>
                </PromptPane>

                <ResponsePane>
                  <ResponseTopMeta>
                    <ResponseMetaTitle>Your response:</ResponseMetaTitle>

                    <MetaLine>
                      <MetaLabel>To:</MetaLabel>
                      <MetaValue>{emailToName}</MetaValue>
                    </MetaLine>

                    <MetaLine>
                      <MetaLabel>Subject:</MetaLabel>
                      <MetaValue>{curTask?.subject || "Mentoring Program"}</MetaValue>
                    </MetaLine>
                  </ResponseTopMeta>

                  <EditorShell>
                    <EditorToolbar>
                      <ToolbarLeft>
                        <ToolbarBtn
                          type="button"
                          onClick={() =>
                            cutSelection(emailBodyRef.current, (next) =>
                              setTask2({ body: next })
                            )
                          }
                        >
                          <Scissors size={14} />
                          Cut
                        </ToolbarBtn>

                        <ToolbarBtn
                          type="button"
                          onClick={() =>
                            pasteFromClipboard(emailBodyRef.current, (next) =>
                              setTask2({ body: next })
                            )
                          }
                        >
                          <Clipboard size={14} />
                          Paste
                        </ToolbarBtn>

                        <ToolbarBtn
                          type="button"
                          onClick={() => doUndo(emailBodyRef.current)}
                        >
                          <Undo2 size={14} />
                          Undo
                        </ToolbarBtn>

                        <ToolbarBtn
                          type="button"
                          onClick={() => doRedo(emailBodyRef.current)}
                        >
                          <Redo2 size={14} />
                          Redo
                        </ToolbarBtn>
                      </ToolbarLeft>

                      <ToolbarRight>
                        <ToolbarGhostBtn
                          type="button"
                          onClick={() =>
                            setHideEmailWordCount((prev) => !prev)
                          }
                        >
                          {hideEmailWordCount ? (
                            <Eye size={14} />
                          ) : (
                            <EyeOff size={14} />
                          )}
                          {hideEmailWordCount
                            ? "Show Word Count"
                            : "Hide Word Count"}{" "}
                          : {wordCount(emailBodyValue)}
                        </ToolbarGhostBtn>
                      </ToolbarRight>
                    </EditorToolbar>

                    <EditorTextarea
                      ref={emailBodyRef}
                      value={emailBodyValue}
                      onChange={(e) => setTask2({ body: e.target.value })}
                      placeholder="Write your response here:"
                    />

                    {!hideEmailWordCount && (
                      <EditorFooter>
                        Word Count: {wordCount(emailBodyValue)}
                      </EditorFooter>
                    )}
                  </EditorShell>
                </ResponsePane>
              </WritingSplit>
            )}

            {/* ================= TASK 3 : DISCUSSION ================= */}
            {curTask?.type === "task3_discussion" && (
              <WritingSplit>
                <PromptPane>
                  <PromptInner>
                    <PromptParagraph>
                      {curTask?.prompt?.intro ||
                        curTask?.prompt?.situation ||
                        plainTextFromHtml(curTask?.prompt?.context) ||
                        "Your professor is teaching a class. Write a post responding to the professor's question."}
                    </PromptParagraph>

                    <PromptBlock>
                      <PromptBlockTitle>
                        In your response, you should do the following.
                      </PromptBlockTitle>

                      <PromptBulletList>
                        <li>Express and support your opinion.</li>
                        <li>
                          Make a contribution to the discussion in your own
                          words.
                        </li>
                      </PromptBulletList>
                    </PromptBlock>

                    <PromptFoot>
                      An effective response will contain at least{" "}
                      {curTask?.minWords || 100} words.
                    </PromptFoot>

                    {curTask?.prompt?.author && (
                      <ProfessorBox>
                        <ProfessorAvatar>
                          {getInitials(curTask?.prompt?.author)}
                        </ProfessorAvatar>
                        <ProfessorInfo>
                          <strong>{curTask?.prompt?.author}</strong>
                          <span>Professor</span>
                        </ProfessorInfo>
                      </ProfessorBox>
                    )}

                    {(curTask?.prompt?.question || curTask?.prompt?.body) && (
                      <ProfessorQuestionBox>
                        {curTask?.prompt?.question || curTask?.prompt?.body}
                      </ProfessorQuestionBox>
                    )}
                  </PromptInner>
                </PromptPane>

                <ResponsePane>
                  <DiscussionTop>
                    <StudentScroll>
                      {discussionStudents.map((student, idx) => (
                        <StudentCard key={`${student?.name || "student"}-${idx}`}>
                          <StudentAvatar>
                            {getInitials(student?.name)}
                          </StudentAvatar>

                          <StudentContent>
                            <StudentName>
                              {student?.name || `Student ${idx + 1}`}
                            </StudentName>
                            <StudentText>
                              {student?.text ||
                                student?.response ||
                                student?.body ||
                                ""}
                            </StudentText>
                          </StudentContent>
                        </StudentCard>
                      ))}
                    </StudentScroll>

                    <EditorShell>
                      <EditorToolbar>
                        <ToolbarLeft>
                          <ToolbarBtn
                            type="button"
                            onClick={() =>
                              cutSelection(discussionBodyRef.current, (next) =>
                                setTask3({ body: next })
                              )
                            }
                          >
                            <Scissors size={14} />
                            Cut
                          </ToolbarBtn>

                          <ToolbarBtn
                            type="button"
                            onClick={() =>
                              pasteFromClipboard(
                                discussionBodyRef.current,
                                (next) => setTask3({ body: next })
                              )
                            }
                          >
                            <Clipboard size={14} />
                            Paste
                          </ToolbarBtn>

                          <ToolbarBtn
                            type="button"
                            onClick={() => doUndo(discussionBodyRef.current)}
                          >
                            <Undo2 size={14} />
                            Undo
                          </ToolbarBtn>

                          <ToolbarBtn
                            type="button"
                            onClick={() => doRedo(discussionBodyRef.current)}
                          >
                            <Redo2 size={14} />
                            Redo
                          </ToolbarBtn>
                        </ToolbarLeft>

                        <ToolbarRight>
                          <ToolbarGhostBtn
                            type="button"
                            onClick={() =>
                              setHideDiscussionWordCount((prev) => !prev)
                            }
                          >
                            {hideDiscussionWordCount ? (
                              <Eye size={14} />
                            ) : (
                              <EyeOff size={14} />
                            )}
                            {hideDiscussionWordCount
                              ? "Show Word Count"
                              : "Hide Word Count"}{" "}
                            : {wordCount(discussionBodyValue)}
                          </ToolbarGhostBtn>
                        </ToolbarRight>
                      </EditorToolbar>

                      <EditorTextarea
                        ref={discussionBodyRef}
                        value={discussionBodyValue}
                        onChange={(e) => setTask3({ body: e.target.value })}
                        placeholder="Write your response here:"
                      />

                      {!hideDiscussionWordCount && (
                        <EditorFooter>
                          Word Count: {wordCount(discussionBodyValue)}
                        </EditorFooter>
                      )}
                    </EditorShell>
                  </DiscussionTop>
                </ResponsePane>
              </WritingSplit>
            )}

            <NavRow>
              <BtnNav
                type="button"
                onClick={onPrev}
                disabled={
                  curTask?.type === "task1_reorder"
                    ? task1ItemIndex === 0
                    : taskIndex === 0
                }
              >
                <ArrowLeft size={18} />
                Previous
              </BtnNav>

              <BtnNav
                type="button"
                onClick={onNext}
                disabled={
                  curTask?.type === "task1_reorder"
                    ? false
                    : taskIndex === totalTasks - 1
                }
              >
                Next
                <ArrowRight size={18} />
              </BtnNav>
            </NavRow>
          </TaskScreenCard>
        )}
      </Body>
    </Page>
  );
}

/* ================= styles ================= */

const Page = styled.div`
  width: 100%;
  padding: 18px 14px 36px;
  background: #f5f7fb;
  min-height: 100vh;

  @media (max-width: 640px) {
    padding: 14px 10px 60px;
  }
`;

const TopBar = styled.div`
  max-width: 1320px;
  margin: 0 auto 14px;
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 16px;
  padding: 12px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 12px 26px rgba(15, 23, 42, 0.06);
`;

const TopLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`;

const TopTitle = styled.div`
  min-width: 0;
  display: grid;
  gap: 2px;

  b {
    color: #0f172a;
    font-size: 14px;
    font-weight: 900;
    letter-spacing: -0.01em;
  }

  span {
    color: rgba(15, 23, 42, 0.55);
    font-size: 12px;
  }
`;

const TopRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const BtnIcon = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.12);
  display: grid;
  place-items: center;
  cursor: pointer;

  &:active {
    transform: translateY(1px);
  }
`;

const TimerPill = styled.div`
  height: 40px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(42, 132, 255, 0.08);
  border: 1px solid rgba(42, 132, 255, 0.18);
  color: #2a84ff;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 900;
  font-size: 13px;

  &[data-danger="1"] {
    background: rgba(255, 106, 0, 0.1);
    border: 1px solid rgba(255, 106, 0, 0.28);
    color: #ff6a00;
  }
`;

const BtnSubmit = styled.button`
  height: 40px;
  padding: 0 14px;
  border-radius: 14px;
  border: none;
  cursor: pointer;
  background: #ff6a00;
  color: #ffffff;
  font-weight: 900;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 12px 24px rgba(255, 106, 0, 0.22);

  &:active {
    transform: translateY(1px);
  }
`;

const Body = styled.div`
  max-width: 1320px;
  margin: 0 auto;
`;

/* ===== INTRO ===== */

const IntroCard = styled.section`
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 20px;
  padding: 26px 24px;
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.06);

  @media (max-width: 640px) {
    padding: 18px 14px;
    border-radius: 18px;
  }
`;

const IntroTitle = styled.h1`
  margin: 0 0 10px;
  font-size: 36px;
  letter-spacing: -0.02em;
  color: #0f172a;
  font-weight: 900;

  @media (max-width: 640px) {
    font-size: 28px;
  }
`;

const IntroText = styled.div`
  color: rgba(15, 23, 42, 0.72);
  font-size: 14px;
  line-height: 1.7;
  min-height: 80px;

  div + div {
    margin-top: 6px;
  }
`;

const IntroBtns = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const IntroBtnBase = styled.button`
  height: 44px;
  padding: 0 18px;
  border-radius: 999px;
  font-weight: 900;
  font-size: 14px;
  cursor: pointer;
  border: none;

  &:active {
    transform: translateY(1px);
  }
`;

const IntroBtnGhost = styled(IntroBtnBase)`
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.16);
  color: #0f172a;
`;

const IntroBtnPrimary = styled(IntroBtnBase)`
  background: #2a84ff;
  color: #ffffff;
  box-shadow: 0 14px 28px rgba(42, 132, 255, 0.25);
`;

/* ===== TASK SCREEN ===== */

const TaskScreenCard = styled.section`
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 22px;
  overflow: hidden;
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.06);
`;

const TaskScreenHeader = styled.div`
  min-height: 56px;
  padding: 0 20px;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;

  @media (max-width: 640px) {
    min-height: auto;
    padding: 12px;
    align-items: flex-start;
  }
`;

const TaskHeaderLeft = styled.div`
  display: flex;
  align-items: baseline;
  gap: 10px;
  flex-wrap: wrap;
`;

const TaskModeLabel = styled.span`
  font-size: 16px;
  font-weight: 900;
  color: #0f172a;
  letter-spacing: -0.01em;
`;

const TaskHeaderMeta = styled.span`
  font-size: 13px;
  color: rgba(15, 23, 42, 0.65);
`;

const Task1Wrap = styled.div`
  background: #ffffff;
`;

const PanelHead = styled.div`
  padding: 18px 18px 14px;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);

  h2 {
    margin: 0;
    font-size: 18px;
    color: #0f172a;
    font-weight: 900;
  }

  p {
    margin: 8px 0 0;
    color: rgba(15, 23, 42, 0.58);
    font-size: 13px;
    line-height: 1.4;
  }

  @media (max-width: 640px) {
    padding: 14px 12px 12px;

    h2 {
      font-size: 16px;
    }

    p {
      font-size: 12px;
    }
  }
`;

const PanelBody = styled.div`
  padding: 16px 18px;

  @media (max-width: 640px) {
    padding: 14px 12px;
  }
`;

const WritingSplit = styled.div`
  display: grid;
  grid-template-columns: minmax(300px, 1fr) minmax(420px, 1.06fr);
  min-height: 690px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
    min-height: auto;
  }
`;

const PromptPane = styled.div`
  background: #ffffff;
  border-right: 1px solid rgba(15, 23, 42, 0.08);

  @media (max-width: 980px) {
    border-right: none;
    border-bottom: 1px solid rgba(15, 23, 42, 0.08);
  }
`;

const PromptInner = styled.div`
  padding: 28px 28px 34px;
  max-width: 640px;

  @media (max-width: 640px) {
    padding: 20px 16px 22px;
  }
`;

const PromptParagraph = styled.p`
  margin: 0 0 28px;
  color: #111827;
  font-size: 18px;
  line-height: 1.65;
  white-space: pre-line;

  @media (max-width: 640px) {
    font-size: 16px;
  }
`;

const PromptBlock = styled.div`
  margin-bottom: 24px;
`;

const PromptBlockTitle = styled.h3`
  margin: 0 0 14px;
  color: #111827;
  font-size: 17px;
  line-height: 1.55;
  font-weight: 900;
`;

const PromptBulletList = styled.ul`
  margin: 0;
  padding-left: 22px;
  color: #111827;
  font-size: 17px;
  line-height: 1.75;

  li + li {
    margin-top: 8px;
  }

  @media (max-width: 640px) {
    font-size: 15px;
  }
`;

const PromptFoot = styled.p`
  margin: 26px 0 0;
  color: rgba(17, 24, 39, 0.88);
  font-size: 17px;
  line-height: 1.7;

  @media (max-width: 640px) {
    font-size: 15px;
  }
`;

const ProfessorBox = styled.div`
  margin-top: 34px;
  display: flex;
  align-items: center;
  gap: 14px;
`;

const ProfessorAvatar = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(180deg, #dbeafe 0%, #bfdbfe 100%);
  border: 3px solid #2563eb;
  color: #1d4ed8;
  display: grid;
  place-items: center;
  font-weight: 900;
  font-size: 22px;
  flex: 0 0 auto;
`;

const ProfessorInfo = styled.div`
  display: grid;
  gap: 2px;

  strong {
    font-size: 20px;
    color: #111827;
    font-weight: 900;
  }

  span {
    font-size: 14px;
    color: rgba(17, 24, 39, 0.62);
  }
`;

const ProfessorQuestionBox = styled.div`
  margin-top: 20px;
  color: #111827;
  font-size: 17px;
  line-height: 1.8;
  white-space: pre-line;
`;

const ResponsePane = styled.div`
  background: #fbfbfd;
  padding: 24px 24px 24px;

  @media (max-width: 640px) {
    padding: 16px 12px 16px;
  }
`;

const ResponseTopMeta = styled.div`
  margin-bottom: 16px;
`;

const ResponseMetaTitle = styled.div`
  color: #111827;
  font-size: 28px;
  font-weight: 900;
  margin-bottom: 14px;

  @media (max-width: 640px) {
    font-size: 22px;
  }
`;

const MetaLine = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
  color: #111827;
  margin-bottom: 6px;
`;

const MetaLabel = styled.span`
  font-size: 18px;
  font-weight: 900;
`;

const MetaValue = styled.span`
  font-size: 18px;
  font-weight: 900;
`;

const DiscussionTop = styled.div`
  display: grid;
  grid-template-rows: minmax(250px, 1fr) minmax(320px, 0.9fr);
  gap: 16px;
  min-height: 640px;

  @media (max-width: 640px) {
    grid-template-rows: auto 1fr;
    min-height: auto;
  }
`;

const StudentScroll = styled.div`
  min-height: 250px;
  max-height: 360px;
  overflow: auto;
  padding-right: 8px;

  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(15, 23, 42, 0.18);
    border-radius: 999px;
  }
`;

const StudentCard = styled.div`
  display: grid;
  grid-template-columns: 76px 1fr;
  gap: 16px;
  align-items: start;

  & + & {
    margin-top: 26px;
  }

  @media (max-width: 640px) {
    grid-template-columns: 60px 1fr;
    gap: 12px;
  }
`;

const StudentAvatar = styled.div`
  width: 76px;
  height: 76px;
  border-radius: 50%;
  background: linear-gradient(180deg, #e0f2fe 0%, #dbeafe 100%);
  border: 3px solid #2563eb;
  color: #1d4ed8;
  display: grid;
  place-items: center;
  font-weight: 900;
  font-size: 22px;
  flex: 0 0 auto;

  @media (max-width: 640px) {
    width: 60px;
    height: 60px;
    font-size: 18px;
  }
`;

const StudentContent = styled.div`
  min-width: 0;
`;

const StudentName = styled.div`
  color: #111827;
  font-weight: 900;
  font-size: 20px;
  margin-bottom: 8px;

  @media (max-width: 640px) {
    font-size: 17px;
  }
`;

const StudentText = styled.div`
  color: #111827;
  font-size: 16px;
  line-height: 1.8;
  white-space: pre-line;

  @media (max-width: 640px) {
    font-size: 15px;
  }
`;

const EditorShell = styled.div`
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);
  display: flex;
  flex-direction: column;
  min-height: 330px;
`;

const EditorToolbar = styled.div`
  min-height: 58px;
  padding: 10px 12px;
  background: #f4f5f7;
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
`;

const ToolbarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const ToolbarRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ToolbarBtn = styled.button`
  height: 36px;
  padding: 0 12px;
  border-radius: 999px;
  border: none;
  background: #eceef1;
  color: #374151;
  font-size: 13px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;

  &:hover {
    background: #e4e7eb;
  }

  &:active {
    transform: translateY(1px);
  }
`;

const ToolbarGhostBtn = styled.button`
  height: 36px;
  padding: 0 12px;
  border-radius: 999px;
  border: none;
  background: transparent;
  color: #374151;
  font-size: 13px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;

  &:hover {
    background: rgba(15, 23, 42, 0.05);
  }
`;

const EditorTextarea = styled.textarea`
  width: 100%;
  flex: 1;
  min-height: 260px;
  border: none;
  outline: none;
  resize: none;
  background: #ffffff;
  padding: 20px 18px;
  font-size: 18px;
  line-height: 1.85;
  color: #111827;

  &::placeholder {
    color: #9ca3af;
  }

  @media (max-width: 640px) {
    font-size: 16px;
    min-height: 220px;
    padding: 16px 14px;
  }
`;

const EditorFooter = styled.div`
  padding: 10px 16px 14px;
  color: rgba(17, 24, 39, 0.56);
  font-size: 12px;
  border-top: 1px solid rgba(15, 23, 42, 0.06);
  background: #ffffff;
`;

const NavRow = styled.div`
  padding: 14px 18px 18px;
  display: flex;
  justify-content: space-between;
  gap: 10px;
  border-top: 1px solid rgba(15, 23, 42, 0.08);
  background: #ffffff;

  @media (max-width: 640px) {
    padding: 12px;
  }
`;

const BtnNav = styled.button`
  height: 44px;
  padding: 0 14px;
  border-radius: 14px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  background: #ffffff;
  cursor: pointer;
  color: #0f172a;
  font-weight: 900;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  &:active {
    transform: translateY(1px);
  }
`;