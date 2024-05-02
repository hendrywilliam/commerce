import {
  products as productsSchema,
} from "@/db/schema";
import { db } from "@/db/core";
import ProductCard from "./product-card";

export default async function DiscoverProducts() {
  const products = await db.select().from(productsSchema).limit(10)

  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5 mb-6">
      {products.map((product) => {
        return <ProductCard product={product} key={product.id} />;
      })}
    </div>
  )
}