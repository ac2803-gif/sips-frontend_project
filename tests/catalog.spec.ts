import { expect, test, type Page } from '@playwright/test';

async function openFavorites(page: Page, isMobile: boolean) {
 if (isMobile) await page.getByRole('button', { name: '切换导航' }).click();
 await page.getByRole('navigation').getByRole('button', { name: /收藏夹/ }).click();
}

test('editor tags stay attached to 20 chosen cocktails through search, filters and favorites', async ({ page, isMobile }) => {
 await page.goto('/');
 await expect(page.locator('.cocktail-card')).toHaveCount(102);
 await expect(page.locator('.cocktail-card .editors')).toHaveCount(20);
 const search=page.getByRole('textbox', { name: '搜索配方或材料' });
 await search.fill('Angel Face');
 await expect(page.locator('.cocktail-card')).toHaveCount(1);
 await expect(page.locator('.editors')).toHaveCount(0);
 await search.fill('Negroni');
 await expect(page.locator('.cocktail-card .editors')).toHaveText('编辑之选');
 await page.locator('.base-tabs').getByRole('button', { name: '金酒', exact: true }).click();
 await expect(page.locator('.cocktail-card .editors')).toHaveCount(1);
 await page.locator('.cocktail-card .favorite-button').click();
 await openFavorites(page, isMobile);
 await expect(page.locator('.cocktail-card')).toHaveCount(1);
 await expect(page.locator('.cocktail-card h3')).toHaveText('Negroni');
 await expect(page.locator('.cocktail-card .editors')).toHaveCount(1);
 await page.getByRole('button', { name: '切换为英文' }).click();
 await expect(page.locator('.cocktail-card .editors')).toHaveText('Editor’s pick');
});

test('saved historical recipes survive the catalog update and keep bilingual instructions', async ({ page, isMobile }) => {
 await page.addInitScript(()=>localStorage.setItem('sips-favorites',JSON.stringify(['screwdriver','spritz-veneziano'])));
 await page.goto('/');
 await expect(page.locator('.cocktail-card')).toHaveCount(102);
 await openFavorites(page, isMobile);
 await expect(page.locator('.cocktail-card')).toHaveCount(2);
 const historical=page.locator('.cocktail-card').filter({ has:page.getByRole('heading', { name:'Screwdriver', exact:true }) });
 await historical.locator('.art-open').click();
 await expect(page.locator('.recipe-source')).toContainText('历史配方');
 await expect(page.locator('.steps li')).not.toHaveCount(0);
 await page.getByRole('button', { name:'关闭配方' }).click();
 await page.getByRole('button', { name:'切换为英文' }).click();
 await historical.locator('.art-open').click();
 await expect(page.locator('.recipe-source')).toContainText('Historical recipe');
 await expect(page.locator('.recipe-content')).not.toContainText(/[\u4e00-\u9fff]/);
});

test('recipe ranges scale with servings and incomplete source units are visible', async ({ page }) => {
 await page.goto('/');
 const search=page.getByRole('textbox', { name:'搜索配方或材料' });
 await search.fill('Old Cuban');
 await page.locator('.cocktail-card .art-open').click();
 const mint=page.locator('.recipe-ingredients li').filter({ hasText:'薄荷' });
 await expect(mint).toContainText('6–8');
 await page.getByRole('button', { name:'增加份数' }).click();
 await expect(mint).toContainText('12–16');
 await page.getByRole('button', { name:'关闭配方' }).click();
 await search.fill('IBA Tiki');
 await page.locator('.cocktail-card .art-open').click();
 await expect(page.locator('.recipe-notes')).toContainText('未注明单位');
 await expect(page.locator('.recipe-ingredients li').filter({ hasText:'菠萝汁' })).toContainText('90 原文未注明单位');
 await page.getByRole('button', { name:'关闭配方' }).click();
 await page.getByRole('button', { name:'切换为英文' }).click();
 await page.locator('.cocktail-card .art-open').click();
 await expect(page.locator('.recipe-content')).not.toContainText(/[\u4e00-\u9fff]/);
});
