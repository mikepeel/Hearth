import { format, parseISO } from "date-fns";
import { Check, Minus, Plus } from "lucide-react";
import { formatItemName, formatQty } from "@/lib/format";
import { TAG_LABEL, getMeal } from "@/lib/meals";
import { usePlan } from "@/lib/plan-store";
import { cn } from "@/lib/utils";
import { Sheet } from "@/components/sheet";

export function MealDialog({
  mealId,
  date,
  weekDates,
  onClose,
  onPlanned,
}: {
  mealId: string | null;
  date?: string;
  weekDates: Date[];
  onClose: () => void;
  onPlanned: () => void;
}) {
  const meal = getMeal(mealId ?? undefined);
  const night = usePlan((state) => (date ? state.nights[date] : undefined));
  const favorites = usePlan((state) => state.favorites);
  const assign = usePlan((state) => state.assign);
  const setServings = usePlan((state) => state.setServings);
  const toggleCooked = usePlan((state) => state.toggleCooked);
  const toggleFavorite = usePlan((state) => state.toggleFavorite);
  const removeMeal = usePlan((state) => state.removeMeal);
  const picks = usePlan((state) => state.picks);
  const togglePick = usePlan((state) => state.togglePick);

  const plannedHere = Boolean(meal && night?.mealId === meal.id);
  const factor = meal && plannedHere && night ? night.servings / meal.servings : 1;
  const saved = meal ? favorites.includes(meal.id) : false;

  return (
    <Sheet
      open={Boolean(meal)}
      onClose={onClose}
      title={meal?.name ?? "Dinner"}
      description={meal ? `${meal.cuisine} · ${meal.minutes} min · ${meal.effort}` : undefined}
    >
      {meal ? (
        <div className="flex flex-col gap-6">
          <p className="text-pretty text-ink">{meal.summary}</p>
          <div className="flex flex-wrap gap-2">
            {meal.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-clay-soft px-3 py-1 text-xs font-medium text-clay-deep">
                {TAG_LABEL[tag]}
              </span>
            ))}
            <button
              type="button"
              onClick={() => toggleFavorite(meal.id)}
              className="min-h-11 rounded-full px-3 text-sm font-medium text-clay hover:bg-clay-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
            >
              {saved ? "Saved" : "Save"}
            </button>
          </div>

          {plannedHere && night && date ? (
            <div className="rounded-2xl border border-line bg-paper p-4">
              <p className="text-xs font-medium uppercase tracking-widest text-muted">
                {format(parseISO(date), "EEEE")}
              </p>
              <div className="mt-3 flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-ink">Servings</p>
                  <p className="text-sm text-muted">Grocery amounts follow this.</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    aria-label="Fewer servings"
                    onClick={() => setServings(date, night.servings - 1)}
                    className="inline-flex size-11 items-center justify-center rounded-full border border-line bg-cream text-ink hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
                  >
                    <Minus className="size-4" />
                  </button>
                  <span className="w-8 text-center font-display text-2xl tabular-nums">{night.servings}</span>
                  <button
                    type="button"
                    aria-label="More servings"
                    onClick={() => setServings(date, night.servings + 1)}
                    className="inline-flex size-11 items-center justify-center rounded-full border border-line bg-cream text-ink hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggleCooked(date)}
                className={cn(
                  "mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay",
                  night.cooked ? "bg-sage text-cream" : "bg-cream text-ink ring-1 ring-line",
                )}
              >
                <Check className="size-4" />
                {night.cooked ? "Cooked" : "Mark cooked"}
              </button>
            </div>
          ) : null}

          <section>
            <h3 className="text-xs font-medium uppercase tracking-widest text-muted">Ingredients</h3>
            <ul className="mt-2 divide-y divide-line">
              {meal.ingredients.map((item) => (
                <li key={`${item.name}-${item.unit}`} className="flex items-baseline justify-between gap-3 py-2 text-sm">
                  <span>{formatItemName(item.amount * factor, item.unit, item.name)}</span>
                  <span className="shrink-0 tabular-nums text-muted">
                    {formatQty(item.amount * factor, item.unit)}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-xs font-medium uppercase tracking-widest text-muted">Method</h3>
            <ol className="mt-3 list-decimal space-y-3 pl-5 text-sm text-ink">
              {meal.steps.map((step) => (
                <li key={step} className="pl-1">
                  {step}
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h3 className="text-xs font-medium uppercase tracking-widest text-muted">Add to the week</h3>
            {meal ? (
              <button
                type="button"
                aria-pressed={picks.includes(meal.id)}
                onClick={() => togglePick(meal.id)}
                className={cn(
                  "mt-3 min-h-11 rounded-full px-4 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay",
                  picks.includes(meal.id) ? "bg-ink text-cream" : "border border-line bg-paper text-ink",
                )}
              >
                {picks.includes(meal.id) ? "Picked for a plan" : "Pick for a plan"}
              </button>
            ) : null}
            <div className="mt-3 grid grid-cols-2 gap-2">
              {weekDates.map((day) => {
                const key = format(day, "yyyy-MM-dd");
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      assign(key, meal.id);
                      onPlanned();
                    }}
                    className="min-h-11 rounded-2xl border border-line bg-paper px-3 text-sm font-medium text-ink hover:border-clay hover:bg-clay-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
                  >
                    {format(day, "EEE d")}
                  </button>
                );
              })}
            </div>
            {meal.id.startsWith("ours-") ? (
              <button
                type="button"
                onClick={() => {
                  removeMeal(meal.id);
                  onClose();
                }}
                className="mt-3 min-h-11 text-sm text-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
              >
                Remove from our dinners
              </button>
            ) : null}
          </section>
        </div>
      ) : null}
    </Sheet>
  );
}
