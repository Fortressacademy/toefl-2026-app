export const notice_02 = {
  id: "notice_02",
  docType: "notice",
  title: "Elevator Inspection",
  date: "May 14",
  body:
`Dear tenants,

A routine elevator inspection will be conducted in Building A on May 14 from 2:00 P.M. to 5:00 P.M. During this time, the elevators may stop operating intermittently. Please plan ahead and use the stairwell if necessary. We apologize for any inconvenience.`,

  questions: [
    { id:"notice_02_q01", qNo:1, question:"What is the main purpose of the notice?",
      options:{A:"To invite residents to a safety meeting",B:"To announce a temporary change in elevator availability",C:"To request residents report elevator problems",D:"To explain a new building policy"},
      answer:"B", explanation:"It announces an inspection and possible interruptions."
    },
    { id:"notice_02_q02", qNo:2, question:"How long is the inspection scheduled to last?",
      options:{A:"Two hours",B:"Three hours",C:"Five hours",D:"All day"},
      answer:"B", explanation:"2:00–5:00 P.M. is three hours."
    },
    { id:"notice_02_q03", qNo:3, question:"What are residents advised to do during the inspection?",
      options:{A:"Avoid entering Building A",B:"Use the stairwell if needed",C:"Call management before using elevators",D:"Stay home until the inspection ends"},
      answer:"B", explanation:"The notice recommends using the stairwell if necessary."
    },
    { id:"notice_02_q04", qNo:4, question:"What can be inferred about elevator service?",
      options:{A:"It will be fully unavailable the entire time",B:"It may work at times but not consistently",C:"Only one elevator will run continuously",D:"Service will resume the next day"},
      answer:"B", explanation:"It says elevators may stop operating intermittently."
    }
  ]
};