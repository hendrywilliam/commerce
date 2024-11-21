import express from "express";
import process from "node:process";
import { log } from "./src/utils/logger";
import pino from "pino-http";
import bodyParser from "body-parser";
import type { Request, Response } from "express";

const app = express();
const pinoHttpLogger = pino();
const PORT = 3000;

app.use(pinoHttpLogger);
app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
	log.info("hi");
	res.send("Hello World");
});

import { addItemToCart } from "./src/controllers/cart";
app.post("/cart", addItemToCart);

const server = app.listen(PORT, () => {
	console.log(`Listening on ${PORT}`);
});

process.on("SIGTERM", () => {
	console.log("sigterm signal received: closing http server");
	server.close(() => {
		console.log("http server closed");
		process.exit(0);
	});
});

process.on("SIGINT", () => {
	console.log("sigint signal received: closing http server");
	server.close(() => {
		console.log("http server closed");
		process.exit(0);
	});
});
