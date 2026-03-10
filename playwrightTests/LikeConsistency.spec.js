const { test, expect } = require('@playwright/test');

test('multiple users like concurrently', async ({ browser }) => {
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();

    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    await page1.goto('http://localhost:3000');
    await page2.goto('http://localhost:3000');

    // two users like one comment seperately
    await page1.click('button#like');
    await page2.click('button#like');

    // to wait for a while and see if the likescount is the same
    const likes1 = await page1.textContent('#likes-count');
    const likes2 = await page2.textContent('#likes-count');

    expect(likes1).toBe(likes2);
});
//Not done yet cuz the like function isn't working for now