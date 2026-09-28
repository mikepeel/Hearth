import { addDays, format, startOfWeek } from "date-fns";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getMeal, SEED_MEAL_IDS, allMeals, isOurs, registerCustomMeals, type Meal } from "@/lib/meals";
import { mealBlocked } from "@/lib/exclusions";
import { variedPool } from "@/lib/rotation";
import { noteTaste, type Tastes } from "@/lib/taste";

export type NightKind = "cook" | "out" | "leftovers";

export type NightPlan = {
  kind: NightKind;
  mealId?: string;
  servings: number;
  cooked: boolean;
};

type PlanState = {
  initialized: boolean;
  nights: Record<string, NightPlan>;
  favorites: string[];
  checks: Record<string, boolean>;
  customMeals: Meal[];
  exclusions: string[];
  keeps: string[];
  picks: string[];
  tastes: Tastes;
  seedIfNeeded: () => void;
  assign: (date: string, mealId: string, kind?: "cook" | "leftovers") => void;
  markOut: (date: string) => void;
  setServings: (date: string, servings: number) => void;
  toggleCooked: (date: string) => void;
  clearNight: (date: string) => void;
  clearWeek: (dates: string[], weekKey: string) => void;
  fillOpenNights: (dates: string[]) => void;
  toggleFavorite: (mealId: string) => void;
  toggleCheck: (key: string) => void;
  resetChecks: (weekKey: string) => void;
  addMeal: (meal: Meal) => void;
  removeMeal: (mealId: string) => void;
  addExclusion: (term: string) => void;
  removeExclusion: (term: string) => void;
  keepMeal: (mealId: string) => void;
  unkeepMeal: (mealId: string) => void;
  togglePick: (mealId: string) => void;
  planFromPicks: (dates: string[]) => void;
  seedTasteIfEmpty: () => void;
};

function memoryStorage(): Storage {
  const mem = new Map<string, string>();
  return {
    get length() {
      return mem.size;
    },
    clear: () => mem.clear(),
    getItem: (key) => mem.get(key) ?? null,
    key: (index) => [...mem.keys()][index] ?? null,
    removeItem: (key) => {
      mem.delete(key);
    },
    setItem: (key, value) => {
      mem.set(key, value);
    },
  };
}

function seedNights(): Record<string, NightPlan> {
  const monday = startOfWeek(new Date(), { weekStartsOn: 1 });
  const nights: Record<string, NightPlan> = {};
  SEED_MEAL_IDS.forEach((id, index) => {
    const meal = getMeal(id);
    if (!meal) return;
    nights[format(addDays(monday, index), "yyyy-MM-dd")] = {
      kind: "cook",
      mealId: id,
      servings: meal.servings,
      cooked: false,
    };
  });
  return nights;
}

