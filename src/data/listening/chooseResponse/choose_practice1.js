// src/data/listening/chooseResponse/choose_practice1.js

const shuffleArray = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const choose_practice1 = {
  id: "l_choose_set_1",
  title: "Listen and Choose · Practice 1 (20Q)",
  questions: shuffleArray([
    // ====== A 정답 (5) ======
    {
      qNo: 1,
      audioText: "Aren’t you supposed to present first today?",
      options: {
        A: "I thought the schedule had changed.",
        B: "The presentation was about climate change.",
        C: "First place usually gets a prize.",
        D: "I prefer working in groups.",
      },
      answer: "A",
      explanation: {
        core: "부정의문문으로 ‘원래 네가 첫 발표 아니야?’를 확인/지적.",
        whyCorrect: "A는 ‘일정이 바뀐 줄 알았다’로 순서 관련 오해를 해명하는 자연스러운 응답.",
        whyWrong: {
          B: "주제 설명이라 순서 확인에 답하지 않음.",
          C: "first=1등으로 오해한 엉뚱한 반응.",
          D: "선호 말하기로 질문과 무관.",
        },
      },
    },
    {
      qNo: 2,
      audioText: "Did you remember to submit the form before noon?",
      options: {
        A: "Yes, I turned it in this morning.",
        B: "Noon is my favorite time for lunch.",
        C: "The form had several pages.",
        D: "I’ll print it in the library.",
      },
      answer: "A",
      explanation: {
        core: "마감(정오 전) 제출 여부 확인 질문.",
        whyCorrect: "A는 ‘오늘 아침 제출했다’로 Yes + 완료 사실을 정확히 답함.",
        whyWrong: {
          B: "시간에 대한 개인 취향으로 질문 회피.",
          C: "서류 구성 설명은 irrelevant.",
          D: "미래 계획만 말해 ‘제출했냐’에 답이 안 됨.",
        },
      },
    },
    {
      qNo: 3,
      audioText: "Could you lower your voice a little?",
      options: {
        A: "Oh, sorry—I didn’t realize I was that loud.",
        B: "My voice sounds different on recordings.",
        C: "The lecture hall is usually noisy.",
        D: "I spoke with the professor earlier.",
      },
      answer: "A",
      explanation: {
        core: "요청(목소리 낮춰줘) → 사과/수용이 자연스러움.",
        whyCorrect: "A는 즉시 사과하고 상황을 인정해 요청을 수용.",
        whyWrong: {
          B: "녹음 얘기는 무관.",
          C: "환경 탓으로 흐림.",
          D: "교수와 대화는 무관.",
        },
      },
    },
    {
      qNo: 4,
      audioText: "Weren’t you going to meet me at the café at three?",
      options: {
        A: "I got stuck in traffic, but I’m on my way now.",
        B: "The café sells great sandwiches.",
        C: "Three cups of coffee is too much.",
        D: "I met her last semester.",
      },
      answer: "A",
      explanation: {
        core: "약속 확인(3시에 카페) + 왜 안 왔냐 뉘앙스.",
        whyCorrect: "A는 지연 이유(교통) + 현재 이동 중을 제시해 가장 자연스러움.",
        whyWrong: {
          B: "카페 설명은 irrelevant.",
          C: "숫자(three) 말장난 수준.",
          D: "사람 이야기로 무관.",
        },
      },
    },
    {
      qNo: 5,
      audioText: "Do you want me to email you the slides after class?",
      options: {
        A: "Yes, that would be great—thank you.",
        B: "Slides are made of plastic.",
        C: "Class ends at 4:20 today.",
        D: "I didn’t bring my laptop charger.",
      },
      answer: "A",
      explanation: {
        core: "호의 제안(슬라이드 보내줄까?) → 수락/거절 응답 필요.",
        whyCorrect: "A는 감사 + 수락으로 가장 자연스러운 대화 흐름.",
        whyWrong: {
          B: "slide 의미를 엉뚱하게 해석.",
          C: "시간 정보로 회피.",
          D: "충전기 얘기는 무관.",
        },
      },
    },

    // ====== B 정답 (5) ======
    {
      qNo: 6,
      audioText: "Why didn’t you attend the review session yesterday?",
      options: {
        A: "It reviewed several important chapters.",
        B: "I had to finish a group project instead.",
        C: "The session was held in Room 204.",
        D: "I usually review before exams.",
      },
      answer: "B",
      explanation: {
        core: "불참 이유를 묻는 질문.",
        whyCorrect: "B는 구체적 이유(조별과제)로 질문 의도에 정확히 답함.",
        whyWrong: {
          A: "내용 설명일 뿐 이유가 아님.",
          C: "장소 정보로 회피.",
          D: "습관 설명이라 어제 불참과 연결 약함.",
        },
      },
    },
    {
      qNo: 7,
      audioText: "Did you understand what the professor meant by 'bias'?",
      options: {
        A: "The professor is in his office now.",
        B: "Not really—could you explain it again?",
        C: "Bias can be found in the cafeteria.",
        D: "I wrote it in my notebook.",
      },
      answer: "B",
      explanation: {
        core: "이해 여부 확인 질문.",
        whyCorrect: "B는 이해 못했음을 인정 + 재설명 요청으로 자연스러움.",
        whyWrong: {
          A: "교수 위치는 irrelevant.",
          C: "단어를 엉뚱하게 연결.",
          D: "적었다고 해서 이해했다는 답이 아님.",
        },
      },
    },
    {
      qNo: 8,
      audioText: "Do you know where the nearest printer is?",
      options: {
        A: "Printing is cheaper online.",
        B: "There’s one on the second floor.",
        C: "I prefer digital documents.",
        D: "The paper feels too thin.",
      },
      answer: "B",
      explanation: {
        core: "위치 질문 → 구체적 위치 안내가 필요.",
        whyCorrect: "B는 층/랜드마크까지 제공해 가장 실용적인 응답.",
        whyWrong: {
          A: "가격 비교로 흐림.",
          C: "선호로 회피.",
          D: "종이 품질은 irrelevant.",
        },
      },
    },
    {
      qNo: 9,
      audioText: "Are you free to join our study group this weekend?",
      options: {
        A: "Weekends are always busy on campus.",
        B: "I’m visiting my family.",
        C: "Study groups meet in the library.",
        D: "This weekend’s weather should be nice.",
      },
      answer: "B",
      explanation: {
        core: "가능 여부(참석 가능?) 질문.",
        whyCorrect: "B는 불가능 + 이유 제시로 가장 자연스러움.",
        whyWrong: {
          A: "일반론이라 본인 답이 아님.",
          C: "장소 정보만 제공.",
          D: "날씨는 irrelevant.",
        },
      },
    },
    {
      qNo: 10,
      audioText: "What did you think of the guest speaker?",
      options: {
        A: "Speakers need microphones.",
        B: "She was clearer than I expected.",
        C: "The guest arrived at noon.",
        D: "I sat near the back because I was late.",
      },
      answer: "B",
      explanation: {
        core: "평가 질문(어땠어?) → 인상/평가 응답 필요.",
        whyCorrect: "B는 구체적 평가(명확했다, Q&A)로 자연스러움.",
        whyWrong: {
          A: "일반론.",
          C: "시간 사실만.",
          D: "좌석 위치는 irrelevant.",
        },
      },
    },

    // ====== C 정답 (5) ======
    {
      qNo: 11,
      audioText: "Wasn’t the professor going to extend the deadline?",
      options: {
        A: "Deadlines are important for students.",
        B: "Yes, the professor teaches chemistry.",
        C: "I heard she decided not to after all.",
        D: "The assignment is about genetics.",
      },
      answer: "C",
      explanation: {
        core: "마감 연장 여부(소문/기대) 확인.",
        whyCorrect: "C는 ‘결국 안 하기로’라는 결정 변경 정보를 제공해 정면 대응.",
        whyWrong: {
          A: "일반론.",
          B: "전공 정보 irrelevant.",
          D: "주제 정보 irrelevant.",
        },
      },
    },
    {
      qNo: 12,
      audioText: "Isn’t the study group meeting in the library tonight?",
      options: {
        A: "The library has three floors.",
        B: "I studied there yesterday.",
        C: "Actually, they moved it to the student center.",
        D: "Night classes are tiring for all students.",
      },
      answer: "C",
      explanation: {
        core: "장소 확인 질문 → 장소 변경/정정이 필요.",
        whyCorrect: "C는 ‘학생회관으로 옮김’으로 최신 정보 제공.",
        whyWrong: {
          A: "도서관 정보 irrelevant.",
          B: "개인 경험 irrelevant.",
          D: "피로감으로 이탈.",
        },
      },
    },
    {
      qNo: 13,
      audioText: "Shouldn’t we reserve the lab equipment in advance?",
      options: {
        A: "The lab closes at six today.",
        B: "Equipment is expensive.",
        C: "Yes, it fills up quickly during finals week.",
        D: "I prefer working alone.",
      },
      answer: "C",
      explanation: {
        core: "제안(미리 예약하자) → 동의/반대 필요.",
        whyCorrect: "C는 동의 + 근거까지 제시해 가장 자연스러움.",
        whyWrong: {
          A: "운영시간은 직접 답이 아님.",
          B: "가격은 irrelevant.",
          D: "개인 선호로 이탈.",
        },
      },
    },
    {
      qNo: 14,
      audioText: "Did you end up buying the used textbook?",
      options: {
        A: "Textbooks are heavy to carry around.",
        B: "I prefer brand-new copies of the report.",
        C: "No, someone sold out before I could.",
        D: "The bookstore closes at five.",
      },
      answer: "C",
      explanation: {
        core: "결과 확인(결국 샀어?) 질문.",
        whyCorrect: "C는 못 산 이유(먼저 팔림)를 설명하며 질문에 직접 답함.",
        whyWrong: {
          A: "무게 얘기 irrelevant.",
          B: "선호만 말함(샀는지 여부 불명).",
          D: "영업시간은 irrelevant.",
        },
      },
    },
    {
      qNo: 15,
      audioText: "Didn’t the campus bus stop running earlier than usual today?",
      options: {
        A: "Buses are convenient on rainy days.",
        B: "The stop is near the main gate.",
        C: "Yeah, they changed the schedule for maintenance.",
        D: "I like walking to class.",
      },
      answer: "C",
      explanation: {
        core: "부정의문문으로 ‘오늘 버스 일찍 끊긴 거 아니야?’ 확인.",
        whyCorrect: "C는 원인(정비로 시간표 변경)을 제공해 정확히 대응.",
        whyWrong: {
          A: "일반론.",
          B: "위치 정보 irrelevant.",
          D: "선호로 이탈.",
        },
      },
    },

    // ====== D 정답 (5) ======
    {
      qNo: 16,
      audioText: "Do you mind if I borrow your notes from class?",
      options: {
        A: "The notes were very detailed.",
        B: "I borrowed them last week.",
        C: "Class ended early yesterday.",
        D: "Sure—just return them by tomorrow morning.",
      },
      answer: "D",
      explanation: {
        core: "허락 요청(노트 빌려도 돼?) → 허락/조건 제시 가능.",
        whyCorrect: "D는 허락 + 반환 기한 조건까지 제시해 자연스러운 응답.",
        whyWrong: {
          A: "품질 평가만 하고 허락 여부 불명.",
          B: "과거 얘기로 맥락 어긋남.",
          C: "수업 종료 시간은 irrelevant.",
        },
      },
    },
    {
      qNo: 17,
      audioText: "Why don’t you ask the teaching assistant for clarification?",
      options: {
        A: "The assistant explained the theory.",
        B: "Clarification is important in research.",
        C: "Class ended ten minutes ago.",
        D: "That’s a good idea—I’ll talk to her after class.",
      },
      answer: "D",
      explanation: {
        core: "Why don’t you~ 제안/권유 → 수용/거절로 답하는 게 자연스러움.",
        whyCorrect: "D는 제안을 수용하고 ‘수업 끝나고 물어볼게’로 대화 흐름 완벽.",
        whyWrong: {
          A: "사실 진술만 하고 수용/거절이 없음.",
          B: "일반론.",
          C: "시간 정보만 제공해 수용 여부 불명확.",
        },
      },
    },
    {
      qNo: 18,
      audioText: "You look exhausted—did you stay up all night studying?",
      options: {
        A: "Studying requires a quiet place.",
        B: "The library was crowded because of finals yesterday.",
        C: "I worked out pretty late at midnight.",
        D: "Pretty much. I had to study for the quiz.",
      },
      answer: "D",
      explanation: {
        core: "상태 관찰 + 확인(밤샜어?) → 인정/부정 + 이유가 자연스러움.",
        whyCorrect: "D는 ‘거의 밤샜다’ + 이유(2챕터)로 질문에 직접 답함.",
        whyWrong: {
          A: "일반론.",
          B: "혼잡도 정보 irrelevant.",
          C: "커피는 힌트지만 ‘밤샜냐’에 직접 답은 약함.",
        },
      },
    },
    {
      qNo: 19,
      audioText: "Did you already reserve for the department workshop?",
      options: {
        A: "Workshops are held every month.",
        B: "The department sent an email.",
        C: "RSVP stands for a French phrase.",
        D: "I'll probably do it today.",
      },
      answer: "D",
      explanation: {
        core: "reserved 여부 확인.",
        whyCorrect: "D는 ‘아직’ + 이유로 자연스러운 응답.",
        whyWrong: {
          A: "일반 정보.",
          B: "이메일 언급은 무관.",
          C: "어원 설명은 대화 응답으로 부자연.",
        },
      },
    },
    {
      qNo: 20,
      audioText: "Could you send me the file in a different format?",
      options: {
        A: "Files take up a lot of storage.",
        B: "Different formats can be confusing.",
        C: "I used a template for that file.",
        D: "Of course. Would PDF work for you?",
      },
      answer: "D",
      explanation: {
        core: "요청(다른 형식) → 수락 + 형식 확인이 자연스러움.",
        whyCorrect: "D는 요청 수락 + ‘PDF 괜찮아?’로 다음 행동까지 매끄러움.",
        whyWrong: {
          A: "용량 일반론.",
          B: "혼란 일반론.",
          C: "템플릿 언급 irrelevant.",
        },
      },
    },
  ]),
};