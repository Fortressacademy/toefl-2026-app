export const socialscience_01 = {
  id: "socialscience_01",
  title: "Social Science Practice 1",
  passageTitle: "Social Conformity Experiments",
  passage: `In the mid-twentieth century, social psychologists investigated why people sometimes set aside their own judgments when a group appears unanimous. In Solomon Asch’s well-known study, participants compared a target line with three choices. The correct match was clear, but several others in the room had been instructed to choose the same wrong answer.

Despite the simplicity of the task, many participants agreed with the group on multiple trials. Follow-up interviews suggested two main reasons: some began to doubt their own perception, while others avoided openly contradicting the majority even when they suspected the group was wrong.

Later versions of the experiment showed that conformity depended on the situation. When even one person broke the group’s unanimity, conformity dropped. It also decreased when responses were given privately rather than spoken aloud.`,

  passage2Title: "Cultural Relativism",
  passage2: `Cultural relativism is an approach in anthropology that argues that beliefs and practices should be understood within the culture in which they occur. Instead of judging customs using the standards of one’s own society, researchers attempt to interpret them from the perspective of the people who follow them. The principle developed partly as a reaction to ethnocentric theories that ranked cultures as more or less “advanced.”

Supporters argue that many social norms serve important functions within a community. A ritual that seems unusual to outsiders, for example, may strengthen social bonds or transmit shared values. Critics, however, worry that strict cultural relativism makes it difficult to evaluate practices that conflict with universal human rights. Supporters respond that understanding a practice is not the same as approving it; rather, contextual analysis can lead to more informed ethical discussion.`,

  // ✅ qNo 1~5 = passage1, 6~10 = passage2 (AcademicSet.jsx가 자동으로 분배)
  questions: [
    // ===== Passage 1 (Q1~Q5) =====
    {
      id: "socialscience_01_q1",
      qNo: 1,
      type: "main",
      question: "What is the passage mainly about?",
      options: {
        A: "How visual perception improves through repeated practice",
        B: "How group agreement can lead individuals to change their answers",
        C: "Why people become more accurate when speaking aloud",
        D: "Why social psychologists avoid using laboratory experiments"
      },
      answer: "B",
      explanation:
        "The passage describes Asch’s conformity study and explains how unanimous group pressure can cause individuals to change or suppress their own judgments."
    },
    {
      id: "socialscience_01_q2",
      qNo: 2,
      type: "detail",
      question: "According to the passage, what was true about the line-comparison task?",
      options: {
        A: "Most participants could not see the target line clearly",
        B: "The correct choice was generally easy to identify",
        C: "Participants were trained to ignore the group’s answers",
        D: "The group members sometimes chose different wrong options"
      },
      answer: "B",
      explanation:
        "The passage says the correct match was clear, but the group had been instructed to pick the same wrong answer."
    },
    {
      id: "socialscience_01_q3",
      qNo: 3,
      type: "negative-fact",
      question: "All of the following are mentioned as reasons for conformity in the passage EXCEPT:",
      options: {
        A: "Doubting one’s own perception under group disagreement",
        B: "Avoiding public conflict with the majority",
        C: "Believing the experiment was designed to trick participants",
        D: "Changing an answer to match what others said"
      },
      answer: "C",
      explanation:
        "The passage gives two reasons: self-doubt and avoidance of openly contradicting the group. It does not mention believing the experiment was intentionally deceptive."
    },
    {
      id: "socialscience_01_q4",
      qNo: 4,
      type: "vocab",
      question: "The word \"unanimity\" in the passage is closest in meaning to:",
      options: {
        A: "agreement",
        B: "privacy",
        C: "pressure",
        D: "hesitation"
      },
      answer: "A",
      explanation:
        "\"Unanimity\" means everyone appears to agree in the same way.",
      highlight: { query: "unanimity", mode: "word" }
    },
    {
      id: "socialscience_01_q5",
      qNo: 5,
      type: "inference",
      question: "What can be inferred about private responses in later versions of the experiment?",
      options: {
        A: "They increased conformity because participants felt monitored",
        B: "They reduced conformity because social pressure was weaker",
        C: "They made the task more confusing than before",
        D: "They eliminated the need for group members to answer"
      },
      answer: "B",
      explanation:
        "The passage states conformity decreased when answers were given privately, implying public responses create stronger social pressure."
    },

    // ===== Passage 2 (Q6~Q10) =====
    {
      id: "socialscience_01_q6",
      qNo: 6,
      type: "main",
      question: "What is the main purpose of the passage?",
      options: {
        A: "To define cultural relativism and present arguments for and against it",
        B: "To argue that anthropologists should rank cultures by development",
        C: "To show that rituals are meaningless in most societies",
        D: "To explain how universal laws replaced local traditions"
      },
      answer: "A",
      explanation:
        "The second passage explains what cultural relativism is, why it emerged, and summarizes both criticisms and supporters’ responses."
    },
    {
      id: "socialscience_01_q7",
      qNo: 7,
      type: "detail",
      question: "Why did cultural relativism develop, according to the passage?",
      options: {
        A: "As a reaction to approaches that judged some cultures as superior",
        B: "To replace anthropology with a more statistical discipline",
        C: "Because rituals disappeared in modern societies",
        D: "To enforce a single ethical code across all communities"
      },
      answer: "A",
      explanation:
        "The passage says it developed partly as a response to ethnocentric theories that ranked cultures."
    },
    {
  id: "socialscience_01_q8",
  qNo: 8,
  type: "vocab",
  question: "The word \"ethnocentric\" in the second passage is closest in meaning to:",
  options: {
    A: "biased",
    B: "neutral",
    C: "unfamiliar",
    D: "traditional"
  },
  answer: "A",
  explanation:
    "\"Ethnocentric\" describes a viewpoint that favors one's own culture as the standard, so it is closest to \"biased.\"",
  highlight: { query: "ethnocentric", mode: "word" }
},
    {
      id: "socialscience_01_q9",
      qNo: 9,
      type: "inference",
      question: "What can be inferred about the author’s view of cultural relativism?",
      options: {
        A: "The author treats it as useful but acknowledges a serious limitation",
        B: "The author argues it should be rejected entirely",
        C: "The author claims it makes ethical discussion impossible",
        D: "The author suggests it is identical to supporting all practices"
      },
      answer: "A",
      explanation:
        "The author explains the benefits (contextual understanding) and also presents critics’ concerns (human rights), implying a balanced view."
    },
    {
      id: "socialscience_01_q10",
      qNo: 10,
      type: "intention",
      question: "Why does the author include the example of a ritual that seems unusual to outsiders?",
      options: {
        A: "To show that outsiders usually interpret rituals correctly",
        B: "To suggest rituals are mostly created for entertainment",
        C: "To illustrate that practices may serve important social functions within a culture",
        D: "To argue that rituals should be evaluated only by universal law"
      },
      answer: "C",
      explanation:
        "The example supports the idea that customs should be understood in context because they may strengthen bonds or transmit values."
    }
  ]
};