import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

export default function AdminWriting() {
  const [data, setData] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    fetch("/.netlify/functions/get-writing")
      .then((res) => res.json())
      .then(setData);
  }, []);

  return (
    <Container>
      <Title>✍️ Writing Reports</Title>

      {data.map((item) => (
        <Card key={item.id} onClick={() => nav(`/admin-writing/${item.id}`)}>
          <Name>{item.studentName}</Name>
          <Code>학생코드: {item.studentCode}</Code>
          <Meta>{item.report?.title || item.mockId}</Meta>
          <Meta>{new Date(item.submittedAt).toLocaleString()}</Meta>
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
  cursor: pointer;
  background: #fff;

  &:hover {
    background: #f8fafc;
  }
`;

const Name = styled.h3`
  margin-bottom: 8px;
`;

const Code = styled.p`
  margin-bottom: 6px;
  color: #666;
`;

const Meta = styled.p`
  margin: 0;
  color: #888;
  font-size: 14px;
`;