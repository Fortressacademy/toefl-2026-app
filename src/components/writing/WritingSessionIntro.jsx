// src/components/writing/WritingSessionIntro.jsx
import styled from "styled-components";

export default function WritingSessionIntro({ step = 0, onNext, onSkip }) {
  // 0~3 = 4장
  return (
    <Wrap>
      <Card>
        {step === 0 && (
          <>
            <Title>Writing section</Title>
            <Desc>
              In the Writing section, you will answer 12 questions to demonstrate how well
              you can write English. There are three types of tasks.
            </Desc>

            <Table>
              <thead>
                <tr>
                  <th>Type of Task</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Build a Sentence</td>
                  <td>Create a grammatical sentence.</td>
                </tr>
                <tr>
                  <td>Write an Email</td>
                  <td>Write an email using information provided.</td>
                </tr>
                <tr>
                  <td>Write for an Academic Discussion</td>
                  <td>Participate in an online discussion.</td>
                </tr>
              </tbody>
            </Table>
          </>
        )}

        {step === 1 && (
          <>
            <Title>Build a Sentence</Title>
            <Desc>Move the words in the boxes to create grammatical sentences.</Desc>
            <Desc2>A clock will show you how much time you have to complete this task.</Desc2>
          </>
        )}

        {step === 2 && (
          <>
            <Title>Write an Email</Title>
            <Desc>You will read some information and use the information to write an email.</Desc>
            <Desc2>You will have 7 minutes to write the email.</Desc2>
          </>
        )}

        {step === 3 && (
          <>
            <Title>Write for an Academic Discussion</Title>
            <Desc>
              A professor has posted a question about a topic and students have responded
              with their thoughts and ideas. Make a contribution to the discussion.
            </Desc>
            <Desc2>You will have 10 minutes to write.</Desc2>
          </>
        )}

        <Btns>
          <Ghost type="button" onClick={onSkip}>
            Skip
          </Ghost>
          <Primary type="button" onClick={onNext}>
            {step < 3 ? "Continue" : "Start"}
          </Primary>
        </Btns>
      </Card>
    </Wrap>
  );
}

const Wrap = styled.div`
  width: 100%;
  max-width: 980px;
  margin: 0 auto;
  padding: 18px 0 0;
`;

const Card = styled.div`
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 18px;
  padding: 22px;
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.06);

  @media (max-width: 640px) {
    padding: 16px 14px;
    border-radius: 16px;
  }
`;

const Title = styled.h1`
  margin: 0 0 14px;
  font-size: 34px;
  letter-spacing: -0.02em;
  color: #0f172a;
  font-weight: 900;

  @media (max-width: 640px) {
    font-size: 26px;
  }
`;

const Desc = styled.p`
  margin: 0 0 14px;
  color: rgba(15, 23, 42, 0.72);
  font-size: 15px;
  line-height: 1.55;
`;

const Desc2 = styled.p`
  margin: 0;
  color: rgba(15, 23, 42, 0.72);
  font-size: 15px;
  line-height: 1.55;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;

  th,
  td {
    border-top: 1px solid rgba(15, 23, 42, 0.12);
    padding: 14px 12px;
    text-align: left;
    vertical-align: top;
    font-size: 14px;
  }

  thead th {
    background: rgba(15, 23, 42, 0.04);
    font-weight: 900;
    color: rgba(15, 23, 42, 0.78);
  }

  tbody td:first-child {
    width: 42%;
    font-weight: 800;
    color: rgba(15, 23, 42, 0.78);
  }

  tbody td:last-child {
    color: rgba(15, 23, 42, 0.65);
  }
`;

const Btns = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 18px;
`;

const BtnBase = styled.button`
  height: 42px;
  padding: 0 14px;
  border-radius: 14px;
  font-weight: 900;
  cursor: pointer;
  border: none;

  &:active {
    transform: translateY(1px);
  }
`;

const Ghost = styled(BtnBase)`
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.12);
  color: rgba(15, 23, 42, 0.8);
`;

const Primary = styled(BtnBase)`
  background: #2a84ff;
  color: #ffffff;
  box-shadow: 0 12px 24px rgba(42, 132, 255, 0.22);
`;