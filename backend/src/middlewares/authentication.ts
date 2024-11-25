import type { Request, Response, NextFunction } from "express";
import { HTTPUnauthorized } from "../utils/http-response";

export async function authenticationMw(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const authHeader = req.headers.authorization?.split(" ");
		if (!authHeader) {
			throw new Error("Missing authorization header.");
		}
		if (authHeader[0] !== "Bearer") {
			throw new Error("Unrecognized authentication scheme.");
		}
		if (authHeader[1].length === 0) {
			throw new Error("");
		}
	} catch (error: unknown) {
		res.status(HTTPUnauthorized).json({
			message: (error as Error).message,
		});
	}
}
