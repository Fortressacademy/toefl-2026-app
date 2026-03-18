import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function RouteReset() {
  const { pathname } = useLocation();

  useEffect(() => {
    // ✅ 라우트 이동 시 스크롤만 리셋 (zoom/transform 절대 건드리지 않음)
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    // (선택) 모바일에서 가끔 남는 터치 포커스/선택 방지용
    if (document.activeElement && typeof document.activeElement.blur === "function") {
      document.activeElement.blur();
    }
  }, [pathname]);

  return null;
}