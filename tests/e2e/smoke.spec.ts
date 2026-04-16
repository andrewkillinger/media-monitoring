import { test, expect } from "@playwright/test";

test.describe("Smoke Tests", () => {
  test("login page loads", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("h1, h2")).toContainText(/sign in|log in|media monitor/i);
  });

  test("unauthenticated user is redirected to login", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForURL(/\/login/);
    expect(page.url()).toContain("/login");
  });

  test("login page has email and password fields", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test("login page has submit button", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });
});
