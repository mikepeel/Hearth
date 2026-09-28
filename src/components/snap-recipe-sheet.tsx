import { useRef, useState } from "react";
import type { Meal, Tag } from "@/lib/meals";
import { parseIngredientLines } from "@/lib/parse-ingredient";
import { readRecipePhoto } from "@/lib/recipe-photo.functions";
import { usePlan } from "@/lib/plan-store";
import { Sheet } from "@/components/sheet";

async function fileToJpeg(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1400 / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not read that photo.");
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  return canvas.toDataURL("image/jpeg", 0.72);
}

export function SnapRecipeSheet({
  open,
  onClose,
  asSoup = false,
}: {
  open: boolean;
  onClose: () => void;
  asSoup?: boolean;
}) {
  const addMeal = usePlan((state) => state.addMeal);
  const cameraRef = useRef<HTMLInputElement>(null);
  const libraryRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "reading" | "ready">("idle");
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [summary, setSummary] = useState("");
  const [minutes, setMinutes] = useState("30");
  const [servings, setServings] = useState("4");
  const [soup, setSoup] = useState(asSoup);
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");

  function reset() {
    setPreview(null);
    setStatus("idle");
    setError(null);
    setName("");
    setSummary("");
    setMinutes("30");
    setServings("4");
    setSoup(asSoup);
    setIngredients("");
    setSteps("");
  }

  function close() {
    reset();
    onClose();
  }

  async function onFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    setStatus("reading");
    try {
      const image = await fileToJpeg(file);
      if (image.length > 1_700_000) {
        setStatus("idle");
        setError("That photo is too large. Move in closer and try again.");
        return;
      }
      setPreview(image);
      const result = await readRecipePhoto({ data: { image } });
      if (!result.ok) {
        setStatus("idle");
        setError(result.error);
        return;
      }
      setName(result.draft.name);
      setSummary(result.draft.summary);
      setMinutes(String(result.draft.minutes));
      setServings(String(result.draft.servings));
      setSoup(asSoup || result.draft.soup);
      setIngredients(
        result.draft.ingredients
          .map((item) => [item.amount, item.unit, item.name].filter(Boolean).join(" "))
          .join("\n"),
      );
      setSteps(result.draft.steps.join("\n"));
      setStatus("ready");
    } catch {
      setStatus("idle");
      setError("Couldn't read that photo. Try a JPG or PNG, closer and brighter.");
    }
  }

  function save() {
    const trimmed = name.trim();
    if (!trimmed) return;
    const slug = trimmed
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40);
    const parsed = parseIngredientLines(ingredients);
    const method = steps
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const tags: Tag[] = soup ? ["soup"] : [];
    const meal: Meal = {
      id: `ours-${slug || "dinner"}-${Math.random().toString(36).slice(2, 6)}`,
      name: trimmed,
      cuisine: "Ours",
      minutes: clamp(Number(minutes), 5, 180, 30),
      servings: clamp(Number(servings), 1, 12, 4),
      effort: Number(minutes) > 40 ? "Steady" : "Easy",
      tags,
      household: true,
      summary: summary.trim() || "Saved from a photo.",
      ingredients:
        parsed.length > 0 ? parsed : [{ name: trimmed, amount: 1, unit: "", aisle: "Pantry" }],
      steps: method.length > 0 ? method : ["Cook it the way the card says."],
    };
    addMeal(meal);
    close();
  }

  return (
    <Sheet
      open={open}
      onClose={close}
      title="Snap a recipe"
      description="A cookbook page, a card, or a screenshot. You'll get a chance to fix it before it joins the list."
    >
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        onChange={(event) => {
          void onFile(event.target.files?.[0]);
          event.target.value = "";
        }}
      />
      <input
        ref={libraryRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={(event) => {
          void onFile(event.target.files?.[0]);
          event.target.value = "";
        }}
      />

      {status !== "ready" ? (
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={status === "reading"}
              onClick={() => cameraRef.current?.click()}
              className="min-h-11 rounded-full bg-clay px-4 text-sm font-medium text-cream hover:bg-clay-deep disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
            >
              Take a photo
            </button>
            <button
              type="button"
              disabled={status === "reading"}
              onClick={() => libraryRef.current?.click()}
              className="min-h-11 rounded-full border border-line bg-paper px-4 text-sm font-medium text-ink hover:border-clay disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
            >
              Choose a photo
            </button>
          </div>
          {status === "reading" ? <p className="text-sm text-muted">Reading the recipe…</p> : null}
          {preview ? <img src={preview} alt="" className="max-h-48 w-full rounded-2xl object-cover" /> : null}
          {error ? <p className="text-sm text-ink">{error}</p> : null}
        </div>
      ) : (
        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            save();
          }}
        >
          {preview ? <img src={preview} alt="" className="max-h-40 w-full rounded-2xl object-cover" /> : null}
          <label className="block text-sm font-medium text-ink">
            Name
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-1 w-full rounded-2xl border border-line bg-paper px-3 py-3 text-sm text-ink focus-visible:outline-2 focus-visible:outline-clay"
            />
          </label>
          <label className="block text-sm font-medium text-ink">
            What it's like
            <input
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              className="mt-1 w-full rounded-2xl border border-line bg-paper px-3 py-3 text-sm text-ink focus-visible:outline-2 focus-visible:outline-clay"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm font-medium text-ink">
              Minutes
              <input
                inputMode="numeric"
                value={minutes}
                onChange={(event) => setMinutes(event.target.value)}
                className="mt-1 w-full rounded-2xl border border-line bg-paper px-3 py-3 text-sm text-ink tabular-nums focus-visible:outline-2 focus-visible:outline-clay"
              />
            </label>
            <label className="block text-sm font-medium text-ink">
              Servings
              <input
                inputMode="numeric"
                value={servings}
                onChange={(event) => setServings(event.target.value)}
                className="mt-1 w-full rounded-2xl border border-line bg-paper px-3 py-3 text-sm text-ink tabular-nums focus-visible:outline-2 focus-visible:outline-clay"
              />
            </label>
          </div>
          <label className="block text-sm font-medium text-ink">
            Ingredients
            <textarea
              value={ingredients}
              onChange={(event) => setIngredients(event.target.value)}
              rows={5}
              className="mt-1 w-full rounded-2xl border border-line bg-paper px-3 py-3 text-sm text-ink focus-visible:outline-2 focus-visible:outline-clay"
            />
          </label>
          <label className="block text-sm font-medium text-ink">
            Steps
            <textarea
              value={steps}
              onChange={(event) => setSteps(event.target.value)}
              rows={4}
              className="mt-1 w-full rounded-2xl border border-line bg-paper px-3 py-3 text-sm text-ink focus-visible:outline-2 focus-visible:outline-clay"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={!name.trim()}
              className="min-h-11 rounded-full bg-clay px-4 text-sm font-medium text-cream hover:bg-clay-deep disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
            >
              Add it
            </button>
            <button
              type="button"
              onClick={reset}
              className="min-h-11 rounded-full px-4 text-sm font-medium text-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
            >
              Try another photo
            </button>
          </div>
        </form>
      )}
    </Sheet>
  );
}

function clamp(value: number, min: number, max: number, fallback: number): number {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, Math.round(value)));
}
