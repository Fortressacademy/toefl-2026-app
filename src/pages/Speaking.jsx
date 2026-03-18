// src/pages/Speaking.jsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  Timer,
  BarChart3,
  ChevronDown,
  FileText,
  Mic,
  Repeat2,
  UserRound,
  Sparkles,
} from "lucide-react";

/**
 * TOEFL NEW (effective Jan 21, 2026)
 * Speaking task types:
 * - Listen and Repeat
 * - Take an Interview
 * (ETS content page 기준) -> 네 앱은 UI만 먼저 완성하고, bank/mock은 나중에 붙이면 됨.
 */

// ====================== (나중에 파일 생기면 아래 주석 해제) ======================
import { SPEAKING_BANK } from "../data/speaking/speakingBank";

// ====================== localStorage keys ======================
const LS_SPEAKING_PROGRESS = "speaking_progress_v1";
const LS_SPEAKING_MOCK_PROGRESS = "speaking_mock_progress_v1";

// ====================== safe utils ======================
function safeJsonParse(raw, fallback) {
  try {
    const v = JSON.parse(raw);
    return v ?? fallback;
  } catch {
    return fallback;
  }
}
function loadProgress() {
  if (typeof window === "undefined") return {};
  return safeJsonParse(localStorage.getItem(LS_SPEAKING_PROGRESS), {});
}
function getPct(done, total) {
  if (!total) return 0;
  return Math.max(0, Math.min(100, Math.round((done / total) * 100)));
}
function hasMockProgress(mockId) {
  try {
    const all = JSON.parse(localStorage.getItem(LS_SPEAKING_MOCK_PROGRESS) || "{}");
    const p = all?.[mockId];
    if (!p) return false;
    if (Number.isFinite(p.idx) && p.idx > 0) return true;
    if (p.answers && Object.keys(p.answers).length > 0) return true;
    if (Number.isFinite(p.remaining) && p.remaining > 0) return true;
    return false;
  } catch {
    return false;
  }
}

// ====================== ✅ FALLBACK DATA (파일 없을 때도 페이지 정상 렌더) ======================
// practice set은 UI 렌더에 "id, questions.length"만 있으면 됨
const FALLBACK_SPEAKING_BANK = {
  listenRepeat: Array.from({ length: 5 }, (_, i) => ({
    id: `s_lr_set_${i + 1}`,
    questions: Array.from({ length: 11 }, () => ({})), // 실제 시험이 11 items라 UI도 11로 맞춤
  })),
  interview: Array.from({ length: 5 }, (_, i) => ({
    id: `s_int_set_${i + 1}`,
    questions: Array.from({ length: 11 }, () => ({})),
  })),
};

// mock list (표시/이동만)
const FALLBACK_SPEAKING_MOCK_LIST = Array.from({ length: 3 }, (_, i) => ({
  id: `speaking_mock_${i + 1}`,
  title: `모의고사 ${i + 1}`,
  desc: "진행률/녹음/피드백 리포트 연결 (추후 구현)",
}));

// ====================== ✅ 실제 데이터가 생기면 여기만 바꾸면 끝 ======================
// const BANK = SPEAKING_BANK;
// const MOCKS = SPEAKING_MOCK_LIST;

const BANK = SPEAKING_BANK;
const MOCKS = FALLBACK_SPEAKING_MOCK_LIST;

