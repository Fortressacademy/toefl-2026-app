import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import WritingReportView from "../components/writing/WritingReportView";

export default function AdminWritingDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [item, setItem] = useState(null);

  useEffect(() => {
    fetch(`/.netlify/functions/get-writing-one?id=${id}`)
      .then((res) => res.json())
      .then(setItem);
  }, [id]);

  if (!item) {
    return <div style={{ padding: 24 }}>불러오는 중...</div>;
  }

  return (
    <WritingReportView
      report={{
        ...item.report,
        submittedAt: item.submittedAt,
        title: item.report?.title || item.mockId || "Writing Report",
      }}
      onBack={() => nav("/admin-writing")}
      backLabel="관리자 목록으로"
    />
  );
}