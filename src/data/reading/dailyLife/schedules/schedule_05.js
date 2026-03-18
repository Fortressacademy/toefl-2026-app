export const schedule_05 = {
  id: "schedule_05",
  docType: "schedule",
  title: "Delivery Pickup Windows",
  subtitle: "Warehouse Receiving",
  columns: ["Carrier", "Window", "Dock", "Special Notes"],
  rows: [
    ["NorthLine", "8:00–9:30", "Dock 1", "Paperwork required"],
    ["MetroShip", "9:30–11:00", "Dock 2", "Fragile items"],
    ["SkyFreight", "11:00–12:30", "Dock 3", "ID check at gate"]
  ],
  note: "Late arrivals may be rescheduled.",
  questions: [
    { id:"schedule_05_q01", qNo:1, question:"What is the main purpose of the schedule?",
      options:{A:"To list warehouse job openings",B:"To show pickup time windows for carriers",C:"To announce a holiday closure",D:"To advertise shipping discounts"},
      answer:"B", explanation:"It lists carriers with pickup windows and dock numbers."
    },
    { id:"schedule_05_q02", qNo:2, question:"Which carrier uses Dock 2?",
      options:{A:"NorthLine",B:"MetroShip",C:"SkyFreight",D:"None"},
      answer:"B", explanation:"MetroShip is assigned Dock 2."
    },
    { id:"schedule_05_q03", qNo:3, question:"What special requirement is mentioned for SkyFreight?",
      options:{A:"Paperwork required",B:"Fragile items",C:"ID check at gate",D:"No special notes"},
      answer:"C", explanation:"SkyFreight note says ID check at gate."
    },
    { id:"schedule_05_q04", qNo:4, question:"What can be inferred about late arrivals?",
      options:{A:"They will be denied entry permanently",B:"They may need a new pickup time",C:"They get priority service",D:"They pay no fees"},
      answer:"B", explanation:"The note says late arrivals may be rescheduled."
    }
  ]
};