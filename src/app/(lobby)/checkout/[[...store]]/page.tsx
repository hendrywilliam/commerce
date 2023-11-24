import { Suspense } from "react";
import LoadingSkeleton from "@/components/loading-skeleton";
import UserAddressList from "@/components/lobby/checkout/user-address-list";
import { getAddressDetailsAction } from "@/actions/addresses/get-address-details";
import { cookies } from "next/headers";

export default async function CheckoutPage({
  params: { store },
}: {
  params: {
    store: string[];
  };
}) {
  const [storeId, storeSlug] = store;
  const addressesDetails = await getAddressDetailsAction();

  return (
    <div className="flex flex-col container h-full w-full py-8 gap-4">
      <h1 className="font-semibold text-2xl">Checkout</h1>
      <section className="flex flex-col lg:flex-row gap-4">
        <div className="w-full flex flex-col lg:w-3/4 gap-4">
          <div className="border p-4 rounded">
            <Suspense
              fallback={
                <div className="flex flex-col gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <LoadingSkeleton key={i} />
                  ))}
                </div>
              }
            >
              <UserAddressList addresses={addressesDetails} />
            </Suspense>
          </div>
        </div>
        <div className="w-full lg:w-1/4"></div>
      </section>
    </div>
  );
}
