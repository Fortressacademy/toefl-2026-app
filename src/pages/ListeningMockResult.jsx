import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { loadListeningMockById } from "../data/listening/mockLoader";

const LS_LISTENING_MOCK_PROGRESS = "listening_mock_progress_v1";

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
  return safeJsonParse(localStorage.getItem(LS_LISTENING_MOCK_PROGRESS), {});
}
function saveAllProgress(all) {
  localStorage.setItem(LS_LISTENING_MOCK_PROGRESS, JSON.stringify(all));
}

function buildScreenUnits(module) {
  const units = [];
  const sections = module?.sections || [];

  for (const sec of sections) {
    if (!sec) continue;
    for (const item of sec.items || []) {
      units.push({
        kind: "item",
        sectionType: sec.type,
        sectionTitle: sec.title,
        item,
      });
    }
  }

  return units;
}

function getScaled30(score, maxScore) {
  if (!maxScore) return 0;
  return Math.max(0, Math.min(30, Math.round((score / maxScore) * 30)));
}

function getListeningBandFrom30(scaled30) {
  if (scaled30 >= 28) {
    return {
      band: 6.0,
      label: "최상위권",
      desc: "매우 높은 Listening 처리력",
    };
  }
  if (scaled30 >= 25) {
    return {
      band: 5.5,
      label: "상위권",
      desc: "빠른 정보 처리와 추론이 안정적",
    };
  }
  if (scaled30 >= 21) {
    return {
      band: 5.0,
      label: "우수",
      desc: "핵심과 세부를 잘 구분함",
    };
  }
  if (scaled30 >= 17) {
    return {
      band: 4.0,
      label: "중상",
      desc: "전체 흐름 이해가 비교적 안정적",
    };
  }
  if (scaled30 >= 12) {
    return {
      band: 3.5,
      label: "중간",
      desc: "직접적 정보 위주 이해 가능",
    };
  }
  if (scaled30 >= 7) {
    return {
      band: 3.0,
      label: "기초 이상",
      desc: "짧고 단순한 청취 중심",
    };
  }
  return {
    band: 2.0,
    label: "기초",
    desc: "청취 기본기 강화가 필요",
  };
}

function buildModuleReview(moduleId, module, answers) {
  const units = buildScreenUnits(module);

  const reviewItems = units.map((u, idx) => {
    const key = `item:${moduleId}:${u.item.id}`;
    const saved = answers?.[key] || null;
    const picked = saved?.picked || null;
    const correctAnswer = u.item.answer;
    const submitted = !!saved?.submitted;
    const isWrong = submitted && picked && picked !== correctAnswer;
    const isCorrect = submitted && picked === correctAnswer;

    return {
      moduleId,
      order: idx + 1,
      answerKey: key,
      title: u.item.question,
      itemType: u.item.type,
      audioTitle: u.item.title,
      transcript: u.item.transcript,
      speakers: u.item.speakers || [],
      options: u.item.options || {},
      picked,
      correctAnswer,
      explanation: u.item.explanation || null,
      submitted,
      isWrong,
      isCorrect,
      pointTotal: 1,
      pointCorrect: isCorrect ? 1 : 0,
    };
  });

  const total = reviewItems.length;
  const correct = reviewItems.reduce((acc, it) => acc + it.pointCorrect, 0);
  const wrongCount = reviewItems.filter((it) => it.isWrong).length;
  const accuracy = total ? Math.round((correct / total) * 100) : 0;

  return {
    moduleId,
    title: module?.title || moduleId,
    total,
    correct,
    wrongCount,
    accuracy,
    items: reviewItems,
    wrongItems: reviewItems.filter((it) => it.isWrong),
  };
}

