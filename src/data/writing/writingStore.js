// src/data/writing/writingStore.js
export const LS_WRITING_PROGRESS = "writing_mock_progress_v1";
export const LS_WRITING_REPORT = "writing_mock_report_v1";

/* ===== storage utils ===== */
function safeParse(raw, fallback) {
  try {
    const v = JSON.parse(raw);
    return v ?? fallback;
  } catch {
    return fallback;
  }
}
export function loadJson(key, fallback) {
  return safeParse(localStorage.getItem(key), fallback);
}
export function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/* ===== grading ===== */
function normSpaces(s) {
  return String(s ?? "").replace(/\s+/g, " ").trim();
}
function normForCompare(s) {
  return normSpaces(s).toLowerCase();
}

export function gradeTask1(items, userAnswers) {
  const list = Array.isArray(items) ? items : [];

  let correct = 0;
  const details = list.map((it) => {
    const u = normForCompare(userAnswers?.[it.no] ?? "");
    const a = normForCompare(it.answer);
    const ok = u === a;
    if (ok) correct += 1;
    return {
      no: it.no,
      user: userAnswers?.[it.no] ?? "",
      answer: it.answer,
      correct: ok,
    };
  });

  return { correct, total: list.length, details };
}