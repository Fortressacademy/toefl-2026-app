import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { loadReadingMockById } from "../data/mocks/mockLoader";

const LS_READING_MOCK_PROGRESS = "reading_mock_progress_v1";

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
  return safeJsonParse(localStorage.getItem(LS_READING_MOCK_PROGRESS), {});
}
function saveAllProgress(all) {
  localStorage.setItem(LS_READING_MOCK_PROGRESS, JSON.stringify(all));
}
function onlyLetters(s) {
  return String(s || "").replace(/[^a-zA-Z]/g, "").toLowerCase();
}
function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
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
    } else {
      if (cnt > 0) break;
    }
  }
  return out;
}

/* ================= flatten sections ================= */
function buildScreenUnits(module) {
  const units = [];
  const sections = module?.sections || [];

  for (const sec of sections) {
    if (!sec) continue;

    if (sec.type === "ctw_paragraph") {
      const items = sec.items || [];
      for (const item of items) {
        units.push({
          kind: "ctw",
          sectionType: "ctw_paragraph",
          sectionId: sec.title || sec.id || "ctw",
          sectionTitle: sec.title || "CTW · Paragraph",
          item,
        });
      }
      continue;
    }

    if (sec.type === "daily_life" || sec.type === "academic") {
      const qs = sec.questions || [];
      for (let qi = 0; qi < qs.length; qi++) {
        units.push({
          kind: "mcq",
          sectionType: sec.type,
          sectionId: sec.title || sec.id || sec.type,
          sectionTitle: sec.title || sec.type,
          passage: sec.passage || null,
          q: qs[qi],
        });
      }
      continue;
    }
  }

  return units;
}

function getTotalPointsForModule(module) {
  let total = 0;
  const sections = module?.sections || [];
  for (const sec of sections) {
    if (!sec) continue;
    if (sec.type === "ctw_paragraph") {
      for (const it of sec.items || []) total += (it?.blanks || []).length;
    } else if (sec.type === "daily_life" || sec.type === "academic") {
      total += (sec.questions || []).length;
    }
  }
  return total;
}

function getTotalPointsForMock(mock) {
  const modules = mock?.modules || {};
  return (
    getTotalPointsForModule(modules.m1) +
    getTotalPointsForModule(modules.m2) +
    getTotalPointsForModule(modules.m3)
  );
}

function getScaled30(score, maxScore) {
  if (!maxScore) return 0;
  return clamp(Math.round((score / maxScore) * 30), 0, 30);
}

/* ================= TOEFL 2026 Reading 공식 band =================
   ETS 공개 기준:
   29-30 = 6.0
   27-28 = 5.5
   24-26 = 5.0
   22-23 = 4.5
   18-21 = 4.0
   12-17 = 3.5
   6-11  = 3.0
   4-5   = 2.5
   3     = 2.0
   2     = 1.5
   0-1   = 1.0
===================================================== */
function getTOEFLBandFrom30(scaled30) {
  if (scaled30 >= 29) {
    return {
      band: 6.0,
      level: 6,
      label: "최상위권",
      desc: "매우 높은 수준의 Reading 이해력",
      rangeText: "29-30",
    };
  }
  if (scaled30 >= 27) {
    return {
      band: 5.5,
      level: 6,
      label: "상위권",
      desc: "복잡한 지문도 안정적으로 처리 가능",
      rangeText: "27-28",
    };
  }
  if (scaled30 >= 24) {
    return {
      band: 5.0,
      level: 5,
      label: "우수",
      desc: "학술 지문의 핵심과 구조를 잘 파악함",
      rangeText: "24-26",
    };
  }
  if (scaled30 >= 22) {
    return {
      band: 4.5,
      level: 5,
      label: "준우수",
      desc: "세부 정보와 추론 처리 능력이 좋은 편",
      rangeText: "22-23",
    };
  }
  if (scaled30 >= 18) {
    return {
      band: 4.0,
      level: 4,
      label: "중상",
      desc: "기본 독해와 정보 파악은 안정적",
      rangeText: "18-21",
    };
  }
  if (scaled30 >= 12) {
    return {
      band: 3.5,
      level: 4,
      label: "중간",
      desc: "핵심 내용 이해는 가능하지만 정교함은 더 필요",
      rangeText: "12-17",
    };
  }
  if (scaled30 >= 6) {
    return {
      band: 3.0,
      level: 3,
      label: "기초 이상",
      desc: "직접적 정보 파악 중심의 독해 가능",
      rangeText: "6-11",
    };
  }
  if (scaled30 >= 4) {
    return {
      band: 2.5,
      level: 2,
      label: "기초",
      desc: "짧고 명확한 정보 위주로 이해 가능",
      rangeText: "4-5",
    };
  }
  if (scaled30 === 3) {
    return {
      band: 2.0,
      level: 2,
      label: "초기 기초",
      desc: "매우 제한적인 수준의 정보 파악",
      rangeText: "3",
    };
  }
  if (scaled30 === 2) {
    return {
      band: 1.5,
      level: 1,
      label: "입문",
      desc: "아주 기본적인 독해 처리 단계",
      rangeText: "2",
    };
  }
  return {
    band: 1.0,
    level: 1,
    label: "시작 단계",
    desc: "Reading 기초 형성이 필요한 단계",
    rangeText: "0-1",
  };
}

