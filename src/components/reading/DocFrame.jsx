// src/components/reading/DocFrame.jsx
import styled, { css } from "styled-components";

export default function DocFrame({
  headerLeft,
  headerRight,
  footerLeft,
  footerRight,
  children,
  fullBleed = false,
}) {
  return (
    <Shell>
      <TopBar>
        <div className="row">
          <div className="left">{headerLeft}</div>
          <div className="right" title={typeof headerRight === "string" ? headerRight : ""}>
            {headerRight}
          </div>
        </div>
      </TopBar>

      <Body $fullBleed={fullBleed}>
        <ContentArea $fullBleed={fullBleed}>{children}</ContentArea>
      </Body>

      <BottomBar>
        <div className="left">{footerLeft}</div>
        <div className="right">{footerRight}</div>
      </BottomBar>
    </Shell>
  );
}

const Shell = styled.div`
  border: 1px solid rgba(0,0,0,0.10);
  border-radius: 14px;
  box-shadow: none;
  background: #fff;
`;

const TopBar = styled.div`
  padding: 10px 14px;
  background: linear-gradient(180deg, #f6f7f9, #eef1f4);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  font-weight: 800;
  min-height: 44px;

  .row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
    min-width: 0;
    flex-wrap: wrap;
  }

  .left {
    font-size: 12px;
    letter-spacing: 0.4px;
    opacity: 0.85;
    min-width: 0;
    overflow-wrap: anywhere;
    line-height: 1.15;
  }

  .right {
    font-size: 12px;
    opacity: 0.9;
    min-width: 0;
    overflow-wrap: anywhere;
    line-height: 1.15;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 60%;
  }

  @media (max-width: 520px) {
    padding: 10px 12px;

    .right {
      max-width: 100%;
      white-space: normal;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }
`;

const Body = styled.div`
  min-height: 360px;

  ${({ $fullBleed }) =>
    $fullBleed
      ? css`
          padding: 0;
          background: #eef2f7;
        `
      : css`
          padding: 4px 6px;
        `}

  @media (max-width: 520px) {
    ${({ $fullBleed }) =>
      $fullBleed
        ? css`
            padding: 0;
          `
        : css`
            padding: 2px 4px;
          `}
  }
`;

const ContentArea = styled.div`
  ${({ $fullBleed }) =>
    $fullBleed
      ? css`
          width: 100%;
          max-width: 100%;
          margin: 0;
          padding: 0;
        `
      : css`
          font-family: Arial, Helvetica, sans-serif;
          font-size: 16.5px;
          line-height: 1.65;
          letter-spacing: 0;
          color: rgba(0, 0, 0, 0.88);
          max-width: 72ch;
          margin: 0;
          padding: 8px 10px;

          p {
            margin: 0 0 10px;
          }
        `}

  @media (max-width: 520px) {
    ${({ $fullBleed }) =>
      $fullBleed
        ? css`
            max-width: 100%;
            padding: 0;
          `
        : css`
            font-size: 16px;
            line-height: 1.6;
            padding: 4px 4px;
            max-width: 100%;
          `}
  }
`;

const BottomBar = styled.div`
  min-height: 44px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  background: #f7f8fa;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  font-weight: 800;

  .left {
    font-size: 12px;
    opacity: 0.75;
    min-width: 0;
    overflow-wrap: anywhere;
    line-height: 1.15;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 60%;
  }

  .right {
    display: inline-flex;
    gap: 8px;
    align-items: center;
    flex: 0 0 auto;
  }

  @media (max-width: 520px) {
    .left {
      max-width: 55%;
    }
  }
`;