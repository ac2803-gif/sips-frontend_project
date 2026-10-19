import { expect, test, type Page } from '@playwright/test';

async function openBar(page:Page,isMobile:boolean){
 if(isMobile)await page.getByRole('button',{name:'切换导航'}).click();
 await page.getByRole('navigation').getByRole('button',{name:/我的酒柜/}).click();
}

test('six spirits and other cover the catalog and wrap without horizontal overflow',async({page})=>{
 await page.goto('/');
 const tabs=page.locator('.base-tabs');
 await expect(tabs.getByRole('button')).toHaveText(['编辑之选','全部配方','金酒','伏特加','朗姆酒','龙舌兰','威士忌','白兰地','其他']);
 const all=await page.locator('.cocktail-card').count();
 await tabs.getByRole('button',{name:'编辑之选',exact:true}).click();
 await expect(page.locator('.cocktail-card')).toHaveCount(20);
 await expect(page.locator('.cocktail-card .editors')).toHaveCount(20);
 await page.getByRole('button',{name:'切换为英文'}).click();
 await expect(tabs.getByRole('button').first()).toHaveText('Editor’s pick');
 await expect(tabs.getByRole('button').first()).toHaveAttribute('aria-pressed','true');
 await page.getByRole('button',{name:'Switch to Chinese'}).click();
 let total=0;
 for(const base of ['金酒','伏特加','朗姆酒','龙舌兰','威士忌','白兰地','其他']){
  await tabs.getByRole('button',{name:base,exact:true}).click();
  total+=await page.locator('.cocktail-card').count();
 }
 expect(total).toBe(all);
 for(const width of [320,390,901,1280]){
  await page.setViewportSize({width,height:844});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  expect(await tabs.evaluate(element=>element.scrollWidth<=element.clientWidth)).toBe(true);
 }
});

test('bar starts compact, searches every category bilingually and preserves selections',async({page,isMobile})=>{
 await page.goto('/');await openBar(page,isMobile);
 const picker=page.locator('.ingredient-picker');
 const options=picker.locator('.ingredient-options');
 await expect(options.getByRole('button')).toHaveCount(16);
 await options.getByRole('button',{name:'金酒',exact:true}).click();
 await expect(picker.getByRole('group',{name:'已选材料'})).toContainText('金酒');
 const search=picker.getByRole('searchbox',{name:'搜索酒柜材料'});
 // This spirit isn't in the default essentials. Search must look through the entire catalog.
 await search.fill('  CACHACA ');
 await expect(options.getByRole('button')).toHaveCount(1);
 await options.getByRole('button',{name:'卡莎萨',exact:true}).click();
 await expect(options.getByRole('button')).toHaveAttribute('aria-pressed','true');
 await search.fill('nothing-matches-this');
 await expect(picker).toContainText('未找到材料');
 await expect(picker.getByRole('group',{name:'已选材料'})).toContainText('卡莎萨');
 await picker.getByRole('button',{name:'清除材料搜索'}).click();
 await expect(options.getByRole('button')).toHaveCount(16);
 await picker.getByRole('group',{name:'材料分类'}).getByRole('button',{name:'果汁与调饮',exact:true}).click();
 await expect(options.getByRole('button',{name:'菠萝汁',exact:true})).toBeVisible();
 await expect(options.getByRole('button',{name:'金酒',exact:true})).toHaveCount(0);
 await page.reload();await openBar(page,isMobile);
 await expect(picker.getByRole('button',{name:'移除材料 金酒',exact:true})).toBeVisible();
 await expect(picker.getByRole('button',{name:'移除材料 卡莎萨',exact:true})).toBeVisible();
 await picker.getByRole('button',{name:'移除材料 金酒',exact:true}).click();
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('sips-cabinet')!))).toEqual(['卡莎萨']);
 await page.getByRole('button',{name:'切换为英文'}).click();
 await expect(picker).not.toContainText(/[\u4e00-\u9fff]/);
 await picker.getByRole('searchbox',{name:'Search bar ingredients'}).fill('菠萝');
 await expect(options.getByRole('button',{name:'Pineapple juice',exact:true})).toBeVisible();
 await picker.getByRole('button',{name:'Clear',exact:true}).click();
 await expect(picker.getByRole('group',{name:'In your bar'})).toHaveCount(0);
});

test('desktop bottle follows over a wider area even after automatic pouring finishes',async({page,isMobile})=>{
 test.skip(isMobile,'Desktop pointer interaction; phone drag is covered separately.');
 await page.goto('/');
 const stage=page.locator('.mix-stage');const bottle=page.locator('.mix-bottle');
 await expect(stage).toHaveAttribute('data-progress','100.00');
 const box=(await stage.boundingBox())!;
 await page.mouse.move(box.x+box.width*.15,box.y+box.height*.4);
 await expect(stage).toHaveClass(/is-aiming/);
 await expect(page.locator('.mix-bottle-shell')).toHaveCSS('opacity','1');
 const left=Number(await bottle.getAttribute('data-spout-x'));
 await page.mouse.move(box.x+box.width*.85,box.y+box.height*.4);
 const right=Number(await bottle.getAttribute('data-spout-x'));
 expect(right-left).toBeGreaterThan(100);
 const moved=(await bottle.boundingBox())!;
 expect(moved.x).toBeGreaterThanOrEqual(box.x);
 expect(moved.x+moved.width).toBeLessThanOrEqual(box.x+box.width+1);
 await page.mouse.move(0,0);
 await expect(stage).not.toHaveClass(/is-aiming/);
 await expect(page.locator('.mix-bottle-shell')).toHaveCSS('opacity','0');
 await expect(stage).toHaveAttribute('data-progress','100.00');
});
