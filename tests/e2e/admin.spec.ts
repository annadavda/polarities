import { expect, test } from "@playwright/test";

test("local admin can edit and save an article", async ({ page }) => {
  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: "Article editor" })).toBeVisible();

  await page.locator('a[href^="/admin/articles/"]').first().click();
  await page.getByLabel("Summary").fill("Edited from the Playwright admin flow.");
  await page.getByRole("button", { name: /Save/i }).click();

  await expect(page).toHaveURL(/saved=1/);
  await expect(page.getByText("Saved.")).toBeVisible();
});
