import { db } from "@/db/core";
import { slugify } from "@/lib/utils";
import { faker } from "@faker-js/faker";
import { NewProduct, Rating, products, ratings } from "@/db/schema";

export async function seedProducts({
  storeId,
  count,
}: {
  storeId: number;
  count?: number;
}) {
  const productCount = count ?? 10;
  const productsData: NewProduct[] = [];
  const ratingsData: Rating[] = [];

  for (let i = 0; i < productCount; i++) {
    const shuffleCategory =
      faker.helpers.shuffle(products.category.enumValues)[0] ?? "backpack";

    const productName = faker.commerce.productName();
    const productId =
      Math.floor(new Date().getTime() / 10000) +
      new Date().getMilliseconds() +
      i;

    // All ratings from 1-5 (order matters).
    const allRatings = [
      faker.number.int({ min: 1, max: 10 }),
      faker.number.int({ min: 10, max: 20 }),
      faker.number.int({ min: 10, max: 30 }),
      faker.number.int({ min: 10, max: 40 }),
      faker.number.int({ min: 10, max: 50 }),
    ];

    const accumulatedTotalRatings = allRatings.reduce(
        (total, rating, index) => {
          return total + rating * (index + 1);
        },
        0,
      ),
      totalRatings = allRatings.reduce((total, rating) => total + rating, 0);

    ratingsData.push({
      id:
        Math.floor(new Date().getTime() / 100000) +
        new Date().getMilliseconds() +
        i,
      productId,
      oneStar: allRatings[0],
      twoStars: allRatings[1],
      threeStars: allRatings[2],
      fourStars: allRatings[3],
      fiveStars: allRatings[4],
      accumulatedTotalRatings,
      totalRatings,
    });

    productsData.push({
      id: productId,
      name: productName,
      description: faker.commerce.productDescription(),
      stock: faker.number.int({ min: 50, max: 75 }),
      price: faker.commerce.price({
        min: 10,
        max: 100,
      }),
      slug: slugify(productName),
      category: shuffleCategory,
      createdAt: faker.date.past(),
      averageRatings: String(accumulatedTotalRatings / totalRatings),
      image: Array.from({ length: 3 }).map(() => {
        return {
          key: faker.string.alpha(20),
          url: faker.image.urlPicsumPhotos(),
          name: faker.system.fileName({ extensionCount: 2 }),
          size: faker.number.int({ max: 20000 }),
        };
      }),
      storeId,
    });
  }

  await db.insert(products).values(productsData);
  await db.insert(ratings).values(ratingsData);
  console.log("Seeding completed.");
  return;
}

seedProducts({
  storeId: 1,
});
