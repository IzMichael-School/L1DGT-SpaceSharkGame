// @ts-check
const { test, expect } = require('@playwright/test');

test('Main Menu has title, all buttons, footer white-label; buttons must be functional', async ({ page }) => {
    await page.goto('/');

    // Expect a title that contains Wahi Mango
    await expect(page.locator('#title')).toContainText(/Wahi Mango/);
    
    // Ensure Game Canvas is not visible
    await expect(page.locator('canvas >> #game')).toBeHidden();

    const tutorialBtn = page.locator('button >> text="How to Play"');
    await expect(tutorialBtn).toBeVisible();
    await tutorialBtn.click();
    await expect(page.locator('.header >> text="How to Play"')).toBeVisible();

    await backToMenu(page);

    const creditsBtn = page.locator('span >> text="Credits & Attribution" >> visible=true');
    await expect(creditsBtn).toBeVisible();
    await creditsBtn.click();
    await expect(page.locator('.header >> text="Credits & Attribution"')).toBeVisible();

    await backToMenu(page);

    const creatorAttr = page.locator('h2 >> text="© IzMichael 2022 - " >> visible=true');
    await expect(creatorAttr).toBeVisible();

    const creatorLink = page.locator('a >> text="izmichael.com" >> visible=true');
    await expect(creatorLink).toBeVisible();
    await creatorLink.click();
    await expect(page).toHaveURL(/izmichael.com/);
    await page.goto('/');

    const playBtn = page.locator('button >> text="Play Game" >> visible=true');
    await expect(playBtn).toBeVisible();
    await playBtn.click();

    const cutsceneWrapper = page.locator('#cutsceneWrapper')
    await expect(cutsceneWrapper).toBeVisible();
    cutsceneWrapper.click();

    await expect(page.locator('canvas#game')).toBeVisible();
    await expect(page.locator('#readyState')).toHaveText('Ready: true');
    await sleep(0.5);
    await page.close();
});

test('Fonts are loading correctly', async ({page}) => {
    await page.goto('/');

    await expect(await page.evaluate(async () => { return document.fonts.check('24px Nunito'); })).toBeTruthy();
    await expect(await page.evaluate(async () => { return document.fonts.check('24px Overfield'); })).toBeTruthy();

    const creditsBtn = page.locator('span >> text="Credits & Attribution" >> visible=true');
    await creditsBtn.click();
    await expect(page.locator('a >> text="Salted"')).toBeVisible();
    await expect(await page.evaluate(async () => { return document.fonts.check('24px Outfit'); })).toBeTruthy();

    await sleep(0.5);
    await page.close();
});

async function backToMenu(page) {
    const backBtn = page.locator('button >> text="Back to Menu" >> visible=true');
    await expect(backBtn).toBeVisible();
    await backBtn.click();
};

function sleep(s) {
    return new Promise(resolve => setTimeout(resolve, (s * 1000)));
};