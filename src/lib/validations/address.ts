import { z } from "zod";

export const newAddressValidation = z.object({
  line1: z
    .string()
    .min(1, {
      message: "Line Address 1 is required.",
    })
    .describe(
      "First line address field for user's address. This field is required.",
    ),
  line2: z
    .string()
    .nullable()
    .describe(
      "Second line address field for user's address. This field is not required.",
    ),
  city: z
    .string()
    .min(1, {
      message: "City is required.",
    })
    .describe("City field for user's address. This field is required."),
  state: z
    .string()
    .min(1, {
      message: "State is required.",
    })
    .describe("State field for user's address. This field is required."),
  postal_code: z
    .string()
    .describe("Postal code field for user's address. This field is required."),
  country: z
    .string()
    .min(1, {
      message: "Country is required.",
    })
    .describe("Country field for user's address. This field is required."),
});
