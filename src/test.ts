import { Browser, chromium, Page } from 'playwright';

declare var window: any;

(async () => {
    const browser = await chromium.launch({
        headless: false
    });
    const page = await browser.newPage();
    await page.goto('http://localhost:4200/');

    for (let i = 0; i < 5; i++) {
        await page.locator('button').click();
        const before = Date.now();
        console.log('before waitForAngular: ');
        await waitForAngular(page);
        console.log('after waitForAngular: ', Date.now() - before, 'ms');
        await page.waitForTimeout(5000);
    }
    await browser.close();
})();

async function waitForAngular(page: Page) {
    await page.evaluate(async () => {
        async function whenStable(testability: any) {
            return new Promise((res) => testability.whenStable(res) );
        }
        if (window['getAllAngularTestabilities']) {
            await Promise.all(window['getAllAngularTestabilities']().map(whenStable));
        }
    });
}