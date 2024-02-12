import { baseUrl } from "@/config/site";
import { test, expect } from "@playwright/test";

test.skip("has title", async ({ page }) => {
  await page.goto(baseUrl ?? "https://commerce.hendryw.com/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/commerce/);
});
