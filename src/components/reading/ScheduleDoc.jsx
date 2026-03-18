// src/components/reading/ScheduleDoc.jsx
import styled from "styled-components";

export default function ScheduleDoc({ doc }) {
  return (
    <Wrap>
      <Top>
        <h3>{doc.title}</h3>
        {doc.subtitle ? <p>{doc.subtitle}</p> : null}
      </Top>

      <Table>
        <thead>
          <tr>
            {doc.columns.map((c) => <th key={c}>{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {doc.rows.map((r, i) => (
            <tr key={i}>
              {r.map((cell, j) => <td key={j}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </Table>

      {doc.note ? <Note>Note: {doc.note}</Note> : null}
    </Wrap>
  );
}

const Wrap = styled.div`
  border: 1px solid rgba(0,0,0,0.14);
  border-radius: 16px;
  overflow: hidden;
`;

const Top = styled.div`
  padding: 12px 14px;
  background: #fbfcfe;
  border-bottom: 1px solid rgba(0,0,0,0.08);

  h3 { margin: 0; font-size: 18px; font-weight: 950; }
  p { margin: 6px 0 0; opacity: 0.75; font-weight: 700; }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;

  th, td {
    border-bottom: 1px solid rgba(0,0,0,0.08);
    padding: 10px 12px;
    vertical-align: top;
  }

  th {
    background: #f3f6f9;
    font-weight: 900;
    text-align: left;
  }

  tr:last-child td { border-bottom: none; }
`;

const Note = styled.div`
  padding: 10px 14px;
  background: #f7f8fa;
  border-top: 1px solid rgba(0,0,0,0.08);
  font-weight: 700;
  opacity: 0.8;
`;