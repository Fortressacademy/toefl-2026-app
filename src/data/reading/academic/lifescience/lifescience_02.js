// src/data/reading/academic/lifescience_02.js

export const lifescience_02 = {
  id: "lifescience_02",
  title: "Life Science Practice 2",

  passageTitle: "The Immortal Jellyfish (Turritopsis dohrnii)",
  passage: `Turritopsis dohrnii, often called the “immortal jellyfish,” is a small marine species known for an unusual biological ability: under certain stressful conditions, it can reverse its life cycle. Instead of continuing to age and die after reaching adulthood, the jellyfish can transform from a mature medusa back into a juvenile polyp stage. This reversal is not simple regeneration; it involves a coordinated reorganization of tissues and cell identities.

Scientists describe the process as transdifferentiation, in which specialized cells shift into different cell types. In effect, cellular programs that define “adult” features are reset so the organism can rebuild itself in an earlier form. Researchers are interested in this phenomenon because it suggests that aging is not always a one-way biological trajectory. Although humans cannot undergo such a complete reversal, studying how Turritopsis reprograms cells may clarify mechanisms that regulate cell fate, tissue repair, and age-related decline. For this reason, the immortal jellyfish is frequently discussed in connection with regenerative biology and the long-term goals of aging research.`,

  passage2Title: "The Gut Microbiome and Behavior",
  passage2: `The gut microbiome refers to the community of microorganisms that live in the digestive tract. In recent years, scientists have explored how these microbes may influence not only digestion and immunity but also emotion and behavior. This idea is often discussed through the “gut–brain axis,” a network of communication routes that can include neural signaling, immune activity, and microbe-produced chemicals that interact with the nervous system.

Studies have reported associations between microbial composition and conditions such as anxiety, depression, and stress responses. For example, changing diet, taking antibiotics, or introducing specific probiotic strains can sometimes coincide with changes in mood-related measures. However, researchers caution that many findings remain correlational. People with different lifestyles, diets, or health conditions may also differ in their microbiomes, making it difficult to isolate cause and effect. As a result, a major debate in this field concerns whether microbes directly shape behavior or whether behavioral and environmental factors primarily shape the microbiome. Ongoing experiments using controlled animal models and carefully designed human trials aim to clarify the direction and strength of these relationships.`,

  questions: [
    // ===== Passage 1 (Q1~Q5) =====
    {
      id: "lifescience_02_q1",
      qNo: 1,
      type: "purpose",
      question: "What is the main purpose of the passage?",
      options: {
        A: "To explain how jellyfish survive extreme ocean storms",
        B: "To describe an unusual life-cycle reversal in a jellyfish",
        C: "To argue that all animals can reverse aging processes",
        D: "To summarize the ecology of small marine cnidarians",
      },
      answer: "B",
      explanation:
        "The passage explains Turritopsis dohrnii’s reversal from adult to juvenile form and why scientists find it important.",
    },
    {
  id: "lifescience_02_q2",
  qNo: 2,
  type: "vocab",
  question: 'The word "trajectory" in the passage is closest in meaning to',
  options: {
    A: "stage",
    B: "course",
    C: "shift",
    D: "limit",
  },
  answer: "B",
  explanation:
    '"Trajectory" refers to the course or path something follows over time.',
  highlight: { query: "trajectory", mode: "word" },
},
    {
      id: "lifescience_02_q3",
      qNo: 3,
      type: "detail",
      question: "According to the passage, what can Turritopsis do under stress?",
      options: {
        A: "It hardens its tissues to resist ocean pressure",
        B: "It changes from medusa back to polyp stage",
        C: "It stops feeding until conditions become normal",
        D: "It migrates away from its parent reef system",
      },
      answer: "B",
      explanation:
        "The passage states it can reverse its life cycle, transforming from a mature medusa back into a juvenile polyp stage.",
    },
    {
      id: "lifescience_02_q4",
      qNo: 4,
      type: "inference",
      question: "What can be inferred about why researchers study this jellyfish?",
      options: {
        A: "It offers proof that stress always increases lifespan",
        B: "It shows that regeneration replaces all aging mechanisms",
        C: "It demonstrates that humans can reverse life stages",
        D: "It may reveal how cell programs can be reset",
      },
      answer: "D", // ✅ D #2
      explanation:
        "The passage links its life-cycle reversal to reprogramming cell identity and to research on repair and age-related decline.",
    },
    {
      id: "lifescience_02_q5",
      qNo: 5,
      type: "detail",
      question: "What does the passage say transdifferentiation involves?",
      options: {
        A: "Specialized cells shifting into other cell types",
        B: "New organs forming through long-term evolution",
        C: "Permanent damage preventing tissue reorganization",
        D: "A species adapting by changing its habitat range",
      },
      answer: "A",
      explanation:
        "The passage defines transdifferentiation as specialized cells shifting into different cell types.",
      highlight: { query: "transdifferentiation", mode: "word" },
    },

    // ===== Passage 2 (Q6~Q10) =====
    {
      id: "lifescience_02_q6",
      qNo: 6,
      type: "purpose",
      question: "What is the main purpose of the second passage?",
      options: {
        A: "To prove microbes directly cause depression in humans",
        B: "To explain the gut–brain axis and its uncertainty",
        C: "To describe how digestion works in the small intestine",
        D: "To argue that behavior never affects gut microbes",
      },
      answer: "B",
      explanation:
        "The passage introduces the gut–brain axis, summarizes findings, and emphasizes the causation-versus-correlation debate.",
    },
    {
  id: "lifescience_02_q7",
  qNo: 7,
  type: "vocab",
  question: 'The word "correlational" in the passage is closest in meaning to',
  options: {
    A: "causal",
    B: "related",
    C: "random",
    D: "proven",
  },
  answer: "B",
  explanation:
    '"Correlational" means showing a relationship or association, not direct causation.',
  highlight: { query: "correlational", mode: "word" },
},
    {
      id: "lifescience_02_q8",
      qNo: 8,
      type: "detail",
      question: "Which of the following is mentioned as part of the gut–brain axis?",
      options: {
        A: "Neural signaling and immune activity",
        B: "Seasonal changes in ocean salinity",
        C: "Direct formation of new brain tissue",
        D: "The movement of bones within joints",
      },
      answer: "A",
      explanation:
        "The passage lists neural signaling, immune activity, and microbe-produced chemicals as routes of communication.",
    },
    {
      id: "lifescience_02_q9",
      qNo: 9,
      type: "inference",
      question: "Why is it hard to determine cause and effect in this research?",
      options: {
        A: "Microbes cannot be measured using modern tools",
        B: "Human emotions never change across individuals",
        C: "Microbes are identical in all healthy adults",
        D: "Lifestyle factors can affect both microbes and mood",
      },
      answer: "D", // ✅ D #3
      explanation:
        "The passage says lifestyle, diet, and health conditions may differ alongside microbiomes, making cause and effect hard to isolate.",
    },
    {
      id: "lifescience_02_q10",
      qNo: 10,
      type: "detail",
      question: "According to the passage, what is a major debate in this field?",
      options: {
        A: "Whether microbes influence behavior or vice versa",
        B: "Whether microbes are present in the gut at all",
        C: "Whether the immune system blocks all gut signals",
        D: "Whether cameras can detect microbes in real time",
      },
      answer: "A",
      explanation:
        "The passage states the debate concerns whether microbes shape behavior or whether behavior and environment shape the microbiome.",
    },
  ],
};