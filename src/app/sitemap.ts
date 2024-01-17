import { db } from "@/db/core";
import { MetadataRoute } from "next";
import { products, stores } from "@/db/schema";
import { baseUrl } from "@/config/site";
import { dashboardNavigation } from "@/config/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const dashboardRoute = dashboardNavigation.map((navigation) => {
    return {
      url: `${baseUrl}/${navigation.href}`,
    };
  });

  const productsRoute = await db
    .select()
    .from(products)
    .execute()
    .then((products) => {
      return products.map((product) => {
        return {
          url: `${baseUrl}/product/${product.slug}`,
          lastModified: (product.createdAt ??= new Date()),
        };
      });
    });

  const storesRoute = await db
    .select()
    .from(stores)
    .execute()
    .then((stores) => {
      return stores.map((store) => {
        return {
          url: `${baseUrl}/store/${store.slug}`,
          lastModified: (store.createdAt ??= new Date()),
        };
      });
    });

  return [...dashboardRoute, ...productsRoute, ...storesRoute];
}
