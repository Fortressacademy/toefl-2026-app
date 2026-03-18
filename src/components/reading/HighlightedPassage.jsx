import { useMemo } from "react";
import styled from "styled-components";

/**
 * text: 전체 지문 문자열
 * highlight:
 *   - { query: "nuanced", mode: "word" | "phrase", paragraph?: number }
 *   - (호환) { word: "nuanced" } 도 지원
 *
 * insertion:
 *  - enabled: true/false
 *  - selectedIndex: 0~3
 *  - onSelectIndex: (idx)=>void
 *  - previewSentence: 선택된 자리 옆 미리보기 문장
 */
export default function HighlightedPassage({ text, highlight, insertion }) {
  const raw = useMemo(() => String(text ?? ""), [text]);

  // 문단 유지
  const paragraphs = useMemo(() => raw.split("\n\n"), [raw]);

  // highlight 정규화 (✅ query / word 모두 지원)
  const hl = useMemo(() => normalizeHighlight(highlight), [highlight]);

  // ✅ insertion 네모 4개 위치: "문장 끝" 기준 4슬롯
  // ✅ insertion 네모 4개 위치: 1) [■]가 있으면 그걸 슬롯으로, 2) 없으면 문장 끝 fallback
const sentenceSlots = useMemo(() => {
  if (!insertion?.enabled) return null;

  // 1) ✅ 지문에 [■]가 있으면 그 위치를 그대로 슬롯으로 사용
  if (raw.includes("[■]")) {
    const re = /\[■\]/g;
    const out = [];
    let last = 0;
    let m;
    let slotCount = 0;

    while ((m = re.exec(raw)) !== null) {
      const start = m.index;
      const end = start + m[0].length;

      if (start > last) out.push({ t: "text", v: raw.slice(last, start) });

      // 슬롯은 최대 4개까지만 클릭 가능
      if (slotCount < 4) {
        out.push({ t: "slot", idx: slotCount });
        slotCount += 1;
      } else {
        // 4개 초과면 그냥 텍스트로 남김
        out.push({ t: "text", v: "[■]" });
      }

      last = end;
    }

    if (last < raw.length) out.push({ t: "text", v: raw.slice(last) });

    return out;
  }

  // 2) fallback: [■]가 없으면 문장 끝 기준으로 4 슬롯 생성 (기존 로직 유지)
  const parts = raw.split(/(?<=[.!?])\s+(?=[A-Z])/g);

  const out = [];
  let slotCount = 0;

  for (let i = 0; i < parts.length; i++) {
    out.push({ t: "text", v: parts[i] });

    if (slotCount < 4) {
      out.push({ t: "slot", idx: slotCount });
      slotCount += 1;
    }

    if (i !== parts.length - 1) out.push({ t: "text", v: " " });
  }
  return out;
}, [raw, insertion?.enabled]);

  // ✅ 일반(비 insertion): 문단 단위로 렌더 + paragraph 제한 지원
  if (!insertion?.enabled) {
    return (
      <Passage>
        {paragraphs.map((p, idx) => (
          <P key={idx}>{renderHighlighted(p, hl, idx)}</P>
        ))}
      </Passage>
    );
  }

  // ✅ insertion enabled: 문장/슬롯 단위 렌더 + 하이라이트 유지
  return (
    <Passage>
      <Inline>
        {sentenceSlots?.map((node, i) => {
          if (node.t === "text") {
            // insertion 모드에서는 문장단위라 paragraph 제한 정확히 어렵
            // → paragraph 지정이 있으면 전체 하이라이트로 동작
            const hl2 = hl?.paragraph != null ? { ...hl, paragraph: null } : hl;
            return <span key={i}>{renderHighlighted(node.v, hl2, null)}</span>;
          }

          const active = insertion?.selectedIndex === node.idx;

          return (
            <SlotBtn
              key={i}
              type="button"
              $active={active}
              aria-label={`Insertion slot ${node.idx + 1}`}
              onClick={() => insertion?.onSelectIndex?.(node.idx)}
              title={`Location ${node.idx + 1}`}
            >
              <Sq aria-hidden>■</Sq>
              {active && insertion?.previewSentence ? (
                <Preview>{insertion.previewSentence}</Preview>
              ) : null}
            </SlotBtn>
          );
        })}
      </Inline>
    </Passage>
  );
}

/* ---------------- highlight helper ---------------- */

