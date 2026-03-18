// src/pages/Writing.jsx
import { useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { PencilLine, FileText } from "lucide-react";

import { WRITING_MOCK_BANK } from "../data/writing/writingIndex";
import {
  LS_WRITING_PROGRESS,
  LS_WRITING_REPORT,
  loadJson,
  saveJson,
} from "../data/writing/writingStore";

export default function Writing() {
  const nav = useNavigate();

  // ✅ 이어풀기 모달(목록에서도 유지: 엔진에서도 gate가 뜨도록 할 거라면, 여기 모달은 꺼도 됨)
  const [resumeOpen, setResumeOpen] = useState(false);
  const [pendingMock, setPendingMock] = useState(null);

  const mocks = useMemo(() => {
    const list = Array.isArray(WRITING_MOCK_BANK) ? WRITING_MOCK_BANK : [];
    return list.map((m, idx) => ({
      id: m?.id ?? `w_mock_${idx + 1}`,
      title: m?.title ?? `모의고사 ${idx + 1}`,
      meta: m?.meta ?? "Estimated 30 min · Task 1–3",
    }));
  }, []);

  const pendingTitle = useMemo(() => {
    return mocks.find((m) => m.id === pendingMock)?.title ?? "모의고사";
  }, [mocks, pendingMock]);

  const onGoReport = useCallback(
    (mockId) => {
      nav(`/writing/report?mock=${encodeURIComponent(mockId)}`);
    },
    [nav]
  );

  // ✅ "진행 기록 있음" 판정: 다양한 구조를 모두 안전하게 커버
  const hasProgress = useCallback((mockId) => {
    const all = loadJson(LS_WRITING_PROGRESS, {});
    const p = all?.[mockId];
    if (!p || typeof p !== "object") return false;

    // 1) taskIndex가 숫자면 진행 중
    if (Number.isFinite(p.taskIndex)) return true;

    // 2) answers 객체에 하나라도 있으면 진행 중
    const a = p.answers;
    if (a && typeof a === "object" && Object.keys(a).length > 0) return true;

    // 3) 기타 어떤 키라도 저장돼 있으면 진행 중(예: startedAt, timeLeftSec 등)
    return Object.keys(p).length > 0;
  }, []);

  const openSolve = useCallback(
    (mockId) => {
      if (hasProgress(mockId)) {
        setPendingMock(mockId);
        setResumeOpen(true);
        return;
      }
      nav(`/writing/mock/${encodeURIComponent(mockId)}`);
    },
    [hasProgress, nav]
  );

  const closeModal = useCallback(() => {
    setResumeOpen(false);
    setPendingMock(null);
  }, []);

  const onContinue = useCallback(() => {
    if (!pendingMock) return;
    closeModal();
    // ✅ 엔진에서 resume=1을 확인해서 "진입 시 gate 모달 재등장"을 막게 할 수 있음
    nav(`/writing/mock/${encodeURIComponent(pendingMock)}?resume=1`);
  }, [pendingMock, closeModal, nav]);

  const onRestart = useCallback(() => {
    if (!pendingMock) return;

    // ✅ progress 삭제(해당 mockId만)
    const all = loadJson(LS_WRITING_PROGRESS, {});
    if (all && typeof all === "object" && all?.[pendingMock]) {
      const next = { ...all };
      delete next[pendingMock];
      saveJson(LS_WRITING_PROGRESS, next);
    }

    // ✅ report 삭제(해당 mockId만)
    const rep = loadJson(LS_WRITING_REPORT, {});
    if (rep && typeof rep === "object" && rep?.[pendingMock]) {
      const nextRep = { ...rep };
      delete nextRep[pendingMock];
      saveJson(LS_WRITING_REPORT, nextRep);
    }

    closeModal();
    // ✅ 새로 풀기: resume 파라미터 없이 진입
    nav(`/writing/mock/${encodeURIComponent(pendingMock)}`);
  }, [pendingMock, closeModal, nav]);

  return (
    <Page>
      <Wrap>
        <Hero>
          <HeroIcon>
            <PencilLine size={22} />
          </HeroIcon>

          <HeroText>
            <Badge>TOEFL WRITING</Badge>
            <HeroTitle>Writing Center</HeroTitle>
            <HeroSub>Timed mocks, clean reports, and steady progress tracking</HeroSub>
          </HeroText>
        </Hero>

        <Grid>
          {mocks.map((m) => (
            <Card key={m.id}>
              <CardTop>
                <DocIcon>
                  <FileText size={22} />
                </DocIcon>

                <TopText>
                  <CardTitle title={m.title}>{m.title}</CardTitle>
                  <CardMeta title={m.meta}>{m.meta}</CardMeta>
                </TopText>
              </CardTop>

              <Divider />

              <Actions>
                <BtnGhost type="button" onClick={() => onGoReport(m.id)}>
                  Report
                </BtnGhost>
                <BtnPrimary type="button" onClick={() => openSolve(m.id)}>
                  문제 풀기
                </BtnPrimary>
              </Actions>
            </Card>
          ))}
        </Grid>
      </Wrap>

      {resumeOpen && (
        <ModalOverlay
          role="dialog"
          aria-modal="true"
          aria-label="이어하기 선택"
          onMouseDown={closeModal}
        >
          <ModalCard onMouseDown={(e) => e.stopPropagation()}>
            <ModalTitle>이어서 푸시겠습니까?</ModalTitle>
            <ModalDesc>{pendingTitle} 진행 기록이 있습니다.</ModalDesc>

            <ModalBtns>
              <ModalBtnGhost type="button" onClick={closeModal}>
                취소
              </ModalBtnGhost>
              <ModalBtnGhost type="button" onClick={onRestart}>
                새로 풀기
              </ModalBtnGhost>
              <ModalBtnPrimary type="button" onClick={onContinue}>
                이어하기
              </ModalBtnPrimary>
            </ModalBtns>
          </ModalCard>
        </ModalOverlay>
      )}
    </Page>
  );
}

/* ================= styles ================= */

const Page = styled.div`
  width: 100%;
  padding: 28px 18px 56px;

  @media (max-width: 640px) {
    padding: 20px 2px 80px;
  }
`;

const Wrap = styled.div`
  max-width: 1320px;
  margin: 0 auto;
`;

const Hero = styled.section`
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.06);
  border-radius: 22px;
  padding: 28px;
  display: flex;
  gap: 18px;
  align-items: center;
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.06);

  @media (max-width: 640px) {
    padding: 18px 14px;
    border-radius: 18px;
  }
`;

const HeroIcon = styled.div`
  width: 58px;
  height: 58px;
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  display: grid;
  place-items: center;
  color: #ff6a00;
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.08);
  flex: 0 0 auto;

  @media (max-width: 640px) {
    width: 52px;
    height: 52px;
    border-radius: 14px;
  }
`;

const HeroText = styled.div`
  min-width: 0;
`;

const Badge = styled.div`
  font-size: 12px;
  letter-spacing: 0.18em;
  color: #2a84ff;
  font-weight: 800;
  margin-bottom: 8px;
`;

const HeroTitle = styled.h1`
  margin: 0;
  font-size: 34px;
  line-height: 1.12;
  letter-spacing: -0.02em;
  color: #0f172a;
  font-weight: 900;

  @media (max-width: 640px) {
    font-size: 26px;
    line-height: 1.25;
  }
`;

const HeroSub = styled.p`
  margin: 8px 0 0;
  color: rgba(15, 23, 42, 0.6);
  font-size: 14px;

  @media (max-width: 640px) {
    font-size: 13px;
  }
`;

const Grid = styled.div`
  margin-top: 22px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    gap: 12px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 420px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.article`
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.06);
  border-radius: 18px;
  padding: 20px;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.06);
  min-width: 0;

  @media (max-width: 640px) {
    padding: 12px;
    border-radius: 16px;
  }
