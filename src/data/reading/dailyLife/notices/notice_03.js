export const notice_03 = {
  id: "notice_03",
  docType: "notice",
  title: "Parking Lot Resurfacing",
  date: "June 2",
  body:
`Notice to all staff,

The main parking lot will be resurfaced on June 2 starting at 7:00 A.M. Vehicles must be removed by 6:30 A.M. to avoid towing. Temporary parking will be available in Lot C behind the warehouse. Normal access will resume the following morning.`,

  questions: [
    { id:"notice_03_q01", qNo:1, question:"What is the notice mainly about?",
      options:{A:"A new parking fee policy",B:"A one-day parking lot closure for maintenance",C:"A change to employee work schedules",D:"A request to register vehicles"},
      answer:"B", explanation:"Resurfacing requires clearing cars and using Lot C."
    },
    { id:"notice_03_q02", qNo:2, question:"By what time must vehicles be removed?",
      options:{A:"6:30 A.M.",B:"7:00 A.M.",C:"8:00 A.M.",D:"The following morning"},
      answer:"A", explanation:"It says removed by 6:30 A.M."
    },
    { id:"notice_03_q03", qNo:3, question:"Where will temporary parking be available?",
      options:{A:"In the main lot after 7:00 A.M.",B:"In Lot B near the office",C:"In Lot C behind the warehouse",D:"On the street in front of the building"},
      answer:"C", explanation:"It explicitly states Lot C behind the warehouse."
    },
    { id:"notice_03_q04", qNo:4, question:"What can be inferred about June 2?",
      options:{A:"Employees should expect towing if they ignore instructions",B:"Lot C will also be resurfaced",C:"Parking will be unavailable for a week",D:"Access resumes the same afternoon"},
      answer:"A", explanation:"It warns cars may be towed if not removed."
    }
  ]
};