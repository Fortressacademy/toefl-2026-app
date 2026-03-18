import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

export default function AudioPlayerCard({
  title,
  typeLabel,
  audioSrc,
  prompt,
  onPlayTTS,
  onStopTTS,
  useTTS = false,
}) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    const onTime = () => {
      if (!el.duration) {
        setProgress(0);
        return;
      }
      setProgress((el.currentTime / el.duration) * 100);
    };

    const onEnd = () => {
      setPlaying(false);
      setProgress(100);
    };

    const onPause = () => setPlaying(false);
    const onPlay = () => setPlaying(true);

    el.addEventListener("timeupdate", onTime);
    el.addEventListener("ended", onEnd);
    el.addEventListener("pause", onPause);
    el.addEventListener("play", onPlay);

    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("ended", onEnd);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("play", onPlay);
    };
  }, []);

  const togglePlay = async () => {
    if (useTTS) {
      if (playing) {
        onStopTTS?.();
        setPlaying(false);
      } else {
        setPlaying(true);
        try {
          await onPlayTTS?.();
        } finally {
          setPlaying(false);
          setProgress(100);
        }
      }
      return;
    }

    const el = audioRef.current;
    if (!el) return;

    if (playing) {
      el.pause();
      return;
    }

    try {
      await el.play();
    } catch (e) {
      console.error(e);
    }
  };

  const restart = async () => {
    if (useTTS) {
      onStopTTS?.();
      setProgress(0);
      setPlaying(true);
      try {
        await onPlayTTS?.();
      } finally {
        setPlaying(false);
        setProgress(100);
      }
      return;
    }

    const el = audioRef.current;
    if (!el) return;
    el.currentTime = 0;
    setProgress(0);
    el.play().catch((e) => console.error(e));
  };

  return (
    <Card>
      <Type>{typeLabel}</Type>
      <Title>{title}</Title>
      <Prompt>{prompt}</Prompt>

      <Controls>
        <MainButton type="button" onClick={togglePlay}>
          {playing ? "Pause Audio" : "Play Audio"}
        </MainButton>
        <SubButton type="button" onClick={restart}>
          Replay
        </SubButton>
      </Controls>

      <ProgressTrack>
        <ProgressFill style={{ width: `${progress}%` }} />
      </ProgressTrack>

      {!useTTS ? <audio ref={audioRef} src={audioSrc || ""} preload="metadata" /> : null}
    </Card>
  );
}

const Card = styled.div`
  border: 1px solid #ddd;
  padding: 24px;
  border-radius: 18px;
  background: linear-gradient(180deg, #fff, #f8fbff);
`;

const Type = styled.div`
  display: inline-flex;
  align-items: center;
  width: fit-content;
  height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(19, 62, 167, 0.08);
  color: #133ea7;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
`;

const Title = styled.h2`
  margin: 14px 0 8px;
  font-size: 28px;
  line-height: 1.2;
`;

const Prompt = styled.p`
  margin: 0;
  color: #555;
  line-height: 1.7;
`;

const Controls = styled.div`
  margin-top: 22px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const MainButton = styled.button`
  padding: 12px 18px;
  border: none;
  border-radius: 14px;
  background: #111;
  color: white;
  font-weight: 900;
  cursor: pointer;
`;

const SubButton = styled.button`
  padding: 12px 18px;
  border: 1px solid #ddd;
  border-radius: 14px;
  background: white;
  font-weight: 900;
  cursor: pointer;
`;

const ProgressTrack = styled.div`
  margin-top: 18px;
  width: 100%;
  height: 10px;
  border-radius: 999px;
  background: #e8edf5;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #1e5eff, #4f8cff);
`;