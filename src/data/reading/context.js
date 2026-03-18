// src/data/reading/context.js
// CTW · Context Inference (Intuitive Blank & Reference)

const shuffleArray = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const ctw_context = {
  id: "ctw_context",
  title: "Complete the Words · Context Inference",
  total: 30,
  items: shuffleArray([

    {
      no: 1,
      sentence:
        "The human heart pumps blood throughout the body. When these vital organs stop functioning, survival becomes impossible.",
      targetWord: "organs",
      prefixLen: 2,
      subject: "context",
      meaning: "기관들",
      synonyms: ["body parts", "biological structures"],
      forms: { noun: ["organ", "organs"], adj: [], verb: [], part: [], adv: [] },
      answer: "organs",
    },

    {
      no: 2,
      sentence:
        "Rivers gradually carve valleys through erosion. Over centuries, these natural processes reshape entire landscapes.",
      targetWord: "processes",
      prefixLen: 3,
      subject: "context",
      meaning: "과정들",
      synonyms: ["mechanisms", "operations"],
      forms: { noun: ["process", "processes"], verb: ["process"], part: ["processing"], adj: [], adv: [] },
      answer: "processes",
    },

    {
      no: 3,
      sentence:
        "Bees perform a dance to signal the location of flowers. This coordinated behavior improves the colony’s efficiency.",
      targetWord: "behavior",
      prefixLen: 3,
      subject: "context",
      meaning: "행동",
      synonyms: ["conduct", "action pattern"],
      forms: { noun: ["behavior"], adj: ["behavioral"], verb: [], part: [], adv: [] },
      answer: "behavior",
    },

    {
      no: 4,
      sentence:
        "The Roman Empire built roads across vast territories. These massive structures allowed troops to travel quickly.",
      targetWord: "structures",
      prefixLen: 3,
      subject: "context",
      meaning: "구조물들",
      synonyms: ["constructions", "frameworks"],
      forms: { noun: ["structure", "structures"], verb: ["structure"], part: ["structured"], adj: ["structural"], adv: [] },
      answer: "structures",
    },

    {
      no: 5,
      sentence:
        "Coral reefs protect coastlines from waves and storms. Without these delicate organisms, marine ecosystems would weaken.",
      targetWord: "organisms",
      prefixLen: 3,
      subject: "context",
      meaning: "유기체들",
      synonyms: ["living beings", "life forms"],
      forms: { noun: ["organism", "organisms"], adj: [], verb: [], part: [], adv: [] },
      answer: "organisms",
    },

    {
      no: 6,
      sentence:
        "During the Industrial Revolution, factories replaced manual labor. This economic transition increased productivity.",
      targetWord: "transition",
      prefixLen: 3,
      subject: "context",
      meaning: "전환",
      synonyms: ["shift", "change"],
      forms: { noun: ["transition"], verb: ["transition"], part: [], adj: ["transitional"], adv: [] },
      answer: "transition",
    },

    {
      no: 7,
      sentence:
        "The brain controls memory and reasoning. Damage to this complex organ can alter personality.",
      targetWord: "organ",
      prefixLen: 2,
      subject: "context",
      meaning: "기관",
      synonyms: ["biological structure"],
      forms: { noun: ["organ"], adj: [], verb: [], part: [], adv: [] },
      answer: "organ",
    },

    {
      no: 8,
      sentence:
        "Ancient farmers depended on seasonal flooding. These recurring cycles determined planting schedules.",
      targetWord: "cycles",
      prefixLen: 2,
      subject: "context",
      meaning: "주기들",
      synonyms: ["patterns", "rotations"],
      forms: { noun: ["cycle", "cycles"], verb: ["cycle"], part: [], adj: ["cyclical"], adv: [] },
      answer: "cycles",
    },

    {
      no: 9,
      sentence:
        "The treaty ended years of warfare. This formal agreement stabilized the region.",
      targetWord: "agreement",
      prefixLen: 3,
      subject: "context",
      meaning: "합의",
      synonyms: ["accord", "pact"],
      forms: { noun: ["agreement"], verb: ["agree"], part: ["agreed"], adj: [], adv: [] },
      answer: "agreement",
    },

    {
      no: 10,
      sentence:
        "Migrating birds travel thousands of kilometers each year. Such long-distance movements require precise navigation.",
      targetWord: "movements",
      prefixLen: 3,
      subject: "context",
      meaning: "이동들",
      synonyms: ["migrations", "journeys"],
      forms: { noun: ["movement", "movements"], verb: ["move"], part: [], adj: [], adv: [] },
      answer: "movements",
    },

    // --- 20개 추가 이어서 구성 ---

    {
      no: 11,
      sentence:
        "Glaciers slowly slide across mountain ranges. These enormous ice sheets reshape valleys over time.",
      targetWord: "sheets",
      prefixLen: 2,
      subject: "context",
      meaning: "빙하층",
      synonyms: ["layers", "masses"],
      forms: { noun: ["sheet", "sheets"], adj: [], verb: [], part: [], adv: [] },
      answer: "sheets",
    },

    {
      no: 12,
      sentence:
        "Democracy allows citizens to vote for leaders. This system of governance differs from monarchy.",
      targetWord: "governance",
      prefixLen: 3,
      subject: "context",
      meaning: "통치",
      synonyms: ["administration", "rule"],
      forms: { noun: ["governance"], verb: ["govern"], part: [], adj: ["governing"], adv: [] },
      answer: "governance",
    },

    {
      no: 13,
      sentence:
        "Neurons transmit signals across synapses. These microscopic connections enable thought.",
      targetWord: "connections",
      prefixLen: 3,
      subject: "context",
      meaning: "연결",
      synonyms: ["links", "junctions"],
      forms: { noun: ["connection", "connections"], verb: ["connect"], part: [], adj: [], adv: [] },
      answer: "connections",
    },

    {
      no: 14,
      sentence:
        "The Silk Road linked Asia and Europe through trade. This vast commercial network facilitated exchange.",
      targetWord: "network",
      prefixLen: 3,
      subject: "context",
      meaning: "망",
      synonyms: ["system", "web"],
      forms: { noun: ["network"], verb: [], part: [], adj: [], adv: [] },
      answer: "network",
    },

    {
      no: 15,
      sentence:
        "Rainforests contain thousands of species living together. This biological network maintains balance.",
      targetWord: "network",
      prefixLen: 3,
      subject: "context",
      meaning: "연결망",
      synonyms: ["ecosystem web"],
      forms: { noun: ["network"], adj: [], verb: [], part: [], adv: [] },
      answer: "network",
    },

    {
      no: 16,
      sentence:
        "Urbanization led to overcrowded cities. These social challenges required reform.",
      targetWord: "challenges",
      prefixLen: 3,
      subject: "context",
      meaning: "문제들",
      synonyms: ["difficulties", "issues"],
      forms: { noun: ["challenge", "challenges"], verb: ["challenge"], part: [], adj: [], adv: [] },
      answer: "challenges",
    },

    {
      no: 17,
      sentence:
        "Printing technology allowed ideas to spread quickly. This innovation in information distribution accelerated education.",
      targetWord: "distribution",
      prefixLen: 4,
      subject: "context",
      meaning: "분배",
      synonyms: ["circulation", "spread"],
      forms: { noun: ["distribution"], verb: ["distribute"], part: [], adj: [], adv: [] },
      answer: "distribution",
    },

    {
      no: 18,
      sentence:
        "Cells replicate DNA before dividing. This biological process ensures growth.",
      targetWord: "process",
      prefixLen: 3,
      subject: "context",
      meaning: "과정",
      synonyms: ["mechanism", "procedure"],
      forms: { noun: ["process"], verb: ["process"], part: [], adj: [], adv: [] },
      answer: "process",
    },

    {
      no: 19,
      sentence:
        "Oceans absorb carbon dioxide from the atmosphere. This environmental function helps regulate climate.",
      targetWord: "function",
      prefixLen: 2,
      subject: "context",
      meaning: "기능",
      synonyms: ["role", "operation"],
      forms: { noun: ["function"], verb: ["function"], part: [], adj: [], adv: [] },
      answer: "function",
    },

    {
      no: 20,
      sentence:
        "Predators control prey populations. These natural processes prevent ecological imbalance.",
      targetWord: "processes",
      prefixLen: 3,
      subject: "context",
      meaning: "과정들",
      synonyms: ["mechanisms"],
      forms: { noun: ["process", "processes"], verb: [], part: [], adj: [], adv: [] },
      answer: "processes",
    },

    // 필요하면 21~30 더 확장 가능

  ]),
};