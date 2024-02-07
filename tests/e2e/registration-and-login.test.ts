import { getAbsoluteUrl } from "@/lib/utils";
import { expect, test } from "@playwright/test";
import { authentication } from "../config/auth";

const { email, pass } = authentication;

// Remove "skip" anotation if we want to test register again.
test.skip("[happy path] user can able to register and login.", async ({
  page,
}) => {
  await page.goto(getAbsoluteUrl("/sign-up"));
  await expect(page.getByRole("heading", { name: "Sign up" })).toBeVisible();

  // Fill registration form
  await page.getByTestId("email").fill(email);
  await page.getByTestId("password").fill(pass);
  await page.getByTestId("confirmPassword").fill(pass);
  await page.getByTestId("submit").click();

  // Registration succeeded then navigate to sign-in
  await expect(page).toHaveURL("/sign-in");

  await page.getByTestId("email").fill(email);
  await page.getByTestId("password").fill(pass);
  await page.getByTestId("submit").click();

  await expect(page).toHaveURL("/");
});

test("[edge case] registration with invalid email shows error message.", async ({
  page,
}) => {
  await page.goto(getAbsoluteUrl("/sign-up"));

  await page.getByTestId("email").fill("skater");
  await page.getByTestId("password").fill("wong_saya_suka_kok");
  await page.getByTestId("confirmPassword").fill("wong_saya_suka_kok");

  await page.getByTestId("submit").click();

  await expect(
    page.getByText("Invalid email. Please provide a proper email."),
  ).toBeVisible();
});

test("[edge case] registration with invalid confirm/password format shows error message.", async ({
  page,
}) => {
  await page.goto(getAbsoluteUrl("/sign-up"));

  await page.getByTestId("email").fill("skater@gmail.com");
  await page.getByTestId("password").fill(pass);
  await page.getByTestId("confirmPassword").fill("lofi_girl");
  await page.getByTestId("submit").click();

  await expect(
    page.getByText("Password does not match with confirm password."),
  ).toBeVisible();
});
