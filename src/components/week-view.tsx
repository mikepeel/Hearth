import { useState } from "react";
import { addDays, format, isSameDay, parseISO } from "date-fns";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { formatDuration } from "@/lib/format";
import { allMeals, getMeal, isOurs } from "@/lib/meals";
import { usePlan, type NightKind } from "@/lib/plan-store";
import { mealBlocked } from "@/lib/exclusions";
import { lastCookedOn, variedPool } from "@/lib/rotation";
import { cn } from "@/lib/utils";
import { Sheet } from "@/components/sheet";
import { tasteScore } from "@/lib/taste";
import { PickTray } from "@/components/pick-tray";

function dayKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function WeekView({
  weekMonday,
  dates,
  onShift,
  onThisWeek,
  showJump,
  onPick,
  onOpenMeal,
  onBrowse,
}: {
  weekMonday: Date;
  dates: Date[];
  onShift: (dir: -1 | 1) => void;
  onThisWeek: () => void;
  showJump: boolean;
  onPick: (date: string, kind: "cook" | "leftovers") => void;
  onOpenMeal: (mealId: string, date?: string) => void;
  onBrowse: () => void;
}) {
  const nights = usePlan((state) => state.nights);
  const favorites = usePlan((state) => state.favorites);
  const exclusions = usePlan((state) => state.exclusions);
  const keeps = usePlan((state) => state.keeps);
  const tastes = usePlan((state) => state.tastes);
  const assign = usePlan((state) => state.assign);
  const markOut = usePlan((state) => state.markOut);
  const clearNight = usePlan((state) => state.clearNight);
  const toggleCooked = usePlan((state) => state.toggleCooked);
  const fillOpenNights = usePlan((state) => state.fillOpenNights);
  const clearWeek = usePlan((state) => state.clearWeek);
  const [activeDate, setActiveDate] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  const today = new Date();
  const todayKey = dayKey(today);
  const inView = dates.some((date) => dayKey(date) === todayKey);
  const tonight = inView ? nights[todayKey] : undefined;
  const tonightMeal = getMeal(tonight?.mealId);
  const keys = dates.map(dayKey);
  const openCount = keys.filter((key) => !nights[key]).length;

  let cook = 0;
  let out = 0;
  let leftovers = 0;
  let minutes = 0;
  for (const key of keys) {
    const night = nights[key];
    if (!night) continue;
    if (night.kind === "out") out += 1;
    else if (night.kind === "leftovers") leftovers += 1;
    else {
      cook += 1;
      const meal = getMeal(night.mealId);
      if (meal) minutes += meal.minutes;
    }
  }

  const used = new Set(keys.map((key) => nights[key]?.mealId).filter((id): id is string => Boolean(id)));
  const featured = allMeals()
    .filter((meal) => !used.has(meal.id) && !meal.tags.includes("soup") && !mealBlocked(meal, exclusions, keeps))
    .sort(
      (a, b) =>
        tasteScore(b, tastes) - tasteScore(a, tastes) ||
        Number(isOurs(b)) - Number(isOurs(a)) ||
        a.name.localeCompare(b.name),
    )
    .slice(0, 6);
  const active = activeDate ? nights[activeDate] : undefined;
  const activeMeal = getMeal(active?.mealId);
  const rangeEnd = addDays(weekMonday, 6);

  function surprise() {
    const pick = variedPool(
      allMeals().filter(
        (meal) =>
          !mealBlocked(meal, exclusions, keeps) &&
          (isOurs(meal) || (!meal.tags.includes("soup") && meal.tags.includes("quick"))),
      ),
      nights,
      used,
      favorites,
      tastes,
    )[0];
    if (pick) assign(todayKey, pick.id);
  }

  const summary =
    cook + out + leftovers === 0
      ? "Nothing locked in yet."
      : [
          cook ? `${cook} at home` : null,
          out ? `${out} out` : null,
          leftovers ? `${leftovers} leftovers` : null,
          minutes ? `${formatDuration(minutes)} of cooking` : null,
        ]
          .filter(Boolean)
          .join(" · ");

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-clay">This week</p>
          <h2 className="mt-1 font-display text-4xl leading-tight text-ink sm:text-5xl">
            {format(weekMonday, "MMM d")} – {format(rangeEnd, "MMM d")}
          </h2>
          <p className="mt-2 text-sm text-muted">{summary}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Previous week"
              onClick={() => onShift(-1)}
              className="inline-flex size-11 items-center justify-center rounded-full border border-line bg-cream text-ink hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Next week"
              onClick={() => onShift(1)}
              className="inline-flex size-11 items-center justify-center rounded-full border border-line bg-cream text-ink hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
          {showJump ? (
            <button
              type="button"
              onClick={onThisWeek}
              className="min-h-11 rounded-full px-4 text-sm font-medium text-ink hover:bg-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
            >
              Back to this week
            </button>
          ) : null}
          <button
            type="button"
            disabled={openCount === 0}
            onClick={() => fillOpenNights(keys)}
            className="min-h-11 rounded-full bg-clay px-4 text-sm font-medium text-cream hover:bg-clay-deep disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
          >
            Fill open nights
          </button>
        </div>
      </div>

      <PickTray dates={keys} />

      {inView ? (
        <section className="rounded-3xl bg-ink px-5 py-6 text-cream sm:px-8 sm:py-8">
          <p className="text-xs font-medium uppercase tracking-widest text-mist">
            Tonight · {format(today, "EEEE")}
          </p>
          {tonight?.kind === "out" ? (
            <>
              <h3 className="mt-2 font-display text-4xl leading-tight">Eating out</h3>
              <p className="mt-3 max-w-xl text-mist">The kitchen is off duty. Change your mind whenever.</p>
              <button
                type="button"
                onClick={() => onPick(todayKey, "cook")}
                className="mt-5 min-h-11 rounded-full bg-clay px-4 text-sm font-medium text-cream hover:bg-clay-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mist"
              >
                Plan something instead
              </button>
            </>
          ) : tonight?.kind === "leftovers" ? (
            <>
              <h3 className="mt-2 font-display text-4xl leading-tight">
                {tonightMeal ? `Leftovers · ${tonightMeal.name}` : "Leftovers"}
              </h3>
              <p className="mt-3 max-w-xl text-mist">Nothing new to buy. Heat, eat, done.</p>
            </>
          ) : tonightMeal && tonight ? (
            <>
              <h3 className="mt-2 max-w-3xl font-display text-4xl leading-tight sm:text-5xl">
                {tonightMeal.name}
              </h3>
              <p className="mt-3 max-w-xl text-mist">{tonightMeal.summary}</p>
              <p className="mt-4 text-sm text-mist">
                {tonightMeal.minutes} min · Serves {tonight.servings} · {tonightMeal.effort}
                {tonight.cooked ? " · Cooked" : ""}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onOpenMeal(tonightMeal.id, todayKey)}
                  className="min-h-11 rounded-full bg-clay px-4 text-sm font-medium text-cream hover:bg-clay-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mist"
                >
                  Open recipe
                </button>
                <button
                  type="button"
                  onClick={() => toggleCooked(todayKey)}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-cream px-4 text-sm font-medium text-ink hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mist"
                >
                  <Check className="size-4" />
                  {tonight.cooked ? "Cooked" : "Mark cooked"}
                </button>
              </div>
            </>
          ) : (
            <>
              <h3 className="mt-2 font-display text-4xl leading-tight">Tonight is still open</h3>
              <p className="mt-3 max-w-xl text-mist">Pick something quick, or let Hearth choose.</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={surprise}
                  className="min-h-11 rounded-full bg-clay px-4 text-sm font-medium text-cream hover:bg-clay-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mist"
                >
                  Surprise me
                </button>
                <button
                  type="button"
                  onClick={() => onPick(todayKey, "cook")}
                  className="min-h-11 rounded-full bg-cream px-4 text-sm font-medium text-ink hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mist"
                >
                  Browse ideas
                </button>
              </div>
            </>
          )}
        </section>
      ) : null}

      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="font-display text-2xl text-ink">The table</h3>
          {cook + out + leftovers > 0 ? (
            <button
              type="button"
              onClick={() => {
                if (!confirmClear) {
                  setConfirmClear(true);
                  return;
                }
                clearWeek(keys, dayKey(weekMonday));
                setConfirmClear(false);
              }}
              className="min-h-11 rounded-full px-3 text-sm text-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
            >
              {confirmClear ? "Confirm clear" : "Clear week"}
            </button>
          ) : null}
        </div>
        <ul className="overflow-hidden rounded-3xl border border-line bg-cream">
          {dates.map((date, index) => {
            const key = dayKey(date);
            const night = nights[key];
            const meal = getMeal(night?.mealId);
            const isToday = isSameDay(date, today);
            const label = nightLabel(night?.kind, meal?.name);
            const previous = meal ? lastCookedOn(nights, meal.id, key) : null;
            return (
              <li key={key} className={index > 0 ? "border-t border-line" : undefined}>
                <button
                  type="button"
                  onClick={() => setActiveDate(key)}
                  className={cn(
                    "flex w-full items-center gap-4 px-4 py-4 text-left transition-colors duration-200 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-clay",
                    isToday ? "bg-clay-soft" : "hover:bg-paper",
                  )}
                >
                  <span className="w-14 shrink-0">
                    <span className="block text-xs font-medium uppercase tracking-widest text-muted">
                      {isToday ? "Today" : format(date, "EEE")}
                    </span>
                    <span className="font-display text-2xl leading-none tabular-nums text-ink">
                      {format(date, "d")}
                    </span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={cn("block font-display text-xl leading-tight", meal || night ? "text-ink" : "text-muted italic")}>
                      {label}
                    </span>
                    <span className="mt-1 block text-sm text-muted">
                      {meal && night?.kind === "cook"
                        ? `${meal.minutes} min · Serves ${night.servings}${night.cooked ? " · Cooked" : ""}${previous ? ` · Last ${format(parseISO(previous), "MMM d")}` : ""}`
                        : night
                          ? night.kind === "out"
                            ? "No cooking"
                            : meal
                              ? "Already made"
                              : "From earlier this week"
                          : "Tap to plan"}
                    </span>
                  </span>
                  <ChevronRight className="size-4 shrink-0 text-muted" aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {featured.length > 0 ? (
        <section>
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <h3 className="font-display text-2xl text-ink">Ideas to try</h3>
            <button
              type="button"
              onClick={onBrowse}
              className="min-h-11 rounded-full px-3 text-sm font-medium text-clay hover:bg-clay-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
            >
              See all
            </button>
          </div>
          <div className="max-w-full overflow-x-auto">
            <ul className="flex w-max gap-3 pb-1">
              {featured.map((meal) => (
                <li key={meal.id}>
                  <button
                    type="button"
                    onClick={() => onOpenMeal(meal.id)}
                    className="flex h-full w-64 flex-col rounded-3xl border border-line bg-cream p-4 text-left hover:border-clay focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
                  >
                    <span className="text-xs font-medium uppercase tracking-widest text-clay">{meal.cuisine}</span>
                    <span className="mt-2 font-display text-xl leading-tight text-ink">{meal.name}</span>
                    <span className="mt-2 text-sm text-muted">{meal.minutes} min · {meal.effort}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <Sheet
        open={Boolean(activeDate)}
        onClose={() => setActiveDate(null)}
        title={activeDate ? format(parseISO(activeDate), "EEEE, MMM d") : "Night"}
        description={activeMeal?.summary ?? (active?.kind === "out" ? "Eating out." : "Nothing planned yet.")}
      >
        {activeDate ? (
          <div className="flex flex-col gap-2">
            {activeMeal && active?.kind !== "out" ? (
              <button
                type="button"
                onClick={() => {
                  onOpenMeal(activeMeal.id, activeDate);
                  setActiveDate(null);
                }}
                className="min-h-11 rounded-full bg-clay px-4 text-sm font-medium text-cream hover:bg-clay-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
              >
                Open recipe
              </button>
            ) : null}
            {active?.kind === "cook" && active.mealId ? (
              <button
                type="button"
                onClick={() => toggleCooked(activeDate)}
                className="min-h-11 rounded-full bg-sage-soft px-4 text-sm font-medium text-sage focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
              >
                {active.cooked ? "Mark as not cooked" : "Mark cooked"}
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => {
                onPick(activeDate, "cook");
                setActiveDate(null);
              }}
              className="min-h-11 rounded-full bg-clay-soft px-4 text-sm font-medium text-clay-deep hover:bg-clay hover:text-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
            >
              {active?.mealId && active.kind === "cook" ? "Choose a different meal" : "Choose a meal"}
            </button>
            <button
              type="button"
              onClick={() => {
                markOut(activeDate);
                setActiveDate(null);
              }}
              className="min-h-11 rounded-full px-4 text-sm font-medium text-ink hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
            >
              Eating out
            </button>
            <button
              type="button"
              onClick={() => {
                onPick(activeDate, "leftovers");
                setActiveDate(null);
              }}
              className="min-h-11 rounded-full px-4 text-sm font-medium text-ink hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
            >
              Leftovers from a meal
            </button>
            {active ? (
              <button
                type="button"
                onClick={() => {
                  clearNight(activeDate);
                  setActiveDate(null);
                }}
                className="min-h-11 rounded-full px-4 text-sm text-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
              >
                Clear this night
              </button>
            ) : null}
          </div>
        ) : null}
      </Sheet>
    </div>
  );
}

function nightLabel(kind: NightKind | undefined, mealName?: string): string {
  if (!kind) return "Open night";
  if (kind === "out") return "Eating out";
  if (kind === "leftovers") return mealName ? `Leftovers · ${mealName}` : "Leftovers";
  return mealName ?? "Open night";
}
