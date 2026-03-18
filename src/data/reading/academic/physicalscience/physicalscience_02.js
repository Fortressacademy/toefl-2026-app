// src/data/reading/academic/physicalscience_02.js

export const physicalscience_02 = {
  id: "physicalscience_02",
  title: "Physical Science Practice 2",

  passageTitle: "3D-Printed Organs",
  passage: `3D-printed organs, often discussed under the term bioprinting, involve building tissue-like structures layer by layer using “bioinks.” These bioinks may contain living cells suspended in a gel that provides temporary support while the cells attach and grow. Instead of printing a solid plastic shape, bioprinting aims to create a structure that behaves like real tissue, including flexibility, permeability, and the ability to exchange nutrients.

Early successes have focused on simpler tissues such as skin patches, cartilage, and thin liver-like constructs used for drug testing. Printing a full organ, however, is far more difficult. Thick tissues require channels that function like blood vessels so oxygen and nutrients can reach inner cells. Without a vascular network, interior regions can die even if the outside looks intact. Researchers therefore experiment with sacrificial materials that can be washed away to leave tiny tubes, or with printing multiple cell types in precise arrangements.

If these challenges are solved, bioprinted organs could reduce transplant shortages and enable patient-specific grafts that lower immune rejection, connecting the technology directly to regenerative medicine.`,

  passage2Title: "Why the Sky Turns Green Before a Tornado",
  passage2: `A greenish sky before a tornado is not a reliable “signal” that a tornado will occur, but it can appear in certain severe storms. One explanation involves how sunlight passes through thick storm clouds packed with water droplets and ice. When the Sun is low, its light travels through more atmosphere and loses some shorter wavelengths, shifting what reaches the storm. The remaining light can then be filtered and scattered by the cloud in a way that changes the sky’s color.

Hail can strengthen this effect. Large hailstones and dense ice regions inside a supercell can reflect and scatter light differently than ordinary rain clouds. If a storm’s core contains abundant hail and the cloud base is very dark, the contrast can make the surrounding sky appear tinted green. The green color, therefore, is best understood as an optical outcome of storm structure, sun angle, and particle scattering—not as a direct indicator of rotating winds near the ground.

Because many storms with hail never produce tornadoes, the green sky should be treated as a weather curiosity rather than a forecast tool.`,

  questions: [
    // ===== Passage 1 (Q1~Q5) =====
    {
      id: "physicalscience_02_q1",
      qNo: 1,
      type: "purpose",
      question: "What is the main purpose of the passage?",
      options: {
        A: "To explain bioprinting and why full organs are hard to print",
        B: "To argue that plastic 3D printing will replace all surgery soon",
        C: "To describe how transplant laws changed in the last decade",
        D: "To compare organ donation rates across several countries",
      },
      answer: "A",
      explanation:
        "The passage defines bioprinting, describes current progress, and explains the major obstacle of building functional thick organs.",
    },
    {
      id: "physicalscience_02_q2",
      qNo: 2,
      type: "vocab",
      question: 'The word "permeability" in the passage is closest in meaning to',
      options: {
        A: "hardness",
        B: "weight",
        C: "symmetry",
        D: "porosity",
      },
      answer: "D", // D #1
      explanation:
        '"Permeability" refers to how easily substances (like fluids or nutrients) can pass through a material—similar to porosity.',
      highlight: { query: "permeability", mode: "word" },
    },
    {
      id: "physicalscience_02_q3",
      qNo: 3,
      type: "detail",
      question: "According to the passage, why are thick tissues difficult to print successfully?",
      options: {
        A: "Inner cells may die without a vessel-like network for delivery",
        B: "Bioinks cannot contain living cells at any temperature",
        C: "Thin tissues cannot be used for drug testing purposes",
        D: "Cells refuse to attach unless a plastic frame is present",
      },
      answer: "A",
      explanation:
        "The passage explains that without channels like blood vessels, oxygen and nutrients cannot reach interior cells.",
    },
    // ✅ 교체: physicalscience_02_q4 (정답 D로 조정, 길이 비슷하게 맞춤)

{
  id: "physicalscience_02_q4",
  qNo: 4,
  type: "inference",
  question: "What can be inferred about “sacrificial materials” used in bioprinting?",
  options: {
    A: "They permanently stiffen printed gels to prevent cracking",
    B: "They replace the need for nutrient transport within tissues",
    C: "They allow tissues to be printed without any living cells",
    D: "They are removed to leave hollow channels for circulation",
  },
  answer: "D",
  explanation:
    "The passage explains that sacrificial materials can be washed away, leaving tiny tubes that function like channels.",
},
    {
      id: "physicalscience_02_q5",
      qNo: 5,
      type: "detail",
      question: "Which potential benefit of bioprinted organs is mentioned in the passage?",
      options: {
        A: "Reducing transplant shortages with patient-specific grafts",
        B: "Eliminating the need for all medical imaging techniques",
        C: "Guaranteeing that no immune response will ever occur",
        D: "Replacing drug testing with only computer simulations",
      },
      answer: "A",
      explanation:
        "The passage mentions reducing transplant shortages and enabling patient-specific grafts that may lower rejection.",
    },

    // ===== Passage 2 (Q6~Q10) =====
    {
      id: "physicalscience_02_q6",
      qNo: 6,
      type: "purpose",
      question: "What is the main purpose of the second passage?",
      options: {
        A: "To explain how storm optics can produce a green sky",
        B: "To prove green skies always mean tornado formation",
        C: "To describe how tornadoes are rated for intensity",
        D: "To argue that hail is the main cause of all tornadoes",
      },
      answer: "A",
      explanation:
        "The passage explains the green-sky phenomenon as an optical effect involving sunlight, cloud particles, and storm structure.",
    },
    {
      id: "physicalscience_02_q7",
      qNo: 7,
      type: "vocab",
      question: 'The word "reliable" in the passage is closest in meaning to',
      options: {
        A: "temporary",
        B: "distant",
        C: "ordinary",
        D: "dependable",
      },
      answer: "D", // D #2
      explanation:
        '"Reliable" means dependable or consistently trustworthy; the passage says a green sky is not a dependable tornado signal.',
      highlight: { query: "reliable", mode: "word" },
    },
    {
      id: "physicalscience_02_q8",
      qNo: 8,
      type: "detail",
      question: "According to the passage, what condition can make the green tint more noticeable?",
      options: {
        A: "A dark cloud base combined with abundant hail in the core",
        B: "A clear sky with low humidity and weak winds",
        C: "A bright midday Sun directly above the storm",
        D: "A storm composed only of thin, high cirrus clouds",
      },
      answer: "A",
      explanation:
        "The passage states that abundant hail and a very dark base can increase contrast and strengthen the green appearance.",
    },
    {
      id: "physicalscience_02_q9",
      qNo: 9,
      type: "detail",
      question: "Why does the author say the green sky should not be treated as a forecast tool?",
      options: {
        A: "Many hail-producing storms do not produce tornadoes",
        B: "The green color appears only after tornadoes have ended",
        C: "Weather radar cannot detect hail inside storms",
        D: "Green light is blocked completely by the atmosphere",
      },
      answer: "A",
      explanation:
        "The passage notes that many storms with hail never produce tornadoes, so the color alone is not predictive.",
    },
    {
      id: "physicalscience_02_q10",
      qNo: 10,
      type: "inference",
      question: "What can be inferred about the role of hail in the green-sky phenomenon?",
      options: {
        A: "It can influence scattering, but it does not guarantee a tornado",
        B: "It forms only when a tornado is already on the ground",
        C: "It replaces sunlight as the main source of illumination",
        D: "It contributes by changing how light is scattered inside the storm",
      },
      answer: "D", // D #3
      explanation:
        "The passage says hail can strengthen the effect by reflecting/scattering light differently, so hail can contribute to the green tint.",
    },
  ],
};

// ✅ D answers count: Q2, Q7, Q10 = 3
// Need at least 4 Ds total → adjust one more answer to D without making it the longest.