function normalizeHighlight(h) {
  if (!h) return null;

  // { query, mode, paragraph } 또는 { word } 호환
  const query = h.query ?? h.word ?? h.text ?? null;
  if (!query) return null;

  const mode = String(h.mode ?? "word").toLowerCase();
  const paragraph =
    h.paragraph == null
      ? null
      : Number.isFinite(Number(h.paragraph))
      ? Number(h.paragraph)
      : null;

  return { query: String(query), mode, paragraph };
}

/**
 * chunk: 문자열
 * hl: { query, mode, paragraph }
 * paraIdx: 현재 문단 index (비-insertion일 때만 의미있음)
 */
function renderHighlighted(chunk, hl, paraIdx) {
  const s = String(chunk ?? "");
  if (!hl) return s;

  // paragraph 제한이 있으면 해당 문단에서만
  if (hl.paragraph != null && paraIdx != null && paraIdx !== hl.paragraph) return s;

  const q = hl.query;

  if (hl.mode === "phrase") {
    const re = new RegExp(`(${escapeRegExp(q)})`, "gi");
    const parts = s.split(re);
    return parts.map((p, idx) =>
      p.toLowerCase() === q.toLowerCase() ? <Mark key={idx}>{p}</Mark> : <span key={idx}>{p}</span>
    );
  }

  // word
  const re = new RegExp(`\\b(${escapeRegExp(q)})\\b`, "gi");
  const parts = s.split(re);

  return parts.map((p, idx) =>
    p.toLowerCase() === q.toLowerCase() ? <Mark key={idx}>{p}</Mark> : <span key={idx}>{p}</span>
  );
}

function escapeRegExp(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/* ---------------- styles (ETS-like) ---------------- */

const Passage = styled.div`
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 450;                 /* ✅ 400 → 450(없으면 400으로 fallback) */
  color: rgba(17, 24, 39, 0.98);     /* ✅ 0.92 → 0.98 (제일 체감 큼) */

  font-size: 16.5px;
  line-height: 1.72;
  letter-spacing: 0;

  /* ✅ “얇아 보임” 해결 핵심 트릭 (실제로 더 굵게 보여줌) */
  text-shadow: 0 0 0.35px rgba(17, 24, 39, 0.55);

  /* ✅ 렌더링 선명/두께감 */
  text-rendering: geometricPrecision;
  -webkit-font-smoothing: subpixel-antialiased;
  -moz-osx-font-smoothing: auto;

  white-space: pre-wrap;
  max-width: 72ch;
  padding: 6px 8px;

  @media (max-width: 520px) {
    max-width: 100%;
    font-size: 16px;
    line-height: 1.68;
    padding: 4px 4px;

    /* 모바일에서 더 얇아 보이니까 살짝만 더 */
    text-shadow: 0 0 0.45px rgba(17, 24, 39, 0.6);
  }
`;

const P = styled.p`
  margin: 0 0 12px;
  &:last-child {
    margin-bottom: 0;
  }
`;

const Inline = styled.div`
  white-space: pre-wrap;
`;

const Mark = styled.span`
  background: rgba(255, 214, 102, 0.78); /* 0.65 → 0.78 */
  border-radius: 3px;
  padding: 0 2px;
  font-weight: 450;
`;

/* ✅ insertion slot: 작고 단정하게 */
const SlotBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;

  margin: 0 6px;
  padding: 1px 6px;

  border-radius: 6px;
  border: 1px solid rgba(17, 24, 39, 0.18);
  background: ${(p) => (p.$active ? "rgba(59,130,246,0.12)" : "#fff")};

  cursor: pointer;
  font-weight: 700;
  font-family: Arial, Helvetica, sans-serif;
  color: rgba(17, 24, 39, 0.9);

  &:hover {
    background: ${(p) => (p.$active ? "rgba(59,130,246,0.14)" : "rgba(17,24,39,0.03)")};
  }

  &:active {
    transform: translateY(1px);
  }
`;

const Sq = styled.span`
  font-size: 12px;
  line-height: 1;
`;

const Preview = styled.span`
  display: inline-block;

  background: rgba(255, 214, 102, 0.38);
  border: 1px solid rgba(17, 24, 39, 0.12);

  padding: 2px 8px;
  border-radius: 999px;

  font-weight: 600;
  font-size: 12.5px;
  line-height: 1.25;

  color: rgba(17, 24, 39, 0.88);

  @media (max-width: 520px) {
    font-size: 12px;
  }
`;