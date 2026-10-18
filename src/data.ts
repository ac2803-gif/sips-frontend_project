import recipeData from './cocktails.json';

export type Ingredient = {
 name: string;
 // Null means the source gives an unmeasured amount, never an invented ml value.
 amount: number | null;
 unit: string;
 optional?: boolean;
};
export type Cocktail = {
 id: string; name: string; zh: string; base: string; flavor: string;
 difficulty: string; minutes: number; color: string;
 glass: 'coupe' | 'rocks' | 'highball'; description: string;
 ingredients: Ingredient[]; steps: string[]; tool: string;
 english: { description: string; tool: string; steps: string[] };
 source: { name: string; url: string; originalName: string; version: string };
};
export const cocktails = recipeData as Cocktail[];
export const ingredients = [...new Set(cocktails.flatMap(c => c.ingredients.map(i => i.name)))];
export const missingIngredients = (c: Cocktail, cabinet: string[]) => c.ingredients.filter(i => !i.optional && !cabinet.includes(i.name));
export function recommendIngredient(cabinet: string[]) {
 return ingredients.filter(i => !cabinet.includes(i)).map(name => ({name, count: cocktails.filter(c => {
  const missing = missingIngredients(c,cabinet);
  return missing.length === 1 && missing[0].name === name;
 }).length})).sort((a,b) => b.count-a.count).find(i => i.count > 0);
}
