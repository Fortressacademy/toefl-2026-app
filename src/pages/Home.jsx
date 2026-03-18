import styled, { keyframes } from "styled-components";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import GoalBoard from "../components/GoalBoard";
import MiniDiagnosticQuiz from "../components/MiniDiagnosticQuiz";

export default function Home() {
  const nav = useNavigate();
  const [modal, setModal] = useState(null); // "goal" | "diag" | null

  // ESC로 닫기
  useEffect(() => {
    if (!modal) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setModal(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [modal]);

  // 배경 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = modal ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [modal]);

  return (
    <Page>
      <Wrap>
        {/* PREMIUM HERO (Text-minimized) */}
        <Hero>
          <HeroTopBar>
            <BrandLeft>
              <BrandDot aria-hidden />
              <BrandName>포트리스어학원</BrandName>
              <BrandSub>TOEFL Practice</BrandSub>
            </BrandLeft>

            
          </HeroTopBar>

          <HeroInner>
            {/* LEFT */}
            <HeroLeft>
              <WelcomeRow>
                <Avatar aria-hidden>
                  <AvatarCore />
                </Avatar>

                <WelcomeText>
                  <HeroTitle>
                    Learner님, 오늘도 한 걸음씩. <Rocket>🚀</Rocket>
                  </HeroTitle>
                  <HeroSub>오늘은 짧게 · 정확히만 해도 충분해요.</HeroSub>
                </WelcomeText>
              </WelcomeRow>

              <CompactRow>
                <CompactBtn $variant="primary" type="button" onClick={() => nav("/vocab")}>
                  오늘 vocab
                </CompactBtn>

               <CompactBtn $variant="ghost" type="button" onClick={() => nav("/myvocab")}>
  나의 단어장
</CompactBtn>
              </CompactRow>
            </HeroLeft>

            {/* RIGHT */}
            <HeroRight>
              <SectionHead>
                <SectionTitle>오늘의 커리큘럼</SectionTitle>
              </SectionHead>

              <Grid4>
                <GridCard type="button" onClick={() => nav("/reading")}>
                  <GridIcon $tone="reading">
                    <BookIcon />
                  </GridIcon>
                  <GridText>
                    <GridTitle>Reading</GridTitle>
                    <GridDesc>Blank · Academic</GridDesc>
                  </GridText>
                  <Arrow aria-hidden>›</Arrow>
                </GridCard>

                <GridCard type="button" onClick={() => nav("/listening")}>
                  <GridIcon $tone="listening">
                    <HeadphoneIcon />
                  </GridIcon>
                  <GridText>
                    <GridTitle>Listening</GridTitle>
                    <GridDesc>Dialog · Lecture</GridDesc>
                  </GridText>
                  <Arrow aria-hidden>›</Arrow>
                </GridCard>

                <GridCard type="button" onClick={() => nav("/speaking")}>
                  <GridIcon $tone="speaking">
                    <MicIcon />
                  </GridIcon>
                  <GridText>
                    <GridTitle>Speaking</GridTitle>
                    <GridDesc>Shadow · Interview</GridDesc>
                  </GridText>
                  <Arrow aria-hidden>›</Arrow>
                </GridCard>

                <GridCard type="button" onClick={() => nav("/writing")}>
                  <GridIcon $tone="writing">
                    <PenIcon />
                  </GridIcon>
                  <GridText>
                    <GridTitle>Writing</GridTitle>
                    <GridDesc>Task 1–3</GridDesc>
                  </GridText>
                  <Arrow aria-hidden>›</Arrow>
                </GridCard>
              </Grid4>
            </HeroRight>
          </HeroInner>
        </Hero>

        {/* BOARDS (Summary cards + Floating Modal CTA) */}
        <Boards>
          <BoardCol>
            <Card>
              <SectionRow>
                <SectionLabel>오늘의 목표</SectionLabel>
                <SectionHint>최대 5개</SectionHint>
              </SectionRow>

              <SummaryCard>
                <SummaryLeft>
                  <SummaryTitle>목표 설정</SummaryTitle>
                  <SummaryDesc>
                    오늘 할 일만 짧게 등록하고, 체크하면서 진행하세요.
                  </SummaryDesc>
                </SummaryLeft>

                <SummaryActions>
                  <SummaryBtn type="button" onClick={() => setModal("goal")}>
                    Goal setting 하러가기
                  </SummaryBtn>
                </SummaryActions>
              </SummaryCard>
            </Card>
          </BoardCol>

          <BoardCol>
            <Card>
              <SectionRow>
                <SectionLabel>미니 진단</SectionLabel>
                <SectionHint>30초</SectionHint>
              </SectionRow>

              <SummaryCard>
                <SummaryLeft>
                  <SummaryTitle>미니 진단 퀴즈</SummaryTitle>
                  <SummaryDesc>
                    3문항으로 약점을 빠르게 체크하고 추천 학습으로 연결하세요.
                  </SummaryDesc>
                </SummaryLeft>

                <SummaryActions>
                  <SummaryBtn $variant="dark" type="button" onClick={() => setModal("diag")}>
                    Mini quiz 풀러가기
                  </SummaryBtn>
                </SummaryActions>
              </SummaryCard>
            </Card>
          </BoardCol>
        </Boards>
      </Wrap>

      {/* ===================== FLOATING MODAL ===================== */}
      {modal && (
        <Overlay
          role="dialog"
          aria-modal="true"
          aria-label={modal === "goal" ? "목표 설정" : "미니 진단"}
          onMouseDown={(e) => {
            // 오버레이 클릭으로 닫기 (패널 밖)
            if (e.target === e.currentTarget) setModal(null);
          }}
        >
          <ModalPanel onMouseDown={(e) => e.stopPropagation()}>
            <ModalTop>
              <ModalTitle>
                {modal === "goal" ? "목표 설정" : "미니 진단 퀴즈"}
              </ModalTitle>
              <ModalClose type="button" onClick={() => setModal(null)} aria-label="닫기">
                ✕
              </ModalClose>
            </ModalTop>

            <ModalBody>
              {modal === "goal" ? <GoalBoard /> : <MiniDiagnosticQuiz />}
            </ModalBody>
          </ModalPanel>
        </Overlay>
      )}
    </Page>
  );
}

/* ===================== STYLES ===================== */

const Page = styled.div`
  width: 100%;
  min-width: 0;
  position: relative;
  background:
    radial-gradient(900px 380px at 18% 0%, rgba(255, 176, 32, 0.09), transparent 60%),
    radial-gradient(900px 420px at 92% 10%, rgba(59, 130, 246, 0.09), transparent 58%),
    linear-gradient(180deg, #f8fafc 0%, #f5f7fb 100%);
`;

const Wrap = styled.div`
  width: 100%;
  min-width: 0;
  display: grid;
  gap: 16px;
  padding: 14px 14px 18px;

  @media (min-width: 980px) {
    padding: 18px 18px 22px;
    gap: 18px;
  }
`;

/* ---------- HERO ---------- */

const Hero = styled.section`
  width: 100%;
  min-width: 0;
  border-radius: 22px;
  overflow: hidden;

  border: 1px solid rgba(226, 232, 240, 0.9);
  box-shadow:
    0 18px 45px rgba(15, 23, 42, 0.08),
    0 1px 0 rgba(255, 255, 255, 0.7) inset;

  background:
    radial-gradient(1200px 420px at 22% 45%, rgba(255, 176, 32, 0.14), transparent 58%),
    radial-gradient(980px 380px at 92% 10%, rgba(59, 130, 246, 0.12), transparent 60%),
    linear-gradient(180deg, #ffffff 0%, #f7faff 100%);
`;

const HeroTopBar = styled.div`
  padding: 14px 14px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;

  background: linear-gradient(180deg, rgba(15, 23, 42, 0.92), rgba(15, 23, 42, 0.88));
  color: #fff;

  @media (min-width: 980px) {
    padding: 14px 18px 12px;
  }
`;

const BrandLeft = styled.div`
  display: inline-flex;
  align-items: baseline;
  gap: 10px;
  min-width: 0;
`;

const BrandDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #ffb020;
  box-shadow: 0 0 0 6px rgba(255, 176, 32, 0.18);
  flex: 0 0 auto;
`;

const BrandName = styled.div`
  font-weight: 1000;
  letter-spacing: -0.3px;
  white-space: nowrap;
`;

const BrandSub = styled.div`
  font-weight: 900;
  opacity: 0.82;
  font-size: 12px;
  letter-spacing: -0.2px;
  white-space: nowrap;

  @media (max-width: 360px) {
    display: none;
  }
`;

const TopAction = styled.button`
  border: 1px solid rgba(255, 255, 255, 0.22);
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
  font-weight: 950;
  height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  cursor: pointer;
  letter-spacing: -0.2px;

  &:active {
    transform: translateY(0.5px);
  }
`;

const HeroInner = styled.div`
  width: 100%;
  min-width: 0;
  padding: 16px;

  display: grid;
  grid-template-columns: 1.25fr 1fr;
  gap: 16px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  @media (min-width: 980px) {
    padding: 18px;
    gap: 18px;
  }
`;

const HeroLeft = styled.div`
  min-width: 0;
  display: grid;
  gap: 14px;
`;

const WelcomeRow = styled.div`
  display: flex;
  gap: 14px;
  align-items: flex-start;
  min-width: 0;
`;

const Avatar = styled.div`
  width: 54px;
  height: 54px;
  border-radius: 18px;
  background: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.95);
  box-shadow: 0 16px 34px rgba(15, 23, 42, 0.10);
  display: grid;
  place-items: center;
  flex: 0 0 auto;
`;

const AvatarCore = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 7px;
  background: linear-gradient(180deg, #ffcc66, #ffb020);
`;

const WelcomeText = styled.div`
  min-width: 0;
  display: grid;
  gap: 8px;
`;

const HeroTitle = styled.h1`
  margin: 0;
  font-size: clamp(20px, 3.8vw, 30px);
  letter-spacing: -0.7px;
  color: #0b1220;
  overflow-wrap: anywhere;
  line-height: 1.15;
`;

const Rocket = styled.span`
  font-size: 1em;
  margin-left: 6px;
`;

const HeroSub = styled.p`
  margin: 0;
  color: #64748b;
  font-size: 13px;
  line-height: 1.35;
  font-weight: 700;
  max-width: 34ch;
`;

/* ---------- RIGHT ---------- */

const HeroRight = styled.div`
  min-width: 0;
  display: grid;
  gap: 12px;
  align-content: start;
`;

const SectionHead = styled.div`
  display: grid;
  gap: 4px;
`;

const SectionTitle = styled.div`
  font-size: 14px;
  font-weight: 1100;
  letter-spacing: -0.25px;
  color: #0b1220;
`;

const Grid4 = styled.div`
  width: 100%;
  min-width: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 420px) {
    grid-template-columns: 1fr;
  }
`;

const GridCard = styled.button`
  width: 100%;
  min-width: 0;
  text-align: left;

  border-radius: 18px;
  border: 1px solid rgba(226, 232, 240, 0.95);
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.07);
  padding: 14px;

  display: grid;
  grid-template-columns: 48px minmax(0, 1fr) 14px;
  gap: 12px;
  align-items: center;

  cursor: pointer;
  transition: transform 140ms ease, box-shadow 140ms ease, border-color 140ms ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 18px 36px rgba(15, 23, 42, 0.10);
    border-color: rgba(255, 176, 32, 0.28);
  }

  &:active {
    transform: translateY(0.5px);
  }
`;

const GridIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(226, 232, 240, 0.95);

  background: ${({ $tone }) =>
    $tone === "reading"
      ? "linear-gradient(180deg, rgba(255,176,32,0.18), rgba(255,255,255,0.86))"
      : $tone === "listening"
        ? "linear-gradient(180deg, rgba(59,130,246,0.16), rgba(255,255,255,0.86))"
        : $tone === "speaking"
          ? "linear-gradient(180deg, rgba(16,185,129,0.16), rgba(255,255,255,0.86))"
          : "linear-gradient(180deg, rgba(168,85,247,0.16), rgba(255,255,255,0.86))"};
`;

const GridText = styled.div`
  min-width: 0;
  display: grid;
  gap: 3px;
`;

const GridTitle = styled.div`
  font-weight: 1100;
  letter-spacing: -0.25px;
  color: #0b1220;
`;

const GridDesc = styled.div`
  font-size: 12px;
  color: #94a3b8;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Arrow = styled.div`
  font-size: 20px;
  font-weight: 1100;
  color: #94a3b8;
  justify-self: end;
`;

/* ---------- COMPACT ---------- */

const CompactRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
`;

const CompactBtn = styled.button`
  height: 38px;
  padding: 0 14px;
  border-radius: 12px;
  font-weight: 950;
  letter-spacing: -0.2px;
  cursor: pointer;
  white-space: nowrap;

  border: ${({ $variant }) =>
    $variant === "primary" ? "none" : "1px solid rgba(226,232,240,0.95)"};

  color: ${({ $variant }) => ($variant === "primary" ? "#fff" : "#0b1220")};

  background: ${({ $variant }) =>
    $variant === "primary"
      ? "linear-gradient(180deg, #0f172a, #111827)"
      : "rgba(255, 255, 255, 0.82)"};

  box-shadow: ${({ $variant }) =>
    $variant === "primary" ? "0 14px 26px rgba(15, 23, 42, 0.18)" : "none"};

  &:active {
    transform: translateY(0.5px);
  }

  @media (max-width: 420px) {
    height: 36px;
    padding: 0 12px;
  }
`;

/* ---------- BOARDS ---------- */

const Boards = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const BoardCol = styled.div`
  min-width: 0;
`;

const Card = styled.section`
  min-width: 0;
  background: rgba(255, 255, 255, 0.92);
  border-radius: 18px;
  border: 1px solid rgba(226, 232, 240, 0.95);
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
  padding: 16px;

  @media (min-width: 980px) {
    padding: 18px;
  }
`;

const SectionRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
`;

const SectionLabel = styled.div`
  font-size: 14px;
  font-weight: 1100;
  letter-spacing: -0.25px;
  color: #0b1220;
`;

const SectionHint = styled.div`
  font-size: 12px;
  font-weight: 800;
  color: #94a3b8;
  white-space: nowrap;
`;

const SummaryCard = styled.div`
  border-radius: 16px;
  border: 1px solid rgba(226, 232, 240, 0.95);
  background:
    radial-gradient(800px 220px at 0% 0%, rgba(255, 176, 32, 0.10), transparent 55%),
    rgba(255, 255, 255, 0.86);
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.06);
  padding: 14px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  @media (max-width: 420px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SummaryLeft = styled.div`
  min-width: 0;
  display: grid;
  gap: 6px;
`;

const SummaryTitle = styled.div`
  font-size: 15px;
  font-weight: 1100;
  letter-spacing: -0.25px;
  color: #0b1220;
`;

const SummaryDesc = styled.div`
  font-size: 12px;
  font-weight: 750;
  color: #64748b;
  line-height: 1.45;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const SummaryActions = styled.div`
  display: flex;
  gap: 10px;
  flex: 0 0 auto;

  @media (max-width: 420px) {
    justify-content: flex-end;
  }
`;

const SummaryBtn = styled.button`
  height: 38px;
  padding: 0 14px;
  border-radius: 12px;
  font-weight: 1000;
  letter-spacing: -0.2px;
  cursor: pointer;
  white-space: nowrap;

  border: ${({ $variant }) =>
    $variant === "dark" ? "none" : "1px solid rgba(226,232,240,0.95)"};

  color: ${({ $variant }) => ($variant === "dark" ? "#fff" : "#0b1220")};

  background: ${({ $variant }) =>
    $variant === "dark"
      ? "linear-gradient(180deg, #0f172a, #111827)"
      : "rgba(255, 255, 255, 0.86)"};

  box-shadow: ${({ $variant }) =>
    $variant === "dark" ? "0 14px 26px rgba(15, 23, 42, 0.16)" : "none"};

  &:active {
    transform: translateY(0.5px);
  }
`;

/* ===================== FLOATING MODAL STYLES ===================== */

const overlayIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const panelIn = keyframes`
  from { transform: translateY(14px) scale(0.985); opacity: 0; }
  to { transform: translateY(0) scale(1); opacity: 1; }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  padding: 14px;

  display: grid;
  place-items: center;

  background: rgba(2, 6, 23, 0.58);
  backdrop-filter: blur(8px);
  animation: ${overlayIn} 160ms ease-out;
`;

const ModalPanel = styled.div`
  width: min(920px, 100%);
  max-height: min(86vh, 820px);
  overflow: hidden;

  border-radius: 22px;
  border: 1px solid rgba(226, 232, 240, 0.18);

  background:
    radial-gradient(900px 240px at 10% 0%, rgba(255, 176, 32, 0.10), transparent 55%),
    radial-gradient(860px 220px at 92% 10%, rgba(59, 130, 246, 0.10), transparent 55%),
    rgba(255, 255, 255, 0.96);

  box-shadow:
    0 40px 90px rgba(0, 0, 0, 0.35),
    0 1px 0 rgba(255, 255, 255, 0.55) inset;

  animation: ${panelIn} 180ms ease-out;
`;

const ModalTop = styled.div`
  padding: 14px 14px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  border-bottom: 1px solid rgba(226, 232, 240, 0.9);

  background: linear-gradient(
    180deg,
    rgba(15, 23, 42, 0.92),
    rgba(15, 23, 42, 0.86)
  );
  color: #fff;

  @media (min-width: 980px) {
    padding: 14px 18px 12px;
  }
`;

const ModalTitle = styled.div`
  font-size: 14px;
  font-weight: 1100;
  letter-spacing: -0.25px;
`;

const ModalClose = styled.button`
  width: 38px;
  height: 38px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  cursor: pointer;
  font-weight: 1100;

  &:active {
    transform: translateY(0.5px);
  }
`;

const ModalBody = styled.div`
  padding: 14px;
  overflow: auto;
  max-height: calc(min(86vh, 820px) - 58px);

  @media (min-width: 980px) {
    padding: 18px;
  }
`;

/* ======= tiny inline icons (no library) ======= */

function svgBase(d) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={d} stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BookIcon() {
  return svgBase("M4 19a2 2 0 0 1 2-2h14M6 3h14v16H6a2 2 0 0 0-2 2V5a2 2 0 0 1 2-2Z");
}
function HeadphoneIcon() {
  return svgBase("M4 12a8 8 0 0 1 16 0v7a2 2 0 0 1-2 2h-1v-7h3M4 14h3v7H6a2 2 0 0 1-2-2v-7");
}
function MicIcon() {
  return svgBase("M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3Zm0 0v4m-4 0h8");
}
function PenIcon() {
  return svgBase("M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z");
}