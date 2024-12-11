import Link from "next/link";
import { db } from "@/db/core";
import { eq } from "drizzle-orm";
import { stores } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import Pagination from "@/components/pagination";
import type { UserObjectCustomized } from "@/types";
import { notFound, redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { buttonVariants } from "@/components/ui/button";
import { getProductsPage } from "@/fetchers/products/get-products-page";
import { getAllProductsAndStores } from "@/fetchers/products/get-all-products-and-stores";
import DashboardStoreProductShellTable from "@/components/dashboard/stores/store-product-shell-table";

interface StoreProductPageProps {
    params: {
        storeSlug: string;
    };
    searchParams: {
        page: string;
        page_size: string;
        [key: string]: string;
    };
}

export default async function DashboardStoreProductsPage({
    params,
    searchParams,
}: StoreProductPageProps) {
    const page = isNaN(Number(searchParams.page))
        ? 1
        : Number(searchParams.page);
    const pageSize = isNaN(Number(searchParams.page_size))
        ? 10
        : Number(searchParams.page_size);

    const user = (await currentUser()) as unknown as UserObjectCustomized;

    const store = await db.query.stores.findFirst({
        where: eq(stores.slug, params.storeSlug),
    });

    if (!store) {
        notFound();
    }

    const storeOwned = user.privateMetadata.storeId.find(
        (storeId) => storeId === store.id
    );

    if (!storeOwned) {
        redirect("/dashboard/stores");
    }

    const storeProductData = await getAllProductsAndStores({
        page,
        pageSize,
        sellers: params.storeSlug,
    }).then((storeProduct) => {
        return storeProduct.map((product) => {
            return product.products;
        });
    });

    const totalPage = await getProductsPage({
        pageSize,
        sellers: params.storeSlug,
    });

    const [productData, pageData] = await Promise.all([
        storeProductData,
        totalPage,
    ]);

    return (
        <div className="h-full">
            <div className="flex w-full">
                <div className="w-full">
                    <h1 className="text-2xl font-bold">Products</h1>
                    <p className="text-gray-500">List of store products.</p>
                </div>
                <div>
                    <Link
                        href="products/add-new-product"
                        className={buttonVariants({
                            class: "w-max",
                        })}
                    >
                        New Product
                    </Link>
                </div>
            </div>
            <Separator />
            <div className="h-[650px]">
                <DashboardStoreProductShellTable
                    storeProductData={productData}
                />
            </div>
            <div className="mt-4 flex">
                <Pagination currentPage={page} totalPage={pageData} />
            </div>
        </div>
    );
}
