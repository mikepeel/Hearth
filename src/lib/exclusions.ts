import type { Meal } from "@/lib/meals";

const VARIETIES: Record<string, string[]> = {
  mushroom: ["portobello", "portabella", "shiitake", "cremini", "crimini", "porcini", "enoki", "morel", "chanterelle"],
};

function formsFor(term: string): string[] {
  const cleaned = term.toLowerCase().trim();
  if (!cleaned) return [];
  const base = cleaned.endsWith("s") && cleaned.length > 3 ? cleaned.slice(0, -1) : cleaned;
  const forms = new Set([cleaned, base, `${base}s`]);
  for (const variety of VARIETIES[base] ?? []) forms.add(variety);
  return [...forms];
}

function stripProducts(text: string): string {
  return text
    .toLowerCase()
    .replace(/cream of [a-z][a-z\s-]*soup/g, " ")
    .replace(/\b(fish|oyster|soy|worcestershire) sauce\b/g, " ");
}

function textHas(text: string, forms: string[]): boolean {
  const stripped = stripProducts(text);
  return forms.some((form) => new RegExp(`\\b${form.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(stripped));
}

export function foodIsInMeal(meal: Meal, term: string): boolean {
  const forms = formsFor(term);
  if (forms.length === 0) return false;
  if (textHas(meal.name, forms) || textHas(meal.summary, forms)) return true;
  return meal.ingredients.some((item) => textHas(item.name, forms));
}

export function mealBlocked(meal: Meal, exclusions: string[] | undefined, keeps: string[] | undefined): boolean {
  const skipped = exclusions ?? [];
  const held = keeps ?? [];
  if (meal.id.startsWith("ours-") || held.includes(meal.id)) return false;
  return skipped.some((term) => foodIsInMeal(meal, term));
}
