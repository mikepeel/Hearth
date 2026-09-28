import { useState } from "react";
import { format } from "date-fns";
import { Check, Copy } from "lucide-react";
import { buildGrocery, dayKey, groceryLine } from "@/lib/grocery";
import { getMeal } from "@/lib/meals";
import { usePlan } from "@/lib/plan-store";
import { cn } from "@/lib/utils";

export function GroceryView({
  dates,
  weekMonday,
  onBrowse,
}: {
  dates: Date[];
  weekMonday: Date;
  onBrowse: () => void;
}) {
  const nights = usePlan((state) => state.nights);
  const checks = usePlan((state) => state.checks);
  const toggleCheck = usePlan((state) => state.toggleCheck);
  const resetChecks = usePlan((state) => state.resetChecks);
  const [copied, setCopied] = useState<"idle" | "done" | "error">("idle");

  const week = dayKey(weekMonday);
  const groups = buildGrocery(dates, nights, week);
  const items = groups.flatMap((group) => group.items);
  const remaining = items.filter((item) => !checks[item.key]).length;
  const checkedCount = items.length - remaining;

  const cooks = dates.flatMap((date) => {
    const night = nights[dayKey(date)];
    if (!night || night.kind !== "cook") return [];
    const meal = getMeal(night.mealId);
    if (!meal) return [];
    return [{ label: format(date, "EEE"), name: meal.name }];
  });

  async function copyList() {
    const lines = [
      `Hearth groceries · ${format(weekMonday, "MMM d")}–${format(dates[6] ?? weekMonday, "MMM d")}`,
      "",
    ];
    for (const group of groups) {
      const open = group.items.filter((item) => !checks[item.key]);
      if (open.length === 0) continue;
      lines.push(group.aisle);
      for (const item of open) lines.push(`- ${groceryLine(item)}`);
      lines.push("");
    }
    const text = lines.join("\n").trim();
    try {
      await navigator.clipboard.writeText(text || "Grocery list is clear.");
      setCopied("done");
    } catch {
      setCopied("error");
    }
    window.setTimeout(() => setCopied("idle"), 1600);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-clay">From the week</p>
          <h2 className="mt-1 font-display text-4xl leading-tight text-ink sm:text-5xl">Groceries</h2>
          <p className="mt-2 text-sm text-muted">
            {format(weekMonday, "MMM d")} – {format(dates[6] ?? weekMonday, "MMM d")}
            {items.length > 0 ? ` · ${remaining} still to get` : ""}
          </p>
        </div>
        {items.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void copyList()}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-clay px-4 text-sm font-medium text-cream hover:bg-clay-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
            >
              {copied === "done" ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied === "done" ? "Copied" : copied === "error" ? "Couldn't copy" : "Copy list"}
            </button>
            {checkedCount > 0 ? (
              <button
                type="button"
                onClick={() => resetChecks(week)}
                className="min-h-11 rounded-full px-4 text-sm font-medium text-ink hover:bg-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
              >
                Reset checks
              </button>
            ) : null}
          </div>
        ) : null}
      </div>

      {cooks.length > 0 ? (
        <p className="text-sm text-muted">
          Cooking {cooks.map((cook) => `${cook.label} ${cook.name}`).join(" · ")}
        </p>
      ) : null}

      {items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-line bg-cream px-5 py-12 text-center">
          <p className="font-display text-3xl text-ink">No list yet</p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
            Plan a dinner at home and the ingredients land here. Eating out and leftovers stay off the list.
          </p>
          <button
            type="button"
            onClick={onBrowse}
            className="mt-5 min-h-11 rounded-full bg-clay px-4 text-sm font-medium text-cream hover:bg-clay-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
          >
            Find a dinner
          </button>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {groups.map((group) => (
            <section key={group.aisle}>
              <h3 className="text-xs font-medium uppercase tracking-widest text-muted">{group.aisle}</h3>
              <ul className="mt-2 overflow-hidden rounded-2xl border border-line bg-cream">
                {group.items.map((item, index) => {
                  const checked = Boolean(checks[item.key]);
                  return (
                    <li key={item.key} className={index > 0 ? "border-t border-line" : undefined}>
                      <button
                        type="button"
                        aria-pressed={checked}
                        onClick={() => toggleCheck(item.key)}
                        className="flex min-h-11 w-full items-center gap-3 px-3 py-3 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-clay"
                      >
                        <span
                          className={cn(
                            "flex size-6 shrink-0 items-center justify-center rounded-md border",
                            checked ? "border-sage bg-sage text-cream" : "border-line bg-cream text-transparent",
                          )}
                          aria-hidden="true"
                        >
                          <Check className="size-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className={cn("block text-sm", checked ? "text-muted line-through" : "text-ink")}>
                            {item.name}
                          </span>
                          {item.meals.length > 1 ? (
                            <span className="block text-xs text-muted">{item.meals.length} dinners</span>
                          ) : null}
                        </span>
                        <span className="shrink-0 text-sm tabular-nums text-muted">{groceryLine(item).split(" — ")[1]}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
      {items.length > 0 ? (
        <p className="text-xs text-muted">Salt and pepper are assumed. Amounts scale with each night’s servings.</p>
      ) : null}
    </div>
  );
}
