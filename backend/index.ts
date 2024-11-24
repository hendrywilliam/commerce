import express from "express";
import process from "node:process";
import { log } from "./src/utils/logger";
import { register } from "./src/controllers/auth";
import pino from "pino-http";
import {
	addCartItem,
	deleteCartItem,
	updateCartItem,
} from "./src/controllers/cart";
import type { Request, Response } from "express";
import { emailWorker } from "./src/utils/background-process/email-worker";
import { emailQueue } from "./src/utils/background-process/queue";

const app = express();
const httpLogMiddleware = pino();
const PORT = 3000;

app.use(httpLogMiddleware);
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
	res.send(".");
});
app.post("/cart", addCartItem);
app.delete("/cart", deleteCartItem);
app.put("/cart", updateCartItem);
app.post("/register", register);

const server = app.listen(PORT, async () => {
	console.log(`Listening on ${PORT}`);
	await emailWorker.run();
});

async function gracefulShutdown(signal: NodeJS.Signals) {
	log.info(`Signal "${signal}" received.`);
	server.close(() => {
		log.info("HTTP server closed");
	});
	await emailWorker.close();
	if (!emailWorker.isRunning()) {
		log.info("Email worker stopped.");
	}
	await emailQueue.close();
	process.exit(0);
}

process.on("SIGTERM", (signal: NodeJS.Signals) => gracefulShutdown(signal));
process.on("SIGINT", (signal: NodeJS.Signals) => gracefulShutdown(signal));
