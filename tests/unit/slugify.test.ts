import { slugify } from "@/lib/utils";
import { describe, expect, test } from "@jest/globals";

describe("slugify", () => {
  test("it should work.", () => {
    expect(slugify("miki matsubara figure")).toBe("miki-matsubara-figure");
  });

  test("it should work with backtick.", () => {
    expect(slugify("miki matsubara`s figure")).toBe("miki-matsubaras-figure");
  });

  test("it should work with non alphanumerical characters.", () => {
    expect(slugify("hi!@#$%^&*()_+?><:{} mom")).toBe("hi-mom");
  });
});
