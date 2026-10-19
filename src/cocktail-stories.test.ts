import { describe, expect, it } from 'vitest';
import { allCocktails } from './data';
import { cocktailStories } from './cocktail-stories';
import { translate } from './i18n';

describe('cocktail backgrounds',()=>{
 it('covers current recipes and historical favorites with original bilingual notes',()=>{
  expect(Object.keys(cocktailStories).sort()).toEqual(allCocktails.map(c=>c.id).sort());
  for(const c of allCocktails){
   const story=cocktailStories[c.id];
   expect(story.zh.length,c.id).toBeGreaterThan(40);
   expect(story.en.length,c.id).toBeGreaterThan(80);
   expect(story.en,c.id).not.toMatch(/[\u4e00-\u9fff]/);
   expect(['history','disputed','context']).toContain(story.kind);
   expect(story.reading.length).toBeGreaterThan(0);
   for(const reference of story.reading){
    expect(new URL(reference.url).protocol).toBe('https:');
    expect(translate(reference.label,'en')).not.toMatch(/[\u4e00-\u9fff]/);
   }
  }
 });
 it('distinguishes competing claims and style notes from historical accounts',()=>{
  for(const id of ['margarita','negroni','manhattan','paloma']) expect(cocktailStories[id].kind).toBe('disputed');
  for(const id of ['iba-tiki','grand-margarita','illegal']) expect(cocktailStories[id].kind).toBe('context');
  expect(cocktailStories['espresso-martini'].en).toContain('Dick Bradsell');
  expect(cocktailStories['screwdriver']).toBeDefined();
 });
});
