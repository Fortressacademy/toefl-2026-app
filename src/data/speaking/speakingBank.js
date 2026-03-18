// src/data/speaking/speakingBank.js

// ================= Listen & Repeat =================
import { lr_practice1 } from "./listenRepeat/lr_practice1";
import { lr_practice2 } from "./listenRepeat/lr_practice2";
import { lr_practice3 } from "./listenRepeat/lr_practice3";
import { lr_practice4 } from "./listenRepeat/lr_practice4";
import { lr_practice5 } from "./listenRepeat/lr_practice5";
import { lr_practice6 } from "./listenRepeat/lr_practice6";
import { lr_practice7 } from "./listenRepeat/lr_practice7";
import { lr_practice8 } from "./listenRepeat/lr_practice8";
import { lr_practice9 } from "./listenRepeat/lr_practice9";
import { lr_practice10 } from "./listenRepeat/lr_practice10";

// ================= Interview =================
import { int_practice1 } from "./interview/int_practice1";
import { int_practice2 } from "./interview/int_practice2";
import { int_practice3 } from "./interview/int_practice3";
import { int_practice4 } from "./interview/int_practice4";
import { int_practice5 } from "./interview/int_practice5";
import { int_practice6 } from "./interview/int_practice6";
import { int_practice7 } from "./interview/int_practice7";
import { int_practice8 } from "./interview/int_practice8";
import { int_practice9 } from "./interview/int_practice9";
import { int_practice10 } from "./interview/int_practice10";

export const SPEAKING_BANK = {
  // ✅ Listen & Repeat (1~10)
  listenRepeat: [
    lr_practice1,
    lr_practice2,
    lr_practice3,
    lr_practice4,
    lr_practice5,
    lr_practice6,
    lr_practice7,
    lr_practice8,
    lr_practice9,
    lr_practice10,
  ],

  // ✅ Interview (1~10)
  interview: [
    int_practice1,
    int_practice2,
    int_practice3,
    int_practice4,
    int_practice5,
    int_practice6,
    int_practice7,
    int_practice8,
    int_practice9,
    int_practice10,
  ],
};