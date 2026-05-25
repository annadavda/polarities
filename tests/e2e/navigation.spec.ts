import { expect, test } from "@playwright/test";

test("navigates from home to articles and an article detail page", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /The tension/i })).toBeVisible();

  await page.getByRole("link", { name: /Explore essays/i }).click();
  await expect(page).toHaveURL(/\/articles/);

  const firstArticle = page.locator('a[href^="/articles/"]').first();
  await firstArticle.click();
  await expect(page.locator("article")).toBeVisible();
  await expect(page.getByText(/Related polarities/i)).toBeVisible();
});
