
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  Sparkles,
  Timer,
  BarChart3,
  BookOpen,
  Folder,
  Mail,
  CalendarDays,
  Megaphone,
  Layers,
  ChevronDown,
} from "lucide-react";

import { CTW_TRACK_LIST } from "../data/reading/ctwIndex";
import { DAILY_LIFE_BANK } from "../data/reading/dailyLifeBank";
import { ACADEMIC_BANK } from "../data/reading/academic/index";
import { READING_MOCK_LIST } from "../data/mocks/mockIndex";


import { MessageSquareText } from "lucide-react";

const LS_DAILY_PROGRESS = "daily_life_progress_v1";
const LS_READING_MOCK_PROGRESS = "reading_mock_progress_v1";

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
  const raw = localStorage.getItem(LS_DAILY_PROGRESS);
  return safeJsonParse(raw, {});
}

function getPct(done, total) {
  if (!total) return 0;
  return Math.max(0, Math.min(100, Math.round((done / total) * 100)));
}

function hasMockProgress(mockId) {
  try {
    const all = JSON.parse(localStorage.getItem(LS_READING_MOCK_PROGRESS) || "{}");
    const p = all?.[mockId];
    if (!p) return false;

    // 이미 끝난 시험이면 이어하기 팝업 안 띄움
    if (p.completed) return false;

    // 실제로 푼 흔적이 있을 때만 true
    const hasAnswers = !!(p.answers && Object.keys(p.answers).length > 0);
    const movedCursor = Number.isFinite(p.cursor?.unitIdx) && p.cursor.unitIdx > 0;
    const movedModule = !!(p.activeModuleId && p.activeModuleId !== "m1");
    const inProgressScreen =
      p.screenMode === "testing" ||
      p.screenMode === "moduleReviewGate" ||
      p.screenMode === "moduleEnd";

    return hasAnswers || movedCursor || movedModule || inProgressScreen;
  } catch {
    return false;
  }
}
export default function Reading() {
  const nav = useNavigate();

  // 아코디언 열림 상태
  const [openMap, setOpenMap] = useState(() => ({
    ctw: false,
    daily: false,
    academic: false,
  }));

  // Daily 폴더(노티스/이메일...) 열림 상태
  const [dailyOpen, setDailyOpen] = useState(() => ({
    notices: false,
    emails: false,
    schedules: false,
    ads: false,
    textmessages: false,
    mixed: false,
  }));

  // ✅ Academic 폴더(Detail/Inference...) 열림 상태
  const [academicOpen, setAcademicOpen] = useState(() => ({
    detail: false,
    inference: false,
    purpose: false,
    vocabulary: false,
    mixed: false,
  }));


  const [resumeModal, setResumeModal] = useState(null);

  const toggle = (key) => setOpenMap((p) => ({ ...p, [key]: !p[key] }));
  const toggleDaily = (t) => setDailyOpen((p) => ({ ...p, [t]: !p[t] }));
  const toggleAcademic = (t) => setAcademicOpen((p) => ({ ...p, [t]: !p[t] }));

  const partGroups = useMemo(
    () => [
      { key: "ctw", title: "1. Complete the Words", desc: "문맥 기반 철자/형태 복원" },
      { key: "daily", title: "2. Read in Daily Life", desc: "실용 텍스트 빠른 정보 처리" },
      {
        key: "academic",
        title: "3. Read an Academic Passage",
        desc: "학술 지문(요지/세부/추론/구조)",
        chips: ["Detail", "Inference", "Purpose/Function", "Vocabulary", "mixed"],
      },
    ],
    []
  );

  const mockTests = useMemo(
    () => [
      { id: "mock1", title: "모의고사 1" },
      { id: "mock2", title: "모의고사 2" },
      { id: "mock3", title: "모의고사 3" },
      { id: "mock4", title: "모의고사 4" },
    ],
    []
  );

  const onChip = (groupKey, label) => {
    if (groupKey === "academic") {
      nav(`/reading/academic/${encodeURIComponent(label.toLowerCase())}`);
      return;
    }
  };

  const onCTWTrack = (trackKey) => {
    nav(`/reading/ctw/${trackKey}`);
  };

  const onQuickRandomStart = () => alert("랜덤 모의고사 시작 (연결 예정)");
const onSolve = (mockId) => {
  const t = READING_MOCK_LIST.find((x) => x.id === mockId);
  const exists = hasMockProgress(mockId);

  if (exists) {
    setResumeModal({ id: mockId, title: t?.title || mockId, hasProgress: true });
    return;
  }
  nav(`/reading/mock/${mockId}`);
};

const clearMockProgress = (mockId) => {
  try {
    const all = JSON.parse(localStorage.getItem(LS_READING_MOCK_PROGRESS) || "{}");
    delete all[mockId];
    localStorage.setItem(LS_READING_MOCK_PROGRESS, JSON.stringify(all));
  } catch {}
};

const onReport = (id) => {
  nav(`/reading/mock/${id}/result`);
};
  // Daily 폴더 정의
  const dailyFolders = useMemo(
    () => [
      { key: "notices", label: "Notices", icon: <Megaphone size={18} strokeWidth={2.2} /> },
      { key: "emails", label: "Emails", icon: <Mail size={18} strokeWidth={2.2} /> },
      { key: "schedules", label: "Schedules", icon: <CalendarDays size={18} strokeWidth={2.2} /> },
      { key: "ads", label: "Ads/Posts", icon: <Folder size={18} strokeWidth={2.2} /> },
       { key: "textmessages", label: "Text Messages", icon: <MessageSquareText size={18} strokeWidth={2.2} /> },
    ],
    []
  );

  // ✅ Academic 폴더 정의 (Daily처럼 펼치기)
  const academicFolders = useMemo(
    () => [
      { key: "detail", label: "Detail", icon: <Layers size={18} strokeWidth={2.2} /> },
      { key: "arts", label: "Arts/Music", icon: <BarChart3 size={18} strokeWidth={2.2} /> },
      { key: "humanities", label: "Humanities", icon: <BarChart3 size={18} strokeWidth={2.2} /> },
      { key: "socialscience", label: "Socialscience", icon: <Sparkles size={18} strokeWidth={2.2} /> },
      { key: "physicalscience", label: "Physicalscience", icon: <BookOpen size={18} strokeWidth={2.2} /> },
      { key: "lifescience", label: "Lifescience", icon: <BarChart3 size={18} strokeWidth={2.2} /> },
      { key: "mixed", label: "Mixed", icon: <Folder size={18} strokeWidth={2.2} /> },
    ],
    []
  );

  const progressMap = useMemo(() => loadProgress(), []);

  const openDailySet = (typeKey, index) => {
    nav(`/reading/daily/${typeKey}/set?i=${index}`);
  };

  const openDailyList = (typeKey) => {
    nav(`/reading/daily/${typeKey}`);
  };

  const openAcademicSet = (typeKey, index) => {
    nav(`/reading/academic/${typeKey}/set?i=${index}`);
  };

  return (
    <Wrap>
      <Hero>
        <HeroTop>
          <HeroTitle>
            TOEFL Reading <Dot>•</Dot> Daily Mastery
          </HeroTitle>

          <HeroCTA onClick={onQuickRandomStart}>
            <span className="emoji">🚀</span>
            Random 모의고사 바로 시작
          </HeroCTA>
        </HeroTop>

        <HeroSub>
          분야별 코스(CTW) → 실용 텍스트 → 학술 지문. 진행도 트래킹으로 “계속 풀고 싶어지는” 리딩 연습을 제공합니다.
        </HeroSub>

        <HeroLower>
          <FeaturePills aria-label="기능 요약">
            <Pill>
              <PillIcon>
                <Sparkles size={18} strokeWidth={2.2} />
              </PillIcon>
              <div>
                <PillTitle>분야별 CTW</PillTitle>
                <PillDesc>Bio/Soc/History 등</PillDesc>
              </div>
            </Pill>

            <Pill>
              <PillIcon>
                <Timer size={18} strokeWidth={2.2} />
              </PillIcon>
              <div>
                <PillTitle>집중 타이머</PillTitle>
                <PillDesc>세트별 시간 제한 모드</PillDesc>
              </div>
            </Pill>

            <Pill>
              <PillIcon>
                <BarChart3 size={18} strokeWidth={2.2} />
              </PillIcon>
              <div>
                <PillTitle>진행도 저장</PillTitle>
                <PillDesc>정답률/오답 자동 기록</PillDesc>
              </div>
            </Pill>
          </FeaturePills>

          <CoachCard>
            <CoachBadge>COACH TIP</CoachBadge>
            <CoachText>
              <b>Reading</b>은 주어·동사·목적어/보어만 잡고, 나머지는 전부 수식어로 흘려보내라.
            </CoachText>
          </CoachCard>
        </HeroLower>
      </Hero>

      <Grid>
        {/* 왼쪽 카드: 파트별 문제 */}
        <Card>
          <CardHeader>
            <CardTitle>
              <span className="emoji">🧠</span> 파트별 문제 풀기
            </CardTitle>
          </CardHeader>

          <Accordion>
            {partGroups.map((g) => (
              <AccItem key={g.key}>
                <AccHead onClick={() => toggle(g.key)}>
                  <div className="left">
                    <div className="title">{g.title}</div>
                    <div className="desc">{g.desc}</div>
                  </div>
                  <Chevron $open={!!openMap[g.key]}>▾</Chevron>
                </AccHead>

                {openMap[g.key] && (
                  <AccBody>
                    {/* ✅ CTW: 트랙 카드 */}
                    {g.key === "ctw" ? (
                      <>
                        <TrackHeader>
                          <TrackTitle>
                            <BookOpen size={16} strokeWidth={2.2} />
                            CTW · 분야별 트랙
                          </TrackTitle>
                          <TrackHint>
                            추천: <b>Core</b>로 감 잡기 → 전공 트랙으로 확장
                          </TrackHint>
                        </TrackHeader>

                        <TrackGrid>
                          {CTW_TRACK_LIST.map((t) => (
                            <TrackCard key={t.key} onClick={() => onCTWTrack(t.key)} type="button">
                              <TrackTop>
                                <TrackName>{t.title}</TrackName>
                                <CountPill>{t.total}개</CountPill>
                              </TrackTop>
                              <TrackDesc>{t.subtitle}</TrackDesc>
                            </TrackCard>
                          ))}
                        </TrackGrid>
                      </>
                    ) : null}

                    {/* ✅ DAILY: 폴더 → 펼치면 1~5 */}
                    {g.key === "daily" ? (
                      <>
                        <DailyHint>
                          카테고리를 누르면 폴더처럼 열리고 <b>Set 1~5</b>가 표시됩니다.
                        </DailyHint>

                        <DailyFolderGrid>
                          {dailyFolders.map((f) => {
  const list = DAILY_LIFE_BANK?.[f.key] || [];
  const totalSets = Array.isArray(list) ? list.length : 0;
  const showOpen = !!dailyOpen[f.key];

  return (
    <DailyFolderCard
      key={f.key}          // ✅ 이거 추가
      role="button"
      tabIndex={0}
      onClick={() => toggleDaily(f.key)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") toggleDaily(f.key);
      }}
    >
                                <FolderTop>
                                  <FolderLeft>
                                    <FolderIconBox>{f.icon}</FolderIconBox>
                                    <div>
                                      <FolderTitle>{f.label}</FolderTitle>
                                      <FolderSub>{totalSets} sets</FolderSub>
                                    </div>
                                  </FolderLeft>

                                  <FolderRight>
                                    <FolderChevron $open={showOpen}>
                                      <ChevronDown size={18} strokeWidth={2.4} />
                                    </FolderChevron>
                                  </FolderRight>
                                </FolderTop>

                                {showOpen ? (
                                  <FolderBody onClick={(e) => e.stopPropagation()}>
                                    <SetGrid>
                                      {(list || []).slice(0, 5).map((it, idx) => {
                                        const p = progressMap[it.id] || {
                                          done: 0,
                                          total: it.questions?.length || 0,
                                          correct: 0,
                                        };
                                        const total = p.total || (it.questions?.length || 0);
                                        const pct = getPct(p.done, total);

                                        return (
                                          <SetCard key={it.id} type="button" onClick={() => openDailySet(f.key, idx)}>
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
                                                정답 <b>{p.correct || 0}</b>
                                              </span>
                                              <span className="go">풀기 →</span>
                                            </SetBottom>
                                          </SetCard>
                                        );
                                      })}
                                    </SetGrid>

                                    <FolderActions>
                                      <FolderGhost onClick={() => openDailyList(f.key)} type="button">
                                        전체 보기
                                      </FolderGhost>
                                    </FolderActions>
                                  </FolderBody>
                                ) : null}
                              </DailyFolderCard>
                            );
                          })}
                        </DailyFolderGrid>
                      </>
                    ) : null}

                    {/* ✅ ACADEMIC: Daily Life처럼 폴더로 펼치기 */}
                    {g.key === "academic" ? (
                      <>
                        <DailyHint>
                          유형을 누르면 폴더처럼 열리고 <b>연습 1~5</b>가 표시됩니다.
                        </DailyHint>

                        <DailyFolderGrid>
                          {academicFolders.map((f) => {
                            const list = ACADEMIC_BANK?.[f.key] || [];
                            const showOpen = !!academicOpen[f.key];

                            return (
                              <DailyFolderCard key={f.key} type="button" onClick={() => toggleAcademic(f.key)}>
                                <FolderTop>
                                  <FolderLeft>
                                    <FolderIconBox>{f.icon}</FolderIconBox>
                                    <div>
                                      <FolderTitle>{f.label}</FolderTitle>
                                      <FolderSub>{list.length} sets</FolderSub>
                                    </div>
                                  </FolderLeft>

                                  <FolderRight>
                                    <FolderChevron $open={showOpen}>
                                      <ChevronDown size={18} strokeWidth={2.4} />
                                    </FolderChevron>
                                  </FolderRight>
                                </FolderTop>

                                {showOpen ? (
                                  <FolderBody onClick={(e) => e.stopPropagation()}>
                                    <SetGrid>
                                      {list.slice(0, 5).map((it, idx) => (
                                        <SetCard
                                          key={it.id || `${f.key}_${idx}`}
                                          type="button"
                                          onClick={() => openAcademicSet(f.key, idx)}
                                        >
                                          <SetTop>
                                            <SetTag>연습 {idx + 1}</SetTag>
                                            <SetPct>0%</SetPct>
                                          </SetTop>

                                          <SetMeta>
                                            문제 수 <b>{it.questions?.length || 0}</b>
                                          </SetMeta>

                                          <SetBar>
                                            <SetBarFill style={{ width: "0%" }} />
                                          </SetBar>

                                          <SetBottom>
                                            <span className="mini">
                                              정답 <b>0</b>
                                            </span>
                                            <span className="go">풀기 →</span>
                                          </SetBottom>
                                        </SetCard>
                                      ))}
                                    </SetGrid>

                                    {/* 필요하면 academic 전체보기도 여기서 추가 가능 */}
                                    <AccHint>
                                      추천: <b>유형별 정확도</b> → <b>타이머</b> → <b>리포트 분석</b>.
                                    </AccHint>
                                  </FolderBody>
                                ) : null}
                              </DailyFolderCard>
                            );
                          })}
                        </DailyFolderGrid>
                      </>
                    ) : null}
                  </AccBody>
                )}
              </AccItem>
            ))}
          </Accordion>
        </Card>

        {/* 오른쪽 카드: 모의고사 */}
        <Card>
          <CardHeader className="right">
            <CardTitle>
              <span className="emoji">📝</span> Reading 모의고사
            </CardTitle>
            <SmallNote>각 세트는 실제 시험 흐름처럼 구성되어 있습니다.</SmallNote>
          </CardHeader>

         <List>
  {READING_MOCK_LIST.map((t) => (
    <Row key={t.id}>
      <RowLeft>
        <FileIcon>📄</FileIcon>
        <div>
          <RowTitle>{t.title}</RowTitle>
          <RowMeta>{t.desc || "진행률/오답 리포트 연결 가능"}</RowMeta>
        </div>
      </RowLeft>

      <RowActions>
        <GhostBtn onClick={() => onReport(t.id)} type="button">
          Report
        </GhostBtn>
        <PrimaryBtn onClick={() => onSolve(t.id)} type="button">
  문제 풀기
</PrimaryBtn>
      </RowActions>
    </Row>
  ))}
</List>
        </Card>
      </Grid>
      {resumeModal ? (
  <ModalOverlay onClick={() => setResumeModal(null)}>
    <ModalCard onClick={(e) => e.stopPropagation()}>
      <ModalTitle>이어서 푸시겠습니까?</ModalTitle>
      <ModalSub>
        <b>{resumeModal.title}</b> 진행 기록이 있습니다.
      </ModalSub>

      <ModalBtns>
        <ModalGhost
          type="button"
          onClick={() => {
            setResumeModal(null);
          }}
        >
          취소
        </ModalGhost>

        <ModalGhost
          type="button"
          onClick={() => {
            const id = resumeModal.id;
            setResumeModal(null);
            clearMockProgress(id);
            nav(`/reading/mock/${id}`);
          }}
        >
          새로 풀기
        </ModalGhost>

        <ModalPrimary
          type="button"
          onClick={() => {
            const id = resumeModal.id;
            setResumeModal(null);
            nav(`/reading/mock/${id}`);
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

/* ---------------- styles ---------------- */

const Wrap = styled.div`
  padding: 28px 28px 40px;

  @media (max-width: 520px) {
    padding: 10px 10px 40px; /* ✅ 모바일 좌우 여백 확 줄이기 */
  }
`;

const Hero = styled.div`
  border-radius: 22px;
  padding: 20px 22px 18px;
  background: radial-gradient(1200px 380px at 0% 0%, rgba(0, 140, 255, 0.18), transparent 60%),
    radial-gradient(900px 420px at 60% 10%, rgba(255, 140, 0, 0.14), transparent 55%),
    rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(20, 40, 70, 0.08);
  box-shadow: 0 10px 28px rgba(10, 18, 30, 0.07);

  @media (max-width: 520px) {
    margin-left: -12px;  /* Wrap의 모바일 좌우 padding(12px) 상쇄 */
    margin-right: -12px;
    border-radius: 0;    /* 완전 풀블리드 느낌 */
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
  color: #101827;
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
  color: rgba(16, 24, 39, 0.75);
  font-size: clamp(12.5px, 3.6vw, 14.5px);
  line-height: 1.6;

  @media (max-width: 420px) {
    line-height: 1.55;
  }
`;

const HeroCTA = styled.button`
  border: none;
  cursor: pointer;
  border-radius: 16px;
  padding: 13px 18px;
  font-weight: 900;
  color: white;
  background: linear-gradient(135deg, #ff7a1a, #ff4d00);
  box-shadow: 0 12px 24px rgba(255, 92, 18, 0.28);
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: clamp(13px, 3.8vw, 14px);

  .emoji {
    font-size: 16px;
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

  &:active {
    transform: translateY(1px);
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
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(16, 24, 39, 0.08);
  border-radius: 22px;
  box-shadow: 0 14px 28px rgba(10, 18, 30, 0.06);
  overflow: hidden;
  
`;

const CardHeader = styled.div`
  padding: 18px 18px 14px;
  border-bottom: 1px solid rgba(16, 24, 39, 0.06);
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
  color: #101827;

  .emoji {
    margin-right: 8px;
  }
`;

const SmallNote = styled.div`
  font-size: 13px;
  color: rgba(16, 24, 39, 0.6);
`;

const Accordion = styled.div`
  padding: 10px 12px 16px;
`;

const AccItem = styled.div`
  background: rgba(245, 247, 250, 0.8);
  border: 1px solid rgba(16, 24, 39, 0.06);
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
    color: rgba(16, 24, 39, 0.92);
    letter-spacing: -0.2px;
  }

  .desc {
    font-size: 12.5px;
    color: rgba(16, 24, 39, 0.55);
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
  border-top: 1px solid rgba(16, 24, 39, 0.06);
  background: rgba(255, 255, 255, 0.72);
`;

const AccHint = styled.div`
  margin-top: 10px;
  font-size: 12.5px;
  color: rgba(16, 24, 39, 0.65);
  line-height: 1.55;

  b {
    color: rgba(16, 24, 39, 0.92);
  }
`;

/* ✅ CTW Track UI */
const TrackHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
`;

const TrackTitle = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 950;
  color: rgba(16, 24, 39, 0.9);
`;

const TrackHint = styled.div`
  font-size: 12.5px;
  color: rgba(16, 24, 39, 0.6);

  b {
    color: rgba(16, 24, 39, 0.9);
  }
`;

const TrackGrid = styled.div`
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const TrackCard = styled.button`
  text-align: left;
  border: 1px solid rgba(16, 24, 39, 0.10);
  background: rgba(255, 255, 255, 0.96);
  border-radius: 16px;
  padding: 12px 12px;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(10, 18, 30, 0.05);
  transition: transform 0.08s ease, box-shadow 0.18s ease, border-color 0.18s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: rgba(30, 136, 255, 0.22);
    box-shadow: 0 16px 32px rgba(0, 90, 255, 0.08);
  }

  &:active {
    transform: translateY(0px);
  }
`;

const TrackTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
`;

const TrackName = styled.div`
  font-weight: 950;
  color: rgba(16, 24, 39, 0.92);
`;

const TrackDesc = styled.div`
  margin-top: 4px;
  font-size: 12.5px;
  color: rgba(16, 24, 39, 0.58);
`;

const CountPill = styled.div`
  flex: 0 0 auto;
  font-size: 12px;
  font-weight: 900;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(16, 24, 39, 0.06);
  color: rgba(16, 24, 39, 0.75);
  border: 1px solid rgba(16, 24, 39, 0.06);
`;

/* ✅ DAILY 폴더 UI */
const DailyHint = styled.div`
  font-size: 12.5px;
  color: rgba(16, 24, 39, 0.66);
  line-height: 1.55;

  b {
    color: rgba(16, 24, 39, 0.92);
  }
`;

const DailyFolderGrid = styled.div`
  margin-top: 10px;
  display: grid;
  gap: 10px;
`;

const DailyFolderCard = styled.div`
  text-align: left;
  border: 1px solid rgba(16, 24, 39, 0.10);
  background: rgba(255, 255, 255, 0.96);
  border-radius: 16px;
  padding: 12px 12px;
  cursor: pointer;
  box-shadow: 0 10px 18px rgba(10, 18, 30, 0.05);
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
  background: rgba(0, 120, 255, 0.08);
  border: 1px solid rgba(0, 120, 255, 0.12);
`;

const FolderTitle = styled.div`
  font-weight: 950;
  color: rgba(16, 24, 39, 0.92);
`;

const FolderSub = styled.div`
  margin-top: 2px;
  font-size: 12px;
  color: rgba(16, 24, 39, 0.58);
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
  border-top: 1px dashed rgba(16, 24, 39, 0.12);
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
  border: 1px solid rgba(16, 24, 39, 0.10);
  background: rgba(245, 247, 250, 0.85);
  border-radius: 16px;
  padding: 12px 12px;
  cursor: pointer;
  transition: transform 0.08s ease, box-shadow 0.18s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 14px 26px rgba(0, 90, 255, 0.08);
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
  background: rgba(0, 120, 255, 0.10);
  color: rgba(0, 90, 255, 0.95);
`;

const SetPct = styled.div`
  font-weight: 950;
  color: rgba(16, 24, 39, 0.72);
  font-size: 12px;
`;

const SetMeta = styled.div`
  margin-top: 8px;
  font-size: 12.5px;
  color: rgba(16, 24, 39, 0.68);

  b {
    color: rgba(16, 24, 39, 0.92);
  }
`;

const SetBar = styled.div`
  margin-top: 10px;
  height: 10px;
  border-radius: 999px;
  background: rgba(16, 24, 39, 0.08);
  overflow: hidden;
`;

const SetBarFill = styled.div`
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(135deg, #1e88ff, #0055ff);
`;

const SetBottom = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .mini {
    font-size: 12px;
    color: rgba(16, 24, 39, 0.62);

    b {
      color: rgba(16, 24, 39, 0.92);
    }
  }

  .go {
    font-weight: 950;
    font-size: 13px;
    color: rgba(0, 85, 255, 0.95);
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
  border: 1px solid rgba(16, 24, 39, 0.12);
  background: white;
  cursor: pointer;
  font-weight: 900;
  color: rgba(16, 24, 39, 0.78);

  &:hover {
    transform: translateY(-1px);
  }
`;

/* ✅ ACADEMIC chips */
const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Chip = styled.button`
  border: 1px solid rgba(16, 24, 39, 0.12);
  background: white;
  cursor: pointer;
  border-radius: 999px;
  padding: 8px 12px;
  font-weight: 900;
  font-size: 12.5px;
  color: rgba(16, 24, 39, 0.88);
  box-shadow: 0 10px 18px rgba(10, 18, 30, 0.06);

  &:hover {
    transform: translateY(-1px);
  }
`;

/* HeroLower */
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
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(16, 24, 39, 0.08);
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
  background: radial-gradient(120% 120% at 20% 15%, rgba(0, 140, 255, 0.14), transparent 60%),
    rgba(16, 24, 39, 0.04);
  border: 1px solid rgba(16, 24, 39, 0.06);
  flex: 0 0 auto;
`;

const PillTitle = styled.div`
  font-weight: 900;
  font-size: 13.5px;
  letter-spacing: -0.2px;
  color: rgba(16, 24, 39, 0.92);
`;

const PillDesc = styled.div`
  margin-top: 2px;
  font-size: 12px;
  color: rgba(16, 24, 39, 0.58);
  line-height: 1.25;
`;

const CoachCard = styled.div`
  border-radius: 18px;
  padding: 10px 14px;
  background: radial-gradient(1000px 280px at 10% 0%, rgba(255, 140, 0, 0.12), transparent 60%),
    rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(16, 24, 39, 0.08);
  box-shadow: 0 10px 22px rgba(10, 18, 30, 0.05);
`;

const CoachBadge = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 900;
  font-size: 11px;
  letter-spacing: 0.6px;
  color: rgba(16, 24, 39, 0.75);
  background: rgba(16, 24, 39, 0.05);
  border: 1px solid rgba(16, 24, 39, 0.06);
`;

const CoachText = styled.div`
  margin-top: 10px;
  font-size: 13px;
  line-height: 1.6;
  color: rgba(16, 24, 39, 0.78);

  b {
    color: rgba(16, 24, 39, 0.95);
  }
`;

/* mock list */
const List = styled.div`
  padding: 12px 14px 16px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 18px;
  border-radius: 18px;
  border: 1px solid rgba(16, 24, 39, 0.08);
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
  background: rgba(0, 120, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
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
  border: 1px solid rgba(0, 120, 255, 0.4);
  background: white;
  color: rgba(0, 120, 255, 1);
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;

  @media (max-width: 480px) {
    flex: 1;
  }
`;

const PrimaryBtn = styled.button`
  height: 42px;
  padding: 0 16px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #1e88ff, #0055ff);
  color: white;
  font-weight: 800;
  white-space: nowrap;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(0, 85, 255, 0.25);

  @media (max-width: 480px) {
    flex: 1;
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
  border: 1px solid rgba(16, 24, 39, 0.12);
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
  color: rgba(16, 24, 39, 0.7);
  line-height: 1.55;

  b {
    color: rgba(16, 24, 39, 0.92);
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
  border: 1px solid rgba(16, 24, 39, 0.14);
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
  color: white;
  background: linear-gradient(135deg, #1e88ff, #0055ff);
  box-shadow: 0 10px 20px rgba(0, 85, 255, 0.22);
`;