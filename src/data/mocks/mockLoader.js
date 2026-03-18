// src/data/mocks/mockLoader.js
import { READING_MOCKS } from "./mockIndex";

export function loadReadingMockById(mockId) {
  if (!mockId) return null;
  return READING_MOCKS[mockId] || null;
}

export function listReadingMocks() {
  return Object.values(READING_MOCKS).map((m) => ({
    id: m.id,
    title: m.title,
    description: m.description,
  }));
}