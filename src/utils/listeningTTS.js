// src/utils/listeningTTS.js

let utteranceQueue = [];
let currentToken = 0;

/* ================= basic helpers ================= */

export function getEnglishVoices() {
  if (typeof window === "undefined" || !window.speechSynthesis) return [];

  const voices = window.speechSynthesis.getVoices() || [];

  return voices.filter((v) => {
    const lang = String(v.lang || "").toLowerCase();
    return lang.startsWith("en");
  });
}

export function getLangFromAccent(accent = "us") {
  const a = String(accent || "us").toLowerCase();

  if (a === "uk" || a === "british" || a === "gb") return "en-GB";
  if (a === "au" || a === "australian") return "en-AU";
  return "en-US";
}

function includesAny(text, arr) {
  const t = String(text || "").toLowerCase();
  return arr.some((x) => t.includes(String(x).toLowerCase()));
}

function scoreVoiceByAccent(voice, accent = "us") {
  const name = String(voice?.name || "");
  const lang = String(voice?.lang || "");

  let score = 0;
  const a = String(accent || "us").toLowerCase();

  if (a === "uk" || a === "british" || a === "gb") {
    if (lang.toLowerCase().includes("en-gb")) score += 8;
    if (includesAny(name, ["uk", "british", "england", "great britain"])) score += 6;
  } else if (a === "au" || a === "australian") {
    if (lang.toLowerCase().includes("en-au")) score += 8;
    if (includesAny(name, ["australia", "australian"])) score += 6;
  } else {
    if (lang.toLowerCase().includes("en-us")) score += 8;
    if (includesAny(name, ["us", "united states", "america", "american"])) score += 6;
  }

  if (voice?.default) score += 2;
  if (includesAny(name, ["google", "microsoft", "samantha", "zira", "david", "mark", "jenny", "aria", "guy"])) {
    score += 1.5;
  }

  return score;
}

function sortVoicesByAccent(voices, accent = "us") {
  return [...(voices || [])].sort((a, b) => scoreVoiceByAccent(b, accent) - scoreVoiceByAccent(a, accent));
}

export function pickVoiceByAccent(voices, accent = "us") {
  const sorted = sortVoicesByAccent(voices, accent);
  return sorted[0] || null;
}

function isLikelyFemaleVoice(voice) {
  const name = String(voice?.name || "").toLowerCase();
  return includesAny(name, [
    "female",
    "woman",
    "zira",
    "samantha",
    "victoria",
    "karen",
    "moira",
    "ava",
    "emma",
    "aria",
    "jenny",
    "susan",
  ]);
}

function isLikelyMaleVoice(voice) {
  const name = String(voice?.name || "").toLowerCase();
  return includesAny(name, [
    "male",
    "man",
    "david",
    "mark",
    "alex",
    "daniel",
    "fred",
    "tom",
    "oliver",
    "guy",
    "aaron",
    "ryan",
  ]);
}

export function pickVoicePairByAccent(voices, accent = "us") {
  const sorted = sortVoicesByAccent(voices, accent);

  if (!sorted.length) {
    return { vA: null, vB: null };
  }

  const female = sorted.find(isLikelyFemaleVoice) || null;
  const male = sorted.find(isLikelyMaleVoice) || null;

  if (female && male && female !== male) {
    return { vA: female, vB: male };
  }

  if (sorted.length >= 2) {
    return { vA: sorted[0], vB: sorted[1] };
  }

  return { vA: sorted[0], vB: sorted[0] };
}

/* ================= natural chunking ================= */

export function normalizeTTSInput(text = "") {
  return String(text || "")
    .replace(/\s+/g, " ")
    .replace(/([,.!?;:])([A-Za-z])/g, "$1 $2")
    .trim();
}

export function splitForNaturalTTS(text = "") {
  const normalized = normalizeTTSInput(text);
  if (!normalized) return [];

  // 1차: 문장 단위
  const sentenceChunks = normalized
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const finalChunks = [];

  for (const sentence of sentenceChunks) {
    // 2차: 쉼표/접속부 기준 추가 분할
    const sub = sentence
      .split(/(?<=,)\s+|(?<=;)\s+|(?<=:)\s+|(?<=—)\s+|(?<=-)\s+/)
      .map((s) => s.trim())
      .filter(Boolean);

    for (const piece of sub) {
      // 너무 긴 경우 추가로 끊기
      if (piece.length > 120) {
        const smaller = piece
          .split(/\s+(?=(and|but|so|because|although|however|then|well|actually|anyway)\b)/i)
          .map((s) => s.trim())
          .filter(Boolean);

        if (smaller.length > 1) finalChunks.push(...smaller);
        else finalChunks.push(piece);
      } else {
        finalChunks.push(piece);
      }
    }
  }

  return finalChunks.filter(Boolean);
}

