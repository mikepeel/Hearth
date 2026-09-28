import { HOUSEHOLD } from "@/lib/household";
import { SOUPS } from "@/lib/soups";

export type Aisle =
  | "Produce"
  | "Protein"
  | "Dairy"
  | "Bakery"
  | "Frozen"
  | "Pantry"
  | "Spices";

export type Tag =
  | "quick"
  | "vegetarian"
  | "high-protein"
  | "one-pan"
  | "kid-friendly"
  | "seafood"
  | "soup";

export type Ingredient = {
  name: string;
  amount: number;
  unit: string;
  aisle: Aisle;
};

export type Meal = {
  id: string;
  name: string;
  cuisine: string;
  minutes: number;
  servings: number;
  effort: "Easy" | "Steady";
  tags: Tag[];
  summary: string;
  because?: string;
  echoes?: string[];
  household?: boolean;
  ingredients: Ingredient[];
  steps: string[];
};

export const TAG_LABEL: Record<Tag, string> = {
  quick: "Quick",
  vegetarian: "Vegetarian",
  "high-protein": "High-protein",
  "one-pan": "One-pan",
  "kid-friendly": "Kid-friendly",
  seafood: "Seafood",
  soup: "Soup",
};

export const FILTERS = [
  { id: "all", label: "All" },
  { id: "saved", label: "Saved" },
  { id: "quick", label: "Quick" },
  { id: "vegetarian", label: "Vegetarian" },
  { id: "seafood", label: "Seafood" },
  { id: "one-pan", label: "One-pan" },
  { id: "kid-friendly", label: "Kid-friendly" },
  { id: "high-protein", label: "High-protein" },
] as const;

export type FilterId = (typeof FILTERS)[number]["id"];

export function isOurs(meal: { id: string; household?: boolean }): boolean {
  return meal.household === true || meal.id.startsWith("ours-");
}

