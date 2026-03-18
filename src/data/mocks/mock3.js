// src/data/reading/mocks/mock3.js

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

export const mock3 = {
  id: "mock3",
  title: "Reading 모의고사 3",
  description: "Adaptive · Module 1 → Module 2/3",
  branching: {
    wrongCut: 3,
    passTo: "m3",
    failTo: "m2",
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
              id: "m3_ctw_01",
              subject: "psychology",
              paragraph:
                "Procrastination is commonly defined as the {{01}} delay of an intended task despite expecting {{02}} consequences. Although many people {{03}} procrastination with {{04}}, psychologists have {{05}} that the behavior often arises {{06}} emotional {{07}} rather than poor time {{08}}. When individuals anticipate stress or {{09}}, they may {{10}} a task in order to avoid unpleasant feelings. Unfortunately, this temporary relief often leads to increased pressure as deadlines approach. Researchers suggest that procrastination is closely related to impulsivity, since people prioritize immediate comfort over long-term goals. Understanding these psychological mechanisms has helped scientists develop strategies that encourage individuals to begin difficult tasks earlier and maintain motivation over time.",

              blanks: withDefaultPrefixLen(
                [
                  { key: "01", answer: "voluntary", meaning: "자발적인", prefixLen: 3 },
                  { key: "02", answer: "negative", meaning: "부정적인", prefixLen: 3 },
                  { key: "03", answer: "associate", meaning: "연관 짓다", prefixLen: 5 },
                  { key: "04", answer: "laziness", meaning: "게으름", prefixLen: 3 },
                  { key: "05", answer: "found", meaning: "발견했다", prefixLen: 2 },
                  { key: "06", answer: "from", meaning: "~로부터", prefixLen: 2 },
                  { key: "07", answer: "regulation", meaning: "조절", prefixLen: 3 },
                  { key: "08", answer: "management", meaning: "관리", prefixLen: 3 },
                  { key: "09", answer: "frustration", meaning: "좌절감", prefixLen: 4 },
                  { key: "10", answer: "postpone", meaning: "미루다", prefixLen: 4 },
                ],
                2
              ),

              explanation:
                "이 지문은 procrastination을 단순한 laziness가 아니라 감정 조절 문제와 관련된 심리 현상으로 설명한다. 사람들은 stress나 frustration이 예상될 때 불쾌한 감정을 피하기 위해 일을 postpone할 수 있으며, 이는 결국 더 큰 압박으로 이어진다는 흐름이다.",
            },
          ],
        },

        /* ---------- Daily Life Passage 1 (2Q) ---------- */
        {
          type: "daily_life",
          title: "Daily Life · Passage 1 (2Q)",
          passage: normalizePassage({
            id: "m3_m1_dl_p1",
            title: "Advertisement",
            text: `Grand Opening Promotion — UrbanTrail Outdoor Shop

To celebrate the opening of our new UrbanTrail store in Midtown Plaza, we are offering a 20% discount on all hiking backpacks and travel accessories this weekend only.

Customers who spend over $100 during the promotion will also receive a free stainless steel water bottle while supplies last.

Our store features equipment from several well-known outdoor brands, including AlpinePath and SummitGear. In addition, product specialists will be available throughout the weekend to help customers choose gear suitable for upcoming hiking trips.

The promotion runs Saturday and Sunday from 10:00 a.m. to 7:00 p.m.
For more information, visit www.urbantrailgear.com.`,
          }),
          questions: [
            {
              id: "m3_m1_dl1_q1",
              q: "What is the purpose of the advertisement?",
              options: {
                A: "To introduce a new outdoor equipment store",
                B: "To recruit specialists for hiking equipment",
                C: "To promote an online travel store",
                D: "To announce a hiking event for customers",
              },
              answer: "A",
              explanation:
                "광고의 핵심은 Midtown Plaza에 새로 오픈하는 UrbanTrail 매장을 소개하고 오픈 프로모션을 알리는 것이다.",
            },
            {
              id: "m3_m1_dl1_q2",
              q: "According to the advertisement, what will customers receive if they spend more than $100?",
              options: {
                A: "A discount on future purchases",
                B: "Free hiking gear repairs",
                C: "A complimentary water bottle",
                D: "A membership to the outdoor club",
              },
              answer: "C",
              explanation:
                "본문에 'Customers who spend over $100 ... will also receive a free stainless steel water bottle'라고 명시되어 있다.",
            },
          ],
        },

        /* ---------- Daily Life Passage 2 (3Q) ---------- */
        {
          type: "daily_life",
          title: "Daily Life · Passage 2 (3Q)",
          passage: normalizePassage({
            id: "m3_m1_dl_p2",
            title: "Notice",
            text: `Community Gathering for Residents

To encourage neighbors to get to know one another, the management office of Oakridge Apartments will host a community gathering for residents next Saturday evening.

The event will take place in the courtyard area from 6:00 p.m. to 8:30 p.m. Refreshments and light snacks will be provided by the management office. Residents are welcome to bring additional food to share if they wish.

In case of rain, the gathering will be moved to the community lounge on the first floor.

Residents who plan to attend are asked to inform the management office by Thursday so that enough seating and refreshments can be prepared.

We hope many of you will join us for this opportunity to meet your neighbors.
— Oakridge Apartments Management`,
          }),
          questions: [
            {
              id: "m3_m1_dl2_q1",
              q: "What is the purpose of the notice?",
              options: {
                A: "To invite residents to a community event",
                B: "To announce renovations in the courtyard",
                C: "To request volunteers for building maintenance",
                D: "To explain new rules for using shared spaces",
              },
              answer: "A",
              explanation:
                "이 공지는 주민 친목 모임을 안내하고 참여를 독려하기 위한 것이다.",
            },
            {
              id: "m3_m1_dl2_q2",
              q: "What will the management office provide during the event?",
              options: {
                A: "Live music performances",
                B: "Refreshments and light snacks",
                C: "Outdoor games for residents",
                D: "Decorations for the courtyard",
              },
              answer: "B",
              explanation:
                "둘째 문단에서 refreshments and light snacks를 management office가 제공한다고 했다.",
            },
            {
              id: "m3_m1_dl2_q3",
              q: "What are residents asked to do if they plan to attend?",
              options: {
                A: "Bring their own chairs",
                B: "Arrive before 6:00 p.m.",
                C: "Pay a small participation fee",
                D: "Notify the management office in advance",
              },
              answer: "D",
              explanation:
                "참석 예정 주민은 Thursday까지 management office에 미리 알려 달라고 했다.",
            },
          ],
        },

        /* ---------- Academic Passage (5Q) ---------- */
        {
          type: "academic",
          title: "Art Theory · Immersive Art Installations (5Q)",
          passage: normalizePassage({
            id: "m3_m1_ac_p1",
            title: "Immersive Art and Audience Participation",
            paragraphs: [
              "Immersive art installations differ from traditional paintings or sculptures because visitors do not simply look at them from a distance. Instead, viewers enter spaces filled with projected images, changing light, sound, and sometimes motion-sensitive effects. As people move through the installation, the environment may respond by altering color, sound, or visual patterns.",
              "Because of this interaction, each visitor’s experience may be slightly different. Some art historians argue that this represents an important shift in the meaning of art. Rather than presenting a single fixed object, the artist creates a temporary experience that unfolds over time. Supporters say such installations engage multiple senses and invite active participation. Critics, however, sometimes argue that technological effects can distract audiences from deeper artistic ideas.",
            ],
          }),
          questions: [
            {
              id: "m3_m1_ac_q1",
              q: "What is the main idea of the passage?",
              options: {
                A: "Museums prefer projected works because they are easier to move",
                B: "Immersive installations change art by surrounding and involving viewers",
                C: "Modern artists rarely use sculpture in exhibitions",
                D: "Motion-sensitive technology was first created for galleries",
              },
              answer: "B",
              explanation:
                "지문은 immersive installations가 관람자를 둘러싸고 참여시키는 방식으로 예술 경험을 변화시킨다는 점을 중심으로 설명한다.",
            },
            {
              id: "m3_m1_ac_q2",
              q: "According to the passage, what makes immersive installations different?",
              options: {
                A: "They allow visitors to become part of the work",
                B: "They are always displayed outdoors",
                C: "They contain no sound elements",
                D: "They depend only on traditional materials",
              },
              answer: "A",
              explanation:
                "관람자는 작품을 멀리서 보는 데 그치지 않고 그 안으로 들어가며, 움직임에 따라 환경이 반응하기 때문에 작품의 일부가 되는 셈이다.",
            },
            {
              id: "m3_m1_ac_q3",
              q: "The word 'fixed' in paragraph 2 is closest in meaning to",
              highlight: "fixed",
              options: {
                A: "repaired",
                B: "costly",
                C: "stable",
                D: "old",
              },
              answer: "C",
              explanation:
                "single fixed object는 변하지 않는 고정된 대상이라는 뜻이므로 stable이 가장 적절하다.",
            },
            {
              id: "m3_m1_ac_q4",
              q: "Why does the author mention critics?",
              options: {
                A: "To argue that modern art lacks originality",
                B: "To explain how sensors are installed",
                C: "To show that galleries dislike digital works",
                D: "To present a concern about emphasis on effects",
              },
              answer: "D",
              explanation:
                "critics는 technological effects가 deeper artistic ideas를 가릴 수 있다는 우려를 제시하는 역할이다.",
            },
            {
              id: "m3_m1_ac_q5",
              q: "What can be inferred about immersive installations?",
              options: {
                A: "They usually produce identical experiences for every visitor.",
                B: "They encourage a more active role for the audience.",
                C: "They are less popular than paintings because they are temporary.",
                D: "They are valued only by historians.",
              },
              answer: "B",
              explanation:
                "각 방문자의 경험이 조금씩 달라지고 active participation을 유도한다고 했으므로, 관객에게 더 능동적인 역할을 요구한다고 추론할 수 있다.",
            },
          ],
        },
      ],
    },

    // =======================
    // Module 2 (하위)
    // - CTW + Daily Life 2지문
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
              id: "m3_ctw_02",
              subject: "digital society",
              paragraph:
                "Modern communication technologies allow individuals to {{01}} with others more {{02}} than at any time in {{03}}. Social media platforms, messaging {{04}}, and online communities provide {{05}} opportunities {{06}} connection. {{07}} this {{08}} level of communication, many researchers argue that feelings of {{09}} are becoming increasingly common. Some studies suggest that digital {{10}} may replace deeper face-to-face relationships rather than strengthen them. When online communication becomes superficial or fragmented, individuals may experience a sense of social isolation even while remaining digitally connected. As a result, psychologists are examining how technology shapes emotional well-being and the quality of human relationships.",

              blanks: withDefaultPrefixLen(
                [
                  { key: "01", answer: "interact", meaning: "상호작용하다", prefixLen: 5 },
                  { key: "02", answer: "easily", meaning: "쉽게", prefixLen: 2 },
                  { key: "03", answer: "history", meaning: "역사", prefixLen: 2 },
                  { key: "04", answer: "applications", meaning: "애플리케이션들", prefixLen: 5 },
                  { key: "05", answer: "constant", meaning: "지속적인", prefixLen: 4 },
                  { key: "06", answer: "for", meaning: "~을 위한", prefixLen: 1 },
                  { key: "07", answer: "despite", meaning: "~에도 불구하고", prefixLen: 3 },
                  { key: "08", answer: "unprecedented", meaning: "전례 없는", prefixLen: 5 },
                  { key: "09", answer: "loneliness", meaning: "외로움", prefixLen: 3 },
                  { key: "10", answer: "interaction", meaning: "상호작용", prefixLen: 5 },
                ],
                2
              ),

              explanation:
                "이 지문은 디지털 시대의 소통 증가에도 불구하고 loneliness가 심화되는 현상을 설명한다. 사람들은 history상 어느 때보다 easily interact할 수 있지만, digital interaction이 깊은 대면 관계를 대체할 경우 오히려 사회적 고립을 느낄 수 있다는 흐름이다.",
            },
          ],
        },

        {
          type: "daily_life",
          title: "Daily Life · Passage 1 (2Q)",
          passage: normalizePassage({
            id: "m3_m2_dl_p1",
            title: "Advertisement",
            text: `RiverSound Music Academy

Have you always wanted to learn how to play the guitar?

RiverSound Music Academy is now accepting registrations for its Beginner Guitar Course, starting September 8.

The course runs for six weeks, with weekly evening classes taught by professional instructors who have years of live performance and teaching experience. Students will learn basic chords, rhythm techniques, and simple song arrangements.

All lessons take place at the RiverSound studio on Maple Street. Guitars will be available for use during class, though students may bring their own instruments if they prefer.

Class size is limited, so early registration is recommended.

For additional information or to sign up, visit www.riversoundmusic.com or call (555) 214-8890.`,
          }),
          questions: [
            {
              id: "m3_m2_dl1_q1",
              q: "What is the purpose of the advertisement?",
              options: {
                A: "To promote a beginner guitar course",
                B: "To announce a live music performance",
                C: "To advertise musical instruments for sale",
                D: "To recruit instructors for a music academy",
              },
              answer: "A",
              explanation:
                "광고는 Beginner Guitar Course 등록을 홍보하는 것이 목적이다.",
            },
            {
              id: "m3_m2_dl1_q2",
              q: "What is indicated about the guitar classes?",
              options: {
                A: "They are designed for advanced musicians.",
                B: "Students must bring their own guitars.",
                C: "They will be held at different locations each week.",
                D: "The number of participants may be restricted.",
              },
              answer: "D",
              explanation:
                "본문에 'Class size is limited'라고 했으므로 수강 인원에 제한이 있음을 알 수 있다.",
            },
          ],
        },

        {
          type: "daily_life",
          title: "Daily Life · Passage 2 (3Q)",
          passage: normalizePassage({
            id: "m3_m2_dl_p2",
            title: "Notice",
            text: `Attention Pool Users

To ensure safety and cleanliness around the Oakridge Apartments swimming pool, residents are reminded to follow the guidelines below when leaving the pool area.

Please dry off before entering the hallway or elevators, as wet floors can create slipping hazards for other residents. In addition, pool users should wear appropriate footwear when walking through common areas.

Residents are also asked not to bring food or glass containers into the pool area. Any personal items left unattended after closing time may be removed by the management staff.

We appreciate your cooperation in helping maintain a safe environment for all residents.
— Oakridge Apartments Management`,
          }),
          questions: [
            {
              id: "m3_m2_dl2_q1",
              q: "What is the purpose of the notice?",
              options: {
                A: "To announce new swimming lessons",
                B: "To explain safety guidelines for pool users",
                C: "To inform residents about pool closing hours",
                D: "To advertise new facilities in the building",
              },
              answer: "B",
              explanation:
                "이 공지는 수영장 이용자들에게 안전 및 청결 관련 지침을 알리기 위한 것이다.",
            },
            {
              id: "m3_m2_dl2_q2",
              q: "What are residents advised to do before leaving the pool area?",
              options: {
                A: "Store their belongings in lockers",
                B: "Return pool equipment to staff",
                C: "Dry themselves before entering the building",
                D: "Clean the poolside seating area",
              },
              answer: "C",
              explanation:
                "hallway나 elevators에 들어가기 전에 몸의 물기를 말리라고 직접 안내되어 있다.",
            },
            {
              id: "m3_m2_dl2_q3",
              q: "What is indicated about items left after closing time?",
              options: {
                A: "They will be donated to other residents",
                B: "They may be taken by management staff",
                C: "They must be collected the following day",
                D: "They will be stored at the front desk",
              },
              answer: "B",
              explanation:
                "Any personal items left unattended after closing time may be removed by the management staff라고 명시되어 있다.",
            },
          ],
        },
      ],
    },

    // =======================
    // Module 3 (상위)
    // - CTW + Academic 1지문
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
              id: "m3_ctw_03",
              subject: "history of communication",
              paragraph:
                "This {{01}} allowed texts to be {{02}} quickly and {{03}} widely, {{04}} the cost of books and {{05}} public access to knowledge. As a result, ideas could circulate more {{06}} than ever before, {{07}} intellectual exchange across regions. Many historians argue that this {{08}} played a {{09}} role in the {{10}} of modern education and scientific research.",

              blanks: withDefaultPrefixLen(
                [
                  { key: "01", answer: "invention", meaning: "발명", prefixLen: 5 },
                  { key: "02", answer: "reproduced", meaning: "복제된", prefixLen: 5 },
                  { key: "03", answer: "distributed", meaning: "배포된", prefixLen: 5 },
                  { key: "04", answer: "reducing", meaning: "줄이면서", prefixLen: 4 },
                  { key: "05", answer: "increasing", meaning: "증가시키면서", prefixLen: 4 },
                  { key: "06", answer: "rapidly", meaning: "빠르게", prefixLen: 3 },
                  { key: "07", answer: "encouraging", meaning: "장려하면서", prefixLen: 4 },
                  { key: "08", answer: "technology", meaning: "기술", prefixLen: 5 },
                  { key: "09", answer: "crucial", meaning: "중요한", prefixLen: 4 },
                  { key: "10", answer: "development", meaning: "발전", prefixLen: 5 },
                ],
                2
              ),

              explanation:
                "이 지문은 printing press 같은 기술 혁신이 책의 생산과 유통을 빠르게 만들고, 지식 접근성을 높이며, 교육과 과학 연구의 발전에 crucial한 역할을 했다는 내용을 담고 있다.",
            },
          ],
        },

        {
          type: "academic",
          title: "Humanities · Digital Reconstruction of Ancient Cities (5Q)",
          passage: normalizePassage({
            id: "m3_m3_ac_p1",
            title: "The Advantages and Limits of Reconstruction",
            paragraphs: [
              "Archaeologists increasingly use digital reconstruction to model ancient cities that survive only in ruins. By combining excavation data, written records, and architectural knowledge, researchers create three-dimensional images of streets, temples, and public buildings. These reconstructions help scholars visualize spaces that no longer exist in complete form.",
              "The method is useful not only for display but also for analysis. A model can help researchers test how sunlight entered a building, how crowds may have moved through a marketplace, or how closely buildings were arranged. At the same time, specialists warn that digital reconstructions can appear more certain than the evidence truly allows. Some parts may be based on solid findings, while others depend on informed estimates. For that reason, many projects now label uncertain features clearly.",
            ],
          }),
          questions: [
            {
              id: "m3_m3_ac_q1",
              q: "What is the passage mainly about?",
              options: {
                A: "Why many ruins are disappearing too quickly to study",
                B: "How museums choose which ancient cities to display",
                C: "The advantages and limits of digital reconstruction",
                D: "Why written records are more useful than excavation data",
              },
              answer: "C",
              explanation:
                "지문은 digital reconstruction의 활용 가치와 동시에 그 한계 및 주의점까지 함께 설명하고 있다.",
            },
            {
              id: "m3_m3_ac_q2",
              q: "According to paragraph 2, one use of a digital model is to",
              options: {
                A: "test possible features of ancient urban life",
                B: "replace all fieldwork permanently",
                C: "correct errors in historical writing automatically",
                D: "measure modern tourist traffic",
              },
              answer: "A",
              explanation:
                "2단락에서 sunlight, crowd movement, building arrangement 등을 test할 수 있다고 했으므로 고대 도시 생활의 가능성을 검토하는 데 쓰인다는 뜻이다.",
            },
            {
              id: "m3_m3_ac_q3",
              q: "The word 'solid' in paragraph 2 is closest in meaning to",
              highlight: "solid",
              options: {
                A: "heavy",
                B: "proven",
                C: "physical",
                D: "detailed",
              },
              answer: "B",
              explanation:
                "solid findings는 확실히 뒷받침되는, 입증된 발견이라는 뜻이므로 proven이 가장 가깝다.",
            },
            {
              id: "m3_m3_ac_q4",
              q: "Why does the author mention labeling uncertain features?",
              options: {
                A: "To show that reconstruction teams disagree with architects",
                B: "To explain how museums attract more visitors",
                C: "To distinguish supported elements from probable guesses",
                D: "To prove that most reconstructions are unreliable",
              },
              answer: "C",
              explanation:
                "uncertain features를 따로 표시하는 이유는 증거로 충분히 뒷받침되는 요소와 추정에 의존한 요소를 구분하기 위해서다.",
            },
            {
              id: "m3_m3_ac_q5",
              q: "What can be inferred from the passage?",
              options: {
                A: "Digital reconstructions are useful only for the public.",
                B: "Archaeologists no longer study real ruins directly.",
                C: "Ancient cities can now be rebuilt physically.",
                D: "A realistic-looking model may hide how incomplete the evidence is.",
              },
              answer: "D",
              explanation:
                "지문은 reconstructions가 evidence보다 더 확실해 보일 수 있다고 경고하므로, 실제로는 불완전한 증거가 그럴듯한 모델에 가려질 수 있음을 추론할 수 있다.",
            },
          ],
        },
      ],
    },
  },
};