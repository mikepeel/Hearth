import { useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { Heart } from "lucide-react";
import { AddMealSheet } from "@/components/add-meal-sheet";
import { SnapRecipeSheet } from "@/components/snap-recipe-sheet";
import { SkipBar } from "@/components/skip-bar";
import { PickTray } from "@/components/pick-tray";
import { mealBlocked } from "@/lib/exclusions";
import { allMeals, type Meal } from "@/lib/meals";
import { lastCookedOn } from "@/lib/rotation";
import { tasteScore } from "@/lib/taste";
import { isLovedSoup, soupScore } from "@/lib/soups";
import { usePlan } from "@/lib/plan-store";
import { cn } from "@/lib/utils";

export function SoupsView({
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
  const [adding, setAdding] = useState(false);
  const [snapping, setSnapping] = useState(false);
  const nights = usePlan((state) => state.nights);
  const favorites = usePlan((state) => state.favorites);
  const customMeals = usePlan((state) => state.customMeals);
  const exclusions = usePlan((state) => state.exclusions);
  const keeps = usePlan((state) => state.keeps);
  const picks = usePlan((state) => state.picks);
  const tastes = usePlan((state) => state.tastes);
  const togglePick = usePlan((state) => state.togglePick);
  const toggleFavorite = usePlan((state) => state.toggleFavorite);
  const assign = usePlan((state) => state.assign);

  const { loved, close, lane } = useMemo(() => {
    const soups = allMeals().filter((meal) => meal.tags.includes("soup") && !mealBlocked(meal, exclusions, keeps));
    const lovedMeals = soups.filter((meal) => isLovedSoup(meal, favorites));
    const rest = soups
      .filter((meal) => !isLovedSoup(meal, favorites))
      .map((meal, index) => ({ meal, index, score: soupScore(meal, nights, favorites) }));
    rest.sort(
      (a, b) =>
        b.score + tasteScore(b.meal, tastes) - (a.score + tasteScore(a.meal, tastes)) || a.index - b.index,
    );
    return {
      loved: lovedMeals,
      close: rest.filter((item) => item.score > 0).map((item) => item.meal),
      lane: rest.filter((item) => item.score === 0).map((item) => item.meal),
    };
  }, [nights, favorites, customMeals, exclusions, keeps, tastes]);

  const soupMeals = allMeals().filter((meal) => meal.tags.includes("soup"));

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-clay">A pot of its own</p>
          <h2 className="mt-1 font-display text-4xl leading-tight text-ink sm:text-5xl">Soups</h2>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Keep the ones you already love up top. The rest follow the dinners in your kitchen, so a soup night is not a random recipe.
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
            Add a soup
          </button>
        </div>
      </div>

      <SkipBar meals={soupMeals} />

      <PickTray dates={dates} />

      {picking ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-ink px-4 py-3 text-cream">
          <p className="text-sm">
            {picking.kind === "leftovers" ? "Leftovers for" : "Planning"}{" "}
            <span className="font-medium">{format(parseISO(picking.date), "EEEE, MMM d")}</span>. Tap a soup to add it.
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

      <section className="flex flex-col gap-3">
        <h3 className="font-display text-2xl text-ink">Soups you love</h3>
        {loved.length === 0 ? (
          <p className="max-w-xl text-sm text-muted">
            Nothing here yet. Add the pot you make on repeat, or heart a suggestion and it moves up.
          </p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {loved.map((meal) => (
              <li key={meal.id}>
                <SoupCard
                  meal={meal}
                  saved={favorites.includes(meal.id)}
                  picked={picks.includes(meal.id)}
                  lastCooked={lastCookedOn(nights, meal.id)}
                  picking={Boolean(picking)}
                  leftovers={picking?.kind === "leftovers"}
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
      </section>

      {close.length > 0 ? (
        <SoupGroup
          title="Closest to your week"
          note="These line up with dinners you've already planned, cooked, or saved."
          meals={close}
          nights={nights}
          favorites={favorites}
          picking={picking}
          onOpenMeal={onOpenMeal}
          onAssigned={onAssigned}
        />
      ) : null}

      {lane.length > 0 ? (
        <SoupGroup
          title={close.length > 0 ? "Also in the lane" : "In the same lane"}
          note="Each one is a dinner you already have, turned into a bowl."
          meals={lane}
          nights={nights}
          favorites={favorites}
          picking={picking}
          onOpenMeal={onOpenMeal}
          onAssigned={onAssigned}
        />
      ) : null}

      <AddMealSheet open={adding} asSoup onClose={() => setAdding(false)} />
      <SnapRecipeSheet open={snapping} asSoup onClose={() => setSnapping(false)} />
    </div>
  );
}

function SoupGroup({
  title,
  note,
  meals,
  nights,
  favorites,
  picking,
  onOpenMeal,
  onAssigned,
}: {
  title: string;
  note: string;
  meals: Meal[];
  nights: ReturnType<typeof usePlan.getState>["nights"];
  favorites: string[];
  picking: { date: string; kind: "cook" | "leftovers" } | null;
  onOpenMeal: (mealId: string) => void;
  onAssigned: () => void;
}) {
  const assign = usePlan((state) => state.assign);
  const toggleFavorite = usePlan((state) => state.toggleFavorite);
  const picks = usePlan((state) => state.picks);
  const togglePick = usePlan((state) => state.togglePick);
  return (
    <section className="flex flex-col gap-3">
      <div>
        <h3 className="font-display text-2xl text-ink">{title}</h3>
        <p className="mt-1 max-w-xl text-sm text-muted">{note}</p>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {meals.map((meal) => (
          <li key={meal.id}>
            <SoupCard
              meal={meal}
              saved={favorites.includes(meal.id)}
              picked={picks.includes(meal.id)}
              lastCooked={lastCookedOn(nights, meal.id)}
              picking={Boolean(picking)}
              leftovers={picking?.kind === "leftovers"}
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
    </section>
  );
}

function SoupCard({
  meal,
  saved,
  picked,
  lastCooked,
  picking,
  leftovers,
  onOpen,
  onAssign,
  onToggleSave,
  onTogglePick,
}: {
  meal: Meal;
  saved: boolean;
  picked: boolean;
  lastCooked: string | null;
  picking: boolean;
  leftovers: boolean;
  onOpen: () => void;
  onAssign: () => void;
  onToggleSave: () => void;
  onTogglePick: () => void;
}) {
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
        <p className="mt-2 flex-1 text-sm text-muted">{meal.because ?? meal.summary}</p>
        <p className="mt-4 text-xs text-muted">
          {meal.minutes} min
          {lastCooked ? ` · Last made ${format(parseISO(lastCooked), "MMM d")}` : ""}
        </p>
        <span className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-clay px-4 text-sm font-medium text-cream">
          {picking ? (leftovers ? "Use as leftovers" : "Add to this night") : "See recipe"}
        </span>
      </button>
    </article>
  );
}
