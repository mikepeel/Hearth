import { useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { Heart, Search } from "lucide-react";
import { AddMealSheet } from "@/components/add-meal-sheet";
import { SnapRecipeSheet } from "@/components/snap-recipe-sheet";
import { SkipBar } from "@/components/skip-bar";
import { PickTray } from "@/components/pick-tray";
import { mealBlocked } from "@/lib/exclusions";
import { FILTERS, TAG_LABEL, allMeals, isOurs, type FilterId, type Meal } from "@/lib/meals";
import { lastCookedOn } from "@/lib/rotation";
import { usePlan, type NightKind } from "@/lib/plan-store";
import { cn } from "@/lib/utils";

export function IdeasView({
  picking,
  onCancelPick,
  onOpenMeal,
  onAssigned,
  dates,
}: {
  picking: { date: string; kind: "cook" | "leftovers" } | null;
  onCancelPick: () => void;
  onOpenMeal: (mealId: string) => void;
  onAssigned: () => void;
  dates: string[];
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterId | "ours" | "picked">("all");
  const [adding, setAdding] = useState(false);
  const [snapping, setSnapping] = useState(false);
  const favorites = usePlan((state) => state.favorites);
  const nights = usePlan((state) => state.nights);
  const customMeals = usePlan((state) => state.customMeals);
  const exclusions = usePlan((state) => state.exclusions);
  const keeps = usePlan((state) => state.keeps);
  const picks = usePlan((state) => state.picks);
  const togglePick = usePlan((state) => state.togglePick);
  const toggleFavorite = usePlan((state) => state.toggleFavorite);
  const assign = usePlan((state) => state.assign);

  const meals = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allMeals().filter((meal) => {
      if (meal.tags.includes("soup")) return false;
      if (mealBlocked(meal, exclusions, keeps)) return false;
      if (filter === "saved" && !favorites.includes(meal.id)) return false;
      if (filter === "ours" && !isOurs(meal)) return false;
      if (filter === "picked" && !picks.includes(meal.id)) return false;
      if (filter !== "all" && filter !== "saved" && filter !== "ours" && filter !== "picked" && !meal.tags.includes(filter)) return false;
      if (!q) return true;
      const haystack = [meal.name, meal.cuisine, meal.summary, ...meal.tags, ...meal.ingredients.map((item) => item.name)]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    }).sort((a, b) => Number(isOurs(b)) - Number(isOurs(a)) || a.name.localeCompare(b.name));
  }, [query, filter, favorites, customMeals, exclusions, keeps, picks]);

  const dinners = allMeals().filter((meal) => !meal.tags.includes("soup"));

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-clay">The library</p>
          <h2 className="mt-1 font-display text-4xl leading-tight text-ink sm:text-5xl">Meal ideas</h2>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Add the dinners you already make. Filling the week skips anything from the last three weeks, and puts yours first.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSnapping(true)}
            className="min-h-11 rounded-full border border-line bg-cream px-4 text-sm font-medium text-ink hover:border-clay focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
          >
            Snap a recipe
          </button>
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="min-h-11 rounded-full bg-clay px-4 text-sm font-medium text-cream hover:bg-clay-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
          >
            Add a dinner
          </button>
        </div>
      </div>

      <SkipBar meals={dinners} />

      <PickTray dates={dates} />

      {picking ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-ink px-4 py-3 text-cream">
          <p className="text-sm">
            {picking.kind === "leftovers" ? "Leftovers for" : "Planning"}{" "}
            <span className="font-medium">{format(parseISO(picking.date), "EEEE, MMM d")}</span>
            . Tap a dinner to add it.
          </p>
          <button
            type="button"
            onClick={onCancelPick}
            className="min-h-11 rounded-full bg-cream px-4 text-sm font-medium text-ink hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mist"
          >
            Cancel
          </button>
        </div>
      ) : null}

      <label className="relative block">
        <span className="sr-only">Search dinners</span>
        <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search chicken, pasta, tacos…"
          className="h-12 w-full rounded-full border border-line bg-cream pr-4 pl-11 text-ink placeholder:text-muted focus-visible:outline-2 focus-visible:outline-clay"
        />
      </label>

      <div className="max-w-full overflow-x-auto">
        <div className="flex w-max gap-2 pb-1">
          {[{ id: "picked" as const, label: "Picked" }, { id: "ours" as const, label: "Ours" }, ...FILTERS].map((item) => {
            const active = filter === item.id;
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(item.id)}
                className={cn(
                  "min-h-11 rounded-full border px-4 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay",
                  active ? "border-ink bg-ink text-cream" : "border-line bg-cream text-ink hover:border-clay",
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-sm text-muted tabular-nums">
        {meals.length} dinner{meals.length === 1 ? "" : "s"}
      </p>

      {meals.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-line bg-cream px-5 py-10 text-center">
          <p className="font-display text-2xl text-ink">
            {filter === "saved" ? "Nothing saved yet" : filter === "ours" ? "None of yours yet" : filter === "picked" ? "Nothing picked yet" : "No dinners match"}
          </p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
            {filter === "ours"
              ? "Add one you already cook. A name and a few ingredients is enough."
              : filter === "picked"
                ? "Pick a few dinners, then plan the open nights from that list."
                : filter === "saved"
                ? "Tap the heart on a dinner to keep it here."
                : "Try another word, or clear the filters."}
          </p>
          {filter !== "all" || query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setFilter("all");
              }}
              className="mt-4 min-h-11 rounded-full bg-clay px-4 text-sm font-medium text-cream hover:bg-clay-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
            >
              Show everything
            </button>
          ) : null}
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {meals.map((meal) => (
            <li key={meal.id}>
              <MealCard
                meal={meal}
                saved={favorites.includes(meal.id)}
                picked={picks.includes(meal.id)}
                lastCooked={lastCookedOn(nights, meal.id)}
                picking={picking}
                onOpen={() => onOpenMeal(meal.id)}
                onAssign={() => {
                  if (!picking) return;
                  assign(picking.date, meal.id, picking.kind);
                  onAssigned();
                }}
                onToggleSave={() => toggleFavorite(meal.id)}
                onTogglePick={() => togglePick(meal.id)}
              />
            </li>
          ))}
        </ul>
      )}
      <AddMealSheet open={adding} onClose={() => setAdding(false)} />
      <SnapRecipeSheet open={snapping} onClose={() => setSnapping(false)} />
    </div>
  );
}

