// src/data/reading/academic/lifescience_01.js

export const lifescience_01 = {
  id: "lifescience_01",
  title: "Life Science Practice 1",

  passageTitle: "A Planet Where It Rains Glass",
  passage: `HD 189733b is a well-studied exoplanet located about 64 light-years from Earth. Although it appears as a deep blue world when observed through telescopes, its environment is extremely hostile. The planet is classified as a “hot Jupiter,” meaning it is similar in size to Jupiter but orbits very close to its parent star. Because of this proximity, surface temperatures exceed 1,000 degrees Celsius.

The planet’s blue color is not caused by oceans. Instead, scientists believe that its atmosphere contains silicate particles—tiny fragments of material similar to glass. Powerful winds, reaching speeds of several thousand kilometers per hour, carry these particles through the atmosphere. Under such extreme conditions, the silicates condense and fall as precipitation. Unlike rain on Earth, however, this precipitation consists of microscopic glass fragments driven sideways by intense winds. Observations of HD 189733b illustrate how atmospheric chemistry and temperature can produce weather systems dramatically different from those found on Earth.`,

  passage2Title: "Memory Materials and Their Applications",
  passage2: `Memory materials are substances that can return to a previously defined shape after being deformed. Two major types are shape-memory alloys and shape-memory polymers. Although they may appear rigid, these materials recover their original form when exposed to temperature changes. This behavior is not explained by simple elasticity. Instead, it results from controlled shifts in internal molecular or crystal structures.

In shape-memory alloys, such as nickel-titanium, temperature changes alter the arrangement of atoms. At lower temperatures, the material can be bent into a temporary shape. When heated, its structure returns to a stable phase, restoring the initial form. Shape-memory polymers function similarly, though their transformation involves changes in molecular alignment rather than metallic crystal phases.

These structural changes allow memory materials to serve practical purposes. In medicine, alloys are used in stents that expand at body temperature after insertion. In aerospace engineering, components can respond automatically to heat variations. By connecting molecular structure to functional performance, memory materials demonstrate how chemical properties can enable technological innovation.`,

  questions: [
    // ===== Passage 1 (Q1~Q5) =====
    {
      id: "lifescience_01_q1",
      qNo: 1,
      type: "purpose",
      question: "What is the main purpose of the passage?",
      options: {
        A: "To compare HD 189733b with Jupiter",
        B: "To explain how telescopes detect distant planets",
        C: "To evaluate the possibility of life beyond Earth",
        D: "To describe unusual atmospheric conditions on an exoplanet",
      },
      answer: "D",
      explanation:
        "The passage describes HD 189733b’s extreme environment and explains its silicate-filled atmosphere and glass-like precipitation.",
    },
    {
      id: "lifescience_01_q2",
      qNo: 2,
      type: "vocab",
      question: 'The word "hostile" in paragraph 1 is closest in meaning to',
      options: {
        A: "distant",
        B: "unstable",
        C: "unknown",
        D: "harsh",
      },
      answer: "D",
      explanation:
        '"Hostile" describes an environment that is dangerous and severe; here it refers to extremely high temperatures and violent conditions.',
      highlight: { query: "hostile", mode: "word" },
    },
    {
      id: "lifescience_01_q3",
      qNo: 3,
      type: "inference",
      question: "What can be inferred about HD 189733b’s blue appearance?",
      options: {
        A: "It indicates the presence of liquid water.",
        B: "It results from atmospheric composition.",
        C: "It changes depending on wind speed.",
        D: "It reflects light from nearby planets.",
      },
      answer: "B",
      explanation:
        "The passage states the blue color is not from oceans and links it to silicate particles in the atmosphere, implying the appearance comes from atmospheric composition.",
    },
    {
      id: "lifescience_01_q4",
      qNo: 4,
      type: "purpose",
      question: "Why does the author explain that the precipitation is driven sideways?",
      options: {
        A: "To emphasize how extreme the winds are",
        B: "To compare Earth’s rain patterns with Jupiter’s",
        C: "To suggest that gravity is weaker on the planet",
        D: "To question earlier atmospheric models",
      },
      answer: "A",
      explanation:
        "The sideways motion highlights the intensity of the winds and how dramatically different the weather is from Earth’s typical rainfall.",
      highlight: { query: "driven sideways", mode: "phrase" },
    },
    {
      id: "lifescience_01_q5",
      qNo: 5,
      type: "detail",
      question: "According to the passage, which of the following is true?",
      options: {
        A: "HD 189733b orbits far from its parent star.",
        B: "The planet’s temperature is lower than Jupiter’s.",
        C: "Silicate particles are present in the atmosphere.",
        D: "The planet’s surface contains large oceans.",
      },
      answer: "C",
      explanation:
        "The passage states that scientists believe the atmosphere contains silicate particles similar to glass.",
    },

    // ===== Passage 2 (Q6~Q10) =====
    {
      id: "lifescience_01_q6",
      qNo: 6,
      type: "purpose",
      question: "What is the main purpose of the passage?",
      options: {
        A: "To compare two temperature-sensitive materials",
        B: "To explain how memory materials work and are applied",
        C: "To describe the discovery of nickel-titanium alloys",
        D: "To evaluate the limits of aerospace design",
      },
      answer: "B",
      explanation:
        "The passage defines memory materials, explains their internal mechanisms, and describes practical applications in medicine and aerospace.",
    },
    {
      id: "lifescience_01_q7",
      qNo: 7,
      type: "vocab",
      question: 'The word "rigid" in paragraph 1 is closest in meaning to',
      options: {
        A: "solid",
        B: "stable",
        C: "inflexible",
        D: "heavy",
      },
      answer: "C",
      explanation:
        '"Rigid" means stiff or not easily bent, which matches "inflexible."',
      highlight: { query: "rigid", mode: "word" },
    },
    {
      id: "lifescience_01_q8",
      qNo: 8,
      type: "inference",
      question: "What can be inferred about shape-memory alloys?",
      options: {
        A: "Their shape recovery depends on atomic rearrangement.",
        B: "They rely primarily on elastic stretching.",
        C: "They operate only at extremely high temperatures.",
        D: "They cannot be reshaped once manufactured.",
      },
      answer: "A",
      explanation:
        "The passage explains that in alloys, temperature changes alter the arrangement of atoms and restore a stable phase, implying atomic rearrangement drives shape recovery.",
    },
    {
      id: "lifescience_01_q9",
      qNo: 9,
      type: "purpose",
      question: "How does paragraph 3 relate to paragraph 2?",
      options: {
        A: "It questions the explanation of atomic change.",
        B: "It provides historical context for alloy use.",
        C: "It describes applications of the mechanisms discussed earlier.",
        D: "It contrasts polymers with metallic materials.",
      },
      answer: "C",
      explanation:
        "Paragraph 2 explains the mechanism (structural changes), and paragraph 3 shows how those mechanisms enable real-world applications like stents and aerospace components.",
    },
    {
      id: "lifescience_01_q10",
      qNo: 10,
      type: "detail",
      question: "According to the passage, which statement is true?",
      options: {
        A: "Shape-memory polymers rely on crystal phase changes.",
        B: "Memory materials recover shape only through elasticity.",
        C: "Some alloys expand when exposed to body heat.",
        D: "Aerospace systems use memory materials to increase weight.",
      },
      answer: "C",
      explanation:
        "The passage states that alloys are used in stents that expand at body temperature after insertion.",
    },
  ],
};