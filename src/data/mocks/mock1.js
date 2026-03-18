// src/data/reading/mocks/mock1.js

/* =========================
   helper (데이터 안전장치)
   - CTW blank key를 "01"처럼 2자리로 맞춰도 되고, "1"이어도 됨 (엔진이 {{\d+}}로 잡음)
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

  // 엔진은 passage.paragraphs(배열) 또는 passage.text(문자열) 둘 다 처리하지만
  // 여기서 한 번 더 통일해주면 편함.
  if (Array.isArray(passage.paragraphs)) return passage;

  if (typeof passage.text === "string") {
    // 줄바꿈 기준으로 paragraphs 만들기 (빈 줄은 문단 구분)
    const raw = passage.text.split("\n").map((s) => s.trimEnd());
    const paras = [];
    let buf = [];
    raw.forEach((line) => {
      if (line.trim() === "") {
        if (buf.length) {
          paras.push(buf.join(" "));
          buf = [];
        } else {
          paras.push(""); // 빈 줄 유지
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

export const mock1 = {
  id: "mock1",
  title: "Reading 모의고사 1",
  description: "Adaptive · Module 1 → Module 2/3",
branching: {
  wrongCut: 3,
  passTo: "m3",   // 잘 보면 상위 모듈
  failTo: "m2",   // 많이 틀리면 하위 모듈
},

  modules: {
    // =======================
    // Module 1
    // 1) CTW paragraph 1문제
    // 2) Daily Life 2지문 (총 5문항)
    // 3) Academic 1지문 (총 5문항)
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
      id: "m1_ctw_01",
      subject: "urban development",
      paragraph:
        "Cities continue to {{01}} as populations increase and economic activity expands. Many governments invest heavily {{02}} transportation systems and housing projects to support this growth. However, rapid urban expansion can {{03}} serious environmental challenges. Pollution levels may rise {{04}} traffic increases and industrial activity spreads. As a result, researchers often warn {{05}} the long-term {{06}} of unchecked development. Without {{07}} planning, cities may face problems that are both {{08}} and difficult to reverse. Effective policies must therefore be implemented {{09}} ensure more {{10}} urban growth.",

      blanks: withDefaultPrefixLen(
        [
          { key: "01", answer: "expand", meaning: "확장되다", prefixLen: 2 },     // verb
          { key: "02", answer: "in", meaning: "~에", prefixLen: 1 },             // preposition
          { key: "03", answer: "create", meaning: "야기하다", prefixLen: 2 },    // verb
          { key: "04", answer: "as", meaning: "~할 때 / ~함에 따라", prefixLen: 1 }, // conjunction
          { key: "05", answer: "about", meaning: "~에 대해", prefixLen: 2 },     // preposition
          { key: "06", answer: "impact", meaning: "영향", prefixLen: 2 },        // noun
          { key: "07", answer: "careful", meaning: "신중한", prefixLen: 2 },     // adjective
          { key: "08", answer: "costly", meaning: "대가가 큰", prefixLen: 3 },   // adjective
          { key: "09", answer: "to", meaning: "~하기 위해", prefixLen: 1 },      // adverbial marker (infinitive)
          { key: "10", answer: "sustainable", meaning: "지속 가능한", prefixLen: 4 }, // adjective-like concept (policy result)
        ],
        2
      ),

      explanation:
        "도시 확장과 환경 영향에 관한 지문이다. 도시가 expand(확장)하면서 정부는 infrastructure에 투자하고, 이러한 성장 과정에서 환경 문제를 create(야기)할 수 있다. 연구자들은 이러한 개발의 impact(영향)에 대해 경고하며 careful planning 없이 진행되면 costly 문제가 발생할 수 있다고 설명한다. 따라서 sustainable urban growth를 위한 정책이 필요하다는 흐름이다.",
    },
  ],
},

        /* ---------- Daily Life Passage 1 (3Q) ---------- */
     /* ---------- Daily Life Passage 1 (3Q) ---------- */
{
  type: "daily_life",
  title: "Daily Life · Passage 1 (3Q)",
  passage: {
    id: "m1_dl_p1",
    docType: "email",
    title: "Email",
    to: "Residents",
    from: "Building Management",
    date: "Saturday, 9:00 a.m. - 2:00 p.m.",
    subject: "Elevator Maintenance Notice",
    body: `Please note that the main elevator will be unavailable this Saturday from 9:00 a.m. to 2:00 p.m. while technicians inspect the control system and replace worn components.

Residents transporting large items are encouraged to adjust their plans accordingly. A secondary elevator near the south entrance may be used during the maintenance period, depending on availability.

Thank you for your patience.`,
  },
  questions: [
    {
      id: "m1_dl1_q1",
      q: "What is the main purpose of the email?",
      options: {
        A: "To remind residents to report elevator problems",
        B: "To inform residents about scheduled elevator maintenance",
        C: "To explain how to reserve the secondary elevator",
        D: "To request help moving heavy items this weekend",
      },
      answer: "B",
      explanation:
        "이 이메일의 핵심 목적은 토요일에 주 엘리베이터가 점검으로 인해 일시적으로 사용 불가하다는 사실을 알리는 것이다. reserve, report, request help 같은 내용은 본문에 없다.",
    },
    {
      id: "m1_dl1_q2",
      q: "What can be inferred about the secondary elevator?",
      options: {
        A: "It will definitely remain open all day",
        B: "It is located in another building",
        C: "It may not always be available during the maintenance period",
        D: "It can only be used for small personal items",
      },
      answer: "C",
      explanation:
        "본문에 'may be used ... depending on availability'라고 되어 있으므로, 보조 엘리베이터는 항상 확실히 사용 가능한 것은 아니라는 점을 추론할 수 있다.",
    },
    {
      id: "m1_dl1_q3",
      q: "Who would be most affected by this notice?",
      options: {
        A: "Residents planning to move furniture on Saturday",
        B: "Technicians repairing the south entrance",
        C: "Visitors arriving late Sunday morning",
        D: "Office workers requesting parking permits",
      },
      answer: "A",
      explanation:
        "본문에서 'Residents transporting large items'라고 직접 언급했으므로, 토요일에 큰 짐이나 가구를 옮기려는 입주민이 가장 큰 영향을 받는다.",
    },
  ],
},

