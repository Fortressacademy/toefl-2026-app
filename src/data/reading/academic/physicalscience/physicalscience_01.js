// src/data/reading/academic/physicalscience_01.js

export const physicalscience_01 = {
  id: "physicalscience_01",
  title: "Physical Science Practice 1",

  passageTitle: "Self-Healing Concrete",
  passage: `Concrete is one of the most widely used construction materials, but it has a persistent weakness: small cracks form over time as structures expand, contract, and bear weight. Even narrow cracks can let water and salts seep inside, accelerating corrosion of steel reinforcement and shortening a bridge or tunnel’s lifespan. For this reason, engineers have explored “self-healing concrete,” which is designed to repair cracks without requiring immediate human intervention.

One approach uses dormant bacteria mixed into the concrete along with a nutrient source. When a crack opens and moisture enters, the bacteria become active and produce minerals—often calcium carbonate—that gradually fill the gap. Some designs place bacteria and nutrients in tiny capsules that break when cracks form, releasing the healing agents directly where they are needed. Laboratory and field tests suggest that this method can reduce permeability and slow further damage, especially for hairline cracks.

However, self-healing systems have limits. Healing depends on factors such as moisture, temperature, crack width, and the survival time of bacteria in a harsh, alkaline environment. Costs can also be higher than conventional concrete. Even so, proponents argue that longer-lasting infrastructure could offset these challenges by reducing repair frequency and extending service life.`,

  passage2Title: "The Mystery of Sinkholes",
  passage2: `Sinkholes are sudden depressions or collapses in the ground that can damage roads, buildings, and underground utilities. They are especially common in regions with “karst” geology, where bedrock such as limestone slowly dissolves in slightly acidic groundwater. Over long periods, dissolution can enlarge fractures and create hidden cavities beneath the surface.

In many cases, the land above a cavity remains stable until its supporting layers thin. [■] Heavy rainfall can speed dissolution and also add weight to already weakened soil. [■] Human activity may intensify risk as well; pumping groundwater can lower the water table, removing buoyant support that once helped hold sediments in place. [■] Construction vibrations or leaking pipes can further disturb unstable ground. [■]

Because sinkholes may develop out of sight, early warning signs are easy to miss. Small cracks in walls, doors that suddenly stick, new dips in a yard, or cloudy well water can indicate shifting subsurface conditions. Mapping karst areas, monitoring groundwater changes, and maintaining drainage systems are common strategies for reducing unexpected collapse, but the exact timing of a sinkhole is often difficult to predict.`,

  questions: [
    // ===== Passage 1 (Q1~Q5) =====
    {
      id: "physicalscience_01_q1",
      qNo: 1,
      type: "purpose",
      question: "What is the main purpose of the passage?",
      options: {
        A: "To explain why concrete cracks and how self-healing methods aim to address it",
        B: "To argue that steel reinforcement is unnecessary in modern construction",
        C: "To describe how tunnels are designed to prevent any contact with water",
        D: "To compare the strength of concrete with that of natural stone",
      },
      answer: "A",
      explanation:
        "The passage describes concrete cracking and explains self-healing concrete approaches along with their limits.",
    },
    {
      id: "physicalscience_01_q2",
      qNo: 2,
      type: "vocab",
      question: 'The word "permeability" in the passage is closest in meaning to',
      options: {
        A: "hardness",
        B: "porosity",
        C: "density",
        D: "fragility",
      },
      answer: "B",
      explanation:
        '"Permeability" refers to how easily water passes through a material; lowering it means blocking seepage.',
      highlight: { query: "permeability", mode: "word" },
    },
    {
      id: "physicalscience_01_q3",
      qNo: 3,
      type: "detail",
      question:
        "According to the passage, what triggers the bacteria in some self-healing concrete designs?",
      options: {
        A: "Exposure to moisture entering through a crack",
        B: "Direct contact with sunlight on the surface",
        C: "Complete drying of the concrete interior",
        D: "A chemical signal released by steel reinforcement",
      },
      answer: "A",
      explanation:
        "The passage says the bacteria become active when moisture enters through a crack.",
    },
    {
      id: "physicalscience_01_q4",
      qNo: 4,
      type: "inference",
      question: "What can be inferred about capsule-based self-healing systems?",
      options: {
        A: "They aim to release healing agents at the damaged location",
        B: "They prevent cracks from forming in the first place",
        C: "They work only after cracks become very wide",
        D: "They must be refilled frequently to remain effective",
      },
      answer: "A",
      explanation:
        "The passage explains that capsules break when cracks form, releasing bacteria and nutrients where needed.",
    },
    {
      id: "physicalscience_01_q5",
      qNo: 5,
      type: "detail",
      question: "Which of the following is mentioned as a limitation of self-healing concrete?",
      options: {
        A: "It cannot be tested outside a laboratory setting",
        B: "Its effectiveness depends on environmental conditions",
        C: "It causes immediate corrosion of steel reinforcement",
        D: "It makes concrete dissolve faster in rainwater",
      },
      answer: "B",
      explanation:
        "The passage notes that healing depends on moisture, temperature, crack width, and bacteria survival, and can cost more.",
    },

    // ===== Passage 2 (Q6~Q10) =====
    {
      id: "physicalscience_01_q6",
      qNo: 6,
      type: "purpose",
      question: "What is the main purpose of the second passage?",
      options: {
        A: "To explain how sinkholes form and why they can be difficult to anticipate",
        B: "To argue that sinkholes occur only because of earthquakes",
        C: "To describe how limestone is mined for industrial materials",
        D: "To compare sinkholes with volcanic craters in different climates",
      },
      answer: "A",
      explanation:
        "The passage explains karst dissolution, contributing factors, warning signs, and why timing is hard to predict.",
    },
    {
      id: "physicalscience_01_q7",
      qNo: 7,
      type: "vocab",
      question: 'The word "dissolves" in the passage is closest in meaning to',
      options: {
        A: "hardens",
        B: "erodes",
        C: "freezes",
        D: "settles",
      },
      answer: "B",
      explanation:
        '"Dissolves" means the rock is gradually broken down and carried away by acidic groundwater, similar to erosion.',
      highlight: { query: "dissolves", mode: "word" },
    },
    {
      id: "physicalscience_01_q8",
      qNo: 8,
      type: "detail",
      question: "According to the passage, how can pumping groundwater increase sinkhole risk?",
      options: {
        A: "It raises surface temperatures that expand the soil",
        B: "It lowers the water table and removes buoyant support",
        C: "It turns groundwater into a stronger acid immediately",
        D: "It seals fractures in limestone and traps water underground",
      },
      answer: "B",
      explanation:
        "The passage states pumping can lower the water table, removing buoyant support that helped hold sediments in place.",
    },
    {
      id: "physicalscience_01_q9",
      qNo: 9,
      type: "insertion",
      question:
        'Look at the four squares [■] that indicate where the following sentence could be added:\n\n"Once the ceiling of a cavity can no longer bear the load above it, the surface may give way with little warning."\n\nWhere would the sentence best fit?',
      options: {
        A: "After the first sentence of paragraph 2.",
        B: "After the second sentence of paragraph 2.",
        C: "After the third sentence of paragraph 2.",
        D: "After the fourth sentence of paragraph 2.",
      },
      answer: "A",
      explanation:
        "The sentence explains why collapse can happen abruptly once support fails, which fits immediately after the idea that the land stays stable until supporting layers thin.",
    },
    {
      id: "physicalscience_01_q10",
      qNo: 10,
      type: "detail",
      question: "According to the passage, which of the following is mentioned as an early warning sign of sinkhole activity?",
      options: {
        A: "A sudden increase in nearby volcanic activity",
        B: "Doors that begin to stick unexpectedly",
        C: "Repeated lightning strikes in the same location",
        D: "A long-term drop in regional air temperature",
      },
      answer: "B",
      explanation:
        "The passage lists doors that suddenly stick, cracks in walls, new dips in a yard, and cloudy well water as warning signs.",
    },
  ],
};