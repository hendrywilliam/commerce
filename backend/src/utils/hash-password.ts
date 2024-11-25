import "dotenv/config";
import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

const keyLength = 32;

export async function hash(password: string): Promise<string> {
	return new Promise((resolve, reject) => {
		const salt = randomBytes(16).toString("hex");
		scrypt(password, salt, keyLength, (err, derivedKey) => {
			if (err) reject(err);
			resolve(`${salt}.${derivedKey.toString("hex")}`);
		});
	});
}

export async function verify(password: string, hash: string): Promise<boolean> {
	return new Promise((resolve, reject) => {
		const [salt, hashKey] = hash.split(".");
		const hashKeyBuff = Buffer.from(hashKey, "hex");
		scrypt(password, salt, keyLength, (err, derivedKey) => {
			if (err) reject(err);
			resolve(timingSafeEqual(hashKeyBuff, derivedKey));
		});
	});
}