// ====================== Component ======================
export default function Speaking() {
  const nav = useNavigate();

  const [openMap, setOpenMap] = useState(() => ({
    listenRepeat: false,
    interview: false,
  }));

  const [folderOpen, setFolderOpen] = useState(() => ({
    listenRepeat: false,
    interview: false,
  }));

  const [resumeModal, setResumeModal] = useState(null);

  const toggleAcc = (key) => setOpenMap((p) => ({ ...p, [key]: !p[key] }));
  const toggleFolder = (key) => setFolderOpen((p) => ({ ...p, [key]: !p[key] }));

  const partGroups = useMemo(
    () => [
      {
        key: "listenRepeat",
        title: "1. Listen and Repeat",
        desc: "문장 듣고 그대로 따라 말하기(발음/억양/즉시 재현)",
        icon: <Repeat2 size={18} strokeWidth={2.2} />,
      },
      {
        key: "interview",
        title: "2. Take an Interview",
        desc: "질문 연속 응답(즉흥/명료성/조직력)",
        icon: <UserRound size={18} strokeWidth={2.2} />,
      },
    ],
    []
  );

  const progressMap = useMemo(() => loadProgress(), []);

  // ======= 라우팅 규칙 =======
  // 세트: /speaking/{partKey}/set?i=0
  const openSpeakingSet = (partKey, index) => {
    nav(`/speaking/${encodeURIComponent(partKey)}/set?i=${index}`);
  };
  // 전체 리스트(있으면): /speaking/{partKey}
  const openSpeakingList = (partKey) => {
    nav(`/speaking/${encodeURIComponent(partKey)}`);
  };

  // 모의고사
  const onSolve = (mockId) => {
    const t = MOCKS.find((x) => x.id === mockId);
    const exists = hasMockProgress(mockId);
    if (exists) {
      setResumeModal({ id: mockId, title: t?.title || mockId, hasProgress: true });
      return;
    }
    nav(`/speaking/mock/${encodeURIComponent(mockId)}`);
  };

  const clearMockProgress = (mockId) => {
    try {
      const all = JSON.parse(localStorage.getItem(LS_SPEAKING_MOCK_PROGRESS) || "{}");
      delete all[mockId];
      localStorage.setItem(LS_SPEAKING_MOCK_PROGRESS, JSON.stringify(all));
    } catch {}
  };

  const onReport = (id) => {
    nav(`/speaking/mock/${encodeURIComponent(id)}/result`);
  };

  const onQuickRandomStart = () => {
    const first = MOCKS?.[0]?.id;
    if (first) nav(`/speaking/mock/${encodeURIComponent(first)}`);
  };

  return (
    <Wrap>
      <Hero>
        <HeroTop>
          <HeroTitle>
            TOEFL Speaking <Dot>•</Dot> Daily Mastery
          </HeroTitle>

          <HeroCTA onClick={onQuickRandomStart} type="button">
            <span className="emoji">🎙️</span>
            Random 모의고사 바로 시작
          </HeroCTA>
        </HeroTop>

        <HeroSub>
          NEW TOEFL(2026.01.21) Speaking은 <b>Listen & Repeat</b> + <b>Interview</b> 2파트로,
          “짧게-정확히-자연스럽게” 말하기를 루틴화하는 구조입니다.
        </HeroSub>

        <HeroLower>
          <FeaturePills aria-label="기능 요약">
            <Pill>
              <PillIcon>
                <Mic size={18} strokeWidth={2.2} />
              </PillIcon>
              <div>
                <PillTitle>녹음 기반 훈련</PillTitle>
                <PillDesc>재생/비교/재녹음</PillDesc>
              </div>
            </Pill>

            <Pill>
              <PillIcon>
                <Timer size={18} strokeWidth={2.2} />
              </PillIcon>
              <div>
                <PillTitle>초단기 루틴</PillTitle>
                <PillDesc>8분 구조에 맞춤</PillDesc>
              </div>
            </Pill>

            <Pill>
              <PillIcon>
                <BarChart3 size={18} strokeWidth={2.2} />
              </PillIcon>
              <div>
                <PillTitle>진행도 저장</PillTitle>
                <PillDesc>정답률/시도횟수</PillDesc>
              </div>
            </Pill>
          </FeaturePills>

          <CoachCard>
            <CoachBadge>COACH TIP</CoachBadge>
            <CoachText>
              Speaking은 “완벽한 문장”이 아니라 <b>명료한 전달</b>이 우선.
              Interview는 <b>결론 → 이유 1개 → 짧은 예시</b> 패턴만 고정해도 안정적으로 올라간다.
            </CoachText>
          </CoachCard>
        </HeroLower>
      </Hero>

      <Grid>
        {/* 왼쪽 카드: 파트별 세트 */}
        <Card>
          <CardHeader>
            <CardTitle>
              <span className="emoji">🧠</span> 파트별 문제 풀기
            </CardTitle>
          </CardHeader>

          <Accordion>
            {partGroups.map((g) => (
              <AccItem key={g.key}>
                <AccHead onClick={() => toggleAcc(g.key)} type="button">
                  <div className="left">
                    <div className="title">{g.title}</div>
                    <div className="desc">{g.desc}</div>
                  </div>
                  <Chevron $open={!!openMap[g.key]}>▾</Chevron>
                </AccHead>

                {openMap[g.key] ? (
                  <AccBody>
                    <DailyHint>
                      카테고리를 누르면 폴더처럼 열리고 <b>Set 들이</b> 표시됩니다.
                    </DailyHint>

                    <DailyFolderGrid>
                      {(() => {
                        const list = BANK?.[g.key] || [];
                        const totalSets = Array.isArray(list) ? list.length : 0;
                        const showOpen = !!folderOpen[g.key];

                        return (
                          <DailyFolderCard>
  <FolderHeaderBtn type="button" onClick={() => toggleFolder(g.key)}>
    <FolderTop>
      <FolderLeft>
        <FolderIconBox>{g.icon}</FolderIconBox>
        <div>
          <FolderTitle>{g.title}</FolderTitle>
          <FolderSub>{totalSets} sets</FolderSub>
        </div>
      </FolderLeft>

      <FolderRight>
        <FolderChevron $open={showOpen}>
          <ChevronDown size={18} strokeWidth={2.4} />
        </FolderChevron>
      </FolderRight>
    </FolderTop>
  </FolderHeaderBtn>

  {showOpen ? (
    <FolderBody>
      <SetGrid>
        {(list || []).map((it, idx) => {
          const p = progressMap[it.id] || {
            done: 0,
            total: it.questions?.length || 0,
            correct: 0,
          };
          const total = p.total || (it.questions?.length || 0);
          const pct = getPct(p.done, total);

          return (
            <SetCard
              key={it.id || `${g.key}_${idx}`}
              type="button"
              onClick={() => openSpeakingSet(g.key, idx)}
            >
              <SetTop>
                <SetTag>연습 {idx + 1}</SetTag>
                <SetPct>{pct}%</SetPct>
              </SetTop>

              <SetMeta>
                진행도 <b>{p.done || 0}</b>/<span>{total || 0}</span>
              </SetMeta>

              <SetBar>
                <SetBarFill style={{ width: `${pct}%` }} />
              </SetBar>

              <SetBottom>
                <span className="mini">
                  성공 <b>{p.correct || 0}</b>
                </span>
                <span className="go">말하기 →</span>
              </SetBottom>
            </SetCard>
          );
        })}
      </SetGrid>

      <FolderActions>
        <FolderGhost onClick={() => openSpeakingList(g.key)} type="button">
          전체 보기
        </FolderGhost>
      </FolderActions>

      <AccHint>
        추천 루틴: <b>Listen&Repeat</b>로 발음/리듬 고정 → <b>Interview</b>에서 “결론-이유-예시” 자동화.
      </AccHint>
    </FolderBody>
  ) : null}
</DailyFolderCard>
                        );
                      })()}
                    </DailyFolderGrid>
                  </AccBody>
                ) : null}
              </AccItem>
            ))}
          </Accordion>
        </Card>

        {/* 오른쪽 카드: 모의고사 */}
        <Card>
          <CardHeader className="right">
            <CardTitle>
              <span className="emoji">📝</span> Speaking 모의고사
            </CardTitle>
            <SmallNote>실제 시험처럼 “연속 응답” 흐름으로 구성(추후 구현).</SmallNote>
          </CardHeader>

          <List>
            {(MOCKS || []).length ? (
              MOCKS.map((t) => (
                <Row key={t.id}>
                  <RowLeft>
                    <FileIcon>
                      <FileText size={18} strokeWidth={2.2} />
                    </FileIcon>
                    <div>
                      <RowTitle>{t.title}</RowTitle>
                      <RowMeta>{t.desc || "진행률/녹음/피드백 리포트 연결 가능"}</RowMeta>
                    </div>
                  </RowLeft>

                  <RowActions>
                    <GhostBtn onClick={() => onReport(t.id)} type="button">
                      Report
                    </GhostBtn>
                    <PrimaryBtn onClick={() => onSolve(t.id)} type="button">
                      말하기
                    </PrimaryBtn>
                  </RowActions>
                </Row>
              ))
            ) : (
              <EmptyBox>
                아직 <b>SPEAKING_MOCK_LIST</b>가 없습니다. <br />
                나중에 mockIndex 파일 만들면 여기 자동으로 채워집니다.
              </EmptyBox>
            )}
          </List>
        </Card>
      </Grid>

      {/* 이어하기 모달 */}
      {resumeModal ? (
        <ModalOverlay onClick={() => setResumeModal(null)}>
          <ModalCard onClick={(e) => e.stopPropagation()}>
            <ModalTitle>이어서 하시겠습니까?</ModalTitle>
            <ModalSub>
              <b>{resumeModal.title}</b> 진행 기록이 있습니다.
            </ModalSub>

            <ModalBtns>
              <ModalGhost type="button" onClick={() => setResumeModal(null)}>
                취소
              </ModalGhost>

              <ModalGhost
                type="button"
                onClick={() => {
                  const id = resumeModal.id;
                  setResumeModal(null);
                  clearMockProgress(id);
                  nav(`/speaking/mock/${encodeURIComponent(id)}`);
                }}
              >
                새로 시작
              </ModalGhost>

              <ModalPrimary
                type="button"
                onClick={() => {
                  const id = resumeModal.id;
                  setResumeModal(null);
                  nav(`/speaking/mock/${encodeURIComponent(id)}`);
                }}
              >
                이어하기
              </ModalPrimary>
            </ModalBtns>
          </ModalCard>
        </ModalOverlay>
      ) : null}
    </Wrap>
  );
}

