// src/data/listening/chooseResponse/choose_practice2.js

const shuffleArray = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const choose_practice2 = {
  id: "l_choose_set_2",
  title: "Listen and Choose · Practice 2 (20Q)",
  questions: shuffleArray([
    // ====== A 정답 (5) ======
    {
      qNo: 1,
      audioText: "Did you get a chance to read the memo I sent?",
      options: {
        A: "I skimmed it earlier, but I need to reread it carefully.",
        B: "Memos usually have a short subject line at the top.",
        C: "I sent a different message to the team this morning.",
        D: "The printer near the lobby has been jammed all day.",
      },
      answer: "A",
      explanation: {
        core: "메모를 읽었는지, 어느 정도 읽었는지 확인하는 질문.",
        whyCorrect: "A는 읽은 정도를 말하고 추가 확인이 필요하다고 이어서 자연스럽다.",
        whyWrong: {
          B: "형식 일반론이라 질문 의도인 읽었는지 여부에 답하지 않는다.",
          C: "다른 메시지 이야기로 대상을 바꿔서 회피한다.",
          D: "프린터 문제는 메모 읽기와 무관하다.",
        },
      },
    },
    {
      qNo: 2,
      audioText: "Why are you leaving the meeting so early?",
      options: {
        A: "I have a client call in ten minutes, so I need to step out.",
        B: "Meetings feel longer when the room is too warm.",
        C: "The agenda was shared yesterday, so everyone knows it.",
        D: "Early departures can look rude to some people.",
      },
      answer: "A",
      explanation: {
        core: "회의를 일찍 나가는 이유를 묻는 질문.",
        whyCorrect: "A는 곧 시작되는 일정 때문에 나가야 한다는 이유를 직접 제시한다.",
        whyWrong: {
          B: "환경 불평이라 조기 퇴장 이유로 설득력이 약하다.",
          C: "안건 공유는 조기 퇴장 이유가 아니다.",
          D: "일반 의견이라 본인 상황 설명이 아니다.",
        },
      },
    },
    {
      qNo: 3,
      audioText: "Did you check the final draft before submitting it?",
      options: {
        A: "I reviewed the key sections and fixed a few small errors.",
        B: "Drafts tend to change a lot right before deadlines.",
        C: "The submission page was slow, so I waited a bit.",
        D: "I saved several versions in case we need to compare.",
      },
      answer: "A",
      explanation: {
        core: "제출 전에 최종본을 확인했는지 묻는 질문.",
        whyCorrect: "A는 검토했다는 행동과 무엇을 했는지까지 자연스럽게 말한다.",
        whyWrong: {
          B: "일반론이라 본인 행동 여부가 불명확하다.",
          C: "페이지 속도는 검토 여부와 별개다.",
          D: "저장 습관은 검토 여부에 직접 답이 아니다.",
        },
      },
    },
    {
      qNo: 4,
      audioText: "Aren’t you supposed to meet the professor at two?",
      options: {
        A: "I noted the time, but the office moved to another floor.",
        B: "Professors usually stay busy during exam week.",
        C: "Two oclock meetings often run longer than planned.",
        D: "I saw a student waiting outside the office earlier.",
      },
      answer: "A",
      explanation: {
        core: "부정의문문으로 약속 시간 여부를 확인하는 질문.",
        whyCorrect: "A는 약속을 알고 있으면서도 상황 변화로 혼선이 생겼음을 설명한다.",
        whyWrong: {
          B: "바쁨 일반론이라 본인 약속 여부가 빠져 있다.",
          C: "회의 길이 일반론이라 질문 의도를 비킨다.",
          D: "다른 사람 목격은 본인 약속과 무관하다.",
        },
      },
    },
    {
      qNo: 5,
      audioText: "Could you forward the email thread to the new team member?",
      options: {
        A: "I can forward it and include a brief summary of the context.",
        B: "Email threads get confusing when there are too many replies.",
        C: "New team members usually learn systems within a week.",
        D: "The subject line should be updated for clarity.",
      },
      answer: "A",
      explanation: {
        core: "요청을 받아줄 수 있는지, 어떻게 해줄 수 있는지 묻는 상황.",
        whyCorrect: "A는 전달 가능하다고 응답하고, 맥락까지 돕겠다는 흐름이 자연스럽다.",
        whyWrong: {
          B: "일반 불평이라 요청 수락 여부가 없다.",
          C: "신입 적응 속도는 요청과 무관하다.",
          D: "제목 수정은 핵심 요청인 전달과 다르다.",
        },
      },
    },

    // ====== B 정답 (5) ======
    {
      qNo: 6,
      audioText: "Do you know where the seminar is being held?",
      options: {
        A: "Seminars are helpful when you take notes consistently.",
        B: "It is scheduled in the main auditorium on the first floor.",
        C: "The speaker is known for answering questions quickly.",
        D: "I read about the topic in a magazine last week.",
      },
      answer: "B",
      explanation: {
        core: "세미나 장소를 묻는 질문.",
        whyCorrect: "B는 구체적인 장소 정보를 제공해 질문 의도에 정확히 맞는다.",
        whyWrong: {
          A: "학습 조언이라 위치 정보가 없다.",
          C: "발표자 특징은 장소와 무관하다.",
          D: "읽은 경험은 장소와 관련 없다.",
        },
      },
    },
    {
      qNo: 7,
      audioText: "Why did you cancel the reservation?",
      options: {
        A: "Reservations are usually required for large groups.",
        B: "The client postponed the visit, so we rescheduled it.",
        C: "The restaurant has a reputation for quick service.",
        D: "I prefer places that are quiet in the evening.",
      },
      answer: "B",
      explanation: {
        core: "예약을 취소한 이유를 묻는 질문.",
        whyCorrect: "B는 취소 사유를 일정 변경과 연결해 명확히 설명한다.",
        whyWrong: {
          A: "일반 규칙 설명이라 이유가 아니다.",
          C: "식당 평판은 취소 이유가 아니다.",
          D: "선호는 취소의 직접 이유가 되기 어렵다.",
        },
      },
    },
    {
      qNo: 8,
      audioText: "Did you receive the updated schedule?",
      options: {
        A: "Schedules change often when a project gets bigger.",
        B: "It arrived in my inbox earlier, and I saved it right away.",
        C: "The calendar on the wall is still showing last month.",
        D: "I checked the time twice before I left the office.",
      },
      answer: "B",
      explanation: {
        core: "업데이트된 일정표를 받았는지 확인하는 질문.",
        whyCorrect: "B는 수신 사실과 후속 행동을 말해 자연스럽고 확실하다.",
        whyWrong: {
          A: "변경 일반론이라 수신 여부가 없다.",
          C: "벽 달력은 디지털 일정 수신과 다르다.",
          D: "시간 확인은 일정 수신과 무관하다.",
        },
      },
    },
    {
      qNo: 9,
      audioText: "Are you joining us for the workshop tomorrow?",
      options: {
        A: "Workshops are useful when you practice with others.",
        B: "I registered last week, so it is already on my calendar.",
        C: "Tomorrow might rain, so commuting could be slower.",
        D: "The room fits about fifty people when it is arranged well.",
      },
      answer: "B",
      explanation: {
        core: "내일 워크숍 참여 여부를 묻는 질문.",
        whyCorrect: "B는 등록을 근거로 참여 의사를 간접적으로 확실하게 보여준다.",
        whyWrong: {
          A: "워크숍 일반 평가라 참석 여부가 없다.",
          C: "날씨는 참석 여부와 직접 관련이 없다.",
          D: "수용 인원은 참석 답변이 아니다.",
        },
      },
    },
    {
      qNo: 10,
      audioText: "Did the supplier confirm the order details?",
      options: {
        A: "Suppliers usually respond faster in the morning.",
        B: "They sent a confirmation message with the item list.",
        C: "The package weight can change depending on packing.",
        D: "Shipping costs increased after the new policy started.",
      },
      answer: "B",
      explanation: {
        core: "주문 내용이 확정되었는지 확인하는 질문.",
        whyCorrect: "B는 확인 메시지를 받았다고 말해 질문에 सीधे 답한다.",
        whyWrong: {
          A: "응답 시간 일반론이라 확인 여부가 없다.",
          C: "포장 무게는 주문 확정과 다르다.",
          D: "배송비는 확인 여부와 무관하다.",
        },
      },
    },

    // ====== C 정답 (5) ======
    {
      qNo: 11,
      audioText: "Should we print extra copies for the guests?",
      options: {
        A: "Guests often arrive earlier than the invitation suggests.",
        B: "Copies are stored in the cabinet next to the printer.",
        C: "It might be safer to print a few more, just in case.",
        D: "The printer makes noise when it warms up.",
      },
      answer: "C",
      explanation: {
        core: "추가 인쇄를 해야 하는지에 대한 제안형 질문.",
        whyCorrect: "C는 제안에 동의하며 예방적 이유를 덧붙여 자연스럽다.",
        whyWrong: {
          A: "도착 습관은 인쇄 결정과 직접 연결이 약하다.",
          B: "보관 위치는 인쇄 필요 여부에 답이 아니다.",
          D: "소음은 의사결정과 무관하다.",
        },
      },
    },
    {
      qNo: 12,
      audioText: "Did you finish editing the report?",
      options: {
        A: "Reports take time when you verify every number carefully.",
        B: "Editing helps readers understand the main point faster.",
        C: "I completed the revisions last night and exported a clean file.",
        D: "The file name changed when I moved it to a new folder.",
      },
      answer: "C",
      explanation: {
        core: "보고서 편집 완료 여부를 묻는 질문.",
        whyCorrect: "C는 완료 사실과 결과물을 함께 말해 자연스럽고 명확하다.",
        whyWrong: {
          A: "일반론이라 완료 여부가 없다.",
          B: "편집의 장점 설명은 답이 아니다.",
          D: "파일 이름 변경은 완료 여부와 다르다.",
        },
      },
    },
    {
      qNo: 13,
      audioText: "Is the conference room available at two?",
      options: {
        A: "Rooms get booked quickly during the end of the quarter.",
        B: "Two oclock meetings sometimes start a little late.",
        C: "It is reserved until three, so we need another time.",
        D: "The room projector was replaced last month.",
      },
      answer: "C",
      explanation: {
        core: "2시에 사용 가능한지 묻는 질문.",
        whyCorrect: "C는 예약 상태를 근거로 불가능함을 정확히 알려준다.",
        whyWrong: {
          A: "일반 상황 설명이라 해당 시간 답이 아니다.",
          B: "시작 지연은 사용 가능 여부와 별개다.",
          D: "장비 교체는 예약 여부와 무관하다.",
        },
      },
    },
    {
      qNo: 14,
      audioText: "Why are you checking the spreadsheet again?",
      options: {
        A: "Spreadsheets look messy when the columns are not aligned.",
        B: "Checking twice can be a good habit before a presentation.",
        C: "I noticed a small inconsistency in the totals earlier.",
        D: "The chart color looks different on my screen.",
      },
      answer: "C",
      explanation: {
        core: "다시 확인하는 이유를 묻는 질문.",
        whyCorrect: "C는 재확인의 직접 원인인 오류 의심을 제시한다.",
        whyWrong: {
          A: "정렬 불만은 재확인 이유로 약하다.",
          B: "습관론이라 현재 행동의 구체 이유가 아니다.",
          D: "색상 차이는 합계 재확인과 무관하다.",
        },
      },
    },
    {
      qNo: 15,
      audioText: "Did you talk to the finance team about the invoice?",
      options: {
        A: "Finance usually handles payments and monthly reporting.",
        B: "Their team sits upstairs near the meeting rooms.",
        C: "I discussed the invoice with them and took notes afterward.",
        D: "The deadline is near, so everyone is rushing.",
      },
      answer: "C",
      explanation: {
        core: "재무팀과 실제로 이야기했는지 확인하는 질문.",
        whyCorrect: "C는 대화 사실과 후속 행동까지 말해 자연스럽다.",
        whyWrong: {
          A: "업무 범위 설명은 대화 여부 답이 아니다.",
          B: "위치 정보는 대화 여부와 무관하다.",
          D: "바쁨 일반론으로 질문을 비킨다.",
        },
      },
    },

    // ====== D 정답 (5) ======
    {
      qNo: 16,
      audioText: "Could you send me the file in a different format?",
      options: {
        A: "Different formats can be confusing when names look similar.",
        B: "The file is stored on the shared drive for the project.",
        C: "I used a template, so the layout should stay consistent.",
        D: "PDF should work, and I can export it within a minute.",
      },
      answer: "D",
      explanation: {
        core: "다른 형식으로 보내달라는 요청에 대한 응답.",
        whyCorrect: "D는 가능한 형식을 제안하고 실행 가능성도 함께 보여준다.",
        whyWrong: {
          A: "일반 의견이라 실제 행동이 없다.",
          B: "저장 위치는 형식 변경 요청과 다르다.",
          C: "템플릿 언급은 형식 변경 답변이 아니다.",
        },
      },
    },
    {
      qNo: 17,
      audioText: "Why don’t you ask the front desk for directions?",
      options: {
        A: "The front desk area is crowded around lunchtime.",
        B: "Directions are easier when you have a printed map.",
        C: "I tried using my phone, but the signal is weak inside.",
        D: "That makes sense, and I will check with them downstairs.",
      },
      answer: "D",
      explanation: {
        core: "Why don’t you 형태의 제안에 대한 반응.",
        whyCorrect: "D는 제안을 수용하고 구체적으로 행동하겠다고 이어서 자연스럽다.",
        whyWrong: {
          A: "혼잡도 정보는 제안 수용 여부가 없다.",
          B: "지도 일반론으로 대화가 어색해진다.",
          C: "신호 문제만 말해 제안에 대한 반응이 약하다.",
        },
      },
    },
    {
      qNo: 18,
      audioText: "You look exhausted. Did you stay up studying?",
      options: {
        A: "Studying requires focus, so I avoid noisy places.",
        B: "The library was crowded, so I left earlier than usual.",
        C: "I drank coffee late, and it made it hard to sleep.",
        D: "I spent most of the night preparing for the quiz today.",
      },
      answer: "D",
      explanation: {
        core: "밤새 공부했는지 확인하는 질문.",
        whyCorrect: "D는 밤늦게까지 준비했다는 내용으로 질문에 직접 대응한다.",
        whyWrong: {
          A: "공부 조언으로 흐려진다.",
          B: "도서관 혼잡은 밤샘 여부 답이 아니다.",
          C: "커피는 힌트지만 핵심 질문에 비해 우회적이다.",
        },
      },
    },
    {
      qNo: 19,
      audioText: "Did you reserve a spot for the department workshop?",
      options: {
        A: "Workshops are held every month, so spots fill quickly.",
        B: "The department sent an email with the registration link.",
        C: "RSVP is a common term, but people use it differently.",
        D: "I plan to register today once I confirm my schedule.",
      },
      answer: "D",
      explanation: {
        core: "예약 여부를 확인하는 질문.",
        whyCorrect: "D는 아직 확정 전이며 오늘 등록할 계획임을 자연스럽게 말한다.",
        whyWrong: {
          A: "일반 정보로 예약 여부가 없다.",
          B: "이메일 언급은 행동 여부와 별개다.",
          C: "어원 설명은 대화 응답으로 부자연스럽다.",
        },
      },
    },
    {
      qNo: 20,
      audioText: "Do you mind if I borrow your notes from yesterday’s lecture?",
      options: {
        A: "The notes were detailed, so they took a while to organize.",
        B: "I borrowed someone else’s notes once when I was absent.",
        C: "Yesterday’s lecture ended earlier than usual for some reason.",
        D: "You can use them tonight, as long as they come back tomorrow.",
      },
      answer: "D",
      explanation: {
        core: "노트를 빌려도 되는지 허락을 구하는 질문.",
        whyCorrect: "D는 빌려도 된다는 허락과 반환 조건을 함께 제시한다.",
        whyWrong: {
          A: "노트 품질 설명만 있고 허락 여부가 없다.",
          B: "과거 경험이라 현재 요청에 답하지 않는다.",
          C: "수업 종료 시간은 대여 허락과 무관하다.",
        },
      },
    },
  ]),
};