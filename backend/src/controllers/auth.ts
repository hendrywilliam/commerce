import type { Request, Response } from "express";
import { validation_registerUser } from "../utils/validations/auth";
import { hashPassword } from "../utils/hash";
import {
	getErrorMessage,
	HTTPStatusBadRequest,
	HTTPStatusCreated,
} from "../utils/http-response";
import { db } from "../db";
import { users } from "../db/schema";
import { emailQueue } from "../utils/background-process/queue";

export async function register(req: Request, res: Response) {
	try {
		const { data, success, error } = await validation_registerUser.spa(
			req.body,
		);
		if (!success) {
			throw new Error(error.issues[0].message);
		}
		const hashedPass = await hashPassword(data.password);
		const user = await db
			.insert(users)
			.values({
				email: data.email,
				fullName: data.fullName,
				password: hashedPass,
				username: data.username,
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
			message: "User created. You may login now.",
			data: {
				email: data.email,
			},
		});
	} catch (error) {
		res.status(HTTPStatusBadRequest).json({
			error: getErrorMessage(error),
		});
	}
}

export async function login() {}