/* ===================== styles (teal glow) ===================== */

const C = {
  ink: "#0B1220",
  card: "rgba(255,255,255,.92)",
  border: "rgba(11,18,32,.08)",
  t200: "#99F6E4",
  t400: "#2DD4BF",
  t600: "#0D9488",
};

const Wrap = styled.div`
  padding: 28px 28px 40px;
  background: radial-gradient(1100px 420px at 18% -10%, rgba(45, 212, 191, 0.10), transparent 62%),
    linear-gradient(180deg, rgba(240, 253, 250, 0.36), rgba(255, 255, 255, 0));

  @media (max-width: 520px) {
    padding: 10px 10px 40px;
  }
`;

const Hero = styled.div`
  position: relative;
  border-radius: 22px;
  padding: 22px 22px 18px;
  overflow: hidden;

  background: radial-gradient(900px 360px at 12% 0%, rgba(45, 212, 191, 0.16), transparent 60%),
    radial-gradient(760px 320px at 78% 10%, rgba(153, 246, 228, 0.14), transparent 55%),
    rgba(255, 255, 255, 0.92);

  border: 1px solid rgba(13, 148, 136, 0.18);
  box-shadow: 0 14px 34px rgba(10, 18, 30, 0.07), 0 10px 26px rgba(45, 212, 191, 0.10);

  &::before {
    content: "";
    position: absolute;
    inset: -18px;
    border-radius: 32px;
    pointer-events: none;
    background: radial-gradient(900px 340px at 18% 0%, rgba(45, 212, 191, 0.18), transparent 55%),
      radial-gradient(860px 360px at 82% 18%, rgba(153, 246, 228, 0.14), transparent 58%);
    filter: blur(14px);
    opacity: 0.9;
  }

  > * {
    position: relative;
    z-index: 1;
  }

  @media (max-width: 520px) {
    margin-left: -12px;
    margin-right: -12px;
    border-radius: 0;

    &::before {
      border-radius: 0;
      inset: -16px;
    }
  }
`;

const HeroTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  flex-wrap: wrap;
`;

const HeroTitle = styled.div`
  font-weight: 900;
  letter-spacing: -0.8px;
  color: ${C.ink};
  font-size: clamp(26px, 5.8vw, 38px);
  line-height: 1.06;

  @media (max-width: 420px) {
    letter-spacing: -0.6px;
    line-height: 1.04;
  }
`;

const Dot = styled.span`
  margin: 0 10px;
  opacity: 0.35;

  @media (max-width: 420px) {
    margin: 0 6px;
  }
`;

const HeroSub = styled.div`
  margin-top: 10px;
  color: rgba(11, 18, 32, 0.72);
  font-size: clamp(12.5px, 3.6vw, 14.5px);
  line-height: 1.6;

  b {
    color: rgba(11, 18, 32, 0.92);
  }
`;

const HeroCTA = styled.button`
  border: none;
  cursor: pointer;
  border-radius: 16px;
  padding: 13px 18px;
  font-weight: 950;
  color: #03221e;

  background: linear-gradient(135deg, ${C.t200}, ${C.t600});
  box-shadow: 0 14px 26px rgba(13, 148, 136, 0.20), 0 8px 18px rgba(153, 246, 228, 0.12);

  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: clamp(13px, 3.8vw, 14px);

  .emoji {
    font-size: 16px;
  }

  &:hover {
    filter: brightness(1.03);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(1px);
  }

  @media (max-width: 420px) {
    width: 100%;
    justify-content: center;
    padding: 12px 14px;
    border-radius: 14px;

    .emoji {
      font-size: 15px;
    }
  }