/* ---------- Daily Life Passage 2 (3Q) ---------- */
{
  type: "daily_life",
  title: "Campus Services · Passage 2 (3Q)",
  passage: {
    id: "m1_dl_p2_advanced",
    docType: "notice",
    title: "Adjustment of Library Operational Hours",
    date: "Notice to the University Community",
    body: `In light of the upcoming midterm examination period, the University Library Administration has announced a strategic shift in its operational schedule. Starting next Monday, weekday hours will be extended until 11 p.m. to accommodate the unprecedented surge in demand for late-night study spaces.

Previously, the administration expressed hesitation regarding such extensions due to logistical constraints and the escalating operational costs associated with staffing and utility maintenance. However, following a series of formal petitions from the Student Government Association, a consensus was reached to prioritize academic support over these budgetary concerns.

It should be noted that weekend hours will remain unaffected, as current usage data suggests that existing Saturday and Sunday timeframes are sufficient to meet student needs.`,
  },
  questions: [
    {
      id: "m1_dl2_q1",
      q: "The word 'unprecedented' in the passage is closest in meaning to:",
      options: {
        A: "unintentional",
        B: "exceptional",
        C: "predictable",
        D: "consistent",
      },
      answer: "B",
      explanation:
        "unprecedented(전례 없는)는 예외적이고 이례적인 상황을 의미하므로 exceptional이 가장 적절함.",
    },
    {
      id: "m1_dl2_q2",
      q: "According to the passage, why did the administration initially hesitate to extend the hours?",
      options: {
        A: "Because students had not submitted enough formal requests.",
        B: "Because of the financial and practical burdens of facility management.",
        C: "Because they wanted to encourage students to study in their dormitories.",
        D: "Because the library was undergoing major structural renovations.",
      },
      answer: "B",
      explanation:
        "본문의 'logistical constraints(물류/실무적 제약)'와 'operational costs(운영 비용)'가 B의 financial and practical burdens로 재진술(Paraphrasing)됨.",
    },
    {
      id: "m1_dl2_q3",
      q: "What can be inferred about the library's weekend schedule?",
      options: {
        A: "It will be shortened to offset the costs of extended weekday hours.",
        B: "It was already extended to 11 p.m. earlier this semester.",
        C: "The demand for study space is generally lower on weekends than on weekdays.",
        D: "Students are planning to petition for longer weekend hours next week.",
      },
      answer: "C",
      explanation:
        "주말 시간은 '현행 유지(remain unaffected)'하며 그 근거가 '현재 시간이 요구사항을 충족하기에 충분하다(sufficient)'는 데이터 때문이므로, 평일만큼의 추가 수요는 없음을 추론할 수 있음.",
    },
  ],
},
        /* ---------- Academic Passage (5Q) ---------- */
 {
  type: "academic",
  title: "Social Evolution · Dunbar’s Number (5Q)",
  passage: normalizePassage({
    id: "m1_ac_p1",
    title: "The Cognitive Limits of Sociality",
    paragraphs: [
      "Anthropologist Robin Dunbar proposed that humans possess a biological ceiling on the number of stable social relationships they can maintain. By extrapolating the correlation between neocortex size and group size in primates, Dunbar hypothesized that the human brain is physiologically equipped to manage a network of approximately 150 individuals. Beyond this 'Dunbar’s number,' the cohesive bonds of a community begin to deteriorate as the cognitive demand for social processing exceeds the brain's executive capacity.",
      "Maintaining these connections requires immense mental effort to track personal histories and decode emotional cues. As a group surpasses this threshold, informal trust alone becomes insufficient to prevent internal conflict. Consequently, larger societies must implement formal hierarchies and codified laws to compensate for the lack of direct cognitive oversight. Thus, the development of complex civilization can be viewed as a cultural adaptation designed to overcome the inherent neurological boundaries of the human mind, allowing for stability in massive populations."
    ],
  }),
  questions: [
    {
  id: "m1_ac_q1",
  q: "The word 'threshold' in the passage is closest in meaning to",
  highlight: "threshold",
  options: {
    A: "limit",
    B: "procedure",
    C: "organization",
    D: "prediction",
  },
  answer: "A",
  explanation: "지문에서 threshold는 집단 규모가 특정 수준을 넘으면 사회적 관계 유지가 어려워지는 '한계점'을 의미합니다. 따라서 'limit'이 가장 적절한 의미입니다.",
},
    {
      id: "m1_ac_q2",
      q: "According to paragraph 1, why do social bonds begin to weaken when a group grows beyond Dunbar's number?",
      options: {
        A: "Because the neocortex stops developing after a certain age",
        B: "Because the mental demands of managing relationships become too great",
        C: "Because individuals become less interested in emotional cues",
        D: "Because communities begin to reject stable relationships",
      },
      answer: "B",
      explanation: "1단락 마지막 부분에서 사회적 정보를 처리해야 하는 인지적 부담이 뇌의 실행 능력을 초과할 때 결속이 약화된다고 설명합니다.",
    },
    {
      id: "m1_ac_q3",
      q: "Why does the author mention 'codified laws' in paragraph 2?",
      highlight: "codified laws",
      options: {
        A: "To show one way large groups preserve order when personal trust is insufficient",
        B: "To argue that people naturally prefer written rules to social bonds",
        C: "To suggest that early legal systems eliminated conflict entirely",
        D: "To demonstrate that civilization developed before social groups expanded",
      },
      answer: "A",
      explanation: "codified laws는 인지적 한계를 넘어선 대규모 집단이 질서를 유지하기 위해 사용하는 공식적 장치의 예시로 제시됩니다.",
    },
    {
      id: "m1_ac_q4",
      q: "How does paragraph 2 relate to paragraph 1?",
      options: {
        A: "It provides historical evidence that disproves the theory introduced earlier.",
        B: "It explains the social consequences of the limit described in paragraph 1.",
        C: "It narrows the discussion from large civilizations to individual psychology only.",
        D: "It restates the hypothesis in simpler language without adding new information.",
      },
      answer: "B",
      explanation: "1단락이 인간이 유지할 수 있는 사회관계의 인지적 한계를 제시한다면, 2단락은 그 한계를 넘었을 때 사회가 어떤 방식으로 대응하는지를 설명합니다.",
    },
    {
      id: "m1_ac_q5",
      q: "What can be inferred from the passage about smaller communities?",
      options: {
        A: "They depend less on formal systems of control.",
        B: "They experience no internal conflict among members.",
        C: "They require more cognitive effort from individuals.",
        D: "They usually develop formal hierarchies more quickly.",
      },
      answer: "A",
      explanation: "지문은 집단 규모가 커질수록 informal trust만으로는 질서 유지가 어려워져 formal hierarchies와 codified laws가 필요해진다고 말합니다. 따라서 더 작은 공동체는 그러한 공식 통제 장치에 상대적으로 덜 의존한다고 추론할 수 있습니다.",
    },
  ],
},
      ],
    },

    // =======================
    // Module 2 (하위)
    // - passTo: "m2"
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
      id: "m1_ctw_02",
      subject: "paleontology",
      paragraph:
        "Fossils provide {{01}} evidence about the history of life on Earth. These remains usually {{02}} when an organism is buried quickly {{03}} sediment, protecting it from decay. Over millions of years, minerals gradually {{04}} the organic material, turning it into stone. Scientists examine these specimens {{05}} to understand how species evolved. However, the fossil record is often {{06}} because only a small fraction of living things become fossilized. {{07}} many ancient creatures left no trace, paleontologists must rely {{08}} existing discoveries to reconstruct the past. Each new {{09}} adds a vital {{10}} to our knowledge of biological evolution.",

      blanks: withDefaultPrefixLen(
        [
          { key: "01", answer: "valuable", meaning: "가치 있는", prefixLen: 2 },    // adjective
          { key: "02", answer: "form", meaning: "형성되다", prefixLen: 2 },        // verb
          { key: "03", answer: "under", meaning: "~아래에", prefixLen: 1 },         // preposition
          { key: "04", answer: "replace", meaning: "대체하다", prefixLen: 2 },      // verb
          { key: "05", answer: "carefully", meaning: "주의 깊게", prefixLen: 2 },  // adverb
          { key: "06", answer: "incomplete", meaning: "불완전한", prefixLen: 2 }, // adjective
          { key: "07", answer: "Since", meaning: "~때문에", prefixLen: 1 },        // conjunction
          { key: "08", answer: "on", meaning: "~에 (의존하다)", prefixLen: 1 },     // preposition
          { key: "09", answer: "finding", meaning: "발견물", prefixLen: 2 },       // noun
          { key: "10", answer: "piece", meaning: "조각 / 부분", prefixLen: 2 },    // noun
        ],
        2
      ),

      explanation:
        "화석 형성 과정과 그 학술적 가치에 관한 지문이다. 화석은 valuable(가치 있는) 증거를 제공하며, 유해가 퇴적물 under(~아래에) 묻힐 때 form(형성)된다. 과학자들은 진화 과정을 이해하기 위해 이를 carefully(주의 깊게) 조사한다. 하지만 화석 기록은 incomplete(불완전)한데, 많은 생물들이 흔적을 남기지 않았기(Since) 때문이다. 따라서 고생물학자들은 기존의 발견물에 의존(rely on)해야 하며, 각각의 새로운 finding(발견물)은 지식의 중요한 piece(조각)이 된다.",
    },
  ],
},

    /* ================= Daily Passage 1 ================= */

   /* ================= Daily Passage 1 ================= */
{
  type: "daily_life",
  title: "Daily Life · Passage 1 (3Q)",
  passage: {
    id: "m2_dl_p1",
    docType: "notice",
    title: "Community Center Notice",
    date: "Weekend Watercolor Workshop",
    body: `Riverside Community Center will host a beginner watercolor workshop this Saturday at 10 a.m. The class will be led by a local artist who will introduce basic painting techniques and brush use. All art supplies will be provided by the center.

Participants are advised to wear old or comfortable clothing because paint may stain fabrics during the activity. The workshop will take place in the center's small art studio, so the number of participants is limited to twenty people.

Those interested in attending should register early to reserve a spot.`,
  },
  questions: [
    {
      id: "m2_dl1_q1",
      q: "According to the notice, what will the Community Center provide?",
      options: {
        A: "Art supplies needed for the workshop",
        B: "Transportation to the community center",
        C: "Free meals during the class",
        D: "Professional painting certificates",
      },
      answer: "A",
      explanation:
        "지문에서 'All art supplies will be provided by the center.'라고 명시되어 있습니다.",
    },
    {
      id: "m2_dl1_q2",
      q: "Why does the notice suggest that participants wear old or comfortable clothing?",
      options: {
        A: "The room temperature may be low",
        B: "Participants will move between different rooms",
        C: "Paint used in the class may stain clothing",
        D: "The center has a dress code for workshops",
      },
      answer: "C",
      explanation:
        "지문에서 'paint may stain fabrics during the activity'라고 하므로 옷이 더러워질 수 있기 때문입니다.",
    },
    {
      id: "m2_dl1_q3",
      q: "Which of the following is NOT mentioned about the workshop?",
      options: {
        A: "Who will teach the class",
        B: "The maximum number of participants",
        C: "The starting time of the workshop",
        D: "The cost of attending the workshop",
      },
      answer: "D",
      explanation:
        "강사(local artist), 인원 제한(20명), 시작 시간(10 a.m.)은 언급되었지만 비용에 대한 언급은 없습니다.",
    },
  ],
},

