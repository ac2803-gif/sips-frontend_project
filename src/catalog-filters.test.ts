import { describe, expect, it } from 'vitest';
import { cocktails, ingredients } from './data';
import { spiritFilters, spiritGroup } from './catalog-filters';
import { commonIngredients, ingredientCategories, ingredientCategory, normalizeIngredientQuery } from './ingredient-groups';

describe('compact catalog and ingredient groups',()=>{
 it('partitions every cocktail into six spirits or other without hiding any recipes',()=>{
  expect(spiritFilters).toEqual(['全部','金酒','伏特加','朗姆酒','龙舌兰','威士忌','白兰地','其他']);
  const groups=spiritFilters.slice(1).flatMap(base=>cocktails.filter(c=>spiritGroup(c)===base));
  expect(groups.map(c=>c.id).sort()).toEqual(cocktails.map(c=>c.id).sort());
  for(const base of ['梅斯卡尔','混合基酒','葡萄酒','卡莎萨']) expect(spiritGroup({base})).toBe('其他');
  expect(spiritGroup({base:'白兰地'})).toBe('白兰地');
 });
 it('offers a short set of real essentials and assigns every ingredient to a category',()=>{
  expect(commonIngredients.length).toBeLessThanOrEqual(20);
  expect(new Set(commonIngredients).size).toBe(commonIngredients.length);
  for(const name of commonIngredients) expect(ingredients).toContain(name);
  for(const name of ingredients) expect(ingredientCategories).toContain(ingredientCategory(name));
  expect(ingredientCategory('龙舌兰糖浆')).toBe('糖浆与甜味');
  expect(ingredientCategory('杏桃白兰地')).toBe('利口酒与葡萄酒');
  expect(ingredientCategory('青柠汁')).toBe('果汁与调饮');
 });
 it('normalizes accents and whitespace for English ingredient searches',()=>{
  expect(normalizeIngredientQuery('  Cachaça  ')).toBe('cachaca');
  expect(normalizeIngredientQuery('BÉNÉDICTINE')).toBe('benedictine');
 });
});