export default function ListeningMockResult() {
  const nav = useNavigate();
  const { mockId } = useParams();

  const mock = useMemo(() => loadListeningMockById(mockId), [mockId]);
  const progress = useMemo(() => {
    const all = loadAllProgress();
    return all?.[mockId] || null;
  }, [mockId]);

  const [selected, setSelected] = useState(null);

  const answers = progress?.answers || {};
  const secondModuleId = progress?.takenSecondModuleId || null;

  const modulesToShow = useMemo(() => {
    if (!mock) return [];
    const arr = [];
    if (mock?.modules?.m1) arr.push(["m1", mock.modules.m1]);
    if (secondModuleId && mock?.modules?.[secondModuleId]) {
      arr.push([secondModuleId, mock.modules[secondModuleId]]);
    }
    return arr;
  }, [mock, secondModuleId]);

  const moduleReviews = useMemo(() => {
    return modulesToShow.map(([id, module]) =>
      buildModuleReview(id, module, answers)
    );
  }, [modulesToShow, answers]);

  const totalScored = Number.isFinite(progress?.score) ? progress.score : 0;
  const totalPossible = Number.isFinite(progress?.maxScore) ? progress.maxScore : 1;

  const scaled30 = getScaled30(totalScored, totalPossible);
  const bandInfo = getListeningBandFrom30(scaled30);

  const totalWrongQuestions = moduleReviews.reduce(
    (acc, m) => acc + m.wrongCount,
    0
  );
  const overallPct = totalPossible
    ? Math.round((totalScored / totalPossible) * 100)
    : 0;

  const onResetAndRetry = () => {
    const all = loadAllProgress();
    delete all[mockId];
    saveAllProgress(all);
    nav(`/listening/mock/${mockId}`);
  };

  if (!mock) return null;

  return (
    <Page>
      <TopBar>
        <TopLeft>
          <TopTitle>{mock.title} 결과 리포트</TopTitle>
          <TopSub>
            Listening adaptive mock 결과 요약 · module별 오답 분석
          </TopSub>
        </TopLeft>

        <TopRight>
          <TopBtn onClick={() => nav("/listening")}>목록으로</TopBtn>
          <PrimaryTop onClick={onResetAndRetry}>다시 풀기</PrimaryTop>
        </TopRight>
      </TopBar>

      <Shell>
        <HeroGrid>
          <HeroCard>
            <HeroTitle>전체 점수</HeroTitle>
            <ScoreMain>
              {totalScored} / {totalPossible}
            </ScoreMain>
            <ScoreSub>
              30점 환산 {scaled30} / 30 · 정답률 {overallPct}%
            </ScoreSub>
            <LevelDesc>
              {bandInfo.label} · Level {bandInfo.band.toFixed(1)}
            </LevelDesc>
            <Muted>{bandInfo.desc}</Muted>
          </HeroCard>

          <SideStatCard>
            <SmallLabel>선택된 분기</SmallLabel>
            <StatValue>
              {secondModuleId
                ? mock?.modules?.[secondModuleId]?.title || secondModuleId
                : "미완료"}
            </StatValue>

            <Divider />

            <SmallLabel>오답 문항</SmallLabel>
            <StatValue>{totalWrongQuestions}개</StatValue>

            <Divider />

            <SmallLabel>Module 1 분기용 오답 수</SmallLabel>
            <StatValue>{progress?.module1WrongCount ?? 0}개</StatValue>
          </SideStatCard>
        </HeroGrid>

        <SectionTitle>Module별 결과</SectionTitle>

        <ModuleGrid>
          {moduleReviews.map((m) => (
            <ModuleCard key={m.moduleId}>
              <ModuleHead>
                <div>
                  <ModuleTitle>{m.title}</ModuleTitle>
                  <ModuleSub>{m.moduleId.toUpperCase()}</ModuleSub>
                </div>
                <AccuracyPill>{m.accuracy}%</AccuracyPill>
              </ModuleHead>

              <ModuleStatRow>
                <StatBox>
                  <StatLabel>획득 점수</StatLabel>
                  <StatNum>
                    {m.correct} / {m.total}
                  </StatNum>
                </StatBox>

                <StatBox>
                  <StatLabel>오답 문항 수</StatLabel>
                  <StatNum>{m.wrongCount}</StatNum>
                </StatBox>

                <StatBox>
                  <StatLabel>정답률</StatLabel>
                  <StatNum>{m.accuracy}%</StatNum>
                </StatBox>
              </ModuleStatRow>

              <WrongSection>
                <WrongHeader>
                  <WrongTitle>Wrong Detail</WrongTitle>
                  <WrongSub>
                    클릭하면 transcript, 정답, 내 답안을 볼 수 있어요.
                  </WrongSub>
                </WrongHeader>

                {m.wrongItems.length === 0 ? (
                  <EmptyBox>이 module에서는 틀린 문항이 없습니다.</EmptyBox>
                ) : (
                  <WrongList>
                    {m.wrongItems.map((item) => (
                      <WrongItemButton
                        key={item.answerKey}
                        onClick={() => setSelected(item)}
                      >
                        <WrongLeft>
                          <WrongIndex>{item.order}</WrongIndex>
                          <WrongTextWrap>
                            <WrongItemType>{item.itemType}</WrongItemType>
                            <WrongItemTitle>{item.title}</WrongItemTitle>
                          </WrongTextWrap>
                        </WrongLeft>

                        <WrongMeta>선택: {item.picked || "-"}</WrongMeta>
                      </WrongItemButton>
                    ))}
                  </WrongList>
                )}
              </WrongSection>
            </ModuleCard>
          ))}
        </ModuleGrid>
      </Shell>

      {selected ? (
        <ModalOverlay onClick={() => setSelected(null)}>
          <ModalCard onClick={(e) => e.stopPropagation()}>
            <ModalTop>
              <ModalTitle>문항 상세 보기</ModalTitle>
              <CloseBtn onClick={() => setSelected(null)}>닫기</CloseBtn>
            </ModalTop>

            <ModalBody>
              <DetailHeadline>{selected.title}</DetailHeadline>

              <PassageBox>
                <PassagePre>{selected.transcript || "—"}</PassagePre>
              </PassageBox>

              <OptionList>
                {["A", "B", "C", "D"].map((ch) => {
                  const isCorrect = ch === selected.correctAnswer;
                  const isPicked = ch === selected.picked;

                  return (
                    <OptionCard key={ch} $correct={isCorrect} $picked={isPicked}>
                      <OptionBadge>{ch}</OptionBadge>
                      <OptionTextWrap>
                        <OptionText>{selected.options?.[ch]}</OptionText>
                        <OptionTags>
                          {isCorrect ? <Tag $ok>정답</Tag> : null}
                          {isPicked ? <Tag $bad>내 선택</Tag> : null}
                        </OptionTags>
                      </OptionTextWrap>
                    </OptionCard>
                  );
                })}
              </OptionList>

              {selected.explanation ? (
                <ExplainCard>
                  <ExplainTitle>해설</ExplainTitle>
                  <ExplainText>{selected.explanation}</ExplainText>
                </ExplainCard>
              ) : null}
            </ModalBody>
          </ModalCard>
        </ModalOverlay>
      ) : null}
    </Page>
  );
}

