// src/components/reading/AdsDoc.jsx
import styled from "styled-components";

function cleanBody(text) {
  return String(text ?? "")
    .replace(/\r\n/g, "\n")
    .replace(/^\s+/gm, "")
    .trim();
}

function splitParagraphs(body) {
  const t = cleanBody(body);
  if (!t) return [];
  return t
    .split(/\n\s*\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function pickHighlights(raw) {
  const text = cleanBody(raw);

  // % 할인
  const pct = text.match(/\b(\d{1,2})%\b/);

  // 날짜/마감 (April 30 / May 12 / 30 Apr 등)
  const date1 = text.match(
    /\b(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)(?:\s+\d{1,2})(?:,?\s+\d{4})?\b/i
  );
  const date2 = text.match(
    /\b(\d{1,2})\s*(?:st|nd|rd|th)?\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/i
  );

  // 혜택 키워드
  const freebies = [];
  if (/\bfree\b/i.test(text)) freebies.push("FREE");
  if (/\bcomplimentary\b/i.test(text)) freebies.push("COMPLIMENTARY");
  if (/\bbonus\b/i.test(text)) freebies.push("BONUS");
  if (/\boffer\b/i.test(text)) freebies.push("OFFER");

  // 간단한 프로모 코드 추정 (READSMART 같은 대문자 5~12)
  const promo =
    text.match(/\b[A-Z]{5,12}\b/)?.[0] ||
    text.match(/\b[A-Z0-9]{6,12}\b/)?.[0] ||
    null;

  return {
    pct: pct ? `${pct[1]}%` : null,
    deadline: date1?.[0] || date2?.[0] || null,
    freebies: freebies.slice(0, 3),
    promo,
  };
}

export default function AdsDoc({ doc }) {
  const title =
    doc?.passage?.title || doc?.title || doc?.subject || "Advertisement";
  const body = doc?.passage?.body || doc?.body || "";
  const paragraphs = splitParagraphs(body);

  // optional meta
  const brand = doc?.passage?.brand || doc?.brand || doc?.org || "ActiveCore";
  const ctaText = doc?.passage?.cta || doc?.cta || "Learn More";

  const hl = pickHighlights(body);
  const promoCode = doc?.promoCode || doc?.passage?.promoCode || hl.promo;

  return (
    <Outer>
      <TopStrip aria-hidden="true" />

      <Card>
        <Header>
          <TopRow>
            <BrandPill>
              <Dot />
              <span>{brand}</span>
            </BrandPill>

            <Badges>
              <Badge>ADVERTISEMENT</Badge>
              {hl.deadline ? (
                <MiniPill>Valid until {hl.deadline}</MiniPill>
              ) : null}
            </Badges>
          </TopRow>

          <Headline>{title}</Headline>

          {(hl.pct || hl.freebies?.length) && (
            <Chips>
              {hl.pct ? <BigChip>{hl.pct} OFF</BigChip> : null}
              {hl.freebies?.map((x) => (
                <Chip key={x}>{x}</Chip>
              ))}
            </Chips>
          )}
        </Header>

        <Content>
          {paragraphs.length ? (
            paragraphs.map((p, idx) => (
              <Para key={idx} $first={idx === 0}>
                {p}
              </Para>
            ))
          ) : (
            <Empty>내용이 없습니다.</Empty>
          )}
        </Content>

        {promoCode ? (
          <PromoCard>
            <PromoLeft>
              <PromoLabel>PROMO</PromoLabel>
              <PromoCode>{promoCode}</PromoCode>
              <PromoHint>Use this code where applicable.</PromoHint>
            </PromoLeft>

            <PromoRight>
              <CTAButton type="button">{ctaText}</CTAButton>
              <CTASub>Offer terms may apply.</CTASub>
            </PromoRight>
          </PromoCard>
        ) : null}
      </Card>
    </Outer>
  );
}

/* ================= styles ================= */

const Outer = styled.div`
  padding: 6px 6px 10px;  /* 기존 10~14 → 6px로 축소 */

  @media (max-width: 420px) {
    padding: 0px 0px 4px;  /* 모바일 거의 최소 */
  }
`;

const TopStrip = styled.div`
  height: 10px;
  border-radius: 14px 14px 0 0;
  background: linear-gradient(
    90deg,
    rgba(37, 99, 235, 0.95),
    rgba(56, 189, 248, 0.85)
  );
  margin: 0 2px -8px;
`;

const Card = styled.div`
  border-radius: 18px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  background: #fff;
  overflow: hidden;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
`;

const Header = styled.div`
  padding: 14px 14px 12px;
  background: radial-gradient(
      1200px 260px at 0% 0%,
      rgba(37, 99, 235, 0.18),
      rgba(255, 255, 255, 0)
    ),
    linear-gradient(
      180deg,
      rgba(15, 23, 42, 0.03),
      rgba(255, 255, 255, 0.0)
    );

  @media (max-width: 420px) {
    padding: 10px 8px 8px;  /* 좌우 8px */
  }
`;

const TopRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const BrandPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  font-weight: 950;
  font-size: 12px;

  @media (max-width: 420px) {
    height: 22px;          /* ↓ */
    padding: 0 8px;        /* ↓ */
    font-size: 10px;       /* ↓ */
  }
`;
const Dot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: rgba(37, 99, 235, 0.95);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.18);
`;

const Badges = styled.div`
  display: inline-flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
`;
const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  height: 26px;
  padding: 0 10px;
  border-radius: 999px;
  font-weight: 950;
  font-size: 11px;
  letter-spacing: 0.14em;
  color: rgba(15, 23, 42, 0.92);
  background: rgba(15, 23, 42, 0.06);
  border: 1px solid rgba(15, 23, 42, 0.10);

  @media (max-width: 420px) {
    height: 22px;
    padding: 0 8px;
    font-size: 9px;
    letter-spacing: 0.08em;
  }
`;

const MiniPill = styled.div`
  display: inline-flex;
  align-items: center;
  height: 26px;
  padding: 0 10px;
  border-radius: 999px;
  font-weight: 900;
  font-size: 12px;
  color: rgba(15, 23, 42, 0.82);
  background: rgba(255, 255, 255, 0.86);
  border: 1px solid rgba(15, 23, 42, 0.10);

  @media (max-width: 420px) {
    height: 22px;
    padding: 0 8px;
    font-size: 10px;
  }
`;

const BigChip = styled.div`
  display: inline-flex;
  align-items: center;
  height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  font-weight: 950;
  font-size: 13px;
  color: rgba(15, 23, 42, 0.96);
  background: rgba(16, 185, 129, 0.14);
  border: 1px solid rgba(15, 23, 42, 0.12);

  @media (max-width: 420px) {
    height: 24px;
    padding: 0 10px;
    font-size: 11px;
  }
`;

const Chip = styled.div`
  display: inline-flex;
  align-items: center;
  height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  font-weight: 900;
  font-size: 13px;
  color: rgba(15, 23, 42, 0.90);
  background: rgba(255, 255, 255, 0.86);
  border: 1px solid rgba(15, 23, 42, 0.12);

  @media (max-width: 420px) {
    height: 24px;
    padding: 0 10px;
    font-size: 11px;
  }
`;

const Headline = styled.h1`
  margin: 10px 0 0;
  font-size: 20px;
  font-weight: 980;
  letter-spacing: -0.3px;
  line-height: 1.18;
  color: #0f172a;

  @media (max-width: 420px) {
    font-size: 19px;
  }
`;

const Chips = styled.div`
  margin-top: 8px;
  display: flex;
  gap: 6px;  /* 기존 8 → 6 */
  flex-wrap: wrap;
`;

const Content = styled.div`
  padding: 12px 14px 14px;

  @media (max-width: 420px) {
    padding: 0px 0px 6px;  /* 좌우 8px */
  }
`;

const Para = styled.div`
  white-space: pre-wrap;
  line-height: 1.68;
  color: rgba(15, 23, 42, 0.84);
  font-weight: 780;
  font-size: 14px;
  background: #fff;
  border-radius: 14px;
  border: 1px solid rgba(15, 23, 42, 0.10);
  padding: 12px 12px;

  /* ✅ 첫 문단은 살짝 더 강조 */
  ${({ $first }) =>
    $first
      ? `
    box-shadow: 0 6px 14px rgba(15, 23, 42, 0.05);
  `
      : ""}

  & + & {
    margin-top: 10px;
  }

  @media (max-width: 420px) {
    padding: 10px 10px;
  }
`;

const Empty = styled.div`
  opacity: 0.7;
  font-weight: 850;
  color: rgba(15, 23, 42, 0.8);
`;

/* ✅ PROMO 박스: 모바일 깨짐/겹침 방지 핵심 */
const PromoCard = styled.div`
  margin: 0 14px 14px;
  border-radius: 16px;
  border: 1px dashed rgba(37, 99, 235, 0.35);
  background: radial-gradient(
      900px 260px at 0% 0%,
      rgba(37, 99, 235, 0.12),
      rgba(255, 255, 255, 0)
    ),
    rgba(15, 23, 42, 0.02);
  padding: 12px;

  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  align-items: center;

  @media (max-width: 420px) {
    margin: 0 10px 10px;
    padding: 12px;
    grid-template-columns: 1fr; /* ✅ 모바일은 세로 스택 */
    gap: 10px;
  }
`;

const PromoLeft = styled.div`
  min-width: 0; /* ✅ 긴 텍스트 overflow 방지 */
`;

const PromoLabel = styled.div`
  font-size: 11px;
  font-weight: 950;
  letter-spacing: 0.18em;
  color: rgba(15, 23, 42, 0.58);
`;

const PromoCode = styled.div`
  margin-top: 6px;
  font-weight: 1000;
  font-size: 22px;
  letter-spacing: 0.10em;
  color: rgba(37, 99, 235, 0.98);

  /* ✅ 모바일에서 코드가 길어도 깨지지 않게 */
  word-break: break-word;
`;

const PromoHint = styled.div`
  margin-top: 6px;
  font-size: 12px;
  font-weight: 850;
  color: rgba(15, 23, 42, 0.64);
`;

const PromoRight = styled.div`
  display: grid;
  justify-items: end;
  gap: 6px;

  @media (max-width: 420px) {
    justify-items: start;
  }
`;

const CTAButton = styled.button`
  border: 0;
  cursor: pointer;
  border-radius: 12px;
  padding: 10px 14px;
  font-weight: 950;
  font-size: 14px;
  color: #fff;
  background: linear-gradient(
    180deg,
    rgba(37, 99, 235, 0.95),
    rgba(29, 78, 216, 0.95)
  );
  box-shadow: 0 10px 18px rgba(37, 99, 235, 0.22);
  white-space: nowrap;

  &:active {
    transform: translateY(1px);
  }

  @media (max-width: 420px) {
    width: 100%;
    text-align: center;
  }
`;

const CTASub = styled.div`
  font-size: 11px;
  font-weight: 850;
  color: rgba(15, 23, 42, 0.52);
`;