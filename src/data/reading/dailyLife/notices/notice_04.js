export const notice_04 = {
  id: "notice_04",
  docType: "notice",
  title: "Library HVAC Testing",
  date: "September 9",
  body:
`Attention patrons,

The library will conduct HVAC performance testing on September 9 between 9:00 A.M. and 11:30 A.M. You may notice brief temperature changes and short, low-volume alarms. Study rooms remain open, but we recommend bringing a light jacket. Thank you for your cooperation.`,

  questions: [
    { id:"notice_04_q01", qNo:1, question:"What is the main purpose of the notice?",
      options:{A:"To announce a library closure",B:"To inform patrons about HVAC testing and possible effects",C:"To request patrons reserve study rooms",D:"To advertise new library services"},
      answer:"B", explanation:"It describes testing and what patrons may notice."
    },
    { id:"notice_04_q02", qNo:2, question:"How long will testing last?",
      options:{A:"1 hour",B:"2.5 hours",C:"3 hours",D:"All day"},
      answer:"B", explanation:"9:00 to 11:30 is 2.5 hours."
    },
    { id:"notice_04_q03", qNo:3, question:"What might patrons experience?",
      options:{A:"Complete power outages",B:"Loud, continuous alarms",C:"Brief temperature changes",D:"Closed study rooms"},
      answer:"C", explanation:"It says brief temperature changes and short alarms."
    },
    { id:"notice_04_q04", qNo:4, question:"Why does the notice suggest bringing a light jacket?",
      options:{A:"Because the library will be colder for the season",B:"Because testing may change temperatures temporarily",C:"Because outdoor lines will be long",D:"Because study rooms require it"},
      answer:"B", explanation:"Temperature may shift during HVAC testing."
    }
  ]
};