// src/pages/DailyLifeList.jsx
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

import { DAILY_LIFE_BANK } from "../data/reading/dailyLifeBank";

const LS_DAILY_PROGRESS = "daily_life_progress_v1";

/**
 * progress 저장 형태:
 * {
 *   notice_01: { done: 2, total: 4, correct: 2 },
 *   email_01: { done: 4, total: 4, correct: 3 },
 * }
 */
function loadProgress() {
  try {
    const raw = localStorage.getItem(LS_DAILY_PROGRESS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function getPct(done, total) {
  if (!total) return 0;
  return clamp(Math.round((done / total) * 100), 0, 100);
}

function typeTitle(type) {
  const map = {
    notices: "Notices",
    emails: "Emails",
    schedules: "Schedules",
    ads: "Ads/Posts",
    textmessages: "Text Messages",
    mixed: "Mixed",
  };
  return map[type] || type;
}

export default function DailyLifeList() {
  const nav = useNavigate();
  const { type } = useParams(); // notices | emails | schedules | ads | mixed

  const items = useMemo(() => {
    const list = DAILY_LIFE_BANK?.[type] || DAILY_LIFE_BANK?.mixed || [];
    return Array.isArray(list) ? list : [];
  }, [type]);

  // ✅ 여기서 "각 타입은 5개"를 기본 전제로 1~5만 노출
  const sets = useMemo(() => items.slice(0, 5), [items]);

  const progressMap = useMemo(() => loadProgress(), []);

  const openSet = (i) => {
    nav(`/reading/daily/${type}/set?i=${i}`);
  };

  return (
    <Wrap>
      <Top>
        <BackBtn onClick={() => nav(-1)}>← EXIT</BackBtn>
        <TopTitle>Read in Daily Life · {typeTitle(type)}</TopTitle>
        <RightHint>{sets.length}/5</RightHint>
      </Top>

      <Grid>
        {sets.map((it, i) => {
          const total = it?.questions?.length || 0;
          const p = progressMap?.[it.id] || { done: 0, total, correct: 0 };
          const done = p.done || 0;
          const correct = p.correct || 0;

          const pct = getPct(done, total);

          return (
            <Card key={it.id || i} onClick={() => openSet(i)} type="button">
              <CardTop>
                <Tag>Set {i + 1}</Tag>
               <DocType>{((it.docType || it.type || "doc")).toUpperCase()}</DocType>
              </CardTop>

              <CardTitle>{it.title || it.subject || "(untitled)"}</CardTitle>

              <CardMeta>
                <span>{done}/{total} solved</span>
                <Dot>•</Dot>
                <span>{pct}%</span>
              </CardMeta>

              <Bar aria-label="progress">
                <BarFill $pct={pct} style={{ width: `${pct}%` }} />
              </Bar>

              <CardFooter>
                <Mini>
                  Correct: <b>{correct}</b>
                </Mini>
                <Go>풀기 →</Go>
              </CardFooter>
            </Card>
          );
        })}
      </Grid>
    </Wrap>
  );
}

const Wrap = styled.div`
  padding: 18px 16px 90px;
`;

const Top = styled.div`
  display: grid;
  grid-template-columns: 90px 1fr 90px;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
`;

const BackBtn = styled.button`
  height: 36px;
  border-radius: 10px;
  border: 1px solid rgba(0,0,0,0.12);
  background: #fff;
  cursor: pointer;
`;

const TopTitle = styled.div`
  text-align: center;
  font-weight: 950;
  letter-spacing: -0.2px;
`;

const RightHint = styled.div`
  text-align: right;
  opacity: 0.7;
  font-weight: 900;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.button`
  text-align: left;
  border: 1px solid rgba(0,0,0,0.08);
  background: rgba(255,255,255,0.96);
  border-radius: 18px;
  padding: 14px 14px 12px;
  cursor: pointer;
  box-shadow: 0 12px 22px rgba(0,0,0,0.05);
  transition: transform 0.08s ease, box-shadow 0.18s ease;

  &:hover { transform: translateY(-1px); box-shadow: 0 18px 34px rgba(0,0,0,0.07); }
  &:active { transform: translateY(0px); }
`;

const CardTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;

const Tag = styled.div`
  font-weight: 950;
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(0,120,255,0.10);
`;

const DocType = styled.div`
  font-size: 12px;
  font-weight: 900;
  opacity: 0.65;
`;

const CardTitle = styled.div`
  margin-top: 10px;
  font-weight: 950;
  font-size: 16px;
  letter-spacing: -0.2px;
  line-height: 1.25;
`;

const CardMeta = styled.div`
  margin-top: 6px;
  font-size: 12.5px;
  opacity: 0.75;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
`;

const Dot = styled.span`
  opacity: 0.5;
`;

const Bar = styled.div`
  margin-top: 10px;
  height: 10px;
  border-radius: 999px;
  background: rgba(0,0,0,0.07);
  overflow: hidden;
`;

const BarFill = styled.div`
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(135deg, #1e88ff, #0055ff);
`;

const CardFooter = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Mini = styled.div`
  font-size: 12px;
  opacity: 0.78;
  b { opacity: 1; }
`;

const Go = styled.div`
  font-weight: 950;
  font-size: 13px;
  color: rgba(0, 85, 255, 0.95);
`;