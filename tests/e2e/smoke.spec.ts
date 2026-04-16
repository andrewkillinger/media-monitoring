import { test, expect } from "@playwright/test";

test.describe("Smoke Tests", () => {
  test("today's news loads directly", async ({ page }) => {
    await page.goto("/today");
    await expect(page).toHaveURL(/\/today/);
  });

  test("root redirects to today", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/today/);
  });

  test("app shell navigation is visible", async ({ page }) => {
    await page.goto("/today");
    await expect(page.locator("text=Today's News")).toBeVisible();
    await expect(page.locator("text=Dashboard")).toBeVisible();
    await expect(page.locator("text=Feed")).toBeVisible();
  });

  test("dashboard page loads", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/dashboard/);
  });
});
