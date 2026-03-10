const { test, expect } = require('@playwright/test');

test('always fail', async ({ page }) => {
    // Fail with no action
    expect(false).toBe(true);
});