/* ================= styles ================= */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Page = styled.div`
  min-height: 100vh;
  background:
    radial-gradient(1200px 560px at 10% 0%, rgba(37, 99, 235, 0.12), transparent 60%),
    radial-gradient(1200px 560px at 90% 10%, rgba(16, 185, 129, 0.10), transparent 60%),
    linear-gradient(180deg, #f6f9ff 0%, #f4f7fc 100%);
`;

const TopBar = styled.div`
  padding: 20px 24px 10px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 14px;

  @media (max-width: 960px) {
    flex-direction: column;
  }
`;

const TopLeft = styled.div``;

const TopTitle = styled.div`
  font-size: 28px;
  font-weight: 950;
  letter-spacing: -0.4px;
  color: rgba(15, 23, 42, 0.95);
`;

const TopSub = styled.div`
  margin-top: 6px;
  font-size: 13.5px;
  color: rgba(15, 23, 42, 0.62);
`;

const TopRight = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const TopBtn = styled.button`
  height: 44px;
  padding: 0 16px;
  border-radius: 14px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  background: rgba(255, 255, 255, 0.92);
  color: rgba(15, 23, 42, 0.84);
  font-weight: 900;
  cursor: pointer;
`;

const PrimaryTop = styled(TopBtn)`
  border: none;
  background: linear-gradient(135deg, #2563eb, #0f4fff);
  color: white;
  box-shadow: 0 14px 30px rgba(37, 99, 235, 0.22);
`;

