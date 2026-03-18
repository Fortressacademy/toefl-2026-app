// src/data/reading/dailyLife/textmessages/textmessage_04.js
export const textmessage_04 = {
  id: "textmessage_04",
  docType: "textmessage",
  title: "Messages",
  subtitle: "Clara Jung · Event Coordinator",
  meta: "Friday · 10:42 AM",

  participants: [
    { id: "clara", name: "Clara Jung" },
    { id: "you", name: "You" },
  ],
  meId: "you",

  messages: [
    {
      from: "clara",
      time: "10:42 AM",
      text:
        "Quick update regarding tomorrow’s client seminar—the guest speaker’s flight was delayed, and she won’t land until early afternoon.",
    },
    {
      from: "clara",
      time: "10:43 AM",
      text:
        "That means we’ll need to shift the keynote session to the final slot instead of opening with it.",
    },
    {
      from: "you",
      time: "10:45 AM",
      text:
        "Understood. Does that affect the catering schedule or just the program order?",
    },
    {
      from: "clara",
      time: "10:46 AM",
      text:
        "Mostly the program flow. However, we may need to extend the networking break slightly so attendees aren’t waiting idle.",
    },
    {
      from: "you",
      time: "10:48 AM",
      text:
        "I can ask the catering team to keep refreshments available longer. Should we notify participants about the revised timeline?",
    },
    {
      from: "clara",
      time: "10:49 AM",
      text:
        "Yes, but frame it as an agenda enhancement rather than a disruption. We don’t want to highlight the travel issue.",
    },
    {
      from: "you",
      time: "10:50 AM",
      text:
        "Got it. I’ll circulate an updated schedule emphasizing the extended networking opportunity.",
    },
  ],

  questions: [
    {
      id: "textmessage_04_q1",
      type: "purpose",
      question: "Why are these messages being exchanged?",
      options: {
        A: "To cancel a seminar due to travel complications",
        B: "To reorganize event logistics following a schedule change",
        C: "To confirm the number of attendees for a conference",
        D: "To request additional funding for catering services",
      },
      answer: "B",
      explanation:
        "The guest speaker’s delayed arrival requires rearranging the program schedule and related logistics.",
    },
    {
      id: "textmessage_04_q2",
      type: "inference",
      question:
        "What can be inferred about Clara’s concern regarding participant communication?",
      options: {
        A: "She wants to conceal the speaker’s absence entirely.",
        B: "She prefers to present the adjustment positively.",
        C: "She expects attendees to complain about the delay.",
        D: "She plans to shorten the event significantly.",
      },
      answer: "B",
      explanation:
        "Clara asks to frame the update as an agenda enhancement rather than a disruption, indicating she wants a positive presentation.",
    },
    {
      id: "textmessage_04_q3",
      type: "detail_inference",
      question:
        "Why might the networking break be extended?",
      options: {
        A: "To compensate for a reduced catering order",
        B: "To allow the speaker additional rehearsal time",
        C: "To prevent attendees from waiting without scheduled activity",
        D: "To shorten the keynote presentation",
      },
      answer: "C",
      explanation:
        "Clara says the break may need to be extended so attendees are not waiting idle before the delayed keynote.",
    },
  ],
};