import { z } from "zod";

export const addNewStoreValidation = z.object({
  storeName: z.string().min(1, {
    message: "Store name is required.",
  }),
  description: z.string().min(1, {
    message: "Description is required",
  }),
});
