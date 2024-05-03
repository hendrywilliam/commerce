import { db } from "@/db/core";
import { stores } from "@/db/schema";
import { slugify } from "@/lib/utils";
import { UserObjectCustomized } from "@/types";
import { clerkClient } from "@clerk/nextjs";

// tsx ./scripts/create-new-store.ts [tails]
const tails = process.argv.slice(2);
const user_id = tails[0];

async function main({
  description,
  name,
  user_id,
}: {
  description: string;
  name: string;
  user_id: string;
}) {
  try {
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
      throw new Error("Failed to create store.");
    }

    const user = (await clerkClient.users.getUser(
      user_id,
    )) as unknown as UserObjectCustomized;

    if (!user) {
      throw new Error("No such user exist in database.");
    }

    await clerkClient.users.updateUser(user_id, {
      privateMetadata: {
        ...user.privateMetadata,
        storeId: [...user.privateMetadata.storeId, store.id],
      },
    });
    console.log("Success create a new store.");
    process.exit(0);
  } catch (error) {
    console.error((error as Error).message);
    process.exit(1);
  }
}

main({
  description: "Lofi Girl Store",
  name: "LofiGirlShop",
  user_id: tails[0],
});