`;

const CardTop = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  min-width: 0;

  @media (max-width: 640px) {
    gap: 14px;
  }
`;

const DocIcon = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  display: grid;
  place-items: center;
  color: #94a3b8;
  flex: 0 0 auto;

  @media (max-width: 640px) {
    width: 46px;
    height: 46px;
    border-radius: 14px;
  }
`;

const TopText = styled.div`
  min-width: 0;
`;

const CardTitle = styled.div`
  font-size: 18px;
  font-weight: 900;
  color: #0f172a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 640px) {
    font-size: 16px;
  }
`;

const CardMeta = styled.div`
  margin-top: 4px;
  font-size: 13px;
  color: rgba(15, 23, 42, 0.55);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 640px) {
    font-size: 12px;
  }
`;

const Divider = styled.div`
  height: 1px;
  background: rgba(15, 23, 42, 0.08);
  margin: 14px 0 14px;
`;

const Actions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  align-items: stretch;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const BtnBase = styled.button`
  border: none;
  outline: none;
  cursor: pointer;
  border-radius: 14px;
  height: 48px;
  padding: 0 16px;
  width: 100%;
  font-size: 14px;
  font-weight: 900;
  letter-spacing: -0.01em;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.08s ease, box-shadow 0.12s ease, background 0.12s ease;

  &:active {
    transform: translateY(1px);
  }
`;

const BtnGhost = styled(BtnBase)`
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.12);
  color: #2a84ff;

  &:hover {
    box-shadow: 0 10px 22px rgba(15, 23, 42, 0.08);
  }
`;

const BtnPrimary = styled(BtnBase)`
  background: #ff6a00;
  color: #ffffff;
  box-shadow: 0 10px 20px rgba(255, 106, 0, 0.22);

  &:hover {
    box-shadow: 0 14px 26px rgba(255, 106, 0, 0.28);
  }
`;

/* ===== modal ===== */

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: grid;
  place-items: center;
  padding: 18px;
  z-index: 9999;
`;

const ModalCard = styled.div`
  width: min(720px, 100%);
  background: #ffffff;
  border-radius: 18px;
  padding: 22px;
  box-shadow: 0 30px 90px rgba(15, 23, 42, 0.22);
  border: 1px solid rgba(15, 23, 42, 0.08);

  @media (max-width: 640px) {
    padding: 18px 14px;
    border-radius: 16px;
  }
`;

const ModalTitle = styled.div`
  font-size: 18px;
  font-weight: 900;
  color: #0f172a;
`;

const ModalDesc = styled.div`
  margin-top: 8px;
  color: rgba(15, 23, 42, 0.7);
  font-size: 14px;
`;

const ModalBtns = styled.div`
  margin-top: 18px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const ModalBtnGhost = styled(BtnBase)`
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.12);
  color: #0f172a;
`;

const ModalBtnPrimary = styled(BtnBase)`
  background: #2a84ff;
  color: #ffffff;
  box-shadow: 0 12px 24px rgba(42, 132, 255, 0.25);

  &:hover {
    box-shadow: 0 16px 30px rgba(42, 132, 255, 0.32);
  }
`;