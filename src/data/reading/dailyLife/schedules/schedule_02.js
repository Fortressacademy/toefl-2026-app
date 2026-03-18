export const schedule_02 = {
  id: "schedule_02",
  docType: "schedule",
  title: "Transit Service Adjustments",
  subtitle: "Saturday (Limited Routes)",
  columns: ["Route", "First Bus", "Last Bus", "Notes"],
  rows: [
    ["12", "6:10 A.M.", "8:40 P.M.", "Runs every 25 minutes"],
    ["18", "7:00 A.M.", "7:30 P.M.", "Detour near Central Ave."],
    ["22", "6:45 A.M.", "9:10 P.M.", "Express service suspended"]
  ],
  note: "Allow extra travel time due to detours.",
  questions: [
    { id:"schedule_02_q01", qNo:1, question:"What is the schedule mainly providing?",
      options:{A:"Bus hiring information",B:"Adjusted service times and notes for routes",C:"Train ticket pricing",D:"Road construction dates"},
      answer:"B", explanation:"It lists routes with first/last bus and notes."
    },
    { id:"schedule_02_q02", qNo:2, question:"Which route has a detour mentioned?",
      options:{A:"12",B:"18",C:"22",D:"None"},
      answer:"B", explanation:"Route 18 has a detour note."
    },
    { id:"schedule_02_q03", qNo:3, question:"Which route’s express service is suspended?",
      options:{A:"12",B:"18",C:"22",D:"All routes"},
      answer:"C", explanation:"Route 22 states express service suspended."
    },
    { id:"schedule_02_q04", qNo:4, question:"What can be inferred from the note?",
      options:{A:"Detours may cause delays",B:"Buses will be free today",C:"Only express buses are running",D:"All routes are canceled"},
      answer:"A", explanation:"It tells riders to allow extra time due to detours."
    }
  ]
};