// src/data/reading/dailyLife/index.js
import { notice_01 } from "./notices/notice_01";
import { notice_02 } from "./notices/notice_02";
import { notice_03 } from "./notices/notice_03";
import { notice_04 } from "./notices/notice_04";
import { notice_05 } from "./notices/notice_05";

import { email_01 } from "./emails/email_01";
import { email_02 } from "./emails/email_02";
import { email_03 } from "./emails/email_03";
import { email_04 } from "./emails/email_04";
import { email_05 } from "./emails/email_05";

import { schedule_01 } from "./schedules/schedule_01";
import { schedule_02 } from "./schedules/schedule_02";
import { schedule_03 } from "./schedules/schedule_03";
import { schedule_04 } from "./schedules/schedule_04";
import { schedule_05 } from "./schedules/schedule_05";

import { ads_01 } from "./ads/ads_01";
import { ads_02 } from "./ads/ads_02";
import { ads_03 } from "./ads/ads_03";
import { ads_04 } from "./ads/ads_04";
import { ads_05 } from "./ads/ads_05";

import { textmessage_01 } from "./textmessages/textmessage_01";
import { textmessage_02 } from "./textmessages/textmessage_02";
import { textmessage_03 } from "./textmessages/textmessage_03";
import { textmessage_04 } from "./textmessages/textmessage_04";
import { textmessage_05 } from "./textmessages/textmessage_05";


// ✅ 너의 기존 코드와 호환되게 이름을 DAILY_LIFE_BANK로 고정
export const DAILY_LIFE_BANK = {
  notices: [notice_01, notice_02, notice_03, notice_04, notice_05],
  emails: [email_01, email_02, email_03, email_04, email_05],
  schedules: [schedule_01,schedule_02,schedule_03,schedule_04,schedule_05, ],
  ads: [ads_01,ads_02,ads_03,ads_04,ads_05,],
  textmessages: [textmessage_01,textmessage_02,textmessage_03,textmessage_04, textmessage_05],

};

export const DAILY_LIFE_INDEX = DAILY_LIFE_BANK;