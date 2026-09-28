import type { Aisle, Ingredient } from "@/lib/meals";

const UNIT_MAP: Record<string, string> = {
  lb: "lb",
  lbs: "lb",
  oz: "oz",
  cup: "cup",
  cups: "cup",
  tbsp: "tbsp",
  tsp: "tsp",
  clove: "clove",
  cloves: "clove",
  can: "can",
  cans: "can",
  bunch: "bunch",
  bunches: "bunch",
  pint: "pint",
  loaf: "loaf",
  head: "head",
  slice: "slice",
  slices: "slice",
};

function parseAmount(raw: string): number {
  const parts = raw.trim().split(/\s+/);
  let total = 0;
  for (const part of parts) {
    if (part.includes("/")) {
      const [num, den] = part.split("/");
      const n = Number(num);
      const d = Number(den);
      if (d) total += n / d;
    } else {
      total += Number(part);
    }
  }
  return Number.isFinite(total) && total > 0 ? total : 1;
}

function titleName(value: string): string {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .replace(/^./, (char) => char.toUpperCase());
}

function guessAisle(name: string): Aisle {
  const text = name.toLowerCase();
  if (/chicken|beef|pork|salmon|shrimp|fish|turkey|sausage|cod|steak|thigh|tofu/.test(text)) return "Protein";
  if (/milk|cheese|yogurt|butter|cream|egg|feta/.test(text)) return "Dairy";
  if (/frozen/.test(text)) return "Frozen";
  if (/bread|pita|roll|tortilla|bun|loaf/.test(text)) return "Bakery";
  if (/cumin|oregano|paprika|seasoning|chili powder|salt|pepper flakes/.test(text)) return "Spices";
  if (/onion|garlic|lemon|lime|tomato|potato|broccoli|spinach|lettuce|cabbage|cilantro|parsley|basil|apple|mushroom|cucumber|pepper|herb|bean/.test(text)) {
    return "Produce";
  }
  return "Pantry";
}

export function parseIngredientLines(block: string): Ingredient[] {
  const items: Ingredient[] = [];
  for (const line of block.split("\n")) {
    const text = line.trim().replace(/^[-*]\s*/, "");
    if (!text) continue;
    const withUnit = text.match(/^(\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:\.\d+)?)\s+([a-zA-Z]+)\s+(.+)$/);
    if (withUnit) {
      const unit = UNIT_MAP[withUnit[2]!.toLowerCase()];
      if (unit) {
        const name = titleName(withUnit[3]!);
        items.push({ name, amount: parseAmount(withUnit[1]!), unit, aisle: guessAisle(name) });
        continue;
      }
    }
    const counted = text.match(/^(\d+(?:\.\d+)?)\s+(.+)$/);
    if (counted) {
      const name = titleName(counted[2]!);
      items.push({ name, amount: Number(counted[1]), unit: "", aisle: guessAisle(name) });
      continue;
    }
    const name = titleName(text);
    items.push({ name, amount: 1, unit: "", aisle: guessAisle(name) });
  }
  return items;
}
