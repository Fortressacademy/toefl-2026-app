// src/data/reading/geology.js
// CTW · Geology (2-sentence TOEFL-style context)

const shuffleArray = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const ctw_geo = {
  id: "ctw_geo",
  title: "Complete the Words · Geology",
  total: 30,
  items: shuffleArray([

    {
      no: 1,
      sentence:
        "The Earth's surface is divided into large moving sections. Each tectonic plate shifts slowly over millions of years.",
      targetWord: "tectonic",
      prefixLen: 3,
      subject: "geology",
      meaning: "지각 변동의",
      synonyms: ["structural", "plate-related"],
      forms: {
        noun: ["tectonics"],
        adj: ["tectonic"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "tectonic",
    },

    {
      no: 2,
      sentence:
        "When two plates collide, one may slide beneath the other. This process is called subduction.",
      targetWord: "subduction",
      prefixLen: 3,
      subject: "geology",
      meaning: "섭입",
      synonyms: ["plate sinking", "crustal descent"],
      forms: {
        noun: ["subduction"],
        adj: ["subducted"],
        verb: ["subduct"],
        part: ["subducting", "subducted"],
        adv: [],
      },
      answer: "subduction",
    },

    {
      no: 3,
      sentence:
        "A sudden release of energy along a fault can shake the ground violently. This event is known as an earthquake.",
      targetWord: "earthquake",
      prefixLen: 5,
      subject: "geology",
      meaning: "지진",
      synonyms: ["seismic event", "ground tremor"],
      forms: {
        noun: ["earthquake"],
        adj: ["seismic"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "earthquake",
    },

    {
      no: 4,
      sentence:
        "Molten rock beneath the Earth's surface is extremely hot. When it erupts, magma becomes lava.",
      targetWord: "magma",
      prefixLen: 3,
      subject: "geology",
      meaning: "마그마",
      synonyms: ["molten rock", "subsurface melt"],
      forms: {
        noun: ["magma"],
        adj: ["magmatic"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "magma",
    },

    {
      no: 5,
      sentence:
        "Wind, water, and ice gradually break down rocks over time. This process is known as weathering.",
      targetWord: "weathering",
      prefixLen: 4,
      subject: "geology",
      meaning: "풍화",
      synonyms: ["rock breakdown", "surface decay"],
      forms: {
        noun: ["weathering"],
        verb: ["weather"],
        part: ["weathered", "weathering"],
        adj: [],
        adv: [],
      },
      answer: "weathering",
    },

    {
      no: 6,
      sentence:
        "Running water carries loose material away from its original location. This removal process is called erosion.",
      targetWord: "erosion",
      prefixLen: 3,
      subject: "geology",
      meaning: "침식",
      synonyms: ["material removal", "surface wearing"],
      forms: {
        noun: ["erosion"],
        adj: ["erosive"],
        verb: ["erode"],
        part: ["eroding", "eroded"],
        adv: [],
      },
      answer: "erosion",
    },

    {
      no: 7,
      sentence:
        "Layered rock formations preserve evidence of past environments. These horizontal layers are known as strata.",
      targetWord: "strata",
      prefixLen: 3,
      subject: "geology",
      meaning: "지층(복수)",
      synonyms: ["rock layers", "geological layers"],
      forms: {
        noun: ["stratum", "strata"],
        adj: ["stratified"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "strata",
    },

    {
      no: 8,
      sentence:
        "Some rocks form from cooled molten material. These are classified as igneous rocks.",
      targetWord: "igneous",
      prefixLen: 3,
      subject: "geology",
      meaning: "화성암의",
      synonyms: ["volcanic-origin", "magma-formed"],
      forms: {
        noun: [],
        adj: ["igneous"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "igneous",
    },

    {
      no: 9,
      sentence:
        "Other rocks develop from accumulated sediments. Such rocks are called sedimentary.",
      targetWord: "sedimentary",
      prefixLen: 4,
      subject: "geology",
      meaning: "퇴적암의",
      synonyms: ["layered rock type", "deposit-based"],
      forms: {
        noun: ["sediment"],
        adj: ["sedimentary"],
        verb: ["sediment"],
        part: [],
        adv: [],
      },
      answer: "sedimentary",
    },

    {
      no: 10,
      sentence:
        "Extreme heat and pressure can transform existing rock types. The result is a metamorphic rock.",
      targetWord: "metamorphic",
      prefixLen: 5,
      subject: "geology",
      meaning: "변성암의",
      synonyms: ["pressure-altered", "heat-transformed"],
      forms: {
        noun: ["metamorphism"],
        adj: ["metamorphic"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "metamorphic",
    },

    // --- 계속 11~30 ---

    {
      no: 11,
      sentence:
        "Ice sheets can reshape entire landscapes. A glacier moves slowly but has enormous erosive power.",
      targetWord: "glacier",
      prefixLen: 3,
      subject: "geology",
      meaning: "빙하",
      synonyms: ["ice mass", "moving ice sheet"],
      forms: {
        noun: ["glacier"],
        adj: ["glacial"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "glacier",
    },

    {
      no: 12,
      sentence:
        "Minerals are naturally occurring inorganic substances. Each mineral has a specific crystal structure.",
      targetWord: "mineral",
      prefixLen: 3,
      subject: "geology",
      meaning: "광물",
      synonyms: ["natural solid", "inorganic compound"],
      forms: {
        noun: ["mineral"],
        adj: ["mineralogical"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "mineral",
    },

    {
      no: 13,
      sentence:
        "Rock fragments transported by wind or water eventually settle. This process of deposition forms new landforms.",
      targetWord: "deposition",
      prefixLen: 4,
      subject: "geology",
      meaning: "퇴적",
      synonyms: ["settling process", "sediment accumulation"],
      forms: {
        noun: ["deposition"],
        verb: ["deposit"],
        part: ["depositing", "deposited"],
        adj: [],
        adv: [],
      },
      answer: "deposition",
    },

    {
      no: 14,
      sentence:
        "The outermost layer of the Earth is relatively thin. This layer is known as the crust.",
      targetWord: "crust",
      prefixLen: 2,
      subject: "geology",
      meaning: "지각",
      synonyms: ["outer layer", "surface layer"],
      forms: {
        noun: ["crust"],
        adj: [],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "crust",
    },

    {
      no: 15,
      sentence:
        "Beneath the crust lies a thick region of semi-solid rock. This zone is called the mantle.",
      targetWord: "mantle",
      prefixLen: 3,
      subject: "geology",
      meaning: "맨틀",
      synonyms: ["middle layer", "sub-crust layer"],
      forms: {
        noun: ["mantle"],
        adj: [],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "mantle",
    },

    {
      no: 16,
      sentence:
        "Fossils provide clues about ancient life forms. They are preserved remains found within sedimentary rock.",
      targetWord: "fossil",
      prefixLen: 3,
      subject: "geology",
      meaning: "화석",
      synonyms: ["preserved remains", "ancient imprint"],
      forms: {
        noun: ["fossil"],
        adj: ["fossilized"],
        verb: ["fossilize"],
        part: ["fossilizing", "fossilized"],
        adv: [],
      },
      answer: "fossil",
    },

    {
      no: 17,
      sentence:
        "Large cracks in the Earth's crust can separate tectonic plates. Such fractures are called rifts.",
      targetWord: "rift",
      prefixLen: 2,
      subject: "geology",
      meaning: "열곡",
      synonyms: ["crack", "fracture zone"],
      forms: {
        noun: ["rift"],
        verb: ["rift"],
        part: [],
        adj: [],
        adv: [],
      },
      answer: "rift",
    },

    {
      no: 18,
      sentence:
        "Some geological forces push land upward. This slow rise of Earth's surface is called uplift.",
      targetWord: "uplift",
      prefixLen: 2,
      subject: "geology",
      meaning: "융기",
      synonyms: ["elevation rise", "surface raising"],
      forms: {
        noun: ["uplift"],
        verb: ["uplift"],
        part: ["uplifted"],
        adj: [],
        adv: [],
      },
      answer: "uplift",
    },

    {
      no: 19,
      sentence:
        "Rain and snow fall from the atmosphere to the ground. This water input is called precipitation.",
      targetWord: "precipitation",
      prefixLen: 4,
      subject: "geology",
      meaning: "강수",
      synonyms: ["rainfall", "water fall"],
      forms: {
        noun: ["precipitation"],
        verb: ["precipitate"],
        part: [],
        adj: [],
        adv: [],
      },
      answer: "precipitation",
    },

    {
      no: 20,
      sentence:
        "The lithosphere includes the crust and uppermost mantle. It forms the rigid outer shell of the Earth.",
      targetWord: "lithosphere",
      prefixLen: 4,
      subject: "geology",
      meaning: "암석권",
      synonyms: ["rigid outer layer", "crustal shell"],
      forms: {
        noun: ["lithosphere"],
        adj: [],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "lithosphere",
    },

    {
      no: 21,
      sentence:
        "Beneath the lithosphere lies a softer layer. This region is known as the asthenosphere.",
      targetWord: "asthenosphere",
      prefixLen: 5,
      subject: "geology",
      meaning: "연약권",
      synonyms: ["semi-fluid layer", "plastic mantle zone"],
      forms: {
        noun: ["asthenosphere"],
        adj: [],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "asthenosphere",
    },

    {
      no: 22,
      sentence:
        "Molten rock expelled during eruptions flows across the surface. Once outside the volcano, it is called lava.",
      targetWord: "lava",
      prefixLen: 2,
      subject: "geology",
      meaning: "용암",
      synonyms: ["surface magma", "molten surface rock"],
      forms: {
        noun: ["lava"],
        adj: ["lavic"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "lava",
    },

    {
      no: 23,
      sentence:
        "The Earth's innermost region is extremely hot and dense. This central part is known as the core.",
      targetWord: "core",
      prefixLen: 2,
      subject: "geology",
      meaning: "핵",
      synonyms: ["central region", "inner layer"],
      forms: {
        noun: ["core"],
        adj: ["core-related"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "core",
    },

    {
      no: 24,
      sentence:
        "A fracture in rock where movement has occurred is called a fault. Many earthquakes originate along such structures.",
      targetWord: "fault",
      prefixLen: 2,
      subject: "geology",
      meaning: "단층",
      synonyms: ["fracture line", "crustal break"],
      forms: {
        noun: ["fault"],
        verb: [],
        part: [],
        adj: ["faulted"],
        adv: [],
      },
      answer: "fault",
    },

    {
      no: 25,
      sentence:
        "Wind erosion can create dramatic landforms. Such erosive forces gradually reshape landscapes.",
      targetWord: "erosive",
      prefixLen: 3,
      subject: "geology",
      meaning: "침식성의",
      synonyms: ["wearing force", "surface cutting"],
      forms: {
        noun: ["erosion"],
        adj: ["erosive"],
        verb: ["erode"],
        part: [],
        adv: [],
      },
      answer: "erosive",
    },

    {
      no: 26,
      sentence:
        "Sediment accumulates in rivers and oceans. Over time, sediment forms layered rock.",
      targetWord: "sediment",
      prefixLen: 3,
      subject: "geology",
      meaning: "퇴적물",
      synonyms: ["rock fragments", "deposited material"],
      forms: {
        noun: ["sediment"],
        adj: ["sedimentary"],
        verb: ["sediment"],
        part: [],
        adv: [],
      },
      answer: "sediment",
    },

    {
      no: 27,
      sentence:
        "Crystals form when minerals solidify from cooling magma. Each crystal has an ordered internal structure.",
      targetWord: "crystal",
      prefixLen: 3,
      subject: "geology",
      meaning: "결정",
      synonyms: ["solid lattice", "mineral structure"],
      forms: {
        noun: ["crystal"],
        adj: ["crystalline"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "crystal",
    },

    {
      no: 28,
      sentence:
        "Volcanic activity can dramatically alter landscapes. Volcanic eruptions release ash and gases into the atmosphere.",
      targetWord: "volcanic",
      prefixLen: 4,
      subject: "geology",
      meaning: "화산의",
      synonyms: ["eruption-related", "magma-driven"],
      forms: {
        noun: ["volcano"],
        adj: ["volcanic"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "volcanic",
    },

    {
      no: 29,
      sentence:
        "Air pressure and temperature influence surface processes. These atmospheric conditions affect erosion and precipitation patterns.",
      targetWord: "atmospheric",
      prefixLen: 4,
      subject: "geology",
      meaning: "대기의",
      synonyms: ["air-related", "climatic"],
      forms: {
        noun: ["atmosphere"],
        adj: ["atmospheric"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "atmospheric",
    },

    {
      no: 30,
      sentence:
        "Sedimentary layers often preserve past climate data. Scientists study these layers to understand geological history.",
      targetWord: "layers",
      prefixLen: 2,
      subject: "geology",
      meaning: "층",
      synonyms: ["strata", "rock levels"],
      forms: {
        noun: ["layer"],
        adj: ["layered"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "layers",
    },

    

  ]),
};