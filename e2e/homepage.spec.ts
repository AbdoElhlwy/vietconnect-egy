import { test, expect } from "@playwright/test";

test("homepage loads and shows the platform name", async ({ page }) => {
  await page.goto("/ar");
  await expect(page.getByText("VietConnect Egy").first()).toBeVisible();
});

test("login page renders the demo credentials hint", async ({ page }) => {
  await page.goto("/ar/auth/login");
  await expect(page.getByText("admin@vietconnect-egy.local")).toBeVisible();
});

test("unauthenticated user is redirected away from the admin panel", async ({ page }) => {
  await page.goto("/ar/admin");
  await expect(page).toHaveURL(/auth\/login/);
});
