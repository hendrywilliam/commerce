"use server";

import { db } from "@/db/core";
import { slugify } from "@/lib/utils";
import { faker } from "@faker-js/faker";
import { Product, products } from "@/db/schema";

export async function seed_products({
  storeId,
  count,
}: {
  storeId: number;
  count: number;
}) {
  const productCount = count ?? 10;
  const productsData: Product[] = [];

  for (let i = 0; i < productCount; i++) {
    const shuffleCategory =
      faker.helpers.shuffle(products.category.enumValues)[0] ?? "backpack";

    const productName = faker.commerce.productName();

    productsData.push({
      id: new Date().getTime() + new Date().getMilliseconds() + i,
      name: productName,
      description: faker.commerce.productDescription(),
      totalRating: String(
        faker.number.float({ min: 1, max: 4, fractionDigits: 1 }),
      ),
      stock: faker.number.int({ min: 50, max: 150 }),
      price: faker.commerce.price({
        min: 10,
        max: 100,
      }),
      slug: slugify(productName),
      category: shuffleCategory,
      createdAt: faker.date.past(),
      image: JSON.stringify(
        Array.from({ length: 1 }).map(() => {
          return {
            key: faker.string.alpha(20),
            url: faker.image.urlLoremFlickr(),
            name: faker.system.fileName({ extensionCount: 2 }),
            size: faker.number.int({ max: 20000 }),
          };
        }),
      ),
      storeId,
    });
  }

  await db.insert(products).values(productsData);
  return;
}
