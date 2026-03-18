// src/components/writing/Task3DiscussionEditor.jsx
import { useMemo } from "react";
import styled from "styled-components";

function wordCount(text) {
  const t = String(text ?? "").trim();
  if (!t) return 0;
  return t.split(/\s+/).filter(Boolean).length;
}

function splitPrompt(raw) {
  const s = String(raw ?? "").trim();
  if (!s) return { profName: "Professor", profText: "" };

  // supports:
  // "Professor Chen:\n...."
  // "Professor Chen:\n\n...."
  const m = s.match(/^\s*Professor\s+([^\n:]+)\s*:\s*\n([\s\S]*)$/i);
  if (m) {
    const name = `Professor ${String(m[1]).trim()}`;
    const text = String(m[2]).trim();
    return { profName: name, profText: text };
  }

  // fallback: no explicit "Professor X:"
  return { profName: "Professor", profText: s };
}

export default function Task3DiscussionEditor({
  prompt,
  students = [],
  minWords = 80,
  recommendedWords = "80–120",
  value,
  onChange,
}) {
  const body = value?.body ?? "";
  const wc = useMemo(() => wordCount(body), [body]);
  const ok = wc >= (Number(minWords) || 0);

  const { profName, profText } = useMemo(() => splitPrompt(prompt), [prompt]);

  // TOEFL 화면처럼 "학생 2명"이 기본이라, 혹시 2명보다 많아도 상단엔 2명만 보여주고
  // 나머지는 아래로 추가 렌더링해도 되지만, 지금은 가장 시험형에 맞게 2명만 사용.
  const topStudents = students.slice(0, 2);

  return (
    <Wrap>
      {/* ===== TOP: Professor (left) + Students (right) ===== */}
      <TopGrid>
        <ProfCard>
          <LabelRow>
            <RoleTag>Professor</RoleTag>
            <Name>{profName}</Name>
          </LabelRow>

          <Bubble>
            <Text>{profText || "—"}</Text>
          </Bubble>

          <Hint>
            In your response, state and support your opinion.
          </Hint>
        </ProfCard>

        <StuCol>
          {topStudents.map((s, idx) => (
            <StuCard key={`${s?.name ?? "student"}_${idx}`}>
              <LabelRow>
                <RoleTag data-variant="student">Student</RoleTag>
                <Name>{s?.name || `Student ${idx + 1}`}</Name>
              </LabelRow>

              <Bubble data-variant="student">
                <Text>{s?.text || "—"}</Text>
              </Bubble>
            </StuCard>
          ))}
        </StuCol>
      </TopGrid>

      {/* ===== BOTTOM: Response editor ===== */}
      <EditorCard>
        <EditorTop>
          <EditorTitle>Your Response</EditorTitle>

          <RightMeta>
            <MetaPill>
              Recommended <b>{recommendedWords}</b>
            </MetaPill>
            <Count data-ok={ok ? "1" : "0"}>
              Word Count: <b>{wc}</b>
            </Count>
          </RightMeta>
        </EditorTop>

        <TextArea
          value={body}
          onChange={(e) => onChange({ body: e.target.value })}
          placeholder={
            "Write your response here...\n\nChecklist:\n- State your opinion clearly\n- Refer to at least one student\n- Add your own reasoning or example"
          }
          spellCheck={false}
        />
      </EditorCard>
    </Wrap>
  );
}

/* ================= styles ================= */

const Wrap = styled.div`
  display: grid;
  gap: 14px;
`;

const TopGrid = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 14px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const CardBase = styled.section`
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 16px;
  padding: 14px;
`;

const ProfCard = styled(CardBase)``;

const StuCol = styled.div`
  display: grid;
  gap: 12px;
`;

const StuCard = styled(CardBase)``;

const LabelRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  min-width: 0;
`;

const RoleTag = styled.div`
  height: 26px;
  padding: 0 10px;
  border-radius: 999px;
  background: rgba(42, 132, 255, 0.08);
  border: 1px solid rgba(42, 132, 255, 0.18);
  color: #2a84ff;
  font-size: 12px;
  font-weight: 900;
  display: inline-flex;
  align-items: center;

  &[data-variant="student"] {
    background: rgba(15, 23, 42, 0.04);
    border-color: rgba(15, 23, 42, 0.08);
    color: rgba(15, 23, 42, 0.7);
  }
`;

const Name = styled.div`
  font-size: 13px;
  font-weight: 900;
  color: #0f172a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Bubble = styled.div`
  border-radius: 14px;
  padding: 12px;
  background: rgba(42, 132, 255, 0.06);
  border: 1px solid rgba(42, 132, 255, 0.12);

  &[data-variant="student"] {
    background: rgba(15, 23, 42, 0.03);
    border-color: rgba(15, 23, 42, 0.07);
  }
`;

const Text = styled.div`
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 13px;
  line-height: 1.6;
  color: rgba(15, 23, 42, 0.82);
  font-weight: 700;
`;

const Hint = styled.div`
  margin-top: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.04);
  border: 1px solid rgba(15, 23, 42, 0.06);
  color: rgba(15, 23, 42, 0.7);
  font-size: 12px;
  font-weight: 900;
`;

/* ===== editor ===== */

const EditorCard = styled.section`
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 16px;
  padding: 14px;
`;

const EditorTop = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;

  @media (max-width: 520px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const EditorTitle = styled.div`
  font-size: 14px;
  font-weight: 900;
  color: #0f172a;
`;

const RightMeta = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const MetaPill = styled.div`
  height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  border: 1px solid rgba(15, 23, 42, 0.1);
  background: rgba(15, 23, 42, 0.03);
  color: rgba(15, 23, 42, 0.62);
  font-size: 12px;
  font-weight: 900;

  b {
    color: #0f172a;
  }
`;

const Count = styled.div`
  height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  background: #ffffff;
  color: rgba(15, 23, 42, 0.62);
  font-size: 12px;
  font-weight: 900;
  display: inline-flex;
  align-items: center;

  b {
    color: #0f172a;
  }

  &[data-ok="1"] {
    border-color: rgba(16, 185, 129, 0.28);
    color: #10b981;

    b {
      color: #10b981;
    }
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 260px;
  resize: vertical;
  border-radius: 14px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  padding: 12px;
  font-size: 14px;
  line-height: 1.65;
  outline: none;
  color: rgba(15, 23, 42, 0.86);

  &:focus {
    border-color: rgba(42, 132, 255, 0.55);
    box-shadow: 0 0 0 4px rgba(42, 132, 255, 0.12);
  }
`;