export const usePlan = create<PlanState>()(
  persist(
    (set, get) => ({
      initialized: true,
      nights: seedNights(),
      favorites: [],
      checks: {},
      customMeals: [],
      exclusions: ["mushrooms"],
      keeps: [],
      picks: [],
      tastes: {},
      seedIfNeeded: () => {
        if (get().initialized && Object.keys(get().nights).length > 0) return;
        set({ initialized: true, nights: seedNights() });
      },
      assign: (date, mealId, kind = "cook") => {
        const meal = getMeal(mealId);
        if (!meal) return;
        set((state) => ({
          tastes: kind === "cook" ? noteTaste(state.tastes, meal) : state.tastes,
          nights: {
            ...state.nights,
            [date]: {
              kind,
              mealId,
              servings: meal.servings,
              cooked: false,
            },
          },
        }));
      },
      markOut: (date) => {
        set((state) => ({
          nights: {
            ...state.nights,
            [date]: { kind: "out", servings: 0, cooked: false },
          },
        }));
      },
      setServings: (date, servings) => {
        const next = Math.min(12, Math.max(1, Math.round(servings)));
        set((state) => {
          const night = state.nights[date];
          if (!night) return state;
          return {
            nights: { ...state.nights, [date]: { ...night, servings: next } },
          };
        });
      },
      toggleCooked: (date) => {
        set((state) => {
          const night = state.nights[date];
          if (!night) return state;
          return {
            nights: { ...state.nights, [date]: { ...night, cooked: !night.cooked } },
          };
        });
      },
      clearNight: (date) => {
        set((state) => {
          const nights = { ...state.nights };
          delete nights[date];
          return { nights };
        });
      },
      clearWeek: (dates, weekKey) => {
        set((state) => {
          const nights = { ...state.nights };
          for (const date of dates) delete nights[date];
          const checks = { ...state.checks };
          const prefix = `${weekKey}|`;
          for (const key of Object.keys(checks)) {
            if (key.startsWith(prefix)) delete checks[key];
          }
          return { nights, checks };
        });
      },
      fillOpenNights: (dates) => {
        const nights = { ...get().nights };
        const used = new Set<string>();
        for (const date of dates) {
          const id = nights[date]?.mealId;
          if (id) used.add(id);
        }
        const pool = variedPool(
          allMeals().filter(
            (meal) => (isOurs(meal) || !meal.tags.includes("soup")) && !mealBlocked(meal, get().exclusions, get().keeps),
          ),
          nights,
          used,
          get().favorites,
          get().tastes,
        );
        let cursor = 0;
        for (const date of dates) {
          if (nights[date]) continue;
          const meal = pool[cursor];
          cursor += 1;
          if (!meal) break;
          nights[date] = {
            kind: "cook",
            mealId: meal.id,
            servings: meal.servings,
            cooked: false,
          };
        }
        set({ nights });
      },
      toggleFavorite: (mealId) => {
        set((state) => ({
          favorites: state.favorites.includes(mealId)
            ? state.favorites.filter((id) => id !== mealId)
            : [...state.favorites, mealId],
        }));
      },
      toggleCheck: (key) => {
        set((state) => {
          const checks = { ...state.checks };
          if (checks[key]) delete checks[key];
          else checks[key] = true;
          return { checks };
        });
      },
      resetChecks: (weekKey) => {
        set((state) => {
          const checks = { ...state.checks };
          const prefix = `${weekKey}|`;
          for (const key of Object.keys(checks)) {
            if (key.startsWith(prefix)) delete checks[key];
          }
          return { checks };
        });
      },
      addMeal: (meal) => {
        const customMeals = [meal, ...get().customMeals.filter((item) => item.id !== meal.id)];
        registerCustomMeals(customMeals);
        set({ customMeals });
      },
      removeMeal: (mealId) => {
        const customMeals = get().customMeals.filter((meal) => meal.id !== mealId);
        registerCustomMeals(customMeals);
        const nights = { ...get().nights };
        for (const [date, night] of Object.entries(nights)) {
          if (night.mealId === mealId) delete nights[date];
        }
        set({
          customMeals,
          nights,
          favorites: get().favorites.filter((id) => id !== mealId),
          keeps: get().keeps.filter((id) => id !== mealId),
          picks: get().picks.filter((id) => id !== mealId),
        });
      },
      addExclusion: (term) => {
        const cleaned = term.trim().toLowerCase();
        if (!cleaned) return;
        set((state) => ({
          exclusions: state.exclusions.includes(cleaned) ? state.exclusions : [...state.exclusions, cleaned],
        }));
      },
      removeExclusion: (term) => {
        set((state) => ({ exclusions: state.exclusions.filter((item) => item !== term) }));
      },
      keepMeal: (mealId) => {
        set((state) => ({
          keeps: state.keeps.includes(mealId) ? state.keeps : [...state.keeps, mealId],
        }));
      },
      unkeepMeal: (mealId) => {
        set((state) => ({ keeps: state.keeps.filter((id) => id !== mealId) }));
      },
      togglePick: (mealId) => {
        const meal = getMeal(mealId);
        set((state) => {
          if (state.picks.includes(mealId)) return { picks: state.picks.filter((id) => id !== mealId) };
          return {
            picks: [...state.picks, mealId],
            tastes: meal ? noteTaste(state.tastes, meal) : state.tastes,
          };
        });
      },
      planFromPicks: (dates) => {
        const nights = { ...get().nights };
        const used = new Set<string>();
        for (const date of dates) {
          const id = nights[date]?.mealId;
          if (id) used.add(id);
        }
        const queue = get().picks.filter((id) => {
          const meal = getMeal(id);
          return meal && !used.has(id) && !mealBlocked(meal, get().exclusions, get().keeps);
        });
        const placed = new Set<string>();
        for (const date of dates) {
          if (nights[date]) continue;
          const mealId = queue.shift();
          const meal = getMeal(mealId);
          if (!mealId || !meal) break;
          nights[date] = { kind: "cook", mealId, servings: meal.servings, cooked: false };
          placed.add(mealId);
          used.add(mealId);
        }
        set({
          nights,
          picks: get().picks.filter((id) => !placed.has(id) && !used.has(id)),
        });
      },
      seedTasteIfEmpty: () => {
        if (Object.values(get().tastes).some((count) => count > 0)) return;
        let tastes = { ...get().tastes };
        for (const meal of allMeals()) {
          if (isOurs(meal) && meal.household) tastes = noteTaste(tastes, meal);
        }
        set({ tastes });
      },
    }),
    {
      name: "hearth-plan-v1",
      skipHydration: true,
      storage: createJSONStorage(() =>
        typeof window === "undefined" ? memoryStorage() : localStorage,
      ),
      partialize: (state) => ({
        initialized: state.initialized,
        nights: state.nights,
        favorites: state.favorites,
        checks: state.checks,
        customMeals: state.customMeals,
        exclusions: state.exclusions,
        keeps: state.keeps,
        picks: state.picks,
        tastes: state.tastes,
      }),
      onRehydrateStorage: () => (state) => {
        registerCustomMeals(state?.customMeals ?? []);
      },
    },
  ),
);
