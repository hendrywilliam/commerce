import type { Request, Response } from "express";
import { validation_addCartItem } from "../utils/validations/cart";
import {
	HTTPStatusBadRequest,
	HTTPStatusCreated,
	HTTPStatusOK,
} from "../utils/http-response";
import { db } from "../db";
import { carts, products } from "../db/schema";
import { eq } from "drizzle-orm";

export async function addItemToCart(req: Request, res: Response) {
	try {
		const { data, success, error } = await validation_addCartItem.spa(
			req.body,
		);
		if (!success) {
			console.log(error.issues);
			throw new Error(error.issues[0].message);
		}
		const cart = await db
			.select()
			.from(carts)
			.where(eq(carts.id, data.cart_id))
			.limit(1)
			.execute()
			.then((result) => {
				return result[0];
			});
		const isCartExist = !Number.isNaN(data.cart_id) && cart;
		if (isCartExist) {
			const details = await db.transaction(async (tx) => {
				const cartItems = cart.items;
				const excludeNewItem = cartItems.filter((cartItem) => {
					return cartItem.productId !== data.product_id;
				});
				const findItemInCart = cartItems.find(
					(cartItem) => cartItem.productId === data.product_id,
				);
				const newItemDetails = await tx.query.products.findFirst({
					where: eq(products.id, data.product_id),
				});
				if (!newItemDetails) {
					throw new Error(
						"Product does not exist in store. Please try again or contact the store.",
					);
				}
				if (
					data.qty + (findItemInCart?.qty ?? 0) >
					newItemDetails.stock
				) {
					throw new Error("Stock limit exceeds.");
				}
				await tx
					.update(carts)
					.set({
						items: cartItems
							? [
									...excludeNewItem,
									{
										productId: data.product_id,
										qty: findItemInCart
											? data.qty + findItemInCart.qty
											: data.qty,
									},
								]
							: [
									{
										productId: data.product_id,
										qty: data.qty,
									},
								],
					})
					.where(eq(carts.id, data.cart_id));
				return newItemDetails;
			});
			res.status(HTTPStatusOK).json({
				data: {
					name: details.name,
				},
			});
		} else {
			const { cartId, itemDetails } = await db.transaction(async (tx) => {
				const itemDetails = await tx.query.products.findFirst({
					where: eq(products.id, data.product_id),
				});
				if (!itemDetails) {
					throw new Error(
						"Failed to fetch product. Please try again later.",
					);
				}
				const { cartId } = await tx
					.insert(carts)
					.values({
						items: [{ productId: data.product_id, qty: data.qty }],
					})
					.returning({
						cartId: carts.id,
					})
					.then((result) => ({
						cartId: result[0].cartId,
					}));
				if (!cartId) {
					throw new Error(
						"Failed to create a new cart. please try again later.",
					);
				}
				return {
					itemDetails: itemDetails,
					cartId: cartId,
				};
			});
			res.status(HTTPStatusCreated).json({
				data: { cart_id: cartId, item_name: itemDetails.name },
			});
		}
	} catch (error: unknown) {
		res.status(HTTPStatusBadRequest).json({
			error: (error as Error).message,
		});
	}
}
