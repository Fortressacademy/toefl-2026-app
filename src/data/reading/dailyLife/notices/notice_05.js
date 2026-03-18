export const notice_05 = {
  id: "notice_05",
  docType: "notice",
  title: "Cafeteria Payment Update",
  date: "October 1",
  body:
`Dear employees,

Starting October 1, the cafeteria will no longer accept cash payments. Please use a credit/debit card or the company ID payment system. If you have not activated ID payment, visit the Help Desk in Room 214 before September 28 to avoid delays during lunch hours.`,

  questions: [
    { id:"notice_05_q01", qNo:1, question:"What is the main purpose of the notice?",
      options:{A:"To introduce new cafeteria menu items",B:"To announce a change in accepted payment methods",C:"To report cafeteria renovation plans",D:"To request employees bring exact change"},
      answer:"B", explanation:"It states cash will no longer be accepted."
    },
    { id:"notice_05_q02", qNo:2, question:"What will the cafeteria stop accepting?",
      options:{A:"Credit cards",B:"Company ID payment",C:"Cash",D:"Mobile payments"},
      answer:"C", explanation:"It clearly says no longer accept cash."
    },
    { id:"notice_05_q03", qNo:3, question:"What should employees do if they have not activated ID payment?",
      options:{A:"Call cafeteria staff",B:"Visit the Help Desk in Room 214 before Sep 28",C:"Bring cash until Oct 1",D:"Register online after Oct 1"},
      answer:"B", explanation:"It gives a location and deadline."
    },
    { id:"notice_05_q04", qNo:4, question:"What can be inferred about September 28?",
      options:{A:"The cafeteria closes that day",B:"It is the recommended deadline to prevent lunch delays",C:"Cash payments return after that date",D:"Credit cards will be disabled"},
      answer:"B", explanation:"It says to activate before Sep 28 to avoid delays."
    }
  ]
};