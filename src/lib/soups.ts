import { format } from "date-fns";
import type { Meal } from "@/lib/meals";

export const SOUPS: Meal[] = [
  {
    id: "lemon-chicken-orzo-soup",
    name: "Lemon chicken orzo soup",
    cuisine: "Mediterranean",
    minutes: 35,
    servings: 4,
    effort: "Easy",
    tags: ["soup", "high-protein"],
    summary: "Shredded chicken, orzo, and a bright lemon finish.",
    because: "Lemon, garlic, and chicken. The same night as the thighs, with orzo in the bowl.",
    echoes: ["lemon-garlic-chicken", "greek-chicken-pitas"],
    ingredients: [
      { name: "Chicken breast", amount: 1, unit: "lb", aisle: "Protein" },
      { name: "Orzo", amount: 1, unit: "cup", aisle: "Pantry" },
      { name: "Chicken broth", amount: 6, unit: "cup", aisle: "Pantry" },
      { name: "Carrot", amount: 2, unit: "", aisle: "Produce" },
      { name: "Celery", amount: 2, unit: "stalk", aisle: "Produce" },
      { name: "Lemon", amount: 1, unit: "", aisle: "Produce" },
      { name: "Garlic", amount: 3, unit: "clove", aisle: "Produce" },
      { name: "Baby spinach", amount: 2, unit: "cup", aisle: "Produce" },
      { name: "Olive oil", amount: 1, unit: "tbsp", aisle: "Pantry" },
    ],
    steps: [
      "Dice the carrot and celery. Warm the oil and soften them with the garlic for a few minutes.",
      "Add the broth and the chicken. Simmer until the chicken is cooked through, about 15 minutes.",
      "Lift the chicken out, shred it, and return it to the pot. Stir in the orzo and cook until tender.",
      "Turn off the heat. Stir in the spinach and the juice of the lemon. Salt to taste.",
    ],
  },
  {
    id: "creamy-tomato-basil-soup",
    name: "Creamy tomato basil soup",
    cuisine: "Italian",
    minutes: 30,
    servings: 4,
    effort: "Easy",
    tags: ["soup", "vegetarian"],
    summary: "A blended tomato soup with cream and a handful of basil.",
    because: "The crushed tomatoes and cream from the penne, with basil instead of pasta.",
    echoes: ["creamy-tomato-pasta"],
    ingredients: [
      { name: "Crushed tomatoes (28 oz)", amount: 1, unit: "can", aisle: "Pantry" },
      { name: "Vegetable broth", amount: 2, unit: "cup", aisle: "Pantry" },
      { name: "Heavy cream", amount: 0.5, unit: "cup", aisle: "Dairy" },
      { name: "Yellow onion", amount: 1, unit: "", aisle: "Produce" },
      { name: "Garlic", amount: 3, unit: "clove", aisle: "Produce" },
      { name: "Fresh basil", amount: 1, unit: "bunch", aisle: "Produce" },
      { name: "Butter", amount: 2, unit: "tbsp", aisle: "Dairy" },
      { name: "Crusty bread", amount: 1, unit: "loaf", aisle: "Bakery" },
    ],
    steps: [
      "Chop the onion. Melt the butter and cook the onion and garlic until soft.",
      "Add the tomatoes and broth. Simmer 15 minutes, then stir in most of the basil.",
      "Blend until smooth. Stir in the cream and warm it through without boiling.",
      "Salt and pepper. Tear the rest of the basil on top and serve with bread.",
    ],
  },
  {
    id: "chicken-tortilla-soup",
    name: "Chicken tortilla soup",
    cuisine: "Mexican",
    minutes: 35,
    servings: 4,
    effort: "Easy",
    tags: ["soup", "high-protein"],
    summary: "Shredded chicken, black beans, and a handful of tortilla chips.",
    because: "Cumin, beans, and toppings. The taco night, stretched into a pot.",
    echoes: ["beef-taco-skillet", "black-bean-enchiladas"],
    ingredients: [
      { name: "Chicken breast", amount: 1, unit: "lb", aisle: "Protein" },
      { name: "Fire-roasted tomatoes (14 oz)", amount: 1, unit: "can", aisle: "Pantry" },
      { name: "Black beans (15 oz)", amount: 1, unit: "can", aisle: "Pantry" },
      { name: "Chicken broth", amount: 4, unit: "cup", aisle: "Pantry" },
      { name: "Yellow onion", amount: 1, unit: "", aisle: "Produce" },
      { name: "Garlic", amount: 3, unit: "clove", aisle: "Produce" },
      { name: "Ground cumin", amount: 2, unit: "tsp", aisle: "Spices" },
      { name: "Chili powder", amount: 1, unit: "tsp", aisle: "Spices" },
      { name: "Lime", amount: 1, unit: "", aisle: "Produce" },
      { name: "Tortilla chips", amount: 2, unit: "cup", aisle: "Pantry" },
      { name: "Shredded cheddar", amount: 4, unit: "oz", aisle: "Dairy" },
      { name: "Fresh cilantro", amount: 1, unit: "bunch", aisle: "Produce" },
    ],
    steps: [
      "Chop the onion. Soften it with the garlic, cumin, and chili powder in a little oil.",
      "Add the tomatoes, broth, drained beans, and chicken. Simmer until the chicken shreds easily.",
      "Shred the chicken in the pot. Squeeze in the lime.",
      "Bowl it with chips, cheddar, and cilantro.",
    ],
  },
  {
    id: "thai-coconut-chicken-soup",
    name: "Thai coconut chicken soup",
    cuisine: "Thai",
    minutes: 30,
    servings: 4,
    effort: "Easy",
    tags: ["soup", "high-protein"],
    summary: "Chicken in coconut broth, finished with lime and basil.",
    because: "Coconut, lime, and basil. The same lane as the basil chicken and the chickpea curry.",
    echoes: ["thai-basil-chicken", "chickpea-curry"],
    ingredients: [
      { name: "Chicken thigh", amount: 1, unit: "lb", aisle: "Protein" },
      { name: "Coconut milk (13.5 oz)", amount: 1, unit: "can", aisle: "Pantry" },
      { name: "Chicken broth", amount: 3, unit: "cup", aisle: "Pantry" },
      { name: "Bell pepper", amount: 1, unit: "", aisle: "Produce" },
      { name: "Fresh ginger", amount: 1, unit: "tbsp", aisle: "Produce" },
      { name: "Lime", amount: 1, unit: "", aisle: "Produce" },
      { name: "Fish sauce", amount: 1, unit: "tbsp", aisle: "Pantry" },
      { name: "Fresh basil", amount: 1, unit: "cup", aisle: "Produce" },
      { name: "Jasmine rice", amount: 1, unit: "cup", aisle: "Pantry" },
    ],
    steps: [
      "Start the rice. Slice the pepper and the chicken.",
      "Simmer the broth, coconut milk, ginger, and fish sauce. Add the chicken and pepper.",
      "Cook until the chicken is done, about 8 minutes.",
      "Off the heat, add the lime juice and basil. Serve over a little rice.",
    ],
  },
  {
    id: "sausage-white-bean-soup",
    name: "Sausage and white bean soup",
    cuisine: "Italian",
    minutes: 35,
    servings: 4,
    effort: "Easy",
    tags: ["soup", "one-pan"],
    summary: "Italian sausage, sweet peppers, and white beans in a tomato broth.",
    because: "Sausage and peppers, with beans and broth instead of a roll.",
    echoes: ["sausage-peppers"],
    ingredients: [
      { name: "Italian sausage", amount: 1, unit: "lb", aisle: "Protein" },
      { name: "Cannellini beans (15 oz)", amount: 2, unit: "can", aisle: "Pantry" },
      { name: "Bell pepper", amount: 2, unit: "", aisle: "Produce" },
      { name: "Yellow onion", amount: 1, unit: "", aisle: "Produce" },
      { name: "Garlic", amount: 3, unit: "clove", aisle: "Produce" },
      { name: "Chicken broth", amount: 4, unit: "cup", aisle: "Pantry" },
      { name: "Tomato paste", amount: 2, unit: "tbsp", aisle: "Pantry" },
      { name: "Baby spinach", amount: 2, unit: "cup", aisle: "Produce" },
    ],
    steps: [
      "Brown the sausage in a pot, breaking it up. Spoon off the extra fat.",
      "Add the chopped onion, peppers, and garlic. Cook until soft.",
      "Stir in the tomato paste, broth, and drained beans. Simmer 15 minutes.",
      "Wilt in the spinach. Salt and pepper.",
    ],
  },
  {
    id: "mushroom-barley-soup",
    name: "Mushroom barley soup",
    cuisine: "American",
    minutes: 45,
    servings: 4,
    effort: "Steady",
    tags: ["soup", "vegetarian"],
    summary: "A dark mushroom broth with barley, thyme, and a splash of soy.",
    because: "The risotto mushrooms, without standing over the pot.",
    echoes: ["mushroom-risotto"],
    ingredients: [
      { name: "Mushrooms", amount: 1, unit: "lb", aisle: "Produce" },
      { name: "Pearl barley", amount: 0.75, unit: "cup", aisle: "Pantry" },
      { name: "Vegetable broth", amount: 6, unit: "cup", aisle: "Pantry" },
      { name: "Yellow onion", amount: 1, unit: "", aisle: "Produce" },
      { name: "Carrot", amount: 2, unit: "", aisle: "Produce" },
      { name: "Garlic", amount: 2, unit: "clove", aisle: "Produce" },
      { name: "Fresh thyme", amount: 1, unit: "tsp", aisle: "Produce" },
      { name: "Soy sauce", amount: 1, unit: "tbsp", aisle: "Pantry" },
      { name: "Olive oil", amount: 1, unit: "tbsp", aisle: "Pantry" },
    ],
    steps: [
      "Slice the mushrooms. Chop the onion and carrot.",
      "Brown the mushrooms in the oil until they give up their liquid. Add the onion, carrot, garlic, and thyme.",
      "Pour in the broth, barley, and soy. Simmer until the barley is tender, about 30 minutes.",
      "Salt and pepper. Thin with a splash of water if it thickens too much.",
    ],
  },
  {
    id: "black-bean-lime-soup",
    name: "Black bean lime soup",
    cuisine: "Mexican",
    minutes: 25,
    servings: 4,
    effort: "Easy",
    tags: ["soup", "vegetarian", "quick"],
    summary: "A thick black bean soup with cumin, lime, and cheddar.",
    because: "The enchilada beans, simmered with cumin and finished with lime.",
    echoes: ["black-bean-enchiladas", "beef-taco-skillet"],
    ingredients: [
      { name: "Black beans (15 oz)", amount: 3, unit: "can", aisle: "Pantry" },
      { name: "Vegetable broth", amount: 2, unit: "cup", aisle: "Pantry" },
      { name: "Yellow onion", amount: 1, unit: "", aisle: "Produce" },
      { name: "Garlic", amount: 3, unit: "clove", aisle: "Produce" },
      { name: "Ground cumin", amount: 2, unit: "tsp", aisle: "Spices" },
      { name: "Chili powder", amount: 1, unit: "tsp", aisle: "Spices" },
      { name: "Lime", amount: 1, unit: "", aisle: "Produce" },
      { name: "Shredded cheddar", amount: 4, unit: "oz", aisle: "Dairy" },
      { name: "Fresh cilantro", amount: 0.5, unit: "bunch", aisle: "Produce" },
    ],
    steps: [
      "Soften the chopped onion and garlic with the cumin and chili powder.",
      "Add the broth and two cans of drained beans. Simmer 10 minutes.",
      "Mash or blend half the soup, then stir in the last can of beans so it stays chunky.",
      "Finish with lime juice. Top with cheddar and cilantro.",
    ],
  },
];

function signalIds(
  nights: Record<string, { kind: string; mealId?: string; cooked: boolean }>,
  favorites: string[],
): { strong: Set<string>; planned: Set<string> } {
  const today = format(new Date(), "yyyy-MM-dd");
  const strong = new Set(favorites);
  const planned = new Set<string>();
  for (const [date, night] of Object.entries(nights)) {
    if (night.kind !== "cook" || !night.mealId) continue;
    if (date < today || night.cooked) strong.add(night.mealId);
    else planned.add(night.mealId);
  }
  return { strong, planned };
}

export function soupScore(
  soup: Meal,
  nights: Record<string, { kind: string; mealId?: string; cooked: boolean }>,
  favorites: string[],
): number {
  const { strong, planned } = signalIds(nights, favorites);
  let score = 0;
  for (const id of soup.echoes ?? []) {
    if (strong.has(id)) score += 3;
    else if (planned.has(id)) score += 1;
  }
  return score;
}

export function isLovedSoup(meal: Meal, favorites: string[]): boolean {
  if (!meal.tags.includes("soup")) return false;
  return meal.household === true || meal.id.startsWith("ours-") || favorites.includes(meal.id);
}
