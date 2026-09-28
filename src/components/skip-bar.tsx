import { useState } from "react";
import { foodIsInMeal, mealBlocked } from "@/lib/exclusions";
import type { Meal } from "@/lib/meals";
import { usePlan } from "@/lib/plan-store";

export function SkipBar({ meals }: { meals: Meal[] }) {
  const exclusions = usePlan((state) => state.exclusions);
  const keeps = usePlan((state) => state.keeps);
  const addExclusion = usePlan((state) => state.addExclusion);
  const removeExclusion = usePlan((state) => state.removeExclusion);
  const keepMeal = usePlan((state) => state.keepMeal);
  const unkeepMeal = usePlan((state) => state.unkeepMeal);
  const [draft, setDraft] = useState("");
  const [showHidden, setShowHidden] = useState(false);

  const hidden = meals.filter((meal) => mealBlocked(meal, exclusions, keeps));
  const kept = meals.filter(
    (meal) => keeps.includes(meal.id) && exclusions.some((term) => foodIsInMeal(meal, term)),
  );

  return (
    <section className="rounded-3xl border border-line bg-cream px-4 py-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="font-display text-xl text-ink">Skip dishes built on</h3>
          <p className="mt-1 max-w-xl text-sm text-muted">
            A canned soup still counts as itself. Cream of mushroom soup will not hide a casserole.
          </p>
        </div>
        <form
          className="flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            addExclusion(draft);
            setDraft("");
          }}
        >
          <label className="sr-only" htmlFor="skip-ingredient">
            Ingredient to skip
          </label>
          <input
            id="skip-ingredient"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Add an ingredient"
            className="h-11 w-40 rounded-full border border-line bg-paper px-3 text-sm text-ink placeholder:text-muted focus-visible:outline-2 focus-visible:outline-clay sm:w-48"
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            className="min-h-11 rounded-full bg-ink px-4 text-sm font-medium text-cream disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
          >
            Skip
          </button>
        </form>
      </div>
      {exclusions.length > 0 ? (
        <ul className="mt-3 flex flex-wrap gap-2">
          {exclusions.map((term) => (
            <li key={term}>
              <button
                type="button"
                onClick={() => removeExclusion(term)}
                className="min-h-11 rounded-full border border-line bg-paper px-3 text-sm text-ink hover:border-clay focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
              >
                {term}
                <span className="sr-only">, remove</span>
                <span aria-hidden="true"> ×</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-muted">Nothing skipped.</p>
      )}
      {hidden.length > 0 ? (
        <div className="mt-3">
          <button
            type="button"
            aria-expanded={showHidden}
            onClick={() => setShowHidden((open) => !open)}
            className="min-h-11 text-sm font-medium text-clay-deep hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
          >
            {hidden.length} hidden · {showHidden ? "Hide the list" : "Show them"}
          </button>
          {showHidden ? (
            <ul className="mt-1 flex flex-col">
              {hidden.map((meal) => (
                <li key={meal.id} className="flex items-center justify-between gap-3 border-t border-line py-2">
                  <span className="text-sm text-ink">{meal.name}</span>
                  <button
                    type="button"
                    onClick={() => keepMeal(meal.id)}
                    className="min-h-11 shrink-0 rounded-full px-3 text-sm text-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
                  >
                    Keep this one
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
      {kept.length > 0 ? (
        <ul className="mt-2 flex flex-col">
          {kept.map((meal) => (
            <li key={meal.id} className="flex items-center justify-between gap-3 text-sm text-muted">
              <span>Keeping {meal.name}</span>
              <button
                type="button"
                onClick={() => unkeepMeal(meal.id)}
                className="min-h-11 rounded-full px-3 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
              >
                Hide again
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
