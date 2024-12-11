import { z } from "zod";

export const storeValidation = z.object({
  name: z.string().min(1, {
    message: "Store name is required.",
  }),
  description: z.string().min(1, {
    message: "Description is required",
  }),
  active: z.boolean().default(false),
});

export const newStoreValidation = storeValidation.omit({ active: true });

export const cartDetailedItemsValidation = z
  .object({
    id: z.number(),
    qty: z.number(),
    name: z.string(),
    price: z.string(),
    image: z.any(),
    storeId: z.number(),
    category: z.string(),
    storeName: z.string(),
    storeSlug: z.string(),
  })
  .required()
  .array();

export const storeCheckoutValidation = z.object({
  storeId: z.number({ required_error: "Store ID is required to proceed." }),
  cartLineDetailedItems: cartDetailedItemsValidation,
});
