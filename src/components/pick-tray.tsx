import { getMeal } from "@/lib/meals";
import { usePlan } from "@/lib/plan-store";
import { tasteLean } from "@/lib/taste";

export function PickTray({ dates }: { dates: string[] }) {
  const picks = usePlan((state) => state.picks);
  const nights = usePlan((state) => state.nights);
  const tastes = usePlan((state) => state.tastes);
  const togglePick = usePlan((state) => state.togglePick);
  const planFromPicks = usePlan((state) => state.planFromPicks);
  const lean = tasteLean(tastes);
  const open = dates.filter((date) => !nights[date]).length;
  const chosen = picks.map((id) => getMeal(id)).filter((meal) => meal != null);

  if (chosen.length === 0 && !lean) return null;

  return (
    <section className="rounded-3xl border border-line bg-cream px-4 py-4">
      {chosen.length > 0 ? (
        <>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h3 className="font-display text-xl text-ink">Picked for a plan</h3>
              <p className="mt-1 max-w-xl text-sm text-muted">
                {open === 0
                  ? "Clear a night first. These stay picked until they land on the week."
                  : `Lays them, in this order, on ${open} open night${open === 1 ? "" : "s"}. Anything that doesn't fit stays picked.`}
              </p>
            </div>
            <button
              type="button"
              disabled={open === 0}
              onClick={() => planFromPicks(dates)}
              className="min-h-11 rounded-full bg-ink px-4 text-sm font-medium text-cream disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
            >
              Plan open nights
            </button>
          </div>
          <ul className="mt-3 flex flex-wrap gap-2">
            {chosen.map((meal) => (
              <li key={meal.id}>
                <button
                  type="button"
                  onClick={() => togglePick(meal.id)}
                  className="min-h-11 rounded-full border border-line bg-paper px-3 text-sm text-ink hover:border-clay focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
                >
                  {meal.name}
                  <span className="sr-only">, remove from picks</span>
                  <span aria-hidden="true"> ×</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : null}
      {lean ? <p className={chosen.length > 0 ? "mt-3 text-sm text-muted" : "text-sm text-muted"}>Leaning toward {lean}.</p> : null}
    </section>
  );
}
