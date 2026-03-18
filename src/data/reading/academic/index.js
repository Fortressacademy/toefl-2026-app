// src/data/reading/academic/index.js

import { detail_01 } from "./detail/detail_01";
//import { detail_02 } from "./detail/detail_02";
//import { detail_03 } from "./detail/detail_03";
//import { detail_04 } from "./detail/detail_04";
//import { detail_05 } from "./detail/detail_05";

import { arts_01 } from "./arts/arts_01";
import { arts_02 } from "./arts/arts_02";

import { socialscience_01 } from "./socialscience/socialscience_01";
import { socialscience_02 } from "./socialscience/socialscience_02";

import { physicalscience_01 } from "./physicalscience/physicalscience_01";
import { physicalscience_02 } from "./physicalscience/physicalscience_02";


import { lifescience_01 } from "./lifescience/lifescience_01";
import { lifescience_02 } from "./lifescience/lifescience_02";

import { humanities_01 } from "./humanities/humanities_01";
import { humanities_02 } from "./humanities/humanities_02";

import { mixed_01 } from "./mixed/mixed_01";
//import { mixed_01 } from "./mixed/mixed_02";

export const ACADEMIC_BANK = {
  detail: [detail_01,], //detail_02, detail_03, detail_04, detail_05],
  arts: [arts_01,arts_02,],
  lifescience: [lifescience_01,lifescience_02,],
  physicalscience: [physicalscience_01,physicalscience_02,],
  socialscience: [socialscience_01,socialscience_02,],
  humanities: [humanities_01,humanities_02,],
  mixed: [mixed_01,], // mixed_02, mixed_03, mixed_04, mixed_05],
};