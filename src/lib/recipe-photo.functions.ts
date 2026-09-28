import { createServerFn } from "@tanstack/react-start";
import type { Aisle, Ingredient } from "@/lib/meals";

const MAX_IMAGE = 1_800_000;

type Draft = {
  name: string;
  summary: string;
  minutes: number;
  servings: number;
  soup: boolean;
  ingredients: Ingredient[];
  steps: string[];
};

export type RecipeRead =
  | { ok: true; draft: Draft }
  | { ok: false; error: string };

function aisleFor(name: string): Aisle {
  const text = name.toLowerCase();
  if (/chicken|beef|pork|salmon|shrimp|fish|turkey|sausage|steak|thigh|tofu|bacon/.test(text)) return "Protein";
  if (/milk|cheese|yogurt|butter|cream|egg|feta/.test(text)) return "Dairy";
  if (/frozen/.test(text)) return "Frozen";
  if (/bread|pita|roll|tortilla|bun|loaf/.test(text)) return "Bakery";
  if (/cumin|oregano|paprika|seasoning|chili powder|salt|pepper|cinnamon|thyme/.test(text)) return "Spices";
  if (/onion|garlic|lemon|lime|tomato|potato|broccoli|spinach|lettuce|cabbage|cilantro|parsley|basil|pepper|kale|carrot|celery/.test(text)) {
    return "Produce";
  }
  return "Pantry";
}

function amountOf(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) return value;
  if (typeof value !== "string") return 1;
  const parts = value.trim().split(/\s+/);
  let total = 0;
  for (const part of parts) {
    if (part.includes("/")) {
      const [num, den] = part.split("/");
      const n = Number(num);
      const d = Number(den);
      if (d) total += n / d;
    } else {
      total += Number(part);
    }
  }
  return Number.isFinite(total) && total > 0 ? total : 1;
}

const UNITS = new Set(["lb", "oz", "cup", "tbsp", "tsp", "clove", "can", "bunch", "pint", "head", "slice", "stalk"]);

function unitOf(value: unknown): string {
  if (typeof value !== "string") return "";
  const unit = value.trim().toLowerCase().replace(/s$/, "");
  return UNITS.has(unit) ? unit : "";
}

function draftFrom(raw: unknown): Draft | null {
  if (!raw || typeof raw !== "object") return null;
  const body = raw as Record<string, unknown>;
  if (body.ok === false) return null;
  const name = typeof body.name === "string" ? body.name.trim().slice(0, 80) : "";
  if (!name) return null;
  const ingredients = Array.isArray(body.ingredients)
    ? body.ingredients.slice(0, 40).flatMap((item) => {
        if (!item || typeof item !== "object") return [];
        const row = item as Record<string, unknown>;
        const itemName = typeof row.name === "string" ? row.name.trim().slice(0, 80) : "";
        if (!itemName) return [];
        const ingredient: Ingredient = {
          name: itemName,
          amount: amountOf(row.amount),
          unit: unitOf(row.unit),
          aisle: aisleFor(itemName),
        };
        return [ingredient];
      })
    : [];
  const steps = Array.isArray(body.steps)
    ? body.steps
        .filter((step): step is string => typeof step === "string")
        .map((step) => step.trim())
        .filter(Boolean)
        .slice(0, 12)
    : [];
  const minutes = amountOf(body.minutes);
  const servings = amountOf(body.servings);
  return {
    name,
    summary: typeof body.summary === "string" ? body.summary.trim().slice(0, 180) : "",
    minutes: Math.min(180, Math.max(5, Math.round(minutes === 1 && body.minutes == null ? 30 : minutes))),
    servings: Math.min(12, Math.max(1, Math.round(servings === 1 && body.servings == null ? 4 : servings))),
    soup: body.soup === true,
    ingredients,
    steps,
  };
}

export const readRecipePhoto = createServerFn({ method: "POST" })
  .validator((input: { image: string }) => {
    if (!input || typeof input.image !== "string" || !input.image.startsWith("data:image/jpeg;base64,")) {
      throw new Error("Send a photo of the recipe.");
    }
    if (input.image.length > MAX_IMAGE) throw new Error("That photo is too large. Move in closer and try again.");
    return { image: input.image };
  })
  .handler(async ({ data }): Promise<RecipeRead> => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false, error: "Reading photos isn't available right now." };

    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        temperature: 0,
        max_tokens: 900,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: { url: data.image, detail: "high" },
              },
              {
                type: "text",
                text: 'Read this as a recipe card. If it is not a recipe, reply {"ok":false}. If it is, reply with JSON only: {"ok":true,"name":"","summary":"one short sentence","minutes":30,"servings":4,"soup":false,"ingredients":[{"amount":1,"unit":"cup","name":"rice"}],"steps":["one action"]}. Units only: lb, oz, cup, tbsp, tsp, clove, can, bunch, pint, head, slice, stalk, or empty. Amount is a number. Do not invent ingredients that are not on the card.',
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) return { ok: false, error: "Couldn't read that photo. Try a closer, brighter one." };

    const body = (await response.json()) as { choices?: { message?: { content?: string } }[] };
    const content = body.choices?.[0]?.message?.content ?? "";
    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch {
      return { ok: false, error: "Couldn't read that photo. Try a closer, brighter one." };
    }
    const draft = draftFrom(parsed);
    if (!draft) return { ok: false, error: "That doesn't look like a recipe." };
    return { ok: true, draft };
  });
