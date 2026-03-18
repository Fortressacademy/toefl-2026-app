// src/utils/categoryShort.js

const MAP = {
  geology: "Geo.",
  biology: "Bio.",
  astronomy: "Ast.",
  psychology: "Psy.",
  chemistry: "Chem.",
  physics: "Phys.",
  general: "Gen."
};

export function getShortCategory(name) {
  const raw = String(name ?? "").trim();
  if (!raw) return "Gen.";

  const key = raw.toLowerCase();
  return MAP[key] || (raw.length <= 4 ? raw : raw.slice(0, 3) + ".");
}