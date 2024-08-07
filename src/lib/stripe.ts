import Stripe from "stripe";
import * as dotenv from "dotenv";
dotenv.config();

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-06-20",
    appInfo: {
        name: "ecremmoce",
        url: "https://ecremmoce.vercel.app/",
    },
    typescript: true,
});
