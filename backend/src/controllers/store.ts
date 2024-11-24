import { db } from "../db";

export async function createNewStore() {
	try {
		await db.transaction(async (tx) => {});
	} catch (error) {}
}
