import { TAG_LABEL, type Meal, type Tag } from "@/lib/meals";

export type Tastes = Record<string, number>;

function keysFor(meal: Meal): string[] {
  const tags = meal.tags.filter((tag) => tag !== "soup");
  return [`cuisine:${meal.cuisine}`, ...tags.map((tag) => `tag:${tag}`)];
}

export function noteTaste(tastes: Tastes, meal: Meal): Tastes {
  const next = { ...tastes };
  for (const key of keysFor(meal)) next[key] = (next[key] ?? 0) + 1;
  return next;
}

export function tasteScore(meal: Meal, tastes: Tastes): number {
  return keysFor(meal).reduce((sum, key) => sum + (tastes[key] ?? 0), 0);
}

export function tasteLean(tastes: Tastes): string | null {
  const total = Object.values(tastes).reduce((sum, count) => sum + count, 0);
  if (total < 3) return null;
  const ranked = (prefix: string) =>
    Object.entries(tastes)
      .filter(([key, count]) => key.startsWith(prefix) && count > 0)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const cuisines = ranked("cuisine:");
  const tags = ranked("tag:");
  const bits: string[] = [];
  if (cuisines[0]) bits.push(cuisines[0][0].slice("cuisine:".length));
  if (cuisines[1] && cuisines[1][1] >= 2) bits.push(cuisines[1][0].slice("cuisine:".length));
  const tag = tags[0];
  if (tag && tag[1] >= 2) {
    const id = tag[0].slice("tag:".length) as Tag;
    bits.push((TAG_LABEL[id] ?? id).toLowerCase());
  }
  if (bits.length === 0) return null;
  if (bits.length === 1) return bits[0] ?? null;
  return `${bits.slice(0, -1).join(", ")} and ${bits[bits.length - 1]}`;
}
