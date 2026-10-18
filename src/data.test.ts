import { describe, expect, it } from 'vitest';
import { cocktails, allCocktails, historicalCocktails, ingredients, missingIngredients, recommendIngredient } from './data';
import provenance from '../data/sources/iba-provenance.json';
import snapshot from '../data/sources/iba-2025-snapshot.json';
import coverage from '../data/sources/iba-catalog-coverage.json';
import { editorsChoiceIds } from './editors-choice';

describe('recipe provenance and bar matching', () => {
 it('covers each of the 102 snapshot entries once, in three categories of 34', () => {
  expect(cocktails).toHaveLength(102);
  expect(new Set(cocktails.map(c=>c.id)).size).toBe(102);
  expect(cocktails.map(c=>c.iba!.name).sort()).toEqual(snapshot.cocktails.map(c=>c.name).sort());
  for (const category of ['经典传世','当代经典','新时代饮品']) {
   expect(cocktails.filter(c=>c.iba?.category===category)).toHaveLength(34);
  }
  for (const c of allCocktails) {
   expect([provenance.commit,coverage.sourceCommit]).toContain(c.source.version);
   expect(c.source.url).toContain(c.source.version);
   expect(c.ingredients.length).toBeGreaterThan(1);
   expect(c.steps.length).toBeGreaterThan(1);
   expect(c.ingredients.every(i=>i.amount===null || i.amount>0)).toBe(true);
   expect(new Set(c.ingredients.map(i=>i.name)).size).toBe(c.ingredients.length);
  }
 });
 it('preserves all previous IDs and quantities while keeping retired recipes out of current draws',()=>{
  expect(allCocktails.filter(c=>coverage.preservedIds.includes(c.id))).toHaveLength(50);
  expect(historicalCocktails.map(c=>c.id)).toEqual(coverage.historicalIds);
  expect(historicalCocktails).toHaveLength(5);
  expect(historicalCocktails.every(c=>!cocktails.some(current=>current.id===c.id))).toBe(true);
  expect(cocktails.filter(c=>c.iba?.name==='Spritz').map(c=>c.id)).toEqual(['spritz-veneziano']);
 });
 it('converts every measured source ingredient from cl to ml without changing ratios', () => {
  for (const source of provenance.selected) {
   const c=allCocktails.find(c=>c.source.originalName===source.name)!;
   source.ingredients.forEach((original,index)=>{
    if ('amount' in original && original.amount!==undefined) {
     expect(c.ingredients[index].unit).toBe('ml');
     expect(c.ingredients[index].amount).toBeCloseTo(original.amount*10);
    }
   });
  }
 });
 it('preserves the sequence of ml measurements for all 57 new source recipes, including a merged row',()=>{
  const added=cocktails.filter(c=>c.source.version===coverage.sourceCommit);
  expect(added).toHaveLength(57);
  for (const c of added) {
   const raw=snapshot.cocktails.find(s=>s.name===c.source.originalName)!;
   const sourceMeasures=raw.ingredients.flatMap(i=>[...`${i.amount} ${i.name}`.matchAll(/(\d+(?:\.\d+)?)\s*ml\b/gi)].map(m=>Number(m[1])));
   expect(c.ingredients.filter(i=>i.unit==='ml').map(i=>i.amount),c.name).toEqual(sourceMeasures);
  }
 });
 it('preserves fractions, leaf ranges and explicitly unknown units instead of guessing ml',()=>{
  const tuxedo=cocktails.find(c=>c.id==='tuxedo')!;
  expect(tuxedo.ingredients.find(i=>i.name==='苦艾酒')).toMatchObject({amount:.25,unit:'吧匙'});
  const cuban=cocktails.find(c=>c.id==='old-cuban')!;
  expect(cuban.ingredients.find(i=>i.name==='薄荷')).toMatchObject({amount:6,amountMax:8,unit:'片'});
  const tiki=cocktails.find(c=>c.id==='iba-tiki')!;
  expect(tiki.ingredients.filter(i=>i.unit==='原文未注明单位').map(i=>i.amount)).toEqual([90,30]);
  expect(tiki.notes?.zh[0]).toContain('未注明单位');
 });
 it('assigns editor tags to exactly 20 existing recipes by stable ID',()=>{
  expect(editorsChoiceIds.size).toBe(20);
  for (const id of editorsChoiceIds) expect(cocktails.some(c=>c.id===id),id).toBe(true);
  expect(editorsChoiceIds.has('angel-face')).toBe(false);
  expect(editorsChoiceIds.has('negroni')).toBe(true);
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
