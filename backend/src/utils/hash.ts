import "dotenv/config";
import bcrypt from "bcrypt";

export async function hashPassword(password: string): Promise<string> {
	return await bcrypt.hash(
		password,
		Number.parseInt(process.env.SALT_ROUNDS as string, 10),
	);
}
