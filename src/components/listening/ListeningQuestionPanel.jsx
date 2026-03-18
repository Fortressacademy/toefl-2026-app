import styled from "styled-components";

export default function ListeningQuestionPanel({
  itemType,
  title,
  options,
  picked,
  onPick,
  canAnswer,
}) {
  const labels = ["A", "B", "C", "D"];

  return (
    <Wrap>
      <QuestionTitle>{title}</QuestionTitle>

      <OptionStack>
        {labels.map((ch) => (
          <OptionCard
            key={ch}
            type="button"
            $picked={picked === ch}
            onClick={() => onPick?.(ch)}
            disabled={!canAnswer}
          >
            <OptionBadge>{ch}</OptionBadge>
            <div>{options?.[ch] || ""}</div>
          </OptionCard>
        ))}
      </OptionStack>
    </Wrap>
  );
}

const Wrap = styled.div`
  margin-top: 22px;
  display: grid;
  gap: 16px;
`;

const QuestionTitle = styled.h2`
  margin: 0;
  font-size: 38px;
  line-height: 1.2;
  color: #111;
  font-weight: 1000;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const OptionStack = styled.div`
  display: grid;
  gap: 14px;
`;

const OptionCard = styled.button`
  width: 100%;
  text-align: left;
  border: 1.5px solid ${({ $picked }) => ($picked ? "#1e5eff" : "#d6d6d6")};
  background: ${({ $picked }) => ($picked ? "rgba(30,94,255,.06)" : "#fff")};
  border-radius: 16px;
  padding: 18px 18px;
  cursor: pointer;
  display: grid;
  grid-template-columns: 46px 1fr;
  gap: 16px;
  align-items: start;
  color: #111;
  font-size: 18px;
  line-height: 1.6;
  font-weight: 500;

  &:disabled {
    opacity: 0.58;
    cursor: not-allowed;
  }
`;

const OptionBadge = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: #f2f4f8;
  color: #111;
  font-size: 16px;
  font-weight: 1000;
  border: 1px solid #dbdbdb;
`;