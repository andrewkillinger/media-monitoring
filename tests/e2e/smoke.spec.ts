import { test, expect } from "@playwright/test";

test.describe("Smoke Tests", () => {
  test("dashboard loads directly without login", async ({ page }) => {
    await page.goto("/dashboard");
    // Should stay on dashboard, not redirect to login
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("root redirects to dashboard", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("app shell navigation is visible", async ({ page }) => {
    await page.goto("/dashboard");
    // Sidebar should have navigation links
    await expect(page.locator("text=Coverage Feed")).toBeVisible();
    await expect(page.locator("text=Daily Digest")).toBeVisible();
  });

  test("login page no longer exists", async ({ page }) => {
    const response = await page.goto("/login");
    expect(response?.status()).toBe(404);
  });
});