function makeMCQAnswerKey(moduleId, qid) {
  return `mcq:${moduleId}:${qid}`;
}
function makeCTWAnswerKey(moduleId, itemId) {
  return `ctw:${moduleId}:${itemId}`;
}

function getPassageText(passage) {
  if (!passage) return "";
  if (typeof passage.text === "string") return passage.text;
  if (Array.isArray(passage.paragraphs)) return passage.paragraphs.join("\n\n");
  return "";
}

function resolveCTWParagraph(item) {
  const text = String(item?.paragraph || "");
  const blankMap = {};
  (item?.blanks || []).forEach((b) => {
    blankMap[b.key] = b;
  });

  return text.replace(/{{\s*(\d+)\s*}}/g, (_, key) => {
    const b = blankMap[key];
    return b ? b.answer : "_____";
  });
}

function buildModuleReview(moduleId, module, answers) {
  const units = buildScreenUnits(module);

  const reviewItems = units.map((unit, idx) => {
    const order = idx + 1;

    if (unit.kind === "mcq") {
      const key = makeMCQAnswerKey(moduleId, unit.q.id);
      const saved = answers?.[key] || null;
      const picked = saved?.picked || null;
      const correctAnswer = unit.q.answer;
      const submitted = !!saved?.submitted;
      const isWrong = submitted && picked && picked !== correctAnswer;
      const isCorrect = submitted && picked === correctAnswer;

      return {
        moduleId,
        order,
        answerKey: key,
        kind: "mcq",
        sectionType: unit.sectionType,
        sectionTitle: unit.sectionTitle,
        title: `${order}. ${unit.q.q}`,
        passageTitle:
          unit?.passage?.title ||
          (unit.sectionType === "academic" ? "Academic Passage" : "Passage"),
        passageText: getPassageText(unit.passage),
        question: unit.q.q,
        options: unit.q.options || {},
        picked,
        correctAnswer,
        explanation: unit.q.explanation || null,
        submitted,
        isWrong,
        isCorrect,
        pointTotal: 1,
        pointCorrect: isCorrect ? 1 : 0,
      };
    }

    const key = makeCTWAnswerKey(moduleId, unit.item.id);
    const saved = answers?.[key] || null;
    const wrongKeys = saved?.wrongKeys || [];
    const correct = Number.isFinite(saved?.correct) ? saved.correct : 0;
    const wrong = Number.isFinite(saved?.wrong) ? saved.wrong : 0;
    const total = Number.isFinite(saved?.total)
      ? saved.total
      : (unit.item?.blanks || []).length;

    const blankMap = {};
    (unit.item?.blanks || []).forEach((b) => {
      blankMap[b.key] = b;
    });

    const wrongDetails = wrongKeys.map((k) => {
      const b = blankMap[k];
      const ansRaw = String(b?.answer || "").trim();
      const pLen = clamp(Number.isFinite(b?.prefixLen) ? b.prefixLen : 2, 0, 4);
      const prefix = takeFirstNLettersOriginal(ansRaw, pLen);
      const answerRest = onlyLetters(ansRaw).slice(pLen);
      const typedRest = onlyLetters(String(saved?.typedMap?.[k] || ""));

      return {
        key: k,
        prefix,
        answer: ansRaw,
        answerRest,
        typedRest,
      };
    });

    return {
      moduleId,
      order,
      answerKey: key,
      kind: "ctw",
      sectionType: "ctw_paragraph",
      sectionTitle: unit.sectionTitle,
      title: `${order}. CTW Paragraph`,
      passageTitle: unit.sectionTitle || "CTW · Paragraph",
      passageText: resolveCTWParagraph(unit.item),
      rawParagraph: unit.item?.paragraph || "",
      blanks: unit.item?.blanks || [],
      typedMap: saved?.typedMap || {},
      wrongKeys,
      wrongDetails,
      submitted: !!saved?.submitted,
      isWrong: wrong > 0,
      isCorrect: wrong === 0 && !!saved?.submitted,
      pointTotal: total,
      pointCorrect: correct,
    };
  });

  const total = reviewItems.reduce((acc, it) => acc + (it.pointTotal || 0), 0);
  const correct = reviewItems.reduce((acc, it) => acc + (it.pointCorrect || 0), 0);
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

export default function ReadingMockResult() {
  const nav = useNavigate();
  const { mockId } = useParams();

  const mock = useMemo(() => loadReadingMockById(mockId), [mockId]);
  const progress = useMemo(() => {
    const all = loadAllProgress();
    return all?.[mockId] || null;
  }, [mockId]);

  const [selected, setSelected] = useState(null);

  const answers = progress?.answers || {};
  const secondModuleId =
    progress?.activeModuleId && progress.activeModuleId !== "m1"
      ? progress.activeModuleId
      : null;

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
    return modulesToShow.map(([id, module]) => buildModuleReview(id, module, answers));
  }, [modulesToShow, answers]);

  const totalScored = Number.isFinite(progress?.score) ? progress.score : 0;
  const totalPossible = Number.isFinite(progress?.maxScore)
    ? progress.maxScore
    : getTotalPointsForMock(mock);

  const scaled30 = getScaled30(totalScored, totalPossible);
  const bandInfo = getTOEFLBandFrom30(scaled30);

  const totalWrongQuestions = moduleReviews.reduce((acc, m) => acc + m.wrongCount, 0);
  const overallPct = totalPossible ? Math.round((totalScored / totalPossible) * 100) : 0;

  const onResetAndRetry = () => {
    const all = loadAllProgress();
    delete all[mockId];
    saveAllProgress(all);
    nav(`/reading/mock/${mockId}`);
  };

  if (!mock) return null;

  return (
    <Page>
      <TopBar>
        <TopLeft>
          <TopTitle>{mock.title} 결과 리포트</TopTitle>
          <TopSub>
            모의고사 모드 결과 요약 · 정답/오답 및 module별 상세 분석
          </TopSub>
        </TopLeft>

        <TopRight>
          <TopBtn onClick={() => nav("/reading")}>목록으로</TopBtn>
          <TopBtn onClick={() => nav(`/reading/mock/${mockId}`)}>시험 화면</TopBtn>
          <PrimaryTop onClick={onResetAndRetry}>다시 풀기</PrimaryTop>
        </TopRight>
      </TopBar>

      <Shell>
        <HeroGrid>
          <HeroCard>
            <HeroTitle>전체 점수</HeroTitle>

            <ScoreRow>
              <ScoreRing
                style={{
                  background: `conic-gradient(#2563eb 0 ${overallPct}%, rgba(37,99,235,.12) ${overallPct}% 100%)`,
                }}
              >
                <ScoreRingInner>
                  <BigScore>{scaled30}</BigScore>
                  <BigScoreSub>/ 30</BigScoreSub>
                </ScoreRingInner>
              </ScoreRing>

              <HeroMeta>
                <ScoreMain>
                  {totalScored} / {totalPossible}점
                </ScoreMain>
                <ScoreSub>정답률 {overallPct}%</ScoreSub>

                <BadgeRow>
                  <LevelBadge>TOEFL Reading</LevelBadge>
                  <LevelBadge $dark>Level {bandInfo.band.toFixed(1)}</LevelBadge>
                  
                </BadgeRow>

                <LevelDesc>
                  {bandInfo.label} · 내부 30점 환산 기준 {scaled30}/30
                </LevelDesc>
                <Muted>
                  {bandInfo.desc}
                  <br />
                  ※ TOEFL Reading 공식 band 기준으로 표시한 결과입니다.
                </Muted>
              </HeroMeta>
            </ScoreRow>
          </HeroCard>

          <SideStatCard>
            <SmallLabel>선택된 분기</SmallLabel>
            <StatValue>
              {secondModuleId
                ? `${mock?.modules?.[secondModuleId]?.title || secondModuleId}`
                : "미완료"}
            </StatValue>

            <Divider />

            <SmallLabel>Reading 공식 Level</SmallLabel>
            <StatValue>{bandInfo.band.toFixed(1)}</StatValue>

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
                    클릭하면 지문, 문항, 정답, 내 답안을 상세하게 볼 수 있어요.
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
                            <WrongItemType>
                              {item.kind === "ctw"
                                ? "CTW Paragraph"
                                : item.sectionType === "academic"
                                ? "Academic"
                                : "Daily Life"}
                            </WrongItemType>
                            <WrongItemTitle>{item.title}</WrongItemTitle>
                          </WrongTextWrap>
                        </WrongLeft>

                        <WrongMeta>
                          {item.kind === "ctw"
                            ? `${item.wrongKeys.length}개 blank 오답`
                            : `선택: ${item.picked || "-"}`}
                        </WrongMeta>
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
              <DetailHeader>
                <DetailBadge>
                  {selected.kind === "ctw"
                    ? "CTW"
                    : selected.sectionType === "academic"
                    ? "Academic"
                    : "Daily Life"}
                </DetailBadge>
                <DetailHeadline>{selected.title}</DetailHeadline>
              </DetailHeader>

              <DetailGrid>
                <DetailPane>
                  <PaneTitle>{selected.passageTitle || "지문"}</PaneTitle>
                  <PassageBox>
                    <PassagePre>{selected.passageText || "—"}</PassagePre>
                  </PassageBox>
                </DetailPane>

                <DetailPane>
                  <PaneTitle>오답 분석</PaneTitle>

                  {selected.kind === "mcq" ? (
                    <>
                      <QuestionBox>{selected.question}</QuestionBox>

                      <OptionList>
                        {["A", "B", "C", "D"].map((ch) => {
                          const isCorrect = ch === selected.correctAnswer;
                          const isPicked = ch === selected.picked;

                          return (
                            <OptionCard
                              key={ch}
                              $correct={isCorrect}
                              $picked={isPicked}
                            >
                              <OptionBadge
                                $correct={isCorrect}
                                $picked={isPicked}
                              >
                                {ch}
                              </OptionBadge>
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

                          {selected.explanation.core ? (
                            <ExplainBlock>
                              <ExplainLabel>핵심</ExplainLabel>
                              <ExplainText>{selected.explanation.core}</ExplainText>
                            </ExplainBlock>
                          ) : null}

                          {selected.explanation.whyCorrect ? (
                            <ExplainBlock>
                              <ExplainLabel>정답 이유</ExplainLabel>
                              <ExplainText>{selected.explanation.whyCorrect}</ExplainText>
                            </ExplainBlock>
                          ) : null}

                          {selected.explanation.whyWrong ? (
                            <ExplainBlock>
                              <ExplainLabel>오답 이유</ExplainLabel>
                              <ExplainList>
                                {Object.entries(selected.explanation.whyWrong).map(
                                  ([k, v]) => (
                                    <li key={k}>
                                      <b>{k}.</b> {v}
                                    </li>
                                  )
                                )}
                              </ExplainList>
                            </ExplainBlock>
                          ) : null}
                        </ExplainCard>
                      ) : null}
                    </>
                  ) : (
                    <ExplainCard>
                      <ExplainTitle>틀린 blank 상세</ExplainTitle>
                      <BlankList>
                        {selected.wrongDetails.map((d) => (
                          <BlankCard key={d.key}>
                            <BlankTop>
                              <BlankKey>Blank {d.key}</BlankKey>
                              <BlankPrefix>{d.prefix}...</BlankPrefix>
                            </BlankTop>

                            <BlankRow>
                              <BlankLabel>내 입력</BlankLabel>
                              <BlankValue $bad>{d.typedRest || "(비어 있음)"}</BlankValue>
                            </BlankRow>

                            <BlankRow>
                              <BlankLabel>정답</BlankLabel>
                              <BlankValue $ok>{d.answer}</BlankValue>
                            </BlankRow>
                          </BlankCard>
                        ))}
                      </BlankList>
                    </ExplainCard>
                  )}
                </DetailPane>
              </DetailGrid>
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

const ScoreRow = styled.div`
  margin-top: 18px;
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 24px;
  align-items: center;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const ScoreRing = styled.div`
  width: 190px;
  height: 190px;
  border-radius: 999px;
  padding: 14px;
  display: grid;
  place-items: center;
  margin: 0 auto;
`;

const ScoreRingInner = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(15, 23, 42, 0.06);
  display: grid;
  place-items: center;
  text-align: center;
`;

const BigScore = styled.div`
  font-size: 54px;
  line-height: 1;
  font-weight: 1000;
  color: rgba(15, 23, 42, 0.96);
`;

const BigScoreSub = styled.div`
  margin-top: 4px;
  font-size: 15px;
  font-weight: 900;
  color: rgba(15, 23, 42, 0.5);
`;

const HeroMeta = styled.div``;

const ScoreMain = styled.div`
  font-size: 34px;
  font-weight: 1000;
  color: rgba(15, 23, 42, 0.96);
  letter-spacing: -0.4px;
`;

const ScoreSub = styled.div`
  margin-top: 6px;
  font-size: 14px;
  color: rgba(15, 23, 42, 0.62);
  font-weight: 800;
`;

const BadgeRow = styled.div`
  margin-top: 14px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const LevelBadge = styled.div`
  height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  background: ${({ $dark }) =>
    $dark ? "rgba(15,23,42,.92)" : "rgba(37,99,235,.10)"};
  color: ${({ $dark }) =>
    $dark ? "rgba(255,255,255,.95)" : "rgba(37,99,235,.92)"};
  font-weight: 950;
  border: 1px solid
    ${({ $dark }) =>
      $dark ? "rgba(15,23,42,.92)" : "rgba(37,99,235,.16)"};
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
  line-height: 1.55;
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
  letter-spacing: -0.2px;
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
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.06);
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
  border: 1px solid rgba(16, 185, 129, 0.18);
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
  border: 1px solid rgba(16, 185, 129, 0.12);
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
  background: rgba(255, 255, 255, 0.98);
  border-radius: 18px;
  padding: 14px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  text-align: left;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.04);

  &:hover {
    border-color: rgba(37, 99, 235, 0.18);
    background: rgba(37, 99, 235, 0.03);
  }
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
  border: 1px solid rgba(239, 68, 68, 0.16);
  color: rgba(220, 38, 38, 0.96);
  font-weight: 1000;
  flex-shrink: 0;
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
  line-height: 1.45;
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
  width: min(1260px, 100%);
  max-height: calc(100vh - 40px);
  overflow: hidden;
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
  color: rgba(15, 23, 42, 0.82);
  font-weight: 900;
  cursor: pointer;
`;

const ModalBody = styled.div`
  padding: 18px 20px 22px;
  overflow: auto;
`;

const DetailHeader = styled.div`
  margin-bottom: 14px;
`;

const DetailBadge = styled.div`
  display: inline-flex;
  align-items: center;
  height: 32px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(37, 99, 235, 0.10);
  color: rgba(37, 99, 235, 0.95);
  font-size: 12px;
  font-weight: 950;
`;

const DetailHeadline = styled.div`
  margin-top: 10px;
  font-size: 24px;
  font-weight: 1000;
  color: rgba(15, 23, 42, 0.95);
  line-height: 1.35;
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 16px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const DetailPane = styled.div`
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 22px;
  padding: 16px;
  background: rgba(248, 250, 252, 0.7);
`;

const PaneTitle = styled.div`
  font-size: 15px;
  font-weight: 950;
  color: rgba(15, 23, 42, 0.9);
  margin-bottom: 10px;
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

const QuestionBox = styled.div`
  border-radius: 18px;
  padding: 15px 16px;
  background: white;
  border: 1px solid rgba(15, 23, 42, 0.08);
  font-size: 15px;
  font-weight: 950;
  line-height: 1.5;
  color: rgba(15, 23, 42, 0.9);
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
  background: ${({ $correct, $picked }) =>
    $correct
      ? "rgba(16,185,129,.14)"
      : $picked
      ? "rgba(239,68,68,.14)"
      : "rgba(37,99,235,.08)"};
  color: ${({ $correct, $picked }) =>
    $correct
      ? "rgba(5,150,105,.98)"
      : $picked
      ? "rgba(220,38,38,.98)"
      : "rgba(37,99,235,.95)"};
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

const ExplainBlock = styled.div`
  margin-top: 14px;
`;

const ExplainLabel = styled.div`
  font-size: 12px;
  font-weight: 950;
  color: rgba(37, 99, 235, 0.92);
`;

const ExplainText = styled.div`
  margin-top: 6px;
  font-size: 13.5px;
  line-height: 1.65;
  color: rgba(15, 23, 42, 0.82);
`;

const ExplainList = styled.ul`
  margin: 8px 0 0;
  padding-left: 18px;
  color: rgba(15, 23, 42, 0.82);
  font-size: 13.5px;
  line-height: 1.65;

  li + li {
    margin-top: 6px;
  }
`;

const BlankList = styled.div`
  margin-top: 12px;
  display: grid;
  gap: 10px;
`;

const BlankCard = styled.div`
  border-radius: 16px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: rgba(248, 250, 252, 0.8);
  padding: 14px;
`;

const BlankTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;

const BlankKey = styled.div`
  font-size: 13px;
  font-weight: 1000;
  color: rgba(15, 23, 42, 0.92);
`;

const BlankPrefix = styled.div`
  font-size: 12px;
  font-weight: 900;
  color: rgba(37, 99, 235, 0.9);
`;

const BlankRow = styled.div`
  margin-top: 10px;
  display: grid;
  grid-template-columns: 70px 1fr;
  gap: 10px;
  align-items: center;
`;

const BlankLabel = styled.div`
  font-size: 12px;
  font-weight: 900;
  color: rgba(15, 23, 42, 0.56);
`;

const BlankValue = styled.div`
  min-height: 38px;
  border-radius: 12px;
  padding: 10px 12px;
  background: ${({ $ok, $bad }) =>
    $ok
      ? "rgba(16,185,129,.10)"
      : $bad
      ? "rgba(239,68,68,.10)"
      : "white"};
  border: 1px solid
    ${({ $ok, $bad }) =>
      $ok
        ? "rgba(16,185,129,.16)"
        : $bad
        ? "rgba(239,68,68,.16)"
        : "rgba(15,23,42,.08)"};
  color: ${({ $ok, $bad }) =>
    $ok
      ? "rgba(5,150,105,.95)"
      : $bad
      ? "rgba(220,38,38,.95)"
      : "rgba(15,23,42,.88)"};
  font-weight: 900;
  display: flex;
  align-items: center;
`;