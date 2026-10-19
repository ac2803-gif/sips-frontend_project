import { expect, test, type Page } from '@playwright/test';

const card=(page:Page,name:string)=>page.locator('.cocktail-card').filter({has:page.getByRole('heading',{name,exact:true})});
async function openBar(page:Page){
 await page.addInitScript(()=>localStorage.setItem('sips-cabinet',JSON.stringify(['金酒'])));
 await page.goto('/');
 await page.getByRole('button',{name:'看看我的酒柜能调什么',exact:true}).click();
 await page.getByRole('textbox',{name:'搜索配方或材料'}).fill('Negroni');
}

test('missing materials expand into yellow chips on hover or tap without opening a recipe',async({page,isMobile})=>{
 await openBar(page);
 const drink=card(page,'Negroni');const badge=drink.getByRole('button',{name:'Negroni · 还差 2 种材料',exact:true});
 const popover=drink.getByRole('list',{name:'还需要准备'});
 await expect(popover).toBeHidden();
 if(isMobile)await badge.tap();else await badge.hover();
 await expect(badge).toHaveAttribute('aria-expanded','true');
 await expect(drink.locator('.missing-materials-sheet, .missing-materials-popover')).toHaveCount(0);
 await expect(popover.locator('li')).toHaveText(['金巴利','甜味美思']);
 await expect(page.getByRole('dialog')).toHaveCount(0);
 if(!isMobile){
  await popover.hover();await expect(popover).toBeVisible();
  await page.mouse.move(0,0);
 }else await badge.tap();
 await expect(popover).toBeHidden();
 await badge.focus();await badge.press('Enter');
 await expect(popover).toBeVisible();
 await badge.press('Escape');await expect(popover).toBeHidden();
 await badge.press('Enter');await badge.press('Tab');
 await expect(popover).toBeFocused();
 await popover.press('Escape');await expect(popover).toBeHidden();
});

test('missing chips update with the cabinet and disappear when the drink is ready',async({page,isMobile})=>{
 await openBar(page);
 const picker=page.locator('.ingredient-picker');
 const drink=card(page,'Negroni');
 await picker.getByRole('searchbox',{name:'搜索酒柜材料'}).fill('金巴利');
 await picker.locator('.ingredient-options').getByRole('button',{name:'金巴利',exact:true}).click();
 const badge=drink.getByRole('button',{name:'Negroni · 还差 1 种材料',exact:true});
 if(isMobile)await badge.tap();else await badge.hover();
 await expect(drink.locator('.missing-materials-list li')).toHaveText(['甜味美思']);
 await picker.getByRole('searchbox',{name:'搜索酒柜材料'}).fill('甜味美思');
 await picker.locator('.ingredient-options').getByRole('button',{name:'甜味美思',exact:true}).click();
 await expect(drink.locator('.match-badge.ready')).toHaveText('✓ 现在能调');
 await expect(drink.locator('.missing-materials')).toHaveCount(0);
});

