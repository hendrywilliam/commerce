import express from "express";
import process from "node:process";
import { log } from "./utils/logger";
import pino from "pino-http";
import bodyParser from "body-parser";
const app = express();
const pinoHttpLogger = pino();
const PORT = 3000;
app.use(pinoHttpLogger);
app.use(bodyParser.json());
app.get("/", (req, res) => {
    log.info("hi");
    res.send("Hello World");
});
import { addItemToCart } from "./controllers/cart";
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
