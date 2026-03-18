import { useEffect, useState } from "react";
import styled from "styled-components";

export default function AdminWriting() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/.netlify/functions/get-writing")
      .then((res) => res.json())
      .then(setData);
  }, []);

  return (
    <Container>
      <Title>✍️ Writing Submissions</Title>

      {data.map((item) => (
        <Card key={item.id}>
          <Name>{item.name}</Name>
          <Answer>{item.answer}</Answer>
        </Card>
      ))}
    </Container>
  );
}

const Container = styled.div`
  padding: 40px;
`;

const Title = styled.h1`
  margin-bottom: 20px;
`;

const Card = styled.div`
  border: 1px solid #ddd;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 12px;
`;

const Name = styled.h3`
  margin-bottom: 10px;
`;

const Answer = styled.p`
  white-space: pre-wrap;
`;