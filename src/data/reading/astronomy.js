// src/data/reading/astronomy.js
// CTW · Astronomy (2-sentence TOEFL-style context)

const shuffleArray = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const ctw_astro = {
  id: "ctw_astro",
  title: "Complete the Words · Astronomy",
  total: 30,
  items: shuffleArray([

    {
      no: 1,
      sentence:
        "Scientists believe the universe began approximately 13.8 billion years ago. The Big Bang marks the origin of space, time, and matter.",
      targetWord: "Big Bang",
      prefixLen: 3,
      subject: "astronomy",
      meaning: "빅뱅",
      synonyms: ["cosmic origin event", "universal beginning"],
      forms: {
        noun: ["Big Bang"],
        adj: [],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "Big Bang",
    },

    {
      no: 2,
      sentence:
        "Light from distant galaxies shifts toward longer wavelengths. This phenomenon is called redshift and suggests cosmic expansion.",
      targetWord: "redshift",
      prefixLen: 3,
      subject: "astronomy",
      meaning: "적색편이",
      synonyms: ["wavelength shift", "cosmic stretching"],
      forms: {
        noun: ["redshift"],
        adj: [],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "redshift",
    },

    {
      no: 3,
      sentence:
        "Stars produce energy deep within their cores. This energy is generated through nuclear fusion.",
      targetWord: "nuclear fusion",
      prefixLen: 3,
      subject: "astronomy",
      meaning: "핵융합",
      synonyms: ["atomic fusion", "stellar reaction"],
      forms: {
        noun: ["nuclear fusion"],
        adj: [],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "nuclear fusion",
    },

    {
      no: 4,
      sentence:
        "A massive star may explode violently at the end of its life. This powerful explosion is known as a supernova.",
      targetWord: "supernova",
      prefixLen: 3,
      subject: "astronomy",
      meaning: "초신성",
      synonyms: ["stellar explosion", "starburst event"],
      forms: {
        noun: ["supernova"],
        adj: [],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "supernova",
    },

    {
      no: 5,
      sentence:
        "A vast system of stars, gas, and dust forms a galaxy. Our home galaxy is called the Milky Way.",
      targetWord: "Milky Way",
      prefixLen: 2,
      subject: "astronomy",
      meaning: "은하수",
      synonyms: ["our galaxy", "local galaxy"],
      forms: {
        noun: ["Milky Way"],
        adj: [],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "Milky Way",
    },

    {
      no: 6,
      sentence:
        "Some matter in the universe does not emit light. Scientists refer to this invisible substance as dark matter.",
      targetWord: "dark matter",
      prefixLen: 4,
      subject: "astronomy",
      meaning: "암흑물질",
      synonyms: ["invisible mass", "non-luminous matter"],
      forms: {
        noun: ["dark matter"],
        adj: [],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "dark matter",
    },

    {
      no: 7,
      sentence:
        "Objects in space move along curved paths due to gravitational forces. This path is called an orbit.",
      targetWord: "orbit",
      prefixLen: 2,
      subject: "astronomy",
      meaning: "궤도",
      synonyms: ["celestial path", "rotational trajectory"],
      forms: {
        noun: ["orbit"],
        verb: ["orbit"],
        part: ["orbiting"],
        adj: [],
        adv: [],
      },
      answer: "orbit",
    },

    {
      no: 8,
      sentence:
        "When massive stars collapse under gravity, they may form black holes. A black hole has such strong gravity that not even light can escape.",
      targetWord: "black hole",
      prefixLen: 5,
      subject: "astronomy",
      meaning: "블랙홀",
      synonyms: ["gravitational singularity", "collapsed star core"],
      forms: {
        noun: ["black hole"],
        adj: [],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "black hole",
    },

    {
      no: 9,
      sentence:
        "Gas and dust clouds in space often give birth to new stars. These colorful regions are called nebulae.",
      targetWord: "nebula",
      prefixLen: 3,
      subject: "astronomy",
      meaning: "성운",
      synonyms: ["stellar nursery", "gas cloud"],
      forms: {
        noun: ["nebula", "nebulae"],
        adj: ["nebular"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "nebula",
    },

    {
      no: 10,
      sentence:
        "Some stars end their lives as dense remnants. A white dwarf is one such stellar remnant.",
      targetWord: "white dwarf",
      prefixLen: 3,
      subject: "astronomy",
      meaning: "백색왜성",
      synonyms: ["stellar remnant", "compact star"],
      forms: {
        noun: ["white dwarf"],
        adj: [],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "white dwarf",
    },

    // 계속 11~30

    {
      no: 11,
      sentence:
        "The universe continues to grow larger over time. This gradual increase in size is known as expansion.",
      targetWord: "expansion",
      prefixLen: 3,
      subject: "astronomy",
      meaning: "팽창",
      synonyms: ["cosmic growth", "spatial increase"],
      forms: {
        noun: ["expansion"],
        adj: ["expanding"],
        verb: ["expand"],
        part: ["expanded"],
        adv: [],
      },
      answer: "expansion",
    },

    {
      no: 12,
      sentence:
        "Energy travels through space in the form of waves or particles. This energy emission is called radiation.",
      targetWord: "radiation",
      prefixLen: 3,
      subject: "astronomy",
      meaning: "복사",
      synonyms: ["energy emission", "wave emission"],
      forms: {
        noun: ["radiation"],
        adj: ["radiative"],
        verb: ["radiate"],
        part: ["radiating"],
        adv: [],
      },
      answer: "radiation",
    },

    {
      no: 13,
      sentence:
        "Large groups of galaxies can cluster together. A galaxy cluster contains hundreds or even thousands of galaxies.",
      targetWord: "cluster",
      prefixLen: 3,
      subject: "astronomy",
      meaning: "집단",
      synonyms: ["grouping", "cosmic assembly"],
      forms: {
        noun: ["cluster"],
        verb: ["cluster"],
        part: ["clustering"],
        adj: [],
        adv: [],
      },
      answer: "cluster",
    },

    {
      no: 14,
      sentence:
        "Some galaxies have a spiral structure with curved arms. These are known as spiral galaxies.",
      targetWord: "spiral galaxy",
      prefixLen: 3,
      subject: "astronomy",
      meaning: "나선은하",
      synonyms: ["arm-shaped galaxy"],
      forms: {
        noun: ["spiral galaxy"],
        adj: [],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "spiral galaxy",
    },

    {
      no: 15,
      sentence:
        "Other galaxies appear more rounded in shape. These are called elliptical galaxies.",
      targetWord: "elliptical galaxy",
      prefixLen: 3,
      subject: "astronomy",
      meaning: "타원은하",
      synonyms: ["oval galaxy"],
      forms: {
        noun: ["elliptical galaxy"],
        adj: [],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "elliptical galaxy",
    },

    {
      no: 16,
      sentence:
        "Small rocky objects orbit the Sun. These objects are known as asteroids.",
      targetWord: "asteroid",
      prefixLen: 3,
      subject: "astronomy",
      meaning: "소행성",
      synonyms: ["minor planet", "space rock"],
      forms: {
        noun: ["asteroid"],
        adj: [],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "asteroid",
    },

    {
      no: 17,
      sentence:
        "Some icy bodies travel in elongated orbits. A comet develops a glowing tail when near the Sun.",
      targetWord: "comet",
      prefixLen: 2,
      subject: "astronomy",
      meaning: "혜성",
      synonyms: ["icy traveler"],
      forms: {
        noun: ["comet"],
        adj: [],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "comet",
    },

    {
      no: 18,
      sentence:
        "When small space debris enters Earth's atmosphere, it burns brightly. This streak of light is called a meteor.",
      targetWord: "meteor",
      prefixLen: 3,
      subject: "astronomy",
      meaning: "유성",
      synonyms: ["shooting star"],
      forms: {
        noun: ["meteor"],
        adj: [],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "meteor",
    },

    {
      no: 19,
      sentence:
        "Natural bodies that revolve around planets are called satellites. The Moon is Earth's natural satellite.",
      targetWord: "satellites",
      prefixLen: 3,
      subject: "astronomy",
      meaning: "위성",
      synonyms: ["orbiting body"],
      forms: {
        noun: ["satellite"],
        adj: [],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "satellite",
    },

    {
      no: 20,
      sentence:
        "The force that pulls objects toward one another is gravity. Without gravity, planets would not remain in orbit.",
      targetWord: "gravity",
      prefixLen: 3,
      subject: "astronomy",
      meaning: "중력",
      synonyms: ["gravitational force"],
      forms: {
        noun: ["gravity"],
        adj: ["gravitational"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "gravity",
    },

    {
      no: 21,
      sentence:
        "A star’s brightness as seen from Earth depends on distance and energy output. The actual energy output is called luminosity.",
      targetWord: "luminosity",
      prefixLen: 4,
      subject: "astronomy",
      meaning: "광도",
      synonyms: ["brightness output"],
      forms: {
        noun: ["luminosity"],
        adj: ["luminous"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "luminosity",
    },

    {
      no: 22,
      sentence:
        "The study of the universe as a whole is called cosmology. Cosmology explores the origin and fate of the universe.",
      targetWord: "cosmology",
      prefixLen: 4,
      subject: "astronomy",
      meaning: "우주론",
      synonyms: ["study of the universe"],
      forms: {
        noun: ["cosmology"],
        adj: ["cosmic"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "cosmology",
    },

    {
  no: 23,
  sentence:
    "At the center of a black hole, matter is thought to collapse into an infinitely dense point. This theoretical point is called a singularity.",
  targetWord: "singularity",
  prefixLen: 4,
  subject: "astronomy",
  meaning: "특이점",
  synonyms: ["gravitational collapse point", "infinite-density point"],
  forms: {
    noun: ["singularity"],
    adj: ["singular"],
    verb: [],
    part: [],
    adv: [],
  },
  answer: "singularity",
},

    {
      no: 24,
      sentence:
        "Large luminous spheres composed mainly of hydrogen are stars. A star generates energy through fusion reactions.",
      targetWord: "star",
      prefixLen: 2,
      subject: "astronomy",
      meaning: "별",
      synonyms: ["stellar body"],
      forms: {
        noun: ["star"],
        adj: ["stellar"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "star",
    },

    {
      no: 25,
      sentence:
        "The adjective describing phenomena related to stars is stellar. Stellar processes include nuclear fusion and radiation emission.",
      targetWord: "stellar",
      prefixLen: 3,
      subject: "astronomy",
      meaning: "항성의",
      synonyms: ["star-related"],
      forms: {
        noun: [],
        adj: ["stellar"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "stellar",
    },

    {
      no: 26,
      sentence:
        "Some distant galaxies appear to move away rapidly. This observation supports cosmic expansion.",
      targetWord: "cosmic",
      prefixLen: 3,
      subject: "astronomy",
      meaning: "우주의",
      synonyms: ["universal"],
      forms: {
        noun: [],
        adj: ["cosmic"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "cosmic",
    },

    {
      no: 27,
      sentence:
        "Planets are large bodies that orbit stars. Earth is classified as a planet.",
      targetWord: "planet",
      prefixLen: 2,
      subject: "astronomy",
      meaning: "행성",
      synonyms: ["orbiting body"],
      forms: {
        noun: ["planet"],
        adj: ["planetary"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "planet",
    },

    {
      no: 28,
      sentence:
        "The vast space containing all matter and energy is called the universe. It includes galaxies, stars, and planets.",
      targetWord: "universe",
      prefixLen: 3,
      subject: "astronomy",
      meaning: "우주",
      synonyms: ["cosmos"],
      forms: {
        noun: ["universe"],
        adj: ["universal"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "universe",
    },

    {
      no: 29,
      sentence:
        "Large systems of stars and dust are called galaxies. Each galaxy may contain billions of stars.",
      targetWord: "galaxy",
      prefixLen: 3,
      subject: "astronomy",
      meaning: "은하",
      synonyms: ["star system"],
      forms: {
        noun: ["galaxy"],
        adj: ["galactic"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "galaxy",
    },

    {
      no: 30,
      sentence:
        "Energy released in atomic processes powers stars. This energy often results from nuclear reactions.",
      targetWord: "nuclear reaction",
      prefixLen: 3,
      subject: "astronomy",
      meaning: "핵반응",
      synonyms: ["atomic reaction"],
      forms: {
        noun: ["nuclear reaction"],
        adj: [],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "nuclear reaction",
    },

  ]),
};