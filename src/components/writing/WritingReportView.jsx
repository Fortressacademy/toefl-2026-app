import { useMemo } from "react";
import styled from "styled-components";
import { ArrowLeft, BarChart3, Clock } from "lucide-react";

const pad2 = (n) => String(n).padStart(2, "0");

function formatMMSS(sec) {
  const s = Math.max(0, Math.floor(sec));
  return `${pad2(Math.floor(s / 60))}:${pad2(s % 60)}`;
}

function wordCount(text) {
  const t = String(text ?? "").trim();
  if (!t) return 0;
  return t.split(/\s+/).filter(Boolean).length;
}

export default function WritingReportView({
  report,
  onBack,
  backLabel = "목록으로",
  onRetry,
  retryLabel = "다시 풀기",
  extraButtons = null,
}) {
  const t2wc = wordCount(report?.task2?.body);
  const t3wc = wordCount(report?.task3?.body);

  const totalUsedSec = (() => {
    if (Number.isFinite(report?.timeUsedSec)) return Math.max(0, report.timeUsedSec);
    const arr = Array.isArray(report?.timeUsedByTaskSec) ? report.timeUsedByTaskSec : null;
    if (!arr) return 0;
    return arr.reduce((sum, v) => sum + (Number.isFinite(v) ? v : 0), 0);
  })();

  const timeByTask = useMemo(() => {
    const arr = Array.isArray(report?.timeUsedByTaskSec) ? report.timeUsedByTaskSec : null;
    if (!arr) return null;
    return arr.map((v) => (Number.isFinite(v) ? Math.max(0, v) : 0));
  }, [report]);

  const task1Details = Array.isArray(report?.task1?.details) ? report.task1.details : [];

  return (
    <Page>
      <Wrap>
        <Top>
          <BtnIcon type="button" onClick={onBack} title="Back">
            <ArrowLeft size={18} />
          </BtnIcon>

          <TitleBox>
            <b>{report.title}</b>
            <span>{new Date(report.submittedAt).toLocaleString()}</span>
          </TitleBox>
        </Top>

        <Grid>
          <Card>
            <CardHead>
              <BarChart3 size={18} />
              <b>Task 1 Score</b>
            </CardHead>
            <Big>
              {report?.task1?.correct ?? 0} / {report?.task1?.total ?? 0}
            </Big>
            <Small>
              Auto grading (space/case normalized) ·{" "}
              {report.autoSubmitted ? "Auto-submitted" : "Submitted"}
            </Small>
          </Card>

          <Card>
            <CardHead>
              <Clock size={18} />
              <b>Time Used</b>
            </CardHead>
            <Big>{formatMMSS(totalUsedSec)}</Big>
            <Small>
              {timeByTask
                ? `Task1 ${formatMMSS(timeByTask[0] || 0)} · Task2 ${formatMMSS(
                    timeByTask[1] || 0
                  )} · Task3 ${formatMMSS(timeByTask[2] || 0)}`
                : "From start to submit"}
            </Small>
          </Card>

          <Card>
            <CardHead>
              <b>Task 2 Word Count</b>
            </CardHead>
            <Big>{t2wc}</Big>
            <Small>Subject + body stored</Small>
          </Card>

          <Card>
            <CardHead>
              <b>Task 3 Word Count</b>
            </CardHead>
            <Big>{t3wc}</Big>
            <Small>Discussion response stored</Small>
          </Card>
        </Grid>

        <Section>
          <h2>Task 1 Review</h2>
          {task1Details.length === 0 ? (
            <EmptyBox>Task 1 리뷰 데이터가 없습니다.</EmptyBox>
          ) : (
            <ReviewList>
              {task1Details.map((d) => (
                <ReviewItem key={d.no} data-ok={d.correct ? "1" : "0"}>
                  <Row>
                    <b>Q{d.no}</b>
                    <Tag data-ok={d.correct ? "1" : "0"}>
                      {d.correct ? "Correct" : "Wrong"}
                    </Tag>
                  </Row>

                  <Txt>
                    <small>Your answer</small>
                    <div>{d.user || "—"}</div>
                  </Txt>

                  <Txt>
                    <small>Answer</small>
                    <div>{d.answer}</div>
                  </Txt>
                </ReviewItem>
              ))}
            </ReviewList>
          )}
        </Section>

        <Section>
          <h2>Task 2 · Email</h2>
          <Block>
            <small>Subject</small>
            <div>{report?.task2?.subject || "—"}</div>
          </Block>
          <Block>
            <small>Body</small>
            <pre>{report?.task2?.body || "—"}</pre>
          </Block>
        </Section>

        <Section>
          <h2>Task 3 · Discussion</h2>
          <Block>
            <small>Response</small>
            <pre>{report?.task3?.body || "—"}</pre>
          </Block>
        </Section>

        <BottomRow>
          {onRetry ? (
            <BtnGhost type="button" onClick={onRetry}>
              {retryLabel}
            </BtnGhost>
          ) : null}

          {extraButtons}

          <BtnPrimary type="button" onClick={onBack}>
            {backLabel}
          </BtnPrimary>
        </BottomRow>
      </Wrap>
    </Page>
  );
}

