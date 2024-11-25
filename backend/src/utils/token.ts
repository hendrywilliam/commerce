import * as jose from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

export async function sign(claims: Record<string, unknown>): Promise<string> {
	const signed = await new jose.SignJWT(claims)
		.setProtectedHeader({
			alg: "HS256",
		})
		.setExpirationTime("2h")
		.sign(secret);
	return signed;
}

export async function verify(token: string): Promise<jose.JWTPayload> {
	const { payload } = await jose.jwtVerify(token, secret);
	return payload;
}
