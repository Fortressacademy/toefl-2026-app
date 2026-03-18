// src/components/reading/EmailDoc.jsx
import styled from "styled-components";
import HighlightedPassage from "./HighlightedPassage"; 

const splitNameEmail = (s = "") => {
  const m = String(s).match(/^(.*?)(<[^>]+>)\s*$/);
  if (!m) return { name: String(s), email: "" };
  return { name: m[1].trim(), email: m[2].trim() };
};


export default function EmailDoc({ doc, highlight, insertion }) { // ✅ props 추가
  const to = splitNameEmail(doc?.to);
  const from = splitNameEmail(doc?.from);


  return (
    <Wrap>
      <MetaGrid>
        <Row>
          <Key>To</Key>
          <Val>
            {to.name}
            {to.email ? <EmailLine>{to.email}</EmailLine> : null}
          </Val>
        </Row>

        <Row>
          <Key>From</Key>
          <Val>
            {from.name}
            {from.email ? <EmailLine>{from.email}</EmailLine> : null}
          </Val>
        </Row>

        <Row>
          <Key>Date</Key>
          <Val>{doc?.date}</Val>
        </Row>

        <Row>
          <Key>Subject</Key>
          <Val>{doc?.subject}</Val>
        </Row>
      </MetaGrid>

      <Divider />

      <Content>
        <HighlightedPassage
          text={doc?.body}
          highlight={highlight}      // ✅ 여기!
          insertion={insertion}      // ✅ (문장삽입 모드도 쓰면 같이)
        />
      </Content>
    </Wrap>
  );
}

const Wrap = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.14);
  border-radius: 14px;
  overflow: hidden;
`;

const MetaGrid = styled.div`
  background: #fbfcfe;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 88px minmax(0, 1fr);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);

  @media (max-width: 520px) {
    grid-template-columns: 72px minmax(0, 1fr);
  }
`;

const Key = styled.div`
  padding: 10px 12px;
  font-weight: 900;
  opacity: 0.7;
  background: #f3f6f9;

  @media (max-width: 520px) {
    padding: 9px 10px;
    font-size: 12px;
  }
`;

const Val = styled.div`
  padding: 10px 12px;
  font-weight: 850;

  /* ✅ 핵심: 모바일에서 긴 이름/이메일 줄바꿈 */
  min-width: 0;
  white-space: normal;
  overflow-wrap: anywhere;
  word-break: break-word;

  @media (max-width: 520px) {
    padding: 9px 10px;
    font-size: 13px;
    line-height: 1.3;
  }
`;

const EmailLine = styled.div`
  opacity: 0.82;
  font-weight: 850;
  margin-top: 2px;
  overflow-wrap: anywhere;
  word-break: break-word;
`;

const Divider = styled.div`
  height: 1px;
  background: rgba(0, 0, 0, 0.1);
`;
const Content = styled.div`
  padding: 10px 12px 12px;

  /* ✅ DocFrame(ETS) 스타일 상속 */
  font: inherit;
  color: inherit;
  letter-spacing: inherit;
  line-height: inherit;

  p {
    margin: 0 0 12px;
  }

  @media (max-width: 520px) {
    padding: 8px 10px 10px;
  }
`;