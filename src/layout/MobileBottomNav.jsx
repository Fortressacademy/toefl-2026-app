import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

export default function MobileBottomNav() {
  const nav = useNavigate();
  const { pathname } = useLocation();

  const items = [
    { key: "home", label: "Home", path: "/" },
    { key: "reading", label: "Reading", path: "/reading" },
    { key: "listening", label: "Listening", path: "/listening" },
    { key: "speaking", label: "Speaking", path: "/speaking" },
    { key: "my", label: "Writing", path: "/writing" },
  ];

  return (
    <Wrap>
      <Bar aria-label="Bottom Navigation">
        {items.map((it) => {
          const active =
            it.path === "/"
              ? pathname === "/"
              : pathname === it.path || pathname.startsWith(it.path + "/");

          return (
            <Item key={it.key} type="button" $active={active} onClick={() => nav(it.path)}>
              <Dot $active={active} />
              <Label $active={active}>{it.label}</Label>
            </Item>
          );
        })}
      </Bar>
    </Wrap>
  );
}

const Wrap = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;

  width: 100%;
  max-width: 100%;
  z-index: 50;

  overflow-x: clip;
  @supports not (overflow-x: clip) {
    overflow-x: hidden;
  }
`;

const Bar = styled.nav`
  width: 100%;
  max-width: 100%;

  height: 68px;
  background: #fff;
  border-top: 1px solid #e5e7eb;

  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr)); /* ✅ 핵심 */
  align-items: center;

  padding: 10px clamp(6px, 2.5vw, 10px);
  padding-bottom: calc(10px + env(safe-area-inset-bottom));

  overflow: hidden; /* 내부 튐 방지 */
`;

const Item = styled.button`
  appearance: none;
  border: 0;
  background: transparent;

  width: 100%;
  min-width: 0;

  cursor: pointer;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;

  padding: 6px 2px;
  border-radius: 12px;

  ${({ $active }) => ($active ? `background: rgba(59,130,246,0.10);` : `background: transparent;`)}
`;

const Dot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: ${({ $active }) => ($active ? "#3B82F6" : "#cbd5e1")};
`;

const Label = styled.div`
  width: 100%;
  min-width: 0;

  font-size: clamp(10px, 2.8vw, 12px);
  font-weight: ${({ $active }) => ($active ? 800 : 600)};
  color: ${({ $active }) => ($active ? "#111827" : "#64748b")};
  letter-spacing: -0.2px;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;