import { z } from "zod";

export const validation_cart = z.object({
	product_id: z.number({ required_error: "product_id is required." }).gt(0),
	qty: z.number({ required_error: "input proper quantities." }).min(1),
	cart_id: z.number({ required_error: "cart_id is required." }).gt(0),
});

export const validation_cartWithoutQty = validation_cart.omit({
	qty: true,
});
