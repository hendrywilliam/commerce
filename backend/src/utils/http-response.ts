import { ZodError } from "zod";

export const HTTPStatusCreated = 201;
export const HTTPStatusOK = 200;

export const HTTPUnauthorized = 401;
export const HTTPStatusBadRequest = 400;

export function getErrorMessage(error: unknown): string {
	const unknownError = "Something went wrong please try again later.";
	if (error instanceof ZodError) {
		const fmt = error.format();
		return fmt._errors[0];
	}
	if (error instanceof Error) {
		return error.message;
	}
	return unknownError;
}
