// src/data/reading/academic/humanities_01.js

export const humanities_01 = {
  id: "humanities_01",
  title: "Humanities Practice 1",

  passageTitle: "Oral Tradition and the Epic Poem",
  passage: `Oral tradition refers to the practice of preserving and transmitting knowledge through spoken performance rather than written records. In many societies, long narratives about heroes, journeys, and community origins were carried across generations by storytellers who recited them before live audiences. These narratives eventually came to be recognized as epic poems, but their earliest forms were shaped by the demands of memory, rhythm, and performance.

Because oral performers could not rely on a fixed written text, they often used formulaic language—repeated phrases and familiar sentence patterns—to help organize lines while speaking. Such patterns made it easier to maintain pacing, signal important moments, and recover smoothly after interruptions. In addition, performers could adapt details to suit different audiences, emphasizing local values or current concerns without changing the overall story.

When writing systems became more widespread, some epics were recorded and stabilized in written form. This shift preserved many narratives that might otherwise have changed or disappeared, but it also altered how epics were experienced. Instead of being recreated in communal performances, they could be studied privately as literary works. Even so, traces of oral composition remain visible in the repetitions and recurring structures that continue to characterize many epic poems.`,

  passage2Title: "The Standardization of National Languages",
  passage2: `Before the rise of modern nation-states, linguistic diversity was common within political boundaries. Regional dialects and minority languages often coexisted without a single dominant form. During the eighteenth and nineteenth centuries, however, governments increasingly promoted standardized languages for administration and education. This effort reflected more than practical concerns.

A common explanation is administrative efficiency. A unified language simplified legal systems, taxation, and military coordination across expanding territories. Yet many scholars contend that efficiency does not fully explain the determination with which states imposed linguistic uniformity.

Standardization also fostered national identity. Through compulsory schooling and print culture, citizens encountered the same grammar, vocabulary, and literary traditions. As a result, individuals began to imagine themselves as part of a shared cultural community. At the same time, privileging one dialect often diminished the status of others. Some minority languages were portrayed as inferior or obsolete. Language policy therefore shaped not only communication but also cultural hierarchy.`,

  questions: [
    // ===== Passage 1 (Q1~Q5) =====
    {
      id: "humanities_01_q1",
      qNo: 1,
      type: "purpose",
      question: "What is the main purpose of the first passage?",
      options: {
        A: "To argue that written epics are less authentic than oral performances",
        B: "To explain how oral tradition influenced the development and features of epic poems",
        C: "To describe how writing systems replaced storytelling in all societies",
        D: "To compare two specific epic poems from different cultures"
      },
      answer: "B",
      explanation:
        "The passage defines oral tradition and explains how performance needs shaped epic poetry, then describes changes brought by writing."
    },
    {
      id: "humanities_01_q2",
      qNo: 2,
      type: "detail",
      question: "According to the passage, why did oral performers use repeated phrases?",
      options: {
        A: "To help manage memory and maintain performance flow",
        B: "To shorten the narrative",
        C: "To prevent any variation in the story",
        D: "To entertain only children"
      },
      answer: "A",
      explanation:
        "Formulaic language helped performers organize lines and maintain pacing while speaking from memory."
    },
    {
      id: "humanities_01_q3",
      qNo: 3,
      type: "vocab",
      question: "The word \"formulaic\" in the passage is closest in meaning to:",
      options: {
        A: "creative",
        B: "patterned",
        C: "uncertain",
        D: "brief"
      },
      answer: "B",
      explanation:
        "Formulaic refers to repeated, structured patterns.",
      highlight: { query: "formulaic", mode: "word" }
    },
    {
      id: "humanities_01_q4",
      qNo: 4,
      type: "inference",
      question: "What can be inferred about the shift to written epics?",
      options: {
        A: "It removed all traces of oral composition",
        B: "It changed the audience experience from communal to private",
        C: "It made epics shorter",
        D: "It prevented adaptation"
      },
      answer: "B",
      explanation:
        "The passage says epics could be studied privately rather than performed communally."
    },
    {
      id: "humanities_01_q5",
      qNo: 5,
      type: "purpose",
      question: "Why does the author mention adaptation to different audiences?",
      options: {
        A: "To show flexibility within oral storytelling",
        B: "To criticize inconsistency",
        C: "To argue that written texts are superior",
        D: "To explain literary decline"
      },
      answer: "A",
      explanation:
        "It illustrates how oral tradition preserved structure while allowing contextual variation."
    },

    // ===== Passage 2 (Q6~Q10) =====
    {
  id: "humanities_01_q6",
  qNo: 6,
  type: "purpose",
  question: "What is the main purpose of the second passage?",
  options: {
    A: "To explain how administrative efficiency led governments to adopt a common language",
    B: "To examine why standardized languages were promoted and how they shaped national identity",
    C: "To argue that language policies were designed mainly to suppress minority groups",
    D: "To compare linguistic diversity before and after the rise of nation-states"
  },
  answer: "B",
  explanation:
    "The passage discusses both administrative efficiency and national identity as motivations, and explains the broader social effects of standardization."
},
    {
      id: "humanities_01_q7",
      qNo: 7,
      type: "detail",
      question: "Why does the author argue that efficiency does not fully explain language standardization?",
      options: {
        A: "Because governments lacked legal systems",
        B: "Because identity formation was also a major factor",
        C: "Because dialects were already unified",
        D: "Because military coordination failed"
      },
      answer: "B",
      explanation:
        "The passage states that national identity, not just administrative efficiency, motivated standardization."
    },
    {
      id: "humanities_01_q8",
      qNo: 8,
      type: "vocab",
      question: "The word \"privileging\" is closest in meaning to:",
      options: {
        A: "favoring",
        B: "translating",
        C: "recording",
        D: "removing"
      },
      answer: "A",
      explanation:
        "Privileging one dialect means giving it preference over others.",
      highlight: { query: "privileging", mode: "word" }
    },
    {
      id: "humanities_01_q9",
      qNo: 9,
      type: "inference",
      question: "What can be inferred about minority languages under standardization policies?",
      options: {
        A: "They gained equal recognition",
        B: "They were often viewed as less legitimate",
        C: "They became official languages",
        D: "They replaced dominant dialects"
      },
      answer: "B",
      explanation:
        "The passage states minority languages were portrayed as inferior or obsolete."
    },
    {
      id: "humanities_01_q10",
      qNo: 10,
      type: "negative-fact",
      question: "All of the following are mentioned as effects of language standardization EXCEPT:",
      options: {
        A: "Simplifying administration",
        B: "Fostering national identity",
        C: "Reducing military conflicts",
        D: "Creating cultural hierarchies"
      },
      answer: "C",
      explanation:
        "The passage does not state that standardization reduced military conflicts."
    }
  ]
};