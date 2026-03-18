// src/pages/SpeakingSetRouter.jsx
import { useParams } from "react-router-dom";
import SpeakingListenRepeatSet from "./SpeakingListenRepeatSet";
import SpeakingInterviewSet from "./SpeakingInterviewSet";

export default function SpeakingSetRouter() {
  const { partKey } = useParams();

  if (partKey === "interview") return <SpeakingInterviewSet />;
  // 기본은 listenRepeat
  return <SpeakingListenRepeatSet />;
}