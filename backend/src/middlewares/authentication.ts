import type { Request, Response, NextFunction } from "express";
import { HTTPUnauthorized } from "../utils/http-response";
import { verify } from "../utils/token";
import { log } from "../utils/logger";

export async function authenticationMiddleware(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const authHeader = req.headers.authorization;
		if (!authHeader) {
			throw new Error("Missing authorization header.");
		}
		const tokenAuthHeader = authHeader.split(" ");
		const authScheme = tokenAuthHeader[0];
		if (authScheme !== "Bearer") {
			throw new Error("Unrecognized authentication scheme.");
		}
		const token = tokenAuthHeader[1];
		if (token.length === 0) {
			throw new Error("No token provided.");
		}
		const payload = await verify(token);
		// @ts-expect-error: req object has no local property.
		req.local = payload;
		next();
	} catch (error: unknown) {
		log.error(error);
		res.status(HTTPUnauthorized).json({
			message: "Internal server error.",
		});
	}
}
