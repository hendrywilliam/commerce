import { z } from "zod";

export const storeValidation = z.object({
  name: z.string().min(1, {
    message: "Store name is required.",
  }),
  description: z.string().min(1, {
    message: "Description is required",
  }),
  active: z.boolean().default(true),
});
