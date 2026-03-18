export const mixed_01 = {
  id: "academic_mixed_01",
  title: "Academic Mixed Practice 1",

  // =========================
  // PASSAGE 1 (VIKINGS)
  // =========================
  passageTitle: "Reevaluating the Viking Expansion",
  passage:
    "For centuries, Vikings were portrayed primarily as violent raiders who attacked monasteries and coastal towns throughout Europe. This image originated largely from medieval Christian chronicles, which emphasized destruction and instability. Because these accounts were written by communities that suffered from Viking attacks, they tended to highlight conflict while overlooking other aspects of Scandinavian society.\n\nRecent archaeological research, however, has provided a more nuanced understanding of Viking activity. Excavations in cities such as Dublin and York reveal evidence of permanent settlement, craft specialization, and integration with local populations. In addition, foreign coins and imported goods discovered in Scandinavian burial sites indicate participation in long-distance trade networks extending into continental Europe and beyond.\n\nScholars now argue that Viking expansion was motivated by a combination of economic opportunity, population pressure, and internal political competition. Literary sources such as the Norse sagas describe assemblies known as “things,” where disputes were resolved through structured negotiation and collective judgment. Although these texts were written centuries after the events they describe, they suggest that Viking society maintained legal institutions and social norms that contradict the stereotype of a purely chaotic warrior culture.",

  // =========================
  // PASSAGE 2 (AQUEDUCTS)
  // =========================
  passage2Title: "Aqueducts and the Engineering of Urban Water",
  passage2:
    "Ancient aqueducts are often remembered as monumental stone arches stretching across valleys, yet their true importance lay in supplying stable water to expanding cities. As populations increased, nearby wells proved insufficient, prompting engineers to channel water from distant springs. By constructing routes with a gradual decline in elevation, they allowed gravity to transport water efficiently without mechanical assistance.\n\nWhile the arches became the most visible symbol of these systems, large portions were built below the surface. Subterranean sections reduced exposure to erosion and contamination. Builders selected materials such as stone blocks, fired bricks, and concrete mixtures depending on geographic conditions. They also incorporated sedimentation tanks and inspection access points, enabling routine cleaning and early detection of structural weaknesses.\n\nBeyond providing drinking water, aqueduct networks supported bathing complexes, ornamental fountains, and waste removal systems. In doing so, they influenced sanitation standards and daily urban life. However, these systems were vulnerable to disruption. Environmental events or administrative neglect could quickly diminish water flow, demonstrating that consistent oversight was essential to their continued effectiveness.",

  questions: [
    // ===== VIKING (1–5) =====
    {
      id: "academic_mixed_01_q1",
      no: 1,
      q: "According to paragraph 1, why did medieval chronicles emphasize Viking violence?",
      options: {
        A: "Vikings refused to engage in trade.",
        B: "The writers were communities affected by Viking attacks.",
        C: "Viking society lacked political organization.",
        D: "Archaeological evidence supported their claims."
      },
      answer: "B",
      explanation:
        "The passage states that these accounts were written by communities that suffered from Viking attacks."
    },
    {
      id: "academic_mixed_01_q2",
      no: 2,
      type: "vocabulary",
      highlight: { query: "nuanced", mode: "word" },
      q: 'The word "nuanced" in paragraph 2 is closest in meaning to:',
      options: {
        A: "simplified",
        B: "balanced",
        C: "detailed and subtle",
        D: "controversial"
      },
      answer: "C",
      explanation:
        "“Nuanced” refers to a complex and carefully differentiated understanding."
    },
    {
      id: "academic_mixed_01_q3",
      no: 3,
      q: "What can be inferred from the discovery of foreign coins in Scandinavian burial sites?",
      options: {
        A: "Vikings adopted foreign religious beliefs.",
        B: "Vikings participated in extensive trade networks.",
        C: "Vikings preferred imported goods over local products.",
        D: "Foreign merchants controlled Scandinavian economies."
      },
      answer: "B",
      explanation:
        "Foreign coins imply participation in long-distance exchange systems."
    },
    {
      id: "academic_mixed_01_q4",
      no: 4,
      q: "Why does the author mention the Norse sagas and \"things\" in paragraph 3?",
      options: {
        A: "To demonstrate that Viking society had organized legal institutions",
        B: "To argue that sagas are unreliable historical documents",
        C: "To show that Viking expansion was religiously motivated",
        D: "To compare Viking law with Roman legal systems"
      },
      answer: "A",
      explanation:
        "The assemblies illustrate structured dispute resolution."
    },
    {
      id: "academic_mixed_01_q5",
      no: 5,
      type: "insertion",
      insertSentence:
        "This portrayal, however, reflects the perspective of those who experienced Viking attacks rather than the full scope of Viking society.",
      q:
        "Look at the four squares [■] in the passage that indicate where the following sentence could be added.\n\n__________\n\nWhere would the sentence best fit?",
      options: {
        A: "Ａ",
        B: "Ｂ",
        C: "Ｃ",
        D: "Ｄ"
      },
      answer: "A",
      explanation:
        "It directly qualifies the opening description."
    },

    // ===== AQUEDUCT (6–10) =====
    {
      id: "academic_mixed_01_q6",
      no: 6,
      q: "What is the passage mainly about?",
      options: {
        A: "The decorative role of aqueduct arches",
        B: "The engineering and management of aqueduct systems",
        C: "Political conflicts over water access",
        D: "The collapse of Roman infrastructure"
      },
      answer: "B",
      explanation:
        "The passage discusses design, construction, and oversight."
    },
    {
      id: "academic_mixed_01_q7",
      no: 7,
      q: "According to paragraph 2, why were many sections built underground?",
      options: {
        A: "To reduce environmental damage and contamination",
        B: "To increase pressure",
        C: "To shorten construction time",
        D: "To improve visibility"
      },
      answer: "A",
      explanation:
        "Underground construction reduced erosion and contamination."
    },
    {
      id: "academic_mixed_01_q8",
      no: 8,
      q: "Why does the author mention sedimentation tanks and inspection points?",
      options: {
        A: "To show how maintenance prevented serious failures",
        B: "To argue that aqueducts were inefficient",
        C: "To demonstrate frequent breakdowns",
        D: "To criticize ancient materials"
      },
      answer: "A",
      explanation:
        "These features illustrate preventative maintenance."
    },
    {
      id: "academic_mixed_01_q9",
      no: 9,
      q: "What can be inferred about aqueduct systems?",
      options: {
        A: "They functioned without supervision.",
        B: "They required ongoing oversight and labor.",
        C: "They were unaffected by disasters.",
        D: "They were mainly decorative."
      },
      answer: "B",
      explanation:
        "The text indicates maintenance was essential."
    },
    {
      id: "academic_mixed_01_q10",
      no: 10,
      type: "vocabulary",
      highlight: { query: "stable", mode: "word" },
      q: 'The word "stable" in paragraph 1 is closest in meaning to:',
      options: {
        A: "temporary",
        B: "unpredictable",
        C: "reliable",
        D: "limited"
      },
      answer: "C",
      explanation:
        "“Stable” refers to a steady and dependable supply."
    }
  ]
};