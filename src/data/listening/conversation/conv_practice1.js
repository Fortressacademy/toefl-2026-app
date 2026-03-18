// src/data/listening/conversation/conv_practice1.js

const shuffleArray = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const conv_practice1 = {
  id: "l_conv_set_1",
  title: "Listen to a Conversation · Practice 1 (10Q)",
  // ✅ 대화 스크립트(두 스피커)
  conversation: {
    speakers: {
      A: { label: "Student" },
      B: { label: "Staff" },
    },
    turns: [
      { spk: "A", text: "Hi, I’m trying to register for the afternoon lab, but it says the section is full." },
      { spk: "B", text: "Let me check. That section is capped, but a few students usually drop within the first week." },
      { spk: "A", text: "Is there a waitlist, or should I just keep refreshing the page?" },
      { spk: "B", text: "Use the waitlist. And if you attend the first session, the instructor can add you if seats open." },
    ],
  },

  // ✅ 문제(예시는 1문항만. 형식만 참고)
  questions: shuffleArray([
    {
      qNo: 1,
      // ✅ Conversation 파트는 audioText 대신 “질문”만 두는 걸 추천
      prompt: "What does the staff member suggest the student do?",
      options: {
        A: "Join the waitlist and attend the first session",
        B: "Switch to a morning section immediately",
        C: "Email the department chair for an override",
        D: "Refresh the registration page until a seat appears",
      },
      answer: "A",
      explanation: {
        core: "직원이 학생에게 권하는 행동을 묻는 문제.",
        whyCorrect: "직원은 waitlist를 쓰고 첫 수업에 참석하면 자리가 나면 추가될 수 있다고 말한다.",
        whyWrong: {
          B: "다른 시간대로 즉시 바꾸라는 말은 없다.",
          C: "학과장에게 override 요청하라는 내용이 없다.",
          D: "페이지 새로고침 대신 waitlist를 쓰라고 했다.",
        },
      },
    },
  ]),
};