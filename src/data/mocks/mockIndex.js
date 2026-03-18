// src/data/mocks/mockIndex.js
import { mock1 } from "./mock1";
import { mock2 } from "./mock2";
import { mock3 } from "./mock3";
import { mock4 } from "./mock4";

export const READING_MOCKS = {
  [mock1.id]: mock1,
  [mock2.id]: mock2,
  [mock3.id]: mock3,
  [mock4.id]: mock4,
};

export const READING_MOCK_LIST = [
  { id: mock1.id, title: mock1.title, description: mock1.description },
  { id: mock2.id, title: mock2.title, description: mock2.description },
  { id: mock3.id, title: mock3.title, description: mock3.description },
  { id: mock4.id, title: mock4.title, description: mock4.description },
];