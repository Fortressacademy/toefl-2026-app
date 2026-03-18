// src/data/reading/mocks/mock4.js

/* =========================
   helper (데이터 안전장치)
   - CTW blank key를 "01"처럼 2자리로 맞춰도 되고, "1"이어도 됨
   - prefixLen 없으면 엔진에서 기본 2로 처리하지만, 데이터 레벨에서도 기본값 넣어줌
========================= */

function withDefaultPrefixLen(blanks, fallback = 2) {
  return (blanks || []).map((b) => ({
    ...b,
    prefixLen: Number.isFinite(b.prefixLen) ? b.prefixLen : fallback,
  }));
}

function normalizePassage(passage) {
  if (!passage) return passage;

  if (Array.isArray(passage.paragraphs)) return passage;

  if (typeof passage.text === "string") {
    const raw = passage.text.split("\n").map((s) => s.trimEnd());
    const paras = [];
    let buf = [];

    raw.forEach((line) => {
      if (line.trim() === "") {
        if (buf.length) {
          paras.push(buf.join(" "));
          buf = [];
        } else {
          paras.push("");
        }
      } else {
        buf.push(line.trim());
      }
    });

    if (buf.length) paras.push(buf.join(" "));
    return { ...passage, paragraphs: paras };
  }

  return passage;
}