function MealCard({
  meal,
  saved,
  picked,
  lastCooked,
  picking,
  onOpen,
  onAssign,
  onToggleSave,
  onTogglePick,
}: {
  meal: Meal;
  saved: boolean;
  picked: boolean;
  lastCooked: string | null;
  picking: { date: string; kind: NightKind } | null;
  onOpen: () => void;
  onAssign: () => void;
  onToggleSave: () => void;
  onTogglePick: () => void;
}) {
  const bits = [
    `${meal.minutes} min`,
    meal.effort,
    ...meal.tags.filter((tag) => tag !== "quick").slice(0, 2).map((tag) => TAG_LABEL[tag]),
  ];

  return (
    <article className="flex h-full flex-col rounded-3xl border border-line bg-cream p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-widest text-clay">{meal.cuisine}</p>
        <div className="flex items-center gap-1">
          {picking ? null : (
            <button
              type="button"
              aria-pressed={picked}
              onClick={onTogglePick}
              className={cn(
                "min-h-11 rounded-full px-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay",
                picked ? "bg-ink text-cream" : "text-muted hover:bg-paper hover:text-ink",
              )}
            >
              {picked ? "Picked" : "Pick"}
            </button>
          )}
          <button
            type="button"
            aria-pressed={saved}
            aria-label={saved ? `Remove ${meal.name} from saved` : `Save ${meal.name}`}
            onClick={onToggleSave}
            className="inline-flex size-11 items-center justify-center rounded-full text-muted hover:bg-paper hover:text-clay focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
          >
            <Heart className={cn("size-4", saved && "fill-clay text-clay")} />
          </button>
        </div>
      </div>
      <button
        type="button"
        onClick={picking ? onAssign : onOpen}
        className="mt-1 flex flex-1 flex-col text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
      >
        <h3 className="font-display text-2xl leading-tight text-ink">{meal.name}</h3>
        <p className="mt-2 flex-1 text-sm text-muted">{meal.summary}</p>
        <p className="mt-4 text-xs text-muted">
          {bits.join(" · ")}
          {lastCooked ? ` · Last made ${format(parseISO(lastCooked), "MMM d")}` : ""}
        </p>
        <span className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-clay px-4 text-sm font-medium text-cream">
          {picking ? (picking.kind === "leftovers" ? "Use as leftovers" : "Add to this night") : "See recipe"}
        </span>
      </button>
    </article>
  );
}
