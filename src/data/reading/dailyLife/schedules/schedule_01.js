export const schedule_01 = {
  id: "schedule_01",
  docType: "schedule",
  title: "Community Center Weekly Room Schedule",
  subtitle: "Week of March 12",
  columns: ["Time", "Room A", "Room B", "Room C"],
  rows: [
    ["9:00–10:00", "Orientation", "—", "Equipment Setup"],
    ["10:00–11:00", "Beginner Yoga", "Team Meeting", "—"],
    ["11:00–12:00", "—", "Local Club Gathering", "Resume Workshop"],
    ["12:00–1:00", "Advanced Yoga", "—", "—"]
  ],
  note: "Participants must check in at the front desk at least 10 minutes before their scheduled session. Rooms marked '—' are not available for public use.",
  questions: [
    {
      id: "schedule_01_q01",
      qNo: 1,
      question: "What can be inferred about Room B at 9:00–10:00?",
      options: {
        A: "It is reserved for a private organization.",
        B: "It is temporarily closed for maintenance.",
        C: "It is not open for public activities during that time.",
        D: "It is being prepared for a later event."
      },
      answer: "C",
      explanation:
        "The note explains that rooms marked '—' are not available for public use, implying Room B cannot be used during that time."
    },
    {
      id: "schedule_01_q02",
      qNo: 2,
      question: "A visitor wants to attend a session in Room C at 11:00. According to the notice, what should the visitor do?",
      options: {
        A: "Arrive at the center before 10:50.",
        B: "Wait until the previous session ends.",
        C: "Register online one hour in advance.",
        D: "Check in immediately after the session begins."
      },
      answer: "A",
      explanation:
        "Participants must check in at least 10 minutes before their scheduled session. For an 11:00 session, arrival before 10:50 is required."
    },
    {
      id: "schedule_01_q03",
      qNo: 3,
      question: "Which of the following individuals would NOT be able to reserve a room at 12:00–1:00?",
      options: {
        A: "Someone planning a small group meeting in Room B",
        B: "A yoga instructor using Room A",
        C: "A job coach hosting a workshop in Room C",
        D: "A volunteer organizing a local club activity in Room B"
      },
      answer: "A",
      explanation:
        "At 12:00–1:00, Room B is marked '—', meaning it is not available for public use."
    },
    {
      id: "schedule_01_q04",
      qNo: 4,
      question: "What is the primary purpose of including the note below the schedule?",
      options: {
        A: "To encourage participants to arrive early and clarify room availability",
        B: "To explain changes in the center’s operating hours",
        C: "To advertise additional services offered at the front desk",
        D: "To request volunteers for upcoming programs"
      },
      answer: "A",
      explanation:
        "The note provides instructions about early check-in and clarifies that rooms marked with '—' are not open for public use."
    }
  ]
};