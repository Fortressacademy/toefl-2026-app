// src/pages/SpeakingListenRepeatSet.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Play, Square, Mic, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
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
function speakTTS(text) {
  try {
    if (!("speechSynthesis" in window)) return false;
    if (!text) return false;

    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = 1.0;
    u.pitch = 1.0;
    window.speechSynthesis.speak(u);
    return true;
  } catch {
    return false;
  }
}

export default function SpeakingListenRepeatSet() {
  const nav = useNavigate();
  const { partKey } = useParams(); // "listenRepeat"
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
  const [hasPlayedPrompt, setHasPlayedPrompt] = useState(false);

  // ✅ 문장 숨김/보기 토글
  const [showText, setShowText] = useState(false);

  // prompt audio
  const promptAudioRef = useRef(null);

  // record
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const [isRecording, setIsRecording] = useState(false);

  // my recording
  const [myBlobUrl, setMyBlobUrl] = useState("");
  const myAudioRef = useRef(null);

  // progress
  const [allProgress, setAllProgress] = useState(() => loadAllProgress());

  /* ================= guards ================= */
  if (!set) {
    return (
      <Wrap>
        <Card>
          <Title>세트를 찾을 수 없습니다.</Title>
          <Sub>bank/라우팅을 확인하세요.</Sub>
          <Row>
            <Btn onClick={() => nav("/speaking")} type="button">
              돌아가기
            </Btn>
          </Row>
        </Card>
      </Wrap>
    );
  }

  const item = items[idx];

  /* ================= progress ================= */
  const progressKey = set.id; // Speaking.jsx에서 set.id로 진행 읽는 구조에 맞춤
  const p = allProgress[progressKey] || { done: 0, total, correct: 0, attempts: {} };

  const finishAttempt = () => {
    // 이미 done 처리된 아이템이면 중복 증가 방지
    const already = !!p?.attempts?.[item?.id]?.did;

    const next = { ...allProgress };
    const attempts = { ...(p.attempts || {}) };
    attempts[item?.id] = { did: true, ts: Date.now() };

    next[progressKey] = {
      ...p,
      total,
      attempts,
      done: already ? p.done : Math.min(total, (p.done || 0) + 1),
    };

    setAllProgress(next);
    saveAllProgress(next);
  };

  /* ================= helpers ================= */
  const stopAllAudio = () => {
    try {
      // prompt
      if (promptAudioRef.current) {
        promptAudioRef.current.pause();
        promptAudioRef.current.currentTime = 0;
      }
      // my recording
      if (myAudioRef.current) {
        myAudioRef.current.pause();
        myAudioRef.current.currentTime = 0;
      }
      // tts
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    } catch {}
  };

  const cleanupStream = () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    } catch {}
    streamRef.current = null;
  };

  const cleanupMyBlobUrl = () => {
    try {
      if (myBlobUrl) URL.revokeObjectURL(myBlobUrl);
    } catch {}
  };

  /* ================= effects ================= */
  // idx 바뀔 때 상태 리셋
  useEffect(() => {
    // ✅ 다음 아이템으로 가면 문장 다시 숨김
    setShowText(false);

    setHasPlayedPrompt(false);

    // 녹음 중이면 강제 중지
    try {
      const mr = mediaRecorderRef.current;
      if (mr && mr.state !== "inactive") mr.stop();
    } catch {}
    setIsRecording(false);

    stopAllAudio();

    cleanupMyBlobUrl();
    setMyBlobUrl("");
    chunksRef.current = [];

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  // 언마운트 시 정리
  useEffect(() => {
    return () => {
      try {
        const mr = mediaRecorderRef.current;
        if (mr && mr.state !== "inactive") mr.stop();
      } catch {}
      cleanupStream();
      cleanupMyBlobUrl();
      try {
        if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ================= actions ================= */
  const playPrompt = async () => {
    // “듣기”를 눌렀으니 녹음 섹션 오픈은 허용
    setHasPlayedPrompt(true);

    // ✅ ETS 느낌: 듣기 눌러도 문장은 자동 공개하지 않음.
    // (원하면 아래 주석 해제)
    // setShowText(true);

    // 1) mp3 먼저 시도 (있을 때만)
    try {
      const a = promptAudioRef.current;
      const url = item?.audioUrl;

      if (a && url) {
        a.currentTime = 0;
        await a.play();
        return; // ✅ 성공
      }
    } catch {
      // 실패하면 TTS로
    }

    // 2) TTS fallback
    const ok = speakTTS(item?.text || "");
    if (!ok) {
      alert("오디오 파일이 없고, 이 브라우저는 TTS를 지원하지 않습니다.");
    }
  };

  const startRecording = async () => {
    stopAllAudio();

    // 기존 내 녹음 URL 정리 후 새로 시작
    cleanupMyBlobUrl();
    setMyBlobUrl("");
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;

      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };

      mr.onstop = () => {
        cleanupStream();

        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setMyBlobUrl(url);
        setIsRecording(false);
        finishAttempt(); // ✅ 여기서 done 처리
      };

      mr.start();
      setIsRecording(true);
    } catch {
      alert("마이크 권한이 필요합니다. 브라우저 설정에서 마이크를 허용해 주세요.");
    }
  };

  const stopRecording = () => {
    try {
      const mr = mediaRecorderRef.current;
      if (mr && mr.state !== "inactive") mr.stop();
    } catch {}
  };

  const replayMyRecording = async () => {
    try {
      if (!myAudioRef.current) return;
      myAudioRef.current.currentTime = 0;
      await myAudioRef.current.play();
    } catch {}
  };

  const resetMyRecording = () => {
    if (isRecording) return;
    cleanupMyBlobUrl();
    setMyBlobUrl("");
    chunksRef.current = [];
  };

  const goPrev = () => setIdx((v) => Math.max(0, v - 1));
  const goNext = () => setIdx((v) => Math.min(total - 1, v + 1));

  /* ================= render ================= */
  return (
    <Wrap>
      <Card>
        <TopBar>
          <Back onClick={() => nav("/speaking")} type="button">
            <ChevronLeft size={18} />
            Speaking
          </Back>

          <Meta>
            <div className="title">{set.title}</div>
            <div className="sub">
              Item <b>{idx + 1}</b> / {total} · 완료 <b>{p.done || 0}</b> / {total}
            </div>
          </Meta>
        </TopBar>

        <Body>
          <SentenceBox>
            <Label>Listen</Label>

            {/* ✅ 기본 숨김 + 버튼으로 보기 */}
            {showText ? (
              <>
                <Sentence>{item?.text || "(문장 없음)"}</Sentence>
                <Hint>{item?.hint}</Hint>
              </>
            ) : (
              <HiddenText>
                <div className="cap">Question is hidden.</div>
                <div className="desc">“문장 보기”를 눌러서 공개할 수 있어요.</div>
              </HiddenText>
            )}

            <AudioRow>
              <ActionBtn onClick={playPrompt} type="button">
                <Play size={18} />
                문장 듣기
              </ActionBtn>

              <GhostBtn onClick={() => setShowText((v) => !v)} type="button">
                {showText ? "문장 숨기기" : "문장 보기"}
              </GhostBtn>
            </AudioRow>

            {/* ✅ src가 없으면 attribute 자체가 생기지 않게 */}
            <audio
              ref={promptAudioRef}
              src={item?.audioUrl || undefined}
              preload="auto"
              onEnded={() => setHasPlayedPrompt(true)}
            />
          </SentenceBox>

          <RecordBox>
            <Label>Repeat</Label>

            {!hasPlayedPrompt ? (
              <LockMsg>먼저 문장을 들어주세요.</LockMsg>
            ) : (
              <>
                <RecordRow>
                  {!isRecording ? (
                    <ActionBtn onClick={startRecording} type="button">
                      <Mic size={18} />
                      녹음하기
                    </ActionBtn>
                  ) : (
                    <DangerBtn onClick={stopRecording} type="button">
                      <Square size={18} />
                      녹음 종료
                    </DangerBtn>
                  )}

                  <GhostBtn onClick={resetMyRecording} type="button" disabled={isRecording}>
                    <RotateCcw size={18} />
                    재녹음
                  </GhostBtn>
                </RecordRow>

                <Playback>
                  <div className="left">
                    <div className="cap">내 녹음</div>
                    <div className="desc">{myBlobUrl ? "재생 가능합니다." : "아직 녹음이 없습니다."}</div>
                  </div>

                  <div className="right">
                    <ActionBtn onClick={replayMyRecording} type="button" disabled={!myBlobUrl}>
                      <Play size={18} />
                      내 녹음 듣기
                    </ActionBtn>
                  </div>

                  {/* ✅ 빈 문자열 절대 넣지 않기 */}
                  <audio ref={myAudioRef} src={myBlobUrl || undefined} />
                </Playback>
              </>
            )}
          </RecordBox>

          <NavRow>
            <NavBtn onClick={goPrev} type="button" disabled={idx === 0}>
              <ChevronLeft size={18} />
              이전
            </NavBtn>

            <NavBtn onClick={goNext} type="button" disabled={idx === total - 1}>
              다음
              <ChevronRight size={18} />
            </NavBtn>
          </NavRow>
        </Body>
      </Card>
    </Wrap>
  );
}

/* ================= styles ================= */
const Wrap = styled.div`
  padding: 18px;
`;
const Card = styled.div`
  max-width: 860px;
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
const Body = styled.div`
  padding: 14px;
  display: grid;
  gap: 12px;
`;
const SentenceBox = styled.div`
  border-radius: 16px;
  border: 1px solid rgba(11, 18, 32, 0.1);
  background: rgba(245, 247, 250, 0.75);
  padding: 14px;
`;
const RecordBox = styled.div`
  border-radius: 16px;
  border: 1px solid rgba(11, 18, 32, 0.1);
  background: white;
  padding: 14px;
`;
const Label = styled.div`
  font-weight: 950;
  font-size: 12px;
  letter-spacing: 0.6px;
  opacity: 0.75;
  text-transform: uppercase;
`;
const Sentence = styled.div`
  margin-top: 10px;
  font-size: 18px;
  font-weight: 850;
  line-height: 1.35;
  letter-spacing: -0.2px;
`;
const Hint = styled.div`
  margin-top: 8px;
  font-size: 13px;
  color: rgba(11, 18, 32, 0.65);
`;

const HiddenText = styled.div`
  margin-top: 10px;
  padding: 12px;
  border-radius: 14px;
  border: 1px dashed rgba(11, 18, 32, 0.18);
  background: rgba(255, 255, 255, 0.7);

  .cap {
    font-weight: 950;
    font-size: 13px;
    color: rgba(11, 18, 32, 0.78);
  }
  .desc {
    margin-top: 4px;
    font-size: 12.5px;
    color: rgba(11, 18, 32, 0.6);
    line-height: 1.45;
  }
`;

const AudioRow = styled.div`
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;
const RecordRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;
const ActionBtn = styled.button`
  height: 42px;
  padding: 0 14px;
  border-radius: 12px;
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
  height: 42px;
  padding: 0 12px;
  border-radius: 12px;
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
const DangerBtn = styled.button`
  height: 42px;
  padding: 0 14px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-weight: 950;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #3b0a0a;
  background: linear-gradient(135deg, rgba(254, 202, 202, 1), rgba(248, 113, 113, 1));
`;
const LockMsg = styled.div`
  margin-top: 10px;
  font-size: 13px;
  color: rgba(11, 18, 32, 0.65);
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(245, 247, 250, 0.8);
  border: 1px dashed rgba(11, 18, 32, 0.16);
`;
const Playback = styled.div`
  margin-top: 12px;
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

  @media (max-width: 520px) {
    flex-direction: column;
    .right {
      width: 100%;
    }
    button {
      width: 100%;
      justify-content: center;
    }
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

/* 작은 에러 화면용 */
const Title = styled.div`
  font-weight: 950;
  font-size: 18px;
`;
const Sub = styled.div`
  margin-top: 6px;
  color: rgba(11, 18, 32, 0.65);
  font-size: 13px;
  line-height: 1.5;
`;
const Row = styled.div`
  margin-top: 14px;
  display: flex;
  justify-content: flex-end;
`;
const Btn = styled.button`
  height: 40px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid rgba(11, 18, 32, 0.12);
  background: white;
  cursor: pointer;
  font-weight: 900;
`;