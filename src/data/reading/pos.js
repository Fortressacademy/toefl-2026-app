// src/data/reading/ctw_givens.js
// CTW · Given Targets (2+ sentence context, inference-first, mixed POS)

const shuffleArray = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const ctw_pos = {
  id: "ctw_pos",
  title: "Complete the Words · Context Inference (Given Targets)",
  total: 26,
  items: shuffleArray([
    // 1) at (prep)
    {
      no: 1,
      sentence:
        "The meeting starts at 9 a.m., but the hallway is already noisy by 8:45. If you arrive late, you’ll miss the first announcement.",
      targetWord: "at",
      prefixLen: 1,
      subject: "pos",
      meaning: "at(~에, ~시각에)",
      synonyms: [],
      forms: { prep: ["at"] },
      answer: "at",
    },

    // 2) by (prep/adv)
    {
      no: 2,
      sentence:
        "The report must be submitted by Friday, so the team is working overtime. If it isn’t finished, the deadline will pass anyway.",
      targetWord: "by",
      prefixLen: 1,
      subject: "pos",
      meaning: "by(~까지)",
      synonyms: [],
      forms: { prep: ["by"] },
      answer: "by",
    },

    // 3) it (pronoun)
    {
      no: 3,
      sentence:
        "A strange noise came from the engine, and everyone turned to listen. After a second, it stopped as suddenly as it began.",
      targetWord: "it",
      prefixLen: 1,
      subject: "pos",
      meaning: "it(그것)",
      synonyms: [],
      forms: { pron: ["it"] },
      answer: "it",
    },

    // 4) or (conj)
    {
      no: 4,
      sentence:
        "You can email the file, or you can upload it to the shared folder. If you do neither, the reviewer can’t start.",
      targetWord: "or",
      prefixLen: 1,
      subject: "pos",
      meaning: "or(또는)",
      synonyms: [],
      forms: { conj: ["or"] },
      answer: "or",
    },

    // 5) may (modal)
    {
      no: 5,
      sentence:
        "The roads are icy tonight, so the delivery may be delayed. If the driver calls, don’t be surprised.",
      targetWord: "may",
      prefixLen: 1,
      subject: "pos",
      meaning: "may(~일지도 모른다)",
      synonyms: [],
      forms: { modal: ["may"] },
      answer: "may",
    },

    // 6) one (number/pronoun)
    {
      no: 6,
      sentence:
        "Two solutions were offered, but only one actually solved the problem. The other created a new issue we didn’t expect.",
      targetWord: "one",
      prefixLen: 1,
      subject: "pos",
      meaning: "one(하나)",
      synonyms: [],
      forms: { pron: ["one"], num: ["one"] },
      answer: "one",
    },

    // 7) own (adj)
    {
      no: 7,
      sentence:
        "She didn’t borrow a laptop—she brought her own to the interview. That small detail made her look prepared.",
      targetWord: "own",
      prefixLen: 1,
      subject: "pos",
      meaning: "own(자기 자신의)",
      synonyms: [],
      forms: { adj: ["own"] },
      answer: "own",
    },

    // 8) two (number)
    {
      no: 8,
      sentence:
        "He asked for two copies of the contract, one for each department. Without them, the signatures couldn’t be processed.",
      targetWord: "two",
      prefixLen: 1,
      subject: "pos",
      meaning: "two(둘)",
      synonyms: [],
      forms: { num: ["two"] },
      answer: "two",
    },

    // 9) only (adv)
    {
      no: 9,
      sentence:
        "The museum is only open on weekends, so weekdays are useless for visitors. Many tourists learn this too late.",
      targetWord: "only",
      prefixLen: 2,
      subject: "pos",
      meaning: "only(오직, 단지)",
      synonyms: [],
      forms: { adv: ["only"], adj: ["only"] },
      answer: "only",
    },

    // 10) that (pronoun/relative)
    {
      no: 10,
      sentence:
        "She pointed to the first chart and said that it explained the entire trend. Everyone stopped arguing and looked again.",
      targetWord: "that",
      prefixLen: 2,
      subject: "pos",
      meaning: "that(그것/접속/관계)",
      synonyms: [],
      forms: { conj: ["that"], pron: ["that"] },
      answer: "that",
    },

    // 11) what (noun clause)
    {
      no: 11,
      sentence:
        "He couldn’t remember what the professor said about the final project. Without that detail, his plan felt incomplete.",
      targetWord: "what",
      prefixLen: 2,
      subject: "pos",
      meaning: "what(무엇/명사절)",
      synonyms: [],
      forms: { pron: ["what"] },
      answer: "what",
    },

    // 12) each (determiner/pronoun)
    {
      no: 12,
      sentence:
        "The manager handed out three tasks, and each employee chose one. By lunch, the team had already started.",
      targetWord: "each",
      prefixLen: 2,
      subject: "pos",
      meaning: "each(각각)",
      synonyms: [],
      forms: { det: ["each"], pron: ["each"] },
      answer: "each",
    },

    // 13) down (adv/prep)
    {
      no: 13,
      sentence:
        "The elevator was broken, so we walked down the stairs in silence. By the time we reached the lobby, everyone was out of breath.",
      targetWord: "down",
      prefixLen: 2,
      subject: "pos",
      meaning: "down(아래로)",
      synonyms: [],
      forms: { adv: ["down"], prep: ["down"] },
      answer: "down",
    },

    // 14) had (aux/verb)
    {
      no: 14,
      sentence:
        "Before the train arrived, we had already waited for forty minutes. When it finally came, nobody complained—everyone just rushed in.",
      targetWord: "had",
      prefixLen: 1,
      subject: "pos",
      meaning: "had(과거완료/가졌다)",
      synonyms: [],
      forms: { aux: ["had"], verb: ["have"] },
      answer: "had",
    },

    // 15) bring about (phrasal)
    {
      no: 15,
      sentence:
        "A single tweet didn’t change anything at first. But the repeated posts began to bring about real pressure on the company.",
      targetWord: "bring about",
      prefixLen: 2,
      prefixLen2: 1,
      subject: "pos",
      meaning: "bring about(초래하다)",
      synonyms: ["cause", "produce"],
      forms: { verb: ["bring about"] },
      answer: "bring about",
    },

    // 16) come true (idiom)
    {
      no: 16,
      sentence:
        "She dreamed of studying abroad for years. When the acceptance email arrived, it felt like her wish would come true.",
      targetWord: "come true",
      prefixLen: 2,
      prefixLen2: 1,
      subject: "pos",
      meaning: "come true(실현되다)",
      synonyms: ["be realized", "happen"],
      forms: { verb: ["come true"] },
      answer: "come true",
    },

    // 17) get along (phrasal)
    {
      no: 17,
      sentence:
        "At first, the new teammates argued over every small decision. After a few projects, they began to get along surprisingly well.",
      targetWord: "get along",
      prefixLen: 1,
      prefixLen2: 1,
      subject: "pos",
      meaning: "get along(사이좋게 지내다)",
      synonyms: ["get on", "get along well"],
      forms: { verb: ["get along"] },
      answer: "get along",
    },

    // 18) lead to (phrasal)
    {
      no: 18,
      sentence:
        "A minor error in the first calculation seemed harmless. Later, it began to lead to much larger mistakes in the final report.",
      targetWord: "lead to",
      prefixLen: 2,
      prefixLen2: 1,
      subject: "pos",
      meaning: "lead to(~로 이어지다)",
      synonyms: ["result in", "cause"],
      forms: { verb: ["lead to"] },
      answer: "lead to",
    },

    // 19) put off (phrasal)
    {
      no: 19,
      sentence:
        "He planned to call the client in the morning. But he kept finding excuses and decided to put off the conversation until tomorrow.",
      targetWord: "put off",
      prefixLen: 2,
      prefixLen2: 1,
      subject: "pos",
      meaning: "put off(미루다)",
      synonyms: ["postpone", "delay"],
      forms: { verb: ["put off"] },
      answer: "put off",
    },

    // 20) play a role (idiom)
    {
      no: 20,
      sentence:
        "The final decision wasn’t based on price alone. Trust and timing also play a role in how partners choose each other.",
      targetWord: "play a role",
      prefixLen: 2,
      prefixLen2: 1,
      subject: "pos",
      meaning: "play a role(역할을 하다)",
      synonyms: ["contribute", "matter"],
      forms: { verb: ["play a role"] },
      answer: "play a role",
    },

    // 21) shed light on (idiom)
    {
      no: 21,
      sentence:
        "The old diary didn’t solve the mystery completely. Still, it helped shed light on why the family left so suddenly.",
      targetWord: "shed light on",
      prefixLen: 2,
      prefixLen2: 1,
      subject: "pos",
      meaning: "shed light on(밝히다/명확히 하다)",
      synonyms: ["clarify", "explain"],
      forms: { verb: ["shed light on"] },
      answer: "shed light on",
    },

    // 22) take care of (idiom)
    {
      no: 22,
      sentence:
        "The baby started crying, and everyone looked around nervously. The older sister calmly stepped in to take care of the situation.",
      targetWord: "take care of",
      prefixLen: 2,
      prefixLen2: 1,
      subject: "pos",
      meaning: "take care of(돌보다/처리하다)",
      synonyms: ["handle", "look after"],
      forms: { verb: ["take care of"] },
      answer: "take care of",
    },

    // 23) look forward to (idiom)
    {
      no: 23,
      sentence:
        "The semester has been exhausting, but the break is close. Many students look forward to sleeping without alarms.",
      targetWord: "look forward to",
      prefixLen: 2,
      prefixLen2: 1,
      subject: "pos",
      meaning: "look forward to(~을 기대하다)",
      synonyms: ["anticipate", "await"],
      forms: { verb: ["look forward to"] },
      answer: "look forward to",
    },

    // 24) rely on (phrasal)
    {
      no: 24,
      sentence:
        "The power went out during the storm, and the house became silent. We had to rely on candles to see the hallway.",
      targetWord: "rely on",
      prefixLen: 2,
      prefixLen2: 1,
      subject: "pos",
      meaning: "rely on(~에 의존하다)",
      synonyms: ["depend on", "count on"],
      forms: { verb: ["rely on"] },
      answer: "rely on",
    },

    // 25) near (prep/adj/adv)
    {
      no: 25,
      sentence:
        "The restaurant is near the station, so you can walk there in five minutes. If you pass the bookstore, you’ve gone too far.",
      targetWord: "near",
      prefixLen: 2,
      subject: "pos",
      meaning: "near(가까운/근처에)",
      synonyms: ["close to"],
      forms: { prep: ["near"], adj: ["near"], adv: ["near"] },
      answer: "near",
    },

    // 26) depend on (phrasal)
    {
      no: 26,
      sentence:
        "Some days the project moves quickly, and other days it stalls. The schedule will depend on how fast the approvals come in.",
      targetWord: "depend on",
      prefixLen: 2,
      prefixLen2: 1,
      subject: "pos",
      meaning: "depend on(~에 달려 있다)",
      synonyms: ["rely on", "hinge on"],
      forms: { verb: ["depend on"] },
      answer: "depend on",
    },
  ]),
};