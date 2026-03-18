// src/data/reading/dailyLife/notices/notice_01.js
export const notice_01 = {
  id: "notice_01",
  docType: "notice",
  title: "Window Cleaning",
  date: "April 6",
  body:
`Dear residents,

Window cleaning will take place on the exterior of Building B from 10:00 A.M. to 1:00 P.M. on April 6. Please keep windows closed during this time for safety and a thorough cleaning. Also, please move any personal items, such as plants or decorations, from the windowsills.`,

  questions: [
    {
      id: "notice_01_q01",
      qNo: 1,
      question: "What is the main purpose of the notice?",
      options: {
        A: "To ask residents for help with a cleaning project",
        B: "To inform residents about a scheduled maintenance activity",
        C: "To announce a change in building regulations",
        D: "To request payment for exterior repairs"
      },
      answer: "B",
      explanation:
        "The notice announces a planned window-cleaning schedule and provides resident instructions, which is scheduled maintenance information."
    },
    {
      id: "notice_01_q02",
      qNo: 2,
      question: "When will the window cleaning take place?",
      options: {
        A: "From 10:00 A.M. to 1:00 P.M. on April 6",
        B: "From 1:00 P.M. to 4:00 P.M. on April 6",
        C: "On the morning of April 10",
        D: "Throughout the entire day on April 6"
      },
      answer: "A",
      explanation:
        "The notice explicitly states the time window and date: 10:00 A.M. to 1:00 P.M. on April 6."
    },
    {
      id: "notice_01_q03",
      qNo: 3,
      question: "Why are residents asked to keep their windows closed?",
      options: {
        A: "To prevent damage to the cleaning equipment",
        B: "To reduce noise during the cleaning process",
        C: "To ensure safety and effective cleaning",
        D: "To avoid disturbing other residents"
      },
      answer: "C",
      explanation:
        "The notice says windows should remain closed 'for safety and a thorough cleaning.'"
    },
    {
      id: "notice_01_q04",
      qNo: 4,
      question: "What can be inferred about the cleaning process?",
      options: {
        A: "It will involve work inside residents’ apartments.",
        B: "It may require access to window exteriors.",
        C: "It will last several days.",
        D: "It includes repairing damaged windows."
      },
      answer: "B",
      explanation:
        "Because the cleaning occurs on the exterior of Building B, workers will likely access and clean the outside surfaces of windows."
    }
  ]
};