export const MEALS: Meal[] = [
  {
    "id": "lemon-garlic-chicken",
    "name": "Lemon garlic chicken thighs",
    "cuisine": "Mediterranean",
    "minutes": 35,
    "servings": 4,
    "effort": "Easy",
    "tags": [
      "high-protein",
      "one-pan",
      "kid-friendly"
    ],
    "summary": "Thighs seared with lemon, garlic, and oregano, with potatoes finishing in the same pan.",
    "ingredients": [
      {
        "name": "Bone-in chicken thigh",
        "amount": 3,
        "unit": "lb",
        "aisle": "Protein"
      },
      {
        "name": "Baby potatoes",
        "amount": 1,
        "unit": "lb",
        "aisle": "Produce"
      },
      {
        "name": "Lemon",
        "amount": 2,
        "unit": "",
        "aisle": "Produce"
      },
      {
        "name": "Garlic",
        "amount": 4,
        "unit": "clove",
        "aisle": "Produce"
      },
      {
        "name": "Fresh parsley",
        "amount": 1,
        "unit": "bunch",
        "aisle": "Produce"
      },
      {
        "name": "Olive oil",
        "amount": 2,
        "unit": "tbsp",
        "aisle": "Pantry"
      },
      {
        "name": "Dried oregano",
        "amount": 1,
        "unit": "tbsp",
        "aisle": "Spices"
      }
    ],
    "steps": [
      "Heat the oven to 425°F. Halve the potatoes, toss with a tablespoon of oil, and start them on a sheet pan.",
      "Season the thighs with oregano, salt, and pepper. Sear skin-side down in the remaining oil until the skin is deep gold.",
      "Add smashed garlic and lemon slices to the pan, then nestle the thighs among the potatoes.",
      "Roast about 20 minutes, until the chicken is cooked through. Shower with parsley and a squeeze of lemon."
    ]
  },
  {
    "id": "sheet-pan-salmon",
    "name": "Sheet-pan salmon and broccoli",
    "cuisine": "American",
    "minutes": 25,
    "servings": 4,
    "effort": "Easy",
    "tags": [
      "quick",
      "high-protein",
      "one-pan",
      "seafood"
    ],
    "summary": "Salmon and broccoli on one pan, finished with a mustard-lemon gloss.",
    "ingredients": [
      {
        "name": "Salmon fillet",
        "amount": 1.5,
        "unit": "lb",
        "aisle": "Protein"
      },
      {
        "name": "Broccoli",
        "amount": 1,
        "unit": "lb",
        "aisle": "Produce"
      },
      {
        "name": "Lemon",
        "amount": 1,
        "unit": "",
        "aisle": "Produce"
      },
      {
        "name": "Garlic",
        "amount": 2,
        "unit": "clove",
        "aisle": "Produce"
      },
      {
        "name": "Dijon mustard",
        "amount": 1,
        "unit": "tbsp",
        "aisle": "Pantry"
      },
      {
        "name": "Olive oil",
        "amount": 2,
        "unit": "tbsp",
        "aisle": "Pantry"
      }
    ],
    "steps": [
      "Heat the oven to 425°F. Toss broccoli with oil, salt, and pepper on a sheet pan and roast 8 minutes.",
      "Stir Dijon, grated garlic, and lemon juice. Pat the salmon dry and brush it on.",
      "Push the broccoli aside, add the salmon, and roast 10 to 12 minutes, until it flakes.",
      "Finish with lemon zest and more pepper. Serve straight from the pan."
    ]
  },
  {
    "id": "beef-taco-skillet",
    "name": "Beef taco skillet",
    "cuisine": "Mexican",
    "minutes": 30,
    "servings": 4,
    "effort": "Easy",
    "tags": [
      "kid-friendly",
      "one-pan",
      "high-protein"
    ],
    "summary": "A one-pan taco night: beef, beans, peppers, and a handful of cheddar.",
    "ingredients": [
      {
        "name": "Ground beef",
        "amount": 1.5,
        "unit": "lb",
        "aisle": "Protein"
      },
      {
        "name": "Yellow onion",
        "amount": 1,
        "unit": "",
        "aisle": "Produce"
      },
      {
        "name": "Bell pepper",
        "amount": 1,
        "unit": "",
        "aisle": "Produce"
      },
      {
        "name": "Black beans (15 oz)",
        "amount": 1,
        "unit": "can",
        "aisle": "Pantry"
      },
      {
        "name": "Salsa",
        "amount": 1,
        "unit": "cup",
        "aisle": "Pantry"
      },
      {
        "name": "Frozen corn",
        "amount": 1,
        "unit": "cup",
        "aisle": "Frozen"
      },
      {
        "name": "Shredded cheddar",
        "amount": 8,
        "unit": "oz",
        "aisle": "Dairy"
      },
      {
        "name": "Taco seasoning",
        "amount": 2,
        "unit": "tbsp",
        "aisle": "Spices"
      }
    ],
    "steps": [
      "Brown the beef with diced onion in a wide skillet, then drain the extra fat.",
      "Stir in sliced pepper, corn, drained beans, salsa, and taco seasoning. Simmer 8 minutes.",
      "Cover with cheddar and let it melt with the lid on for a minute.",
      "Serve in bowls with whatever crunch you already have — lettuce, chips, or tortillas."
    ]
  },
  {
    "id": "creamy-tomato-pasta",
    "name": "Creamy tomato penne",
    "cuisine": "Italian",
    "minutes": 25,
    "servings": 4,
    "effort": "Easy",
    "tags": [
      "vegetarian",
      "quick",
      "kid-friendly"
    ],
    "summary": "A pantry pasta with crushed tomatoes, a splash of cream, and plenty of garlic.",
    "ingredients": [
      {
        "name": "Penne",
        "amount": 12,
        "unit": "oz",
        "aisle": "Pantry"
      },
      {
        "name": "Crushed tomatoes (28 oz)",
        "amount": 1,
        "unit": "can",
        "aisle": "Pantry"
      },
      {
        "name": "Yellow onion",
        "amount": 1,
        "unit": "",
        "aisle": "Produce"
      },
      {
        "name": "Garlic",
        "amount": 4,
        "unit": "clove",
        "aisle": "Produce"
      },
      {
        "name": "Heavy cream",
        "amount": 0.5,
        "unit": "cup",
        "aisle": "Dairy"
      },
      {
        "name": "Parmesan",
        "amount": 2,
        "unit": "oz",
        "aisle": "Dairy"
      },
      {
        "name": "Italian seasoning",
        "amount": 1,
        "unit": "tbsp",
        "aisle": "Spices"
      }
    ],
    "steps": [
      "Boil the penne in salted water until just al dente. Save a cup of pasta water.",
      "Soften diced onion in olive oil, then add garlic and Italian seasoning for a minute.",
      "Pour in the tomatoes and simmer 8 minutes. Stir in the cream and grated Parmesan.",
      "Toss with the pasta, loosening with pasta water until it clings. Salt to taste."
    ]
  },
  {
    "id": "thai-basil-chicken",
    "name": "Thai basil chicken",
    "cuisine": "Thai",
    "minutes": 20,
    "servings": 4,
    "effort": "Easy",
    "tags": [
      "quick",
      "high-protein",
      "one-pan"
    ],
    "summary": "Fast ground chicken with basil, chiles, and a spoon of rice.",
    "ingredients": [
      {
        "name": "Ground chicken",
        "amount": 1.5,
        "unit": "lb",
        "aisle": "Protein"
      },
      {
        "name": "Jasmine rice",
        "amount": 1.5,
        "unit": "cup",
        "aisle": "Pantry"
      },
      {
        "name": "Yellow onion",
        "amount": 1,
        "unit": "",
        "aisle": "Produce"
      },
      {
        "name": "Bell pepper",
        "amount": 1,
        "unit": "",
        "aisle": "Produce"
      },
      {
        "name": "Garlic",
        "amount": 4,
        "unit": "clove",
        "aisle": "Produce"
      },
      {
        "name": "Fresh basil",
        "amount": 1,
        "unit": "bunch",
        "aisle": "Produce"
      },
      {
        "name": "Soy sauce",
        "amount": 3,
        "unit": "tbsp",
        "aisle": "Pantry"
      },
      {
        "name": "Fish sauce",
        "amount": 1,
        "unit": "tbsp",
        "aisle": "Pantry"
      },
      {
        "name": "Brown sugar",
        "amount": 1,
        "unit": "tbsp",
        "aisle": "Pantry"
      },
      {
        "name": "Chili garlic sauce",
        "amount": 2,
        "unit": "tsp",
        "aisle": "Pantry"
      }
    ],
    "steps": [
      "Start the rice. Slice the onion and pepper while it cooks.",
      "Brown the chicken in a hot skillet, breaking it up, until it starts to sear.",
      "Add onion, pepper, and garlic. Stir in soy sauce, fish sauce, sugar, and chili sauce.",
      "Toss in torn basil off the heat. Serve over rice."
    ]
  },
  {
    "id": "chickpea-curry",
    "name": "Coconut chickpea curry",
    "cuisine": "Indian",
    "minutes": 30,
    "servings": 4,
    "effort": "Easy",
    "tags": [
      "vegetarian",
      "one-pan"
    ],
    "summary": "A pot of chickpeas in coconut milk and tomatoes, with rice on the side.",
    "ingredients": [
      {
        "name": "Chickpeas (15 oz)",
        "amount": 2,
        "unit": "can",
        "aisle": "Pantry"
      },
      {
        "name": "Coconut milk (14 oz)",
        "amount": 1,
        "unit": "can",
        "aisle": "Pantry"
      },
      {
        "name": "Diced tomatoes (14 oz)",
        "amount": 1,
        "unit": "can",
        "aisle": "Pantry"
      },
      {
        "name": "Basmati rice",
        "amount": 1.5,
        "unit": "cup",
        "aisle": "Pantry"
      },
      {
        "name": "Yellow onion",
        "amount": 1,
        "unit": "",
        "aisle": "Produce"
      },
      {
        "name": "Garlic",
        "amount": 3,
        "unit": "clove",
        "aisle": "Produce"
      },
      {
        "name": "Fresh ginger",
        "amount": 1,
        "unit": "tbsp",
        "aisle": "Produce"
      },
      {
        "name": "Baby spinach",
        "amount": 5,
        "unit": "oz",
        "aisle": "Produce"
      },
      {
        "name": "Lime",
        "amount": 1,
        "unit": "",
        "aisle": "Produce"
      },
      {
        "name": "Curry powder",
        "amount": 1,
        "unit": "tbsp",
        "aisle": "Spices"
      },
      {
        "name": "Garam masala",
        "amount": 1,
        "unit": "tsp",
        "aisle": "Spices"
      }
    ],
    "steps": [
      "Rinse the rice and start it. Dice the onion.",
      "Soften the onion in oil, then add garlic, ginger, curry powder, and garam masala.",
      "Stir in drained chickpeas, tomatoes, and coconut milk. Simmer 12 minutes.",
      "Wilt in the spinach. Finish with lime juice and serve over rice."
    ]
  },
  {
    "id": "shrimp-scampi",
    "name": "Garlic shrimp scampi",
    "cuisine": "Italian",
    "minutes": 20,
    "servings": 4,
    "effort": "Easy",
    "tags": [
      "quick",
      "seafood"
    ],
    "summary": "Butter, garlic, lemon, and shrimp over linguine. Done before the pasta cools.",
    "ingredients": [
      {
        "name": "Shrimp",
        "amount": 1.5,
        "unit": "lb",
        "aisle": "Protein"
      },
      {
        "name": "Linguine",
        "amount": 8,
        "unit": "oz",
        "aisle": "Pantry"
      },
      {
        "name": "Garlic",
        "amount": 4,
        "unit": "clove",
        "aisle": "Produce"
      },
      {
        "name": "Lemon",
        "amount": 1,
        "unit": "",
        "aisle": "Produce"
      },
      {
        "name": "Fresh parsley",
        "amount": 0.25,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "name": "Butter",
        "amount": 3,
        "unit": "tbsp",
        "aisle": "Dairy"
      },
      {
        "name": "Red pepper flakes",
        "amount": 0.5,
        "unit": "tsp",
        "aisle": "Spices"
      }
    ],
    "steps": [
      "Boil linguine in salted water. Peel the shrimp if needed and pat them dry.",
      "Melt butter in a wide skillet. Add garlic and pepper flakes for 30 seconds.",
      "Cook the shrimp until just pink, a minute or two a side. Add lemon juice and a splash of pasta water.",
      "Toss with the drained pasta and parsley. Serve immediately."
    ]
  },
  {
    "id": "korean-beef-bowls",
    "name": "Korean beef bowls",
    "cuisine": "Korean",
    "minutes": 25,
    "servings": 4,
    "effort": "Easy",
    "tags": [
      "quick",
      "high-protein"
    ],
    "summary": "Sweet-savory beef over rice, with cool cucumber and green onion.",
    "ingredients": [
      {
        "name": "Ground beef",
        "amount": 1.5,
        "unit": "lb",
        "aisle": "Protein"
      },
      {
        "name": "Jasmine rice",
        "amount": 1.5,
        "unit": "cup",
        "aisle": "Pantry"
      },
      {
        "name": "Garlic",
        "amount": 4,
        "unit": "clove",
        "aisle": "Produce"
      },
      {
        "name": "Cucumber",
        "amount": 1,
        "unit": "",
        "aisle": "Produce"
      },
      {
        "name": "Green onion",
        "amount": 3,
        "unit": "",
        "aisle": "Produce"
      },
      {
        "name": "Soy sauce",
        "amount": 0.25,
        "unit": "cup",
        "aisle": "Pantry"
      },
      {
        "name": "Brown sugar",
        "amount": 2,
        "unit": "tbsp",
        "aisle": "Pantry"
      },
      {
        "name": "Sesame oil",
        "amount": 1,
        "unit": "tbsp",
        "aisle": "Pantry"
      },
      {
        "name": "Gochujang",
        "amount": 1,
        "unit": "tbsp",
        "aisle": "Pantry"
      },
      {
        "name": "Fresh ginger",
        "amount": 1,
        "unit": "tsp",
        "aisle": "Produce"
      },
      {
        "name": "Sesame seeds",
        "amount": 1,
        "unit": "tbsp",
        "aisle": "Spices"
      }
    ],
    "steps": [
      "Start the rice. Slice the cucumber and green onions.",
      "Brown the beef, then drain most of the fat.",
      "Stir in garlic, ginger, soy sauce, brown sugar, sesame oil, and gochujang. Simmer 3 minutes.",
      "Spoon over rice. Top with cucumber, green onion, and sesame seeds."
    ]
  },
  {
    "id": "greek-chicken-pitas",
    "name": "Greek chicken pitas",
    "cuisine": "Mediterranean",
    "minutes": 30,
    "servings": 4,
    "effort": "Easy",
    "tags": [
      "high-protein"
    ],
    "summary": "Oregano chicken, tomato, cucumber, and a yogurt sauce stuffed into warm pitas.",
    "ingredients": [
      {
        "name": "Chicken breast",
        "amount": 1.5,
        "unit": "lb",
        "aisle": "Protein"
      },
      {
        "name": "Pita",
        "amount": 4,
        "unit": "",
        "aisle": "Bakery"
      },
      {
        "name": "Cucumber",
        "amount": 1,
        "unit": "",
        "aisle": "Produce"
      },
      {
        "name": "Tomato",
        "amount": 2,
        "unit": "",
        "aisle": "Produce"
      },
      {
        "name": "Red onion",
        "amount": 0.5,
        "unit": "",
        "aisle": "Produce"
      },
      {
        "name": "Lemon",
        "amount": 1,
        "unit": "",
        "aisle": "Produce"
      },
      {
        "name": "Greek yogurt",
        "amount": 1,
        "unit": "cup",
        "aisle": "Dairy"
      },
      {
        "name": "Feta",
        "amount": 4,
        "unit": "oz",
        "aisle": "Dairy"
      },
      {
        "name": "Dried oregano",
        "amount": 1,
        "unit": "tbsp",
        "aisle": "Spices"
      },
      {
        "name": "Garlic powder",
        "amount": 1,
        "unit": "tsp",
        "aisle": "Spices"
      }
    ],
    "steps": [
      "Toss bite-size chicken with oregano, garlic powder, lemon juice, salt, pepper, and a little oil.",
      "Sear in a skillet until cooked through and browned at the edges, about 8 minutes.",
      "Stir yogurt with a pinch of salt and a little lemon. Dice cucumber, tomato, and onion.",
      "Warm the pitas. Fill with chicken, vegetables, feta, and yogurt sauce."
    ]
  },
  {
    "id": "white-chicken-chili",
    "name": "White chicken chili",
    "cuisine": "American",
    "minutes": 40,
    "servings": 6,
    "effort": "Steady",
    "tags": [
      "soup",
      "high-protein",
      "kid-friendly"
    ],
    "household": true,
    "summary": "A mild, creamy chili with white beans, green chiles, and shredded chicken.",
    "ingredients": [
      {
        "name": "Chicken breast",
        "amount": 1.5,
        "unit": "lb",
        "aisle": "Protein"
      },
      {
        "name": "White beans (15 oz)",
        "amount": 2,
        "unit": "can",
        "aisle": "Pantry"
      },
      {
        "name": "Diced green chiles (4 oz)",
        "amount": 1,
        "unit": "can",
        "aisle": "Pantry"
      },
      {
        "name": "Chicken broth",
        "amount": 32,
        "unit": "oz",
        "aisle": "Pantry"
      },
      {
        "name": "Yellow onion",
        "amount": 1,
        "unit": "",
        "aisle": "Produce"
      },
      {
        "name": "Garlic",
        "amount": 3,
        "unit": "clove",
        "aisle": "Produce"
      },
      {
        "name": "Lime",
        "amount": 1,
        "unit": "",
        "aisle": "Produce"
      },
      {
        "name": "Fresh cilantro",
        "amount": 0.5,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "name": "Sour cream",
        "amount": 0.5,
        "unit": "cup",
        "aisle": "Dairy"
      },
      {
        "name": "Shredded Monterey Jack",
        "amount": 4,
        "unit": "oz",
        "aisle": "Dairy"
      },
      {
        "name": "Ground cumin",
        "amount": 2,
        "unit": "tsp",
        "aisle": "Spices"
      },
      {
        "name": "Dried oregano",
        "amount": 1,
        "unit": "tsp",
        "aisle": "Spices"
      }
    ],
    "steps": [
      "Simmer chicken in broth with onion, garlic, cumin, and oregano until the chicken shreds easily, about 18 minutes.",
      "Pull the chicken out, shred it, and return it to the pot.",
      "Add drained beans and green chiles. Simmer 10 minutes more.",
      "Stir in sour cream off the heat. Serve with cheese, cilantro, and lime."
    ]
  },
  {
    "id": "veggie-fried-rice",
    "name": "Vegetable fried rice",
    "cuisine": "Chinese",
    "minutes": 20,
    "servings": 4,
    "effort": "Easy",
    "tags": [
      "vegetarian",
      "quick",
      "one-pan"
    ],
    "summary": "Cold rice, a hot pan, eggs, and frozen vegetables. Better than takeout leftovers.",
    "ingredients": [
      {
        "name": "Cooked rice",
        "amount": 4,
        "unit": "cup",
        "aisle": "Pantry"
      },
      {
        "name": "Egg",
        "amount": 2,
        "unit": "",
        "aisle": "Dairy"
      },
      {
        "name": "Frozen mixed vegetables",
        "amount": 2,
        "unit": "cup",
        "aisle": "Frozen"
      },
      {
        "name": "Green onion",
        "amount": 3,
        "unit": "",
        "aisle": "Produce"
      },
      {
        "name": "Garlic",
        "amount": 2,
        "unit": "clove",
        "aisle": "Produce"
      },
      {
        "name": "Soy sauce",
        "amount": 3,
        "unit": "tbsp",
        "aisle": "Pantry"
      },
      {
        "name": "Sesame oil",
        "amount": 1,
        "unit": "tbsp",
        "aisle": "Pantry"
      }
    ],
    "steps": [
      "Use cold leftover rice if you have it. If not, cook the rice ahead and spread it out so it dries.",
      "Scramble the eggs in a little oil in a hot pan and set them aside.",
      "Stir-fry the vegetables and garlic, then add the rice and press it until the edges toast.",
      "Return the eggs. Add soy sauce, sesame oil, and sliced green onion. Toss and serve."
    ]
  },
  {
    "id": "pesto-chicken-pasta",
    "name": "Pesto chicken pasta",
    "cuisine": "Italian",
    "minutes": 25,
    "servings": 4,
    "effort": "Easy",
    "tags": [
      "quick",
      "kid-friendly",
      "high-protein"
    ],
    "summary": "Sear chicken, toss pasta with pesto, burst a few tomatoes in the pan.",
    "ingredients": [
      {
        "name": "Chicken breast",
        "amount": 1,
        "unit": "lb",
        "aisle": "Protein"
      },
      {
        "name": "Pasta",
        "amount": 12,
        "unit": "oz",
        "aisle": "Pantry"
      },
      {
        "name": "Basil pesto",
        "amount": 0.5,
        "unit": "cup",
        "aisle": "Pantry"
      },
      {
        "name": "Cherry tomatoes",
        "amount": 1,
        "unit": "pint",
        "aisle": "Produce"
      },
      {
        "name": "Baby spinach",
        "amount": 5,
        "unit": "oz",
        "aisle": "Produce"
      },
      {
        "name": "Parmesan",
        "amount": 2,
        "unit": "oz",
        "aisle": "Dairy"
      },
      {
        "name": "Olive oil",
        "amount": 1,
        "unit": "tbsp",
        "aisle": "Pantry"
      }
    ],
    "steps": [
      "Boil the pasta in salted water. Slice the chicken into strips and season it.",
      "Sear the chicken in oil until cooked through. Set it aside.",
      "Add tomatoes to the pan until they blister. Toss in spinach to wilt.",
      "Combine pasta, chicken, pesto, and a splash of pasta water. Finish with Parmesan."
    ]
  },
  {
    "id": "fish-tacos",
    "name": "Crispy fish tacos",
    "cuisine": "Mexican",
    "minutes": 25,
    "servings": 4,
    "effort": "Easy",
    "tags": [
      "quick",
      "seafood"
    ],
    "summary": "Spiced white fish, cabbage, and a quick lime crema in warm corn tortillas.",
    "ingredients": [
      {
        "name": "Cod fillet",
        "amount": 1.5,
        "unit": "lb",
        "aisle": "Protein"
      },
      {
        "name": "Corn tortilla",
        "amount": 8,
        "unit": "",
        "aisle": "Pantry"
      },
      {
        "name": "Green cabbage",
        "amount": 0.5,
        "unit": "head",
        "aisle": "Produce"
      },
      {
        "name": "Lime",
        "amount": 2,
        "unit": "",
        "aisle": "Produce"
      },
      {
        "name": "Fresh cilantro",
        "amount": 0.25,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "name": "Sour cream",
        "amount": 0.5,
        "unit": "cup",
        "aisle": "Dairy"
      },
      {
        "name": "Olive oil",
        "amount": 1,
        "unit": "tbsp",
        "aisle": "Pantry"
      },
      {
        "name": "Chili powder",
        "amount": 1,
        "unit": "tsp",
        "aisle": "Spices"
      },
      {
        "name": "Ground cumin",
        "amount": 1,
        "unit": "tsp",
        "aisle": "Spices"
      }
    ],
    "steps": [
      "Stir sour cream with lime juice and a pinch of salt. Shred the cabbage and toss with a little lime.",
      "Cut the fish into strips. Season with chili powder, cumin, salt, and pepper.",
      "Sear in oil over medium-high heat, 2 to 3 minutes a side, until the edges crisp.",
      "Warm the tortillas. Fill with fish, cabbage, crema, and cilantro."
    ]
  },
  {
    "id": "sausage-peppers",
    "name": "Sausage and peppers",
    "cuisine": "Italian",
    "minutes": 30,
    "servings": 4,
    "effort": "Easy",
    "tags": [
      "one-pan",
      "kid-friendly"
    ],
    "summary": "Sweet peppers and onion collapsed around Italian sausage, piled on rolls.",
    "ingredients": [
      {
        "name": "Italian sausage",
        "amount": 1.5,
        "unit": "lb",
        "aisle": "Protein"
      },
      {
        "name": "Bell pepper",
        "amount": 3,
        "unit": "",
        "aisle": "Produce"
      },
      {
        "name": "Yellow onion",
        "amount": 1,
        "unit": "",
        "aisle": "Produce"
      },
      {
        "name": "Garlic",
        "amount": 2,
        "unit": "clove",
        "aisle": "Produce"
      },
      {
        "name": "Hoagie roll",
        "amount": 4,
        "unit": "",
        "aisle": "Bakery"
      },
      {
        "name": "Olive oil",
        "amount": 1,
        "unit": "tbsp",
        "aisle": "Pantry"
      },
      {
        "name": "Italian seasoning",
        "amount": 1,
        "unit": "tsp",
        "aisle": "Spices"
      }
    ],
    "steps": [
      "Brown the sausages in a little oil in a wide pan, then set them aside.",
      "Add sliced peppers and onion. Cook until they soften and pick up color, about 10 minutes.",
      "Add garlic and Italian seasoning. Return the sausages and cover until they are cooked through.",
      "Split the rolls and pile on the sausage and peppers."
    ]
  },
  {
    "id": "mushroom-risotto",
    "name": "Mushroom risotto",
    "cuisine": "Italian",
    "minutes": 40,
    "servings": 4,
    "effort": "Steady",
    "tags": [
      "vegetarian"
    ],
    "summary": "A stirring dinner: mushrooms, arborio, and Parmesan. Worth staying by the pot.",
    "ingredients": [
      {
        "name": "Arborio rice",
        "amount": 1.5,
        "unit": "cup",
        "aisle": "Pantry"
      },
      {
        "name": "Mixed mushrooms",
        "amount": 1,
        "unit": "lb",
        "aisle": "Produce"
      },
      {
        "name": "Yellow onion",
        "amount": 1,
        "unit": "",
        "aisle": "Produce"
      },
      {
        "name": "Garlic",
        "amount": 2,
        "unit": "clove",
        "aisle": "Produce"
      },
      {
        "name": "Fresh parsley",
        "amount": 2,
        "unit": "tbsp",
        "aisle": "Produce"
      },
      {
        "name": "Vegetable broth",
        "amount": 32,
        "unit": "oz",
        "aisle": "Pantry"
      },
      {
        "name": "Dry white wine",
        "amount": 0.5,
        "unit": "cup",
        "aisle": "Pantry"
      },
      {
        "name": "Parmesan",
        "amount": 2,
        "unit": "oz",
        "aisle": "Dairy"
      },
      {
        "name": "Butter",
        "amount": 2,
        "unit": "tbsp",
        "aisle": "Dairy"
      }
    ],
    "steps": [
      "Warm the broth in a saucepan and keep it steaming. Slice the mushrooms.",
      "Brown the mushrooms in butter, season them, and set aside. Soften diced onion in the same pot, then add garlic and rice.",
      "Pour in the wine and stir until it disappears. Add broth a ladle at a time, stirring, until the rice is tender, about 18 minutes.",
      "Fold in the mushrooms, Parmesan, and parsley. Rest two minutes, then serve."
    ]
  },
  {
    "id": "teriyaki-salmon",
    "name": "Teriyaki salmon bowls",
    "cuisine": "Japanese",
    "minutes": 25,
    "servings": 4,
    "effort": "Easy",
    "tags": [
      "quick",
      "seafood",
      "high-protein"
    ],
    "summary": "Glazed salmon, rice, and broccoli with a quick homemade teriyaki.",
    "ingredients": [
      {
        "name": "Salmon fillet",
        "amount": 1.5,
        "unit": "lb",
        "aisle": "Protein"
      },
      {
        "name": "Jasmine rice",
        "amount": 1.5,
        "unit": "cup",
        "aisle": "Pantry"
      },
      {
        "name": "Broccoli",
        "amount": 1,
        "unit": "lb",
        "aisle": "Produce"
      },
      {
        "name": "Green onion",
        "amount": 2,
        "unit": "",
        "aisle": "Produce"
      },
      {
        "name": "Garlic",
        "amount": 2,
        "unit": "clove",
        "aisle": "Produce"
      },
      {
        "name": "Fresh ginger",
        "amount": 1,
        "unit": "tsp",
        "aisle": "Produce"
      },
      {
        "name": "Soy sauce",
        "amount": 0.25,
        "unit": "cup",
        "aisle": "Pantry"
      },
      {
        "name": "Honey",
        "amount": 2,
        "unit": "tbsp",
        "aisle": "Pantry"
      },
      {
        "name": "Rice vinegar",
        "amount": 1,
        "unit": "tbsp",
        "aisle": "Pantry"
      },
      {
        "name": "Sesame seeds",
        "amount": 1,
        "unit": "tbsp",
        "aisle": "Spices"
      }
    ],
    "steps": [
      "Start the rice. Steam or roast the broccoli until just tender.",
      "Simmer soy sauce, honey, vinegar, garlic, and ginger until slightly thick.",
      "Sear salmon in a slicked pan, 4 minutes a side. Brush with the glaze for the last minute.",
      "Slice the salmon over rice and broccoli. Scatter green onion and sesame seeds."
    ]
  },
  {
    "id": "black-bean-enchiladas",
    "name": "Black bean enchiladas",
    "cuisine": "Mexican",
    "minutes": 40,
    "servings": 6,
    "effort": "Steady",
    "tags": [
      "vegetarian",
      "kid-friendly"
    ],
    "summary": "Rolled tortillas, black beans, and a blanket of sauce and cheddar.",
    "ingredients": [
      {
        "name": "Black beans (15 oz)",
        "amount": 2,
        "unit": "can",
        "aisle": "Pantry"
      },
      {
        "name": "Flour tortilla",
        "amount": 8,
        "unit": "",
        "aisle": "Pantry"
      },
      {
        "name": "Enchilada sauce (15 oz)",
        "amount": 2,
        "unit": "can",
        "aisle": "Pantry"
      },
      {
        "name": "Yellow onion",
        "amount": 1,
        "unit": "",
        "aisle": "Produce"
      },
      {
        "name": "Bell pepper",
        "amount": 1,
        "unit": "",
        "aisle": "Produce"
      },
      {
        "name": "Fresh cilantro",
        "amount": 0.25,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "name": "Shredded cheddar",
        "amount": 8,
        "unit": "oz",
        "aisle": "Dairy"
      },
      {
        "name": "Ground cumin",
        "amount": 1,
        "unit": "tsp",
        "aisle": "Spices"
      },
      {
        "name": "Chili powder",
        "amount": 1,
        "unit": "tsp",
        "aisle": "Spices"
      }
    ],
    "steps": [
      "Heat the oven to 375°F. Soften diced onion and pepper in a skillet. Stir in drained beans, cumin, and chili powder.",
      "Spread a little enchilada sauce in a baking dish. Fill tortillas with the bean mixture and a bit of cheese, then roll them seam-side down.",
      "Cover with the rest of the sauce and cheese.",
      "Bake 20 minutes, until bubbling. Rest 5 minutes and finish with cilantro."
    ]
  },
  {
    "id": "honey-mustard-pork",
    "name": "Honey mustard pork chops",
    "cuisine": "American",
    "minutes": 30,
    "servings": 4,
    "effort": "Easy",
    "tags": [
      "high-protein",
      "kid-friendly",
      "one-pan"
    ],
    "summary": "A sticky honey-mustard glaze, pork chops, potatoes, and green beans.",
    "ingredients": [
      {
        "name": "Pork chop",
        "amount": 4,
        "unit": "",
        "aisle": "Protein"
      },
      {
        "name": "Baby potatoes",
        "amount": 1,
        "unit": "lb",
        "aisle": "Produce"
      },
      {
        "name": "Green beans",
        "amount": 1,
        "unit": "lb",
        "aisle": "Produce"
      },
      {
        "name": "Garlic",
        "amount": 2,
        "unit": "clove",
        "aisle": "Produce"
      },
      {
        "name": "Honey",
        "amount": 2,
        "unit": "tbsp",
        "aisle": "Pantry"
      },
      {
        "name": "Dijon mustard",
        "amount": 2,
        "unit": "tbsp",
        "aisle": "Pantry"
      },
      {
        "name": "Apple cider vinegar",
        "amount": 1,
        "unit": "tbsp",
        "aisle": "Pantry"
      },
      {
        "name": "Olive oil",
        "amount": 2,
        "unit": "tbsp",
        "aisle": "Pantry"
      }
    ],
    "steps": [
      "Heat the oven to 425°F. Halve the potatoes, toss with oil and salt, and roast 12 minutes.",
      "Stir honey, Dijon, vinegar, and grated garlic. Season the chops.",
      "Sear the chops 2 minutes a side, brush with the glaze, and add them to the pan with the green beans.",
      "Roast about 10 minutes, until the chops are just cooked and the beans blister."
    ]
  },
  {
    "id": "shakshuka",
    "name": "Skillet shakshuka",
    "cuisine": "Middle Eastern",
    "minutes": 25,
    "servings": 4,
    "effort": "Easy",
    "tags": [
      "vegetarian",
      "quick",
      "one-pan"
    ],
    "summary": "Eggs poached in a pepper-tomato skillet, with bread for the sauce.",
    "ingredients": [
      {
        "name": "Crushed tomatoes (28 oz)",
        "amount": 1,
        "unit": "can",
        "aisle": "Pantry"
      },
      {
        "name": "Egg",
        "amount": 6,
        "unit": "",
        "aisle": "Dairy"
      },
      {
        "name": "Yellow onion",
        "amount": 1,
        "unit": "",
        "aisle": "Produce"
      },
      {
        "name": "Bell pepper",
        "amount": 1,
        "unit": "",
        "aisle": "Produce"
      },
      {
        "name": "Garlic",
        "amount": 4,
        "unit": "clove",
        "aisle": "Produce"
      },
      {
        "name": "Fresh parsley",
        "amount": 0.25,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "name": "Crusty bread",
        "amount": 1,
        "unit": "loaf",
        "aisle": "Bakery"
      },
      {
        "name": "Feta",
        "amount": 2,
        "unit": "oz",
        "aisle": "Dairy"
      },
      {
        "name": "Ground cumin",
        "amount": 1,
        "unit": "tsp",
        "aisle": "Spices"
      },
      {
        "name": "Paprika",
        "amount": 1,
        "unit": "tsp",
        "aisle": "Spices"
      },
      {
        "name": "Red pepper flakes",
        "amount": 0.25,
        "unit": "tsp",
        "aisle": "Spices"
      }
    ],
    "steps": [
      "Soften sliced onion and pepper in olive oil. Add garlic, cumin, paprika, and pepper flakes.",
      "Pour in the tomatoes and simmer 8 minutes until thick enough to hold an egg.",
      "Make six wells and crack in the eggs. Cover and cook until the whites set, about 6 minutes.",
      "Top with feta and parsley. Serve with torn bread."
    ]
  },
  {
    "id": "bbq-chicken-bowls",
    "name": "BBQ chicken rice bowls",
    "cuisine": "American",
    "minutes": 30,
    "servings": 4,
    "effort": "Easy",
    "tags": [
      "high-protein",
      "kid-friendly"
    ],
    "summary": "Sauced chicken, rice, beans, corn, and a little crunch from cabbage.",
    "ingredients": [
      {
        "name": "Chicken breast",
        "amount": 1.5,
        "unit": "lb",
        "aisle": "Protein"
      },
      {
        "name": "Jasmine rice",
        "amount": 1.5,
        "unit": "cup",
        "aisle": "Pantry"
      },
      {
        "name": "Barbecue sauce",
        "amount": 0.5,
        "unit": "cup",
        "aisle": "Pantry"
      },
      {
        "name": "Black beans (15 oz)",
        "amount": 1,
        "unit": "can",
        "aisle": "Pantry"
      },
      {
        "name": "Corn (15 oz)",
        "amount": 1,
        "unit": "can",
        "aisle": "Pantry"
      },
      {
        "name": "Green cabbage",
        "amount": 2,
        "unit": "cup",
        "aisle": "Produce"
      },
      {
        "name": "Green onion",
        "amount": 2,
        "unit": "",
        "aisle": "Produce"
      },
      {
        "name": "Shredded cheddar",
        "amount": 4,
        "unit": "oz",
        "aisle": "Dairy"
      }
    ],
    "steps": [
      "Start the rice. Cut the chicken into bite-size pieces and season with salt and pepper.",
      "Sear the chicken until cooked through. Stir in barbecue sauce and let it glaze for a minute.",
      "Warm drained beans and corn together in a small pan.",
      "Build bowls: rice, chicken, beans, corn, cabbage, cheddar, and green onion."
    ]
  },
  {
    "id": "tater-tot-casserole",
    "name": "Tater tot casserole",
    "cuisine": "American",
    "minutes": 50,
    "servings": 6,
    "effort": "Steady",
    "tags": ["kid-friendly"],
    "household": true,
    "summary": "Ground beef and crisp tater tots baked under cheddar.",
    "ingredients": [
      { "name": "Ground beef", "amount": 1, "unit": "lb", "aisle": "Protein" },
      { "name": "Yellow onion", "amount": 1, "unit": "", "aisle": "Produce" },
      { "name": "Cream of mushroom soup", "amount": 1, "unit": "can", "aisle": "Pantry" },
      { "name": "Frozen tater tots", "amount": 32, "unit": "oz", "aisle": "Frozen" },
      { "name": "Shredded cheddar", "amount": 1, "unit": "cup", "aisle": "Dairy" },
      { "name": "Green beans (15 oz)", "amount": 1, "unit": "can", "aisle": "Pantry" }
    ],
    "steps": [
      "Heat the oven to 375°F. Brown the beef with the chopped onion and drain the fat.",
      "Stir in the soup and the drained green beans. Spread it in a baking dish.",
      "Cover with tater tots and cheddar.",
      "Bake until the tots are crisp and the center is bubbling, about 35 minutes."
    ]
  }
];

const BY_ID = new Map([...MEALS, ...SOUPS, ...HOUSEHOLD].map((meal) => [meal.id, meal]));

let customMeals: Meal[] = [];

export function registerCustomMeals(meals: Meal[]) {
  customMeals = meals;
}

export function allMeals(): Meal[] {
  const ids = new Set(customMeals.map((meal) => meal.id));
  return [
    ...customMeals,
    ...MEALS.filter((meal) => !ids.has(meal.id)),
    ...SOUPS.filter((meal) => !ids.has(meal.id)),
    ...HOUSEHOLD.filter((meal) => !ids.has(meal.id)),
  ];
}

export function getMeal(id?: string): Meal | undefined {
  if (!id) return undefined;
  return customMeals.find((meal) => meal.id === id) ?? BY_ID.get(id);
}

export const SEED_MEAL_IDS = [
  "lemon-garlic-chicken",
  "sheet-pan-salmon",
  "beef-taco-skillet",
  "creamy-tomato-pasta",
  "thai-basil-chicken",
] as const;
