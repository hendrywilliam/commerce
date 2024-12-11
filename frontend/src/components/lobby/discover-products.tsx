import {
    Product,
    products as productsSchema,
    Store,
    stores,
} from "@/db/schema";
import { db } from "@/db/core";
import ProductCard from "./product-card";
import { eq } from "drizzle-orm";

export default async function DiscoverProducts() {
    const productsAndStores = await db
        .select()
        .from(productsSchema)
        .leftJoin(stores, eq(productsSchema.storeId, stores.id));

    return (
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5 mb-6">
            {productsAndStores.map((productAndStore) => {
                return (
                    <ProductCard
                        product={productAndStore.products}
                        key={productAndStore.products.id}
                        store={productAndStore.stores as Store}
                    />
                );
            })}
        </div>
    );
}
