import styled from "styled-components";

export default function TopBar({ title = "포트리스어학원  TOEFL Practice App" }) {
  return (
    <Bar role="banner">
      <Inner>
        <Title title={title}>{title}</Title>
      </Inner>
    </Bar>
  );
}

const Bar = styled.header`
  position: sticky;
  top: 0;
  z-index: 60;

  width: 100%;
  max-width: 100%;
  min-height: 56px;

  background: #2c3e50;
  color: #fff;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;

  /* ✅ bar가 1px이라도 튀면 잘려 보이니까 여기서 차단 */
  overflow-x: clip;
  @supports not (overflow-x: clip) {
    overflow-x: hidden;
  }
`;

const Inner = styled.div`
  width: 100%;
  max-width: 1200px;
  min-width: 0;

  padding: clamp(12px, 3vw, 14px) clamp(12px, 3vw, 16px);

  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const Title = styled.div`
  min-width: 0;
  width: 100%;

  font-weight: 800;
  letter-spacing: -0.2px;
  font-size: clamp(14px, 4vw, 18px);
  line-height: 1.2;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  /* ✅ 초소형에선 줄바꿈 허용(ellipsis가 오히려 잘림처럼 보일 때가 있음) */
  @media (max-width: 280px) {
    white-space: normal;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
`;