export const mock4 = {
  id: "mock4",
  title: "Reading 모의고사 4",
  description: "Adaptive · Module 1 → Module 2/3",
  branching: {
    wrongCut: 3,
    passTo: "m3",
    failTo: "m2",
  },

  modules: {
    // =======================
    // Module 1
    // =======================
    m1: {
      id: "m1",
      title: "Module 1",
      sections: [
        /* ---------- CTW ---------- */
        {
          type: "ctw_paragraph",
          title: "CTW · Paragraph",
          items: [
            {
              id: "m4_ctw_01",
              subject: "biology",
              paragraph:
                "Many biological {{01}} follow a roughly twenty-four-{{02}} cycle known as the circadian {{03}}. These internal rhythms {{04}} important functions such as sleep patterns, hormone {{05}}, and body temperature. The cycle {{06}} strongly {{07}} by environmental signals, especially exposure to {{08}} and darkness. {{09}} these signals change, the body gradually {{10}} its internal clock. However, disruptions to circadian rhythms, such as those experienced by shift workers or international travelers, can negatively affect both physical health and cognitive performance.",

              blanks: withDefaultPrefixLen(
                [
                  { key: "01", answer: "processes", meaning: "과정들", prefixLen: 4 },
                  { key: "02", answer: "hour", meaning: "시간", prefixLen: 2 },
                  { key: "03", answer: "rhythm", meaning: "리듬", prefixLen: 3 },
                  { key: "04", answer: "regulate", meaning: "조절하다", prefixLen: 3 },
                  { key: "05", answer: "production", meaning: "생산", prefixLen: 4 },
                  { key: "06", answer: "is", meaning: "~이다", prefixLen: 1 },
                  { key: "07", answer: "influenced", meaning: "영향을 받는", prefixLen: 4 },
                  { key: "08", answer: "light", meaning: "빛", prefixLen: 2 },
                  { key: "09", answer: "when", meaning: "~할 때", prefixLen: 2 },
                  { key: "10", answer: "adjusts", meaning: "조정한다", prefixLen: 3 },
                ],
                2
              ),

              explanation:
                "이 지문은 circadian rhythm, 즉 생체 리듬을 설명한다. 생물학적 processes는 약 24-hour 주기를 따르며, sleep, hormone production, body temperature 같은 기능을 regulate한다. 특히 light와 darkness 같은 환경 신호가 이 주기에 큰 영향을 미치며, 신호가 바뀌면 몸은 internal clock을 gradually adjusts하게 된다.",
            },
          ],
        },

        /* ---------- Daily Life Passage 1 (3Q) ---------- */
        {
          type: "daily_life",
          title: "Daily Life · Passage 1 (3Q)",
          passage: {
            id: "m4_m1_dl_p1",
            docType: "ads",
            title: "Summer Professional Certification Program",
            brand: "Northbridge Training Institute",
            cta: "Apply early. Confirmation notices will be sent shortly after the registration deadline.",
            body: `Professionals seeking to expand their qualifications may be interested in the Summer Certification Program offered by the Northbridge Training Institute. The program focuses on practical skills in project coordination, workplace communication, and data reporting—areas increasingly valued across many industries.

Courses will run from August 12 to August 16 at the institute’s downtown campus. While the program is open to anyone with at least two years of work experience, priority registration will be given to applicants currently employed in administrative or project-support roles.

The standard tuition fee is $320, which includes course materials and access to post-training consultation sessions with instructors. Applicants who submit their registration forms before July 20 will automatically be considered for a partial tuition waiver, though the number of discounted seats is limited.

Due to space constraints, the institute recommends applying early. Confirmation notices will be sent to selected participants shortly after the registration deadline.`,
          },
          questions: [
            {
              id: "m4_m1_dl1_q1",
              q: "What can be inferred about the Summer Certification Program?",
              options: {
                A: "It is designed primarily for students with no work experience.",
                B: "Some applicants may receive financial assistance.",
                C: "Participants must already work at Northbridge Training Institute.",
                D: "The program will be held at multiple locations.",
              },
              answer: "B",
              explanation:
                "본문에서 partial tuition waiver가 언급되므로 일부 지원자는 수강료 감면, 즉 재정적 지원을 받을 수 있다고 추론할 수 있다.",
            },
            {
              id: "m4_m1_dl1_q2",
              q: "According to the advertisement, which applicants are most likely to be accepted first?",
              options: {
                A: "Employees working in project-support roles",
                B: "University students majoring in business",
                C: "Individuals who previously attended the institute",
                D: "Professionals with more than ten years of experience",
              },
              answer: "A",
              explanation:
                "priority registration will be given to applicants currently employed in administrative or project-support roles라고 명시되어 있다.",
            },
            {
              id: "m4_m1_dl1_q3",
              q: "What is suggested about the number of participants?",
              options: {
                A: "The program may not accept all applicants.",
                B: "The program requires a minimum number of attendees.",
                C: "Participants must attend additional consultation sessions.",
                D: "Only returning students may enroll.",
              },
              answer: "A",
              explanation:
                "Due to space constraints와 selected participants라는 표현으로 보아 지원자가 많을 경우 모두 수용되지는 않을 수 있다.",
            },
          ],
        },

        /* ---------- Daily Life Passage 2 (2Q) ---------- */
        {
          type: "daily_life",
          title: "Daily Life · Passage 2 (2Q)",
          passage: {
            id: "m4_m1_dl_p2",
            docType: "textmessage",
            title: "Messages",
            subtitle: "Laura · Kevin",
            meta: "2:05 p.m.",
            participants: [
              { id: "laura", name: "Laura" },
              { id: "kevin", name: "Kevin" },
            ],
            meId: "laura",
            messages: [
              {
                from: "laura",
                time: "2:05 p.m.",
                text: "Hi Kevin, I just checked the shipment schedule for the display units we ordered for the product launch. It looks like the delivery was pushed back to Friday morning.",
              },
              {
                from: "kevin",
                time: "2:07 p.m.",
                text: "That’s later than expected. The marketing team planned to start setting up the booth Thursday afternoon.",
              },
              {
                from: "laura",
                time: "2:09 p.m.",
                text: "Right. I already asked the supplier whether part of the order could be delivered earlier, but they said the units are being assembled together.",
              },
              {
                from: "kevin",
                time: "2:11 p.m.",
                text: "In that case, maybe we should delay the booth setup until Friday afternoon. I’ll check if the venue staff can still give us access then.",
              },
            ],
          },
          questions: [
            {
              id: "m4_m1_dl2_q1",
              q: "What is implied about the display units?",
              options: {
                A: "They were ordered later than the marketing team expected.",
                B: "They cannot be delivered separately from the rest of the order.",
                C: "They will arrive earlier than originally scheduled.",
                D: "They were requested by the venue staff.",
              },
              answer: "B",
              explanation:
                "Laura가 part of the order만 먼저 배송 가능한지 물었지만 supplier가 units are being assembled together라고 했으므로 따로 배송될 수 없음을 알 수 있다.",
            },
            {
              id: "m4_m1_dl2_q2",
              q: "What will Kevin most likely do next?",
              options: {
                A: "Contact the supplier to change the shipping method",
                B: "Inform the marketing team that the product launch is canceled",
                C: "Ask the venue whether the setup schedule can be adjusted",
                D: "Request that the supplier send replacement display units",
              },
              answer: "C",
              explanation:
                "Kevin이 직접 'I’ll check if the venue staff can still give us access then'이라고 했으므로, venue 쪽에 setup 시간 조정이 가능한지 문의할 가능성이 가장 높다.",
            },
          ],
        },

        /* ---------- Academic Passage (5Q) ---------- */
        {
          type: "academic",
          title: "History · Microhistory (5Q)",
          passage: normalizePassage({
            id: "m4_m1_ac_p1",
            title: "A Small Scale Approach to the Past",
            paragraphs: [
              "Microhistory is a method of historical study that focuses on a very small subject, such as one village, one court case, or even one individual. Instead of examining major wars or political transitions, microhistorians often study ordinary people whose lives were recorded in letters, legal documents, or local archives.",
              "Supporters of this approach argue that small-scale cases can reveal social realities that broad surveys may overlook. A single trial record, for example, may show how common people understood religion, work, or social hierarchy in a particular period. Critics, however, claim that such narrow studies make it difficult to draw broader conclusions. Even so, many historians value microhistory because it restores detail and human complexity to the study of the past.",
            ],
          }),
          questions: [
            {
              id: "m4_m1_ac_q1",
              q: "What is the main purpose of the passage?",
              options: {
                A: "To describe a historical method centered on small cases",
                B: "To explain why large political events are no longer studied",
                C: "To show that archives are usually unreliable",
                D: "To compare religious and legal history",
              },
              answer: "A",
              explanation:
                "지문은 microhistory라는 역사 연구 방법의 대상, 특징, 장단점을 소개하는 데 목적이 있다.",
            },
            {
              id: "m4_m1_ac_q2",
              q: "According to the passage, microhistorians often examine",
              options: {
                A: "satellite images and maps",
                B: "records about everyday individuals",
                C: "only royal documents",
                D: "economic statistics from large regions",
              },
              answer: "B",
              explanation:
                "1단락에서 ordinary people whose lives were recorded in letters, legal documents, or local archives라고 설명한다.",
            },
            {
              id: "m4_m1_ac_q3",
              q: "The word 'broad' in paragraph 2 is closest in meaning to",
              highlight: "broad",
              options: {
                A: "careless",
                B: "popular",
                C: "wide-ranging",
                D: "modern",
              },
              answer: "C",
              explanation:
                "broad surveys는 넓은 범위를 다루는 조사라는 뜻이므로 wide-ranging이 가장 적절하다.",
            },
            {
              id: "m4_m1_ac_q4",
              q: "Why does the author mention a single trial record?",
              options: {
                A: "To suggest that courts were unfair in the past",
                B: "To provide an example of how a small case can reveal larger patterns",
                C: "To show that legal history is the oldest field of research",
                D: "To prove that microhistory is better than all other methods",
              },
              answer: "B",
              explanation:
                "single trial record는 작은 사례가 broader social realities를 드러낼 수 있다는 점을 보여 주는 예시로 제시되었다.",
            },
            {
              id: "m4_m1_ac_q5",
              q: "What can be inferred about critics of microhistory?",
              options: {
                A: "They believe detail has no value in history.",
                B: "They think ordinary people should not be studied.",
                C: "They are concerned about overgeneralizing from a narrow case.",
                D: "They prefer court records to political documents.",
              },
              answer: "C",
              explanation:
                "critics는 narrow studies make it difficult to draw broader conclusions라고 보므로, 좁은 사례에서 너무 큰 일반화를 하는 문제를 우려한다고 볼 수 있다.",
            },
          ],
        },
      ],
    },

    // =======================
    // Module 2 (하위)
    // =======================
    m2: {
      id: "m2",
      title: "Module 2 (Lower)",
      sections: [
        {
          type: "ctw_paragraph",
          title: "CTW · Paragraph (10Q)",
          items: [
            {
              id: "m4_ctw_02",
              subject: "social psychology",
              paragraph:
                "Social loafing refers to the {{01}} for {{02}} to exert less effort when {{03}} in groups than when working alone. Researchers believe this {{04}} occurs {{05}} individual contributions become {{06}} visible {{07}} a group setting. When people feel that their efforts cannot be {{08}} identified, they may {{09}} the {{10}} of effort they invest in a task. Experiments have demonstrated that group productivity can decline if responsibilities are not clearly defined. Understanding this phenomenon helps organizations design more effective teamwork strategies.",

              blanks: withDefaultPrefixLen(
                [
                  { key: "01", answer: "tendency", meaning: "경향", prefixLen: 4 },
                  { key: "02", answer: "individuals", meaning: "개인들", prefixLen: 4 },
                  { key: "03", answer: "working", meaning: "일하는", prefixLen: 4 },
                  { key: "04", answer: "behavior", meaning: "행동", prefixLen: 4 },
                  { key: "05", answer: "because", meaning: "~때문에", prefixLen: 3 },
                  { key: "06", answer: "less", meaning: "덜", prefixLen: 2 },
                  { key: "07", answer: "within", meaning: "~안에서", prefixLen: 3 },
                  { key: "08", answer: "easily", meaning: "쉽게", prefixLen: 3 },
                  { key: "09", answer: "reduce", meaning: "줄이다", prefixLen: 3 },
                  { key: "10", answer: "amount", meaning: "양", prefixLen: 2 },
                ],
                2
              ),

              explanation:
                "이 지문은 social loafing, 즉 집단 속에서 개인이 혼자 일할 때보다 덜 노력하는 현상을 설명한다. 이는 individual contributions가 less visible within a group setting이 되기 때문이며, 자신의 노력이 easily identified되지 않는다고 느끼면 effort의 amount를 reduce할 수 있다는 내용이다.",
            },
          ],
        },

       {
  type: "daily_life",
  title: "Daily Life · Passage 1 (3Q)",
  passage: {
    id: "m4_m2_dl_p1",
    docType: "schedule",
    title: "Workshop Schedule",
    subtitle: "Northbridge Business Skills Seminar",
    columns: ["Time", "Session", "Presenter"],
    rows: [
      ["9:00–9:30", "Registration", "—"],
      ["9:30–10:30", "Team Leadership", "Dr. Cheng"],
      ["10:45–11:45", "Data Analysis in Business", "S. Ramirez"],
      ["11:45–1:00", "Lunch Break", "—"],
      ["1:00–2:00", "Managing Remote Teams", "K. Patel"],
      ["2:15–3:15", "Conflict Management", "Dr. Cheng"],
    ],
    note: "Participants must complete registration by 9:20 a.m. to receive seminar materials. Lunch is not included in the registration fee. The afternoon sessions are open only to attendees who registered in advance.",
  },
  questions: [
    {
      id: "m4_m2_dl1_q1",
      q: "Mr. Tan is particularly interested in improving how team disagreements are handled. Which session should he attend?",
      options: {
        A: "Team Leadership",
        B: "Data Analysis in Business",
        C: "Managing Remote Teams",
        D: "Conflict Management",
      },
      answer: "D",
      explanation:
        "'improving how team disagreements are handled'는 Conflict Management의 의미를 바꿔 표현한 것이다.",
    },
    {
      id: "m4_m2_dl1_q2",
      q: "According to the schedule, Dr. Cheng will speak more than once. What is indicated about his sessions?",
      options: {
        A: "They are scheduled before lunch.",
        B: "They are scheduled in the morning only.",
        C: "They are scheduled both before and after lunch.",
        D: "They are scheduled consecutively.",
      },
      answer: "C",
      explanation:
        "Dr. Cheng은 9:30–10:30 Team Leadership과 2:15–3:15 Conflict Management를 맡는다. 즉 lunch 전후 모두 발표한다.",
    },
    {
      id: "m4_m2_dl1_q3",
      q: "What is indicated about seminar participants?",
      options: {
        A: "They will receive lunch during the break.",
        B: "They may join the afternoon sessions without advance registration.",
        C: "They must check in before 9:20 a.m. to receive materials.",
        D: "They can collect seminar materials at any time during the day.",
      },
      answer: "C",
      explanation:
        "note에 'Participants must complete registration by 9:20 a.m. to receive seminar materials.'라고 명시되어 있으므로 C가 정답이다.",
    },
  ],
},

        {
          type: "daily_life",
          title: "Daily Life · Passage 2 (3Q)",
          passage: {
            id: "m4_m2_dl_p2",
            docType: "notice",
            title: "Reminder to Residence Hall Students",
            date: "Residence Life Office",
            body: `As the midterm examination period approaches, residents of Maple Hall are reminded to be considerate of others who may be studying.

Please keep noise levels low in hallways, common areas, and rooms, particularly during the late evening hours. Loud conversations, music, or gatherings can disturb students preparing for upcoming exams.

Students who wish to socialize are encouraged to use the student lounge on the ground floor or other campus facilities where noise will not disrupt fellow residents.

Thank you for helping maintain a respectful and supportive study environment.
— Residence Life Office`,
          },
          questions: [
            {
              id: "m4_m2_dl2_q1",
              q: "What is the main purpose of the notice?",
              options: {
                A: "To announce changes to dormitory facilities",
                B: "To encourage students to maintain a quiet environment",
                C: "To inform residents about the midterm exam schedule",
                D: "To request volunteers for campus events",
              },
              answer: "B",
              explanation:
                "이 notice의 목적은 시험 기간을 앞두고 residence hall에서 조용한 환경을 유지하도록 학생들에게 당부하는 것이다.",
            },
            {
              id: "m4_m2_dl2_q2",
              q: "Why are students asked to reduce noise?",
              options: {
                A: "The dormitory will close earlier during the week",
                B: "New dormitory rules will be introduced soon",
                C: "Many residents are preparing for exams",
                D: "Construction work will begin in the building",
              },
              answer: "C",
              explanation:
                "본문에서 loud conversations, music, or gatherings can disturb students preparing for upcoming exams라고 직접 설명한다.",
            },
            {
              id: "m4_m2_dl2_q3",
              q: "What does the notice suggest students do if they plan to spend time talking with friends?",
              options: {
                A: "Go to another residence hall",
                B: "Leave the dormitory building temporarily",
                C: "Inform the residence office beforehand",
                D: "Use a location where conversations will not disturb others",
              },
              answer: "D",
              explanation:
                "socialize를 원한다면 student lounge나 다른 campus facilities처럼 다른 residents를 방해하지 않는 곳을 이용하라고 했다.",
            },
          ],
        },
      ],
    },

    // =======================
    // Module 3 (상위)
    // =======================
    m3: {
      id: "m3",
      title: "Module 3 (Upper)",
      sections: [
        {
          type: "ctw_paragraph",
          title: "CTW · Paragraph (10Q)",
          items: [
            {
              id: "m4_ctw_03",
              subject: "urban history",
              paragraph:
                "Urbanization has reshaped human societies during the past two centuries. This {{01}} shift, {{02}} by {{03}} {{04}} opportunities and {{05}} transportation networks, led millions of people to move {{06}} rural areas {{07}} rapidly growing cities. As urban populations increased, governments began {{08}} heavily {{09}} infrastructure such as roads, water systems, and public transit. These developments transformed cities into major centers of {{10}} and cultural activity.",

              blanks: withDefaultPrefixLen(
                [
                  { key: "01", answer: "dramatic", meaning: "극적인", prefixLen: 4 },
                  { key: "02", answer: "driven", meaning: "이끌어진", prefixLen: 3 },
                  { key: "03", answer: "expanding", meaning: "확대되는", prefixLen: 4 },
                  { key: "04", answer: "industrial", meaning: "산업의", prefixLen: 4 },
                  { key: "05", answer: "improved", meaning: "개선된", prefixLen: 4 },
                  { key: "06", answer: "from", meaning: "~에서", prefixLen: 2 },
                  { key: "07", answer: "to", meaning: "~로", prefixLen: 1 },
                  { key: "08", answer: "investing", meaning: "투자하는", prefixLen: 4 },
                  { key: "09", answer: "in", meaning: "~에", prefixLen: 1 },
                  { key: "10", answer: "economic", meaning: "경제의", prefixLen: 4 },
                ],
                2
              ),

              explanation:
                "이 지문은 urbanization이 human societies를 어떻게 바꾸었는지 설명한다. expanding industrial opportunities와 improved transportation networks가 people을 from rural areas to cities로 이동하게 만들었고, 정부는 infrastructure에 investing하면서 cities를 economic and cultural centers로 발전시켰다는 흐름이다.",
            },
          ],
        },

        {
          type: "academic",
          title: "Social Science · The Attention Economy (5Q)",
          passage: normalizePassage({
            id: "m4_m3_ac_p1",
            title: "Competition for Human Attention",
            paragraphs: [
              "In digital environments, human attention is often treated as a limited resource. Because people can focus on only so much information at once, companies compete intensely to attract and hold user attention. This idea is commonly called the attention economy.",
              "Online platforms benefit when users stay longer, since more time often means more exposure to advertisements or promoted content. For that reason, many services use recommendation systems that select videos, articles, or posts likely to keep users engaged. Critics argue that this competition can affect public life in troubling ways. Content that provokes strong emotion may spread more easily than careful but less dramatic material. As a result, some researchers believe that the attention economy influences not only what people consume, but also how they discuss public issues.",
            ],
          }),
          questions: [
            {
              id: "m4_m3_ac_q1",
              q: "What is the passage mainly about?",
              options: {
                A: "Why online advertisements are becoming less common",
                B: "How digital platforms compete for user focus",
                C: "Why people prefer short content to long content",
                D: "How programmers build recommendation engines",
              },
              answer: "B",
              explanation:
                "지문 전체는 digital platforms가 limited resource인 human attention을 두고 경쟁하는 구조, 즉 attention economy를 설명한다.",
            },
            {
              id: "m4_m3_ac_q2",
              q: "According to paragraph 2, platforms want users to remain active because",
              options: {
                A: "longer visits can increase advertising value",
                B: "users become more interested in academic content",
                C: "companies need help identifying fake accounts",
                D: "users are more likely to pay for all content",
              },
              answer: "A",
              explanation:
                "users stay longer이면 advertisements or promoted content에 더 많이 노출되므로 플랫폼에 더 큰 가치가 생긴다고 설명한다.",
            },
            {
              id: "m4_m3_ac_q3",
              q: "The word 'provokes' in paragraph 2 is closest in meaning to",
              highlight: "provokes",
              options: {
                A: "measures",
                B: "avoids",
                C: "triggers",
                D: "records",
              },
              answer: "C",
              explanation:
                "provokes strong emotion은 강한 감정을 유발한다는 뜻이므로 triggers가 가장 가깝다.",
            },
            {
              id: "m4_m3_ac_q4",
              q: "Why does the author mention public discussion?",
              options: {
                A: "To show that attention competition can have social effects",
                B: "To explain why newspapers are more trusted",
                C: "To compare social media with television",
                D: "To argue that emotional content is always harmful",
              },
              answer: "A",
              explanation:
                "attention economy가 단지 content consumption뿐 아니라 how they discuss public issues에도 영향을 준다고 하여 사회적 파급효과를 보여 준다.",
            },
            {
              id: "m4_m3_ac_q5",
              q: "What can be inferred from the passage?",
              options: {
                A: "Recommendation systems usually reduce user activity.",
                B: "Online platforms are unconcerned with attention.",
                C: "All popular content is misleading.",
                D: "Material that stirs feelings may circulate widely online.",
              },
              answer: "D",
              explanation:
                "2단락에서 content that provokes strong emotion may spread more easily라고 했으므로 감정을 자극하는 내용이 온라인에서 널리 퍼질 수 있다고 추론할 수 있다.",
            },
          ],
        },
      ],
    },
  },
};