const Shell = styled.div`
  padding: 10px 24px 34px;
`;

const HeroGrid = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 18px;
  align-items: stretch;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

const HeroCard = styled.div`
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 28px;
  padding: 24px;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.08);
  animation: ${fadeUp} 0.22s ease-out;
`;

const SideStatCard = styled(HeroCard)`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const HeroTitle = styled.div`
  font-size: 16px;
  font-weight: 950;
  color: rgba(15, 23, 42, 0.86);
`;

const ScoreMain = styled.div`
  margin-top: 16px;
  font-size: 34px;
  font-weight: 1000;
  color: rgba(15, 23, 42, 0.96);
`;

const ScoreSub = styled.div`
  margin-top: 6px;
  font-size: 14px;
  color: rgba(15, 23, 42, 0.62);
  font-weight: 800;
`;

const LevelDesc = styled.div`
  margin-top: 12px;
  font-size: 16px;
  font-weight: 900;
  color: rgba(15, 23, 42, 0.82);
`;

const Muted = styled.div`
  margin-top: 8px;
  font-size: 12.5px;
  color: rgba(15, 23, 42, 0.5);
`;

const SmallLabel = styled.div`
  font-size: 13px;
  color: rgba(15, 23, 42, 0.55);
  font-weight: 800;
`;

const StatValue = styled.div`
  margin-top: 6px;
  font-size: 24px;
  font-weight: 1000;
  color: rgba(15, 23, 42, 0.95);
`;

const Divider = styled.div`
  height: 1px;
  margin: 16px 0;
  background: rgba(15, 23, 42, 0.08);
`;

const SectionTitle = styled.div`
  margin-top: 26px;
  margin-bottom: 14px;
  font-size: 22px;
  font-weight: 1000;
  color: rgba(15, 23, 42, 0.95);
`;

const ModuleGrid = styled.div`
  display: grid;
  gap: 16px;
`;

const ModuleCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 24px;
  padding: 20px;
`;

const ModuleHead = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
`;

const ModuleTitle = styled.div`
  font-size: 20px;
  font-weight: 1000;
  color: rgba(15, 23, 42, 0.95);
`;

const ModuleSub = styled.div`
  margin-top: 4px;
  font-size: 12px;
  color: rgba(15, 23, 42, 0.52);
  font-weight: 800;
`;

const AccuracyPill = styled.div`
  min-width: 76px;
  height: 38px;
  padding: 0 14px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(16, 185, 129, 0.10);
  color: rgba(5, 150, 105, 0.95);
  font-weight: 950;
`;

const ModuleStatRow = styled.div`
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const StatBox = styled.div`
  border-radius: 18px;
  padding: 16px;
  background: rgba(248, 250, 252, 0.95);
  border: 1px solid rgba(15, 23, 42, 0.06);
`;

const StatLabel = styled.div`
  font-size: 12.5px;
  color: rgba(15, 23, 42, 0.56);
  font-weight: 800;
`;

const StatNum = styled.div`
  margin-top: 7px;
  font-size: 24px;
  font-weight: 1000;
  color: rgba(15, 23, 42, 0.95);
`;

const WrongSection = styled.div`
  margin-top: 18px;
`;

const WrongHeader = styled.div`
  margin-bottom: 12px;
`;

const WrongTitle = styled.div`
  font-size: 16px;
  font-weight: 950;
  color: rgba(15, 23, 42, 0.9);
`;

const WrongSub = styled.div`
  margin-top: 5px;
  font-size: 12.5px;
  color: rgba(15, 23, 42, 0.56);
`;

const EmptyBox = styled.div`
  border-radius: 18px;
  padding: 18px;
  background: rgba(16, 185, 129, 0.08);
  color: rgba(5, 150, 105, 0.9);
  font-weight: 900;
`;

const WrongList = styled.div`
  display: grid;
  gap: 10px;
`;

const WrongItemButton = styled.button`
  width: 100%;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: white;
  border-radius: 18px;
  padding: 14px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  text-align: left;
`;

