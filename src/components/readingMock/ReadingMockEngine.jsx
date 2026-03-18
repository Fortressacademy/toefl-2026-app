import { useEffect, useMemo, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";

import DocFrame from "../reading/DocFrame";
import EmailDoc from "../reading/EmailDoc";
import NoticeDoc from "../reading/NoticeDoc";
import ScheduleDoc from "../reading/ScheduleDoc";
import QuestionPanel from "../reading/QuestionPanel";
import TextMessageDoc from "../reading/TextMessageDoc";

const LS_READING_MOCK_PROGRESS = "reading_mock_progress_v1";
const LS_READING_MOCK_REPORT = "reading_mock_report_v1";

/* ================= utils ================= */
function safeParse(raw, fallback) {
  try {
    const v = JSON.parse(raw);
    return v ?? fallback;
  } catch {
    return fallback;
  }
}
function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
function loadJson(key, fallback) {
  return safeParse(localStorage.getItem(key), fallback);
}
function onlyLetters(s) {
  return String(s || "").replace(/[^a-zA-Z]/g, "").toLowerCase();
}
function hasKorean(s) {
  return /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(String(s || ""));
}
function normalize(s) {
  return String(s || "").trim().toLowerCase();
}
function formatMMSS(sec) {
  const s = Math.max(0, sec | 0);
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
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
    }
  }
  return out;
}

// ✅ step에 questions:[]가 있으면 step을 여러 개로 펼쳐서 cur.question 단수 구조로 통일
function expandMultiQuestionSteps(rawSteps = []) {
  const out = [];

  for (const step of rawSteps) {
    // 이미 단수 question이면 그대로
    if (step?.question && !step?.questions) {
      out.push(step);
      continue;
    }

    const qs = Array.isArray(step?.questions) ? step.questions : null;

    // questions 배열이 없으면 그대로
    if (!qs || qs.length === 0) {
      out.push(step);
      continue;
    }

    // ✅ step 하나를 질문 개수만큼 분해
    qs.forEach((q, idx) => {
      const suffix = `q${idx + 1}`;
      out.push({
        ...step,
        id: step?.id ? `${step.id}_${suffix}` : `step_${suffix}`,
        question: q,
        questions: undefined,
        __parentStepId: step?.id ?? null,
        __subIndex: idx,
        __subTotal: qs.length,
      });
    });
  }

  return out;
}


/* ================= component ================= */

