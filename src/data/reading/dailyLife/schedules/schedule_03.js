export const schedule_03 = {
  id: "schedule_03",
  docType: "schedule",
  title: "Training Session Timeline",
  subtitle: "New Employee Orientation Day",
  columns: ["Time", "Session", "Location"],
  rows: [
    ["9:00–9:20", "Badge Pickup", "Lobby"],
    ["9:20–10:10", "Company Overview", "Conference Room 2"],
    ["10:20–11:00", "Security Briefing", "Conference Room 2"],
    ["11:10–12:00", "Tools Setup", "Lab A"]
  ],
  note: "Bring a valid ID for badge pickup.",
  questions: [
    { id:"schedule_03_q01", qNo:1, question:"What is the schedule’s purpose?",
      options:{A:"To describe employee benefits",B:"To list the timeline and locations for orientation activities",C:"To request volunteers",D:"To advertise job openings"},
      answer:"B", explanation:"It lists times, sessions, and locations."
    },
    { id:"schedule_03_q02", qNo:2, question:"Where does 'Tools Setup' take place?",
      options:{A:"Lobby",B:"Conference Room 2",C:"Lab A",D:"Lab B"},
      answer:"C", explanation:"Tools Setup is in Lab A."
    },
    { id:"schedule_03_q03", qNo:3, question:"What should attendees bring?",
      options:{A:"Laptop",B:"Valid ID",C:"Lunch",D:"Parking permit"},
      answer:"B", explanation:"Note says bring valid ID for badge pickup."
    },
    { id:"schedule_03_q04", qNo:4, question:"Which session happens right after 'Company Overview'?",
      options:{A:"Badge Pickup",B:"Security Briefing",C:"Tools Setup",D:"Lunch"},
      answer:"B", explanation:"Security Briefing is the next listed session after overview."
    }
  ]
};