import { expect, test } from '@playwright/test';

test.beforeEach(async ({page})=>{ await page.goto('/'); });

test('automatically reveals a drink without clicking the artwork or using playback controls',async({page})=>{
 const stage=page.locator('.mix-stage');
 await expect(stage).toHaveJSProperty('tagName','DIV');
 await expect(page.locator('.mix-playback, .mix-play, .mix-reset, progress')).toHaveCount(0);
 await expect(page.locator('.mix-stream')).toHaveCount(1);
 await expect(stage).toHaveAttribute('data-phase','finished');
 await expect(page.locator('.mix-liquid')).toBeVisible();
 await expect(page.locator('.mix-recipe-link')).toBeEnabled();
 await stage.click();
 await expect(stage).toHaveAttribute('data-phase','finished');
});

test('a touch or mouse draw automatically pours the new drink and links its recipe',async({page,isMobile})=>{
 const first=await page.locator('.mix-result h3').innerText();
 if(isMobile) await page.locator('.mix-random').tap();
 else await page.locator('.mix-random').click();
 await expect(page.locator('.mix-result h3')).not.toHaveText(first);
 const next=await page.locator('.mix-result h3').innerText();
 await expect(page.locator('.mix-stream')).toHaveCount(1);
 await expect(page.locator('.mix-stage')).toHaveAttribute('data-phase','finished');
 await expect(page.locator('.mix-recipe-link')).toBeEnabled();
 await page.locator('.mix-recipe-link').click();
 await expect(page.locator('.recipe-content h2')).toHaveText(next);
});

test('rapid draws cancel the previous pour and reveal the final selection',async({page})=>{
 const seen=new Set([await page.locator('.mix-result h3').innerText()]);
 for(let n=0;n<3;n++) {
  await page.locator('.mix-random').click();
  const selected=await page.locator('.mix-result h3').innerText();
  expect(seen.has(selected)).toBe(false);seen.add(selected);
 }
 const last=await page.locator('.mix-result h3').innerText();
 await expect(page.locator('.mix-stage')).toHaveAttribute('data-phase','finished');
 await page.locator('.mix-recipe-link').click();
 await expect(page.locator('.recipe-content h2')).toHaveText(last);
});

test('handles an empty bar and automatically reveals its single available recipe',async({page})=>{
 await page.locator('.mix-scope button').nth(1).click();
 await expect(page.locator('.mix-empty')).toBeVisible();
 await expect(page.locator('.mix-random')).toBeDisabled();
 await page.locator('.mix-empty button').click();
 for(const ingredient of ['金酒','金巴利','甜味美思']) {
  await page.locator('.ingredient-options').getByRole('button',{name:ingredient,exact:true}).click();
 }
 await expect(page.locator('.mix-result h3')).toHaveText('Negroni');
 await page.locator('.mix-random').click();
 await expect(page.locator('.mix-stream')).toHaveCount(1);
 await expect(page.locator('.mix-stage')).toHaveAttribute('data-phase','finished');
 await expect(page.locator('.mix-recipe-link')).toBeEnabled();
});

test('reduced motion skips the reveal and keeps English recipe selection functional',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await expect(page.locator('.mix-stage')).toHaveAttribute('data-phase','finished');
 await expect(page.locator('.mix-stream')).toHaveCount(0);
 await expect(page.locator('.mix-liquid')).toBeVisible();
 const recipe=await page.locator('.mix-result h3').innerText();
 await page.getByRole('button',{name:'切换为英文'}).click();
 await expect(page.locator('.mix-result h3')).toHaveText(recipe);
 await expect(page.locator('.mix-studio')).not.toContainText(/[\u4e00-\u9fff]/);
 await page.locator('.mix-random').click();
 await expect(page.locator('.mix-stage')).toHaveAttribute('data-phase','finished');
 await expect(page.locator('.mix-recipe-link')).toBeEnabled();
 await expect(page.locator('.mix-stream')).toHaveCount(0);
});

test('mobile layout preserves visible actions and comfortable touch targets',async({page})=>{
 for(const width of [320,360,390,430,768]) {
  await page.setViewportSize({width,height:844});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  for(const selector of ['.mix-random','.mix-recipe-link','.mix-scope button:first-child']) {
   const box=await page.locator(selector).boundingBox();
   expect(box).not.toBeNull();
   expect(box!.x).toBeGreaterThanOrEqual(0);
   expect(box!.x+box!.width).toBeLessThanOrEqual(width+1);
   expect(box!.height).toBeGreaterThanOrEqual(44);
  }
 }
});
