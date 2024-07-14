import PageLayout from "@/components/layouts/page-layout";
import Products from "@/components/lobby/products/products";
import { getProductsPage } from "@/fetchers/products/get-products-page";
import { getAllProductsAndStores } from "@/fetchers/products/get-all-products-and-stores";

interface ProductsPageProps {
    searchParams: {
        pmin: string;
        sort: string;
        pmax: string;
        sellers: string;
        category: string;
        rating: string;
        [key: string]: string;
    };
}

export default async function ProductsPage({
    searchParams,
}: ProductsPageProps) {
    const sellers = searchParams.sellers;
    const category = searchParams.category;
    const minPrice = searchParams.pmin ?? "0";
    const maxPrice = searchParams.pmax ?? "9999999";
    const sort = searchParams.sort ?? "createdAt.desc";

    // Empty / non existence searchParams property will be consider as undefined.
    const rating = isNaN(Number(searchParams.rating))
        ? String(0)
        : searchParams.rating;
    const currentPage =
        Number(searchParams.page) === 0 || isNaN(Number(searchParams.page))
            ? 1
            : Number(searchParams.page);
    const pageSize = isNaN(Number(searchParams.page_size))
        ? 10
        : Number(searchParams.page_size);

    const [allProductsAndStore, productsPageCount] = await Promise.all([
        await getAllProductsAndStores({
            sort,
            minPrice,
            maxPrice,
            sellers,
            category,
            pageSize,
            page: currentPage,
            rating,
        }),
        await getProductsPage({
            pageSize,
            category,
            sellers,
            minPrice,
            maxPrice,
            rating,
        }),
    ]);

    return (
        <PageLayout>
            <section>
                <h1 className="text-2xl font-bold">Browse All Products</h1>
                <Products
                    allStoresAndProducts={allProductsAndStore}
                    productsPageCount={productsPageCount}
                    currentPage={currentPage}
                    sellers={sellers}
                    categories={category}
                />
            </section>
        </PageLayout>
    );
}
