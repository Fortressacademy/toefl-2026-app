import styled from "styled-components";

export default function NoticeDoc({ doc }) {
  return (
    <Card>
      <Header>
        <Badge>NOTICE</Badge>
        <Title>{doc.title}</Title>
        {doc.date ? <Sub>{doc.date}</Sub> : null}
      </Header>

      <Body>
        {doc.body.split("\n").map((line, i) => <p key={i}>{line || "\u00A0"}</p>)}
      </Body>
    </Card>
  );
}

const Card = styled.div`
  border: 2px solid rgba(0,0,0,0.18);
  border-radius: 18px;
  padding: 14px;
`;

const Header = styled.div`
  padding: 6px 6px 10px;
  border-bottom: 1px solid rgba(0,0,0,0.10);
`;

const Badge = styled.div`
  display: inline-flex;
  padding: 4px 10px;
  border-radius: 999px;
  background: #eef3ff;
  border: 1px solid rgba(0,0,0,0.10);
  font-weight: 950;        /* 950 -> 700 */
  font-size: 12px;
  letter-spacing: 0.12em;  /* 0.4px -> ETS 느낌으로(선택) */
`;

const Title = styled.div`
  margin-top: 8px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 800;     /* 950 -> 700 */
  font-size: 20px;
  line-height: 1.25;    /* 핵심: 줄간격 압축 */
  letter-spacing: 0;    /* 혹시라도 기본 자간 들어가면 제거 */
`;

const Sub = styled.div`
  margin-top: 4px;
  opacity: 0.7;
  font-weight: 800;
  font-size: 13px;
`;

const Body = styled.div`
  padding: 12px 6px 6px;
  line-height: 1.65;
  font-size: 15px;
  p { margin: 0 0 10px; }
`;