test('long missing lists remain within narrow cards and scroll without page overflow',async({page,isMobile})=>{
 await page.setViewportSize({width:320,height:844});
 await page.goto('/');await page.getByRole('button',{name:'看看我的酒柜能调什么',exact:true}).click();
 await page.getByRole('textbox',{name:'搜索配方或材料'}).fill('Zombie');
 const drink=card(page,'Zombie');const badge=drink.locator('.match-badge');
 if(isMobile)await badge.tap();else await badge.click();
 const list=drink.locator('.missing-materials-list');
 await expect(list).toBeVisible();
 const art=(await drink.locator('.card-art').boundingBox())!;const panel=(await list.boundingBox())!;
 expect(panel.x).toBeGreaterThanOrEqual(art.x);
 expect(panel.x+panel.width).toBeLessThanOrEqual(art.x+art.width+1);
 expect(panel.y).toBeGreaterThanOrEqual(art.y);
 expect(panel.y+panel.height).toBeLessThanOrEqual(art.y+art.height);
 expect(await list.evaluate(e=>e.scrollHeight>e.clientHeight)).toBe(true);
 await list.evaluate(e=>{e.scrollTop=e.scrollHeight;});
 await expect(list).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('the left drink card flips to its story and returns without closing the recipe',async({page})=>{
 await page.goto('/');
 await page.getByRole('textbox',{name:'搜索配方或材料'}).fill('Espresso Martini');
 await card(page,'Espresso Martini').locator('.art-open').click();
 const flip=page.locator('.recipe-flip-card');
 const trigger=flip.locator('.recipe-flip-trigger');
 const story=flip.locator('.recipe-story');
 await expect(flip).toHaveAttribute('data-side','front');
 await expect(page.locator('.recipe-content .recipe-story')).toHaveCount(0);
 await trigger.click();
 await expect(flip).toHaveAttribute('data-side','back');
 await expect(story.getByRole('heading',{name:'这杯酒的故事'})).toBeVisible();
 await expect(story).toContainText('布拉德塞尔');
 await expect(story.getByRole('link').first()).toHaveAttribute('href',/^https:/);
 const back=page.getByRole('button',{name:'关闭故事，返回酒卡',exact:true});
 await back.click();
 await expect(flip).toHaveAttribute('data-side','front');
 await expect(page.getByRole('dialog')).toBeVisible();
 await expect(trigger).toBeFocused();
 await expect(flip.getByRole('heading',{name:'这杯酒的故事'})).toHaveCount(0);
 await trigger.press('Enter');
 await expect(flip).toHaveAttribute('data-side','back');
 await back.press('Escape');
 await expect(flip).toHaveAttribute('data-side','front');
 await expect(page.getByRole('dialog')).toBeVisible();
 await trigger.click();
 await page.getByRole('button',{name:'关闭配方'}).click();
 await card(page,'Espresso Martini').locator('.art-open').click();
 await expect(flip).toHaveAttribute('data-side','front');
 await page.getByRole('button',{name:'关闭配方'}).click();
 await page.getByRole('button',{name:'切换为英文'}).click();
 await card(page,'Espresso Martini').locator('.art-open').click();
 await trigger.click();
 await expect(story.getByRole('heading',{name:'Behind the drink'})).toBeVisible();
 await expect(story).toContainText('Dick Bradsell');
 await expect(story).not.toContainText(/[\u4e00-\u9fff]/);
 await page.getByRole('button',{name:'Close recipe'}).click();
 await page.getByRole('textbox',{name:'Search recipes or ingredients'}).fill('Margarita');
 await card(page,'Margarita').locator('.art-open').click();
 await trigger.click();
 await expect(story.locator('.story-kind')).toHaveText('Origins debated');
});

test('the story reverse stays inside the card on a narrow screen with reduced motion',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.setViewportSize({width:320,height:844});
 await page.goto('/');
 await page.getByRole('textbox',{name:'搜索配方或材料'}).fill('Negroni');
 await card(page,'Negroni').locator('.art-open').click();
 const flip=page.locator('.recipe-flip-card');
 await flip.locator('.recipe-flip-trigger').click();
 await expect(flip).toHaveAttribute('data-side','back');
 await expect(flip.locator('.recipe-flip-inner')).toHaveCSS('transition-duration','0s');
 await expect(flip.locator('.recipe-story')).toContainText('佛罗伦萨');
 expect(await flip.evaluate(element=>element.scrollWidth<=element.clientWidth)).toBe(true);
 const scroller=flip.locator('.recipe-flip-story-scroll');
 expect(await scroller.evaluate(element=>element.scrollWidth<=element.clientWidth)).toBe(true);
 await scroller.evaluate(element=>{element.scrollTop=element.scrollHeight;});
 await page.getByRole('button',{name:'关闭故事，返回酒卡',exact:true}).click();
 await expect(flip).toHaveAttribute('data-side','front');
});
