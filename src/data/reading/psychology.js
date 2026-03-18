// src/data/reading/psychology.js
// CTW · Psychology (2-sentence context version) - 자연스러운 문맥 사용형

const shuffleArray = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const ctw_psych = {
  id: "ctw_psych",
  title: "Complete the Words · Psychology",
  total: 30,
  items: shuffleArray([

    {
      no: 1,
      sentence:
        "During the lecture, Mina struggled to follow the argument once the terminology became dense. Her cognition improved after she sketched a quick diagram and reread the key sentence.",
      targetWord: "cognition",
      prefixLen: 3,
      subject: "psychology",
      meaning: "인지",
      synonyms: ["mental processing", "thinking ability", "information processing"],
      forms: {
        noun: ["cognition"],
        adj: ["cognitive"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "cognition",
    },

    {
      no: 2,
      sentence:
        "At first, the hallway looked empty, but a faint outline appeared as the lights adjusted. His perception shifted once he realized the “shadow” was actually a glass door.",
      targetWord: "perception",
      prefixLen: 3,
      subject: "psychology",
      meaning: "지각",
      synonyms: ["sensory interpretation", "awareness process"],
      forms: {
        noun: ["perception"],
        adj: ["perceptual"],
        verb: ["perceive"],
        part: ["perceiving", "perceived"],
        adv: [],
      },
      answer: "perception",
    },

    {
      no: 3,
      sentence:
        "When the phone buzzed, everyone in the room glanced down at the same time. That stimulus was enough to interrupt the discussion and break their concentration.",
      targetWord: "stimulus",
      prefixLen: 3,
      subject: "psychology",
      meaning: "자극",
      synonyms: ["trigger", "external signal"],
      forms: {
        noun: ["stimulus", "stimuli"],
        adj: [],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "stimulus",
    },

    {
      no: 4,
      sentence:
        "The researcher waited silently and noted what participants did after the alarm sounded. Their response was slower than expected, especially in the final trial.",
      targetWord: "response",
      prefixLen: 3,
      subject: "psychology",
      meaning: "반응",
      synonyms: ["reaction", "behavioral reply"],
      forms: {
        noun: ["response"],
        adj: ["responsive"],
        verb: ["respond"],
        part: ["responding", "responded"],
        adv: [],
      },
      answer: "response",
    },

    {
      no: 5,
      sentence:
        "He remembered the professor’s example only after seeing a similar chart in the textbook. That memory returned suddenly and made the paragraph much easier to understand.",
      targetWord: "memory",
      prefixLen: 3,
      subject: "psychology",
      meaning: "기억",
      synonyms: ["information storage", "recall ability"],
      forms: {
        noun: ["memory", "memories"],
        adj: ["memorable"],
        verb: ["memorize"],
        part: ["memorizing", "memorized"],
        adv: [],
      },
      answer: "memory",
    },

    {
      no: 6,
      sentence:
        "Whenever the child finished the worksheet, the teacher gave a small sticker. Over time, that reinforcement made him start the task without being asked.",
      targetWord: "reinforcement",
      prefixLen: 4,
      subject: "psychology",
      meaning: "강화",
      synonyms: ["behavior strengthening", "reward process"],
      forms: {
        noun: ["reinforcement"],
        verb: ["reinforce"],
        part: ["reinforcing", "reinforced"],
        adj: ["reinforced"],
        adv: [],
      },
      answer: "reinforcement",
    },

    {
      no: 7,
      sentence:
        "After several sessions, the sound of the bell alone made the dog run to the door. The trainer relied on conditioning to build that automatic routine.",
      targetWord: "conditioning",
      prefixLen: 4,
      subject: "psychology",
      meaning: "조건화",
      synonyms: ["association learning", "behavior training"],
      forms: {
        noun: ["conditioning"],
        verb: ["condition"],
        part: ["conditioning", "conditioned"],
        adj: ["conditioned"],
        adv: [],
      },
      answer: "conditioning",
    },

    {
      no: 8,
      sentence:
        "He tried to read while the TV played in the background, but he kept losing his place. Once he turned it off, his attention stayed on the argument for much longer.",
      targetWord: "attention",
      prefixLen: 3,
      subject: "psychology",
      meaning: "주의",
      synonyms: ["focus", "concentration"],
      forms: {
        noun: ["attention"],
        adj: ["attentive"],
        verb: ["attend"],
        part: ["attending", "attended"],
        adv: [],
      },
      answer: "attention",
    },

    {
      no: 9,
      sentence:
        "By age five, she could explain her feelings more clearly than before. Her development was especially noticeable when she began negotiating rules with friends.",
      targetWord: "development",
      prefixLen: 4,
      subject: "psychology",
      meaning: "발달",
      synonyms: ["growth process", "progression"],
      forms: {
        noun: ["development"],
        adj: ["developmental"],
        verb: ["develop"],
        part: ["developing", "developed"],
        adv: [],
      },
      answer: "development",
    },

    {
      no: 10,
      sentence:
        "Even under stress, he stayed calm and spoke carefully. That steady personality helped the team avoid escalating the conflict.",
      targetWord: "personality",
      prefixLen: 4,
      subject: "psychology",
      meaning: "성격",
      synonyms: ["character pattern", "behavioral style"],
      forms: {
        noun: ["personality", "personalities"],
        adj: ["personal"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "personality",
    },

    {
      no: 11,
      sentence:
        "She kept practicing because she wanted to qualify for the scholarship. That motivation remained strong even after her first mock test went badly.",
      targetWord: "motivation",
      prefixLen: 4,
      subject: "psychology",
      meaning: "동기",
      synonyms: ["drive", "incentive"],
      forms: {
        noun: ["motivation"],
        adj: ["motivational"],
        verb: ["motivate"],
        part: ["motivating", "motivated"],
        adv: [],
      },
      answer: "motivation",
    },

    {
      no: 12,
      sentence:
        "At first, he disagreed with the group’s choice, but he stayed quiet during the vote. His conformity became obvious when he later repeated the majority’s opinion word for word.",
      targetWord: "conformity",
      prefixLen: 4,
      subject: "psychology",
      meaning: "동조",
      synonyms: ["group alignment", "social compliance"],
      forms: {
        noun: ["conformity"],
        verb: ["conform"],
        part: ["conforming", "conformed"],
        adj: ["conforming"],
        adv: [],
      },
      answer: "conformity",
    },

    {
      no: 13,
      sentence:
        "The participants were uneasy, yet most continued after the supervisor insisted. Their obedience surprised the observers who expected more resistance.",
      targetWord: "obedience",
      prefixLen: 3,
      subject: "psychology",
      meaning: "복종",
      synonyms: ["compliance with authority", "following orders"],
      forms: {
        noun: ["obedience"],
        adj: ["obedient"],
        verb: ["obey"],
        part: ["obeying", "obeyed"],
        adv: [],
      },
      answer: "obedience",
    },

    {
      no: 14,
      sentence:
        "Before meeting the new roommate, he assumed she would be unfriendly. That prejudice faded quickly once she helped him carry the boxes without being asked.",
      targetWord: "prejudice",
      prefixLen: 3,
      subject: "psychology",
      meaning: "편견",
      synonyms: ["bias", "preconceived judgment"],
      forms: {
        noun: ["prejudice"],
        adj: ["prejudiced"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "prejudice",
    },

    {
      no: 15,
      sentence:
        "Some viewers expected the candidate to be incompetent because of a single label. The stereotype shaped their interpretation of every mistake in the interview.",
      targetWord: "stereotype",
      prefixLen: 3,
      subject: "psychology",
      meaning: "고정관념",
      synonyms: ["generalized belief", "group assumption"],
      forms: {
        noun: ["stereotype"],
        verb: ["stereotype"],
        part: ["stereotyping", "stereotyped"],
        adj: ["stereotypical"],
        adv: [],
      },
      answer: "stereotype",
    },

    {
      no: 16,
      sentence:
        "In online discussions, small misunderstandings can escalate quickly. Careful interaction helps prevent a neutral comment from being read as an insult.",
      targetWord: "interaction",
      prefixLen: 4,
      subject: "psychology",
      meaning: "상호작용",
      synonyms: ["mutual influence", "social exchange"],
      forms: {
        noun: ["interaction"],
        adj: ["interactive"],
        verb: ["interact"],
        part: ["interacting", "interacted"],
        adv: [],
      },
      answer: "interaction",
    },

    {
      no: 17,
      sentence:
        "The ad didn’t list many facts, but it still changed how people felt about the product. Its persuasion worked because the story sounded personal and relatable.",
      targetWord: "persuasion",
      prefixLen: 4,
      subject: "psychology",
      meaning: "설득",
      synonyms: ["attitude change", "convincing process"],
      forms: {
        noun: ["persuasion"],
        verb: ["persuade"],
        part: ["persuading", "persuaded"],
        adj: ["persuasive"],
        adv: [],
      },
      answer: "persuasion",
    },

    {
      no: 18,
      sentence:
        "They both wanted to lead the project, and neither was willing to compromise. The conflict intensified when deadlines approached and communication became short.",
      targetWord: "conflict",
      prefixLen: 3,
      subject: "psychology",
      meaning: "갈등",
      synonyms: ["disagreement", "clash"],
      forms: {
        noun: ["conflict"],
        verb: ["conflict"],
        part: ["conflicting"],
        adj: ["conflicting"],
        adv: [],
      },
      answer: "conflict",
    },

    {
      no: 19,
      sentence:
        "The team finished early because everyone shared notes and divided tasks fairly. That cooperation turned a difficult assignment into a manageable one.",
      targetWord: "cooperation",
      prefixLen: 4,
      subject: "psychology",
      meaning: "협력",
      synonyms: ["collaboration", "joint effort"],
      forms: {
        noun: ["cooperation"],
        verb: ["cooperate"],
        part: ["cooperating", "cooperated"],
        adj: ["cooperative"],
        adv: [],
      },
      answer: "cooperation",
    },

    {
      no: 20,
      sentence:
        "After moving abroad, she felt unsure about where she belonged. Over time, her identity became clearer as she built a community and routines.",
      targetWord: "identity",
      prefixLen: 3,
      subject: "psychology",
      meaning: "정체성",
      synonyms: ["self-concept", "personal sense of self"],
      forms: {
        noun: ["identity", "identities"],
        adj: ["identical"],
        verb: ["identify"],
        part: ["identifying", "identified"],
        adv: [],
      },
      answer: "identity",
    },

    {
      no: 21,
      sentence:
        "He became more sensitive to peer opinions once he entered middle school. During adolescence, small social cues can feel unusually important.",
      targetWord: "adolescence",
      prefixLen: 4,
      subject: "psychology",
      meaning: "청소년기",
      synonyms: ["teen years", "youth stage"],
      forms: {
        noun: ["adolescence"],
        adj: ["adolescent"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "adolescence",
    },

    {
      no: 22,
      sentence:
        "The teacher praised effort rather than “talent,” and students began taking harder tasks. That mindset helped them treat mistakes as information instead of failure.",
      targetWord: "mindset",
      prefixLen: 3,
      subject: "psychology",
      meaning: "사고방식",
      synonyms: ["attitude", "mental set"],
      forms: {
        noun: ["mindset"],
        adj: [],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "mindset",
    },

    {
      no: 23,
      sentence:
        "Even after the danger passed, he kept replaying the scene in his head. The trauma showed up later as nightmares and sudden panic in crowded places.",
      targetWord: "trauma",
      prefixLen: 3,
      subject: "psychology",
      meaning: "트라우마",
      synonyms: ["psychological injury", "emotional shock"],
      forms: {
        noun: ["trauma", "traumas"],
        adj: ["traumatic"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "trauma",
    },

    {
      no: 24,
      sentence:
        "She knew she should rest, yet she kept checking work emails late at night. Her anxiety made it difficult to believe that “nothing bad will happen” if she logs off.",
      targetWord: "anxiety",
      prefixLen: 3,
      subject: "psychology",
      meaning: "불안",
      synonyms: ["worry", "uneasiness"],
      forms: {
        noun: ["anxiety"],
        adj: ["anxious"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "anxiety",
    },

    {
      no: 25,
      sentence:
        "He stopped joining friends and lost interest in hobbies he used to enjoy. The depression became more noticeable when even simple tasks felt exhausting.",
      targetWord: "depression",
      prefixLen: 3,
      subject: "psychology",
      meaning: "우울(증)",
      synonyms: ["low mood", "persistent sadness"],
      forms: {
        noun: ["depression"],
        adj: ["depressive"],
        verb: ["depress"],
        part: ["depressing", "depressed"],
        adv: [],
      },
      answer: "depression",
    },

    {
      no: 26,
      sentence:
        "After failing the quiz, he blamed himself and assumed he would fail the next one too. This bias made him ignore the fact that he had improved in several sections.",
      targetWord: "bias",
      prefixLen: 2,
      subject: "psychology",
      meaning: "편향",
      synonyms: ["systematic distortion", "one-sided tendency"],
      forms: {
        noun: ["bias", "biases"],
        adj: ["biased"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "bias",
    },

    {
      no: 27,
      sentence:
        "The counselor asked him to describe the thought that appeared right before the panic started. In therapy, noticing that pattern made the next step more manageable.",
      targetWord: "therapy",
      prefixLen: 3,
      subject: "psychology",
      meaning: "치료(상담/심리치료)",
      synonyms: ["treatment", "counseling"],
      forms: {
        noun: ["therapy", "therapies"],
        adj: ["therapeutic"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "therapy",
    },

    {
      no: 28,
      sentence:
        "At first, the student insisted the answer was obvious, but he couldn’t explain why. With more reflection, he realized he had relied on intuition rather than evidence.",
      targetWord: "intuition",
      prefixLen: 3,
      subject: "psychology",
      meaning: "직관",
      synonyms: ["gut feeling", "immediate sense"],
      forms: {
        noun: ["intuition"],
        adj: ["intuitive"],
        verb: [],
        part: [],
        adv: [],
      },
      answer: "intuition",
    },

    {
      no: 29,
      sentence:
        "She believed she could handle public speaking, even though she was nervous. That confidence kept her voice steady during the first minute of the presentation.",
      targetWord: "confidence",
      prefixLen: 3,
      subject: "psychology",
      meaning: "자신감",
      synonyms: ["self-assurance", "belief in ability"],
      forms: {
        noun: ["confidence"],
        adj: ["confident"],
        verb: [],
        part: [],
        adv: ["confidently"],
      },
      answer: "confidence",
    },

    {
      no: 30,
      sentence:
        "He kept postponing the report even though he had enough time. This procrastination increased stress and made the final work quality worse.",
      targetWord: "procrastination",
      prefixLen: 4,
      subject: "psychology",
      meaning: "미루는 습관",
      synonyms: ["delay behavior", "putting off tasks"],
      forms: {
        noun: ["procrastination"],
        verb: ["procrastinate"],
        part: ["procrastinating", "procrastinated"],
        adj: [],
        adv: [],
      },
      answer: "procrastination",
    },

  ]),
};