// src/data/reading/history.js
// CTW · History (2-sentence context version) — context-first (no definition-style sentences)

const shuffleArray = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const ctw_his = {
  id: "ctw_history",
  title: "Complete the Words · History",
  total: 30,
  items: shuffleArray([
    {
      no: 1,
      sentence:
        "From North Africa to Western Europe, one ruler’s banners flew over cities that spoke different languages. People paid taxes to a distant capital and called the vast realm an empire.",
      targetWord: "empire",
      prefixLen: 2,
      subject: "history",
      meaning: "제국",
      synonyms: ["imperial state", "vast realm", "dominant power"],
      forms: { noun: ["empire"], adj: ["imperial"], verb: [], part: [], adv: [] },
      answer: "empire",
    },
    {
      no: 2,
      sentence:
        "Power stayed in the same family for more than two hundred years, even when ministers changed. Historians still label that long family rule as a dynasty.",
      targetWord: "dynasty",
      prefixLen: 3,
      subject: "history",
      meaning: "왕조",
      synonyms: ["ruling house", "royal line", "hereditary rule"],
      forms: { noun: ["dynasty"], adj: ["dynastic"], verb: [], part: [], adv: [] },
      answer: "dynasty",
    },
    {
      no: 3,
      sentence:
        "After the king died, the crown passed to his eldest child without an election. Many citizens accepted the transfer as normal in a monarchy.",
      targetWord: "monarchy",
      prefixLen: 3,
      subject: "history",
      meaning: "군주제",
      synonyms: ["royal rule", "crown government", "kingdom system"],
      forms: { noun: ["monarchy"], adj: ["monarchical"], verb: [], part: [], adv: [] },
      answer: "monarchy",
    },
    {
      no: 4,
      sentence:
        "Instead of a royal family, the country chose a president through representatives. The constitution described the system as a republic.",
      targetWord: "republic",
      prefixLen: 3,
      subject: "history",
      meaning: "공화국",
      synonyms: ["representative state", "civic system", "non-monarchical government"],
      forms: { noun: ["republic"], adj: ["republican"], verb: [], part: [], adv: [] },
      answer: "republic",
    },
    {
      no: 5,
      sentence:
        "Newspapers were shut down overnight, and public gatherings required permits. Under that regime, even harmless criticism could trigger arrests.",
      targetWord: "regime",
      prefixLen: 2,
      subject: "history",
      meaning: "정권",
      synonyms: ["ruling system", "government in power", "administration"],
      forms: { noun: ["regime"], adj: [], verb: [], part: [], adv: [] },
      answer: "regime",
    },
    {
      no: 6,
      sentence:
        "Foreign officials demanded to supervise the port and collect tariffs directly. The cabinet rejected the demand, insisting on national sovereignty.",
      targetWord: "sovereignty",
      prefixLen: 4,
      subject: "history",
      meaning: "주권",
      synonyms: ["self-rule", "independent authority", "national autonomy"],
      forms: { noun: ["sovereignty"], adj: ["sovereign"], verb: [], part: [], adv: [] },
      answer: "sovereignty",
    },
    {
      no: 7,
      sentence:
        "When the general entered the room, even rival politicians stood up and lowered their voices. His authority did not come from a title alone, but from the loyalty he commanded.",
      targetWord: "authority",
      prefixLen: 3,
      subject: "history",
      meaning: "권위",
      synonyms: ["command", "legitimate power", "governing power"],
      forms: { noun: ["authority"], adj: ["authoritative"], verb: [], part: [], adv: [] },
      answer: "authority",
    },
    {
      no: 8,
      sentence:
        "The assembly passed new rules limiting child labor and setting minimum wages. After months of debate, the final legislation reshaped factory life.",
      targetWord: "legislation",
      prefixLen: 4,
      subject: "history",
      meaning: "법률 제정",
      synonyms: ["lawmaking", "statutory action", "legal reform"],
      forms: {
        noun: ["legislation"],
        verb: ["legislate"],
        part: ["legislating", "legislated"],
        adj: ["legislative"],
        adv: [],
      },
      answer: "legislation",
    },
    {
      no: 9,
      sentence:
        "The school system was criticized for excluding rural children, so officials rewrote the admission policy. The gradual reform reduced the gap within a decade.",
      targetWord: "reform",
      prefixLen: 2,
      subject: "history",
      meaning: "개혁",
      synonyms: ["system change", "policy overhaul", "institutional improvement"],
      forms: { noun: ["reform"], verb: ["reform"], part: ["reforming", "reformed"], adj: ["reformist"], adv: [] },
      answer: "reform",
    },
    {
      no: 10,
      sentence:
        "Crowds tore down symbols of the old order and flooded the streets demanding a new constitution. Within weeks, the revolution toppled leaders who had ruled for decades.",
      targetWord: "revolution",
      prefixLen: 3,
      subject: "history",
      meaning: "혁명",
      synonyms: ["overthrow", "radical change", "uprising movement"],
      forms: { noun: ["revolution"], adj: ["revolutionary"], verb: [], part: [], adv: [] },
      answer: "revolution",
    },

    {
      no: 11,
      sentence:
        "After defeating the last fortress, the invading army installed its own governors and taxes. The swift conquest changed laws and language across the region.",
      targetWord: "conquest",
      prefixLen: 3,
      subject: "history",
      meaning: "정복",
      synonyms: ["military takeover", "subjugation", "capture of territory"],
      forms: { noun: ["conquest"], verb: ["conquer"], part: ["conquering", "conquered"], adj: [], adv: [] },
      answer: "conquest",
    },
    {
      no: 12,
      sentence:
        "At dawn, ships appeared beyond the harbor, and soldiers poured onto the beaches. The sudden invasion left the government scrambling to defend the capital.",
      targetWord: "invasion",
      prefixLen: 3,
      subject: "history",
      meaning: "침략",
      synonyms: ["incursion", "armed entry", "military assault"],
      forms: { noun: ["invasion"], verb: ["invade"], part: ["invading", "invaded"], adj: [], adv: [] },
      answer: "invasion",
    },
    {
      no: 13,
      sentence:
        "Local officers refused orders and formed armed bands in the mountains. The rebellion spread once nearby villages began supplying food and shelter.",
      targetWord: "rebellion",
      prefixLen: 3,
      subject: "history",
      meaning: "반란",
      synonyms: ["insurrection", "armed resistance", "revolt"],
      forms: { noun: ["rebellion"], verb: ["rebel"], part: ["rebelling", "rebelled"], adj: ["rebellious"], adv: [] },
      answer: "rebellion",
    },
    {
      no: 14,
      sentence:
        "A protest over bread prices turned into clashes at the city gate by nightfall. The uprising forced officials to choose between negotiation and force.",
      targetWord: "uprising",
      prefixLen: 2,
      subject: "history",
      meaning: "봉기",
      synonyms: ["mass revolt", "popular revolt", "insurrection"],
      forms: { noun: ["uprising"], verb: [], part: [], adj: [], adv: [] },
      answer: "uprising",
    },
    {
      no: 15,
      sentence:
        "After years of fighting, both sides met in a neutral city and signed documents with seals and witnesses. The treaty fixed new borders and ended the war on paper.",
      targetWord: "treaty",
      prefixLen: 3,
      subject: "history",
      meaning: "조약",
      synonyms: ["formal agreement", "peace pact", "diplomatic accord"],
      forms: { noun: ["treaty", "treaties"], adj: [], verb: [], part: [], adv: [] },
      answer: "treaty",
    },
    {
      no: 16,
      sentence:
        "Two rivals promised to defend each other if a third power attacked either one. Their alliance altered the balance of power across the continent.",
      targetWord: "alliance",
      prefixLen: 3,
      subject: "history",
      meaning: "동맹",
      synonyms: ["coalition", "partnership", "mutual defense pact"],
      forms: { noun: ["alliance"], verb: ["ally"], part: ["allying", "allied"], adj: ["allied"], adv: [] },
      answer: "alliance",
    },
    {
      no: 17,
      sentence:
        "The map had to be redrawn as the state absorbed provinces one by one. Rapid expansion strained roads, taxes, and the ability to govern fairly.",
      targetWord: "expansion",
      prefixLen: 3,
      subject: "history",
      meaning: "팽창",
      synonyms: ["growth", "territorial spread", "enlargement"],
      forms: { noun: ["expansion"], verb: ["expand"], part: ["expanding", "expanded"], adj: ["expansive"], adv: [] },
      answer: "expansion",
    },
    {
      no: 18,
      sentence:
        "The border ran along the river, but both sides claimed the farmland beyond it. The contested territory became the main issue in negotiations.",
      targetWord: "territory",
      prefixLen: 3,
      subject: "history",
      meaning: "영토",
      synonyms: ["land area", "domain", "region under control"],
      forms: { noun: ["territory", "territories"], adj: ["territorial"], verb: [], part: [], adv: [] },
      answer: "territory",
    },
    {
      no: 19,
      sentence:
        "Merchants paid fees to pass through the port, and officials used the revenue to build new walls. Control of trade shaped the city’s rise more than its army did.",
      targetWord: "trade",
      prefixLen: 2,
      subject: "history",
      meaning: "무역",
      synonyms: ["commerce", "exchange", "market activity"],
      forms: { noun: ["trade"], verb: ["trade"], part: ["trading", "traded"], adj: ["trade"], adv: [] },
      answer: "trade",
    },
    {
      no: 20,
      sentence:
        "When the new mines opened, output soared and workers poured in from distant villages. The sudden industrialization transformed the region’s economy and daily routines.",
      targetWord: "industrialization",
      prefixLen: 5,
      subject: "history",
      meaning: "산업화",
      synonyms: ["factory growth", "mechanized production", "industry expansion"],
      forms: {
        noun: ["industrialization"],
        verb: ["industrialize"],
        part: ["industrializing", "industrialized"],
        adj: ["industrial"],
        adv: [],
      },
      answer: "industrialization",
    },

    {
      no: 21,
      sentence:
        "The colony had its own streets and markets, but decisions still came from an overseas capital. Local leaders argued that the colony’s wealth was being extracted unfairly.",
      targetWord: "colony",
      prefixLen: 3,
      subject: "history",
      meaning: "식민지",
      synonyms: ["overseas territory", "controlled settlement", "dependent region"],
      forms: { noun: ["colony", "colonies"], adj: ["colonial"], verb: [], part: [], adv: [] },
      answer: "colony",
    },
    {
      no: 22,
      sentence:
        "Students marched with banners demanding independence and fair elections. The growing nationalism worried officials who relied on loyalty to the empire.",
      targetWord: "nationalism",
      prefixLen: 4,
      subject: "history",
      meaning: "민족주의",
      synonyms: ["national pride", "independence movement", "patriotic ideology"],
      forms: { noun: ["nationalism"], adj: ["nationalist", "nationalistic"], verb: [], part: [], adv: [] },
      answer: "nationalism",
    },
    {
      no: 23,
      sentence:
        "Political posters claimed one group was naturally superior and deserved more rights than others. That ideology justified discrimination for decades.",
      targetWord: "ideology",
      prefixLen: 3,
      subject: "history",
      meaning: "이념",
      synonyms: ["belief system", "political doctrine", "guiding worldview"],
      forms: { noun: ["ideology", "ideologies"], adj: ["ideological"], verb: [], part: [], adv: [] },
      answer: "ideology",
    },
    {
      no: 24,
      sentence:
        "The general seized key buildings and announced a new government over the radio. By morning, the coup had replaced ministers without a vote.",
      targetWord: "coup",
      prefixLen: 2,
      subject: "history",
      meaning: "쿠데타",
      synonyms: ["power seizure", "takeover", "sudden overthrow"],
      forms: { noun: ["coup", "coups"], adj: [], verb: [], part: [], adv: [] },
      answer: "coup",
    },
    {
      no: 25,
      sentence:
        "Control of the capital shifted after the king was captured and executed. The abrupt transition left citizens unsure which laws still applied.",
      targetWord: "transition",
      prefixLen: 3,
      subject: "history",
      meaning: "전환",
      synonyms: ["shift", "changeover", "turning point"],
      forms: { noun: ["transition"], verb: ["transition"], part: ["transitioning", "transitioned"], adj: ["transitional"], adv: [] },
      answer: "transition",
    },
    {
      no: 26,
      sentence:
        "Officials collected grain from farmers and paid soldiers from the same storehouses. The heavy taxation pushed many households into debt.",
      targetWord: "taxation",
      prefixLen: 3,
      subject: "history",
      meaning: "과세",
      synonyms: ["tax system", "revenue collection", "levy"],
      forms: { noun: ["taxation"], verb: ["tax"], part: ["taxing", "taxed"], adj: ["taxable"], adv: [] },
      answer: "taxation",
    },
    {
      no: 27,
      sentence:
        "A few families owned most of the land and sat closest to the ruler at ceremonies. Their wealth and titles made the aristocracy hard to challenge.",
      targetWord: "aristocracy",
      prefixLen: 4,
      subject: "history",
      meaning: "귀족층",
      synonyms: ["nobility", "upper class", "elite ruling class"],
      forms: { noun: ["aristocracy"], adj: ["aristocratic"], verb: [], part: [], adv: [] },
      answer: "aristocracy",
    },
    {
      no: 28,
      sentence:
        "In the capital, people bought silk and spices brought from thousands of kilometers away. The steady commerce funded museums, roads, and public baths.",
      targetWord: "commerce",
      prefixLen: 3,
      subject: "history",
      meaning: "상업",
      synonyms: ["trade", "business activity", "market exchange"],
      forms: { noun: ["commerce"], adj: ["commercial"], verb: [], part: [], adv: [] },
      answer: "commerce",
    },
    {
      no: 29,
      sentence:
        "Ancient temples were turned into offices, yet the old festivals continued each year. The blend of old and new showed how tradition can survive political change.",
      targetWord: "tradition",
      prefixLen: 3,
      subject: "history",
      meaning: "전통",
      synonyms: ["custom", "heritage", "long-established practice"],
      forms: { noun: ["tradition"], adj: ["traditional"], verb: [], part: [], adv: ["traditionally"] },
      answer: "tradition",
    },
    {
      no: 30,
      sentence:
        "A scholar copied letters, court records, and shipping logs into a single collection. Later researchers treated that archive as crucial evidence for their studies.",
      targetWord: "archive",
      prefixLen: 2,
      subject: "history",
      meaning: "기록 보관소/기록물",
      synonyms: ["record collection", "document store", "historical records"],
      forms: { noun: ["archive", "archives"], verb: ["archive"], part: ["archiving", "archived"], adj: ["archival"], adv: [] },
      answer: "archive",
    },
  ]),
};