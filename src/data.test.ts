import { describe, expect, it } from 'vitest';
import { cocktails, ingredients, missingIngredients, recommendIngredient } from './data';

describe('酒柜配方匹配', () => {
 it('空酒柜不会匹配到可制作的配方', () => {
  expect(cocktails.filter(c => missingIngredients(c, []).length === 0)).toHaveLength(0);
 });
 it('包含全部必需材料才可制作，不能忽略装饰材料', () => {
  const negroni = cocktails.find(c => c.id === 'negroni')!;
  expect(missingIngredients(negroni, ['金酒','金巴利','甜味美思']).map(i => i.name)).toEqual(['橙子']);
  expect(missingIngredients(negroni, ['金酒','金巴利','甜味美思','橙子'])).toHaveLength(0);
 });
 it('推荐能立即解锁配方的缺失材料', () => {
  expect(recommendIngredient(['白朗姆酒','青柠汁'])).toEqual({ name: '糖浆', count: 1 });
 });
 it('无单一材料可解锁配方时不虚构购买建议', () => {
  expect(recommendIngredient([])).toBeUndefined();
  expect(recommendIngredient(ingredients)).toBeUndefined();
 });
 it('所有配方都有唯一标识、正数用量和实际制作步骤', () => {
  expect(new Set(cocktails.map(c => c.id)).size).toBe(cocktails.length);
  for (const c of cocktails) {
   expect(c.ingredients.every(i => i.amount > 0)).toBe(true);
   expect(c.steps.length).toBeGreaterThan(1);
  }
 });
});