`;

const HeroLower = styled.div`
  margin-top: 14px;
  display: grid;
  grid-template-columns: 1.3fr 0.7fr;
  gap: 10px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const FeaturePills = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const Pill = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(11, 18, 32, 0.08);
  box-shadow: 0 8px 18px rgba(10, 18, 30, 0.05);
  cursor: default;
  user-select: none;
`;

const PillIcon = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: radial-gradient(120% 120% at 20% 15%, rgba(45, 212, 191, 0.18), transparent 60%),
    rgba(11, 18, 32, 0.03);
  border: 1px solid rgba(13, 148, 136, 0.16);
  flex: 0 0 auto;
`;

const PillTitle = styled.div`
  font-weight: 900;
  font-size: 13.5px;
  letter-spacing: -0.2px;
  color: rgba(11, 18, 32, 0.92);
`;

const PillDesc = styled.div`
  margin-top: 2px;
  font-size: 12px;
  color: rgba(11, 18, 32, 0.58);
  line-height: 1.25;
`;

const CoachCard = styled.div`
  border-radius: 18px;
  padding: 10px 14px;
  background: radial-gradient(900px 260px at 10% 0%, rgba(45, 212, 191, 0.14), transparent 60%),
    rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(13, 148, 136, 0.14);
  box-shadow: 0 12px 26px rgba(13, 148, 136, 0.08), 0 10px 22px rgba(10, 18, 30, 0.04);
`;

const CoachBadge = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 900;
  font-size: 11px;
  letter-spacing: 0.6px;
  color: rgba(11, 18, 32, 0.75);
  background: rgba(11, 18, 32, 0.05);
  border: 1px solid rgba(11, 18, 32, 0.06);
`;

const CoachText = styled.div`
  margin-top: 10px;
  font-size: 13px;
  line-height: 1.6;
  color: rgba(11, 18, 32, 0.78);

  b {
    color: rgba(11, 18, 32, 0.95);
  }
`;

const Grid = styled.div`
  margin-top: 22px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: ${C.card};
  border: 1px solid ${C.border};
  border-radius: 22px;
  box-shadow: 0 14px 28px rgba(10, 18, 30, 0.06);
  overflow: hidden;
`;

const CardHeader = styled.div`
  padding: 18px 18px 14px;
  border-bottom: 1px solid rgba(11, 18, 32, 0.06);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  &.right {
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 6px;
  }
`;

const CardTitle = styled.div`
  font-size: 18px;
  font-weight: 900;
  letter-spacing: -0.2px;
  color: ${C.ink};

  .emoji {
    margin-right: 8px;
  }
`;

const SmallNote = styled.div`
  font-size: 13px;
  color: rgba(11, 18, 32, 0.6);
`;

const Accordion = styled.div`
  padding: 10px 12px 16px;
`;

const AccItem = styled.div`
  background: rgba(245, 247, 250, 0.86);
  border: 1px solid rgba(11, 18, 32, 0.06);
  border-radius: 16px;
  overflow: hidden;
  margin: 10px 6px;
