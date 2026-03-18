export const schedule_04 = {
  id: "schedule_04",
  docType: "schedule",
  title: "Clinic Appointment Slots",
  subtitle: "Tuesday Afternoon",
  columns: ["Time", "Doctor", "Service", "Availability"],
  rows: [
    ["1:00–1:30", "Dr. Lee", "Consultation", "Available"],
    ["1:30–2:00", "Dr. Lee", "Consultation", "Booked"],
    ["2:00–2:30", "Dr. Patel", "Follow-up", "Available"],
    ["2:30–3:00", "Dr. Patel", "Follow-up", "Booked"]
  ],
  note: "Arrive 15 minutes early to complete forms.",
  questions: [
    { id:"schedule_04_q01", qNo:1, question:"What is the schedule mainly showing?",
      options:{A:"Clinic pricing",B:"Available and booked appointment slots",C:"Doctor vacation dates",D:"Emergency procedures"},
      answer:"B", explanation:"It shows availability status per time slot."
    },
    { id:"schedule_04_q02", qNo:2, question:"Which doctor has an available slot at 2:00–2:30?",
      options:{A:"Dr. Lee",B:"Dr. Patel",C:"Both",D:"Neither"},
      answer:"B", explanation:"2:00–2:30 is Dr. Patel, Available."
    },
    { id:"schedule_04_q03", qNo:3, question:"What are patients advised to do?",
      options:{A:"Bring cash",B:"Arrive early to complete forms",C:"Call the doctor directly",D:"Skip forms if booked"},
      answer:"B", explanation:"The note instructs arriving 15 minutes early."
    },
    { id:"schedule_04_q04", qNo:4, question:"What can be inferred about 1:30–2:00?",
      options:{A:"No doctor is on duty",B:"The slot is already booked",C:"It is reserved for emergencies",D:"It is available for walk-ins"},
      answer:"B", explanation:"Availability column says Booked."
    }
  ]
};