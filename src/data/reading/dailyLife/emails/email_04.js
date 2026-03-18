
export const email_04 = {
  id: "email_04",
  docType: "email",
  to: "Ms. Johnson <mjohnson@wellnessmail.com>",
  from: "Michael Hughes <events@grandcc.org>",
  date: "February 12",
  subject: "Wellness Workshop Series",
  body:
`Dear Ms. Johnson,

We are pleased to extend an invitation to our Comprehensive Wellness Workshop Series, taking place from March 12 to 14 at the Grand Convention Center. This year's focus is "Nutrition, Fitness, and Mindfulness Integration." The event will feature a keynote address and interactive, hands-on sessions. 

We are also bringing back the Participant Showcase, where attendees can share their own healthy recipes or personal fitness routines. If you would like to be a part of the showcase, please send a brief proposal to the organizing team by February 25.

Warm regards,
Michael Hughes`,

  questions: [
    // (1) Main topic / purpose
    {
      id:"email_04_q01",
      qNo:1,
      question:"What is the main purpose of this email?",
      options:{
        A:"To invite Ms. Johnson to a workshop series and explain an optional way to participate",
        B:"To inform Ms. Johnson that her proposal was accepted for the Showcase",
        C:"To announce a change in the workshop location due to construction",
        D:"To request payment for workshop registration that is overdue"
      },
      answer:"A",
      explanation:"It invites her to the workshop series and explains how to join the Participant Showcase by sending a proposal."
    },

    // (2) Detail
   {
  id:"email_04_q02",
  qNo:2,
  question:"According to the email, what type of activities are planned for the workshop series?",
  options:{
    A:"Both a formal speech and sessions that require active involvement",
    B:"Only individual research presentations by invited experts",
    C:"Primarily online lectures with limited audience interaction",
    D:"Competitive events focused on evaluating participants’ fitness levels"
  },
  answer:"A",
  explanation:"A keynote address corresponds to a formal speech, and 'interactive, hands-on sessions' refers to activities requiring active involvement."
},

    // (6) Intention
   {
  id:"email_04_q03",
  qNo:3,
  question:"What action is required in order to be considered for the Participant Showcase?",
  options:{
    A:"Submit a short description of the intended contribution before the specified deadline",
    B:"Register for the workshop series on-site during the event",
    C:"Obtain prior approval from the keynote speaker",
    D:"Send detailed presentation materials after March 14"
  },
  answer:"A",
  explanation:"'Send a brief proposal by February 25' is paraphrased as submitting a short description before the deadline."
},

    // (4) Vocab (+ highlight)
  {
  id:"email_04_q04",
  qNo:4,
  question:"Why does Michael Hughes mention the Participant Showcase in the email?",
  options:{
    A:"To encourage Ms. Johnson to consider contributing her own wellness ideas",
    B:"To inform her that attendance at the Showcase is mandatory",
    C:"To explain that the Showcase will replace the keynote address",
    D:"To notify her that she has already been selected as a presenter"
  },
  answer:"A",
  explanation:"The email introduces the Participant Showcase to invite voluntary participation and encourage submission of proposals."
}
  ]
};

