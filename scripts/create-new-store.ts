"use server";

import { db } from "@/db/core";
import { stores } from "@/db/schema";
import { getProcArgv } from "./utils";
import { slugify } from "@/lib/utils";
import { clerkClient } from "@clerk/nextjs";
import { UserObjectCustomized } from "@/types";
import { ParseArgsConfig } from "util";

/** pnpm run script create-new-store --id=100 --name=LofiGirl */
const options = {
  id: {
    type: "string",
  },
  description: {
    type: "string",
  },
  name: {
    type: "string",
  },
} satisfies ParseArgsConfig["options"];
// @ts-ignore
const { id, name } = getProcArgv(options);

async function main({
  description,
  name,
  user_id,
}: {
  description: string;
  name: string;
  user_id: string;
}) {
  const start = Date.now();
  console.log("⌛ Processing...");
  try {
    await db.transaction(async (tx) => {
      const store = await db
        .insert(stores)
        .values({
          description,
          name,
          slug: slugify(name),
        })
        .returning({
          id: stores.id,
        })
        .then((result) => ({
          id: result[0].id,
        }));

      if (!store) {
        tx.rollback();
        throw new Error("Failed to create a new store.");
      }

      const user = (await clerkClient.users.getUser(
        user_id
      )) as unknown as UserObjectCustomized;

      if (!user) {
        tx.rollback();
        throw new Error("No such user exist in database.");
      }

      await clerkClient.users.updateUser(user_id, {
        privateMetadata: {
          ...user.privateMetadata,
          storeId: [...user.privateMetadata.storeId, store.id],
        },
      });
    });
    console.log("Success create a new store.");
    console.log(`Time elapsed: ${Date.now() - start} ms`);
    process.exit(0);
  } catch (error) {
    console.error((error as Error).message);
    console.log(`Time elapsed: ${Date.now() - start} ms`);
    process.exit(1);
  }
}

main({
  description: "Lofi Girl Store",
  name: name as string,
  user_id: id as string,
});
