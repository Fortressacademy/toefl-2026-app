import { NavLink } from "react-router-dom";
import styled from "styled-components";

export default function Sidebar() {
  const items = [
    { label: "Home", to: "/" },
    { label: "Reading", to: "/reading" },
    { label: "Listening", to: "/listening" },
    { label: "Speaking", to: "/speaking" },
    { label: "Writing", to: "/writing" },
    { label: "Vocab", to: "/vocab" },
    { label: "Template", to: "/template" },
  ];

  return (
    <Shell>
      <Card>
        <List>
          {items.map((it) => (
            <Item key={it.to}>
              <Link
                to={it.to}
                end={it.to === "/"}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <Dot />
                <span>{it.label}</span>
              </Link>
            </Item>
          ))}
        </List>

        {/* ✅ 아래로 “자연스럽게” 공간 채우는 느낌 */}
        <BottomFade />
      </Card>
    </Shell>
  );
}

/* ===================== STYLES ===================== */

const Shell = styled.div`
  width: 100%;
  height: 100%;     /* ✅ AppShell의 aside(height:100%)를 그대로 받음 */
  min-height: 0;
`;

const Card = styled.aside`
  width: 100%;
  height: 100%;     /* ✅ 핵심: 내용이 적어도 바닥까지 */
  min-height: 0;

  background: #2c3e50;
  border-radius: 18px;

  padding: 12px;

  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.06);

  display: flex;
  flex-direction: column;

  overflow: hidden;
`;

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;

  display: grid;
  gap: 6px;

  /* ✅ 리스트는 위쪽, 아래는 flex로 빈 공간 */
  flex: 0 0 auto;
`;

const Item = styled.li`
  min-width: 0;
`;

const Link = styled(NavLink)`
  width: 100%;
  min-width: 0;

  display: flex;
  align-items: center;
  gap: 10px;

  padding: 10px 12px;
  border-radius: 12px;

  color: rgba(255, 255, 255, 0.86);
  text-decoration: none;

  font-size: 14px;
  font-weight: 700;
  letter-spacing: -0.2px;

  span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }

  &.active {
    background: rgba(255, 255, 255, 0.12);
    color: #fff;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);
  }
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.35);
  flex: 0 0 auto;

  ${Link}.active & {
    background: #9cc3ff;
  }
`;

/* ✅ 아래까지 내려오는 “기둥” 느낌 + 자연스러운 마감 */
const BottomFade = styled.div`
  flex: 1 1 auto;
  min-height: 12px;

  background: linear-gradient(
    180deg,
    rgba(44, 62, 80, 0) 0%,
    rgba(44, 62, 80, 1) 85%
  );
  opacity: 0.35;
  pointer-events: none;
`;