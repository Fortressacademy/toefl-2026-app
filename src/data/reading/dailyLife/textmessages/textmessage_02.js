// src/data/reading/dailyLife/textmessages/textmessage_02.js
export const textmessage_02 = {
  id: "textmessage_02",
  docType: "textmessage",
  title: "Messages",
  subtitle: "Maya Park · Shipping Coordinator",
  meta: "Thursday · 4:26 PM",

  participants: [
    { id: "maya", name: "Maya Park" },
    { id: "ship", name: "Shipping Desk" },
  ],
  meId: "maya",

  messages: [
    {
      from: "ship",
      time: "4:26 PM",
      text:
        "Hi Maya—just letting you know the courier tried to deliver the prototype components today, but the receiving entrance was secured, so the package has been taken back to the local depot.",
    },
    {
      from: "ship",
      time: "4:27 PM",
      text:
        "They can attempt delivery again tomorrow. The earliest available slot is 9:00–11:00 AM, and another option is between 2:00 and 4:00 PM.",
    },
    {
      from: "maya",
      time: "4:29 PM",
      text:
        "Appreciate the update. The earlier slot won’t be possible—our receiving staff will be in mandatory training until late morning. Could we schedule the later window instead?",
    },
    {
      from: "ship",
      time: "4:30 PM",
      text:
        "That works. Please ensure someone can access the receiving area and that the loading space is unobstructed. The driver will call shortly before arrival.",
    },
    {
      from: "maya",
      time: "4:32 PM",
      text:
        "Understood. One more question—does the delivery require authorization from a supervisor, or would any available team member be sufficient?",
    },
    {
      from: "ship",
      time: "4:33 PM",
      text:
        "Any authorized staff member can sign, as long as they provide the reference number PR-4472.",
    },
    {
      from: "maya",
      time: "4:35 PM",
      text:
        "Great. I’ll designate someone for the afternoon window and circulate the reference number to the front desk.",
    },
  ],

  questions: [
    {
      id: "textmessage_02_q1",
      type: "purpose",
      question:
        "Why are the two individuals exchanging these messages?",
      options: {
        A: "To negotiate compensation for a delayed shipment",
        B: "To coordinate a second delivery attempt after an unsuccessful visit",
        C: "To modify the contents of an order before dispatch",
        D: "To confirm that the prototype components met safety standards",
      },
      answer: "B",
      explanation:
        "The courier was unable to complete delivery and returned the package to the depot, so they are arranging another delivery time.",
    },

    {
      id: "textmessage_02_q2",
      type: "detail_inference",
      question:
        "What can be inferred about the failed delivery attempt?",
      options: {
        A: "The courier arrived outside of scheduled working hours.",
        B: "The package was missing required documentation.",
        C: "No one was available to provide access to the receiving area.",
        D: "The shipment had been sent to the wrong address.",
      },
      answer: "C",
      explanation:
        "The message states that the receiving entrance was secured, implying that no one was available to unlock it or accept the delivery.",
    },

    {
      id: "textmessage_02_q3",
      type: "inference",
      question:
        "Which action is most likely to prevent another delivery failure?",
      options: {
        A: "Assigning a staff member who can access the area and present the reference number",
        B: "Requesting that the depot hold the package for pickup instead",
        C: "Asking the driver to arrive earlier than scheduled",
        D: "Ensuring that a supervisor personally signs the shipment",
      },
      answer: "A",
      explanation:
        "The Shipping Desk specifies that someone must access the receiving area and provide the reference number. Maya says she will assign someone and circulate the number.",
    },
  ],
};