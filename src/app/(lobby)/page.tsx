import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function IndexPage() {
  return (
    <div className="flex container h-full w-full justify-center">
      <div className="flex flex-col h-max w-full pt-32 gap-4">
        <h1 className="font-semibold text-6xl text-center w-full">
          A fictional marketplace to sell and buy, built with everything new in
          Next.js.
        </h1>
        <p className="text-lg font-medium text-center text-gray-500">
          Explore any items from independent brands around the world with ease.
        </p>
        <div className="flex justify-center gap-2">
          <Link className={buttonVariants()} href="/products">
            Buy now
          </Link>
          <Link
            className={buttonVariants({ variant: "outline" })}
            href="/products"
          >
            Sell now
          </Link>
        </div>
      </div>
    </div>
  );
}
