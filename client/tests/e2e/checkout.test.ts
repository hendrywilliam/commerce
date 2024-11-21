import { expect, test } from "@playwright/test";
import { authentication } from "../config/auth";

const { email, pass } = authentication;

// wip - hydration fails when we submit form.
test.fixme(
  "[happy path] user able to add an item to their own cart and checkout.",
  async ({ page }) => {
    await page.goto("/sign-in");

    await page.getByTestId("email").fill(email);
    await page.getByTestId("password").fill(pass);
    await page.waitForLoadState("load");

    await page.getByTestId("submit").click();

    await page.goto("/product/lofi-girl-jazz");
    await page.waitForLoadState("load");
    await expect(page.getByTestId("add-to-cart-button")).toBeVisible();
    await page.getByTestId("add-to-cart-button").click();

    await expect(page.getByTestId("cart-items-indicator")).toHaveText("1");
    await page.getByTestId("cart-trigger").click();

    await expect(page.getByTestId("view-full-cart-button")).toBeVisible();
    await page.getByTestId("view-full-cart-button").click();

    await page.waitForURL("/cart");
    await expect(page.getByText("Cart")).toBeVisible();
  },
);
