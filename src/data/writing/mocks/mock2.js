// src/data/writing/mocks/mock2.js

const TASK1_ITEMS_MOCK2 = [
  
  {
    no: 1,
    promptTop: "I missed the registration deadline.",
    parts: [
      { t: "blank" }, // You
      { t: "blank" }, // can
      { t: "blank" }, // still
      { t: "blank" }, // add
      { t: "text", v: "the course if " },
      { t: "blank" }, // there
      { t: "blank" }, // is
      { t: "blank" }, // an open seat
      { t: "text", v: "." },
    ],
    wordBank: [
      "you",
      "can",
      "still",
      "add",
      "there",
      "is",
      "an open seat",
      "online",
    ],
    answer: "You can still add the course if there is an open seat.",
  },
  {
    no: 2,
    promptTop: "Is the library open on holidays?",
    parts: [
      { t: "blank" }, // It
      { t: "blank" }, // usually
      { t: "blank" }, // closes
      { t: "text", v: "on " },
      { t: "blank" }, // national holidays
      { t: "text", v: ", " },
      { t: "blank" }, // but
      { t: "blank" }, // not
      { t: "blank" }, // always
      { t: "text", v: "." },
    ],
    wordBank: [
      "it",
      "usually",
      "closes",
      "national holidays",
      "but",
      "not",
      "always",
      "early",
    ],
    answer: "It usually closes on national holidays, but not always.",
  },
  {
    no: 3,
    promptTop: "I can’t access the database from home.",
    parts: [
      { t: "blank" }, // You
      { t: "blank" }, // need
      { t: "text", v: "to " },
      { t: "blank" }, // log
      { t: "blank" }, // in
      { t: "text", v: "through " },
      { t: "blank" }, // the university VPN
      { t: "blank" }, // first
      { t: "text", v: "." },
    ],
    wordBank: [
      "you",
      "need",
      "log",
      "in",
      "the university VPN",
      "first",
      "properly",
      "sometimes",
    ],
    answer: "You need to log in through the university VPN first.",
  },
  {
    no: 4,
    promptTop: "The meeting starts in five minutes.",
    parts: [
      { t: "blank" }, // Then
      { t: "text", v: "let’s " },
      { t: "blank" }, // keep
      { t: "text", v: "the update " },
      { t: "blank" }, // short
      { t: "blank" }, // and
      { t: "blank" }, // focus
      { t: "text", v: "on " },
      { t: "blank" }, // essentials
      { t: "text", v: "." },
    ],
    wordBank: [
      "then",
      "keep",
      "short",
      "and",
      "focus",
      "essentials",
    ],
    answer: "Then let’s keep the update short and focus on essentials.",
  },
  {
    no: 5,
    promptTop: "I’m worried my email sounded rude.",
    parts: [
      { t: "blank" }, // It
      { t: "blank" }, // doesn’t
      { t: "blank" }, // seem
      { t: "blank" }, // rude
      { t: "text", v: "to me as long as " },
      { t: "blank" }, // you
      { t: "blank" }, // include
      { t: "blank" },
      { t: "blank" }, // a polite closing
      { t: "text", v: "." },
    ],
    wordBank: [
      "it",
      "doesn’t",
      "seem",
      "rude",
      "you",
      "include",
      "a polite",
      " closing",
      " as",
    ],
    answer: "It doesn’t seem rude to me as long as you include a polite closing.",
  },
  {
    no: 6,
    promptTop: "Can you come to the lab orientation?",
    parts: [
      { t: "blank" }, // I
      { t: "blank" }, // can’t
      { t: "blank" },// make
      { t: "blank" },  //it
      { t: "text", v: " today, " },
      { t: "blank" }, // but
      { t: "blank" }, // could
      { t: "blank" }, // attend
      { t: "text", v: "tomorrow." },
    ],
    wordBank: [
      "I",
      "it",
      "those",
      "can’t",
      "make",
      "but",
      "could",
      "attend",
      "attending",
    ],
    answer: "I can’t make it today, but I could attend tomorrow.",
  },
  {
    no: 7,
    promptTop: "The instructions were confusing.",
    parts: [
      { t: "blank" }, // I
      { t: "blank" }, // agree
       { t: "blank" }, // they
      { t: "text", v: "should have " },
      { t: "blank" }, // clarified
      { t: "blank" }, //the steps
      { t: "blank" }, // more
      { t: "blank" }, // clearly
      { t: "text", v: "." },
    ],
    wordBank: [
      "I",
      "agree",
      "they",
      "clarified",
      "the steps",
      "more",
      "clearly",
      "beforehand",
    ],
    answer: "I agree they should have clarified the steps more clearly.",
  },
  {
    no: 8,
    promptTop: "Did you submit the assignment?",
    parts: [
      { t: "blank" }, // Not
      { t: "blank" }, // yet
      { t: "text", v: ", I am " },
      { t: "blank" }, //still
      { t: "blank" }, // editing
      { t: "blank" }, // the
      { t: "text", v: " final" },
     { t: "blank" }, // paragraph]
      { t: "text", v: " ." },
    ],
    wordBank: [
      "not",
      "yet",
      "editing",
      "carefully",
       "still",
       "doing",
       "the",
       "paragraph",
    ],
    answer: "Not yet, I am still editing the final paragraph.",
  },
 {
  no: 9,
  promptTop: "The presentation time was cut.",
  parts: [
   
    { t: "blank" }, // we
    { t: "blank" }, // should
    { t: "text", v: "prioritize " },
    { t: "blank" }, // the key findings
    { t: "blank" }, // and
    { t: "blank" }, // skip
    { t: "blank" }, // minor
    { t: "blank" }, // details
    { t: "text", v: "." },
  ],
  wordBank: [
    
    "we",
    "should",
    "the key findings",
    "and",
    "skip",
    "minor",
    "details",
    "briefly",
    "several",
    "later",
  ],
  answer: "Then we should prioritize the key findings and skip minor details.",
},
{
  no: 10,
  promptTop: "The room reservation was canceled.",
  parts: [
    { t: "blank" }, // We
    { t: "blank" }, // can
    { t: "blank" }, // move
    { t: "text", v: "the session " },
    { t: "blank" }, // to
    { t: "blank" }, // the online platform
    { t: "blank" }, // instead
    { t: "blank" }, // immediately
    { t: "text", v: "." },
  ],
  wordBank: [
    "we",
    "can",
    "move",
    "to",
    "the online platform",
    "instead",
    "immediately",
    "later",
    "abrupt",
    "perhaps",
  ],
  answer: "We can move the session to the online platform instead immediately.",
},
];
export const MOCK2 = {
  id: "w_mock_2",
  title: "모의고사 2",
  meta: "Task 1–3 · Timed (5:50 / 7:00 / 10:00)",
  taskTimeLimitsSec: [350, 420, 600],

  tasks: [
    {
      type: "task1_reorder",
      title: "Task 1 · Build a Sentence",
      instruction: "Move the words in the boxes to create grammatical sentences.",
      items: TASK1_ITEMS_MOCK2, // ✅ 독립 데이터 사용
    },
    {
      type: "task2_email",
      title: "Task 2 · Write an Email",
      instruction:
        "You will read some information and use the information to write an email.",
      situation: [
        "You missed a required library workshop for your research methods class.",
        "You need proof of attendance, but the make-up session is after the deadline.",
        "You want to request an alternative way to meet the requirement.",
      ],
      bullets: [
        "Explain why you missed the workshop.",
        "Ask if an alternative assignment is possible.",
        "Propose a solution and ask for confirmation.",
      ],
      minWords: 120,
      recommendedWords: "120–180",
    },
    {
  type: "task3_discussion",
  title: "Task 3 · Write for an Academic Discussion",
  instruction:
    "A professor has posted a question about a topic and students have responded with their thoughts and ideas. Make a contribution to the discussion.",
  prompt: {
    author: "Professor Chen",
    intro:
      "Your professor is teaching a class on education. Write a post responding to the professor's question.",
    question:
      "Some universities are considering making attendance optional for lectures. Do you think students should be required to attend lectures in person? Why or why not?",
  },
  students: [
    {
      name: "Jordan",
      text:
        "I think attendance should be optional because students learn in different ways. Some students understand the material better by reviewing recordings or reading on their own. Also, college students should have the freedom to manage their own schedules and decide how they learn best.",
    },
    {
      name: "Hana",
      text:
        "I disagree. In-person attendance is important because it helps students stay focused and accountable. When students go to class regularly, they are more likely to participate in discussions, ask questions, and keep up with the course material.",
    },
  ],
  minWords: 100,
  recommendedWords: "100–150",
}
  ],
};