export const email_03 = {
  id: "email_03",
  docType: "email",
  to: "Ms. Miller <mmiller@citymuseum.org>",
  from: "Ava Mitchell <membership@citymuseum.org>",
  date: "February 20",
  subject: "City Museum Membership",
  body:
`Dear Ms. Miller,

As your City Museum annual membership is about to expire, please renew it by March 31 to keep your benefits. Members will receive a special exhibit preview invitation and a 15% discount available exclusively on our mobile application. If you have not installed the app, we recommend downloading it to take advantage of this offer.

Sincerely,
Ava Mitchell`,

  questions: [
    // (1) Main topic / purpose
    {
      id:"email_03_q01",
      qNo:1,
      question:"What is the primary purpose of this email?",
      options:{
        A:"To confirm that Ms. Miller’s membership has already been renewed",
        B:"To remind Ms. Miller to renew her membership and explain what she may receive for doing so",
        C:"To announce that the museum will require all members to use a mobile app",
        D:"To inform Ms. Miller that her membership benefits have been discontinued"
      },
      answer:"B",
      explanation:"The email reminds her that her membership is about to expire, provides a deadline, and mentions benefits tied to membership/renewal."
    },

    // (2) Detail
    {
      id:"email_03_q02",
      qNo:2,
      question:"According to the email, what is offered to museum members?",
      options:{
        A:"Early access to a special exhibit and a discount available through the mobile app",
        B:"Free admission for one guest on every visit",
        C:"A printed discount card mailed to members’ homes",
        D:"Reserved parking during peak hours"
      },
      answer:"A",
      explanation:"It states members will receive a special exhibit preview invitation and a 15% discount available exclusively on the mobile app."
    },

    // (5) Inference
    {
      id:"email_03_q03",
      qNo:3,
      question:"What can be inferred about the discount mentioned in the email?",
      options:{
        A:"It applies only to purchases made through the museum’s mobile application",
        B:"It will be automatically applied to Ms. Miller’s renewal fee",
        C:"It is available only on the day of the special exhibit preview",
        D:"It can be used only after Ms. Miller visits the museum in person"
      },
      answer:"A",
      explanation:"The email says the discount is available exclusively on the museum’s mobile application, implying it applies to app-based purchases/transactions."
    },

    // (4) Vocab (+ highlight)
    {
  id:"email_03_q04",
  qNo:4,
  question:"The word 'expire' in the email is closest in meaning to:",
  options:{
    A:"Increase",
    B:"End",
    C:"Transfer",
    D:"Delay"
  },
  answer:"B",
  explanation:"In this context, 'expire' means to end or come to an end.",
  highlight:{ query:"expire", mode:"word" }
}
  ]
};