`;

const AccHead = styled.button`
  width: 100%;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 14px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  text-align: left;

  .left {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .title {
    font-weight: 900;
    color: rgba(11, 18, 32, 0.92);
    letter-spacing: -0.2px;
  }

  .desc {
    font-size: 12.5px;
    color: rgba(11, 18, 32, 0.55);
  }
`;

const Chevron = styled.div`
  font-size: 16px;
  opacity: 0.55;
  transform: ${(p) => (p.$open ? "rotate(180deg)" : "rotate(0deg)")};
  transition: transform 160ms ease;
`;

const AccBody = styled.div`
  padding: 12px 14px 14px;
  border-top: 1px solid rgba(11, 18, 32, 0.06);
  background: rgba(255, 255, 255, 0.76);
`;

const AccHint = styled.div`
  margin-top: 10px;
  font-size: 12.5px;
  color: rgba(11, 18, 32, 0.65);
  line-height: 1.55;

  b {
    color: rgba(11, 18, 32, 0.92);
  }
`;

const DailyHint = styled.div`
  font-size: 12.5px;
  color: rgba(11, 18, 32, 0.66);
  line-height: 1.55;

  b {
    color: rgba(11, 18, 32, 0.92);
  }
`;

const DailyFolderGrid = styled.div`
  margin-top: 10px;
  display: grid;
  gap: 10px;
`;

// ✅ (1) DailyFolderCard를 div로 변경
const DailyFolderCard = styled.div`
  text-align: left;
  border: 1px solid rgba(11, 18, 32, 0.10);
  background: rgba(255, 255, 255, 0.96);
  border-radius: 16px;
  padding: 12px 12px;
  box-shadow: 0 10px 18px rgba(10, 18, 30, 0.05);

  &:hover {
    border-color: rgba(13, 148, 136, 0.22);
    box-shadow: 0 12px 22px rgba(13, 148, 136, 0.08), 0 10px 18px rgba(10, 18, 30, 0.05);
  }
`;

// ✅ (2) 폴더 "헤더만" 클릭되게 하는 버튼 추가
const FolderHeaderBtn = styled.button`
  width: 100%;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
  text-align: left;

  /* 모바일에서 탭 하이라이트 제거(선택) */
  -webkit-tap-highlight-color: transparent;
`;

const FolderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;

const FolderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FolderIconBox = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: rgba(45, 212, 191, 0.12);
  border: 1px solid rgba(13, 148, 136, 0.18);
`;

const FolderTitle = styled.div`
  font-weight: 950;
  color: rgba(11, 18, 32, 0.92);
`;

const FolderSub = styled.div`
  margin-top: 2px;
  font-size: 12px;
  color: rgba(11, 18, 32, 0.58);
`;

const FolderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FolderChevron = styled.div`
  opacity: 0.7;
  transform: ${(p) => (p.$open ? "rotate(180deg)" : "rotate(0deg)")};
  transition: transform 160ms ease;
  display: grid;
  place-items: center;
`;

const FolderBody = styled.div`
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed rgba(11, 18, 32, 0.12);
`;

const SetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const SetCard = styled.button`
  text-align: left;
  border: 1px solid rgba(11, 18, 32, 0.10);
  background: rgba(245, 247, 250, 0.88);
  border-radius: 16px;
  padding: 12px 12px;
  cursor: pointer;
  transition: transform 0.08s ease, box-shadow 0.18s ease, border-color 0.18s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: rgba(13, 148, 136, 0.22);
    box-shadow: 0 14px 26px rgba(13, 148, 136, 0.08), 0 14px 26px rgba(0, 0, 0, 0.04);
  }
`;

const SetTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SetTag = styled.div`
  font-weight: 950;
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(45, 212, 191, 0.14);
  color: rgba(13, 148, 136, 0.95);
  border: 1px solid rgba(13, 148, 136, 0.18);
`;

const SetPct = styled.div`
  font-weight: 950;
  color: rgba(11, 18, 32, 0.72);
  font-size: 12px;
`;

const SetMeta = styled.div`
  margin-top: 8px;
  font-size: 12.5px;
  color: rgba(11, 18, 32, 0.68);

  b {
    color: rgba(11, 18, 32, 0.92);
  }
`;

const SetBar = styled.div`
  margin-top: 10px;
  height: 10px;
  border-radius: 999px;
  background: rgba(11, 18, 32, 0.08);
  overflow: hidden;
`;

const SetBarFill = styled.div`
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(135deg, ${C.t200}, ${C.t600});
`;

const SetBottom = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .mini {
    font-size: 12px;
    color: rgba(11, 18, 32, 0.62);

    b {
      color: rgba(11, 18, 32, 0.92);
    }
  }

  .go {
    font-weight: 950;
    font-size: 13px;
    color: rgba(13, 148, 136, 0.95);
  }
`;

const FolderActions = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
`;

const FolderGhost = styled.button`
  height: 34px;
  padding: 0 12px;
  border-radius: 12px;
  border: 1px solid rgba(11, 18, 32, 0.12);
  background: white;
  cursor: pointer;
  font-weight: 900;
  color: rgba(11, 18, 32, 0.78);

  &:hover {
    transform: translateY(-1px);
    border-color: rgba(13, 148, 136, 0.18);
    background: rgba(45, 212, 191, 0.06);
  }
`;

const List = styled.div`
  padding: 12px 14px 16px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 18px;
  border-radius: 18px;
  border: 1px solid rgba(11, 18, 32, 0.08);
  background: white;
  margin-bottom: 14px;
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.04);

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
  }
`;

const RowActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const RowLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const FileIcon = styled.div`
  width: 46px;
  height: 46px;
  border-radius: 14px;
  background: rgba(45, 212, 191, 0.12);
  border: 1px solid rgba(13, 148, 136, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RowTitle = styled.div`
  font-weight: 800;
  font-size: 16px;
`;

const RowMeta = styled.div`
  font-size: 13px;
  color: rgba(0, 0, 0, 0.5);
  margin-top: 4px;
`;

const GhostBtn = styled.button`
  height: 42px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid rgba(13, 148, 136, 0.40);
  background: white;
  color: rgba(13, 148, 136, 0.95);
  font-weight: 800;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    background: rgba(45, 212, 191, 0.08);
  }

  @media (max-width: 480px) {
    flex: 1;
  }
