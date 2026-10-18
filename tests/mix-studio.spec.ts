import { expect, test } from '@playwright/test';

test.beforeEach(async ({page})=>{
 await page.goto('/');
});

test('pour, pause, reset and select a real recipe using touch or mouse',async({page,isMobile})=>{
 const activate=async(selector:string)=>isMobile ? page.locator(selector).tap() : page.locator(selector).click();
 const progress=page.locator('.mix-progress');
 await activate('.mix-stage');
 await expect.poll(()=>progress.evaluate((e:HTMLProgressElement)=>e.value)).toBeGreaterThan(3);
 await expect(page.locator('.mix-stream')).toHaveCount(1);
 await activate('.mix-play');
 const paused=await progress.evaluate((e:HTMLProgressElement)=>e.value);
 await page.waitForTimeout(200);
 expect(await progress.evaluate((e:HTMLProgressElement)=>e.value)).toBeCloseTo(paused,1);
 await activate('.mix-reset');
 await expect(progress).toHaveAttribute('value','0');
 const first=await page.locator('.mix-result h3').innerText();
 await activate('.mix-random');
 await expect(page.locator('.mix-result h3')).not.toHaveText(first);
 const next=await page.locator('.mix-result h3').innerText();
 await expect(page.locator('.mix-stream')).toHaveCount(1);
 await activate('.mix-recipe-link');
 await expect(page.locator('.recipe-content h2')).toHaveText(next);
});

test('handles an empty bar and a bar with only one possible recipe',async({page})=>{
 await page.locator('.mix-scope button').nth(1).click();
 await expect(page.locator('.mix-empty')).toBeVisible();
 await expect(page.locator('.mix-random')).toBeDisabled();
 await page.locator('.mix-empty button').click();
 for(const ingredient of ['金酒','金巴利','甜味美思']) {
  await page.locator('.ingredient-options').getByRole('button',{name:ingredient,exact:true}).click();
 }
 await expect(page.locator('.mix-result h3')).toHaveText('Negroni');
 await expect(page.locator('.mix-random')).toBeEnabled();
 await page.locator('.mix-random').click();
 await expect(page.locator('.mix-result h3')).toHaveText('Negroni');
 await expect(page.locator('.mix-stream')).toHaveCount(1);
});

test('reduced motion preserves controls and instant preview, including English labels',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.locator('.mix-play').click();
 await expect(page.locator('.mix-progress')).toHaveAttribute('value','100');
 await expect(page.locator('.mix-stream')).toHaveCount(0);
 await page.locator('.mix-play').click();
 await expect(page.locator('.mix-progress')).toHaveAttribute('value','0');
 const recipe=await page.locator('.mix-result h3').innerText();
 await page.getByRole('button',{name:'切换为英文'}).click();
 await expect(page.locator('.mix-result h3')).toHaveText(recipe);
 await expect(page.locator('.mix-random')).toHaveText('Surprise me');
 await expect(page.locator('.mix-studio')).not.toContainText(/[\u4e00-\u9fff]/);
 await page.locator('.mix-random').click();
 await expect(page.locator('.mix-progress')).toHaveAttribute('value','100');
});

test('phone controls stay in the viewport with comfortable touch targets',async({page})=>{
 for(const width of [320,360,390,430,768]) {
  await page.setViewportSize({width,height:844});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  for(const selector of ['.mix-stage','.mix-play','.mix-reset','.mix-random','.mix-recipe-link']) {
   const box=await page.locator(selector).boundingBox();
   expect(box).not.toBeNull();
   expect(box!.x).toBeGreaterThanOrEqual(0);
   expect(box!.x+box!.width).toBeLessThanOrEqual(width+1);
   expect(box!.height).toBeGreaterThanOrEqual(44);
  }
 }
});
