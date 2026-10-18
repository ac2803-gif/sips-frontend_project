import { describe, expect, it } from 'vitest';
import { cocktails } from './data';
import { drawCocktail, pourGeometry, recipeGarnish, flowForTilt, rightDragTilt, autoPourGeometry } from './mix-utils';

describe('random cocktail selection', () => {
 it('visits the entire current catalog before repeating, then avoids an immediate repeat', () => {
  const ids = cocktails.map(c => c.id);
  let current = ids[0];
  let remaining: string[] = [];
  const seen = [current];
  for (let i=1;i<ids.length;i++) {
   const result = drawCocktail(ids,current,remaining,()=>.37);
   current=result.id!; remaining=result.remaining; seen.push(current);
  }
  expect(new Set(seen).size).toBe(ids.length);
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
  for(const glass of ['coupe','rocks','highball'] as const) for(const tilt of [.33,.6,1]) for(const progress of [0,25,70,100]) {
   const g=pourGeometry(glass,progress,tilt);
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
  expect(pourGeometry('coupe',200,10).spout).toEqual({x:260,y:158});
  expect(pourGeometry('coupe',0,-10).angle).toBe(90);
  expect(pourGeometry('coupe',-10).liquidY).toBe(382);
  expect(pourGeometry('coupe',200).liquidY).toBe(309);
 });
 it('does not invent citrus garnish for an espresso martini',()=>{
  expect(recipeGarnish(cocktails.find(c=>c.id==='espresso-martini')!)).toBe('none');
  expect(recipeGarnish(cocktails.find(c=>c.id==='negroni')!)).toBe('orange');
  expect(recipeGarnish(cocktails.find(c=>c.id==='mojito')!)).toBe('mint');
 });
});

describe('automatic desktop and rightward phone controls',()=>{
 it('ignores leftward motion and clamps rightward motion to the available room',()=>{
  expect(rightDragTilt(-150,350)).toBe(0);
  expect(rightDragTilt(0,350)).toBe(0);
  expect(rightDragTilt(50,350)).toBeGreaterThan(0);
  expect(rightDragTilt(150,350)).toBe(1);
  expect(rightDragTilt(40,350,40)).toBe(1);
 });
 it('increases flow with tilt and returns the phone bottle upright at zero',()=>{
  expect(flowForTilt(.2)).toBe(0);
  expect(flowForTilt(.5)).toBeGreaterThan(0);
  expect(flowForTilt(1)).toBeGreaterThan(flowForTilt(.5));
  expect(pourGeometry('highball',30,0).angle).toBe(90);
 });
 it('keeps the desktop stream attached at all pointer extremes',()=>{
  for(const x of [-1,0,1])for(const y of [-1,0,1]){
   const pose=autoPourGeometry('highball',50,{x,y},true);
   expect(pose.stream.startsWith(`M${pose.spout.x} ${pose.spout.y} `)).toBe(true);
   expect(pose.spout.x).toBeGreaterThan(pose.shape.left);
   expect(pose.spout.x).toBeLessThan(pose.shape.right);
  }
 });
});
