// src/components/writing/Task2EmailEditor.jsx
import { useMemo } from "react";
import styled from "styled-components";

function wordCount(text) {
  const t = String(text ?? "").trim();
  if (!t) return 0;
  return t.split(/\s+/).filter(Boolean).length;
}

export default function Task2EmailEditor({
  // prompt info
  situation = [],
  bullets = [],

  // TOEFL-style header fields (usually provided by the test)
  to = "",                 // e.g., "editor@sunshinepoetrymagazine.com"
  subject = "",            // e.g., "Problem using submission form"

  // internal checks (not shown loudly; keep subtle)
  minWords = 120,
  recommendedWords = "120–180",

  // controlled value
  value,
  onChange,

  // optional: show extra guidance (default false to mimic real test UI)
  showGuidance = false,
}) {
  const body = value?.body ?? "";
  const wc = useMemo(() => wordCount(body), [body]);
  const ok = wc >= (Number(minWords) || 0);

  // In the real TOEFL email task, To/Subject are displayed and body is written.
  // We keep subject in value for saving/report if you want, but UI treats it as provided.
  const displayedTo = String(to ?? "").trim();
  const displayedSubject = String(subject ?? "").trim();

  return (
    <Wrap>
      {/* Directions / Prompt card */}
      <PromptCard>
        <PromptTitle>Write an Email</PromptTitle>
        <PromptSub>
          You will read some information and use the information to write an email.
        </PromptSub>

        {!!situation.length && (
          <>
            <H3>Information</H3>
            <Ul>
              {situation.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </Ul>
          </>
        )}

        {!!bullets.length && (
          <>
            <H3>In your email, do the following:</H3>
            <Ul>
              {bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </Ul>
          </>
        )}

        <Note>
          Write as much as you can and in complete sentences.
        </Note>

        {showGuidance && (
          <Meta>
            <span>
              Recommended: <b>{recommendedWords}</b> words
            </span>
            <span>
              Minimum: <b>{minWords}</b> words
            </span>
          </Meta>
        )}
      </PromptCard>

      {/* Response card */}
      <ResponseCard>
        <ResponseTop>
          <ResponseTitle>Your Response:</ResponseTitle>
          <WordPill data-ok={ok ? "1" : "0"}>
            {wc} words {ok ? "✓" : ""}
          </WordPill>
        </ResponseTop>

        <HeaderLines>
          <HeaderLine>
            <Key>To:</Key>
            <Val title={displayedTo || "—"}>{displayedTo || "—"}</Val>
          </HeaderLine>
          <HeaderLine>
            <Key>Subject:</Key>
            <Val title={displayedSubject || "—"}>{displayedSubject || "—"}</Val>
          </HeaderLine>
        </HeaderLines>

        <Divider />

        <TextArea
          value={body}
          onChange={(e) => onChange({ body: e.target.value })}
          placeholder={"Write your email here..."}
          spellCheck={false}
        />
      </ResponseCard>
    </Wrap>
  );
}

/* ================= styles ================= */

const Wrap = styled.div`
  display: grid;
  gap: 14px;
`;

const PromptCard = styled.section`
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 16px;
  padding: 14px;
`;

const PromptTitle = styled.h2`
  margin: 0;
  font-size: 16px;
  font-weight: 900;
  color: #0f172a;
`;

const PromptSub = styled.div`
  margin-top: 6px;
  color: rgba(15, 23, 42, 0.72);
  font-size: 13px;
  line-height: 1.5;
`;

const H3 = styled.h3`
  margin: 12px 0 6px;
  font-size: 13px;
  font-weight: 900;
  color: #0f172a;
`;

const Ul = styled.ul`
  margin: 0 0 6px 18px;
  color: rgba(15, 23, 42, 0.72);
  font-size: 13px;
  line-height: 1.5;
`;

const Note = styled.div`
  margin-top: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.04);
  border: 1px solid rgba(15, 23, 42, 0.06);
  color: rgba(15, 23, 42, 0.72);
  font-size: 13px;
  font-weight: 800;
`;

const Meta = styled.div`
  margin-top: 10px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  color: rgba(15, 23, 42, 0.6);
  font-size: 12px;

  b {
    color: #0f172a;
  }
`;

const ResponseCard = styled.section`
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 16px;
  padding: 14px;
`;

const ResponseTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const ResponseTitle = styled.div`
  font-size: 14px;
  font-weight: 900;
  color: #0f172a;
`;

const WordPill = styled.div`
  height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  color: rgba(15, 23, 42, 0.6);
  font-size: 12px;
  font-weight: 900;
  display: inline-flex;
  align-items: center;

  &[data-ok="1"] {
    border-color: rgba(16, 185, 129, 0.28);
    color: #10b981;
    background: rgba(16, 185, 129, 0.06);
  }
`;

const HeaderLines = styled.div`
  margin-top: 10px;
  display: grid;
  gap: 8px;
`;

const HeaderLine = styled.div`
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: 10px;
  align-items: center;
`;

const Key = styled.div`
  color: rgba(15, 23, 42, 0.72);
  font-size: 13px;
  font-weight: 900;
`;

const Val = styled.div`
  color: rgba(15, 23, 42, 0.85);
  font-size: 13px;
  font-weight: 800;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Divider = styled.div`
  margin: 12px 0 10px;
  height: 1px;
  background: rgba(15, 23, 42, 0.08);
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 240px;
  resize: vertical;

  border-radius: 12px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  padding: 12px;

  font-size: 14px;
  line-height: 1.6;
  color: rgba(15, 23, 42, 0.86);
  outline: none;

  &:focus {
    border-color: rgba(42, 132, 255, 0.55);
    box-shadow: 0 0 0 4px rgba(42, 132, 255, 0.12);
  }
`;