/* ================= Daily Passage 2 ================= */
{
  type: "daily_life",
  title: "Daily Life · Passage 2 (2Q)",
  passage: {
    id: "m2_dl_p2",
    docType: "notice",
    title: "Office Memo",
    date: "Finance Department Policy Update",
    body: `Beginning next week, employees will be required to submit travel expense reports no later than five business days after returning from a business trip. Reports received after that deadline may not be processed for reimbursement until the following month.

According to the finance department, this policy has been introduced to maintain more accurate records and to prevent unnecessary delays in processing claims.`,
  },
  questions: [
    {
      id: "m2_dl2_q1",
      q: "According to the memo, what may happen if an employee submits a travel expense report late?",
      options: {
        A: "The report may need approval from a department manager",
        B: "The employee may lose eligibility for future business trips",
        C: "Reimbursement may be delayed until the next month",
        D: "The report may be returned for revision before review",
      },
      answer: "C",
      explanation:
        "지문에서 'Reports received after that deadline may not be processed for reimbursement until the following month'라고 했으므로, 환급이 다음 달까지 미뤄질 수 있습니다.",
    },
    {
      id: "m2_dl2_q2",
      q: "Why did the finance department introduce this policy?",
      options: {
        A: "To simplify the rules for requesting travel approval",
        B: "To discourage employees from taking frequent business trips",
        C: "To require reports to be reviewed before each trip begins",
        D: "To ensure more accurate record keeping and reduce processing delays",
      },
      answer: "D",
      explanation:
        "지문 마지막 문장에서 이 정책의 목적이 'maintain more accurate records'와 'prevent unnecessary delays in processing claims'라고 명시되어 있습니다.",
    },
  ],
},
  ],
},
    // =======================
    // Module 3 (상위)
    // - failTo: "m3"
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
      id: "m1_ctw_02",
      subject: "paleontology",
      paragraph:
        "Fossils provide {{01}} evidence about the history of life on Earth. These remains usually {{02}} when an organism is buried quickly {{03}} sediment, protecting it from decay. Over millions of years, minerals gradually {{04}} the organic material, turning it into stone. Scientists examine these specimens {{05}} to understand how species evolved. However, the fossil record is often {{06}} because only a small fraction of living things become fossilized. {{07}} many ancient creatures left no trace, paleontologists must rely {{08}} existing discoveries to reconstruct the past. Each new {{09}} adds a vital {{10}} to our knowledge of biological evolution.",

      blanks: withDefaultPrefixLen(
        [
          { key: "01", answer: "valuable", meaning: "가치 있는", prefixLen: 3 },    // adjective
          { key: "02", answer: "form", meaning: "형성되다", prefixLen: 2 },        // verb
          { key: "03", answer: "under", meaning: "~아래에", prefixLen: 1 },         // preposition
          { key: "04", answer: "replace", meaning: "대체하다", prefixLen: 4 },      // verb
          { key: "05", answer: "carefully", meaning: "주의 깊게", prefixLen: 2 },  // adverb
          { key: "06", answer: "incomplete", meaning: "불완전한", prefixLen: 2 }, // adjective
          { key: "07", answer: "Since", meaning: "~때문에", prefixLen: 1 },        // conjunction
          { key: "08", answer: "on", meaning: "~에 (의존하다)", prefixLen: 1 },     // preposition
          { key: "09", answer: "finding", meaning: "발견물", prefixLen: 2 },       // noun
          { key: "10", answer: "piece", meaning: "조각 / 부분", prefixLen: 3 },    // noun
        ],
        2
      ),

      explanation:
        "화석 형성 과정과 그 학술적 가치에 관한 지문이다. 화석은 valuable(가치 있는) 증거를 제공하며, 유해가 퇴적물 under(~아래에) 묻힐 때 form(형성)된다. 과학자들은 진화 과정을 이해하기 위해 이를 carefully(주의 깊게) 조사한다. 하지만 화석 기록은 incomplete(불완전)한데, 많은 생물들이 흔적을 남기지 않았기(Since) 때문이다. 따라서 고생물학자들은 기존의 발견물에 의존(rely on)해야 하며, 각각의 새로운 finding(발견물)은 지식의 중요한 piece(조각)이 된다.",
    },
  ],
},

    {
  type: "academic",
  title: "Sociology · Collective Memory (5Q)",
  passage: normalizePassage({
    id: "m3_ac_p1_advanced",
    title: "The Construction of Collective Memory",
    paragraphs: [
      "Collective memory is defined not merely as the sum of individual recollections, but as a socio-cultural construct representing the shared pool of knowledge and information held by a distinct group. Unlike individual memory, which is rooted in personal sensory experience and neurological pathways, collective memory is forged through social interaction, cultural rituals, and historical narratives. [A] This shared framework allows a society to establish a sense of continuity, linking the past with the present to forge a coherent group identity. [B] Consequently, what a society 'remembers' is often less about objective historical accuracy and more about the values and ideologies that the group seeks to preserve. [C]",
      "The durability of these shared memories depends heavily on institutional mediation. Over time, certain interpretations of historical events become dominant, often through their promotion in educational curricula, national monuments, and commemorative ceremonies. These dominant narratives serve to unify the populace, though they frequently marginalize alternative perspectives that conflict with the established social order. [D] As these dominant versions are reinforced, competing interpretations may gradually diminish in public consciousness, eventually disappearing altogether if they are not actively sustained through counter-narratives or subversive cultural practices. Thus, collective memory is an inherently dynamic and political process, subject to constant negotiation and reinterpretation as the needs of the present society evolve.",
    ],
  }),
  questions: [
    {
      id: "m3_ac_q1",
      q: "The word 'forged' in paragraph 1 is closest in meaning to",
      options: {
        A: "discovered",
        B: "created",
        C: "mimicked",
        D: "concealed",
      },
      answer: "B",
      explanation: "문맥상 집단 기억이 사회적 상호작용 등을 통해 '형성(created)'된다는 의미이므로 B가 정답입니다.",
    },
    {
      id: "m3_ac_q2",
      q: "According to paragraph 1, how does collective memory differ from individual memory?",
      options: {
        A: "It is primarily based on objective sensory data rather than personal feelings.",
        B: "It is developed through social processes rather than direct personal experience.",
        C: "It is stored in physical archives rather than within the human brain.",
        D: "It remains static over centuries whereas individual memory fades quickly.",
      },
      answer: "B",
      explanation: "지문에서 개인 기억은 'personal experience'에 기반하지만 집단 기억은 'social interaction, cultural rituals'를 통해 형성된다고 대조하고 있습니다.",
    },
    {
      id: "m3_ac_q3",
      q: "Why does the author mention 'educational curricula' and 'national monuments' in paragraph 2?",
      options: {
        A: "To argue that historical facts are secondary to artistic expression in a society",
        B: "To provide examples of the channels through which certain memories become dominant",
        C: "To criticize the government's role in erasing the personal memories of its citizens",
        D: "To illustrate the high financial cost of maintaining a society's collective identity",
      },
      answer: "B",
      explanation: "Rhetorical Purpose: 특정 해석이 지배적(dominant)이 되도록 만드는 구체적인 수단(매개체)의 예시로 언급되었습니다.",
    },
    {
      id: "m3_ac_q4",
      q: "What can be inferred about competing interpretations that 'diminish in public consciousness'?",
      options: {
        A: "They are objectively proven to be false by modern historians.",
        B: "They lack the institutional support necessary to be widely preserved.",
        C: "They are eventually integrated into the dominant social narrative.",
        D: "They are typically held by the most powerful members of a society.",
      },
      answer: "B",
      explanation: "Inference: 지배적 서사가 교육이나 기념비 같은 제도적 지원을 받는 반면, 사라지는 기억들은 'actively sustained(능동적 유지)'되지 못하기 때문임을 유추할 수 있습니다.",
    },
  {
  id: "m3_ac_q5",
  questionType: "sentence_insertion",
  q: "Look at the four squares [A], [B], [C], and [D] that indicate where the following sentence could be added to the passage.\n\n'In this sense, memory serves as a tool for social cohesion, ensuring that members of a community share a common understanding of their origin.'\n\nWhere would the sentence best fit?",
  options: {
    A: "[A]",
    B: "[B]",
    C: "[C]",
    D: "[D]",
  },
  answer: "B",
  explanation:
    "삽입 문장의 'social cohesion(사회적 결속)'과 'origin(기원)'에 대한 공통 이해는 [B] 앞의 'continuity', 'group identity' 형성 문장을 부연 설명하며, 뒤의 'objective accuracy'보다 'ideology'를 중시한다는 내용과 자연스럽게 연결됩니다.",
},
  ],
},
  ],
},
          
  },
};