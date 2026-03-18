// src/data/listening/listeningBank.js

import { choose_practice1 } from "./chooseResponse/choose_practice1";
import { choose_practice2 } from "./chooseResponse/choose_practice2";
import { choose_practice3 } from "./chooseResponse/choose_practice3";
import { conv_practice1 } from "./conversation/conv_practice1";
// import { ann_practice1 } from "./announcement/ann_practice1";
// import { acad_practice1 } from "./academicTalk/acad_practice1";

export const LISTENING_BANK = {
  chooseResponse: [
    choose_practice1,
    choose_practice2,
    choose_practice3,
    // ...
  ],
  conversation: [
  conv_practice1,
  ],
  announcement: [
    // ann_practice1,
  ],
  academicTalk: [
    // acad_practice1,
  ],
};