import { expect, test, type Page, type BrowserContext, type CDPSession } from '@playwright/test';

const progress=(page:Page)=>page.locator('.mix-stage').getAttribute('data-progress').then(Number);
async function scrollToFraction(page:Page,fraction:number){
 await page.evaluate(fraction=>{
  const hero=document.querySelector('.hero')!;
  const top=hero.getBoundingClientRect().top+scrollY;
  const range=Math.max(240,hero.getBoundingClientRect().height-innerHeight+160);
  window.scrollTo({top:Math.max(0,top-60+fraction*range),behavior:'instant'});
 },fraction);
}
async function startDrag(page:Page,context:BrowserContext,amount=1){
 const bottle=page.locator('.mix-bottle');
 await bottle.scrollIntoViewIfNeeded();
 const box=(await bottle.boundingBox())!;
 const travel=await page.locator('.mix-stage').evaluate(e=>Math.max(72,e.clientWidth*.3));
 const client=await context.newCDPSession(page);
 const x=box.x+box.width/2,y=box.y+box.height/2;
 await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y,id:1}]});
 for(let n=1;n<=5;n++){
  await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-travel*amount*n/5,y,id:1}]});
  await page.waitForTimeout(20);
 }
 return client;
}
async function release(client:CDPSession){await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await client.detach();}

test.beforeEach(async({page})=>{await page.goto('/');});

test('selects the correct desktop or phone controller and never starts from a click',async({page,isMobile})=>{
 await expect(page.locator('.mix-studio')).toHaveAttribute('data-layout',isMobile?'drag':'scroll');
 await expect(page.locator('.mix-playback, .mix-play, .mix-reset, progress')).toHaveCount(0);
 await expect.poll(()=>progress(page)).toBe(0);
 await page.waitForTimeout(300);
 expect(await progress(page)).toBe(0);
 if(isMobile){
  await page.locator('.mix-bottle').tap();
  await page.waitForTimeout(200);
  expect(await progress(page)).toBe(0);
 }
});

test('desktop scrubs with scroll; touch pours with tilt and stops on release',async({page,context,isMobile})=>{
 if(!isMobile){
  await scrollToFraction(page,.5);
  await expect.poll(()=>progress(page)).toBeCloseTo(50,0);
  const held=await progress(page);await page.waitForTimeout(300);
  expect(await progress(page)).toBeCloseTo(held,1);
  await scrollToFraction(page,1);await expect.poll(()=>progress(page)).toBe(100);
  await scrollToFraction(page,.25);await expect.poll(()=>progress(page)).toBeLessThan(25);
  await scrollToFraction(page,0);await expect.poll(()=>progress(page)).toBe(0);
 }else{
  let client=await startDrag(page,context,.5);
  await expect(page.locator('.mix-stream')).toHaveCount(1);
  const slowStart=await progress(page);await page.waitForTimeout(500);const slow=(await progress(page))-slowStart;
  await release(client);
  await expect(page.locator('.mix-stage')).toHaveAttribute('data-tilt','0.000');
  const stopped=await progress(page);await page.waitForTimeout(400);
  expect(await progress(page)).toBeCloseTo(stopped,1);
  client=await startDrag(page,context,1);
  const fastStart=await progress(page);await page.waitForTimeout(500);const fast=(await progress(page))-fastStart;
  expect(fast).toBeGreaterThan(slow*1.8);
  await expect.poll(()=>progress(page)).toBe(100);
  await release(client);
  await expect(page.locator('.mix-stream')).toHaveCount(0);
 }
});

test('vertical gestures on the bottle scroll the phone page without pouring',async({page,context,isMobile})=>{
 if(!isMobile) await page.setViewportSize({width:390,height:844});
 const bottle=page.locator('.mix-bottle');await bottle.scrollIntoViewIfNeeded();
 const box=(await bottle.boundingBox())!;const x=box.x+box.width/2,y=box.y+box.height/2;
 const before=await page.evaluate(()=>scrollY);
 const client=await context.newCDPSession(page);
 await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y,id:1}]});
 for(const delta of [15,30,50,80,110]){
  await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y:y-delta,id:1}]});
  await page.waitForTimeout(20);
 }
 await release(client);
 await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(before);
 expect(await progress(page)).toBe(0);
});

test('random draws use the current control mode and open the correct recipe',async({page,isMobile})=>{
 if(!isMobile)await scrollToFraction(page,.6);
 const first=await page.locator('.mix-result h3').innerText();
 for(let n=0;n<3;n++)await page.locator('.mix-random').click();
 await expect(page.locator('.mix-result h3')).not.toHaveText(first);
 const selected=await page.locator('.mix-result h3').innerText();
 if(isMobile)expect(await progress(page)).toBe(0);
 await page.locator('.mix-recipe-link').click();
 await expect(page.locator('.recipe-content h2')).toHaveText(selected);
});

test('reduced motion stays usable and language changes preserve the selected recipe',async({page,context,isMobile})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 if(isMobile){const client=await startDrag(page,context);await release(client);}
 else await scrollToFraction(page,.5);
 await expect.poll(()=>progress(page)).toBe(100);
 await expect(page.locator('.mix-stream')).toHaveCount(0);
 const recipe=await page.locator('.mix-result h3').innerText();
 await page.getByRole('button',{name:'切换为英文'}).click();
 await expect(page.locator('.mix-result h3')).toHaveText(recipe);
 await expect(page.locator('.mix-studio')).not.toContainText(/[\u4e00-\u9fff]/);
});

test('touch bottle is keyboard operable and returns upright on key release',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 const slider=page.getByRole('slider',{name:'拖动酒瓶倾倒'});
 await slider.focus();await page.keyboard.down('Space');
 await expect.poll(()=>progress(page)).toBeGreaterThan(3);
 await page.keyboard.up('Space');
 await expect(slider).toHaveAttribute('aria-valuenow','0');
 const stopped=await progress(page);await page.waitForTimeout(200);
 expect(await progress(page)).toBeCloseTo(stopped,1);
});

test('phone layouts keep the bottle and actions within the viewport',async({page})=>{
 for(const width of [320,390,768]){
  await page.setViewportSize({width,height:844});
  await expect(page.locator('.mix-studio')).toHaveAttribute('data-layout','drag');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  for(const selector of ['.mix-random','.mix-recipe-link','.mix-bottle']){
   const box=(await page.locator(selector).boundingBox())!;
   expect(box.x).toBeGreaterThanOrEqual(0);expect(box.x+box.width).toBeLessThanOrEqual(width+1);
   expect(box.height).toBeGreaterThanOrEqual(44);
  }
 }
});
