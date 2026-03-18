// src/data/listening/chooseResponse/choose_practice3.js

const shuffleArray = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const choose_practice3 = {
  id: "l_choose_set_3",
  title: "Listen and Choose · Practice 3 (20Q)",
  questions: shuffleArray([
    // ====== A 정답 (5) ======
    {
      qNo: 1,
      audioText: "Did you remember to attach the updated file?",
      options: {
        A: "Yes, I attached the updated version and removed the older one.",
        B: "Updated files are easier to track when names are consistent.",
        C: "Attachments can make inboxes harder to organize later.",
        D: "I usually keep important files in the shared project folder.",
      },
      answer: "A",
      explanation: {
        core: "업데이트 파일을 첨부했는지 확인하는 질문.",
        whyCorrect: "A는 첨부 여부에 직접 답하고 어떤 버전을 보냈는지도 분명히 말한다.",
        whyWrong: {
          B: "파일 관리 팁이라 첨부했는지 여부가 없다.",
          C: "일반론으로 질문을 비킨다.",
          D: "저장 습관은 첨부 여부와 무관하다.",
        },
      },
    },
    {
      qNo: 2,
      audioText: "Why are you waiting outside the office?",
      options: {
        A: "I have an appointment at two, so I arrived a little early.",
        B: "The hallway gets quieter after most classes begin.",
        C: "I saw a notice about office hours near the bulletin board.",
        D: "This building has brighter lights than the one across campus.",
      },
      answer: "A",
      explanation: {
        core: "밖에서 기다리는 이유를 묻는 질문.",
        whyCorrect: "A는 기다리는 이유를 약속 시간과 연결해 가장 직접적으로 설명한다.",
        whyWrong: {
          B: "소음 수준은 기다리는 이유로 성립하지 않는다.",
          C: "공지 목격은 이유가 아니라 계기일 뿐이다.",
          D: "조명 비교는 질문 의도와 무관하다.",
        },
      },
    },
    {
      qNo: 3,
      audioText: "Did you figure out why the invoice total was wrong?",
      options: {
        A: "Yes, there was a duplicate line item, so I fixed the total.",
        B: "Invoices should be sent before the end of the month.",
        C: "The vendor address was missing on the first page.",
        D: "The payment system is slower when many people log in.",
      },
      answer: "A",
      explanation: {
        core: "청구서 합계 오류 원인을 찾았는지 묻는 질문.",
        whyCorrect: "A는 원인을 명확히 말하고 해결까지 했다고 답해 가장 적절하다.",
        whyWrong: {
          B: "발송 시기 원칙은 합계 오류 원인과 무관하다.",
          C: "주소 누락은 합계 오류를 설명하지 못한다.",
          D: "시스템 속도는 합계 계산 오류와 관계없다.",
        },
      },
    },
    {
      qNo: 4,
      audioText: "Aren’t you supposed to be in the training session right now?",
      options: {
        A: "Yes, but my call ran long, so I switched to the later session.",
        B: "Training sessions are useful for understanding company policy.",
        C: "The trainer prepared a handout with several examples.",
        D: "Right now is busy for everyone in our department.",
      },
      answer: "A",
      explanation: {
        core: "지금 참석해야 하는 일정이 맞는지 확인하며 지적하는 질문.",
        whyCorrect: "A는 원래 참석 예정이었음을 인정하고 일정 변경 이유를 분명히 말한다.",
        whyWrong: {
          B: "일반 평가라 본인 일정에 대한 답이 아니다.",
          C: "자료 내용은 참석 여부 해명과 무관하다.",
          D: "바쁨 일반론은 개인 상황 설명이 아니다.",
        },
      },
    },
    {
      qNo: 5,
      audioText: "Could you cover the phone line for a few minutes?",
      options: {
        A: "Yes, I can answer calls while you finish what you are doing.",
        B: "The phone line gets busier around lunchtime on weekdays.",
        C: "The last caller sounded impatient during the conversation.",
        D: "I prefer email when I need to send detailed information.",
      },
      answer: "A",
      explanation: {
        core: "잠시 전화 응대를 대신해 달라는 요청.",
        whyCorrect: "A는 요청을 수락하고 도움 범위를 분명히 한다.",
        whyWrong: {
          B: "혼잡 시간 정보일 뿐 수락 여부가 없다.",
          C: "이전 통화 평가는 요청 응답이 아니다.",
          D: "선호 말하기로 요청을 직접 처리하지 않는다.",
        },
      },
    },

    // ====== B 정답 (5) ======
    {
      qNo: 6,
      audioText: "Do you know where the orientation starts?",
      options: {
        A: "Orientation helps new members learn the basic procedures.",
        B: "It starts in the lecture hall next to the main lobby.",
        C: "The schedule says it will last about forty minutes.",
        D: "I brought a notebook so I can take clear notes.",
      },
      answer: "B",
      explanation: {
        core: "오리엔테이션 시작 장소를 묻는 질문.",
        whyCorrect: "B는 장소를 구체적으로 알려 주어 질문 의도에 정확히 맞는다.",
        whyWrong: {
          A: "의미 설명이라 장소 정보가 없다.",
          C: "시간 정보는 장소 질문에 답이 아니다.",
          D: "준비물은 장소와 무관하다.",
        },
      },
    },
    {
      qNo: 7,
      audioText: "Why did you switch to a different supplier?",
      options: {
        A: "Suppliers should keep prices stable throughout the year.",
        B: "Their delivery times have been more reliable than the previous one.",
        C: "The new supplier has a more modern looking logo.",
        D: "I saved all supplier documents in the shared drive folder.",
      },
      answer: "B",
      explanation: {
        core: "공급처를 바꾼 이유를 묻는 질문.",
        whyCorrect: "B는 교체 이유로 가장 타당한 기준인 납기 신뢰도를 제시한다.",
        whyWrong: {
          A: "일반 원칙이라 교체 이유가 아니다.",
          C: "로고는 의사결정 이유로 부적절하다.",
          D: "문서 정리는 이유가 아니라 후속 행동이다.",
        },
      },
    },
    {
      qNo: 8,
      audioText: "Did you find a room for the group meeting?",
      options: {
        A: "Group meetings work best when everyone arrives on time.",
        B: "Yes, Room 302 was available, so I booked it for us.",
        C: "The agenda has three items we need to cover today.",
        D: "I printed a sign in sheet for attendance tracking.",
      },
      answer: "B",
      explanation: {
        core: "모임할 방을 찾았는지 결과를 묻는 질문.",
        whyCorrect: "B는 방 확보와 예약까지 했다는 결과를 직접 말한다.",
        whyWrong: {
          A: "일반론이라 방을 찾았는지 답이 없다.",
          C: "안건은 방 확보 여부와 무관하다.",
          D: "출석부 준비는 장소 확보와 별개다.",
        },
      },
    },
    {
      qNo: 9,
      audioText: "Are you coming to the networking event after work?",
      options: {
        A: "Networking events can feel awkward when you do not know anyone.",
        B: "I can stop by after I finish my last appointment.",
        C: "After work traffic is heavy near the downtown area.",
        D: "The event flyer listed several guest speakers.",
      },
      answer: "B",
      explanation: {
        core: "퇴근 후 행사 참석 여부를 묻는 질문.",
        whyCorrect: "B는 참석 의사를 일정과 연결해 가장 자연스럽게 답한다.",
        whyWrong: {
          A: "감상만 말해 참석 여부가 없다.",
          C: "교통 정보는 참석 여부 답이 아니다.",
          D: "전단 내용은 참석 의사 표현이 아니다.",
        },
      },
    },
    {
      qNo: 10,
      audioText: "Did you understand the assignment instructions?",
      options: {
        A: "Instructions matter because they affect the grading criteria.",
        B: "No, I am still confused, so I wrote questions to ask later.",
        C: "The assignment topic seems interesting to a lot of students.",
        D: "I completed a similar task in another class once.",
      },
      answer: "B",
      explanation: {
        core: "지시사항 이해 여부를 묻는 질문.",
        whyCorrect: "B는 이해하지 못했음을 분명히 말하고 다음 행동까지 제시한다.",
        whyWrong: {
          A: "중요성 설명은 이해 여부 답이 아니다.",
          C: "흥미 평가는 이해 여부와 무관하다.",
          D: "과거 경험은 현재 이해 여부를 말하지 않는다.",
        },
      },
    },

    // ====== C 정답 (5) ======
    {
      qNo: 11,
      audioText: "Should we ask for feedback before we finalize the design?",
      options: {
        A: "Design projects often take longer than the first estimate.",
        B: "Feedback can include very different personal preferences.",
        C: "Yes, collecting comments now will help us avoid redoing work.",
        D: "The final version should match the website font style.",
      },
      answer: "C",
      explanation: {
        core: "확정 전에 피드백을 받을지 묻는 제안형 질문.",
        whyCorrect: "C만 제안에 직접 반응하며 찬성과 이유를 동시에 분명히 제시한다.",
        whyWrong: {
          A: "기간 일반론이라 찬반이 없다.",
          B: "피드백 특성 설명일 뿐 제안 수용 여부가 없다.",
          D: "폰트 제안은 질문의 핵심인 피드백 여부와 무관하다.",
        },
      },
    },
    {
      qNo: 12,
      audioText: "Isn’t the class moved to a different room today?",
      options: {
        A: "Rooms change sometimes when events overlap on campus.",
        B: "I arrived early, so the hallway was still empty.",
        C: "Yes, it was moved to Room 118 according to the notice.",
        D: "Today feels colder inside that building than usual.",
      },
      answer: "C",
      explanation: {
        core: "강의실 변경 여부를 확인하는 질문.",
        whyCorrect: "C는 변경 사실과 새 방 번호를 공지 근거로 명확히 말한다.",
        whyWrong: {
          A: "일반론이라 오늘 변경 사실을 주지 않는다.",
          B: "도착 시간은 변경 여부와 무관하다.",
          D: "온도 평가는 장소 확인과 관계 없다.",
        },
      },
    },
    {
      qNo: 13,
      audioText: "Did you choose a topic for your presentation yet?",
      options: {
        A: "Presentation topics should be specific and not too broad.",
        B: "I am interested in topics related to health and technology.",
        C: "Yes, I chose workplace burnout and how teams respond to it.",
        D: "The presentation is scheduled for the end of the month.",
      },
      answer: "C",
      explanation: {
        core: "발표 주제를 정했는지 확인하는 질문.",
        whyCorrect: "C는 선택 완료를 분명히 말하고 구체 주제까지 제시한다.",
        whyWrong: {
          A: "기준 설명은 선택 여부 답이 아니다.",
          B: "관심 분야는 확정 답변이 아니다.",
          D: "일정은 주제 확정과 무관하다.",
        },
      },
    },
    {
      qNo: 14,
      audioText: "Why are you rechecking the numbers on that chart?",
      options: {
        A: "Charts look cleaner when you reduce the number of labels.",
        B: "Numbers can be hard to read when the font is too small.",
        C: "One value did not match the report, so I am verifying it.",
        D: "The color scheme should follow the brand guidelines.",
      },
      answer: "C",
      explanation: {
        core: "숫자를 다시 확인하는 이유를 묻는 질문.",
        whyCorrect: "C는 재검증의 직접 원인인 불일치를 분명히 말한다.",
        whyWrong: {
          A: "디자인 팁이라 이유가 아니다.",
          B: "가독성 일반론은 현재 행동 이유로 부족하다.",
          D: "색상 규정은 숫자 검증과 무관하다.",
        },
      },
    },
    {
      qNo: 15,
      audioText: "Wasn’t the deadline extended until Friday?",
      options: {
        A: "Deadlines feel stressful when several tasks overlap.",
        B: "Friday is usually the busiest day for submissions.",
        C: "No, it stayed the same, so we should finish by Thursday.",
        D: "The assignment includes a short reflection section too.",
      },
      answer: "C",
      explanation: {
        core: "마감 연장 여부를 확인하는 질문.",
        whyCorrect: "C는 연장되지 않았다고 분명히 말하고 안전한 일정 전략을 제시한다.",
        whyWrong: {
          A: "감정 일반론으로 사실 확인이 없다.",
          B: "요일 일반론은 연장 여부 답이 아니다.",
          D: "과제 구성은 마감 변경과 무관하다.",
        },
      },
    },

    // ====== D 정답 (5) ======
    {
      qNo: 16,
      audioText: "Could you review my cover letter before I send it?",
      options: {
        A: "Cover letters should sound confident but still polite.",
        B: "I read a guide about cover letters a few days ago.",
        C: "The job description emphasizes teamwork and communication.",
        D: "Yes, send it to me and I will point out unclear sentences.",
      },
      answer: "D",
      explanation: {
        core: "커버레터를 봐달라는 요청에 대한 응답.",
        whyCorrect: "D는 요청을 수락하고 어떤 도움을 줄지까지 명확히 말한다.",
        whyWrong: {
          A: "일반 조언이라 수락 여부가 없다.",
          B: "읽은 경험은 검토해 주겠다는 답이 아니다.",
          C: "공고 내용은 요청 응답이 아니다.",
        },
      },
    },
    {
      qNo: 17,
      audioText: "Do you mind switching seats so I can plug in my charger?",
      options: {
        A: "Chargers break easily when the cable is bent too often.",
        B: "Seats are assigned sometimes in large lecture halls.",
        C: "The outlet is usually hidden behind the table leg near the wall.",
        D: "No, I can move since I do not need the outlet right now.",
      },
      answer: "D",
      explanation: {
        core: "자리 교체 요청에 대한 응답.",
        whyCorrect: "D는 허락을 분명히 하고 양보 가능한 이유를 제시한다.",
        whyWrong: {
          A: "충전기 내구성은 자리 교체와 무관하다.",
          B: "배정 일반론은 허락 여부가 없다.",
          C: "콘센트 위치 정보는 자리 교체 응답이 아니다.",
        },
      },
    },
    {
      qNo: 18,
      audioText: "Why don’t you send a follow up email to confirm the details?",
      options: {
        A: "Follow up emails can feel repetitive to some recipients.",
        B: "Confirmations are easier when you speak in person.",
        C: "A clear subject line helps people find emails later.",
        D: "Yes, I will send one this afternoon to make sure we agree.",
      },
      answer: "D",
      explanation: {
        core: "Why don’t you 제안에 대한 반응.",
        whyCorrect: "D는 제안을 수락하고 실행 시점과 목적을 분명히 한다.",
        whyWrong: {
          A: "일반 우려라 수락 여부가 없다.",
          B: "대안 제시지만 제안에 대한 직접 반응이 아니다.",
          C: "작성 팁은 제안 수용과 무관하다.",
},
      },
    },
  ]),
};