import { z } from "zod";

export const newAddressValidation = z.object({
  line1: z.string().min(1, {
    message: "Line Address 1 is required.",
  }),
  line2: z.string().nullable(),
  city: z.string().min(1, {
    message: "City is required.",
  }),
  state: z.string().min(1, {
    message: "State is required.",
  }),
  postal_code: z.string(),
  country: z.string().min(1, {
    message: "Country is required.",
  }),
});
