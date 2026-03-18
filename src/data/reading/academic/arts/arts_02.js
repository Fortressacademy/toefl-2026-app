// src/data/reading/academic/arts_02.js

export const arts_02 = {
  id: "arts_02",
  title: "Arts Practice 2",

  passageTitle: "The “Talkie Revolution”",
  passage: `The “Talkie Revolution” refers to the rapid shift from silent films to sound films during the late 1920s. Although synchronized sound had been tested earlier, the commercial success of The Jazz Singer in 1927 demonstrated that audiences were prepared for a new cinematic form. Within a few years, film studios invested in sound-recording equipment, and many theaters were modified to support audio playback. As sound technology became standard, the production of silent films declined sharply.

The introduction of synchronized dialogue changed not only film production but also acting techniques. Performers who had relied on expressive gestures in silent films adjusted to more natural speech patterns. At the same time, some actors faced difficulties because their voices or accents did not suit recorded dialogue. In addition, international distribution became more complex, since films were no longer universally accessible without translation. Despite these challenges, sound films quickly established themselves as the dominant format of commercial cinema.`,

  passage2Title: "War Photography and Public Opinion",
  passage2: `War photography has often played a powerful role in shaping public opinion. Unlike official government reports, which tend to present military actions in strategic or political terms, photographs provide immediate visual evidence of conflict. During the Vietnam War, widely circulated images of wounded civilians and devastated villages reached audiences far from the battlefield. These photographs did not merely document events; they influenced how people interpreted them.

In many cases, the images contradicted official statements that described the war as controlled or progressing successfully. Because photographs appear direct and unfiltered, they often carried greater emotional weight than written accounts. As a result, public support for the war declined in several countries as disturbing images became more visible in newspapers and on television. At the same time, critics argued that photographs could frame events selectively, emphasizing certain realities while excluding others. Even so, the Vietnam War demonstrated that visual media could challenge government narratives and reshape public debate about military conflict.`,

  questions: [
    // ===== Passage 1 (Q1~Q5) =====
    {
      id: "arts_02_q1",
      qNo: 1,
      type: "purpose",
      question: "What is the main purpose of the passage?",
      options: {
        A: "To describe the early development of film technology",
        B: "To explain how sound transformed the film industry",
        C: "To compare silent films with modern cinema",
        D: "To examine the career struggles of film actors",
      },
      answer: "B",
      explanation:
        "The passage focuses on how synchronized sound changed film production, acting, distribution, and the dominance of sound films.",
    },
    {
      id: "arts_02_q2",
      qNo: 2,
      type: "vocab",
      question:
        'The word "modified" in paragraph 1 is closest in meaning to',
      options: {
        A: "rebuilt",
        B: "adjusted",
        C: "expanded",
        D: "decorated",
      },
      answer: "B",
      explanation:
        '"Modified" means changed or adjusted to support sound playback.',
      highlight: { query: "modified", mode: "word" },
    },
    {
      id: "arts_02_q3",
      qNo: 3,
      type: "inference",
      question:
        "What can be inferred about silent films before the Talkie Revolution?",
      options: {
        A: "They depended primarily on visual expression.",
        B: "They required advanced recording systems.",
        C: "They were limited to domestic audiences.",
        D: "They discouraged theatrical performances.",
      },
      answer: "A",
      explanation:
        "The passage notes that actors relied on expressive gestures in silent films, implying strong dependence on visual expression.",
    },
    {
      id: "arts_02_q4",
      qNo: 4,
      type: "purpose",
      question:
        "Why does the author mention that international distribution became more complex?",
      options: {
        A: "To show a consequence of introducing sound",
        B: "To criticize the quality of early translations",
        C: "To argue that silent films were superior",
        D: "To describe economic competition among studios",
      },
      answer: "A",
      explanation:
        "The mention highlights a practical consequence of sound films: language barriers required translation, complicating global distribution.",
    },
    {
      id: "arts_02_q5",
      qNo: 5,
      type: "detail",
      question:
        "According to the passage, which of the following is true?",
      options: {
        A: "Sound films were immediately accepted worldwide.",
        B: "The Jazz Singer was the first sound experiment.",
        C: "Studios invested in equipment after sound proved successful.",
        D: "Silent films continued to dominate into the 1940s.",
      },
      answer: "C",
      explanation:
        "The passage states that after the commercial success of The Jazz Singer, studios invested in sound-recording equipment.",
    },

    // ===== Passage 2 (Q6~Q10) =====
    {
      id: "arts_02_q6",
      qNo: 6,
      type: "purpose",
      question:
        "What is the main purpose of the passage?",
      options: {
        A: "To describe the development of modern war photography",
        B: "To explain how war images influenced public opinion",
        C: "To compare visual and written journalism",
        D: "To evaluate the accuracy of government reports",
      },
      answer: "B",
      explanation:
        "The passage explains how photographs shaped public opinion and influenced debate during the Vietnam War.",
    },
    {
      id: "arts_02_q7",
      qNo: 7,
      type: "vocab",
      question:
        'The word "contradicted" in paragraph 2 is closest in meaning to',
      options: {
        A: "supported",
        B: "replaced",
        C: "opposed",
        D: "repeated",
      },
      answer: "C",
      explanation:
        '"Contradicted" means expressed the opposite of or opposed official statements.',
      highlight: { query: "contradicted", mode: "word" },
    },
    {
      id: "arts_02_q8",
      qNo: 8,
      type: "inference",
      question:
        "What can be inferred about photographs during the Vietnam War?",
      options: {
        A: "They were carefully controlled by the government.",
        B: "They often appeared more persuasive than official statements.",
        C: "They eliminated debate about the war.",
        D: "They focused mainly on military strategy.",
      },
      answer: "B",
      explanation:
        "Because photographs were seen as direct and emotionally powerful, they often carried more persuasive impact than official reports.",
    },
    {
      id: "arts_02_q9",
      qNo: 9,
      type: "purpose",
      question:
        "Why does the author mention that photographs may “frame events selectively”?",
      options: {
        A: "To show that images are entirely unreliable",
        B: "To suggest that photographs can influence interpretation",
        C: "To defend government narratives",
        D: "To explain improvements in camera technology",
      },
      answer: "B",
      explanation:
        "The statement emphasizes that images can highlight certain aspects and exclude others, shaping how events are interpreted.",
      highlight: { query: "frame events selectively", mode: "phrase" },
    },
    {
      id: "arts_02_q10",
      qNo: 10,
      type: "detail",
      question:
        "According to the passage, which of the following is true?",
      options: {
        A: "Government reports included more emotional detail than images.",
        B: "Public support declined as disturbing images became visible.",
        C: "War photographs had little effect on public attitudes.",
        D: "Public support increased as more images were published.",
      },
      answer: "B",
      explanation:
        "The passage states that public support declined in several countries as disturbing images became more visible.",
    },
  ],
};