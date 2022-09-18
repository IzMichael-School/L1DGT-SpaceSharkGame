// @ts-check
const { test, expect } = require('@playwright/test');

test('Do the controls work?', async ({ page }) => {
    await resetGame(page);

    await page.keyboard.down('A');
    await sleep(0.125)
    await page.keyboard.up('A');
    await page.keyboard.down('W');
    await sleep(3)
    await page.keyboard.up('W');
    await page.screenshot({ path: 'test-artefacts/top-right.png' });

    await resetGame(page);

    await page.keyboard.down('A');
    await sleep(0.75)
    await page.keyboard.up('A');
    await page.keyboard.down('W');
    await sleep(3)
    await page.keyboard.up('W');
    await page.screenshot({ path: 'test-artefacts/top-left.png' });

    await resetGame(page);

    await page.keyboard.down('A');
    await sleep(1.05)
    await page.keyboard.up('A');
    await page.keyboard.down('W');
    await sleep(3)
    await page.keyboard.up('W');
    await page.screenshot({ path: 'test-artefacts/bottom-left.png' });

    await resetGame(page);

    await page.keyboard.down('D');
    await sleep(0.125)
    await page.keyboard.up('D');
    await page.keyboard.down('W');
    await sleep(3)
    await page.keyboard.up('W');
    await page.screenshot({ path: 'test-artefacts/bottom-right.png' });

    await sleep(1);
});

async function resetGame(page) {
    await page.goto('/');
    const playBtn = page.locator('button >> text="Play Game" >> visible=true');
    await expect(playBtn).toBeVisible();
    await playBtn.click();

    await expect(page.locator('canvas#game')).toBeVisible();
    await expect(page.locator('#readyState')).toHaveText('Ready: true');

    await sleep(0.5);
    return true;
};

test('Do the asteroids damage earth?', async ({ page }) => {
    await resetGame(page);

    await page.keyboard.down('D');
    await sleep(0.4);
    await page.keyboard.up('D');
    await page.keyboard.down('W');
    await sleep(2)
    await page.keyboard.up('W');

    await expect(page.locator('.header >> text="You Failed!"')).toBeVisible();
    await sleep(1);
});

function sleep(s) {
    return new Promise(resolve => setTimeout(resolve, (s * 1000)));
};