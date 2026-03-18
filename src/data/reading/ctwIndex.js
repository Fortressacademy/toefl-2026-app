// src/data/reading/ctwIndex.js
import { ctw_bio } from "./biology";
import { ctw_geo } from "./geology";
import { ctw_astro } from "./astronomy";
import { ctw_paleo } from "./paleontology";
import { ctw_psych } from "./psychology";
import { ctw_his } from "./history";
import { ctw_context } from "./context";
import { ctw_pos } from "./pos";

import { ctw_para } from "./ctw_paragraph";
import { ctw_para2 } from "./ctw_paragraph2";

export const CTW_TRACK_MAP = {
  context: ctw_context,
  pos: ctw_pos,
  bio: ctw_bio,
  geo: ctw_geo,
  astro: ctw_astro,
  paleo: ctw_paleo,
  psych: ctw_psych,
  his: ctw_his,
  para: ctw_para,
  para2: ctw_para2,
};

const getSafeTotal = (track) => {
  if (!track) return 0;
  if (Number.isFinite(track.total)) return track.total;
  if (Array.isArray(track.items)) return track.items.length;
  return 0;
};

export const CTW_TRACK_LIST = [
  { key: "context", title: "Context", subtitle: "intuitive/context", total: getSafeTotal(ctw_context) },
  { key: "pos", title: "partsofspeech", subtitle: "partsofspeech", total: getSafeTotal(ctw_pos) },
  { key: "bio", title: "Biology", subtitle: "생물/생태/진화", total: getSafeTotal(ctw_bio) },
  { key: "geo", title: "Geology", subtitle: "지질/기후/지형", total: getSafeTotal(ctw_geo) },
  { key: "astro", title: "Astronomy", subtitle: "천문/우주", total: getSafeTotal(ctw_astro) },
  { key: "paleo", title: "Paleontology", subtitle: "화석/멸종/고생물", total: getSafeTotal(ctw_paleo) },
  { key: "psych", title: "Psychology", subtitle: "인지/학습/행동", total: getSafeTotal(ctw_psych) },
  { key: "his", title: "History", subtitle: "사건/시대/사료", total: getSafeTotal(ctw_his) },
  { key: "para", title: "Paragraph", subtitle: "multi blank paragraph", total: getSafeTotal(ctw_para) },
  { key: "para2", title: "Paragraph2", subtitle: "multi blank paragraph", total: getSafeTotal(ctw_para2) },
];