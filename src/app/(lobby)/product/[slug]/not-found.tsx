import Link from "next/link";

export default function ProductNotFoundPage() {
  return (
    <div className="flex flex-col container h-full w-full py-8">
      <Link className="inline-flex gap-2 text-gray-400" href={"/products"}>
        Back to Products
      </Link>
      <h1 className="font-bold text-xl">No product found.</h1>
    </div>
  );
}