/* ================= prosody helpers ================= */

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getChunkPauseMs(chunk = "", base = 120) {
  const t = String(chunk || "").trim();

  if (!t) return base;

  if (/[?]$/.test(t)) return base + randomBetween(170, 260);
  if (/[!]$/.test(t)) return base + randomBetween(160, 240);
  if (/[.]$/.test(t)) return base + randomBetween(140, 210);
  if (/[,]$/.test(t)) return base + randomBetween(110, 170);
  if (/[;:]$/.test(t)) return base + randomBetween(130, 190);

  return base + randomBetween(80, 150);
}

function getChunkStyle(chunk = "", baseRate = 0.98, basePitch = 1.0) {
  const t = String(chunk || "").trim();

  let rate = baseRate;
  let pitch = basePitch;

  if (/[?]$/.test(t)) {
    rate -= 0.04;
    pitch += 0.03;
  }

  if (/[!]$/.test(t)) {
    rate += 0.01;
    pitch += 0.05;
  }

  if (t.length <= 12) {
    rate -= 0.02;
  }

  if (/^(well|oh|so|right|actually|anyway|hmm|uh|um)\b/i.test(t)) {
    rate -= 0.03;
  }

  return {
    rate: clamp(rate, 0.82, 1.12),
    pitch: clamp(pitch, 0.85, 1.18),
  };
}

/* ================= core speech ================= */

export function stopTTS() {
  currentToken += 1;
  utteranceQueue = [];

  if (typeof window === "undefined" || !window.speechSynthesis) return;

  try {
    window.speechSynthesis.cancel();
  } catch {}
}

function speakChunk(text, opts = {}, tokenAtStart) {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      resolve();
      return;
    }

    if (!text || currentToken !== tokenAtStart) {
      resolve();
      return;
    }

    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance(text);

    if (opts.voice) u.voice = opts.voice;
    if (opts.lang) u.lang = opts.lang;
    u.rate = clamp(Number(opts.rate ?? 0.98), 0.7, 1.2);
    u.pitch = clamp(Number(opts.pitch ?? 1), 0.7, 1.3);
    u.volume = clamp(Number(opts.volume ?? 1), 0, 1);

    u.onend = () => resolve();
    u.onerror = (e) => reject(e);

    utteranceQueue.push(u);
    synth.speak(u);
  });
}

export async function speakTTS(text, opts = {}) {
  const tokenAtStart = currentToken;
  const chunks = splitForNaturalTTS(text);

  for (const chunk of chunks) {
    if (currentToken !== tokenAtStart) return;

    const dynamic = getChunkStyle(chunk, Number(opts.rate ?? 0.98), Number(opts.pitch ?? 1));

    try {
      await speakChunk(
        chunk,
        {
          ...opts,
          rate: dynamic.rate,
          pitch: dynamic.pitch,
        },
        tokenAtStart
      );
    } catch {
      // 일부 브라우저에서 간헐적으로 onerror가 발생해도 다음 chunk로 진행
    }

    if (currentToken !== tokenAtStart) return;

    await wait(getChunkPauseMs(chunk, Number(opts.baseGap ?? 120)), tokenAtStart);
  }
}

export function wait(ms, tokenAtStart = currentToken) {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      if (tokenAtStart !== currentToken) {
        resolve();
        return;
      }
      resolve();
    }, ms);
  });
}

/* ================= dialogue-level helper ================= */

export async function speakDialogueTurns(dialogue = [], opts = {}) {
  const tokenAtStart = currentToken;

  const {
    voices = [],
    accent = "us",
    baseLang,
    speakerMap = {},
    turnGapMin = 180,
    turnGapMax = 320,
  } = opts;

  const lang = baseLang || getLangFromAccent(accent);
  const pair = pickVoicePairByAccent(voices, accent);

  for (const turn of dialogue) {
    if (currentToken !== tokenAtStart) return;

    const speakerKey = String(turn?.speaker || turn?.spk || "A").toUpperCase();

    const defaultVoice = speakerKey === "B" ? pair.vB : pair.vA;

    const style =
      speakerMap[speakerKey] ||
      (speakerKey === "B"
        ? {
            voice: pair.vB || defaultVoice,
            rate: 0.94,
            pitch: 0.95,
            baseGap: 135,
          }
        : {
            voice: pair.vA || defaultVoice,
            rate: 1.01,
            pitch: 1.05,
            baseGap: 110,
          });

    const text = String(turn?.text || "").trim();
    if (!text) continue;

    await speakTTS(text, {
      voice: style.voice || defaultVoice,
      lang,
      rate: style.rate,
      pitch: style.pitch,
      baseGap: style.baseGap,
      volume: 1,
    });

    if (currentToken !== tokenAtStart) return;

    await wait(randomBetween(turnGapMin, turnGapMax), tokenAtStart);
  }
}