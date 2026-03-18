import styled from "styled-components";

function getHint(item) {
  const parts = Array.isArray(item?.parts) ? item.parts : [];
  const textPart = parts.find((p) => p?.t === "text" && String(p?.v || "").trim());
  return textPart ? String(textPart.v).trim() : "";
}

function getWordBank(item) {
  return Array.isArray(item?.wordBank) ? item.wordBank : [];
}

export default function Task1ExamLike({
  item,
  value,
  onChange,
  onPrev,
  onNext,
  disablePrev,
}) {
  if (!item) return null;

  const hint = getHint(item);
  const bank = getWordBank(item);

  return (
    <Stage>
      <TopBar>
        <Brand>TOEFL iBT</Brand>
        <Actions>
          <MiniBtn type="button" onClick={onPrev} disabled={disablePrev}>
            Back
          </MiniBtn>
          <MiniBtn type="button" onClick={onNext}>
            Next
          </MiniBtn>
        </Actions>
      </TopBar>

      <Body>
        <Title>Make an appropriate sentence.</Title>

        <Dialogue>
          <Row>
            <Avatar>A</Avatar>
            <LineText>{item.promptTop}</LineText>
          </Row>

          <Row>
            <Avatar>B</Avatar>

            <AnswerBlock>
              {!!hint && <Hint>{hint}</Hint>}

              <AnswerInput
                value={value || ""}
                onChange={(e) => onChange(item.no, e.target.value)}
                placeholder=""
              />

              <QuestionMark>?</QuestionMark>
            </AnswerBlock>
          </Row>
        </Dialogue>

        <WordBank>{bank.join(" / ")}</WordBank>
      </Body>
    </Stage>
  );
}

const Stage = styled.div`
  max-width: 760px;
  margin: 26px auto;
  border: 1px solid #bfc5cc;
  background: #fff;
`;

const TopBar = styled.div`
  height: 42px;
  background: #8b9199;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px;
`;

const Brand = styled.div`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.02em;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
`;

const MiniBtn = styled.button`
  height: 24px;
  min-width: 46px;
  padding: 0 10px;
  border: 1px solid rgba(255,255,255,0.55);
  background: #777d86;
  color: #fff;
  font-size: 11px;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Body = styled.div`
  padding: 34px 40px 38px;
`;

const Title = styled.div`
  text-align: center;
  font-size: 18px;
  font-weight: 700;
  color: #222;
  margin-bottom: 36px;
`;

const Dialogue = styled.div`
  display: grid;
  gap: 18px;
  margin-bottom: 26px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 38px 1fr;
  gap: 14px;
  align-items: start;
`;

const Avatar = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #c9ced4;
  color: #333;
  display: grid;
  place-items: center;
  font-size: 12px;
  font-weight: 700;
`;

const LineText = styled.div`
  font-size: 16px;
  line-height: 1.6;
  color: #222;
`;

const AnswerBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Hint = styled.div`
  font-size: 16px;
  color: #222;
  margin-bottom: 6px;
  min-height: 24px;
`;

const AnswerInput = styled.input`
  width: 100%;
  border: none;
  border-bottom: 2px solid #666;
  outline: none;
  font-size: 16px;
  line-height: 1.5;
  padding: 4px 2px 6px;
  background: transparent;
`;

const QuestionMark = styled.div`
  margin-top: 8px;
  font-size: 18px;
  color: #222;
`;

const WordBank = styled.div`
  margin-top: 18px;
  font-size: 15px;
  color: #222;
  text-align: left;
  line-height: 1.7;
`;
