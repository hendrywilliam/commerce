import { unixToDateString } from "@/lib/utils";
import { describe, expect, test } from "@jest/globals";
import { dateToUnixTimestamp } from "../test-utils/unix-timestamp";

describe("transform unix timestamp to plain Date object then convert to string.", () => {
  test("it should work and displaying Wednesday, February 7, 2024", () => {
    expect(unixToDateString(1707304833)).toBe("Wednesday, February 7, 2024");
  });

  test("it should work and displaying today date.", () => {
    const now = new Date();
    const timestamp = dateToUnixTimestamp(now);
    expect(unixToDateString(timestamp)).toBe(
      now.toLocaleDateString("us-US", {
        dateStyle: "full",
      }),
    );
  });

  test("it should work and displaying past date.", () => {
    expect(unixToDateString(1607305802)).toBe("Monday, December 7, 2020");
  });
});
