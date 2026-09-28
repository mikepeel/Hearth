import { useState } from "react";
import type { Meal, Tag } from "@/lib/meals";
import { TAG_LABEL } from "@/lib/meals";
import { parseIngredientLines } from "@/lib/parse-ingredient";
import { usePlan } from "@/lib/plan-store";
import { cn } from "@/lib/utils";
import { Sheet } from "@/components/sheet";

const TAGS = Object.keys(TAG_LABEL) as Tag[];

const fieldClass =
  "w-full rounded-2xl border border-line bg-paper px-3 py-3 text-sm text-ink placeholder:text-muted focus-visible:outline-2 focus-visible:outline-clay";

export function AddMealSheet({
  open,
  onClose,
  asSoup = false,
}: {
  open: boolean;
  onClose: () => void;
  asSoup?: boolean;
}) {
  const addMeal = usePlan((state) => state.addMeal);
  const [name, setName] = useState("");
  const [summary, setSummary] = useState("");
  const [minutes, setMinutes] = useState("30");
  const [servings, setServings] = useState("4");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");
  const [tags, setTags] = useState<Tag[]>(asSoup ? ["soup"] : []);

  function reset() {
    setName("");
    setSummary("");
    setMinutes("30");
    setServings("4");
    setIngredients("");
    setSteps("");
    setTags(asSoup ? ["soup"] : []);
  }

  function save() {
    const trimmed = name.trim();
    if (!trimmed) return;
    const parsed = parseIngredientLines(ingredients);
    const method = steps
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const slug = trimmed
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40);
    const meal: Meal = {
      id: `ours-${slug || "dinner"}-${Math.random().toString(36).slice(2, 6)}`,
      name: trimmed,
      cuisine: "Ours",
      minutes: clamp(Number(minutes), 5, 180, 30),
      servings: clamp(Number(servings), 1, 12, 4),
      effort: Number(minutes) > 40 ? "Steady" : "Easy",
      tags: asSoup && !tags.includes("soup") ? [...tags, "soup"] : tags,
      summary: summary.trim() || (asSoup ? "A soup you already make." : "One of the dinners you already make."),
      ingredients: parsed.length > 0 ? parsed : [{ name: trimmed, amount: 1, unit: "", aisle: "Pantry" }],
      steps: method.length > 0 ? method : ["Cook it the way you usually do."],
    };
    addMeal(meal);
    reset();
    onClose();
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={asSoup ? "Add a soup" : "Add a dinner"}
      description={
        asSoup
          ? "A name is enough. It stays under Soups you love, separate from the dinner ideas."
          : "A name is enough. Ingredients, one per line, turn into the grocery list."
      }
    >
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          save();
        }}
      >
        <label className="block text-sm font-medium text-ink">
          Name
          <input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={asSoup ? "Chicken noodle" : "Chicken piccata"}
            className={cn(fieldClass, "mt-1")}
          />
        </label>
        <label className="block text-sm font-medium text-ink">
          What it's like
          <input
            value={summary}
            onChange={(event) => setSummary(event.target.value)}
            placeholder="Bright, lemony, on the table in half an hour"
            className={cn(fieldClass, "mt-1")}
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-sm font-medium text-ink">
            Minutes
            <input
              inputMode="numeric"
              value={minutes}
              onChange={(event) => setMinutes(event.target.value)}
              className={cn(fieldClass, "mt-1 tabular-nums")}
            />
          </label>
          <label className="block text-sm font-medium text-ink">
            Servings
            <input
              inputMode="numeric"
              value={servings}
              onChange={(event) => setServings(event.target.value)}
              className={cn(fieldClass, "mt-1 tabular-nums")}
            />
          </label>
        </div>
        <fieldset>
          <legend className="text-sm font-medium text-ink">Tags</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {TAGS.map((tag) => {
              const on = tags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setTags((current) => (on ? current.filter((item) => item !== tag) : [...current, tag]))}
                  className={cn(
                    "min-h-11 rounded-full border px-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay",
                    on ? "border-ink bg-ink text-cream" : "border-line bg-paper text-ink",
                  )}
                >
                  {TAG_LABEL[tag]}
                </button>
              );
            })}
          </div>
        </fieldset>
        <label className="block text-sm font-medium text-ink">
          Ingredients
          <textarea
            value={ingredients}
            onChange={(event) => setIngredients(event.target.value)}
            rows={5}
            placeholder={"1.5 lb chicken breast\n2 lemons\ncapers"}
            className={cn(fieldClass, "mt-1")}
          />
        </label>
        <label className="block text-sm font-medium text-ink">
          Steps
          <textarea
            value={steps}
            onChange={(event) => setSteps(event.target.value)}
            rows={4}
            placeholder={"Pound the chicken.\nSear it, then make the lemon-caper sauce."}
            className={cn(fieldClass, "mt-1")}
          />
        </label>
        <button
          type="submit"
          disabled={!name.trim()}
          className="min-h-11 rounded-full bg-clay px-4 text-sm font-medium text-cream hover:bg-clay-deep disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
        >
          {asSoup ? "Save to our soups" : "Save to our dinners"}
        </button>
      </form>
    </Sheet>
  );
}

function clamp(value: number, min: number, max: number, fallback: number): number {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, Math.round(value)));
}
