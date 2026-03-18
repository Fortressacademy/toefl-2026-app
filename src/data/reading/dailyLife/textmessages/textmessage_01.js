export const textmessage_01 = {
  id: "textmessage_01",
  docType: "textmessage", // ✅ 여기 중요 (DailyLifeSet에서 docType 우선 봄)
  title: "Messages",
  subtitle: "Hana Lee · Building Manager",
  meta: "Wednesday · 9:12 AM",

  participants: [
    { id: "hana", name: "Hana Lee" },
    { id: "manager", name: "Building Manager" },
  ],
  meId: "hana",

  messages: [
    { from: "manager", time: "9:12 AM", text: "Good morning, Ms. Lee. This is the building office. We need to conduct a brief fire-alarm inspection on your floor today." },
    { from: "manager", time: "9:13 AM", text: "It should take about 15 minutes per suite, but someone must be present to let the technician in." },
    { from: "hana", time: "9:15 AM", text: "Thanks for letting me know. What time is the technician scheduled to visit Suite 14B?" },
    { from: "manager", time: "9:16 AM", text: "The original time was 1:30 PM, but the schedule has changed. We can come either at 11:20 AM or sometime after 3:10 PM." },
    { from: "hana", time: "9:18 AM", text: "I have meetings until 12:30, so 11:20 won’t work. Could we schedule it around 3:30 PM instead?" },
    { from: "manager", time: "9:19 AM", text: "Yes, 3:30 PM is fine. Please make sure the hallway near the alarm panel is clear for easy access." },
    { from: "manager", time: "9:22 AM", text: "Also, please inform your colleagues that the alarm sound will be tested briefly." },
  ],

  // ✅ 너 엔진이 score 계산에서 q.answer를 보고 있으니까 answer로 통일
  questions: [
    {
      id: "textmessage_01_q1",
      type: "purpose",
      question: "What is the primary purpose of the text exchange?",
      options: {
        A: "To report a malfunctioning fire alarm",
        B: "To arrange a time for a required inspection",
        C: "To request permission to change offices",
        D: "To explain building safety regulations",
      },
      answer: "B",
      explanation: "The manager contacts Hana to schedule a fire-alarm inspection and confirms a suitable time.",
    },
    {
      id: "textmessage_01_q2",
      type: "detail",
      question: "Why does Hana decline the 11:20 AM option?",
      options: {
        A: "She will not be at the office that day",
        B: "The technician cannot access the hallway",
        C: "She has meetings scheduled until 12:30",
        D: "The inspection requires additional paperwork",
      },
      answer: "C",
      explanation: "Hana says she has meetings until 12:30, so 11:20 AM does not work.",
    },
    {
      id: "textmessage_01_q3",
      type: "inference",
      question: "What is Hana most likely to do before 3:30 PM?",
      options: {
        A: "Clear the area near the alarm panel",
        B: "Move the alarm panel to another location",
        C: "Cancel her meetings",
        D: "Provide access to the storage room",
      },
      answer: "A",
      explanation: "The manager asks her to keep the hallway near the alarm panel clear.",
    },
  ],
};