import { z } from "zod";
export const validation_addCartItem = z.object({
    product_id: z.number().gt(0),
    qty: z.number().min(1),
    cart_id: z.number().gt(0),
});