/* ================= styles ================= */

const Page = styled.div`
  width: 100%;
  padding: 18px 14px 36px;
`;

const Wrap = styled.div`
  max-width: 1320px;
  margin: 0 auto;
`;

const Top = styled.div`
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 16px;
  padding: 12px;
  display: flex;
  gap: 10px;
  align-items: center;
  box-shadow: 0 12px 26px rgba(15, 23, 42, 0.06);
`;

const BtnIcon = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.12);
  display: grid;
  place-items: center;
  cursor: pointer;

  &:active {
    transform: translateY(1px);
  }
`;

const TitleBox = styled.div`
  display: grid;
  gap: 2px;

  b {
    font-size: 14px;
    font-weight: 900;
    color: #0f172a;
  }
  span {
    font-size: 12px;
    color: rgba(15, 23, 42, 0.55);
  }
`;

const Grid = styled.div`
  margin-top: 14px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 18px;
  padding: 16px;
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.06);
`;

const CardHead = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: rgba(15, 23, 42, 0.7);

  b {
    color: #0f172a;
    font-weight: 900;
    font-size: 13px;
  }
`;

const Big = styled.div`
  margin-top: 10px;
  font-size: 28px;
  font-weight: 900;
  color: #0f172a;
  letter-spacing: -0.02em;
`;

const Small = styled.div`
  margin-top: 6px;
  font-size: 12px;
  color: rgba(15, 23, 42, 0.55);
`;

const Section = styled.section`
  margin-top: 16px;
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 18px;
  padding: 16px;
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.06);

  h2 {
    margin: 0 0 12px;
    font-size: 16px;
    font-weight: 900;
    color: #0f172a;
  }
`;

const EmptyBox = styled.div`
  border: 1px dashed rgba(15, 23, 42, 0.18);
  border-radius: 16px;
  padding: 14px;
  color: rgba(15, 23, 42, 0.62);
  font-weight: 800;
  font-size: 13px;
`;

const ReviewList = styled.div`
  display: grid;
  gap: 12px;
`;

const ReviewItem = styled.div`
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 16px;
  padding: 12px;

  &[data-ok="1"] {
    border-color: rgba(16, 185, 129, 0.28);
    background: rgba(16, 185, 129, 0.04);
  }
  &[data-ok="0"] {
    background: rgba(15, 23, 42, 0.02);
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;

  b {
    font-weight: 900;
    color: #0f172a;
  }
`;

const Tag = styled.div`
  font-size: 12px;
  font-weight: 900;
  color: rgba(15, 23, 42, 0.55);

  &[data-ok="1"] {
    color: #10b981;
  }
  &[data-ok="0"] {
    color: rgba(15, 23, 42, 0.55);
  }
`;

const Txt = styled.div`
  margin-top: 10px;

  small {
    display: block;
    margin-bottom: 4px;
    color: rgba(15, 23, 42, 0.55);
    font-weight: 900;
  }
  div {
    color: rgba(15, 23, 42, 0.8);
    font-weight: 800;
    font-size: 13px;
    line-height: 1.5;
    word-break: break-word;
  }
`;

const Block = styled.div`
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 16px;
  padding: 12px;
  margin-top: 10px;

  small {
    display: block;
    margin-bottom: 6px;
    color: rgba(15, 23, 42, 0.55);
    font-weight: 900;
  }
  div {
    color: rgba(15, 23, 42, 0.78);
    font-weight: 800;
    font-size: 13px;
    line-height: 1.5;
    word-break: break-word;
  }
  pre {
    margin: 0;
    white-space: pre-wrap;
    word-break: break-word;
    font-family: inherit;
    font-size: 13px;
    line-height: 1.55;
    color: rgba(15, 23, 42, 0.78);
  }
`;

const BottomRow = styled.div`
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const BtnGhost = styled.button`
  height: 46px;
  border-radius: 14px;
  border: 1px solid rgba(15, 23, 42, 0.14);
  background: #ffffff;
  color: #2a84ff;
  font-weight: 900;
  cursor: pointer;

  &:active {
    transform: translateY(1px);
  }
`;

const BtnPrimary = styled.button`
  height: 46px;
  border-radius: 14px;
  border: none;
  background: #ff6a00;
  color: #ffffff;
  font-weight: 900;
  cursor: pointer;

  &:active {
    transform: translateY(1px);
  }
`;