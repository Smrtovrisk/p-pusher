import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const STORE_PATH = new URL("../../data/seen-trades.json", import.meta.url).pathname;

let seen = new Set();

export function loadSeen() {
  try {
    const raw = readFileSync(STORE_PATH, "utf-8");
    const arr = JSON.parse(raw);
    seen = new Set(arr);
    console.log(`Loaded ${seen.size} seen trades from store`);
  } catch {
    seen = new Set();
  }
}

export function hasSeen(id) {
  return seen.has(id);
}

export function markSeen(id) {
  seen.add(id);
  save();
}

function save() {
  mkdirSync(dirname(STORE_PATH), { recursive: true });
  writeFileSync(STORE_PATH, JSON.stringify([...seen], null, 2));
}
