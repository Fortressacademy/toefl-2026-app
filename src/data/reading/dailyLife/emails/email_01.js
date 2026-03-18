export const email_01 = {
  id: "email_01",
  docType: "email",
  to: "Eva Parker <e.parker@pmail.com>",
  from: "Brett Lewis <customerservice@cyhotel.com>",
  date: "May 27",
  subject: "Re: Request",
  body:
`Dear Ms. Parker,

We were able to make the change you requested. You now have a suite instead of a deluxe room during your upcoming stay from June 1 to 8. The cost is $45 more per night than what you originally paid. Please take care of the difference at check-in.

Sincerely,
Brett Lewis`,

  questions: [

    {
      id: "email_01_q01",
      qNo: 1,
      question: "Why did Brett Lewis most likely write this email?",
      options: {
        A: "To notify the guest of an unavoidable cancellation",
        B: "To confirm that an accommodation adjustment has been processed",
        C: "To encourage the guest to purchase an additional service package",
        D: "To clarify a billing error related to a previous stay"
      },
      answer: "B",
      explanation:
        "The email confirms that the requested change (room upgrade) has been successfully completed. It is not about cancellation, promotion, or billing error."
    },

    {
      id: "email_01_q02",
      qNo: 2,
      question: "According to the email, which of the following is true about the revised arrangement?",
      options: {
        A: "The total payment has already been automatically updated.",
        B: "The guest will receive a refund for the original booking.",
        C: "The nightly rate will be higher than the initial reservation.",
        D: "The length of the stay has been shortened."
      },
      answer: "C",
      explanation:
        "The email states that the suite costs $45 more per night than what was originally paid, indicating an increase in the nightly rate."
    },

    {
      id: "email_01_q03",
      qNo: 3,
      question: "The phrase 'take care of the difference' in the email is closest in meaning to:",
      options: {
        A: "Verify the reservation details",
        B: "Pay the remaining balance",
        C: "Request an additional modification",
        D: "Confirm identification documents"
      },
      answer: "B",
      explanation:
        "'Take care of the difference' is a polite expression meaning to settle or pay the additional amount owed."
    },

    {
      id: "email_01_q04",
      qNo: 4,
      question: "What can be inferred about the original reservation?",
      options: {
        A: "It included a promotional discount.",
        B: "It was for a different type of room.",
        C: "It was made for fewer than seven nights.",
        D: "It required full payment upon booking."
      },
      answer: "B",
      explanation:
        "The email states that the guest now has a suite instead of a deluxe room, implying the original booking was for a deluxe room."
    }

  ]
};