const WrongLeft = styled.div`
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const WrongIndex = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: rgba(239, 68, 68, 0.10);
  color: rgba(220, 38, 38, 0.96);
  font-weight: 1000;
`;

const WrongTextWrap = styled.div`
  min-width: 0;
`;

const WrongItemType = styled.div`
  font-size: 11px;
  font-weight: 900;
  color: rgba(37, 99, 235, 0.9);
`;

const WrongItemTitle = styled.div`
  margin-top: 4px;
  font-size: 14px;
  font-weight: 900;
  color: rgba(15, 23, 42, 0.9);
`;

const WrongMeta = styled.div`
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 900;
  color: rgba(15, 23, 42, 0.58);
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(2, 6, 23, 0.56);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const ModalCard = styled.div`
  width: min(980px, 100%);
  max-height: calc(100vh - 40px);
  overflow: auto;
  background: white;
  border-radius: 28px;
  box-shadow: 0 30px 70px rgba(2, 6, 23, 0.28);
  display: flex;
  flex-direction: column;
  animation: ${fadeUp} 0.18s ease-out;
`;

const ModalTop = styled.div`
  padding: 18px 20px;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.div`
  font-size: 20px;
  font-weight: 1000;
  color: rgba(15, 23, 42, 0.95);
`;

const CloseBtn = styled.button`
  height: 40px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  background: white;
  font-weight: 900;
  cursor: pointer;
`;

const ModalBody = styled.div`
  padding: 18px 20px 22px;
`;

const DetailHeadline = styled.div`
  margin-bottom: 14px;
  font-size: 24px;
  font-weight: 1000;
  color: rgba(15, 23, 42, 0.95);
`;

const PassageBox = styled.div`
  border-radius: 18px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: white;
  padding: 16px;
`;

const PassagePre = styled.pre`
  margin: 0;
  white-space: pre-wrap;
  font-size: 14.5px;
  line-height: 1.75;
  color: rgba(15, 23, 42, 0.86);
`;

const OptionList = styled.div`
  margin-top: 12px;
  display: grid;
  gap: 10px;
`;

const OptionCard = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr;
  gap: 12px;
  align-items: start;
  border-radius: 16px;
  padding: 12px;
  background: ${({ $correct, $picked }) =>
    $correct
      ? "rgba(16,185,129,.08)"
      : $picked
      ? "rgba(239,68,68,.08)"
      : "white"};
  border: 1px solid
    ${({ $correct, $picked }) =>
      $correct
        ? "rgba(16,185,129,.18)"
        : $picked
        ? "rgba(239,68,68,.18)"
        : "rgba(15,23,42,.08)"};
`;

const OptionBadge = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  font-weight: 1000;
  background: rgba(37,99,235,.08);
  color: rgba(37,99,235,.95);
`;

const OptionTextWrap = styled.div``;

const OptionText = styled.div`
  font-size: 14px;
  line-height: 1.55;
  color: rgba(15, 23, 42, 0.88);
  font-weight: 800;
`;

const OptionTags = styled.div`
  margin-top: 7px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const Tag = styled.div`
  height: 26px;
  padding: 0 10px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  font-size: 11px;
  font-weight: 950;
  background: ${({ $ok, $bad }) =>
    $ok
      ? "rgba(16,185,129,.12)"
      : $bad
      ? "rgba(239,68,68,.12)"
      : "rgba(15,23,42,.08)"};
  color: ${({ $ok, $bad }) =>
    $ok
      ? "rgba(5,150,105,.95)"
      : $bad
      ? "rgba(220,38,38,.95)"
      : "rgba(15,23,42,.8)"};
`;

const ExplainCard = styled.div`
  margin-top: 14px;
  border-radius: 20px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: white;
  padding: 16px;
`;

const ExplainTitle = styled.div`
  font-size: 15px;
  font-weight: 1000;
  color: rgba(15, 23, 42, 0.92);
`;

const ExplainText = styled.div`
  margin-top: 8px;
  font-size: 13.5px;
  line-height: 1.65;
  color: rgba(15, 23, 42, 0.82);
`;