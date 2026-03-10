const { test, expect } = require('@playwright/test');

test('Measure page load time for multiple pages', async ({ page }) => {
    // define the pages you wanna measure
    const pages = [
        'http://localhost:3000/',
        'http://localhost:3000/universities',
        'http://localhost:3000/programs',
        'http://localhost:3000/subjects',

    ];

    for (const url of pages) {
        const startTime = Date.now();

        // go to specific page and wait til load
        await page.goto(url, { waitUntil: 'load' });

        // get the time to load
        const endTime = Date.now();

        // calculate the time to load
        const loadTime = endTime - startTime;

        console.log(`Page ${url} loaded in ${loadTime}ms`);
    }
});
