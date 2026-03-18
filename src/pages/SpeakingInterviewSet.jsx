import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import {
  ChevronLeft,
  Mic,
  Square,
  Play,
  Pause,
  Eye,
  EyeOff,
  ChevronRight,
  Volume2,
} from "lucide-react";
import { SPEAKING_BANK } from "../data/speaking/speakingBank";

const LS_SPEAKING_PROGRESS = "speaking_progress_v1";

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
  return safeJsonParse(localStorage.getItem(LS_SPEAKING_PROGRESS), {});
}
function saveAllProgress(all) {
  localStorage.setItem(LS_SPEAKING_PROGRESS, JSON.stringify(all));
}
function getQueryIndex(search) {
  const sp = new URLSearchParams(search);
  const n = parseInt(sp.get("i") || "0", 10);
  return Number.isFinite(n) ? Math.max(0, n) : 0;
}
function formatMMSS(sec) {
  const s = Math.max(0, Math.floor(sec || 0));
  const m = String(Math.floor(s / 60)).padStart(2, "0");
  const r = String(s % 60).padStart(2, "0");
  return `${m}:${r}`;
}
function speakTTS(
  text,
  { lang = "en-US", rate = 1.0, pitch = 1.0, onEnd, onError } = {}
) {
  try {
    if (!("speechSynthesis" in window)) throw new Error("no-speechSynthesis");
    if (!text) throw new Error("empty-text");
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = rate;
    u.pitch = pitch;
    u.onend = () => onEnd?.();
    u.onerror = () => onError?.();
    window.speechSynthesis.speak(u);
    return true;
  } catch {
    onError?.();
    return false;
  }
}

