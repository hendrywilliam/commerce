import { z } from "zod";

export const subscribeNewsletterValidation = z.object({
  email: z
    .string()
    .email({
      message: "Please insert your proper email to subscribe.",
    })
    .min(5),
});
