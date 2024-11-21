"use server";

import "dotenv/config";
import { Extends } from "@/lib/utils";
import { Product } from "@/db/schema";
import { resend } from "@/lib/resend";
import { getProcArgv } from "./utils";
import type { ParseArgsConfig } from "node:util";
import OrderSuccessEmail from "../react-email/emails/order-success-email";

/**
 * pnpm run script send-payment-email --orderId?=3OjcZmAaT0py2Y5O2K05uAOD --receiver?=abc@email.com
 */
const options = {
  orderId: {
    type: "string",
    default: "3OjcZmAaT0py2Y5O2K05uAOD",
  },
  receiver: {
    type: "string",
    default: process.env["SEND_TEST_EMAIL"],
  },
} satisfies ParseArgsConfig["options"];

const { orderId, receiver } = getProcArgv(options);

const main = async function ({
  receiver,
  orderId,
}: {
  receiver: string;
  orderId: string;
}) {
  const start = Date.now();
  console.log("📧 Sending dummy email...");
  try {
    await resend.emails.send({
      from: `Commerce Team <no-reply@${process.env.MARKETING_DOMAIN!}>`,
      to: receiver,
      subject: "Thank you for your order!",
      react: OrderSuccessEmail({
        orderItems: [
          {
            id: 171482701,
            storeId: 1,
            name: "Handcrafted Soft Shoes",
            slug: "handcrafted-soft-shoes",
            category: "shoes",
            price: "96.00",
            description:
              "The slim & simple Maple Gaming Keyboard from Dev Byte comes with a sleek body and 7- Color RGB LED Back-lighting for smart functionality",
            averageRatings: "69",
            image: [
              {
                key: "AxLNFcSIXuHnOUyxUOPY",
                url: "https://picsum.photos/seed/Ltk9oTmEk/640/480",
                name: "outside_yum.xsd.spx",
                size: 6644,
              },
            ],
            qty: 2,
            stock: 50,
            createdAt: new Date(),
          },
        ] satisfies Extends<Product, { qty: number }>[],
        email: receiver,
        orderId,
      }),
    });
    console.log("Email sent.");
    console.log(`Time elapsed: ${Date.now() - start} ms`);
    process.exit(0);
  } catch (error) {
    console.error((error as Error).message);
    console.log(`Time elapsed: ${Date.now() - start} ms`);
    process.exit(1);
  }
};

main({
  orderId: orderId as string,
  receiver: receiver as string,
});
