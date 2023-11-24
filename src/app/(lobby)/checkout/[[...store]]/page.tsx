export default function CheckoutPage({
  params: { store },
}: {
  params: {
    store: string[];
  };
}) {
  const [storeId, storeSlug] = store;

  return <div>Checkout page based on the store ID {storeId}</div>;
}
