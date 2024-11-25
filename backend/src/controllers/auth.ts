import type { Request, Response } from "express";
import {
	validation_loginUser,
	validation_registerUser,
} from "../utils/validations/auth";
import { hash, verify } from "../utils/hash-password";
import {
	getErrorMessage,
	HTTPStatusBadRequest,
	HTTPStatusCreated,
	HTTPStatusOK,
} from "../utils/http-response";
import { db } from "../db";
import { users } from "../db/schema";
import { emailQueue } from "../utils/background-process/queue";
import { eq } from "drizzle-orm";
import { sign } from "../utils/token";

export async function register(req: Request, res: Response) {
	try {
		const { data, success, error } = await validation_registerUser.spa(
			req.body,
		);
		if (!success) {
			throw new Error(error.issues[0].message);
		}
		const hashedPass = await hash(data.password);
		const user = await db
			.insert(users)
			.values({
				email: data.email,
				fullName: data.fullName,
				password: hashedPass,
			})
			.returning()
			.execute()
			.then((result) => result[0]);
		await emailQueue.add(
			"verify_email",
			{ email: user.email, fullName: user.fullName },
			{ delay: 5000 },
		);
		res.status(HTTPStatusCreated).json({
			message: "Please check your email to verify your account.",
			data: {
				email: user.email,
			},
		});
	} catch (error) {
		res.status(HTTPStatusBadRequest).json({
			error: getErrorMessage(error),
		});
	}
}

export async function login(req: Request, res: Response) {
	try {
		const { data, success, error } = await validation_loginUser.spa(req.body);
		if (!success) {
			throw new Error(error.issues[0].message);
		}
		const user = await db.query.users.findFirst({
			where: eq(users.email, data.email),
		});
		if (!user) {
			throw new Error("No such user exist.");
		}
		const isValidPassword = await verify(data.password, user.password);
		if (!isValidPassword) {
			res.status(HTTPStatusBadRequest).json({
				message: "Invalid password.",
			});
			return;
		}
		const accessToken = await sign({
			id: user.id,
			email: user.email,
			publicMetadata: user.publicMetadata,
		});
		res.status(HTTPStatusOK).json({
			message: "Login succeeded.",
			data: {
				access_token: accessToken,
			},
		});
	} catch (error) {
		res.status(HTTPStatusBadRequest).json({
			error: getErrorMessage(error),
		});
	}
}
