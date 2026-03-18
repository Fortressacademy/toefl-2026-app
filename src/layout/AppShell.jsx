import styled from "styled-components";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import MobileBottomNav from "./MobileBottomNav";

export default function AppShell({ children }) {
  const { pathname } = useLocation();

  // ✅ 모의고사(시험 진행 + 결과/리포트)에서는 사이드바/하단바 숨김
  const hideNav =
    pathname.startsWith("/reading/mock/") ||
    pathname.startsWith("/listening/mock/") ||
    pathname.startsWith("/speaking/mock/") ||
    pathname.startsWith("/writing/mock/");
    pathname.includes("/mock/");

  return (
    <Shell>
      <Body>
        <BodyInner $full={hideNav}>
          {!hideNav && (
            <SidebarArea>
              <Sidebar />
            </SidebarArea>
          )}

          <MainArea>{children}</MainArea>
        </BodyInner>
      </Body>

      {/* ✅ 모바일 하단 네비도 시험 중엔 숨김 */}
      {!hideNav && (
        <>
          <MobileNavArea>
            <MobileBottomNav />
          </MobileNavArea>
          <MobileBottomSpacer />
        </>
      )}
    </Shell>
  );
}

/* ===================== LAYOUT ===================== */

/**
 * ✅ 핵심 원칙
 * - 레이아웃 루트는 "가로 오버플로우를 보여주지 말고" 잘라서(clip) 안전하게 유지
 * - 대신, 내부 컨텐츠는 "폭 안에서 유연하게 줄어들도록" min-width:0, max-width:100% 를 촘촘히
 */

const Shell = styled.div`
  width: 100%;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background: #f6f7fb;

  /* ✅ 가로 삐져나오는 1~2px 문제(100vw, 스크롤바, fixed 등) 완전 차단 */
  overflow-x: clip;
`;

const TopBarWrap = styled.div`
  width: 100%;
  max-width: 100%;
  flex: 0 0 auto;
`;

const Body = styled.div`
  width: 100%;
  max-width: 100%;

  display: flex;
  justify-content: center;

  padding: clamp(8px, 3vw, 16px);

  /* ✅ 여기서도 가로 삐져나오는 걸 차단 */
  overflow-x: clip;

  /* ✅ Body가 페이지 높이를 채워서 Sidebar가 바닥까지 자연스럽게 내려가게 */
  flex: 1 1 auto;
`;

const BodyInner = styled.div`
  width: 100%;
  max-width: 1280px;
  min-width: 0;
  display: grid;
  gap: 16px;
  align-items: stretch;

  grid-template-columns: 180px minmax(0, 1fr);

  ${(p) =>
    p.$full &&
    `
    grid-template-columns: minmax(0, 1fr);
    max-width: 1100px; /* 원하면 1280 유지해도 됨 */
  `}

  @media (max-width: 1024px) {
    grid-template-columns: 200px minmax(0, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
    align-items: start;
  }
`;

const SidebarArea = styled.aside`
  min-width: 0;

  /* ✅ 바닥까지 */
  height: 100%;
  align-self: stretch;

  @media (max-width: 768px) {
    display: none;
  }
`;

const MainArea = styled.main`
  width: 100%;
  max-width: 100%;

  /* ✅ 1fr 영역이 콘텐츠 때문에 커지는 거 방지(매우 중요) */
  min-width: 0;

  /* ✅ 내부 요소가 넓어져도 가로튀김 방지 */
  overflow-x: clip;
`;

/* ===================== MOBILE BOTTOM NAV ===================== */

const MobileNavArea = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;

    width: 100%;
    max-width: 100%;

    z-index: 50;

    /* ✅ fixed 요소도 1~2px 튀는 거 차단 */
    overflow: clip;
  }
`;

const MobileBottomSpacer = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
    height: calc(68px + env(safe-area-inset-bottom));
  }
`;