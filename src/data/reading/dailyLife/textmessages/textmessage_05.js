// src/data/reading/dailyLife/textmessages/textmessage_05.js
export const textmessage_05 = {
  id: "textmessage_05",
  docType: "textmessage",
  title: "Messages",
  subtitle: "Daniel Seo · Facilities Supervisor",
  meta: "Tuesday · 6:58 PM",

  participants: [
    { id: "daniel", name: "Daniel Seo" },
    { id: "you", name: "You" },
  ],
  meId: "you",

  messages: [
    {
      from: "daniel",
      time: "6:58 PM",
      text:
        "We’ll be shutting off water access on the 12th floor tomorrow for maintenance. The interruption should last approximately two hours.",
    },
    {
      from: "you",
      time: "7:00 PM",
      text:
        "Thanks for the heads-up. What time will it begin?",
    },
    {
      from: "daniel",
      time: "7:01 PM",
      text:
        "The contractor plans to start at 8:30 AM, though they’ve indicated it could begin slightly earlier if preparations are completed ahead of schedule.",
    },
    {
      from: "you",
      time: "7:03 PM",
      text:
        "That overlaps with our morning lab session. Is there any flexibility in postponing until after 10:30?",
    },
    {
      from: "daniel",
      time: "7:05 PM",
      text:
        "Unfortunately not. The building’s main valve is shared, and delaying would affect tenants on two additional floors.",
    },
    {
      from: "you",
      time: "7:07 PM",
      text:
        "Understood. I’ll notify our team to store any necessary water in advance.",
    },
    {
      from: "daniel",
      time: "7:09 PM",
      text:
        "Good idea. Also, restrooms may remain unavailable for up to 30 minutes after service resumes while pressure stabilizes.",
    },
  ],

  questions: [
    {
      id: "textmessage_05_q1",
      type: "detail",
      question:
        "According to the messages, what is true about the maintenance work?",
      options: {
        A: "It may begin slightly before the announced start time.",
        B: "It will only affect the 12th floor.",
        C: "It is expected to continue throughout the entire day.",
        D: "It can be rescheduled at the tenant’s request.",
      },
      answer: "A",
      explanation:
        "Daniel says the contractor plans to start at 8:30 AM but may begin slightly earlier if preparations are finished ahead of schedule.",
    },
    {
      id: "textmessage_05_q2",
      type: "inference",
      question:
        "Why is postponing the maintenance not possible?",
      options: {
        A: "The contractor is unavailable after 10:30.",
        B: "Water usage is highest in the afternoon.",
        C: "The system being serviced is connected to multiple floors.",
        D: "Tenants requested an earlier shutdown.",
      },
      answer: "C",
      explanation:
        "Daniel explains that the building’s main valve is shared and delaying would affect other tenants.",
    },
    {
      id: "textmessage_05_q3",
      type: "inference_time",
      question:
        "If maintenance starts exactly at 8:30 AM and lasts two hours, when will restrooms most likely become fully usable again?",
      options: {
        A: "Around 10:00 AM",
        B: "Around 10:30 AM",
        C: "Around 11:00 AM",
        D: "Around 11:30 AM",
      },
      answer: "C",
      explanation:
        "Two hours from 8:30 AM is 10:30 AM. Since restrooms may remain unavailable for up to 30 additional minutes, they would most likely be fully usable around 11:00 AM.",
    },
  ],
};