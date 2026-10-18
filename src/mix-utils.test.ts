import { describe, expect, it } from 'vitest';
import { cocktails } from './data';
import { drawCocktail, pourGeometry, recipeGarnish } from './mix-utils';

describe('random cocktail selection', () => {
 it('visits all 50 recipes before repeating, then avoids an immediate repeat', () => {
  const ids = cocktails.map(c => c.id);
  let current = ids[0];
  let remaining: string[] = [];
  const seen = [current];
  for (let i=1;i<50;i++) {
   const result = drawCocktail(ids,current,remaining,()=>.37);
   current=result.id!; remaining=result.remaining; seen.push(current);
  }
  expect(new Set(seen).size).toBe(50);
  expect(remaining).toHaveLength(0);
  expect(drawCocktail(ids,current,remaining,()=>.37).id).not.toBe(current);
 });
 it('never selects outside the supplied bar recipes, including a changed pool',()=>{
  expect(drawCocktail(['negroni'],'negroni',[]).id).toBe('negroni');
  expect(drawCocktail([],undefined,['mojito']).id).toBeUndefined();
  const result=drawCocktail(['negroni','daiquiri'],'negroni',['mojito','daiquiri']);
  expect(result.id).toBe('daiquiri');
 });
});

describe('pour alignment',()=>{
 it('starts at the bottle opening and ends at the liquid surface for all glasses and pointer extremes',()=>{
  for(const glass of ['coupe','rocks','highball'] as const) for(const x of [-1,0,1]) for(const y of [-1,0,1]) for(const progress of [0,25,70,100]) {
   const g=pourGeometry(glass,progress,{x,y},true);
   expect(g.stream.startsWith(`M${g.spout.x} ${g.spout.y} `)).toBe(true);
   expect(g.stream.endsWith(`${g.spout.x} ${g.liquidY}`)).toBe(true);
   expect(g.spout.x).toBeGreaterThan(g.shape.left+15);
   expect(g.spout.x).toBeLessThan(g.shape.right-15);
   expect(g.liquidY).toBeGreaterThanOrEqual(g.shape.full);
   expect(g.liquidY).toBeLessThanOrEqual(g.shape.bottom);
   expect(g.spout.y).toBeLessThan(g.shape.top);
  }
 });
 it('clamps overfill and out-of-bounds pointer inputs',()=>{
  expect(pourGeometry('coupe',200,{x:10,y:-10}).spout).toEqual({x:278,y:151});
  expect(pourGeometry('coupe',-10).liquidY).toBe(382);
  expect(pourGeometry('coupe',200).liquidY).toBe(309);
 });
 it('does not invent citrus garnish for an espresso martini',()=>{
  expect(recipeGarnish(cocktails.find(c=>c.id==='espresso-martini')!)).toBe('none');
  expect(recipeGarnish(cocktails.find(c=>c.id==='negroni')!)).toBe('orange');
  expect(recipeGarnish(cocktails.find(c=>c.id==='mojito')!)).toBe('mint');
 });
});
