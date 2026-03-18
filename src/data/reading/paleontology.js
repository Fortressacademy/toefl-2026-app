// src/data/reading/paleontology.js
// CTW · Paleontology (2-sentence TOEFL-style context)

const shuffleArray = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const ctw_paleo = {
  id: "ctw_paleo",
  title: "Complete the Words · Paleontology",
  total: 40,
  items: shuffleArray([
    {
      no: 1,
      sentence:
        "Researchers uncovered a well-preserved skeleton embedded in rock. The remains provide a valuable fossil record of ancient life.",
      targetWord: "fossil",
      prefixLen: 2,
      subject: "paleontology",
      meaning: "화석",
      synonyms: ["fossilized remain", "ancient remain"],
      forms: {
        noun: ["fossil", "fossils"],
        adj: ["fossilized"],
        verb: ["fossilize"],
        part: ["fossilizing", "fossilized"],
        adv: [],
      },
      answer: "fossil",
    },

    {
      no: 2,
      sentence:
        "Fine particles settle at the bottom of lakes and seas over time. This loose material is called sediment and can later harden into rock.",
      targetWord: "sediment",
      prefixLen: 3,
      subject: "paleontology",
      meaning: "퇴적물",
      synonyms: ["deposited material", "settled particles"],
      forms: {
        noun: ["sediment"],
        adj: ["sedimentary"],
        verb: ["sediment"],
        part: ["sedimented", "sedimenting"],
        adv: [],
      },
      answer: "sediment",
    },

    {
      no: 3,
      sentence:
        "Layers of sand and mud can become rock after long periods of pressure. Such rock is known as sedimentary rock and often contains fossils.",
      targetWord: "sedimentary rock",
      prefixLen: 4,
      subject: "paleontology",
      meaning: "퇴적암",
      synonyms: ["layered rock", "depositional rock"],
      forms: {
        noun: ["sedimentary rock", "sedimentary rocks"],
        adj: ["sedimentary"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "sedimentary rock",
    },

    {
      no: 4,
      sentence:
        "Geologists read Earth's history by examining stacked layers in cliffs. These layers are called strata, and each stratum can represent a different time period.",
      targetWord: "strata",
      prefixLen: 2,
      subject: "paleontology",
      meaning: "지층 (단수: stratum)",
      synonyms: ["rock layers", "geologic layers"],
      forms: {
        noun: ["stratum", "strata"],
        adj: ["stratified"],
        verb: ["stratify"],
        part: ["stratifying", "stratified"],
        adv: [],
      },
      answer: "strata",
    },

    {
      no: 5,
      sentence:
        "Many species disappeared suddenly from the fossil record at the boundary layer. This disappearance is referred to as extinction and can reshape ecosystems.",
      targetWord: "extinction",
      prefixLen: 3,
      subject: "paleontology",
      meaning: "멸종",
      synonyms: ["species loss", "die-off"],
      forms: {
        noun: ["extinction"],
        adj: ["extinct"],
        verb: ["extinguish"],
        part: ["extinguished", "extinguishing"],
        adv: [],
      },
      answer: "extinction",
    },

    {
      no: 6,
      sentence:
        "Over many generations, traits can become more common if they improve survival. This gradual change in populations is called evolution.",
      targetWord: "evolution",
      prefixLen: 3,
      subject: "paleontology",
      meaning: "진화",
      synonyms: ["biological change", "adaptive change"],
      forms: {
        noun: ["evolution"],
        adj: ["evolutionary"],
        verb: ["evolve"],
        part: ["evolving", "evolved"],
        adv: [],
      },
      answer: "evolution",
    },

    {
      no: 7,
      sentence:
        "Biologists classify living things based on shared characteristics. A species is a group that can typically reproduce and produce fertile offspring.",
      targetWord: "species",
      prefixLen: 3,
      subject: "paleontology",
      meaning: "종",
      synonyms: ["biological group", "taxonomic unit"],
      forms: {
        noun: ["species"],
        adj: ["specific"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "species",
    },

    {
      no: 8,
      sentence:
        "DNA comparisons can reveal how closely related two animals are. A shared ancestor indicates that their lineages diverged from a common origin.",
      targetWord: "ancestor",
      prefixLen: 3,
      subject: "paleontology",
      meaning: "조상",
      synonyms: ["forebear", "common predecessor"],
      forms: {
        noun: ["ancestor", "ancestors", "ancestry"],
        adj: ["ancestral"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "ancestor",
    },

    {
      no: 9,
      sentence:
        "Microscopic life can leave behind chemical signatures in rocks. Even a tiny organism can provide clues about ancient environments.",
      targetWord: "organism",
      prefixLen: 3,
      subject: "paleontology",
      meaning: "생물",
      synonyms: ["living thing", "biological entity"],
      forms: {
        noun: ["organism", "organisms"],
        adj: ["organic"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "organism",
    },

    {
      no: 10,
      sentence:
        "Earth’s history is divided into large time blocks such as the Mesozoic and Cenozoic. Each block is a geological era defined by major changes in life and climate.",
      targetWord: "geological era",
      prefixLen: 4,
      subject: "paleontology",
      meaning: "지질 시대",
      synonyms: ["geologic time period", "major time division"],
      forms: {
        noun: ["geological era", "geological eras", "era", "eras"],
        adj: ["geological"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "geological era",
    },

    {
      no: 11,
      sentence:
        "A body may survive long enough to be studied if conditions prevent rapid decay. This protection of remains is called preservation.",
      targetWord: "preservation",
      prefixLen: 4,
      subject: "paleontology",
      meaning: "보존",
      synonyms: ["protection", "keeping intact"],
      forms: {
        noun: ["preservation"],
        adj: ["preserved", "preservable"],
        verb: ["preserve"],
        part: ["preserving", "preserved"],
        adv: [],
      },
      answer: "preservation",
    },

    {
      no: 12,
      sentence:
        "Soft tissues rarely remain, but they can leave patterns in surrounding material. An imprint can capture the outline of leaves, shells, or skin textures.",
      targetWord: "imprint",
      prefixLen: 2,
      subject: "paleontology",
      meaning: "흔적",
      synonyms: ["impression", "mark"],
      forms: {
        noun: ["imprint", "imprints", "impression", "impressions"],
        adj: ["imprinted"],
        verb: ["imprint"],
        part: ["imprinting", "imprinted"],
        adv: [],
      },
      answer: "imprint",
    },

    {
      no: 13,
      sentence:
        "Some fossils do not preserve the body itself but record behavior. A trace fossil might show footprints, burrows, or feeding marks.",
      targetWord: "trace fossil",
      prefixLen: 4,
      subject: "paleontology",
      meaning: "흔적 화석",
      synonyms: ["behavioral fossil", "activity evidence"],
      forms: {
        noun: ["trace fossil", "trace fossils"],
        adj: ["trace"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "trace fossil",
    },

    {
      no: 14,
      sentence:
        "Minerals dissolved in water can replace organic material cell by cell. This process is called mineralization and can preserve fine structural details.",
      targetWord: "mineralization",
      prefixLen: 5,
      subject: "paleontology",
      meaning: "광물화 작용",
      synonyms: ["mineral replacement", "petrification process"],
      forms: {
        noun: ["mineralization"],
        adj: ["mineralized"],
        verb: ["mineralize"],
        part: ["mineralizing", "mineralized"],
        adv: [],
      },
      answer: "mineralization",
    },

    {
      no: 15,
      sentence:
        "Bacteria and fungi break down dead tissue quickly under normal conditions. This chemical and biological breakdown is called decomposition.",
      targetWord: "decomposition",
      prefixLen: 4,
      subject: "paleontology",
      meaning: "분해",
      synonyms: ["decay", "breakdown"],
      forms: {
        noun: ["decomposition"],
        adj: ["decomposed", "decomposing"],
        verb: ["decompose"],
        part: ["decomposing", "decomposed"],
        adv: [],
      },
      answer: "decomposition",
    },

    {
      no: 16,
      sentence:
        "Rapid coverage by mud or ash can shield remains from scavengers and oxygen. This quick covering is known as burial and increases fossilization chances.",
      targetWord: "burial",
      prefixLen: 3,
      subject: "paleontology",
      meaning: "매몰",
      synonyms: ["entombment", "rapid covering"],
      forms: {
        noun: ["burial"],
        adj: ["buried"],
        verb: ["bury"],
        part: ["burying", "buried"],
        adv: [],
      },
      answer: "burial",
    },

    {
      no: 17,
      sentence:
        "Field teams carefully remove rock to expose bones without damaging them. This controlled digging process is called excavation.",
      targetWord: "excavation",
      prefixLen: 4,
      subject: "paleontology",
      meaning: "발굴",
      synonyms: ["systematic digging", "site unearthing"],
      forms: {
        noun: ["excavation"],
        adj: ["excavated"],
        verb: ["excavate"],
        part: ["excavating", "excavated"],
        adv: [],
      },
      answer: "excavation",
    },

    {
      no: 18,
      sentence:
        "Wind and water can gradually wear away cliffs and riverbanks. This wearing-down process is called erosion and can expose fossils at the surface.",
      targetWord: "erosion",
      prefixLen: 3,
      subject: "paleontology",
      meaning: "침식",
      synonyms: ["wearing away", "surface loss"],
      forms: {
        noun: ["erosion"],
        adj: ["erosional", "eroded"],
        verb: ["erode"],
        part: ["eroding", "eroded"],
        adv: [],
      },
      answer: "erosion",
    },

    {
      no: 19,
      sentence:
        "Rivers slow down as they enter lakes, dropping sand and silt. This settling of material is called deposition and forms new layers over time.",
      targetWord: "deposition",
      prefixLen: 4,
      subject: "paleontology",
      meaning: "퇴적",
      synonyms: ["sediment laying", "material settling"],
      forms: {
        noun: ["deposition"],
        adj: ["depositional"],
        verb: ["deposit"],
        part: ["depositing", "deposited"],
        adv: [],
      },
      answer: "deposition",
    },

    {
      no: 20,
      sentence:
        "As more layers accumulate, the weight above squeezes lower sediments. This squeezing is called compression and can flatten organisms into thin fossils.",
      targetWord: "compression",
      prefixLen: 4,
      subject: "paleontology",
      meaning: "압축",
      synonyms: ["compaction", "pressure squeezing"],
      forms: {
        noun: ["compression"],
        adj: ["compressed", "compressive"],
        verb: ["compress"],
        part: ["compressing", "compressed"],
        adv: [],
      },
      answer: "compression",
    },

    {
      no: 21,
      sentence:
        "Earth’s outer shell is broken into large moving slabs. Each slab is a tectonic plate, and collisions can build mountains and reshape habitats.",
      targetWord: "tectonic plate",
      prefixLen: 4,
      subject: "paleontology",
      meaning: "지각판",
      synonyms: ["crustal plate", "lithospheric plate"],
      forms: {
        noun: ["tectonic plate", "tectonic plates"],
        adj: ["tectonic"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "tectonic plate",
    },

    {
      no: 22,
      sentence:
        "Ash layers in rocks can serve as time markers for fossils below and above them. Such layers often come from volcanic activity that spreads material over wide regions.",
      targetWord: "volcanic activity",
      prefixLen: 4,
      subject: "paleontology",
      meaning: "화산 활동",
      synonyms: ["eruption events", "volcanism"],
      forms: {
        noun: ["volcanic activity"],
        adj: ["volcanic"],
        verb: ["erupt"],
        part: ["erupting", "erupted"],
        adv: [],
      },
      answer: "volcanic activity",
    },

    {
      no: 23,
      sentence:
        "Long-term records show repeated warming and cooling episodes. This pattern is called climate fluctuation and can shift which species thrive.",
      targetWord: "climate fluctuation",
      prefixLen: 4,
      subject: "paleontology",
      meaning: "기후 변동",
      synonyms: ["climate variability", "temperature swings"],
      forms: {
        noun: ["climate fluctuation", "climate fluctuations"],
        adj: ["climatic"],
        verb: ["fluctuate"],
        part: ["fluctuating", "fluctuated"],
        adv: [],
      },
      answer: "climate fluctuation",
    },

    {
      no: 24,
      sentence:
        "In some intervals, many unrelated groups vanish within a short span. Such an event is called a mass extinction and is often linked to global disruption.",
      targetWord: "mass extinction",
      prefixLen: 4,
      subject: "paleontology",
      meaning: "대멸종",
      synonyms: ["global die-off", "large-scale extinction"],
      forms: {
        noun: ["mass extinction", "mass extinctions"],
        adj: ["mass", "extinction-level"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "mass extinction",
    },

    {
      no: 25,
      sentence:
        "A large object striking Earth can inject dust into the atmosphere and cool the planet. Scientists call this kind of event an asteroid impact.",
      targetWord: "asteroid impact",
      prefixLen: 4,
      subject: "paleontology",
      meaning: "소행성 충돌",
      synonyms: ["space-rock collision", "bolide strike"],
      forms: {
        noun: ["asteroid impact", "asteroid impacts"],
        adj: ["asteroidal"],
        verb: ["impact"],
        part: ["impacting", "impacted"],
        adv: [],
      },
      answer: "asteroid impact",
    },

    {
      no: 26,
      sentence:
        "When oceans, atmosphere, and vegetation change together, ecosystems can reorganize rapidly. Scientists use the term environmental shift for these broad changes.",
      targetWord: "environmental shift",
      prefixLen: 4,
      subject: "paleontology",
      meaning: "환경 변화",
      synonyms: ["ecological change", "environmental transition"],
      forms: {
        noun: ["environmental shift", "environmental shifts"],
        adj: ["environmental"],
        verb: ["shift"],
        part: ["shifting", "shifted"],
        adv: [],
      },
      answer: "environmental shift",
    },

    {
      no: 27,
      sentence:
        "Animals rely on specific conditions for food, shelter, and breeding. This living environment is called a habitat, and even small changes can reduce survival.",
      targetWord: "habitat",
      prefixLen: 3,
      subject: "paleontology",
      meaning: "서식지",
      synonyms: ["living environment", "ecological home"],
      forms: {
        noun: ["habitat", "habitats"],
        adj: ["habitat-related"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "habitat",
    },

    {
      no: 28,
      sentence:
        "Populations can survive new conditions by developing useful traits over time. This process is called adaptation and may involve changes in behavior or body form.",
      targetWord: "adaptation",
      prefixLen: 3,
      subject: "paleontology",
      meaning: "적응",
      synonyms: ["adjustment", "adaptive change"],
      forms: {
        noun: ["adaptation", "adaptations"],
        adj: ["adaptive"],
        verb: ["adapt"],
        part: ["adapting", "adapted"],
        adv: [],
      },
      answer: "adaptation",
    },

    {
      no: 29,
      sentence:
        "After a crisis, surviving groups may split into many forms to exploit new opportunities. This increase in variety is called diversification.",
      targetWord: "diversification",
      prefixLen: 5,
      subject: "paleontology",
      meaning: "다양화",
      synonyms: ["branching out", "variety increase"],
      forms: {
        noun: ["diversification"],
        adj: ["diverse"],
        verb: ["diversify"],
        part: ["diversifying", "diversified"],
        adv: [],
      },
      answer: "diversification",
    },

    {
      no: 30,
      sentence:
        "When a lineage rapidly splits into many new species, the pattern is striking in the fossil record. Biologists call this burst biological radiation.",
      targetWord: "radiation",
      prefixLen: 3,
      subject: "paleontology",
      meaning: "방산 (종의 급격한 분화)",
      synonyms: ["adaptive radiation", "rapid diversification"],
      forms: {
        noun: ["radiation"],
        adj: ["radiative"],
        verb: ["radiate"],
        part: ["radiating", "radiated"],
        adv: [],
      },
      answer: "radiation",
    },

    {
      no: 31,
      sentence:
        "Animals with backbones include fish, reptiles, birds, and mammals. These animals are called vertebrates and show distinctive skeletal features.",
      targetWord: "vertebrate",
      prefixLen: 4,
      subject: "paleontology",
      meaning: "척추동물",
      synonyms: ["backboned animal", "spinal animal"],
      forms: {
        noun: ["vertebrate", "vertebrates"],
        adj: ["vertebrate"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "vertebrate",
    },

    {
      no: 32,
      sentence:
        "Many animals lack a backbone, including insects and mollusks. Such animals are called invertebrates and make up most animal diversity.",
      targetWord: "invertebrate",
      prefixLen: 4,
      subject: "paleontology",
      meaning: "무척추동물",
      synonyms: ["non-backboned animal", "backbone-less animal"],
      forms: {
        noun: ["invertebrate", "invertebrates"],
        adj: ["invertebrate"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "invertebrate",
    },

    {
      no: 33,
      sentence:
        "Fossils can reveal how bones were arranged and how muscles attached. This overall framework is the skeletal structure, which helps identify movement and lifestyle.",
      targetWord: "skeletal structure",
      prefixLen: 4,
      subject: "paleontology",
      meaning: "골격 구조",
      synonyms: ["bone framework", "skeleton layout"],
      forms: {
        noun: ["skeletal structure", "skeletal structures"],
        adj: ["skeletal"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "skeletal structure",
    },

    {
      no: 34,
      sentence:
        "Scientists compare shapes of bones, teeth, and shells across species. This study of form is called morphology and can reveal hidden relationships.",
      targetWord: "morphology",
      prefixLen: 4,
      subject: "paleontology",
      meaning: "형태학",
      synonyms: ["study of form", "shape analysis"],
      forms: {
        noun: ["morphology"],
        adj: ["morphological"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "morphology",
    },

    {
      no: 35,
      sentence:
        "A single trait—like a specialized tooth—can indicate diet and behavior. Such a trait is an anatomical feature that researchers use to classify fossils.",
      targetWord: "anatomical feature",
      prefixLen: 4,
      subject: "paleontology",
      meaning: "해부학적 특징",
      synonyms: ["structural trait", "body characteristic"],
      forms: {
        noun: ["anatomical feature", "anatomical features", "feature", "features"],
        adj: ["anatomical"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "anatomical feature",
    },

    {
      no: 36,
      sentence:
        "Some animals are adapted to hunt and capture other animals for food. Such animals are described as predatory, often showing sharp teeth or claws.",
      targetWord: "predatory",
      prefixLen: 3,
      subject: "paleontology",
      meaning: "포식성의",
      synonyms: ["hunting", "prey-catching"],
      forms: {
        noun: ["predator", "predators", "predation"],
        adj: ["predatory"],
        verb: ["prey"],
        part: ["preying"],
        adv: [],
      },
      answer: "predatory",
    },

    {
      no: 37,
      sentence:
        "Tooth shape can suggest whether an animal ate plants or meat. Animals that primarily eat plants are herbivorous and often have broad grinding teeth.",
      targetWord: "herbivorous",
      prefixLen: 4,
      subject: "paleontology",
      meaning: "초식성의",
      synonyms: ["plant-eating", "vegetation-feeding"],
      forms: {
        noun: ["herbivore", "herbivores", "herbivory"],
        adj: ["herbivorous"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "herbivorous",
    },

    {
      no: 38,
      sentence:
        "Some animals evolved teeth designed for slicing flesh rather than grinding plants. These animals are carnivorous and tend to occupy higher trophic levels.",
      targetWord: "carnivorous",
      prefixLen: 4,
      subject: "paleontology",
      meaning: "육식성의",
      synonyms: ["meat-eating", "flesh-feeding"],
      forms: {
        noun: ["carnivore", "carnivores", "carnivory"],
        adj: ["carnivorous"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "carnivorous",
    },

    {
      no: 39,
      sentence:
        "Some species lived primarily on land rather than in water. Scientists describe land-dwelling life as terrestrial, including many reptiles and mammals.",
      targetWord: "terrestrial",
      prefixLen: 3,
      subject: "paleontology",
      meaning: "육상의",
      synonyms: ["land-based", "on land"],
      forms: {
        noun: ["land", "terra"],
        adj: ["terrestrial"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "terrestrial",
    },

    {
      no: 40,
      sentence:
        "Other species evolved in oceans and coastal waters, leaving shells and bones in seabeds. Scientists describe such environments and organisms as marine.",
      targetWord: "marine",
      prefixLen: 3,
      subject: "paleontology",
      meaning: "해양의",
      synonyms: ["oceanic", "sea-dwelling"],
      forms: {
        noun: ["marine environment", "marine life"],
        adj: ["marine"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "marine",
    },
  ]),
};