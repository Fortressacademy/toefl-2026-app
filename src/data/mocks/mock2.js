// src/data/reading/mocks/mock2.js

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

export const mock2 = {
  id: "mock2",
  title: "Reading 모의고사 2",
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
              id: "m2_ctw_01",
              subject: "behavioral economics",
              paragraph:
                "Consumers often believe they prefer products that are professionally manufactured and perfectly finished. However, research in behavioral {{01}} suggests that people {{02}} place greater {{03}} on objects they help {{04}} themselves. This phenomenon, known as the IKEA Effect, was identified {{05}} experiments in {{06}} participants assembled simple {{07}} or constructed items such as paper boxes. After {{08}} the tasks, participants consistently {{09}} their own creations as more {{10}} than identical products assembled by others. Researchers argue that the effort invested in building an object increases a sense of ownership and personal attachment. As a result, individuals may overestimate the quality of items they partially constructed. This effect helps explain why do-it-yourself products remain popular despite requiring additional time and effort.",

              blanks: withDefaultPrefixLen(
                [
                  { key: "01", answer: "economics", meaning: "경제학", prefixLen: 4 },
                  { key: "02", answer: "frequently", meaning: "자주", prefixLen: 5 },
                  { key: "03", answer: "value", meaning: "가치", prefixLen: 3 },
                  { key: "04", answer: "create", meaning: "만들다", prefixLen: 2 },
                  { key: "05", answer: "through", meaning: "~을 통해", prefixLen: 3 },
                  { key: "06", answer: "which", meaning: "~하는 / 그 안에서", prefixLen: 1 },
                  { key: "07", answer: "furniture", meaning: "가구", prefixLen: 4 },
                  { key: "08", answer: "completing", meaning: "완성하는 것", prefixLen: 3 },
                  { key: "09", answer: "rated", meaning: "평가했다", prefixLen: 2 },
                  { key: "10", answer: "valuable", meaning: "가치 있는", prefixLen: 3 },
                ],
                2
              ),

              explanation:
                "이 지문은 IKEA Effect를 설명한다. 사람들은 스스로 만든 물건에 더 높은 가치를 부여하는 경향이 있으며, 이는 behavioral economics에서 다뤄지는 대표적 현상이다. 실험을 통해 확인되었고, participants가 가구나 상자를 만든 뒤 자신의 결과물을 더 valuable하게 평가했다는 흐름이다.",
            },
          ],
        },

        /* ---------- Daily Life Passage 1 (3Q) ---------- */
        {
          type: "daily_life",
          title: "Daily Life · Passage 1 (3Q)",
          passage: {
            id: "m2_m1_dl_p1",
            docType: "notice",
            title: "Parking Garage Maintenance",
            date: "Beginning Monday, July 8",
            body: `Beginning Monday, July 8, the underground parking garage at the Rivergate Office Complex will undergo scheduled maintenance to repair ventilation equipment and repaint directional markings.

During this period, the north entrance to the garage will be closed. Employees who normally access the garage from Rivergate Avenue should instead use the west entrance on Palmer Street. The remaining entrances will remain open, but parking availability may be limited while work is in progress.

Maintenance is expected to continue for approximately four days. Employees are encouraged to arrive earlier than usual or consider using nearby public parking facilities during the maintenance period.

We appreciate your cooperation and apologize for any inconvenience.
— Facilities Management`,
          },
          questions: [
            {
              id: "m2_m1_dl1_q1",
              q: "What is the main purpose of the notice?",
              options: {
                A: "To announce new parking fees",
                B: "To inform employees about garage maintenance",
                C: "To request employees relocate their vehicles permanently",
                D: "To explain changes to office operating hours",
              },
              answer: "B",
              explanation:
                "공지의 핵심은 지하 주차장이 정비에 들어간다는 사실을 직원들에게 알리는 것이다. 요금 인상, 영구 이동, 운영 시간 변경은 언급되지 않는다.",
            },
            {
              id: "m2_m1_dl1_q2",
              q: "What will happen during the maintenance period?",
              options: {
                A: "One entrance to the garage will be unavailable",
                B: "Employees will need to register their vehicles again",
                C: "The entire garage will be closed",
                D: "Parking spaces will be reassigned to visitors",
              },
              answer: "A",
              explanation:
                "본문에 'the north entrance to the garage will be closed'라고 명시되어 있으므로 한 출입구가 사용 불가해진다.",
            },
            {
              id: "m2_m1_dl1_q3",
              q: "What are employees advised to do?",
              options: {
                A: "Park only in the underground garage",
                B: "Avoid using the west entrance",
                C: "Allow extra time to find parking",
                D: "Move their vehicles before Monday",
              },
              answer: "C",
              explanation:
                "본문 마지막 부분에서 직원들은 평소보다 더 일찍 도착하거나 nearby public parking을 고려하라고 했다. 이는 주차에 시간이 더 걸릴 수 있음을 뜻한다.",
            },
          ],
        },

        /* ---------- Daily Life Passage 2 (2Q) ---------- */
        {
          type: "daily_life",
          title: "Daily Life · Passage 2 (2Q)",
          passage: {
            id: "m2_m1_dl_p2",
            docType: "notice",
            title: "GreenLeaf Market",
            date: "Posted 3 hours ago",
            body: `We’re excited to share that our new downtown store will open this Saturday! To celebrate, the first 50 customers will receive a complimentary tote bag with seasonal produce samples. The new location will feature a wider range of locally sourced fruits and vegetables, including products from several farms that have recently partnered with us. The store opens at 9:00 a.m., and additional event details will be posted on our website tomorrow.`,
          },
          questions: [
            {
              id: "m2_m1_dl2_q1",
              q: "What is suggested about the promotional gift mentioned in the post?",
              options: {
                A: "It will contain items sold exclusively at the new store.",
                B: "It will be distributed to customers who visit during the weekend.",
                C: "It will mainly include products from farms that recently partnered with the store.",
                D: "It will be available only to customers who arrive early.",
              },
              answer: "D",
              explanation:
                "'the first 50 customers'라고 했으므로 선착순으로 제공된다. 즉, 일찍 도착한 사람들만 받을 수 있다는 뜻이다.",
            },
            {
              id: "m2_m1_dl2_q2",
              q: "Why does the writer mention that more event details will be posted on the website tomorrow?",
              options: {
                A: "To encourage customers to check for updated information later",
                B: "To explain that the opening schedule might be delayed",
                C: "To indicate that customers must register online before visiting",
                D: "To clarify that the event will be held at multiple locations",
              },
              answer: "A",
              explanation:
                "아직 공개되지 않은 추가 정보가 내일 웹사이트에 올라온다고 했으므로, 독자들이 나중에 다시 확인하도록 유도하는 목적이다.",
            },
          ],
        },

        /* ---------- Academic Passage (5Q) ---------- */
        {
          type: "academic",
          title: "Astronomy · Extreme Auroras on an Exoplanet (5Q)",
          passage: normalizePassage({
            id: "m2_m1_ac_p1",
            title: "A Newly Observed Atmospheric Phenomenon",
            paragraphs: [
              "Astronomers recently identified an unusual exoplanet orbiting a distant star about 200 light-years from Earth. The planet, designated Kepler-452c, attracted attention because its atmospheric behavior differs significantly from that of most previously discovered planets.",
              "Using advanced spectroscopic instruments, researchers analyzed the light passing through the planet’s atmosphere when it moved in front of its host star. Surprisingly, they detected traces of charged particles interacting with the planet’s magnetic field. This interaction produces a luminous atmospheric display similar to Earth’s auroras, although on a far larger scale.",
              "Auroras typically occur when charged particles from a star collide with gases in a planet’s upper atmosphere. On Earth, these interactions create the colorful lights often visible near the polar regions. However, observations suggest that the auroras on Kepler-452c may extend across much of the planet’s surface because its magnetic field appears unusually strong.",
              "Scientists believe that studying these extreme auroral events could help them better understand how magnetic fields protect planetary atmospheres from stellar radiation. This knowledge may also assist astronomers in identifying other planets capable of sustaining stable environments.",
            ],
          }),
          questions: [
            {
              id: "m2_m1_ac_q1",
              q: "What is the main purpose of the passage?",
              options: {
                A: "To explain how auroras influence weather patterns on Earth",
                B: "To describe a newly observed astronomical phenomenon on an exoplanet",
                C: "To compare the sizes of different planets in the Kepler system",
                D: "To argue that auroras are more common than previously believed",
              },
              answer: "B",
              explanation:
                "지문 전체는 외계행성에서 관측된 특이한 오로라 현상을 소개하고 그 의미를 설명하는 데 초점이 있다.",
            },
            {
              id: "m2_m1_ac_q2",
              q: "According to paragraph 2, how did researchers study the planet’s atmosphere?",
              options: {
                A: "By analyzing light that passed through the atmosphere",
                B: "By sending probes directly into the planet’s atmosphere",
                C: "By measuring radio signals emitted from the planet’s surface",
                D: "By comparing images taken by several space telescopes",
              },
              answer: "A",
              explanation:
                "2단락에서 researchers analyzed the light passing through the planet’s atmosphere라고 직접 설명한다.",
            },
            {
              id: "m2_m1_ac_q3",
              q: "The word 'interaction' in paragraph 2 is closest in meaning to",
              highlight: "interaction",
              options: {
                A: "conflict",
                B: "combination",
                C: "communication",
                D: "investigation",
              },
              answer: "B",
              explanation:
                "문맥상 charged particles가 magnetic field와 서로 작용하는 것을 뜻하므로 '상호작용, 결합적 작용'에 가까운 combination이 가장 적절하다.",
            },
            {
              id: "m2_m1_ac_q4",
              q: "According to the passage, why might auroras on Kepler-452c be visible across much of the planet?",
              options: {
                A: "The planet rotates very slowly",
                B: "Its atmosphere contains unusually dense gases",
                C: "Its magnetic field is extremely strong",
                D: "Its star releases less radiation than the Sun",
              },
              answer: "C",
              explanation:
                "3단락 마지막 문장에서 the auroras ... may extend across much of the planet’s surface because its magnetic field appears unusually strong라고 명시한다.",
            },
            {
              id: "m2_m1_ac_q5",
              q: "Why do scientists want to study these auroral events?",
              options: {
                A: "To determine how planets maintain protective atmospheres",
                B: "To calculate the exact distance between Earth and Kepler-452c",
                C: "To observe how stars change over time",
                D: "To identify planets with the largest magnetic fields",
              },
              answer: "A",
              explanation:
                "마지막 단락에서 이런 오로라 현상을 연구하면 magnetic fields가 어떻게 planetary atmospheres를 보호하는지 이해하는 데 도움이 된다고 했다.",
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
        /* ---------- Module 2 CTW ---------- */
        {
          type: "ctw_paragraph",
          title: "CTW · Paragraph (10Q)",
          items: [
            {
              id: "m2_ctw_02",
              subject: "psychology and intelligence",
              paragraph:
                "Throughout much of the twentieth century, researchers {{01}} a steady increase in average intelligence test scores across many {{02}}. This trend became known as the Flynn Effect, named after the political scientist James Flynn, {{03}} analyzed the {{04}} in {{05}}. Scholars have proposed several {{06}} for the rise in scores. Improvements in {{07}}, better nutrition, and {{08}} exposure to complex visual information may all contribute to {{09}} cognitive skills. However, recent studies suggest that the increase may be slowing or even reversing in some regions. As a {{10}}, researchers continue to investigate the social and environmental factors that influence human intelligence.",

              blanks: withDefaultPrefixLen(
                [
                  { key: "01", answer: "observed", meaning: "관찰했다", prefixLen: 4 },
                  { key: "02", answer: "countries", meaning: "국가들", prefixLen: 4 },
                  { key: "03", answer: "who", meaning: "~한 사람", prefixLen: 1 },
                  { key: "04", answer: "phenomenon", meaning: "현상", prefixLen: 5 },
                  { key: "05", answer: "detail", meaning: "세부", prefixLen: 3 },
                  { key: "06", answer: "explanations", meaning: "설명들", prefixLen: 4 },
                  { key: "07", answer: "education", meaning: "교육", prefixLen: 4 },
                  { key: "08", answer: "greater", meaning: "더 큰", prefixLen: 3 },
                  { key: "09", answer: "enhanced", meaning: "향상된", prefixLen: 4 },
                  { key: "10", answer: "result", meaning: "결과", prefixLen: 2 },
                ],
                2
              ),

              explanation:
                "이 지문은 Flynn Effect를 설명한다. 20세기 동안 여러 국가에서 평균 지능검사 점수가 상승하는 현상이 관찰되었고, James Flynn가 이 현상을 자세히 분석했다. 교육, 영양, 복잡한 시각 정보 노출 증가 등이 인지 능력 향상에 기여했을 수 있다는 내용이다.",
            },
          ],
        },

        {
  type: "daily_life",
  title: "Daily Life · Passage 1 (2Q)",
  passage: {
    id: "m2_dl_p1",
    docType: "text_messages",
    title: "Messages",
    subtitle: "Daniel · Mira",
    meta: "10:14 a.m.",
    participants: [
      { id: "daniel", name: "Daniel" },
      { id: "mira", name: "Mira" },
    ],
    meId: "daniel",
    messages: [
      {
        from: "daniel",
        time: "10:14 a.m.",
        text: "Hi Mira, I just noticed that the conference room we reserved for tomorrow’s client briefing is no longer available. The admin team said another department extended their meeting unexpectedly.",
      },
      {
        from: "mira",
        time: "10:16 a.m.",
        text: "Oh no. The clients are arriving at 11, right? Did they suggest another room?",
      },
      {
        from: "daniel",
        time: "10:18 a.m.",
        text: "Yes, there’s a smaller room on the 5th floor, but it only seats six. Since there will be eight of us, I’m checking whether the training room might be free instead.",
      },
      {
        from: "mira",
        time: "10:21 a.m.",
        text: "Good idea. If that doesn’t work, we could also move the meeting to the café area near reception—it’s usually quiet late in the morning.",
      },
    ],
  },
          questions: [
            {
              id: "m2_dl1_q1",
              q: "What problem are Daniel and Mira discussing?",
              options: {
                A: "A client meeting has been canceled.",
                B: "A reserved meeting room is no longer available.",
                C: "The clients have requested a different meeting time.",
                D: "The training room is being renovated.",
              },
              answer: "B",
              explanation:
                "첫 메시지에서 Daniel이 예약한 conference room이 더 이상 available하지 않다고 말한다. 따라서 핵심 문제는 예약된 회의실을 사용할 수 없게 된 것이다.",
            },
            {
              id: "m2_dl1_q2",
              q: "What is suggested about the training room?",
              options: {
                A: "Daniel has already confirmed it is available.",
                B: "It is larger than the originally reserved room.",
                C: "Daniel is considering using it as an alternative location.",
                D: "It is located near the reception area.",
              },
              answer: "C",
              explanation:
                "Daniel이 'I’m checking whether the training room might be free instead'라고 했으므로 대체 장소로 검토 중임을 알 수 있다.",
            },
          ],
        },

        {
          type: "daily_life",
          title: "Daily Life · Passage 2 (3Q)",
          passage: {
            id: "m2_dl_p2",
            docType: "email",
            title: "Email",
            from: "Carla Mendes",
            to: "Staff Members",
            subject: "Revised Training Schedule",
            body: `Dear Staff,

Due to a scheduling conflict involving the main conference room, the customer service training session originally planned for Thursday afternoon has been moved to Friday at 9:30 a.m. The location will remain the same.

Participants are encouraged to arrive a few minutes early, as updated training materials will be distributed before the session begins.

If you are unable to attend at the new time, please notify the Human Resources department by Wednesday afternoon so that alternative arrangements can be considered.

Best regards,
Carla Mendes`,
          },
          questions: [
            {
              id: "m2_dl2_q1",
              q: "Why was the training session moved?",
              options: {
                A: "The originally reserved room cannot be used.",
                B: "The presenter will not be available on Thursday.",
                C: "The training materials are still being prepared.",
                D: "Some employees requested a different time.",
              },
              answer: "A",
              explanation:
                "첫 문단에서 main conference room과 관련된 scheduling conflict 때문에 일정이 변경되었다고 했다. 따라서 원래 예정된 공간을 사용할 수 없게 된 것이 이유다.",
            },
            {
              id: "m2_dl2_q2",
              q: "What are participants advised to do before the session begins?",
              options: {
                A: "Submit a registration form",
                B: "Arrive a little earlier than the scheduled time",
                C: "Bring printed copies of documents",
                D: "Review training materials online",
              },
              answer: "B",
              explanation:
                "Participants are encouraged to arrive a few minutes early라고 명시되어 있다.",
            },
            {
              id: "m2_dl2_q3",
              q: "What are employees asked to do if they cannot attend the session?",
              options: {
                A: "Contact the conference center staff",
                B: "Wait for another training session to be announced",
                C: "Send the training materials to their supervisor",
                D: "Inform the Human Resources department in advance",
              },
              answer: "D",
              explanation:
                "마지막 문단에서 새 시간에 참석할 수 없다면 Wednesday afternoon까지 Human Resources department에 notify하라고 했다.",
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
        /* ---------- Module 3 CTW ---------- */
        {
          type: "ctw_paragraph",
          title: "CTW · Paragraph (10Q)",
          items: [
            {
              id: "m2_ctw_03",
              subject: "digital culture",
              paragraph:
                "Internet memes have become a prominent form of communication in online {{01}}. A meme {{02}} consists of an image, phrase, or short video that {{03}} rapidly {{04}} digital {{05}}. Users frequently modify existing memes by {{06}} captions or visual elements, allowing the content to adapt to different {{07}} contexts. Because of this process, memes often evolve as they {{08}} through social networks. Scholars studying digital culture argue that memes function as a modern form of cultural {{09}}. Much {{10}} traditional folklore, memes allow ideas and humor to be shared, reshaped, and reinterpreted by large groups of people. Their popularity demonstrates how collective creativity can shape cultural expression in the digital age.",

              blanks: withDefaultPrefixLen(
                [
                  { key: "01", answer: "communities", meaning: "공동체들", prefixLen: 3 },
                  { key: "02", answer: "typically", meaning: "보통", prefixLen: 4 },
                  { key: "03", answer: "spreads", meaning: "퍼진다", prefixLen: 3 },
                  { key: "04", answer: "across", meaning: "~전역에 걸쳐", prefixLen: 2 },
                  { key: "05", answer: "platforms", meaning: "플랫폼들", prefixLen: 4 },
                  { key: "06", answer: "altering", meaning: "바꾸면서", prefixLen: 3 },
                  { key: "07", answer: "cultural", meaning: "문화적", prefixLen: 3 },
                  { key: "08", answer: "circulate", meaning: "순환하다", prefixLen: 3 },
                  { key: "09", answer: "transmission", meaning: "전달", prefixLen: 5 },
                  { key: "10", answer: "like", meaning: "~처럼", prefixLen: 1 },
                ],
                2
              ),

              explanation:
                "이 지문은 인터넷 밈을 디지털 시대의 cultural transmission으로 설명한다. 밈은 online communities에서 빠르게 퍼지고, 여러 platforms across 확산되며, users가 captions를 바꾸면서 cultural contexts에 맞게 변형한다. 이 과정에서 밈은 전통 민속처럼 집단적으로 재생산된다.",
            },
          ],
        },

        {
          type: "academic",
          title: "Art Theory · Generative Art (5Q)",
          passage: normalizePassage({
            id: "m2_m3_ac_p1",
            title: "Process, Automation, and Authorship",
            paragraphs: [
              "Generative art is a type of digital art in which the artist creates a system instead of a single final image. The artist writes rules that control features such as color, shape, repetition, and movement. When the program runs, the computer produces an image by following those rules. Because many systems include random values, the result is not always exactly the same.",
              "This has changed the way some scholars think about authorship in art. In traditional painting, the artist usually decides each visible detail directly. In generative art, however, the artist designs a process that can produce many related but different outcomes. Supporters argue that this still reflects human creativity, since the artist determines the structure and limits of the system. Critics, on the other hand, question whether a work should be considered fully artistic when the final form is partly shaped by automation.",
            ],
          }),
          questions: [
            {
              id: "m2_m3_ac_q1",
              q: "What is the passage mainly about?",
              options: {
                A: "Why painters are beginning to abandon manual techniques",
                B: "How digital museums display computer-based works",
                C: "Why critics reject all machine-assisted artwork",
                D: "How generative art works and why it raises questions",
              },
              answer: "D",
              explanation:
                "1단락은 generative art의 작동 방식을 설명하고, 2단락은 그것이 authorship와 artistic value에 어떤 논쟁을 일으키는지 설명한다.",
            },
            {
              id: "m2_m3_ac_q2",
              q: "According to paragraph 1, why can two images from one program differ?",
              options: {
                A: "The artist usually edits them afterward",
                B: "The software often uses chance-based elements",
                C: "The computer changes the rules each time",
                D: "The viewer influences the result directly",
              },
              answer: "B",
              explanation:
                "1단락 마지막 문장에서 many systems include random values라고 했으므로 우연적 요소 때문에 결과가 완전히 같지 않을 수 있다.",
            },
            {
              id: "m2_m3_ac_q3",
              q: "The word 'outcomes' in paragraph 2 is closest in meaning to",
              highlight: "outcomes",
              options: {
                A: "results",
                B: "tools",
                C: "stages",
                D: "patterns",
              },
              answer: "A",
              explanation:
                "문맥상 outcomes는 시스템이 산출해 내는 서로 다른 결과물들을 의미하므로 results가 가장 적절하다.",
            },
            {
              id: "m2_m3_ac_q4",
              q: "What can be inferred about supporters of generative art?",
              options: {
                A: "They believe randomness makes artists unnecessary.",
                B: "They think only handmade work deserves recognition.",
                C: "They see the artist’s role in building the system itself.",
                D: "They want computers to replace museums.",
              },
              answer: "C",
              explanation:
                "지지자들은 artist determines the structure and limits of the system라고 보기 때문에, 예술가의 창의성이 시스템 설계 자체에 반영된다고 본다.",
            },
            {
              id: "m2_m3_ac_q5",
              q: "Why does the author mention critics?",
              options: {
                A: "To show that generative art has inspired debate",
                B: "To explain how digital programs are coded",
                C: "To compare software with oil paint",
                D: "To prove that automation is unreliable",
              },
              answer: "A",
              explanation:
                "지문은 지지자와 비판자의 관점을 함께 제시함으로써 generative art가 예술성과 저자성에 관한 논쟁을 불러일으키고 있음을 보여 준다.",
            },
          ],
        },
      ],
    },
  },
};