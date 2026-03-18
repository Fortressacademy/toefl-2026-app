// src/components/reading/QuestionPanel.jsx
import styled from "styled-components";

function isInsertion(q) {
  const t = String(q?.type || "").toLowerCase();
  return t === "insertion" || t === "insert";
}

function getInsertSentence(q) {
  return q?.insertSentence || q?.sentence || q?.insertionSentence || q?.toInsert || "";
}

function stripSmartQuotes(s) {
  return String(s || "")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'");
}

export default function QuestionPanel({
  docType,
  docTitle,
  docIndex,
  docTotal,
  qIndex,
  qTotal,
  question,
  picked,
  onPick,
  onPrev,
  onNext,
  canPrev,
  canNext,
  nextLabel,
}) {
  const insertion = isInsertion(question);
  const insertSentence = insertion ? stripSmartQuotes(getInsertSentence(question)) : "";

  return (
    <Wrap>
      <Header>
        <div className="kicker">QUESTIONS</div>
        <div className="meta">
          <span className="badge">{(docType || "doc").toUpperCase()}</span>
          <span className="title">{docTitle}</span>
        </div>
        <div className="progress">
          Set <b>{docIndex}</b> / {docTotal} · Q <b>{qIndex}</b> / {qTotal}
        </div>
      </Header>

      <Body>
        {!question ? (
          <Empty>문제가 없습니다.</Empty>
        ) : (
          <>
            {/* ✅ insertion: 가독성 최적 분해 레이아웃 */}
            {insertion ? (
              <QBlock>
                <RowTop>
                  <span className="no">Q{question.qNo}.</span>
                  <TypePill>INSERT SENTENCE</TypePill>
                </RowTop>

                <Stem>
                  Look at the four squares <b>[■]</b> in the passage.
                </Stem>

                <MainQ>Where would the following sentence best fit?</MainQ>

                <InsertBox aria-label="Sentence to insert">
                  <QuoteMark aria-hidden>“</QuoteMark>
                  <span className="text">{insertSentence}</span>
                  <QuoteMark aria-hidden>”</QuoteMark>
                </InsertBox>
              </QBlock>
            ) : (
              /* ✅ 일반 문제 */
              <QText>
                <span className="no">Q{question.qNo}.</span> {question.question}
              </QText>
            )}

            <Choices>
              {Object.entries(question.options || {}).map(([key, label]) => (
                <ChoiceBtn
                  key={key}
                  type="button"
                  onClick={() => onPick?.(key)}
                  data-active={picked === key ? "1" : "0"}
                >
                  <span className="key">{key}</span>
                  <span className="label">{label}</span>
                </ChoiceBtn>
              ))}
            </Choices>
          </>
        )}
      </Body>

      <Footer>
        <Nav type="button" onClick={onPrev} disabled={!canPrev}>
          Prev
        </Nav>
        <NavPrimary type="button" onClick={onNext} disabled={!canNext}>
          {nextLabel}
        </NavPrimary>
      </Footer>
    </Wrap>
  );
}

const Wrap = styled.div`
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 520px;
`;

const Header = styled.div`
  padding: 14px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  background: linear-gradient(180deg, #fafbfc, #f3f6f9);

  .kicker {
    font-weight: 950;
    letter-spacing: 0.6px;
    font-size: 12px;
    opacity: 0.75;
  }

  .meta {
    margin-top: 8px;
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .badge {
    font-weight: 950;
    font-size: 12px;
    padding: 4px 10px;
    border-radius: 999px;
    border: 1px solid rgba(0, 0, 0, 0.14);
    background: #fff;
  }

  .title {
    font-weight: 950;
    font-size: 16px;
    letter-spacing: -0.2px;
  }

  .progress {
    margin-top: 8px;
    font-weight: 800;
    opacity: 0.7;
  }
`;

const Body = styled.div`
  padding: 14px;
`;

const QBlock = styled.div`
  padding: 12px 12px 10px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 16px;
  background: #fff;
`;

const RowTop = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  .no {
    font-size: 15px;
    font-weight: 950;
    opacity: 0.72;
  }
`;

const TypePill = styled.span`
  font-size: 11px;
  font-weight: 950;
  letter-spacing: 0.5px;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid rgba(0, 0, 0, 0.14);
  background: #f6f7f9;
  opacity: 0.9;
`;

const Stem = styled.div`
  margin-top: 10px;
  font-size: 14px;
  line-height: 1.55;
  color: rgba(17, 24, 39, 0.72);
  font-weight: 800;

  b {
    color: rgba(17, 24, 39, 0.9);
  }
`;

const MainQ = styled.div`
  margin-top: 10px;
  font-size: 17px;
  font-weight: 950;
  line-height: 1.6;
  letter-spacing: -0.15px;
`;

const InsertBox = styled.div`
  margin-top: 12px;
  background: rgba(255, 214, 102, 0.2);
  border: 1px solid rgba(255, 214, 102, 0.65);
  padding: 14px 14px;
  border-radius: 14px;
  line-height: 1.7;

  display: flex;
  gap: 8px;
  align-items: flex-start;

  .text {
    font-weight: 850;
    opacity: 0.96;
  }
`;

const QuoteMark = styled.span`
  font-size: 18px;
  font-weight: 950;
  opacity: 0.65;
  line-height: 1;
  margin-top: 2px;
`;

const QText = styled.div`
  font-size: 16px;
  line-height: 1.55;
  font-weight: 900;

  .no {
    opacity: 0.7;
    margin-right: 6px;
  }
`;

const Choices = styled.div`
  margin-top: 12px;
  display: grid;
  gap: 10px;
`;

const ChoiceBtn = styled.button`
  width: 100%;
  text-align: left;
  border-radius: 14px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  background: #fff;
  padding: 12px;
  cursor: pointer;
  display: grid;
  grid-template-columns: 34px 1fr;
  gap: 10px;
  align-items: start;

  .key {
    width: 28px;
    height: 28px;
    border-radius: 10px;
    display: grid;
    place-items: center;
    font-weight: 950;
    border: 1px solid rgba(0, 0, 0, 0.14);
    background: #f6f7f9;
  }

  .label {
    font-weight: 800;
    line-height: 1.55;
    opacity: 0.92;
  }

  &[data-active="1"] {
    border-color: rgba(0, 0, 0, 0.45);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(1px);
  }
`;

const Footer = styled.div`
  padding: 12px 14px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  gap: 10px;
  background: #fafbfc;
`;

const Nav = styled.button`
  height: 38px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.14);
  background: #fff;
  cursor: pointer;
  font-weight: 950;

  &:disabled {
    opacity: 0.45;
    cursor: default;
  }
`;

const NavPrimary = styled(Nav)`
  background: #111;
  color: #fff;
  border-color: #111;
`;

const Empty = styled.div`
  opacity: 0.7;
  padding: 8px;
  font-weight: 800;
`;