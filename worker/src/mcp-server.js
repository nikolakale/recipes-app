import { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { listRecipes, getRecipe, saveRecipe, deleteRecipe } from "./firestore.js";
import { uploadRecipeImage } from "./image-upload.js";

const CATEGORIES = ["Doručak", "Užina", "Dezert", "Glavni obrok"];

const ingredientItem = z.object({
  name: z.string(),
  amount: z.string(),
});
const ingredientGroup = z.object({
  name: z.string().nullable().describe("Naziv podgrupe sastojaka (npr. 'Za testo') ili null ako nema podgrupa."),
  items: z.array(ingredientItem),
});
const step = z.object({
  title: z.string(),
  text: z.string(),
  timer: z.string().optional().describe("Npr. '~5 min', opciono."),
});
const nutritionRow = z.object({
  name: z.string(),
  kcal: z.string(),
  protein: z.string().optional(),
});
const nutritionTotal = z.object({
  name: z.string().describe("Npr. 'Ukupno (2 porcije)' ili 'Po porciji'."),
  kcal: z.string(),
  protein: z.string().optional(),
  perServing: z.boolean().optional().describe("true za red koji predstavlja 'po porciji' — koristi se za prikaz na listi."),
});

const recipeShape = {
  id: z.string().describe("Slug bez dijakritika, npr. 'grcki-jogurt-med-orasi'. Koristi se kao ID dokumenta — nepromenljiv."),
  image: z.string().nullable().describe("Putanja do fotografije (npr. './img/naziv.jpg') ili null ako nema, koristi se ilustracija."),
  category: z.enum(CATEGORIES),
  title: z.string(),
  description: z.string(),
  servings: z.string().describe("Npr. '2 porcije'."),
  ingredientGroups: z.array(ingredientGroup),
  steps: z.array(step),
  notes: z.array(z.string()).optional(),
  nutrition: z.object({
    hasProtein: z.boolean(),
    rows: z.array(nutritionRow),
    totals: z.array(nutritionTotal),
  }),
  source: z.object({ url: z.string(), label: z.string() }).nullable().optional(),
};

export function buildServer(env){
  const server = new McpServer({ name: "recepti-mcp", version: "1.0.0" });

  server.registerTool(
    "list_recipes",
    {
      description: "Vrati kratku listu svih recepata (id, naslov, kategorija, kcal) iz baze. Koristi ovo pre izmene/brisanja da nađeš tačan id.",
      inputSchema: z.object({}),
    },
    async () => {
      const recipes = await listRecipes(env);
      const summary = recipes.map(r => ({ id: r.id, title: r.title, category: r.category }));
      return { content: [{ type: "text", text: JSON.stringify(summary, null, 2) }] };
    }
  );

  server.registerTool(
    "get_recipe",
    {
      description: "Vrati pun JSON jednog recepta po id-ju — koristi pre izmene da vidiš trenutni sadržaj.",
      inputSchema: z.object({ id: z.string() }),
    },
    async ({ id }) => {
      const recipe = await getRecipe(env, id);
      if (!recipe) return { content: [{ type: "text", text: `Recept "${id}" ne postoji.` }], isError: true };
      return { content: [{ type: "text", text: JSON.stringify(recipe, null, 2) }] };
    }
  );

  server.registerTool(
    "save_recipe",
    {
      description: "Doda novi recept ili POTPUNO zameni postojeći sa istim id-jem (nije parcijalni update — pošalji ceo objekat). Kategorija mora biti tačno jedna od: " + CATEGORIES.join(", ") + ".",
      inputSchema: z.object(recipeShape),
    },
    async (recipe) => {
      const existing = await getRecipe(env, recipe.id);
      let order = existing ? existing.order : undefined;
      if (order === undefined){
        const all = await listRecipes(env);
        order = all.length ? Math.max(...all.map(r => r.order ?? 0)) + 1 : 0;
      }
      await saveRecipe(env, recipe.id, { ...recipe, order });
      return { content: [{ type: "text", text: `Sačuvan recept "${recipe.id}" (${existing ? "ažuriran" : "nov, order " + order}).` }] };
    }
  );

  server.registerTool(
    "upload_recipe_image",
    {
      description: "Upload-uje sliku recepta (JPG/PNG/WEBP/GIF) u img/ folder na korisnikovom serveru, preko upload.php. Vraća putanju (npr. './img/naziv.jpg') koju treba upisati u polje 'image' recepta pri pozivu save_recipe.",
      inputSchema: z.object({
        filename: z.string().describe("Predloženo ime fajla, npr. 'grcki-jogurt-med-orasi.jpg'. Server sam sanitizuje ime i određuje ekstenziju na osnovu stvarnog sadržaja slike, tako da ekstenzija u ovom imenu nije presudna."),
        imageBase64: z.string().describe("Sadržaj slike, base64-enkodiran (bez 'data:image/...;base64,' prefiksa)."),
      }),
    },
    async ({ filename, imageBase64 }) => {
      const result = await uploadRecipeImage(env, filename, imageBase64);
      return { content: [{ type: "text", text: `Upload-ovana slika: ${result.path}` }] };
    }
  );

  server.registerTool(
    "delete_recipe",
    {
      description: "Trajno obriši recept po id-ju.",
      inputSchema: z.object({ id: z.string() }),
    },
    async ({ id }) => {
      const existing = await getRecipe(env, id);
      if (!existing) return { content: [{ type: "text", text: `Recept "${id}" ne postoji.` }], isError: true };
      await deleteRecipe(env, id);
      return { content: [{ type: "text", text: `Obrisan recept "${id}" (${existing.title}).` }] };
    }
  );

  return server;
}
