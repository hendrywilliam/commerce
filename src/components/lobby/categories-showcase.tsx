import Image from "next/image";
import { db } from "@/db/core";
import { sql } from "drizzle-orm";
import { products } from "@/db/schema";
import { IconBackpack, IconShoes, IconTshirt } from "@/components/ui/icons";

export default async function CategoriesShowcase() {
  const allProductsWithCount = await db
    .select({
      category: products.category,
      count: sql<number>`count('*')`,
    })
    .from(products)
    .groupBy(products.category);

  const embedImageForProduct = allProductsWithCount.map((product) => {
    return {
      ...product,
      image:
        product.category === "backpack"
          ? "/images/image-backpack.webp"
          : product.category === "clothing"
          ? "/images/image-clothing.webp"
          : product.category === "shoes"
          ? "/images/image-shoe.webp"
          : "",
      icon:
        product.category === "backpack" ? (
          <IconBackpack />
        ) : product.category === "clothing" ? (
          <IconTshirt />
        ) : product.category === "shoes" ? (
          <IconShoes />
        ) : null,
    };
  });

  return (
    <section className="flex flex-col mt-64 w-full lg:w-3/4 items-center gap-2">
      <h1 className="text-4xl font-bold">Categories</h1>
      <p className="font-medium text-center text-gray-500">
        Browse hundreds products based on the category.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-3 w-full mt-4 gap-4">
        {embedImageForProduct.map((product, i) => (
          <div
            key={i}
            className="group relative h-36 border rounded overflow-hidden"
          >
            <Image
              src={product.image}
              fill
              alt={product.category}
              className="object-cover rounded transition duration-300 ease-in-out group-hover:scale-105"
            />
            <div className="absolute flex flex-col bg-black/50 top-0 left-0 w-full h-full rounded text-white p-4 justify-between font-semibold">
              <div className="flex h-8 w-8 rounded-full bg-white justify-center items-center align-middle">
                {product.icon}
              </div>
              <div>
                <p className="capitalize">{product.category}</p>
                <p className="text-gray-300">{product.count} Products</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
