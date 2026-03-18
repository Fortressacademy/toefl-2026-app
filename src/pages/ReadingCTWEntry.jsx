// src/pages/ReadingCTWEntry.jsx
import { useParams } from "react-router-dom";
import ReadingCTW from "./ReadingCTW";
import ReadingCTWParagraph from "./ReadingCTWParagraph";

export default function ReadingCTWEntry() {
  const { trackKey } = useParams();

  // para 트랙만 paragraph 엔진으로
  if (trackKey === "para") return <ReadingCTWParagraph />;
 if (trackKey === "para" || trackKey === "para2") return <ReadingCTWParagraph />;
  // 나머지는 기존 단어 복원 엔진
  return <ReadingCTW />;
}