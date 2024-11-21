import type { Request, Response } from "express";
import {
	HTTPStatusBadRequest,
	HTTPStatusCreated,
	HTTPStatusOK,
	getErrorMessage,
} from "../utils/http-response";
import { db } from "../db";
import { carts, products } from "../db/schema";
import { eq } from "drizzle-orm";
import {
	validation_cart,
	validation_cartWithoutQty,
} from "../utils/validations/cart";

export async function addCartItem(req: Request, res: Response) {
	try {
		const { data, success, error } = await validation_cart.spa(req.body);
		if (!success) {
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
			message: getErrorMessage(error),
		});
	}
}

export async function deleteCartItem(req: Request, res: Response) {
	try {
		const { data, success, error } = await validation_cartWithoutQty.spa(
			req.body,
		);
		if (!success) {
			throw new Error(error.issues[0].message);
		}
		const details = await db.transaction(async (tx) => {
			const cart = await tx.query.carts.findFirst({
				where: eq(carts.id, data.cart_id),
			});
			if (!cart) {
				throw new Error("Invalid cart. Please try again later.");
			}
			const cartItems = cart.items;
			const targetItem = cartItems.find(
				(item) => item.productId,
				data.product_id,
			);
			if (!targetItem) {
				throw new Error(
					"Invalid item in cart. Please try again later.",
				);
			}
			const filteredItems = cartItems.filter(
				(item) => item.productId !== targetItem.productId,
			);
			const itemDetails = await tx.query.products.findFirst({
				where: eq(products.id, targetItem.productId),
			});
			if (!itemDetails) {
				throw new Error("Invalid item. Please try again later.");
			}
			await tx
				.update(carts)
				.set({
					items: filteredItems,
				})
				.where(eq(carts.id, data.cart_id));
			return itemDetails;
		});
		res.status(HTTPStatusOK).json({
			data: details.name,
		});
	} catch (error: unknown) {
		res.status(HTTPStatusBadRequest).json({
			message: getErrorMessage(error),
		});
	}
}

export async function updateCartItem(req: Request, res: Response) {
	try {
		const { data, success, error } = await validation_cart.spa(req.body);
		if (!success) {
			throw new Error(error.issues[0].message);
		}
		const details = await db.transaction(async (tx) => {
			const cart = await tx.query.carts.findFirst({
				where: eq(carts.id, data.cart_id),
			});
			if (!cart) {
				throw new Error("Invalid cart. Please try again later.");
			}
			const cartItems = cart.items;
			const targetItem = cartItems.find(
				(item) => item.productId,
				data.product_id,
			);
			if (!targetItem) {
				throw new Error(
					"Item does not exist in cart. Please try again later.",
				);
			}
			const targetItemDetails = await tx.query.products.findFirst({
				where: eq(products.id, targetItem.productId),
			});
			if (!targetItemDetails) {
				throw new Error("Invalid item. Please try again later.");
			}
			if (targetItemDetails.stock < data.qty) {
				throw new Error("Stock limit exceeds.");
			}
			const filteredItem = cartItems.filter(
				(item) => item.productId !== data.product_id,
			);
			if (data.qty > 0) {
				await tx
					.update(carts)
					.set({
						items: [
							...filteredItem,
							{
								...targetItem,
								qty:
									targetItemDetails &&
									data.qty + targetItem.qty >
										targetItemDetails.stock
										? targetItemDetails.stock
										: data.qty,
							},
						],
					})
					.where(eq(carts.id, data.cart_id));
			} else {
				await db
					.update(carts)
					.set({
						items: [...filteredItem],
					})
					.where(eq(carts.id, data.cart_id));
			}
			return targetItemDetails;
		});
		res.status(HTTPStatusOK).json({
			data: details.name,
		});
	} catch (error) {
		res.status(HTTPStatusBadRequest).json({
			message: getErrorMessage(error),
		});
	}
}
