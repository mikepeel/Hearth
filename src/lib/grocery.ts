import { format } from "date-fns";
import { formatItemName, formatQty } from "@/lib/format";
import { getMeal, type Aisle } from "@/lib/meals";
import type { NightPlan } from "@/lib/plan-store";

export const AISLE_ORDER: Aisle[] = [
  "Produce",
  "Protein",
  "Dairy",
  "Bakery",
  "Frozen",
  "Pantry",
  "Spices",
];

export type GroceryItem = {
  key: string;
  name: string;
  amount: number;
  unit: string;
  aisle: Aisle;
  meals: string[];
};

export type GroceryGroup = {
  aisle: Aisle;
  items: GroceryItem[];
};

export function dayKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function buildGrocery(
  dates: Date[],
  nights: Record<string, NightPlan>,
  weekKey: string,
): GroceryGroup[] {
  const merged = new Map<string, GroceryItem>();

  for (const date of dates) {
    const key = dayKey(date);
    const night = nights[key];
    if (!night || night.kind !== "cook" || !night.mealId) continue;
    const meal = getMeal(night.mealId);
    if (!meal) continue;
    const factor = night.servings / meal.servings;
    for (const ingredient of meal.ingredients) {
      const id = `${weekKey}|${ingredient.name}|${ingredient.unit}`;
      const existing = merged.get(id);
      if (existing) {
        existing.amount += ingredient.amount * factor;
        if (!existing.meals.includes(meal.name)) existing.meals.push(meal.name);
      } else {
        merged.set(id, {
          key: id,
          name: ingredient.name,
          amount: ingredient.amount * factor,
          unit: ingredient.unit,
          aisle: ingredient.aisle,
          meals: [meal.name],
        });
      }
    }
  }

  return AISLE_ORDER.map((aisle) => ({
    aisle,
    items: [...merged.values()]
      .filter((item) => item.aisle === aisle)
      .sort((a, b) => a.name.localeCompare(b.name)),
  })).filter((group) => group.items.length > 0);
}

export function groceryLine(item: GroceryItem): string {
  const name = formatItemName(item.amount, item.unit, item.name);
  const qty = formatQty(item.amount, item.unit);
  return `${name} — ${qty}`;
}