export default function SpeakingInterviewSet() {
  const nav = useNavigate();
  const { partKey } = useParams(); // "interview"
  const loc = useLocation();
  const setIndex = getQueryIndex(loc.search);

  /* ================= set / items ================= */
  const set = useMemo(() => {
    const list = SPEAKING_BANK?.[partKey] || [];
    return list?.[setIndex] || null;
  }, [partKey, setIndex]);

  const items = set?.questions || [];
  const total = items.length;

  /* ================= state ================= */
  const [idx, setIdx] = useState(0);
  const item = items[idx];

  // idle -> prompting -> speaking -> done
  const [phase, setPhase] = useState("idle");
  const [showQuestion, setShowQuestion] = useState(false);

  const RESPONSE_SEC = 45;
  const [respLeft, setRespLeft] = useState(RESPONSE_SEC);
  const tickRef = useRef(null);

  // record
  const mediaPackRef = useRef(null); // { mr, stream }
  const chunksRef = useRef([]);
  const [isRecording, setIsRecording] = useState(false);

  // my recording playback
  const [myBlobUrl, setMyBlobUrl] = useState("");
  const myAudioRef = useRef(null);

  const [isPlayingMine, setIsPlayingMine] = useState(false);
  const [mineCur, setMineCur] = useState(0);
  const [mineDur, setMineDur] = useState(0);

  // progress
  const [allProgress, setAllProgress] = useState(() => loadAllProgress());
  const progressKey = set?.id || "interview_set";
  const p = allProgress[progressKey] || { done: 0, total, correct: 0, attempts: {} };

  /* ================= guards ================= */
  if (!set) {
    return (
      <Wrap>
        <Card>
          <TopBar>
            <Back type="button" onClick={() => nav("/speaking")}>
              <ChevronLeft size={18} />
              Speaking
            </Back>
            <Meta>
              <div className="title">세트를 찾을 수 없습니다.</div>
              <div className="sub">bank/라우팅을 확인하세요.</div>
            </Meta>
          </TopBar>
        </Card>
      </Wrap>
    );
  }

  const qText = item?.question || item?.prompt || item?.text || "(질문 없음)";

  /* ================= cleanup helpers ================= */
  const stopTimer = useCallback(() => {
    if (tickRef.current) clearInterval(tickRef.current);
    tickRef.current = null;
  }, []);

  const stopTTS = useCallback(() => {
    try {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    } catch {}
  }, []);

  const stopMyAudio = useCallback(() => {
    try {
      const a = myAudioRef.current;
      if (!a) return;
      a.pause();
      a.currentTime = 0;
    } catch {}
  }, []);

  const revokeBlob = useCallback(() => {
    try {
      if (myBlobUrl) URL.revokeObjectURL(myBlobUrl);
    } catch {}
  }, [myBlobUrl]);

  const stopRecordingSafe = useCallback(() => {
    try {
      const pack = mediaPackRef.current;
      if (!pack) return;
      const { mr, stream } = pack;
      if (mr && mr.state !== "inactive") mr.stop();
      // onstop에서 stream stop도 처리하지만,
      // 혹시 onstop이 못타면 여기서도 안전하게 끊어둠
      try {
        stream?.getTracks?.().forEach((t) => t.stop());
      } catch {}
    } catch {}
  }, []);

  const stopAllAudio = useCallback(() => {
    stopMyAudio();
    stopTTS();
  }, [stopMyAudio, stopTTS]);

  /* ================= progress ================= */
  const saveDoneForItem = useCallback(() => {
    const already = !!p?.attempts?.[item?.id]?.did;
    const next = { ...allProgress };
    const attempts = { ...(p.attempts || {}) };

    if (item?.id) attempts[item.id] = { did: true, ts: Date.now() };

    next[progressKey] = {
      ...p,
      total,
      attempts,
      done: already ? p.done : Math.min(total, (p.done || 0) + 1),
    };

    setAllProgress(next);
    saveAllProgress(next);
  }, [allProgress, item?.id, p, progressKey, total]);

  /* ================= recording ================= */
  const startRecording = useCallback(async () => {
    // 기존 녹음/스트림 정리
    stopRecordingSafe();
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaPackRef.current = { mr, stream };

      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };

      mr.onstop = () => {
        try {
          stream.getTracks().forEach((t) => t.stop());
        } catch {}

        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);

        // 기존 blob revoke 후 교체
        try {
          if (myBlobUrl) URL.revokeObjectURL(myBlobUrl);
        } catch {}
        setMyBlobUrl(url);

        setIsRecording(false);
        saveDoneForItem();
      };

      mr.start();
      setIsRecording(true);
    } catch {
      alert("마이크 권한이 필요합니다. 브라우저 설정에서 마이크를 허용해 주세요.");
      setIsRecording(false);
    }
  }, [myBlobUrl, saveDoneForItem, stopRecordingSafe]);

  /* ================= timer ================= */
  const startResponseTimer = useCallback(() => {
    setPhase("speaking");
    setRespLeft(RESPONSE_SEC);

    // 녹음 시작
    startRecording();

    // 타이머
    stopTimer();
    tickRef.current = setInterval(() => {
      setRespLeft((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          stopTimer();
          setPhase("done");
          stopRecordingSafe();
          return 0;
        }
        return next;
      });
    }, 1000);
  }, [RESPONSE_SEC, startRecording, stopRecordingSafe, stopTimer]);

  /* ================= actions ================= */
  const onStart = useCallback(() => {
    // START: 질문 텍스트는 숨긴 채, TTS로만 듣기 -> 끝나면 45초 시작
    stopAllAudio();
    stopTimer();

    setPhase("prompting");
    setShowQuestion(false);
    setRespLeft(RESPONSE_SEC);

    const text = qText && qText !== "(질문 없음)" ? qText : "";
    if (!text) {
      startResponseTimer();
      return;
    }

    speakTTS(text, {
      lang: "en-US",
      rate: 1.0,
      pitch: 1.0,
      onEnd: () => startResponseTimer(),
      onError: () => startResponseTimer(),
    });
  }, [RESPONSE_SEC, qText, startResponseTimer, stopAllAudio, stopTimer]);

  const onStop = useCallback(() => {
    // 강제 종료: TTS/타이머/녹음 모두 stop
    stopAllAudio();
    stopTimer();
    stopRecordingSafe();
    setPhase("done");
    setRespLeft(0);
  }, [stopAllAudio, stopRecordingSafe, stopTimer]);

  const toggleMyPlayback = useCallback(async () => {
    try {
      const a = myAudioRef.current;
      if (!a || !myBlobUrl) return;

      if (!a.paused && !a.ended) {
        a.pause();
        return;
      }

      // ETS 느낌: 재생 시작 시 0부터
      a.currentTime = 0;
      await a.play();
    } catch {}
  }, [myBlobUrl]);

  const goPrev = () => setIdx((v) => Math.max(0, v - 1));
  const goNext = () => setIdx((v) => Math.min(total - 1, v + 1));

  /* ================= effects ================= */
  // idx 바뀌면 완전 초기화
  useEffect(() => {
    setPhase("idle");
    setRespLeft(RESPONSE_SEC);
    setShowQuestion(false);

    // 재생 상태 초기화
    setIsPlayingMine(false);
    setMineCur(0);
    setMineDur(0);

    stopAllAudio();
    stopTimer();
    stopRecordingSafe();

    // blob 정리
    revokeBlob();
    setMyBlobUrl("");

    chunksRef.current = [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  // unmount cleanup
  useEffect(() => {
    return () => {
      stopAllAudio();
      stopTimer();
      stopRecordingSafe();
      try {
        if (myBlobUrl) URL.revokeObjectURL(myBlobUrl);
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ================= render ================= */
  return (
    <Wrap>
      <Card>
        <TopBar>
          <Back type="button" onClick={() => nav("/speaking")}>
            <ChevronLeft size={18} />
            Speaking
          </Back>

          <Meta>
            <div className="title">{set.title || "Interview Practice"}</div>
            <div className="sub">
              Question <b>{idx + 1}</b> / {total} · 완료 <b>{p.done || 0}</b> / {total}
            </div>
          </Meta>

          <RightTools>
            <ToolBtn
              type="button"
              onClick={() => setShowQuestion((v) => !v)}
              title="질문 텍스트 표시/숨김"
            >
              {showQuestion ? <EyeOff size={18} /> : <Eye size={18} />}
              {showQuestion ? "질문 숨기기" : "질문 보기"}
            </ToolBtn>
          </RightTools>
        </TopBar>

        <Body>
          {/* RESPONSE TIME */}
          <TimeRow>
            <TimeBox>
              <div className="kicker">RESPONSE TIME</div>
              <div className="clock">{formatMMSS(respLeft)}</div>
              <div className="state">
                {phase === "idle" && <Badge>READY</Badge>}
                {phase === "prompting" && <Badge $on>LISTENING…</Badge>}
                {phase === "speaking" && <Badge $on>SPEAK</Badge>}
                {phase === "done" && <Badge>DONE</Badge>}
              </div>
            </TimeBox>
          </TimeRow>

          {/* QUESTION (default hidden) */}
          <QuestionBox>
            <QHead>
              <div className="left">
                <div className="k">QUESTION {idx + 1}</div>
                <div className="tip">
                  START를 누르면 질문이 <b>화면에 표시되지 않은 채</b> 먼저 읽히고, 곧바로{" "}
                  <b>45초 답변</b>이 시작됩니다.
                </div>
              </div>
              <div className="right">Press START to begin.</div>
            </QHead>

            {showQuestion ? <QText>{qText}</QText> : (
              <QHidden>
                질문은 숨김 상태입니다. <b>“질문 보기”</b>를 누르면 확인할 수 있어요.
              </QHidden>
            )}
          </QuestionBox>

          {/* CONTROLS */}
          <Controls>
            <PrimaryBtn
              type="button"
              onClick={onStart}
              disabled={phase === "prompting" || phase === "speaking"}
              title="질문을 읽고(숨김) 바로 답변 시작"
            >
              <Mic size={18} />
              START
            </PrimaryBtn>

            <GhostBtn
              type="button"
              onClick={onStop}
              disabled={phase === "idle" || phase === "done"}
              title="진행 중인 세션 강제 종료"
            >
              <Square size={18} />
              STOP
            </GhostBtn>

            {/* ✅ 재생 표시/토글 */}
            <PlayBtn
              type="button"
              onClick={toggleMyPlayback}
              disabled={!myBlobUrl}
              $playing={isPlayingMine}
              title={myBlobUrl ? "내 녹음 재생/정지" : "녹음 후 재생 가능합니다."}
            >
              {isPlayingMine ? <Pause size={18} /> : <Play size={18} />}
              {isPlayingMine ? "재생 중…" : "내 녹음 듣기"}
              {isPlayingMine ? (
                <>
                  <PlayingDot aria-hidden="true" />
                  <SoundWave aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </SoundWave>
                </>
              ) : (
                <Volume2 size={18} style={{ opacity: 0.7, marginLeft: 2 }} />
              )}
            </PlayBtn>

            <MiniTime aria-label="내 녹음 재생 시간">
              {myBlobUrl ? `${formatMMSS(mineCur)} / ${formatMMSS(mineDur)}` : "—"}
            </MiniTime>
          </Controls>

          {/* MY RECORDING BOX */}
          <Playback>
            <div className="left">
              <div className="cap">내 녹음</div>
              <div className="desc">
                {myBlobUrl
                  ? isPlayingMine
                    ? "재생 중입니다."
                    : "재생 가능합니다."
                  : isRecording
                    ? "녹음 중입니다…"
                    : "아직 녹음이 없습니다."}
              </div>
            </div>

            <audio
              ref={myAudioRef}
              src={myBlobUrl || undefined}
              onPlay={() => setIsPlayingMine(true)}
              onPause={() => setIsPlayingMine(false)}
              onEnded={() => setIsPlayingMine(false)}
              onLoadedMetadata={(e) => setMineDur(e.currentTarget.duration || 0)}
              onTimeUpdate={(e) => setMineCur(e.currentTarget.currentTime || 0)}
            />
          </Playback>

          {/* NAV */}
          <NavRow>
            <NavBtn type="button" onClick={goPrev} disabled={idx === 0}>
              <ChevronLeft size={18} />
              이전
            </NavBtn>

            <NavBtn type="button" onClick={goNext} disabled={idx === total - 1}>
              다음
              <ChevronRight size={18} />
            </NavBtn>
          </NavRow>
        </Body>
      </Card>
    </Wrap>
  );
}

/* ===================== styles ===================== */

const Wrap = styled.div`
  padding: 18px;
`;

const Card = styled.div`
  max-width: 980px;
  margin: 0 auto;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(11, 18, 32, 0.1);
  box-shadow: 0 18px 44px rgba(10, 18, 30, 0.1);
  overflow: hidden;
`;

const TopBar = styled.div`
  padding: 14px 14px;
  border-bottom: 1px solid rgba(11, 18, 32, 0.08);
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
`;

const Back = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 10px;
  border-radius: 12px;
  border: 1px solid rgba(11, 18, 32, 0.12);
  background: white;
  cursor: pointer;
  font-weight: 900;
`;

const Meta = styled.div`
  flex: 1;
  .title {
    font-weight: 950;
    letter-spacing: -0.2px;
  }
  .sub {
    margin-top: 2px;
    font-size: 12.5px;
    color: rgba(11, 18, 32, 0.65);
  }
`;

const RightTools = styled.div`
  display: flex;
  gap: 8px;
`;

const ToolBtn = styled.button`
  height: 36px;
  padding: 0 10px;
  border-radius: 12px;
  border: 1px solid rgba(11, 18, 32, 0.12);
  background: white;
  cursor: pointer;
  font-weight: 900;
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

const Body = styled.div`
  padding: 14px;
  display: grid;
  gap: 12px;
`;

const TimeRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
`;

const TimeBox = styled.div`
  border-radius: 16px;
  border: 1px solid rgba(11, 18, 32, 0.1);
  background: rgba(245, 247, 250, 0.75);
  padding: 14px;

  .kicker {
    font-weight: 950;
    font-size: 12px;
    letter-spacing: 0.6px;
    opacity: 0.7;
  }
  .clock {
    margin-top: 8px;
    font-size: 40px;
    font-weight: 950;
    letter-spacing: 0.5px;
  }
  .state {
    margin-top: 8px;
  }
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  font-weight: 950;
  font-size: 12px;
  color: ${(p) => (p.$on ? "#03221e" : "rgba(11,18,32,.72)")};
  background: ${(p) => (p.$on ? "rgba(153,246,228,.9)" : "rgba(11,18,32,.05)")};
  border: 1px solid ${(p) => (p.$on ? "rgba(13,148,136,.25)" : "rgba(11,18,32,.08)")};
`;

const QuestionBox = styled.div`
  border-radius: 16px;
  border: 1px solid rgba(11, 18, 32, 0.1);
  background: white;
  padding: 14px;
`;

const QHead = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;

  .k {
    font-weight: 950;
    font-size: 12px;
    letter-spacing: 0.6px;
    opacity: 0.7;
  }
  .tip {
    margin-top: 6px;
    font-size: 12.5px;
    color: rgba(11, 18, 32, 0.62);
    line-height: 1.45;
  }
  .right {
    font-size: 12.5px;
    color: rgba(11, 18, 32, 0.55);
    white-space: nowrap;
  }
`;

const QText = styled.div`
  margin-top: 10px;
  font-size: 18px;
  font-weight: 900;
  line-height: 1.35;
  letter-spacing: -0.2px;
`;

const QHidden = styled.div`
  margin-top: 10px;
  font-size: 13px;
  color: rgba(11, 18, 32, 0.62);
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(245, 247, 250, 0.8);
  border: 1px dashed rgba(11, 18, 32, 0.16);

  b {
    color: rgba(13, 148, 136, 0.95);
  }
`;

const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
`;

const PrimaryBtn = styled.button`
  height: 44px;
  padding: 0 16px;
  border-radius: 14px;
  border: none;
  cursor: pointer;
  font-weight: 950;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #03221e;
  background: linear-gradient(135deg, rgba(153, 246, 228, 1), rgba(13, 148, 136, 1));
  box-shadow: 0 12px 22px rgba(13, 148, 136, 0.16);

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const GhostBtn = styled.button`
  height: 44px;
  padding: 0 14px;
  border-radius: 14px;
  border: 1px solid rgba(11, 18, 32, 0.12);
  background: white;
  cursor: pointer;
  font-weight: 900;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

const PlayBtn = styled.button`
  height: 44px;
  padding: 0 14px;
  border-radius: 14px;
  border: 2px solid ${(p) => (p.$playing ? "rgba(13,148,136,.55)" : "rgba(11,18,32,.12)")};
  background: ${(p) => (p.$playing ? "rgba(153,246,228,.30)" : "white")};
  cursor: pointer;
  font-weight: 950;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

const MiniTime = styled.div`
  height: 44px;
  padding: 0 12px;
  display: inline-flex;
  align-items: center;
  border-radius: 14px;
  border: 1px solid rgba(11, 18, 32, 0.12);
  background: rgba(245, 247, 250, 0.65);
  font-weight: 900;
  font-size: 12.5px;
  color: rgba(11, 18, 32, 0.7);
`;

const pulse = `
@keyframes pulseDot {
  0% { transform: scale(1); opacity: .65; }
  50% { transform: scale(1.35); opacity: 1; }
  100% { transform: scale(1); opacity: .65; }
}
@keyframes wave {
  0% { transform: scaleY(.35); opacity: .6; }
  50% { transform: scaleY(1); opacity: 1; }
  100% { transform: scaleY(.35); opacity: .6; }
}
`;

const PlayingDot = styled.span`
  ${pulse}
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: rgba(13, 148, 136, 1);
  display: inline-block;
  animation: pulseDot 0.9s ease-in-out infinite;
  margin-left: 2px;
`;

const SoundWave = styled.span`
  ${pulse}
  display: inline-flex;
  gap: 3px;
  margin-left: 2px;
  align-items: flex-end;

  i {
    width: 3px;
    height: 14px;
    border-radius: 999px;
    background: rgba(13, 148, 136, 0.9);
    display: inline-block;
    transform-origin: bottom;
    animation: wave 0.9s ease-in-out infinite;
  }
  i:nth-child(2) {
    animation-delay: 0.12s;
    height: 10px;
    opacity: 0.85;
  }
  i:nth-child(3) {
    animation-delay: 0.24s;
    height: 12px;
    opacity: 0.9;
  }
`;

const Playback = styled.div`
  border-radius: 14px;
  border: 1px solid rgba(11, 18, 32, 0.1);
  background: rgba(245, 247, 250, 0.6);
  padding: 12px;
  display: flex;
  justify-content: space-between;
  gap: 12px;

  .cap {
    font-weight: 950;
    font-size: 13px;
  }
  .desc {
    margin-top: 4px;
    font-size: 12.5px;
    color: rgba(11, 18, 32, 0.65);
  }
`;

const NavRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;

const NavBtn = styled.button`
  height: 44px;
  flex: 1;
  border-radius: 14px;
  border: 1px solid rgba(11, 18, 32, 0.12);
  background: white;
  cursor: pointer;
  font-weight: 950;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;