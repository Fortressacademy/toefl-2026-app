// src/data/reading/academic/arts_01.js

export const arts_01 = {
  id: "arts_01",
  title: "Arts Practice 1",

  passageTitle: "Perspective in Art",
  passage: `Perspective refers to a technique used in art to represent three-dimensional space on a flat surface. Before the development of mathematical perspective during the Renaissance, artists often arranged figures according to importance rather than spatial accuracy. Objects meant to appear distant were not always drawn smaller, and depth was suggested in inconsistent ways.

In the fifteenth century, Italian artists began applying geometric principles to create linear perspective. By using vanishing points and converging lines, they were able to construct realistic spatial relationships. This method allowed paintings to resemble the way the human eye naturally perceives distance. As a result, perspective became an essential tool for creating visual realism in Western art.

However, perspective is not universal. In many East Asian traditions, artists employed shifting viewpoints instead of a single fixed perspective. This approach allows viewers to experience a scene gradually rather than from one static position. The choice of perspective, therefore, reflects not only technical skill but also cultural assumptions about how space should be represented.`,

  passage2Title: "Ephemeral Art",
  passage2: `Ephemeral art refers to artworks intended to last only for a short time. Unlike pieces preserved in galleries and sold for value, ephemeral works are designed to weather, melt, fade, or be dismantled. Ephemeral art varies in its medium, message, and method of destruction.

A prominent example is the sand mandala. Painstakingly assembled over hours by Tibetan Buddhist monks, it forms a colorful and intricate design, only to be swept away with brooms as if it never existed. This practice signifies the impermanence of life and places value on the ritual of creating rather than the finished product. Ephemeral art is displayed in natural settings as well. Ice sculptures that melt throughout the day make climate and heat visible forces. Arrangements of fallen leaves or rock towers in rivers exist only as long as nature allows.

Performance art, in essence, is a type of ephemeral art. Even when repeated, performances are never identical, as the artist is never in the same mindset. When performed outdoors or in unconventional spaces, performance art disrupts the routines of passersby and encourages them to appreciate artistic expression outside of a gallery or museum. It reminds viewers that art can emerge—and disappear—from anywhere.`,

  questions: [
    // ===== Passage 1 (Q1~Q5) =====
    {
      id: "arts_01_q1",
      qNo: 1,
      type: "vocab",
      question: 'The word "converging" in the passage is closest in meaning to',
      options: {
        A: "spreading",
        B: "meeting",
        C: "repeating",
        D: "narrowing",
      },
      answer: "B",
      explanation:
        '"Converging" describes lines coming together toward a single point, such as a vanishing point in linear perspective.',
      highlight: { query: "converging", mode: "word" },
    },
    {
      id: "arts_01_q2",
      qNo: 2,
      type: "detail",
      question:
        "According to the passage, what distinguished Renaissance perspective from earlier artistic methods?",
      options: {
        A: "It emphasized religious symbolism.",
        B: "It relied on mathematical principles.",
        C: "It avoided the use of depth.",
        D: "It reduced the size of all objects equally.",
      },
      answer: "B",
      explanation:
        "The passage explains that Renaissance artists applied geometric principles, including vanishing points and converging lines, unlike earlier methods that lacked spatial accuracy.",
    },
    {
      id: "arts_01_q3",
      qNo: 3,
      type: "inference",
      question: "What is suggested about East Asian artistic traditions?",
      options: {
        A: "They rejected realism entirely.",
        B: "They developed perspective earlier than Europe.",
        C: "They adopted multiple viewpoints within a scene.",
        D: "They focused mainly on architectural subjects.",
      },
      answer: "C",
      explanation:
        "The passage states that East Asian traditions used shifting viewpoints instead of a single fixed one, implying multiple perspectives within a single scene.",
    },
    {
      id: "arts_01_q4",
      qNo: 4,
      type: "purpose",
      question: "Why does the author mention vanishing points?",
      options: {
        A: "To explain how artists achieved spatial realism",
        B: "To criticize earlier painting techniques",
        C: "To show that perspective is difficult to learn",
        D: "To demonstrate the limits of geometric systems",
      },
      answer: "A",
      explanation:
        "Vanishing points are mentioned as part of the geometric system that enabled artists to construct realistic spatial relationships.",
      highlight: { query: "vanishing points", mode: "phrase" },
    },
    {
      id: "arts_01_q5",
      qNo: 5,
      type: "inference",
      question: "What can be inferred about the concept of perspective?",
      options: {
        A: "It is purely a technical invention with no cultural meaning.",
        B: "It determines how viewers interpret space in an artwork.",
        C: "It was immediately accepted across all cultures.",
        D: "It eliminates the need for artistic creativity.",
      },
      answer: "B",
      explanation:
        "The passage explains that perspective reflects cultural assumptions about representing space, suggesting that it shapes how viewers understand spatial relationships in art.",
    },

    // ===== Passage 2 (Q6~Q10) =====
    {
      id: "arts_01_q6",
      qNo: 6,
      type: "vocab",
      question: 'The word "dismantled" in the passage is closest in meaning to',
      options: {
        A: "constructed",
        B: "separated",
        C: "remembered",
        D: "displayed",
      },
      answer: "B",
      explanation:
        '"Dismantled" means taken apart or disassembled, which is closest in meaning to "separated."',
      highlight: { query: "dismantled", mode: "word" },
    },
    {
      id: "arts_01_q7",
      qNo: 7,
      type: "detail",
      question:
        "According to the passage, why do Tibetan monks destroy their sand mandalas?",
      options: {
        A: "To show that perfection can never be achieved",
        B: "To represent the temporary nature of life",
        C: "To recognize the importance of nature",
        D: "To downplay the value of ritualistic practices",
      },
      answer: "B",
      explanation:
        "The passage states that sweeping away the sand mandala signifies the impermanence of life.",
    },
    {
      id: "arts_01_q8",
      qNo: 8,
      type: "inference",
      question: "What is suggested about ephemeral art in nature?",
      options: {
        A: "It persists only as long as the environment permits it to.",
        B: "It can leave a long-lasting impression on viewers’ minds.",
        C: "It is typically destroyed as soon as it is finished.",
        D: "It reflects the recurring patterns of nature.",
      },
      answer: "A",
      explanation:
        "The passage states that arrangements in nature exist only as long as nature allows, implying their duration depends on environmental conditions.",
    },
    {
      id: "arts_01_q9",
      qNo: 9,
      type: "purpose",
      question: "Why does the author mention ice sculptures?",
      options: {
        A: "To suggest that ice sculptors are highly skilled artists",
        B: "To illustrate how art can turn natural forces into visible phenomena",
        C: "To highlight the inherent randomness of ephemeral art",
        D: "To explain how a work of ephemeral art can be preserved",
      },
      answer: "B",
      explanation:
        "Ice sculptures that melt make climate and heat visible, showing how ephemeral art can reveal natural forces.",
      highlight: { query: "Ice sculptures", mode: "phrase" },
    },
    {
      id: "arts_01_q10",
      qNo: 10,
      type: "detail",
      question: "What is one effect of outdoor performance art?",
      options: {
        A: "It encourages viewers to appreciate art in an unconventional way.",
        B: "It reveals the artist’s mindset in real-world contexts.",
        C: "It proves that art can be appreciated and sold for value at the same time.",
        D: "It draws attention to art’s role in social engagement.",
      },
      answer: "A",
      explanation:
        "The passage explains that outdoor performances disrupt routines and encourage appreciation of art outside traditional gallery spaces.",
    },
  ],
};