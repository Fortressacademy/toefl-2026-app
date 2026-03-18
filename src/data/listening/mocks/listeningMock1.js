const listeningMock1 = {
  id: "listening_mock_1",
  title: "TOEFL 2026 Listening Mock 1",
  branching: {
    wrongCut: 2,
    passTo: "m2",
    failTo: "m3",
  },

  modules: {
    m1: {
      title: "Module 1",
      sections: [
        {
          id: "routing_mix",
          type: "routing",
          title: "Routing Items",
         items: [

{
  id: "r1",
  type: "choose_response",
  accent: "us",
  title: "Listen and Choose a Response",
  prompt: "Listen carefully.",
  audioSrc: "",
  transcript: "Where did you place the shipment labels?",
  speakers: [],
  question: "Which response is most appropriate?",
  options: {
    A: "On the desk beside the printer.",
    B: "I need to wear safety gloves.",
    C: "The shipment arrived yesterday.",
    D: "Several labels were missing."
  },
  answer: "A"
},

{
  id: "r2",
  type: "choose_response",
  accent: "uk",
  title: "Listen and Choose a Response",
  prompt: "Listen carefully.",
  audioSrc: "",
  transcript: "Is the conference room available this afternoon?",
  speakers: [],
  question: "Which response is most appropriate?",
  options: {
    A: "The conference starts soon.",
    B: "It should be free after two.",
    C: "The room is quite wide.",
    D: "Several guests arrived."
  },
  answer: "B"
},

{
  id: "r3",
  type: "choose_response",
  accent: "au",
  title: "Listen and Choose a Response",
  prompt: "Listen carefully.",
  audioSrc: "",
  transcript: "Can you send the updated schedule to the team?",
  speakers: [],
  question: "Which response is most appropriate?",
  options: {
    A: "The schedule was complicated.",
    B: "Yes, I'll forward it shortly.",
    C: "It went through several revisions.",
    D: "The team meeting ended."
  },
  answer: "B"
},

{
  id: "r4",
  type: "choose_response",
  accent: "us",
  title: "Listen and Choose a Response",
  prompt: "Listen carefully.",
  audioSrc: "",
  transcript: "When will the marketing report be completed?",
  speakers: [],
  question: "Which response is most appropriate?",
  options: {
    A: "The report went to the director.",
    B: "By tomorrow morning.",
    C: "Marketing is competitive.",
    D: "Several charts were included."
  },
  answer: "B"
},

{
  id: "r5",
  type: "choose_response",
  accent: "us",
  title: "Listen and Choose a Response",
  prompt: "Listen carefully.",
  audioSrc: "",
  transcript: "Are the interns attending the safety training today?",
  speakers: [],
  question: "Which response is most appropriate?",
  options: {
    A: "The training room is wide.",
    B: "Yes, they registered earlier.",
    C: "Several interns arrived late.",
    D: "The training manual changed."
  },
  answer: "B"
},

{
  id: "r6",
  type: "choose_response",
  accent: "uk",
  title: "Listen and Choose a Response",
  prompt: "Listen carefully.",
  audioSrc: "",
  transcript: "Why was the client visit postponed?",
  speakers: [],
  question: "Which response is most appropriate?",
  options: {
    A: "The hallway is quite wide.",
    B: "Several managers were traveling.",
    C: "The visit lasted two days.",
    D: "The client arrived early."
  },
  answer: "B"
},

{
  id: "r7",
  type: "choose_response",
  accent: "au",
  title: "Listen and Choose a Response",
  prompt: "Listen carefully.",
  audioSrc: "",
  transcript: "Did the technician inspect the equipment already?",
  speakers: [],
  question: "Which response is most appropriate?",
  options: {
    A: "Not yet, he's still checking another machine.",
    B: "The equipment is expensive.",
    C: "It went through testing.",
    D: "Several tools were missing."
  },
  answer: "A"
},

{
  id: "r8",
  type: "choose_response",
  accent: "us",
  title: "Listen and Choose a Response",
  prompt: "Listen carefully.",
  audioSrc: "",
  transcript: "Let's review the advertising plan again.",
  speakers: [],
  question: "Which response is most appropriate?",
  options: {
    A: "That would help clarify a few details.",
    B: "The plan includes advertising costs.",
    C: "The hallway is wide enough.",
    D: "Several ads were printed."
  },
  answer: "A"
},


            {
              id: "r2",
              type: "conversation",
              accent: "uk",
              title: "Listen to a Conversation",
              prompt: "Listen carefully.",
              audioSrc: "",
              dialogue: [
                { speaker: "A", text: "Professor, I missed the orientation yesterday." },
                { speaker: "B", text: "I see." },
                { speaker: "B", text: "In that case, come by my office tomorrow." },
                { speaker: "A", text: "All right." },
                { speaker: "A", text: "I still want to join the lab." },
                { speaker: "B", text: "That's fine." },
                { speaker: "B", text: "I'll explain the procedures then." },
              ],
              transcript:
                "Professor, I missed the orientation yesterday. I see. In that case, come by my office tomorrow. All right. I still want to join the lab. That's fine. I'll explain the procedures then.",
              speakers: ["Student", "Professor"],
              speakerA: {
                rate: 1.01,
                pitch: 1.07,
                baseGap: 105,
              },
              speakerB: {
                rate: 0.93,
                pitch: 0.95,
                baseGap: 145,
              },
              question: "Why does the student speak with the professor?",
              options: {
                A: "To complain about the course",
                B: "To ask about joining the lab",
                C: "To request a grade change",
                D: "To borrow equipment",
              },
              answer: "B",
              explanation: {
                core: "학생은 orientation을 놓쳤지만 여전히 lab에 참여하고 싶어 한다.",
                whyCorrect:
                  "B가 맞는 이유는 학생이 실험실 참여 절차를 다시 안내받으려 하기 때문이다.",
                whyWrong: {
                  A: "수업에 대한 불만은 전혀 언급되지 않았다.",
                  C: "성적 변경 요청은 대화 내용에 없다.",
                  D: "장비 대여에 대한 언급도 없다.",
                },
              },
            },

            {
              id: "r3",
              type: "announcement",
              accent: "au",
              title: "Listen to an Announcement",
              prompt: "Listen carefully.",
              audioSrc: "",
              transcript:
                "Attention, students. Due to maintenance work, the west entrance of the science building will stay closed until Friday. Please use the south entrance near the parking lot.",
              speakers: ["Announcement"],
              rate: 0.95,
              pitch: 0.98,
              baseGap: 135,
              question: "What is the purpose of the announcement?",
              options: {
                A: "To describe a temporary change in building access",
                B: "To explain how to apply for parking",
                C: "To invite students to a science event",
                D: "To announce a class cancellation",
              },
              answer: "A",
              explanation: {
                core: "공지의 핵심은 건물 출입 경로가 임시로 바뀌었다는 점이다.",
                whyCorrect:
                  "A는 서쪽 출입문이 닫혀 남쪽 출입문을 사용하라는 핵심 내용을 정확히 요약한다.",
                whyWrong: {
                  B: "주차 신청 절차는 전혀 설명하지 않는다.",
                  C: "행사 초대가 아니라 출입 안내다.",
                  D: "수업 취소에 대한 말은 없다.",
                },
              },
            },
          ],
        },
      ],
    },
m2: {
  title: "Module 2",
  sections: [
    {
      id: "easy_task1",
      type: "easy",
      title: "Easy Module Task 1",
      items: [
        {
          id: "e1",
          type: "choose_response",
          accent: "us",
          title: "Listen and Choose a Response",
          prompt: "Listen carefully.",
          audioSrc: "",
          transcript: "Where will the training session be held?",
          speakers: [],
          question: "Which response is most appropriate?",
          options: {
            A: "In the main conference room.",
            B: "I'll wear the new badge.",
            C: "The trainer arrived early.",
            D: "It's scheduled tomorrow.",
          },
          answer: "A",
        },

        {
          id: "e2",
          type: "choose_response",
          accent: "uk",
          title: "Listen and Choose a Response",
          prompt: "Listen carefully.",
          audioSrc: "",
          transcript: "When will the revised contract be sent out?",
          speakers: [],
          question: "Which response is most appropriate?",
          options: {
            A: "The client signed yesterday.",
            B: "It went through legal review.",
            C: "Early next week.",
            D: "We sent the invoice already.",
          },
          answer: "C",
        },

        {
          id: "e3",
          type: "choose_response",
          accent: "au",
          title: "Listen and Choose a Response",
          prompt: "Listen carefully.",
          audioSrc: "",
          transcript: "Who will lead the budget meeting this afternoon?",
          speakers: [],
          question: "Which response is most appropriate?",
          options: {
            A: "The finance manager will.",
            B: "It begins at three o'clock.",
            C: "The budget was increased.",
            D: "Several reports were printed.",
          },
          answer: "A",
        },

        {
          id: "e4",
          type: "choose_response",
          accent: "us",
          title: "Listen and Choose a Response",
          prompt: "Listen carefully.",
          audioSrc: "",
          transcript: "Did you already book the hotel for the conference?",
          speakers: [],
          question: "Which response is most appropriate?",
          options: {
            A: "The hotel lobby was crowded.",
            B: "Not yet, but I'll do it this afternoon.",
            C: "The conference was very informative.",
            D: "Several guests checked out early.",
          },
          answer: "B",
        },

        {
          id: "e5",
          type: "choose_response",
          accent: "uk",
          title: "Listen and Choose a Response",
          prompt: "Listen carefully.",
          audioSrc: "",
          transcript: "Why is the front desk closed right now?",
          speakers: [],
          question: "Which response is most appropriate?",
          options: {
            A: "Because the staff are in a meeting.",
            B: "The desk is near the entrance.",
            C: "It closes at six every day.",
            D: "Several brochures were displayed.",
          },
          answer: "A",
        },

        {
          id: "e6",
          type: "choose_response",
          accent: "au",
          title: "Listen and Choose a Response",
          prompt: "Listen carefully.",
          audioSrc: "",
          transcript: "Can you print another copy of the handout for me?",
          speakers: [],
          question: "Which response is most appropriate?",
          options: {
            A: "The printer needs more paper.",
            B: "Sure, I'll make one right away.",
            C: "The handout was informative.",
            D: "Several copies were distributed.",
          },
          answer: "B",
        },

        {
          id: "e7",
          type: "choose_response",
          accent: "us",
          title: "Listen and Choose a Response",
          prompt: "Listen carefully.",
          audioSrc: "",
          transcript: "How long will the system update take?",
          speakers: [],
          question: "Which response is most appropriate?",
          options: {
            A: "The update fixed several errors.",
            B: "About thirty minutes, I think.",
            C: "The system is on the second floor.",
            D: "Several users logged in earlier.",
          },
          answer: "B",
        },
      ],
    },
  ],
},

m3: {
  title: "Module 3",
  sections: [
    {
      id: "hard_task1",
      type: "hard",
      title: "Hard Module Task 1",
      items: [
        {
          id: "h1",
          type: "choose_response",
          accent: "uk",
          title: "Listen and Choose a Response",
          prompt: "Listen carefully.",
          audioSrc: "",
          transcript: "Shouldn't the revised proposal have been submitted by now?",
          speakers: [],
          question: "Which response is most appropriate?",
          options: {
            A: "The proposal included several charts.",
            B: "Yes, but the director asked for one last change.",
            C: "It was discussed in the meeting room.",
            D: "Several departments reviewed it.",
          },
          answer: "B",
        },

        {
          id: "h2",
          type: "choose_response",
          accent: "au",
          title: "Listen and Choose a Response",
          prompt: "Listen carefully.",
          audioSrc: "",
          transcript: "Who is in charge of organizing the company workshop?",
          speakers: [],
          question: "Which response is most appropriate?",
          options: {
            A: "The workshop agenda was shared with the team yesterday.",
            B: "Whose presentation materials are these on the table?",
            C: "The human resources coordinator is managing the event.",
            D: "Several employees signed up for the workshop already.",
          },
          answer: "C",
        },

        {
          id: "h3",
          type: "choose_response",
          accent: "us",
          title: "Listen and Choose a Response",
          prompt: "Listen carefully.",
          audioSrc: "",
          transcript: "Why haven't the quarterly results been posted on the intranet yet?",
          speakers: [],
          question: "Which response is most appropriate?",
          options: {
            A: "The intranet is easier to access now.",
            B: "Because the figures are still being verified.",
            C: "They were presented at last quarter's meeting.",
            D: "Several employees printed the summary.",
          },
          answer: "B",
        },
      ],
    },
  ],
},
      
    },
  }


export default listeningMock1;