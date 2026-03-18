// src/data/writing/mocks/mock1.js
const TASK1_ITEMS_MOCK1 = [
  {
    no: 1,
    promptTop: "Your analysis was very detailed.",
    parts: [
      { t: "blank" }, 
      { t: "blank" },
      { t: "blank" },
      { t: "blank" },
      { t: "blank" },
      { t: "blank" },
      { t: "blank" },
      { t: "text", v: "?" },
    ],
    wordBank: [
      "could",
      "explain",
      "how",
      "you",
      "interpreted",
      "the data",
      "clearly",
      "whether",
       "you",
    ],
    answer: "Could you explain how you interpreted the data?",
  },
  {
    no: 2,
    promptTop: "Why did the scientists repeat the experiment?",
    parts: [
      { t: "blank" },
      { t: "blank" },
      { t: "blank" },
      { t: "text", v: " while " },
      { t: "blank" },
      { t: "blank" },
      { t: "blank" },
      { t: "text", v: "." },
    ],
    wordBank: [
      "errors",
      "discovered",
      "were",
      "they",
      "conducting",
      "the initial",
      "trial",
      "because",
    ],
    answer: "They discovered errors while conducting the initial trial.",
  },
  {
    no: 3,
    promptTop: "Why hasn’t the committee made a decision yet?",
    parts: [
      { t: "blank" },
      { t: "blank" },
      { t: "text", v: " still " },
      { t: "blank" },
      { t: "blank" },
      { t: "blank" },
      { t: "text", v: "." },
    ],
    wordBank: [
      "members",
      "are",
      "reviewing",
      "the evidence",
      "carefully",
      "have",
      "been",
    ],
    answer: "Members are still reviewing the evidence carefully.",
  },
  {
    no: 4,
    promptTop: "May I ask why the budget was adjusted?",
    parts: [
      { t: "text", v: "The administration " },
      { t: "blank" },
      { t: "blank" },
      { t: "blank" },
      { t: "blank" },
      { t: "blank" },
      { t: "text", v: " over the next fiscal year." },
    ],
    wordBank: [
      "plans",
      "to allocate",
      "additional resources",
      "is",
      "considering",
      "working",
      "on",
    ],
    answer:
      "The administration is considering plans to allocate additional resources over the next fiscal year.",
  },
  {
    no: 5,
    promptTop: "Why did the researcher modify the hypothesis?",
    parts: [
      { t: "blank" },
      { t: "blank" },
      { t: "blank" },
      { t: "blank" },
      { t: "text", v: " after " },
      { t: "blank" },
      { t: "blank" },
      { t: "blank" },
      { t: "text", v: "." },
    ],
    wordBank: [
      "he",
      "revised",
      "it",
      "analyzing",
      "new findings",
      "carefully",
      "before",
      "had",
    ],
    answer: "He had revised it after analyzing new findings carefully.",
  },
  {
    no: 6,
    promptTop: "Why are many experts concerned about climate policy?",
    parts: [
      { t: "blank" },
      { t: "blank" },
      { t: "text", v: " that " },
      { t: "blank" },
      { t: "blank" },
      { t: "blank" },
      { t: "blank" },
      { t: "blank" },
       { t: "blank" },
      { t: "text", v: "." },
    ],
    wordBank: [
      "they",
      "argue",
      "may",
      "not",
      "adequately",
      "address",
      "it",
      "the issue",
    ],
    answer: "They argue that it may not adequately address the issue.",
  },
  {
    no: 7,
    promptTop: "Can you tell me why the data was excluded?",
    parts: [
      { t: "text", v: "Some results " },
      { t: "blank" },
      { t: "blank" },
      { t: "blank" },
      { t: "text", v: " during " },
      { t: "blank" },
      { t: "text", v: "." },
    ],
    wordBank: [
      "were",
      "considered",
      "unreliable",
      "the review process",
      "carefully",
      "because",
    ],
    answer:
      "Some results were considered unreliable during the review process.",
  },
  {
    no: 8,
    promptTop: "Why did the company expand internationally?",
    parts: [
      { t: "blank" },
      { t: "blank" },
      { t: "blank" },
      { t: "text", v: " because " },
      { t: "blank" },
      { t: "blank" },
      { t: "blank" },
      { t: "text", v: "." },
    ],
    wordBank: [
      "it",
      "sought",
      "new markets",
      "competition",
      "increased",
      "had",
      "before",
    ],
    answer: "It sought new markets because competition had increased.",
  },
  {
    no: 9,
    promptTop: "Why haven’t the students submitted their assignments?",
    parts: [
      { t: "blank" },
      { t: "blank" },
      { t: "blank" },
      { t: "text", v: " that " },
      { t: "blank" },
      { t: "blank" },
      { t: "blank" },
      { t: "text", v: "." },
    ],
    wordBank: [
      "they",
      "misunderstood",
      "the instructions",
      "were",
      "clearly",
      "provided",
      "had",
    ],
    answer:
      "They misunderstood the instructions that were clearly provided.",
  },
  {
    no: 10,
    promptTop: "Why was the theory widely accepted?",
    parts: [
      { t: "text", v: "Researchers " },
      { t: "blank" },
      { t: "text", v: " convincingly " },
      { t: "text", v: " that " },
      { t: "blank" },
      { t: "blank" },
      { t: "blank" },
      { t: "blank" },
      { t: "text", v: "." },
    ],
    wordBank: [
      "demonstrated",
      "it",
      "strong",
      "empirical evidence",
      "provided",
      "was",
    ],
    answer:
      "Researchers demonstrated convincingly that strong empirical evidence was provided.",
  },
];
export const MOCK1 = {
  id: "w_mock_1",
  title: "모의고사 1",
  meta: "Task 1–3 · Timed (5:50 / 7:00 / 10:00)",
  taskTimeLimitsSec: [350, 420, 600],

  tasks: [
    {
      type: "task1_reorder",
      title: "Task 1 · Build a Sentence",
      instruction: "Move the words in the boxes to create grammatical sentences.",
      items: TASK1_ITEMS_MOCK1,
    },
   {
  type: "task2_email",
  title: "Task 2 · Write an Email",
  instruction:
    "You will read some information and use the information to write an email.",

  toName: "Annabelle Whitman",
  subject: "Mentoring Program",   // ✅ 추가

  situation:
    "You are a second-year university student. Your roommate works in the university's mentoring program and speaks very highly of it. You are interested in joining the program and want to learn more about how it works before applying.",

  bullets: [
    "Explain why you want to join the mentoring program",
    "Ask for information about the program's structure or expectations",
    "Ask about possible ways for you to join the program"
  ],

  minWords: 120,
  recommendedWords: "120–180"
},
    {
      type: "task3_discussion",
      title: "Task 3 · Write for an Academic Discussion",
      instruction:
        "A professor has posted a question about a topic and students have responded with their thoughts and ideas. Make a contribution to the discussion.",
      prompt: {
        author: "Professor Martinez",
        intro:
          "Your professor is teaching a class on sociology. Write a post responding to the professor's question.",
        question:
          "Today we are discussing the role of pets in modern society. Some people believe that pets should be considered family members, while others argue that they are simply animals and should not be treated like humans. What do you think? Should pets be considered family members? Why or why not?",
      },
      students: [
        {
          name: "Alex",
          text:
            "I believe pets should definitely be considered family members. Many people develop deep emotional bonds with their pets. For example, dogs and cats often provide companionship and emotional support. In some cases, they even help reduce stress and anxiety. Because of this, it makes sense to treat them as part of the family.",
        },
        {
          name: "Mina",
          text:
            "I disagree. While pets are important to many people, they are still animals and do not have the same responsibilities or roles as human family members. Treating them exactly like humans can sometimes lead to unrealistic expectations. I think we should care for pets, but not define them as family.",
        },
      ],
      minWords: 100,
      recommendedWords: "100–120",
    },
  ],
};