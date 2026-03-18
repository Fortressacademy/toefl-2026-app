// src/data/reading/biology.js
// CTW · Biology (2-sentence context version)

const shuffleArray = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const ctw_bio = {
  id: "ctw_bio",
  title: "Complete the Words · Biology",
  total: 30,
  items: shuffleArray([

    {
      no: 1,
      sentence:
        "Organisms must maintain a stable internal environment despite constant external changes. This process, known as homeostasis, allows cells and tissues to function efficiently.",
      targetWord: "homeostasis",
      prefixLen: 3,
      subject: "biology",
      meaning: "항상성",
      synonyms: ["internal regulation", "physiological balance", "stability maintenance"],
      forms: {
        noun: ["homeostasis"],
        adj: ["homeostatic"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "homeostasis",
    },

    {
      no: 2,
      sentence:
        "Plants capture sunlight and convert it into usable chemical energy. Through photosynthesis, they produce glucose that fuels growth and metabolism.",
      targetWord: "photosynthesis",
      prefixLen: 4,
      subject: "biology",
      meaning: "광합성",
      synonyms: ["light-driven sugar production", "carbon fixation process", "solar energy conversion"],
      forms: {
        noun: ["photosynthesis"],
        adj: ["photosynthetic"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "photosynthesis",
    },

    {
      no: 3,
      sentence:
        "Genetic information is usually copied with remarkable accuracy. However, a mutation can occasionally alter DNA sequences and create new traits.",
      targetWord: "mutation",
      prefixLen: 2,
      subject: "biology",
      meaning: "돌연변이",
      synonyms: ["genetic change", "DNA alteration", "sequence shift"],
      forms: {
        noun: ["mutation"],
        verb: ["mutate"],
        part: ["mutating", "mutated"],
        adj: ["mutational", "mutant"],
        adv: [],
      },
      answer: "mutation",
    },

    {
      no: 4,
      sentence:
        "Chemical reactions in cells would occur too slowly without assistance. An enzyme acts as a biological catalyst, speeding up these essential processes.",
      targetWord: "enzyme",
      prefixLen: 2,
      subject: "biology",
      meaning: "효소",
      synonyms: ["biological catalyst", "reaction accelerator"],
      forms: {
        noun: ["enzyme"],
        adj: ["enzymatic"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "enzyme",
    },

    {
      no: 5,
      sentence:
        "Cells require energy to perform functions such as movement and repair. Through respiration, they break down glucose to produce ATP.",
      targetWord: "respiration",
      prefixLen: 3,
      subject: "biology",
      meaning: "세포 호흡",
      synonyms: ["energy-releasing breakdown", "ATP production"],
      forms: {
        noun: ["respiration"],
        adj: ["respiratory"],
        verb: ["respire"],
        part: ["respiring", "respired"],
        adv: [],
      },
      answer: "respiration",
    },

    {
      no: 6,
      sentence:
        "When a species can no longer survive in its environment, its population declines irreversibly. Eventually, extinction occurs, eliminating the species entirely.",
      targetWord: "extinction",
      prefixLen: 3,
      subject: "biology",
      meaning: "멸종",
      synonyms: ["species loss", "biological disappearance"],
      forms: {
        noun: ["extinction"],
        adj: ["extinct"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "extinction",
    },

    {
      no: 7,
      sentence:
        "Genetic material is tightly packaged inside the cell nucleus. Each chromosome contains numerous genes that determine inherited traits.",
      targetWord: "chromosome",
      prefixLen: 4,
      subject: "biology",
      meaning: "염색체",
      synonyms: ["DNA structure", "genetic carrier"],
      forms: {
        noun: ["chromosome"],
        adj: ["chromosomal"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "chromosome",
    },

    {
      no: 8,
      sentence:
        "Some animals remain inactive during harsh winters to conserve energy. In this dormant state, their metabolism slows significantly.",
      targetWord: "dormant",
      prefixLen: 3,
      subject: "biology",
      meaning: "휴면 상태의",
      synonyms: ["inactive", "temporarily suspended"],
      forms: {
        noun: ["dormancy"],
        adj: ["dormant"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "dormant",
    },

    {
      no: 9,
      sentence:
        "In a food web, a predator hunts and consumes other organisms. This interaction influences population balance within the ecosystem.",
      targetWord: "predator",
      prefixLen: 3,
      subject: "biology",
      meaning: "포식자",
      synonyms: ["hunter species", "top consumer"],
      forms: {
        noun: ["predator"],
        adj: ["predatory"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "predator",
    },

    {
      no: 10,
      sentence:
        "Flowering plants depend on insects or wind to transfer pollen. This process of pollination enables successful reproduction.",
      targetWord: "pollination",
      prefixLen: 4,
      subject: "biology",
      meaning: "수분",
      synonyms: ["pollen transfer", "fertilization support"],
      forms: {
        noun: ["pollination"],
        verb: ["pollinate"],
        part: ["pollinating", "pollinated"],
        adj: ["pollinated"],
        adv: [],
      },
      answer: "pollination",
    },
        {
      no: 11,
      sentence:
        "Genetic variation within a population increases the likelihood that some individuals will survive environmental change. Through recombination, alleles are reshuffled during meiosis to produce new gene combinations.",
      targetWord: "recombination",
      prefixLen: 5,
      subject: "biology",
      meaning: "재조합",
      synonyms: ["genetic reshuffling", "allele mixing", "DNA rearrangement"],
      forms: {
        noun: ["recombination"],
        adj: ["recombinant"],
        verb: ["recombine"],
        part: ["recombining", "recombined"],
        adv: [],
      },
      answer: "recombination",
    },

    {
      no: 12,
      sentence:
        "Healthy ecosystems typically contain a wide variety of species. This biodiversity strengthens ecological stability and resilience against disturbances.",
      targetWord: "biodiversity",
      prefixLen: 4,
      subject: "biology",
      meaning: "생물다양성",
      synonyms: ["species variety", "ecological diversity", "biological richness"],
      forms: {
        noun: ["biodiversity"],
        adj: ["biodiverse"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "biodiversity",
    },

    {
      no: 13,
      sentence:
        "Some organisms form long-term partnerships that benefit both parties. In a symbiotic relationship, each species gains advantages necessary for survival.",
      targetWord: "symbiotic",
      prefixLen: 3,
      subject: "biology",
      meaning: "공생의",
      synonyms: ["mutually beneficial", "interdependent", "cooperative"],
      forms: {
        noun: ["symbiosis"],
        adj: ["symbiotic"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "symbiotic",
    },

    {
      no: 14,
      sentence:
        "Cell membranes regulate what enters and leaves the cell. When they are permeable to certain molecules, diffusion can occur efficiently.",
      targetWord: "permeable",
      prefixLen: 4,
      subject: "biology",
      meaning: "투과성 있는",
      synonyms: ["allowing passage", "penetrable"],
      forms: {
        noun: ["permeability"],
        adj: ["permeable", "impermeable"],
        verb: ["permeate"],
        part: ["permeating", "permeated"],
        adv: [],
      },
      answer: "permeable",
    },

    {
      no: 15,
      sentence:
        "Organisms require essential materials such as water, nutrients, and shelter. When these resources become scarce, competition intensifies.",
      targetWord: "resources",
      prefixLen: 3,
      subject: "biology",
      meaning: "자원",
      synonyms: ["supplies", "necessities", "limiting factors"],
      forms: {
        noun: ["resource", "resources"],
        adj: ["resourceful"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "resources",
    },

    {
      no: 16,
      sentence:
        "Certain inherited traits increase an organism’s chance of survival. This selective advantage becomes more common in future generations.",
      targetWord: "advantage",
      prefixLen: 2,
      subject: "biology",
      meaning: "이점",
      synonyms: ["benefit", "evolutionary edge"],
      forms: {
        noun: ["advantage"],
        adj: ["advantageous"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "advantage",
    },

    {
      no: 17,
      sentence:
        "In experimental design, researchers must control influencing factors carefully. Each variable can affect the outcome of the biological study.",
      targetWord: "variable",
      prefixLen: 3,
      subject: "biology",
      meaning: "변수",
      synonyms: ["factor", "changing element"],
      forms: {
        noun: ["variable", "variability"],
        adj: ["variable"],
        verb: ["vary"],
        part: ["varying", "varied"],
        adv: [],
      },
      answer: "variable",
    },

    {
      no: 18,
      sentence:
        "Some organisms depend entirely on another species for nutrients. A parasite often harms its host while benefiting itself.",
      targetWord: "parasite",
      prefixLen: 3,
      subject: "biology",
      meaning: "기생생물",
      synonyms: ["host-dependent organism", "nutrient-drainer"],
      forms: {
        noun: ["parasite", "parasitism"],
        adj: ["parasitic"],
        verb: ["parasitize"],
        part: ["parasitizing", "parasitized"],
        adv: [],
      },
      answer: "parasite",
    },

    {
      no: 19,
      sentence:
        "Scientific findings must be confirmed through repeated testing. If results are reproducible, they can be trusted as reliable evidence.",
      targetWord: "reproducible",
      prefixLen: 5,
      subject: "biology",
      meaning: "재현 가능한",
      synonyms: ["repeatable", "replicable"],
      forms: {
        noun: ["reproducibility"],
        adj: ["reproducible"],
        verb: ["reproduce"],
        part: ["reproducing", "reproduced"],
        adv: [],
      },
      answer: "reproducible",
    },

    {
      no: 20,
      sentence:
        "Scientific research begins with a proposed explanation. A hypothesis must be testable and supported by observable data.",
      targetWord: "hypothesis",
      prefixLen: 3,
      subject: "biology",
      meaning: "가설",
      synonyms: ["testable explanation", "scientific assumption"],
      forms: {
        noun: ["hypothesis", "hypotheses"],
        adj: ["hypothetical"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "hypothesis",
    },

    {
      no: 21,
      sentence:
        "Many animals blend into their surroundings to avoid detection. This camouflage protects them from predators.",
      targetWord: "camouflage",
      prefixLen: 3,
      subject: "biology",
      meaning: "위장",
      synonyms: ["concealment", "protective coloration"],
      forms: {
        noun: ["camouflage"],
        verb: ["camouflage"],
        part: ["camouflaging", "camouflaged"],
        adj: ["camouflaged"],
        adv: [],
      },
      answer: "camouflage",
    },

    {
      no: 22,
      sentence:
        "Energy in an ecosystem originates with organisms that produce their own food. A producer converts sunlight into chemical energy.",
      targetWord: "producer",
      prefixLen: 3,
      subject: "biology",
      meaning: "생산자",
      synonyms: ["autotroph", "primary producer"],
      forms: {
        noun: ["producer", "production"],
        verb: ["produce"],
        part: ["producing", "produced"],
        adj: ["productive"],
        adv: [],
      },
      answer: "producer",
    },

    {
      no: 23,
      sentence:
        "Dead organic matter does not simply disappear. A decomposer breaks it down and returns nutrients to the soil.",
      targetWord: "decomposer",
      prefixLen: 4,
      subject: "biology",
      meaning: "분해자",
      synonyms: ["nutrient recycler", "decay organism"],
      forms: {
        noun: ["decomposer", "decomposition"],
        verb: ["decompose"],
        part: ["decomposing", "decomposed"],
        adj: [],
        adv: [],
      },
      answer: "decomposer",
    },

    {
      no: 24,
      sentence:
        "Every habitat can support only a limited number of individuals. When carrying capacity is exceeded, population decline often follows.",
      targetWord: "capacity",
      prefixLen: 3,
      subject: "biology",
      meaning: "수용력",
      synonyms: ["limit", "maximum support level"],
      forms: {
        noun: ["capacity"],
        adj: ["capable"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "capacity",
    },

    {
      no: 25,
      sentence:
        "Different forms of a gene may produce slightly different traits. Each allele contributes to genetic diversity within a population.",
      targetWord: "allele",
      prefixLen: 2,
      subject: "biology",
      meaning: "대립유전자",
      synonyms: ["gene variant", "gene form"],
      forms: {
        noun: ["allele"],
        adj: ["allelic"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "allele",
    },

    {
      no: 26,
      sentence:
        "Water naturally moves across membranes to equalize concentration differences. This movement is called osmosis.",
      targetWord: "osmosis",
      prefixLen: 3,
      subject: "biology",
      meaning: "삼투",
      synonyms: ["water diffusion", "membrane water transfer"],
      forms: {
        noun: ["osmosis"],
        adj: ["osmotic"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "osmosis",
    },

    {
      no: 27,
      sentence:
        "Non-native species sometimes spread aggressively in new environments. An invasive organism can disrupt ecological balance.",
      targetWord: "invasive",
      prefixLen: 3,
      subject: "biology",
      meaning: "침입성의",
      synonyms: ["ecologically disruptive", "aggressively spreading"],
      forms: {
        noun: ["invasion"],
        adj: ["invasive"],
        verb: ["invade"],
        part: ["invading", "invaded"],
        adv: [],
      },
      answer: "invasive",
    },

    {
      no: 28,
      sentence:
        "When populations become separated, gene flow may stop between them. Genetic isolation can eventually lead to speciation.",
      targetWord: "isolation",
      prefixLen: 4,
      subject: "biology",
      meaning: "고립",
      synonyms: ["separation", "restricted gene flow"],
      forms: {
        noun: ["isolation"],
        adj: ["isolated"],
        verb: ["isolate"],
        part: ["isolating", "isolated"],
        adv: [],
      },
      answer: "isolation",
    },

    {
      no: 29,
      sentence:
        "Some birds travel thousands of kilometers each year. This seasonal migration ensures access to food and breeding grounds.",
      targetWord: "migration",
      prefixLen: 3,
      subject: "biology",
      meaning: "이주",
      synonyms: ["seasonal movement", "long-distance relocation"],
      forms: {
        noun: ["migration"],
        verb: ["migrate"],
        part: ["migrating", "migrated"],
        adj: ["migratory"],
        adv: [],
      },
      answer: "migration",
    },

    {
      no: 30,
      sentence:
        "Researchers collect samples for careful observation. Each specimen is examined under a microscope to study cellular structure.",
      targetWord: "specimen",
      prefixLen: 3,
      subject: "biology",
      meaning: "표본",
      synonyms: ["sample", "test subject"],
      forms: {
        noun: ["specimen"],
        adj: [],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "specimen",
    },

  ]),
};