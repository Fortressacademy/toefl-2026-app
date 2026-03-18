// src/data/writing/writingIndex.js
import { MOCK1 } from "./mocks/mock1";
import { MOCK2 } from "./mocks/mock2";
import { MOCK3 } from "./mocks/mock3";
//import { MOCK4 } from "./mocks/mock4";
//import { MOCK5 } from "./mocks/mock5";
//import { MOCK6 } from "./mocks/mock6";
//import { MOCK7 } from "./mocks/mock7";
//import { MOCK8 } from "./mocks/mock8";

export const WRITING_MOCK_BANK = [
  MOCK1,
  MOCK2,
  MOCK3,
  //MOCK4,
  //MOCK5,
  //MOCK6,
  //MOCK7,
  //MOCK8,
];

export function getMockById(mockId) {
  return WRITING_MOCK_BANK.find((m) => m.id === mockId) ?? WRITING_MOCK_BANK[0];
}