const { test, expect } = require('@playwright/test');

test('always pass', async ({ page }) => {
    // Pass with no action
    expect(true).toBe(true);
});
