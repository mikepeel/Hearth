import { addDays, format } from "date-fns";
import type { Meal } from "@/lib/meals";
import { isOurs } from "@/lib/meals";
import type { NightPlan } from "@/lib/plan-store";
import { tasteScore, type Tastes } from "@/lib/taste";

const REPEAT_WINDOW_DAYS = 21;

export function lastCookedOn(
  nights: Record<string, NightPlan>,
  mealId: string,
  exceptDate?: string,
): string | null {
  const today = format(new Date(), "yyyy-MM-dd");
  let best: string | null = null;
  for (const [date, night] of Object.entries(nights)) {
    if (date === exceptDate || date > today) continue;
    if (night.kind !== "cook" || night.mealId !== mealId) continue;
    const happened = date < today || night.cooked;
    if (!happened) continue;
    if (!best || date > best) best = date;
  }
  return best;
}

export function recentMealIds(nights: Record<string, NightPlan>): Set<string> {
  const today = format(new Date(), "yyyy-MM-dd");
  const cutoff = format(addDays(new Date(), -REPEAT_WINDOW_DAYS), "yyyy-MM-dd");
  const ids = new Set<string>();
  for (const [date, night] of Object.entries(nights)) {
    if (night.kind !== "cook" || !night.mealId) continue;
    if (date > today || date < cutoff) continue;
    if (date === today && !night.cooked) continue;
    ids.add(night.mealId);
  }
  return ids;
}

function shuffle<T>(list: T[]): T[] {
  const next = [...list];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    const item = next[index];
    next[index] = next[swap]!;
    next[swap] = item!;
  }
  return next;
}

function byTaste(list: Meal[], tastes: Tastes): Meal[] {
  const hot = list.filter((meal) => tasteScore(meal, tastes) > 0);
  const cold = list.filter((meal) => tasteScore(meal, tastes) === 0);
  hot.sort((a, b) => tasteScore(b, tastes) - tasteScore(a, tastes) || a.name.localeCompare(b.name));
  return [...hot, ...shuffle(cold)];
}

export function variedPool(
  meals: Meal[],
  nights: Record<string, NightPlan>,
  used: Set<string>,
  favorites: string[],
  tastes: Tastes = {},
): Meal[] {
  const recent = recentMealIds(nights);
  const open = meals.filter((meal) => !used.has(meal.id));
  const preferred = (meal: Meal) => isOurs(meal) || favorites.includes(meal.id);
  const fresh = open.filter((meal) => !recent.has(meal.id));
  const stale = open.filter((meal) => recent.has(meal.id));
  return [
    ...byTaste(fresh.filter(preferred), tastes),
    ...byTaste(
      fresh.filter((meal) => !preferred(meal)),
      tastes,
    ),
    ...byTaste(stale.filter(preferred), tastes),
    ...byTaste(
      stale.filter((meal) => !preferred(meal)),
      tastes,
    ),
  ];
}
