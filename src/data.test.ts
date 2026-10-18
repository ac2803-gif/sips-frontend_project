import { describe, expect, it } from 'vitest';
import { cocktails, ingredients, missingIngredients, recommendIngredient } from './data';
import provenance from '../data/sources/iba-provenance.json';

describe('recipe provenance and bar matching', () => {
 it('contains 50 unique, complete recipes with pinned sources', () => {
  expect(cocktails).toHaveLength(50);
  expect(new Set(cocktails.map(c=>c.id)).size).toBe(50);
  for (const c of cocktails) {
   expect(c.source.version).toBe(provenance.commit);
   expect(c.source.url).toContain(provenance.commit);
   expect(c.ingredients.length).toBeGreaterThan(1);
   expect(c.steps.length).toBeGreaterThan(1);
   expect(c.ingredients.every(i=>i.amount===null || i.amount>0)).toBe(true);
  }
 });
 it('converts every measured source ingredient from cl to ml without changing ratios', () => {
  for (const source of provenance.selected) {
   const c=cocktails.find(c=>c.name===source.name)!;
   source.ingredients.forEach((original,index)=>{
    if ('amount' in original && original.amount!==undefined) {
     expect(c.ingredients[index].unit).toBe('ml');
     expect(c.ingredients[index].amount).toBeCloseTo(original.amount*10);
    }
   });
  }
 });
 it('does not fabricate an exact measure for unspecified syrup or soda',()=>{
  const espresso=cocktails.find(c=>c.id==='espresso-martini')!;
  expect(espresso.ingredients.find(i=>i.name==='糖浆')?.amount).toBeNull();
  const mojito=cocktails.find(c=>c.id==='mojito')!;
  expect(mojito.ingredients.find(i=>i.name==='苏打水')?.amount).toBeNull();
 });
 it('does not match a recipe until all required ingredients are available',()=>{
  const c=cocktails.find(c=>c.id==='negroni')!;
  expect(missingIngredients(c,[])).toHaveLength(3);
  expect(missingIngredients(c,['金酒','金巴利']).map(i=>i.name)).toEqual(['甜味美思']);
  expect(missingIngredients(c,['金酒','金巴利','甜味美思'])).toHaveLength(0);
 });
 it('optional egg white does not prevent making a whiskey sour',()=>{
  const c=cocktails.find(c=>c.id==='whiskey-sour')!;
  expect(c.ingredients.find(i=>i.name==='蛋清')?.optional).toBe(true);
  expect(missingIngredients(c,['波本威士忌','柠檬汁','糖浆'])).toHaveLength(0);
 });
 it('shopping recommendations count recipes that really become available',()=>{
  const bar=['白朗姆酒','青柠汁'];
  const recommendation=recommendIngredient(bar)!;
  expect(recommendation.count).toBeGreaterThan(0);
  const before=new Set(cocktails.filter(c=>missingIngredients(c,bar).length===0).map(c=>c.id));
  const unlocked=cocktails.filter(c=>!before.has(c.id)&&missingIngredients(c,[...bar,recommendation.name]).length===0);
  expect(unlocked).toHaveLength(recommendation.count);
 });
 it('does not invent recommendations for an empty or complete bar',()=>{
  expect(recommendIngredient([])).toBeUndefined();
  expect(recommendIngredient(ingredients)).toBeUndefined();
 });
});
