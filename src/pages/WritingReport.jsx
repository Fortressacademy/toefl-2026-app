import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";

import { LS_WRITING_REPORT, loadJson } from "../data/writing/writingStore";
import WritingReportView from "../components/writing/WritingReportView";

export default function WritingReport() {
  const nav = useNavigate();
  const [sp] = useSearchParams();
  const mockId = sp.get("mock") || "w_mock_1";

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const report = useMemo(() => {
    const all = loadJson(LS_WRITING_REPORT, {});
    return all?.[mockId] || null;
  }, [mockId]);

  if (!report) {
    return (
      <Page>
        <Wrap>
          <Hero>
            <h1>Report</h1>
            <p>제출 기록이 없습니다. 모의고사를 먼저 풀어주세요.</p>
            <Btn type="button" onClick={() => nav("/writing")}>
              Writing으로
            </Btn>
          </Hero>
        </Wrap>
      </Page>
    );
  }

  const submitReport = async () => {
    const studentName = prompt("학생 이름을 입력하세요");
    const studentCode = prompt("학생코드를 입력하세요");

    if (!studentName || !studentCode) return;

    try {
      setSubmitting(true);
      setMessage("");

      const res = await fetch("/.netlify/functions/submit-writing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentName,
          studentCode,
          mockId,
          report: {
            ...report,
            submittedAt: report.submittedAt || new Date().toISOString(),
          },
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || "제출 실패");
      }

      setMessage("관리자에게 리포트가 제출되었습니다.");
    } catch (err) {
      setMessage(err.message || "제출 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <WritingReportView
        report={report}
        onBack={() => nav("/writing")}
        backLabel="목록으로"
        onRetry={() => nav(`/writing/mock/${encodeURIComponent(mockId)}`)}
        retryLabel="다시 풀기"
        extraButtons={
          <BtnSubmit type="button" onClick={submitReport} disabled={submitting}>
            {submitting ? "제출 중..." : "관리자에게 제출"}
          </BtnSubmit>
        }
      />
      {message ? <Message>{message}</Message> : null}
    </>
  );
}

const Page = styled.div`
  width: 100%;
  padding: 18px 14px 36px;
`;

const Wrap = styled.div`
  max-width: 1320px;
  margin: 0 auto;
`;

const Hero = styled.div`
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 18px;
  padding: 20px;
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.06);

  h1 {
    margin: 0 0 6px;
    font-size: 18px;
    font-weight: 900;
  }
  p {
    margin: 0 0 12px;
    color: rgba(15, 23, 42, 0.65);
  }
`;

const Btn = styled.button`
  height: 44px;
  padding: 0 14px;
  border-radius: 14px;
  border: none;
  background: #ff6a00;
  color: #fff;
  font-weight: 900;
  cursor: pointer;

  &:active {
    transform: translateY(1px);
  }
`;

const BtnSubmit = styled.button`
  height: 46px;
  border-radius: 14px;
  border: none;
  background: #162b57;
  color: #ffffff;
  font-weight: 900;
  cursor: pointer;

  &:disabled {
    opacity: 0.65;
    cursor: default;
  }

  &:active {
    transform: translateY(1px);
  }
`;

const Message = styled.div`
  max-width: 1320px;
  margin: 10px auto 0;
  padding: 0 14px;
  color: #0f172a;
  font-weight: 800;
`;