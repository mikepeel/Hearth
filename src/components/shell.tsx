import type { ReactNode } from "react";
import { CalendarDays, ShoppingBasket, Soup, UtensilsCrossed } from "lucide-react";
import { cn } from "@/lib/utils";

export type View = "week" | "ideas" | "soups" | "list";

const TABS: { id: View; label: string; icon: typeof CalendarDays }[] = [
  { id: "week", label: "Week", icon: CalendarDays },
  { id: "ideas", label: "Ideas", icon: UtensilsCrossed },
  { id: "soups", label: "Soups", icon: Soup },
  { id: "list", label: "Groceries", icon: ShoppingBasket },
];

export function Shell({
  view,
  onView,
  groceryCount,
  children,
}: {
  view: View;
  onView: (view: View) => void;
  groceryCount: number;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="sticky top-0 z-20 border-b border-line bg-paper">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between md:py-4">
          <div>
            <h1 className="font-display text-3xl leading-none tracking-tight text-ink">
              Hearth<span className="text-clay">.</span>
            </h1>
            <p className="mt-1 hidden text-sm text-muted sm:block">Weeknight dinners, already decided.</p>
          </div>
          <nav aria-label="Sections" className="grid grid-cols-4 gap-1 rounded-full border border-line bg-cream p-1 md:flex">
            {TABS.map((tab) => {
              const active = view === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  aria-current={active ? "page" : undefined}
                  onClick={() => onView(tab.id)}
                  className={cn(
                    "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full px-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay sm:gap-2 sm:px-3",
                    active ? "bg-ink text-cream" : "text-muted hover:text-ink",
                  )}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {tab.label}
                  {tab.id === "list" && groceryCount > 0 ? (
                    <span
                      className={cn(
                        "rounded-full px-1.5 text-xs tabular-nums",
                        active ? "bg-clay text-cream" : "bg-clay-soft text-clay-deep",
                      )}
                    >
                      {groceryCount}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>
      </header>
      <main id="content" className="mx-auto w-full max-w-6xl px-4 py-6 pb-16">
        {children}
      </main>
    </div>
  );
}
