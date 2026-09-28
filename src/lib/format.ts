export function formatAmount(value: number): string {
  const rounded = Math.round(value * 4) / 4;
  if (rounded <= 0) return "0";
  const whole = Math.floor(rounded + 1e-9);
  const frac = Math.round((rounded - whole) * 100) / 100;
  const glyph = frac === 0.25 ? "¼" : frac === 0.5 ? "½" : frac === 0.75 ? "¾" : "";
  if (whole === 0 && glyph) return glyph;
  if (!glyph) return Number.isInteger(rounded) ? String(rounded) : String(rounded);
  return `${whole} ${glyph}`;
}

const UNIT_PLURAL: Record<string, string> = {
  clove: "cloves",
  can: "cans",
  bunch: "bunches",
  cup: "cups",
  pint: "pints",
  loaf: "loaves",
  slice: "slices",
  head: "heads",
  tbsp: "tbsp",
  tsp: "tsp",
};

export function formatQty(amount: number, unit: string): string {
  const n = formatAmount(amount);
  if (!unit) return n;
  const u = amount > 1 && UNIT_PLURAL[unit] ? UNIT_PLURAL[unit] : unit;
  return `${n} ${u}`;
}

export function formatItemName(amount: number, unit: string, name: string): string {
  if (unit || amount <= 1 || name.endsWith("s")) return name;
  if (name.endsWith("y") && !/[aeiou]y$/i.test(name)) return `${name.slice(0, -1)}ies`;
  if (/(s|sh|ch|x)$/i.test(name)) return `${name}es`;
  return `${name}s`;
}

export function formatDuration(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} hr`;
  return `${h} hr ${m} min`;
}