`;

const PrimaryBtn = styled.button`
  height: 42px;
  padding: 0 16px;
  border-radius: 12px;
  border: none;

  background: linear-gradient(135deg, ${C.t200}, ${C.t600});
  color: #03221e;

  font-weight: 950;
  white-space: nowrap;
  cursor: pointer;
  box-shadow: 0 12px 22px rgba(13, 148, 136, 0.18);

  &:hover {
    filter: brightness(1.03);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(1px);
  }

  @media (max-width: 480px) {
    flex: 1;
  }
`;

const EmptyBox = styled.div`
  padding: 18px;
  border-radius: 16px;
  border: 1px dashed rgba(11, 18, 32, 0.18);
  background: rgba(245, 247, 250, 0.7);
  color: rgba(11, 18, 32, 0.65);
  font-size: 13px;
  line-height: 1.6;

  b {
    color: rgba(11, 18, 32, 0.88);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(10, 18, 30, 0.45);
  backdrop-filter: blur(6px);
  display: grid;
  place-items: center;
  z-index: 9999;
  padding: 18px;
`;

const ModalCard = styled.div`
  width: min(520px, 100%);
  border-radius: 18px;
  background: white;
  border: 1px solid rgba(11, 18, 32, 0.12);
  box-shadow: 0 20px 60px rgba(10, 18, 30, 0.22);
  padding: 18px;
`;

const ModalTitle = styled.div`
  font-weight: 950;
  font-size: 18px;
  letter-spacing: -0.2px;
`;

const ModalSub = styled.div`
  margin-top: 8px;
  font-size: 13px;
  color: rgba(11, 18, 32, 0.7);
  line-height: 1.55;

  b {
    color: rgba(11, 18, 32, 0.92);
  }
`;

const ModalBtns = styled.div`
  margin-top: 14px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;

  @media (max-width: 420px) {
    grid-template-columns: 1fr;
  }
`;

const ModalGhost = styled.button`
  height: 44px;
  border-radius: 12px;
  border: 1px solid rgba(11, 18, 32, 0.14);
  background: white;
  cursor: pointer;
  font-weight: 900;
`;

const ModalPrimary = styled.button`
  height: 44px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-weight: 950;
  color: #03221e;
  background: linear-gradient(135deg, ${C.t200}, ${C.t600});
  box-shadow: 0 12px 22px rgba(13, 148, 136, 0.18);
`;