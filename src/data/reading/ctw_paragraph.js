// src/data/reading/ctw_paragraph.js
export const ctw_para = {
  id: "ctw_para",
  title: "Paragraph Fill",
  items: [
    {
      id: "para_1",
      paragraph:
        "Botswana is one of the top diamond-producing countries in the world. Mining {{01}} a {{02}} portion of the {{03}} economy, and the mines are {{04}} by the {{05}}. They {{06}} for {{07}} a {{08}} of Botswana's gross domestic product.",
      blanks: [
        { key: "01", answer: "represents", prefixLen: 3 },
        { key: "02", answer: "significant", prefixLen: 2 },
        { key: "03", answer: "national", prefixLen: 2 },
        { key: "04", answer: "owned", prefixLen: 1 },
        { key: "05", answer: "government", prefixLen: 2 },
        { key: "06", answer: "account", prefixLen: 2 },
        { key: "07", answer: "about", prefixLen: 2 },
        { key: "08", answer: "third", prefixLen: 1 },
      ],
      subject: "economy",
    },

 {
      id: "para_2",
      paragraph:
        "The Great Barrier Reef is one of the most {{01}} marine ecosystems on Earth. It {{02}} along the northeastern coast of Australia and {{03}} thousands of coral reefs and islands. The reef is {{04}} by rising ocean temperatures, which {{05}} coral bleaching. Scientists {{06}} that immediate action is {{07}} to protect its rich biodiversity and ensure its long-term {{08}}.",
      blanks: [
        { key: "01", answer: "diverse", prefixLen: 2 },
        { key: "02", answer: "stretches", prefixLen: 3 },
        { key: "03", answer: "includes", prefixLen: 2 },
        { key: "04", answer: "threatened", prefixLen: 3 },
        { key: "05", answer: "causes", prefixLen: 2 },
        { key: "06", answer: "warn", prefixLen: 1 },
        { key: "07", answer: "necessary", prefixLen: 3 },
        { key: "08", answer: "survival", prefixLen: 2 },
      ],
      subject: "environment",
    },
 {
      id: "para_3",
      paragraph:
        "Regular exercise has a positive {{01}} on both physical and mental health. People who work out {{02}} a regular basis often feel more {{03}} and confident. It also helps reduce stress {{04}} improving sleep quality. In addition, doctors {{05}} that simple activities such as walking can {{06}} the risk of heart disease. For this reason, many experts {{07}} everyone to stay active {{08}} their daily lives.",
      blanks: [
        { key: "01", answer: "effect", prefixLen: 2 },
        { key: "02", answer: "on", prefixLen: 1 },
        { key: "03", answer: "energetic", prefixLen: 2 },
        { key: "04", answer: "by", prefixLen: 1 },
        { key: "05", answer: "suggest", prefixLen: 2 },
        { key: "06", answer: "reduce", prefixLen: 2 },
        { key: "07", answer: "encourage", prefixLen: 3 },
        { key: "08", answer: "in", prefixLen: 1 },
      ],
      subject: "health",
    },

       {
      id: "para4",
      paragraph:
        "In studies of memory, researchers note that recall is {{01}} reconstructive rather than perfectly stored. When people retell an experience {{02}} different contexts, they may {{03}} adjust details without noticing. This can reduce the {{04}} accuracy of testimony, especially when suggestions come {{05}} authority figures. By {{06}} repeating interviews, investigators sometimes increase {{07}} consistency, but the final account may still be {{08}} biased and {{09}} incomplete.",
      blanks: [
        // adverbs (2)
        { key: "03", answer: "subtly", prefixLen: 2 },     // adv
        { key: "07", answer: "gradually", prefixLen: 3 },  // adv

        // prepositions (2)
        { key: "02", answer: "in", prefixLen: 1 },         // prep
        { key: "05", answer: "from", prefixLen: 1 },       // prep

        // gerund (1)
        { key: "06", answer: "repeating", prefixLen: 3 },  // gerund

        // nouns (2)
        { key: "04", answer: "accuracy", prefixLen: 2 },   // noun
        { key: "01", answer: "often", prefixLen: 1 },      // adv인데 여기 배치가 꼬임
      ],
      subject: "psychology",
    },

        {
      id: "para5",
      paragraph:
        "As temperatures rise, some species shift their ranges {{01}} new habitats, while others decline {{02}} limited resources. Conservation plans aim to protect {{03}} corridors that keep populations connected. Without such routes, genetic {{04}} diversity can decrease, making groups more {{05}} vulnerable to disease. Policymakers focus {{06}} {{07}} practical solutions, including {{08}} restoring wetlands, because these ecosystems can be {{09}} effective at absorbing floodwater.",
      blanks: [
        // adverbs (2)
        { key: "01", answer: "toward", prefixLen: 2 }, // prep not adv
        { key: "02", answer: "rapidly", prefixLen: 2 }, // adv

        // prepositions (2)
        { key: "06", answer: "on", prefixLen: 1 },    // prep
        { key: "09", answer: "highly", prefixLen: 2 }, // adv

        // gerund (1)
        { key: "08", answer: "restoring", prefixLen: 3 }, // gerund

        // nouns (2)
        { key: "03", answer: "migration", prefixLen: 2 }, // noun? maybe
        { key: "04", answer: "diversity", prefixLen: 2 }, // noun

        // adjectives (2)
        { key: "05", answer: "genetically", prefixLen: 2 }, // adv
        { key: "07", answer: "practical", prefixLen: 2 }, // adj
      ],
      subject: "environmental_science",
    },


{
  id: "para_6",
  paragraph:
    "During medieval Europe, clergy held {{01}} authority in many kingdoms. They would {{02}} sacred texts {{03}} monasteries and guide political leaders. {{04}} some rulers resisted church power, priests {{05}} royal decisions {{06}}. Their {{07}} doctrine shaped social values, and believers listened {{08}} sermons carefully. This structure {{09}} strengthened church power {{10}} times of crisis.",
  blanks: [
    { key: "01", answer: "religious", prefixLen: 3 },     // adjective
    { key: "02", answer: "interpret", prefixLen: 3 },     // verb
    { key: "03", answer: "in", prefixLen: 1 },            // preposition
    { key: "04", answer: "although", prefixLen: 2 },      // conjunction
    { key: "05", answer: "influence", prefixLen: 3 },     // verb
    { key: "06", answer: "ultimately", prefixLen: 3 },    // adverb
    { key: "07", answer: "doctrine", prefixLen: 2 },      // noun
    { key: "08", answer: "during", prefixLen: 2 },        // preposition
    { key: "09", answer: "authority", prefixLen: 3 },     // noun
    { key: "10", answer: "carefully", prefixLen: 3 },     // adverb
  ],
  subject: "history",
},

{
  id: "para_7",
  paragraph:
    "An {{01}} device can {{02}} moisture in the air {{03}} drinking water. The {{04}} system works even in dry regions, {{05}} humidity levels are low. Engineers {{06}} redesigned materials to improve {{07}}, and the machine now operates {{08}}. Although the technology was first experimental, it {{09}} communities {{10}} remote areas.",
  blanks: [
    { key: "01", answer: "innovative", prefixLen: 3 },   // adjective (1)
    { key: "02", answer: "convert", prefixLen: 2 },      // verb (1)
    { key: "03", answer: "into", prefixLen: 1 },         // preposition (1)
    { key: "04", answer: "portable", prefixLen: 3 },     // adjective (2)
    { key: "05", answer: "although", prefixLen: 2 },     // conjunction (1)
    { key: "06", answer: "transform", prefixLen: 3 },    // verb (2)
    { key: "07", answer: "efficiency", prefixLen: 3 },   // noun (1)
    { key: "08", answer: "rapidly", prefixLen: 2 },      // adverb (1)
    { key: "09", answer: "ultimately", prefixLen: 3 },   // adverb (2)
    { key: "10", answer: "device", prefixLen: 2 },       // noun (2)
  ],
  subject: "science_technology",
},


{
  id: "para_8",
  paragraph:
    "The Foehn wind forms when air masses {{01}} mountain ranges and {{02}} on the opposite side. As the air moves {{03}}, it becomes {{04}} and {{05}}. {{06}} the process begins with cooling, the {{07}} increases as the air compresses. This change can {{08}} wildfire risk and alter local {{09}}. In some regions, the effect appears {{10}} during spring.",
  blanks: [
    { key: "01", answer: "descend", prefixLen: 2 },       // verb (1)
    { key: "02", answer: "over", prefixLen: 1 },          // preposition (1)
    { key: "03", answer: "rapidly", prefixLen: 2 },       // adverb (1)
    { key: "04", answer: "warm", prefixLen: 1 },          // adjective (1)
    { key: "05", answer: "dry", prefixLen: 1 },           // adjective (2)
    { key: "06", answer: "although", prefixLen: 2 },      // conjunction (1)
    { key: "07", answer: "temperature", prefixLen: 3 },   // noun (1)
    { key: "08", answer: "intensify", prefixLen: 3 },     // verb (2)
    { key: "09", answer: "pressure", prefixLen: 2 },      // noun (2)
    { key: "10", answer: "unexpectedly", prefixLen: 3 },  // adverb (2)
  ],
  subject: "meteorology",
},


{
  id: "para_9",
  paragraph:
    "Social Acceleration Theory explains how {{01}} life continues to {{02}} in modern society. Technologies evolve {{03}}, and individuals feel {{04}} pressure to respond instantly. Work systems {{05}} attention {{06}} digital environments, reducing personal {{07}}. As communication speeds increase, routines change {{08}} and relationships weaken {{09}}. Over time, this pattern challenges emotional {{10}}.",
  blanks: [
    { key: "01", answer: "digital", prefixLen: 2 },      // adjective (1)
    { key: "02", answer: "accelerate", prefixLen: 3 },   // verb (1)
    { key: "03", answer: "rapidly", prefixLen: 2 },      // adverb (1)
    { key: "04", answer: "constant", prefixLen: 2 },     // adjective (2) ← constant (형용사)
    { key: "05", answer: "demand", prefixLen: 2 },       // verb (2)
    { key: "06", answer: "in", prefixLen: 1 },           // preposition (1)
    { key: "07", answer: "stability", prefixLen: 3 },    // noun (1)
    { key: "08", answer: "constantly", prefixLen: 3 },   // adverb (2)
    { key: "09", answer: "gradually", prefixLen: 3 },    // adverb (3) ❌ 초과
    { key: "10", answer: "emotional", prefixLen: 3 },    // adjective (3) ❌ 초과
  ],
  subject: "sociology",
},



{
  id: "para_10",
  paragraph:
    "A cantilever is a {{01}} system that allows buildings to {{02}} outward {{03}} direct support. Engineers {{04}} weight {{05}} to maintain {{06}}, preventing {{07}}. The {{08}} beam projects {{09}} open space and changes a skyline {{10}}.",
  blanks: [
    { key: "01", answer: "structural", prefixLen: 3 },   // adjective (1)
    { key: "02", answer: "extend", prefixLen: 2 },       // verb (1)
    { key: "03", answer: "without", prefixLen: 3 },      // preposition (1)
    { key: "04", answer: "distribute", prefixLen: 3 },   // verb (2)
    { key: "05", answer: "carefully", prefixLen: 3 },    // adverb (1)
    { key: "06", answer: "balance", prefixLen: 2 },      // noun (1)
    { key: "07", answer: "tension", prefixLen: 2 },      // noun (2)
    { key: "08", answer: "horizontal", prefixLen: 3 },   // adjective (2)
    { key: "09", answer: "over", prefixLen: 2 },         // preposition (2)
    { key: "10", answer: "dramatically", prefixLen: 3 }, // adverb (2)
  ],
  subject: "architecture",
},

  ],
};