export default function ReadingMockEngine({ mock, onExit }) {
  const nav = useNavigate();

  const confirmExit = () => {
    return window.confirm("모의고사를 종료하시겠습니까?");
  };

  const requestExit = () => {
    const ok = confirmExit();
    if (!ok) return false;
    onExit?.();
    return true;
  };

const steps = useMemo(() => {
  const raw = Array.isArray(mock?.steps) ? mock.steps : [];
  return expandMultiQuestionSteps(raw);
}, [mock?.steps]);

const total = steps.length;

  // progress restore
  const restored = useMemo(() => {
    const saved = loadJson(LS_READING_MOCK_PROGRESS, {});
    return saved?.[mock.id] || null;
  }, [mock.id]);

  const [idx, setIdx] = useState(() => {
    const i = restored?.idx;
    return Number.isFinite(i) ? Math.max(0, Math.min(total - 1, i)) : 0;
  });

  // ✅ modules support
  const modules = useMemo(() => {
    const ms = Array.isArray(mock?.modules) ? mock.modules : [];
    if (!ms.length) {
      return [
        {
          no: 1,
          start: 0,
          end: Math.max(0, total - 1),
          timeLimitSec: Number.isFinite(mock?.timeLimitSec) ? mock.timeLimitSec : 0,
        },
      ];
    }
    return ms.map((m, i) => ({
      no: Number.isFinite(m?.no) ? m.no : i + 1,
      start: Number.isFinite(m?.start) ? m.start : 0,
      end: Number.isFinite(m?.end) ? m.end : Math.max(0, total - 1),
      timeLimitSec: Number.isFinite(m?.timeLimitSec) ? m.timeLimitSec : 0,
    }));
  }, [mock?.modules, mock?.timeLimitSec, total]);

  const getModuleByIdx = (i) => {
    const idx0 = Math.max(0, i | 0);
    const found = modules.find((m) => idx0 >= m.start && idx0 <= m.end);
    return (
      found || {
        no: 1,
        start: 0,
        end: Math.max(0, total - 1),
        timeLimitSec: Number.isFinite(mock?.timeLimitSec) ? mock.timeLimitSec : 0,
      }
    );
  };

  const activeModule = useMemo(() => getModuleByIdx(idx), [idx, modules, total]);
  const moduleNo = activeModule?.no ?? 1;

  const getNextModule = () => modules.find((m) => (m.no ?? 0) === moduleNo + 1) || null;
  const firstModule = modules[0] || { no: 1, start: 0, end: total - 1, timeLimitSec: mock?.timeLimitSec ?? 0 };

  const [remaining, setRemaining] = useState(() => {
    const r = restored?.remaining;
    if (Number.isFinite(r)) return r;

    // ✅ 처음 시작은 module 1 제한시간(없으면 mock.timeLimitSec)
    const m1 = modules.find((m) => (m.no ?? 1) === 1) || firstModule;
    return Number.isFinite(m1?.timeLimitSec) ? m1.timeLimitSec : mock.timeLimitSec ?? 0;
  });

  const [introStep, setIntroStep] = useState(() => {
    const step = restored?.introStep;
    if (step === "section" || step === "module" || step === "end" || step === "test") return step;
    return restored ? "test" : "section";
  });
  const started = introStep === "test";

  // answers:
  // - daily/academic: { [questionId]: "A"|"B"|"C"|"D" }
  // - ctw: { [stepId]: typedString }
  // - ctw_paragraph: { [stepId]: { [blankKey]: typedRestString } }
  const [answers, setAnswers] = useState(() => restored?.answers || {});
  const [ctwResult, setCtwResult] = useState(null); // "correct"|"wrong"|null
  const [toast, setToast] = useState(null);
  const toastRef = useRef({ msg: "", at: 0 });

  const cur = steps[idx];


  useEffect(() => {
    const onBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = ""; // 브라우저 기본 경고
      return "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);

  useEffect(() => {
    // ✅ 뒤로가기를 누르면 popstate가 발생하도록 더미 히스토리 1개 쌓기
    try {
      window.history.pushState({ __mock_guard: true }, "", window.location.href);
    } catch {}

    const onPopState = () => {
      const ok = confirmExit();

      if (ok) {
        onExit?.();
        return;
      }

      // ✅ 취소하면 다시 현재 상태로 되돌려서 화면 유지
      try {
        window.history.pushState({ __mock_guard: true }, "", window.location.href);
      } catch {}
    };

    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, [onExit]);

  // timer
  useEffect(() => {
    if (!started) return;
    if (remaining <= 0) return;
    const t = setInterval(() => setRemaining((r) => Math.max(0, (r ?? 0) - 1)), 1000);
    return () => clearInterval(t);
  }, [remaining, started]);

  // ✅ autosubmit: 모듈 종료 화면으로
  useEffect(() => {
    if (!started) return;
    if (remaining === 0) setIntroStep("end");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining, started]);

  // save progress
  useEffect(() => {
    const saved = loadJson(LS_READING_MOCK_PROGRESS, {});
    saved[mock.id] = {
      idx,
      remaining,
      answers,
      introStep, // ✅ 추가
      updatedAt: new Date().toISOString(),
    };
    saveJson(LS_READING_MOCK_PROGRESS, saved);
  }, [idx, remaining, answers, mock.id, introStep]);

  // step change resets
  useEffect(() => {
    setCtwResult(null);
  }, [idx]);

  const showToast = (msg) => {
    const now = Date.now();
    const last = toastRef.current;
    if (last.msg === msg && now - last.at < 600) return;
    toastRef.current = { msg, at: now };

    setToast(msg);
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), 1200);
  };

  /* ================= scoring/report ================= */

  const reportDraft = useMemo(() => {
    // ✅ CTW paragraph 포함: 총 문항 수/진행 수/정답 수를 “문항 기준”으로 계산
    let done = 0;
    let correct = 0;
    let totalQ = 0;

    for (let i = 0; i < steps.length; i++) {
      const s = steps[i];

      if (s?.kind === "ctw") {
        totalQ += 1;

        const typed = answers?.[s?.id];
        if (!typed) continue;
        done += 1;

        const ansRaw = String(s?.answer || "").trim();
        const words = ansRaw.split(/\s+/).filter(Boolean);
        const w1 = words[0] || "";
        const w2 = words[1] || "";

        const w1Pref = Number.isFinite(s?.prefixLen) ? Math.max(0, Math.min(3, s.prefixLen)) : 2;
        const w2Pref = Number.isFinite(s?.prefixLen2)
          ? Math.max(0, Math.min(2, s.prefixLen2))
          : 1;

        const rest1 = onlyLetters(w1).slice(Math.min(w1Pref, onlyLetters(w1).length));
        const rest2 = onlyLetters(w2).slice(Math.min(w2Pref, onlyLetters(w2).length));
        const rest = rest1 + rest2 + words.slice(2).map((x) => onlyLetters(x)).join("");

        if (normalize(typed) === normalize(rest)) correct += 1;
        continue;
      }

      if (s?.kind === "ctw_paragraph") {
        const blanks = Array.isArray(s?.blanks) ? s.blanks : [];
        totalQ += blanks.length;

        const map = answers?.[s?.id] || {};
        for (const b of blanks) {
          const key = String(b?.key ?? "");
          if (!key) continue;

          const typedRest = String(map?.[key] ?? "");
          if (!typedRest) continue;
          done += 1;

          const ansLetters = onlyLetters(b?.answer || "");
          const prefLetters = onlyLetters(b?.prefix || "");
          const rest = ansLetters.slice(Math.min(prefLetters.length, ansLetters.length));

          if (normalize(typedRest) === normalize(rest)) correct += 1;
        }
        continue;
      }

      // daily/academic
      totalQ += 1;

      const q = s?.question;
      const qid = q?.id ?? `${s?.kind || "step"}_${s?.id || i}`;
      const picked = answers?.[qid];
      if (!picked) continue;

      done += 1;
      if (picked === q?.answer) correct += 1;
    }

    return { done, total: totalQ, correct };
  }, [answers, steps]);


function getModuleNoByStepIndex(modules, stepIndex) {
  const ms = Array.isArray(modules) ? modules : [];
  for (const m of ms) {
    const s = Number(m?.start);
    const e = Number(m?.end);
    if (Number.isFinite(s) && Number.isFinite(e) && stepIndex >= s && stepIndex <= e) {
      return Number(m?.no) || 1;
    }
  }
  return 1;
}


  function finish() {
    const items = [];
    let no = 1;

    for (let i = 0; i < steps.length; i++) {
      const s = steps[i];

      const stepModuleNo = getModuleNoByStepIndex(mock.modules || modules, i);

      if (s?.kind === "ctw") {
        const typed = answers[s.id] || "";
        const ansRaw = String(s.answer || "").trim();
        const words = ansRaw.split(/\s+/).filter(Boolean);

        const w1Pref = Number.isFinite(s.prefixLen) ? Math.max(0, Math.min(3, s.prefixLen)) : 2;
        const w2Pref = Number.isFinite(s.prefixLen2)
          ? Math.max(0, Math.min(2, s.prefixLen2))
          : 1;

        const w1 = words[0] || "";
        const w2 = words[1] || "";
        const rest1 = onlyLetters(w1).slice(Math.min(w1Pref, onlyLetters(w1).length));
        const rest2 = onlyLetters(w2).slice(Math.min(w2Pref, onlyLetters(w2).length));
        const rest = rest1 + rest2 + words.slice(2).map((x) => onlyLetters(x)).join("");

        const isCorrect = normalize(typed) === normalize(rest);

        items.push({
          no: no++,
          moduleNo: stepModuleNo,
          kind: "ctw",
          stepId: s.id,
          prompt: s.sentence,
          answer: s.answer,
          typed,
          isCorrect,
          explanation: s.meaning ? `뜻: ${s.meaning}` : "",
          isAnswered: !!typed,
        });
        continue;
      }

      if (s?.kind === "ctw_paragraph") {
        const blanks = Array.isArray(s?.blanks) ? s.blanks : [];
        const map = answers?.[s?.id] || {};

        for (const b of blanks) {
          const key = String(b?.key ?? "");
          if (!key) continue;

          const typedRest = String(map?.[key] ?? "");
          const ansLetters = onlyLetters(b?.answer || "");
          const prefLetters = onlyLetters(b?.prefix || "");
          const rest = ansLetters.slice(Math.min(prefLetters.length, ansLetters.length));

          const isCorrect = !!typedRest && normalize(typedRest) === normalize(rest);

          items.push({
            no: no++,
            moduleNo: stepModuleNo,
            kind: "ctw_paragraph",
            stepId: s.id,
            blankKey: key,
            prompt: String(s?.paragraph || ""),
            answer: String(b?.answer || ""),
            prefix: String(b?.prefix || ""),
            typed: typedRest,
            isCorrect,
            isAnswered: !!typedRest,
            explanation: b?.meaning ? `뜻: ${b.meaning}` : "",
            subject: s?.subject || "general",
          });
        }
        continue;
      }

      // daily/academic
      const q = s?.question;
      const qid = q?.id ?? `${s?.kind || "step"}_${s?.id || i}`;
      const picked = answers?.[qid] ?? null;

      const answer = q?.answer ?? null;
      const isCorrect = !!answer && picked === answer;

      items.push({
        no: no++,
        moduleNo: stepModuleNo,
        kind: s?.kind || "unknown",
        questionId: qid,

        prompt: q?.question ?? "(문항 데이터가 누락되었습니다)",
        options: q?.options ?? { A: "", B: "", C: "", D: "" },

        answer,
        picked,
        isCorrect,
        isAnswered: !!picked,
        explanation: q?.explanation || "",

        title:
          (s?.kind === "daily"
            ? s?.doc?.subject || s?.doc?.title || ""
            : s?.passageSet?.title || "") || "",

        doc: s?.kind === "daily" ? s?.doc ?? null : null,
        passageSet: s?.kind === "academic" ? s?.passageSet ?? null : null,
      });
    }

    const totalQ = items.length;
    const correct = items.filter((x) => x.isCorrect).length;

const allReports = loadJson(LS_READING_MOCK_REPORT, {});
allReports[mock.id] = {
  id: mock.id,
  title: mock.title,
  finishedAt: new Date().toISOString(),
  total: totalQ,
  correct,
  modules: mock.modules || [], // ✅ 모듈 정보도 같이 저장
  items,
};
saveJson(LS_READING_MOCK_REPORT, allReports);


    // 진행 데이터 제거(원하면 유지 가능)
    const prog = loadJson(LS_READING_MOCK_PROGRESS, {});
    delete prog[mock.id];
    saveJson(LS_READING_MOCK_PROGRESS, prog);

    // ✅ 결과페이지로 이동만!
    nav(`/reading/mock/${mock.id}/result`, { replace: true });
  }

  /* ================= navigation ================= */

  // ✅ 모듈 경계 넘어가는 Back 금지
  const canPrev = useMemo(() => {
    if (idx <= 0) return false;
    const curMod = getModuleByIdx(idx);
    const prevMod = getModuleByIdx(idx - 1);
    if ((curMod?.no ?? 1) !== (prevMod?.no ?? 1)) return false;
    return true;
  }, [idx, modules]);

  const goPrev = () => {
    if (!canPrev) return;
    setIdx((p) => Math.max(0, p - 1));
  };

  // ✅ 모듈 경계면 End 화면 먼저
  const goNext = () => {
    const nextIdx = Math.min(total - 1, idx + 1);
    if (nextIdx === idx) return;

    const curMod = getModuleByIdx(idx);
    const nextMod = getModuleByIdx(nextIdx);

    if ((curMod?.no ?? 1) !== (nextMod?.no ?? 1)) {
      setIntroStep("end");
      return;
    }

    setIdx(nextIdx);
  };

  /* ================= RENDER: Right Doc ================= */

  const renderRight = () => {
    if (!cur) return <Empty>자료가 없습니다.</Empty>;

    // CTW는 “지문”이 따로 없으니, 오른쪽에 간단 안내 박스
    if (cur.kind === "ctw" || cur.kind === "ctw_paragraph") {
      return (
        <DocFrame
          headerLeft="TOEFL iBT READING"
          headerRight="[CTW] Complete the Words"
          footerLeft={`Progress: ${reportDraft.done}/${reportDraft.total} · Correct: ${reportDraft.correct}`}
          footerRight={<MiniBtn onClick={finish}>Submit</MiniBtn>}
        >
          <Pad>
            <h3 style={{ margin: 0 }}>Instructions</h3>
            <p style={{ margin: "10px 0 0", opacity: 0.85, lineHeight: 1.6 }}>
              문맥을 보고 빈칸 단어를 완성하세요. 앞글자(prefix)는 이미 주어지고, 나머지를 입력합니다.
            </p>
          </Pad>
        </DocFrame>
      );
    }

    // DailyLife
    if (cur.kind === "daily") {
      const d = cur.doc;
      const docType = d?.docType;
      const body = (() => {
        if (!d) return <Empty>자료가 없습니다.</Empty>;
        if (docType === "email") return <EmailDoc doc={d} />;
        if (docType === "notice") return <NoticeDoc doc={d} />;
        if (docType === "schedule") return <ScheduleDoc doc={d} />;
        if (docType === "text_messages") return <TextMessageDoc doc={d} />;
        return <NoticeDoc doc={d} />;
      })();

      return (
        <DocFrame
          headerLeft="TOEFL iBT READING"
          headerRight="[Daily] Read in Daily Life"
          footerLeft={`Progress: ${reportDraft.done}/${reportDraft.total} · Correct: ${reportDraft.correct}`}
          footerRight={<MiniBtn onClick={finish}>Submit</MiniBtn>}
        >
          {body}
        </DocFrame>
      );
    }

    // Academic
    if (cur.kind === "academic") {
      const p = cur.passageSet;
      return (
        <DocFrame
          headerLeft="TOEFL iBT READING"
          headerRight="[Academic] Passage"
          footerLeft={`Progress: ${reportDraft.done}/${reportDraft.total} · Correct: ${reportDraft.correct}`}
          footerRight={<MiniBtn onClick={finish}>Submit</MiniBtn>}
        >
          <Pad>
            <h3
  style={{
    margin: "0 0 8px",
    fontSize: 18,
    fontWeight: 700,
    fontFamily: "Arial, Helvetica, sans-serif"
  }}
>
  {p?.title}
</h3>
         <PassageBody dangerouslySetInnerHTML={{ __html: String(p?.passage || "") }} />
          </Pad>
        </DocFrame>
      );
    }

    return <Empty>지원하지 않는 kind</Empty>;
  };

  /* ================= RENDER: Left Question ================= */

  const renderLeft = () => {
    if (!cur) return null;

    if (cur.kind === "ctw") {
      return (
        <CTWPanel
          step={cur}
          typed={String(answers[cur.id] ?? "")}
          setTyped={(updater) =>
            setAnswers((prev) => {
              const curVal = String(prev[cur.id] ?? "");
              const nextVal =
                typeof updater === "function" ? String(updater(curVal) ?? "") : String(updater ?? "");
              return { ...prev, [cur.id]: nextVal };
            })
          }
          result={ctwResult}
          setResult={setCtwResult}
          showToast={showToast}
          hideAnswer={true}
          onAutoNext={() => {
            if (idx < total - 1) goNext();
            else setIntroStep("end"); // ✅ 마지막도 End 거쳐서(모듈2 없으면 finish로)
          }}
        />
      );
    }

    if (cur.kind === "ctw_paragraph") {
      const map = (answers?.[cur.id] && typeof answers[cur.id] === "object" ? answers[cur.id] : {}) || {};
      return (
        <CTWParagraphPanel
          step={cur}
          valueMap={map}
          setValueMap={(updater) =>
            setAnswers((prev) => {
              const curVal = prev?.[cur.id] && typeof prev[cur.id] === "object" ? prev[cur.id] : {};
              const nextVal = typeof updater === "function" ? updater(curVal) : updater;
              return { ...prev, [cur.id]: nextVal };
            })
          }
          showToast={showToast}
          onAutoNext={() => {
            if (idx < total - 1) goNext();
            else setIntroStep("end"); // ✅ 마지막도 End 거쳐서
          }}
        />
      );
    }

    // Daily/Academic: QuestionPanel 재사용
    const q = cur.question;

    // ✅ question.id 누락 방어
    const qid = q?.id ?? `${cur?.kind || "step"}_${cur?.id || idx}`;

    const picked = answers[qid] || null;

    const onPick = (choice) => {
      setAnswers((prev) => ({ ...prev, [qid]: choice }));
    };

    const onNext = () => {
      if (!picked) return;

      if (idx < total - 1) {
        goNext();
      } else {
        // ✅ 마지막: end 화면 -> next module 없으면 finish
        setIntroStep("end");
      }
    };

    return (
      <QuestionPanel
        docType={cur.kind === "daily" ? cur.doc?.docType : "academic"}
        docTitle={
          cur.kind === "daily"
            ? cur.doc?.title || cur.doc?.subject || "Untitled"
            : cur.passageSet?.title || "Passage"
        }
        docIndex={1}
        docTotal={1}
        qIndex={idx + 1}
        qTotal={total}
        question={{
          ...(q || {}),
          id: qid, // ✅ QuestionPanel이 id를 쓰는 경우 대비
        }}
        picked={picked}
        onPick={onPick}
        onPrev={goPrev}
        onNext={onNext}
        canPrev={canPrev}
        canNext={!!picked}
        nextLabel={idx >= total - 1 ? "Finish" : "Next"}
      />
    );
  };

  // ✅ Step 0) Reading section 안내 화면
  if (introStep === "section") {
    return (
      <Wrap>
        <Top>
          <BackBtn onClick={requestExit}>← EXIT</BackBtn>
          <Title>
            {mock.title} · <b>Overview</b>
          </Title>
          <TimerBox>
            <div>TIME</div>
            <b>{formatMMSS(firstModule?.timeLimitSec ?? remaining)}</b>
          </TimerBox>
        </Top>

        <IntroShell>
          <IntroCard>
            <SectionH1>Reading section</SectionH1>
            <IntroLine />

            <SectionText>
              In the Reading section, you will answer 35–50 questions to demonstrate how well you understand
              academic and non-academic texts in English.
            </SectionText>
            <SectionText>There are three types of tasks.</SectionText>

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
                  <td>Answer questions about an academic passage.</td>
                </tr>
              </tbody>
            </TaskTable>

            <IntroActions>
              <IntroGhost type="button" onClick={onExit}>
                Exit
              </IntroGhost>

              <IntroPrimary
                type="button"
                onClick={() => {
                  setIntroStep("module"); // ✅ Next 누르면 Module 화면으로
                  requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
                }}
              >
                Next
              </IntroPrimary>
            </IntroActions>
          </IntroCard>
        </IntroShell>
      </Wrap>
    );
  }

  // ✅ Step 1) End of Module 화면
  if (introStep === "end") {
    const next = getNextModule();

    return (
      <Wrap>
        <Top>
          <BackBtn onClick={requestExit}>← EXIT</BackBtn>
          <Title>
            {mock.title} · <b>End of Module {moduleNo}</b>
          </Title>
          <TimerBox>
            <div>TIME</div>
            <b>{formatMMSS(0)}</b>
          </TimerBox>
        </Top>

        <IntroShell>
          <IntroCard>
            <IntroH1>End of Module {moduleNo}</IntroH1>
            <IntroLine />

            <IntroText>Your time for Module {moduleNo} of the reading section has ended.</IntroText>
            <IntroText>
              {next ? `Select Continue to go to Module ${moduleNo + 1}.` : "Select Continue to see your results."}
            </IntroText>

            <IntroActions>
              <IntroPrimary
                type="button"
                onClick={() => {
                  if (!next) {
                    finish();
                    return;
                  }

                  // ✅ 다음 모듈 시작점으로 이동 + 시간 리셋
                  setIdx(next.start);
                  setRemaining(Number.isFinite(next.timeLimitSec) ? next.timeLimitSec : 0);
                  setIntroStep("module");

                  requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
                }}
              >
                Continue →
              </IntroPrimary>
            </IntroActions>
          </IntroCard>
        </IntroShell>
      </Wrap>
    );
  }

  // ✅ Step 2) Module 안내 화면 (Module 1 / 2 공통)
  if (introStep === "module") {
    const limit = Number.isFinite(activeModule?.timeLimitSec) ? activeModule.timeLimitSec : remaining;

    return (
      <Wrap>
        <Top>
          <BackBtn onClick={requestExit}>← EXIT</BackBtn>
          <Title>
            {mock.title} · <b>Ready</b>
          </Title>
          <TimerBox>
            <div>TIME</div>
            <b>{formatMMSS(limit)}</b>
          </TimerBox>
        </Top>

        <IntroShell>
          <IntroCard>
            <IntroH1>Module {moduleNo}</IntroH1>
            <IntroLine />

            <IntroText>The clock will show you how much time you have to complete Module {moduleNo}.</IntroText>

            <IntroText>
              You can use Next and Back to move to the next question or return to previous questions within the same
              module.
            </IntroText>

            <IntroText>
              You <b>WILL NOT</b> be able to return to Module {moduleNo} once you have begun Module {moduleNo + 1}.
            </IntroText>

            <IntroActions>
              <IntroGhost type="button" onClick={onExit}>
                Exit
              </IntroGhost>

              <IntroPrimary
                type="button"
                onClick={() => {
                  // ✅ module 화면에서 Start를 누를 때만 test 시작
                  // (Module 1 처음 시작이면 remaining을 module1으로 맞춤)
                  if (!Number.isFinite(restored?.remaining)) {
                    setRemaining(Number.isFinite(activeModule?.timeLimitSec) ? activeModule.timeLimitSec : remaining);
                  }
                  setIntroStep("test");
                  requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
                }}
              >
                Start
              </IntroPrimary>
            </IntroActions>
          </IntroCard>
        </IntroShell>
      </Wrap>
    );
  }

  const isCTW = cur?.kind === "ctw" || cur?.kind === "ctw_paragraph";

  return (
    <Wrap>
      <Top>
        <BackBtn onClick={requestExit}>← EXIT</BackBtn>
        <Title>
          {mock.title} · <b>{idx + 1}/{total}</b>
        </Title>
        <TimerBox>
          <div>TIME</div>
          <b>{formatMMSS(remaining)}</b>
        </TimerBox>
      </Top>

      {/* ✅ CTW는 문제만 단독 화면 */}
      {isCTW ? (
        <SingleWrap>
          <SingleCard>{renderLeft()}</SingleCard>
        </SingleWrap>
      ) : (
        <Grid>
          <RightCard className="right">{renderRight()}</RightCard>
          <LeftCard className="left">{renderLeft()}</LeftCard>
        </Grid>
      )}

      {toast ? <Toast role="status">{toast}</Toast> : null}
    </Wrap>
  );
}

/* ================= CTW Panel (single-step) ================= */

function CTWPanel({ step, typed, setTyped, result, setResult, showToast, onAutoNext, hideAnswer }) {
  const inputRef = useRef(null);

  const rawAnswer = useMemo(() => String(step?.answer || "").trim(), [step]);
  const words = useMemo(() => rawAnswer.split(/\s+/).filter(Boolean), [rawAnswer]);

  const w1PrefLen = useMemo(() => {
    const v = Number.isFinite(step?.prefixLen) ? step.prefixLen : 2;
    return Math.max(0, Math.min(3, v));
  }, [step]);

  const w2PrefLen = useMemo(() => {
    const v = Number.isFinite(step?.prefixLen2) ? step.prefixLen2 : 1;
    return Math.max(0, Math.min(2, v));
  }, [step]);

  const wordDisplay = useMemo(() => {
    let cursor = 0;

    return words.map((w, i) => {
      const letters = onlyLetters(w);
      const maxLen = letters.length;

      const prefLen = i === 0 ? Math.min(w1PrefLen, maxLen) : i === 1 ? Math.min(w2PrefLen, maxLen) : 0;

      const prefixText = takeFirstNLettersOriginal(w, prefLen);
      const restLetters = letters.slice(prefLen);
      const restLen = restLetters.length;

      const typedPart = typed.slice(cursor, cursor + restLen);
      cursor += restLen;

      return { word: w, prefixText, restLetters, restLen, typedPart };
    });
  }, [words, typed, w1PrefLen, w2PrefLen]);

  const restLen = useMemo(() => wordDisplay.reduce((sum, w) => sum + (w.restLen || 0), 0), [wordDisplay]);

  const answerRest = useMemo(() => wordDisplay.map((w) => w.restLetters).join(""), [wordDisplay]);

  // ✅ 정규식 escape
  function escapeRegExp(s) {
    return String(s || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  // ✅ 문장 속 "cr____" 같은 블랭크를 찾아 before/after로 자르기
  const inlineParts = useMemo(() => {
    const sentence = String(step?.sentence || "");
    if (!sentence) return { found: false, before: "", after: "" };

    const tokens = wordDisplay
      .map((w) => {
        const pref = String(w.prefixText || "");
        if (!pref) return null;
        return `${escapeRegExp(pref)}_+`;
      })
      .filter(Boolean);

    if (!tokens.length) return { found: false, before: sentence, after: "" };

    const pattern = new RegExp(tokens.join("\\s+"));
    const m = sentence.match(pattern);

    if (!m || m.index == null) {
      return { found: false, before: sentence, after: "" };
    }

    const start = m.index;
    const end = start + m[0].length;

    return {
      found: true,
      before: sentence.slice(0, start),
      after: sentence.slice(end),
    };
  }, [step?.sentence, wordDisplay]);

  
  // ✅ ReadingCTW처럼 문장 split (유지)
  useMemo(() => {
    return null;
  }, [step]);

  const renderSlots = (typedPart, len) => {
    const out = [];
    for (let i = 0; i < len; i++) out.push(typedPart[i] || "_");
    return out.join(" ");
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

  useEffect(() => {
  if (introStep !== "test") return;

  // ✅ CTW 화면에서만 강제 포커스
  if (cur?.kind !== "ctw" && cur?.kind !== "ctw_paragraph") return;

  const focusCTW = () => {
    const el = document.querySelector('[data-ctw-input="1"]');
    if (el && typeof el.focus === "function") {
      el.focus();
      // 커서 맨 뒤로
      try {
        const len = el.value?.length ?? 0;
        el.setSelectionRange?.(len, len);
      } catch {}
    }
  };

  // ✅ 2프레임 정도 늦추면 Start 전환/레이아웃 변경에도 안정적으로 먹음
  const t1 = requestAnimationFrame(() => {
    focusCTW();
    const t2 = requestAnimationFrame(focusCTW);
    // cleanup 위해 저장
    focusCTW._t2 = t2;
  });

  return () => {
    cancelAnimationFrame(t1);
    if (focusCTW._t2) cancelAnimationFrame(focusCTW._t2);
  };
}, [introStep, idx, cur?.kind]);

  useEffect(() => {
    setResult(null);
    requestAnimationFrame(focusInput);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step?.id]);

  const check = () => {
    const ok = normalize(typed) === normalize(answerRest);
    setResult(ok ? "correct" : "wrong");
    showToast(ok ? "정답!" : "오답");
  };

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
    )
      return;

    if (e.key === "Backspace") {
      e.preventDefault();
      setTyped((prev) => prev.slice(0, -1));
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
    if (hasKorean(raw)) showToast("영어만 가능합니다");
    const v = onlyLetters(raw);
    setTyped(v.slice(0, restLen));
  };

  const onPaste = (e) => {
    if (result !== null) return;
    e.preventDefault();
    const text = e.clipboardData?.getData("text") || "";
    if (hasKorean(text)) {
      showToast("영어만 가능합니다");
      return;
    }
    const cleaned = onlyLetters(text);
    if (!cleaned) return;
    setTyped((prev) => (prev + cleaned).slice(0, restLen));
    requestAnimationFrame(focusInput);
  };

  return (
    <CTWCard>
      <CTWTop>
        <CTWBadge>{step.trackLabel || "CTW"}</CTWBadge>
        <CTWMeta>
          subject: <b>{step.subject || "general"}</b>
        </CTWMeta>
      </CTWTop>

      <CTWSentence>
        {inlineParts.found ? (
          <>
            <span>{inlineParts.before}</span>

            <InlineBlank onClick={focusInput} role="button" tabIndex={0} aria-label="inline blank">
              {wordDisplay.map((w, i) => (
                <InlineWord key={`${w.word}_${i}`}>
                  <InlinePrefix>{w.prefixText}</InlinePrefix>
                  {w.restLen > 0 && (
                    <InlineSlots aria-hidden>
                      {Array.from({ length: w.restLen }).map((_, k) => (
                        <span key={k}>{w.typedPart[k] || "_"}</span>
                      ))}
                    </InlineSlots>
                  )}
                  {i < wordDisplay.length - 1 && <InlineBetween>{" "}</InlineBetween>}
                </InlineWord>
              ))}

              <HiddenInput
              data-ctw-input="1" 
                ref={inputRef}
                value={typed}
                readOnly={result !== null}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                onKeyDown={onKeyDown}
                onChange={onChange}
                onPaste={onPaste}
              />
            </InlineBlank>

            <span>{inlineParts.after}</span>
          </>
        ) : (
          <span>{String(step?.sentence || "")}</span>
        )}
      </CTWSentence>

      {!inlineParts.found && (
        <BlankWrap onClick={focusInput} role="button" tabIndex={0}>
          {wordDisplay.map((w, i) => (
            <WordChunk key={`${w.word}_${i}`}>
              <WordPrefix>{w.prefixText}</WordPrefix>
              {w.restLen > 0 && <WordSlots>{renderSlots(w.typedPart, w.restLen)}</WordSlots>}
              {i < wordDisplay.length - 1 && <BetweenWords>{"   "}</BetweenWords>}
            </WordChunk>
          ))}

          <HiddenInput
          data-ctw-input="1" 
            ref={inputRef}
            value={typed}
            readOnly={result !== null}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            onKeyDown={onKeyDown}
            onChange={onChange}
            onPaste={onPaste}
          />
        </BlankWrap>
      )}

      <CTWActions>
        <PrimaryBtn type="button" onClick={onAutoNext} disabled={!typed?.trim()}>
          다음
        </PrimaryBtn>
      </CTWActions>
    </CTWCard>
  );
}

/* ================= CTW Paragraph Panel (one paragraph, 10 blanks) ================= */
/**
 * step 예시:
 * {
 *   kind:"ctw_paragraph",
 *   id:"m1_ctw_p1",
 *   trackLabel:"CTW",
 *   subject:"environment",
 *   paragraph:"Soil {{01}} vary {{02}} ...",
 *   blanks:[ {key:"01", prefix:"ty", answer:"types", meaning:"...", synonyms:[...]}, ... ]
 * }
 */
function CTWParagraphPanel({ step, valueMap, setValueMap, showToast, onAutoNext }) {
  const inputRef = useRef(null);
  const composingRef = useRef(false);

  const blanks = useMemo(() => {
    const arr = Array.isArray(step?.blanks) ? step.blanks : [];
    return [...arr]
      .filter(Boolean)
      .sort((a, b) => String(a?.key ?? "").localeCompare(String(b?.key ?? "")));
  }, [step?.blanks]);

  const blankByKey = useMemo(() => {
    const m = {};
    for (const b of blanks) {
      const k = String(b?.key ?? "");
      if (k) m[k] = b;
    }
    return m;
  }, [blanks]);

  const paragraph = useMemo(() => String(step?.paragraph || ""), [step?.paragraph]);

  const [activeKey, setActiveKey] = useState(() => String(blanks?.[0]?.key ?? ""));

  useEffect(() => {
    setActiveKey(String(blanks?.[0]?.key ?? ""));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step?.id]);

  const keys = useMemo(() => blanks.map((b) => String(b?.key ?? "")).filter(Boolean), [blanks]);

  const getRestLen = (b) => {
    const ans = onlyLetters(b?.answer || "");
    const pref = onlyLetters(b?.prefix || "");
    return Math.max(0, ans.length - Math.min(pref.length, ans.length));
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

  useEffect(() => {
    requestAnimationFrame(focusInput);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeKey]);

  const jumpToIndex = (nextIdx) => {
    if (!keys.length) return;
    const i = Math.max(0, Math.min(keys.length - 1, nextIdx));
    setActiveKey(keys[i]);
  };

  const jumpToNextBlank = () => {
    if (!keys.length) return;
    const i = Math.max(0, keys.indexOf(String(activeKey)));
    if (i < keys.length - 1) jumpToIndex(i + 1);
  };

  const jumpToPrevBlank = () => {
    if (!keys.length) return;
    const i = Math.max(0, keys.indexOf(String(activeKey)));
    if (i > 0) jumpToIndex(i - 1);
  };

  const setOne = (key, nextStr) => {
    setValueMap((prev) => {
      const curVal = prev && typeof prev === "object" ? prev : {};
      return { ...curVal, [key]: nextStr };
    });
  };

  const isFilledAll = useMemo(() => {
    if (!blanks.length) return true;
    for (const b of blanks) {
      const k = String(b?.key ?? "");
      if (!k) return false;
      const restLen = getRestLen(b);
      const typed = String(valueMap?.[k] ?? "");
      if (typed.length !== restLen) return false;
    }
    return true;
  }, [blanks, valueMap]);

  const progress = useMemo(() => {
    let done = 0;
    let correct = 0;

    for (const b of blanks) {
      const k = String(b?.key ?? "");
      if (!k) continue;

      const typed = String(valueMap?.[k] ?? "");
      const ansLetters = onlyLetters(b?.answer || "");
      const prefLetters = onlyLetters(b?.prefix || "");
      const rest = ansLetters.slice(Math.min(prefLetters.length, ansLetters.length));

      if (typed) done += 1;
      if (typed && normalize(typed) === normalize(rest)) correct += 1;
    }
    return { done, correct, total: blanks.length };
  }, [blanks, valueMap]);

  const onKeyDown = (e) => {
    const key = String(activeKey || "");
    const b = blankByKey[key];
    if (!b) return;

    // IME 입력 중이면 키다운 처리 X
    if (composingRef.current) return;

    const restLen = getRestLen(b);
    const curTyped = String(valueMap?.[key] ?? "");

    // 좌우로 빈칸 이동
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      jumpToPrevBlank();
      return;
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      jumpToNextBlank();
      return;
    }

    // 백스페이스
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = curTyped.slice(0, -1);
      setOne(key, next);
      return;
    }

    // Enter: 다음 빈칸
    if (e.key === "Enter") {
      e.preventDefault();
      jumpToNextBlank();
      return;
    }

    // 탭은 기본 동작 유지
    if (e.key === "Tab") return;

    // 일반 문자 입력
    if (e.key.length === 1) {
      // 한글키/한글입력 차단
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

      // 1글자 추가
      const next = (curTyped + c).slice(0, restLen);
      setOne(key, next);

      // ✅ 다 채우면 자동 다음 빈칸 이동
      if (next.length >= restLen) {
        // 다음 렌더 후 이동/포커스
        requestAnimationFrame(() => {
          jumpToNextBlank();
          requestAnimationFrame(focusInput);
        });
      }
    }
  };

  const onPaste = (e) => {
    const key = String(activeKey || "");
    const b = blankByKey[key];
    if (!b) return;

    if (composingRef.current) return;

    e.preventDefault();
    const text = e.clipboardData?.getData("text") || "";

    if (hasKorean(text)) {
      showToast("영어만 가능합니다");
      return;
    }

    const cleaned = onlyLetters(text);
    if (!cleaned) return;

    const restLen = getRestLen(b);
    const curTyped = String(valueMap?.[key] ?? "");
    const next = (curTyped + cleaned).slice(0, restLen);
    setOne(key, next);

    // ✅ 붙여넣기로 다 채워도 자동 다음 빈칸
    if (next.length >= restLen) {
      requestAnimationFrame(() => {
        jumpToNextBlank();
        requestAnimationFrame(focusInput);
      });
    }
  };

  const onCompositionStart = () => {
    composingRef.current = true;
  };

  const onCompositionEnd = (e) => {
    composingRef.current = false;
    const v = String(e?.target?.value ?? "");
    // 한글 IME 들어오면 토스트 + 값 정리
    if (hasKorean(v)) {
      showToast("영어만 가능합니다");
    }
  };

  const renderParagraph = useMemo(() => {
    const out = [];
    let cursor = 0;
    const re = /\{\{(\d{2})\}\}/g;
    let m;

    while ((m = re.exec(paragraph)) !== null) {
      const full = m[0];
      const k = m[1];
      const start = m.index;

      out.push(paragraph.slice(cursor, start));
      cursor = start + full.length;

      const b = blankByKey[k];
      if (!b) {
        out.push(full);
        continue;
      }

      const pref = String(b?.prefix || "");
      const ansLetters = onlyLetters(b?.answer || "");
      const prefLetters = onlyLetters(pref);
      const restLen = Math.max(0, ansLetters.length - Math.min(prefLetters.length, ansLetters.length));

      const typed = String(valueMap?.[k] ?? "");
      const isActive = String(activeKey) === String(k);

      const caretPos = Math.min(typed.length, restLen); // 0~restLen

      out.push(
        <PInlineBlank
          key={`blank_${k}`}
          $active={isActive}
          role="button"
          tabIndex={0}
          onMouseDown={(ev) => {
            // ✅ 클릭 시 포커스 확실히 (blur 방지)
            ev.preventDefault();
            setActiveKey(k);
            requestAnimationFrame(focusInput);
          }}
          onKeyDown={(ev) => {
            if (ev.key === "Enter" || ev.key === " ") {
              ev.preventDefault();
              setActiveKey(k);
              requestAnimationFrame(focusInput);
            }
          }}
          aria-label={`blank ${k}`}
        >
          <PInlinePrefix>{pref}</PInlinePrefix>

          {restLen > 0 && (
            <PInlineSlots aria-hidden>
              {Array.from({ length: restLen }).map((_, i) => {
                const ch = typed[i] || "_";
                const showCaret = isActive && i === caretPos;
                return (
                  <span key={i}>
                    {showCaret ? <PCaret /> : null}
                    {ch}
                  </span>
                );
              })}
              {/* 커서가 맨 끝(restLen)일 때 */}
              {isActive && caretPos === restLen ? <PCaret /> : null}
            </PInlineSlots>
          )}
        </PInlineBlank>
      );
    }

    out.push(paragraph.slice(cursor));
    return out;
  }, [paragraph, blankByKey, valueMap, activeKey, focusInput]);

  return (
    <CTWCard>
      <CTWTop>
        <CTWBadge>{step?.trackLabel || "CTW"}</CTWBadge>
        <CTWMeta>
          subject: <b>{step?.subject || "general"}</b> ·{" "}
          <span style={{ opacity: 0.75 }}>
            ({progress.correct}/{progress.total})
          </span>
        </CTWMeta>
      </CTWTop>

      <CTWSentence>
        {renderParagraph}

        {/* ✅ 문장을 덮지 않는 오프스크린 입력기 */}
        <HiddenInput
          ref={inputRef}
          value={String(valueMap?.[String(activeKey)] ?? "")}
          readOnly={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
          onKeyDown={onKeyDown}
          onChange={() => {}}
          onPaste={onPaste}
          onCompositionStart={onCompositionStart}
          onCompositionEnd={onCompositionEnd}
        />
      </CTWSentence>

      <CTWActions>
        <PrimaryBtn type="button" onClick={onAutoNext} disabled={!isFilledAll}>
          다음
        </PrimaryBtn>
      </CTWActions>
    </CTWCard>
  );
}

/* ================= styles ================= */
const Wrap = styled.div`
  padding: 18px 16px 90px;

  /* ✅ test 화면 기본 폰트: 맑은 고딕 */
  font-family: "Malgun Gothic", "맑은 고딕", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;

  @media (max-width: 520px) {
    padding: 12px 10px 88px;
  }
`;

const Top = styled.div`
  display: grid;
  grid-template-columns: 90px 1fr 140px;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;

  @media (max-width: 520px) {
    grid-template-columns: 90px 1fr;
    grid-template-areas:
      "back timer"
      "title title";
    row-gap: 8px;
  }
`;

const BackBtn = styled.button`
  height: 36px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  background: #fff;
  cursor: pointer;

  @media (max-width: 520px) {
    grid-area: back;
  }
`;

const Title = styled.div`
  text-align: center;
  font-weight: 950;
  letter-spacing: -0.2px;

  @media (max-width: 520px) {
    grid-area: title;
    text-align: left;
  }
`;

const TimerBox = styled.div`
  justify-self: end;
  text-align: right;
  font-weight: 950;
  opacity: 0.85;

  @media (max-width: 520px) {
    grid-area: timer;
  }
`;

const Grid = styled.div`
  display: flex;
  gap: 14px;

  .left {
    width: 420px;
    flex: 0 0 420px;
  }
  .right {
    flex: 1 1 auto;
    min-width: 0;
  }

  @media (max-width: 980px) {
    flex-direction: column;
    .right {
      order: 1;
    }
    .left {
      order: 2;
      width: 100%;
      flex: 0 0 auto;
    }
  }
`;

const LeftCard = styled.div`
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.14);
  background: #fff;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const RightCard = styled.div`
  min-width: 0;

  + /* ✅ 모바일에서 화면 끝까지 꽉 차게 (Wrap padding 상쇄) */
@media (max-width: 520px) {
    margin-left: -10px;
    margin-right: -10px;
  }
`;

const MiniBtn = styled.button`
  height: 32px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.14);
  background: #fff;
  cursor: pointer;
  font-weight: 900;
`;

const Pad = styled.div`
  padding: 18px;
`;

const PassageBody = styled.div`
  white-space: pre-wrap;

  font-family: Arial, Helvetica, sans-serif;

  font-size: 16.5px;
  line-height: 1.9;
  letter-spacing: 0.1px;

  color: rgba(0, 0, 0, 0.85);

  max-width: 70ch;

  margin-top: 8px;

 p {
  margin: 0 0 12px;
}

  mark {
    background: rgba(255, 230, 0, 0.6);
    padding: 0 3px;
    border-radius: 3px;
    font-weight: 600;
  }

  @media (max-width: 520px) {
    font-size: 16px;
    line-height: 1.85;
    max-width: 100%;
  }
`;

const Empty = styled.div`
  padding: 18px;
  opacity: 0.7;
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
  box-shadow: 0 18px 40px rgba(10, 18, 30, 0.2);
`;

/* ===== CTW card styles ===== */

const CTWCard = styled.div`
  padding: 16px;
  max-width: 920px;
  margin: 0 auto;

  @media (max-width: 520px) {
    max-width: 100%;
    margin: 0; /* ✅ 가운데 정렬 해제 */
    padding: 14px; /* 살짝 줄여도 좋음 */
  }
`;

const CTWTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;
`;

const CTWBadge = styled.div`
  display: inline-flex;
  padding: 7px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 950;
  background: rgba(30, 136, 255, 0.1);
  border: 1px solid rgba(30, 136, 255, 0.18);
`;

const CTWMeta = styled.div`
  font-size: 12px;
  font-weight: 900;
  opacity: 0.72;
`;

const CTWSentence = styled.div`
  position: relative;
  font-size: 16.5px;
  line-height: 1.62;
  font-weight: 900;
  color: rgba(16, 24, 39, 0.92);
`;

const BlankWrap = styled.span`
  position: relative;
  display: inline-flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 6px;

  padding: 4px 10px;
  margin: 0 6px;

  border-radius: 14px;
  border: 1px solid rgba(30, 136, 255, 0.18);
  background: rgba(30, 136, 255, 0.06);
  cursor: text;

  max-width: 100%;
`;

const SlotsWrap = styled.span`
  position: relative;
  display: inline-flex;
  align-items: baseline;
  flex-wrap: wrap;
  max-width: 100%;
`;

const WordChunk = styled.span`
  display: inline-flex;
  align-items: baseline;
  white-space: pre;
`;

const WordPrefix = styled.span`
  font-weight: 950;
`;

const WordSlots = styled.span`
  font-weight: 950;
  letter-spacing: 1px;
`;

const BetweenWords = styled.span`
  white-space: pre;
`;

const HiddenInput = styled.input`
  position: absolute;
  left: -9999px;
  top: 0;
  width: 1px;
  height: 1px;
  opacity: 0;
  border: none;
  outline: none;
  background: transparent;
  pointer-events: auto;   /* ✅ none -> auto */
`;
const CTWActions = styled.div`
  margin-top: 14px;
  display: grid;
  gap: 10px;
`;

const PrimaryBtn = styled.button`
  height: 48px;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  font-weight: 950;
  color: #fff;
  background: linear-gradient(135deg, #1e88ff, #0055ff);

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }
`;

const GhostBtn = styled.button`
  height: 48px;
  border-radius: 14px;
  border: 1px solid rgba(16, 24, 39, 0.14);
  background: #fff;
  cursor: pointer;
  font-weight: 950;
`;

const MeaningBox = styled.div`
  padding: 12px 12px;
  border-radius: 14px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: rgba(0, 0, 0, 0.03);
  font-weight: 900;
  line-height: 1.5;
`;

const SingleWrap = styled.div`
  display: flex;
  justify-content: center;
`;

const SingleCard = styled.div`
  width: min(980px, 100%);
  border-radius: 18px;
  border: 1px solid rgba(0, 0, 0, 0.14);
  background: #fff;
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.07);
  overflow: hidden;
`;

const InlineBlank = styled.span`
  display: inline-flex;
  align-items: baseline;
  gap: 6px;

  padding: 4px 10px;
  margin: 0 6px;
  border-radius: 999px;

  border: 1px solid rgba(30, 136, 255, 0.22);
  background: rgba(30, 136, 255, 0.1);
  cursor: text;

  position: relative;
  white-space: nowrap;

  max-width: 100%;
  flex-wrap: wrap;
`;

const InlineWord = styled.span`
  display: inline-flex;
  align-items: baseline;
  white-space: nowrap;
`;

const InlinePrefix = styled.span`
  font-weight: 950;
`;

const InlineSlots = styled.span`
  display: inline-flex;
  align-items: baseline;
  font-weight: 950;
  letter-spacing: 2px;

  span {
    display: inline-block;
    min-width: 10px;
    text-align: center;
  }
`;

const InlineBetween = styled.span`
  white-space: pre;
`;

/* ===== CTW Paragraph Inline Blank ===== */

const PInlineBlank = styled.span`
  display: inline-flex;
  align-items: baseline;
  gap: 6px;

  padding: 4px 10px;
  margin: 0 6px;
  border-radius: 999px;

  border: 1px solid rgba(30, 136, 255, ${(p) => (p.$active ? 0.35 : 0.22)});
  background: rgba(30, 136, 255, ${(p) => (p.$active ? 0.16 : 0.1)});
  cursor: text;

  position: relative;
  white-space: nowrap;

  max-width: 100%;
  flex-wrap: wrap;
`;

const PInlinePrefix = styled.span`
  font-weight: 950;
`;

const PInlineSlots = styled.span`
  display: inline-flex;
  align-items: baseline;
  font-weight: 950;
  letter-spacing: 2px;

  span {
    display: inline-block;
    min-width: 10px;
    text-align: center;
  }
`;

const blink = keyframes`
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
`;

const PCaret = styled.span`
  display: inline-block;
  width: 2px;
  height: 1.05em;
  margin: 0 2px 0 1px;
  background: rgba(16, 24, 39, 0.9);
  transform: translateY(2px);
  animation: ${blink} 1s steps(1) infinite;
`;

const IntroShell = styled.div`
  display: flex;
  justify-content: center;
`;

const IntroCard = styled.div`
  width: min(980px, 100%);
  background: #fff;
  border-radius: 18px;
  border: 1px solid rgba(0, 0, 0, 0.14);
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.07);
  padding: 34px 34px 26px;
  overflow: hidden;

  @media (max-width: 520px) {
    padding: 22px 18px 18px;
  }
`;

const IntroH1 = styled.div`
  font-size: 28px;
  font-weight: 950;
  letter-spacing: -0.6px;
`;

const IntroLine = styled.div`
  height: 1px;
  background: rgba(0, 0, 0, 0.14);
  margin: 14px 0 26px;
`;

const IntroText = styled.p`
  margin: 0 0 18px;
  font-size: 16px;
  line-height: 1.8;
  color: rgba(16, 24, 39, 0.92);

  b {
    font-weight: 950;
  }
`;

const IntroActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 18px;
  padding-top: 12px;
`;

const IntroPrimary = styled.button`
  height: 44px;
  padding: 0 16px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 950;
  color: #fff;
  background: rgba(16, 24, 39, 0.92);
`;

const IntroGhost = styled.button`
  height: 44px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid rgba(16, 24, 39, 0.16);
  background: #fff;
  cursor: pointer;
  font-weight: 950;
`;

const SectionH1 = styled.div`
  font-size: 28px;
  font-weight: 950;
  letter-spacing: -0.6px;
`;

const SectionText = styled.p`
  margin: 0 0 14px;
  font-size: 16px;
  line-height: 1.8;
  color: rgba(16, 24, 39, 0.92);
`;

const TaskTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 18px;

  th,
  td {
    text-align: left;
    padding: 14px 12px;
    border-top: 1px solid rgba(0, 0, 0, 0.12);
    font-size: 14.5px;
    line-height: 1.6;
  }

  thead th {
    background: rgba(0, 0, 0, 0.05);
    font-weight: 950;
  }

  tbody td:first-child {
    width: 44%;
    font-weight: 900;
  }

  @media (max-width: 520px) {
    th,
    td {
      padding: 12px 10px;
      font-size: 14px;
    }
  }
`;

