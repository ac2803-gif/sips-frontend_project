import { describe, expect, it } from 'vitest';
import { cocktails, ingredients } from './data';
import { recipeEnglish, translate, translations } from './i18n';

describe('bilingual content', () => {
 it('keeps Chinese labels and supplies English ingredient and filter labels', () => {
  for (const label of [...ingredients, ...cocktails.flatMap(c => [c.base,c.flavor,c.difficulty])]) {
   expect(translate(label,'zh')).toBe(label);
   expect(translate(label,'en')).not.toMatch(/[\u4e00-\u9fff]/);
   expect(translate(label,'en').length).toBeGreaterThan(0);
  }
 });
 it('has complete English instructions for every recipe', () => {
  for (const c of cocktails) {
   const english=recipeEnglish[c.id];
   expect(english.description.length).toBeGreaterThan(20);
   expect(english.tool.length).toBeGreaterThan(0);
   expect(english.steps).toHaveLength(c.steps.length);
   expect(english.steps.every(step => step.length > 20)).toBe(true);
   expect(JSON.stringify(english)).not.toMatch(/[\u4e00-\u9fff]/);
  }
 });
 it('does not include untranslated Chinese in English UI labels',()=>{
  for (const text of Object.values(translations)) expect(text).not.toMatch(/[\u4e00-\u9fff]/);
 });
});
