import { useEffect, useMemo, useState } from "react";
import { addDays, startOfWeek } from "date-fns";
import { GroceryView } from "@/components/grocery-view";
import { IdeasView } from "@/components/ideas-view";
import { MealDialog } from "@/components/meal-dialog";
import { SoupsView } from "@/components/soups-view";
import { Shell, type View } from "@/components/shell";
import { WeekView } from "@/components/week-view";
import { buildGrocery, dayKey } from "@/lib/grocery";
import { registerCustomMeals } from "@/lib/meals";
import { usePlan } from "@/lib/plan-store";

export function HearthApp() {
  const [view, setView] = useState<View>("week");
  const [weekMonday, setWeekMonday] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [picking, setPicking] = useState<{ date: string; kind: "cook" | "leftovers" } | null>(null);
  const [detail, setDetail] = useState<{ mealId: string; date?: string } | null>(null);

  const nights = usePlan((state) => state.nights);
  const checks = usePlan((state) => state.checks);
  const customMeals = usePlan((state) => state.customMeals);
  registerCustomMeals(customMeals);

  useEffect(() => {
    void Promise.resolve(usePlan.persist.rehydrate())
      .then(() => {
        usePlan.getState().seedTasteIfEmpty();
      })
      .catch(() => {
        usePlan.getState().seedTasteIfEmpty();
      });
  }, []);

  const dates = useMemo(
    () => Array.from({ length: 7 }, (_, index) => addDays(weekMonday, index)),
    [weekMonday],
  );
  const thisMonday = startOfWeek(new Date(), { weekStartsOn: 1 });
  const showJump = dayKey(weekMonday) !== dayKey(thisMonday);
  const groceryCount = buildGrocery(dates, nights, dayKey(weekMonday))
    .flatMap((group) => group.items)
    .filter((item) => !checks[item.key]).length;

  function changeView(next: View) {
    if (next !== "ideas" && next !== "soups") setPicking(null);
    setView(next);
  }

  return (
    <Shell view={view} onView={changeView} groceryCount={groceryCount}>
      {view === "week" ? (
        <WeekView
          weekMonday={weekMonday}
          dates={dates}
          showJump={showJump}
          onShift={(dir) => {
            setPicking(null);
            setWeekMonday((current) => addDays(current, dir * 7));
          }}
          onThisWeek={() => setWeekMonday(startOfWeek(new Date(), { weekStartsOn: 1 }))}
          onPick={(date, kind) => {
            setPicking({ date, kind });
            setView("ideas");
          }}
          onOpenMeal={(mealId, date) => setDetail({ mealId, date })}
          onBrowse={() => changeView("ideas")}
        />
      ) : null}
      {view === "ideas" ? (
        <IdeasView
          picking={picking}
          onCancelPick={() => {
            setPicking(null);
            setView("week");
          }}
          onOpenMeal={(mealId) => setDetail({ mealId, date: picking?.date })}
          onAssigned={() => {
            setPicking(null);
            setView("week");
          }}
          dates={dates.map((date) => dayKey(date))}
        />
      ) : null}
      {view === "soups" ? (
        <SoupsView
          picking={picking}
          onCancelPick={() => {
            setPicking(null);
            setView("week");
          }}
          onOpenMeal={(mealId) => setDetail({ mealId, date: picking?.date })}
          onAssigned={() => {
            setPicking(null);
            setView("week");
          }}
          dates={dates.map((date) => dayKey(date))}
        />
      ) : null}
      {view === "list" ? (
        <GroceryView dates={dates} weekMonday={weekMonday} onBrowse={() => changeView("ideas")} />
      ) : null}
      <MealDialog
        mealId={detail?.mealId ?? null}
        date={detail?.date}
        weekDates={dates}
        onClose={() => setDetail(null)}
        onPlanned={() => {
          setDetail(null);
          setPicking(null);
          setView("week");
        }}
      />
    </Shell>
  );
}
