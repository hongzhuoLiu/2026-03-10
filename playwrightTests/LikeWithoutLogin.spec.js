const { test, expect } = require('@playwright/test');

test('Like button should not work when not logged in', async ({ page }) => {
    // 1. open the website
    await page.goto('http://localhost:3000/universities/3');

    // 2. find the like button and click it
    // eslint-disable-next-line testing-library/prefer-screen-queries
    const likeButton = page.getByRole('button', { name: /like/i });
    await likeButton.click();

    // 3. to see if the 'click' worked
    // eslint-disable-next-line testing-library/prefer-screen-queries
    const likeCount = page.getByTestId('like-count');  // 假设有 like-count 的 data-testid
    const initialCount = await likeCount.textContent();

    // 4. wait for a while to see if the likecount isn't changed
    await page.waitForTimeout(1000);  // wait for one second
    const newCount = await likeCount.textContent();
    expect(newCount).toBe(initialCount);  // to check if the count changes

    // 5. to see if the login page pop-up
    // eslint-disable-next-line testing-library/prefer-screen-queries
    const loginPopup = page.getByText(/login/i);
    await expect(loginPopup).toBeVisible();
});
