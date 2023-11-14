import Image from "next/image";
import { IconBackpack, IconShoes, IconTshirt } from "@/components/ui/icons";
import { getAllProductsCount } from "@/actions/products/get-products-count";

export default async function CategoriesShowcase() {
  const [shoesCount, clothingCount, backpackCount] =
    await getAllProductsCount();

  return (
    <section className="flex flex-col mt-64 w-3/4 items-center gap-2">
      <h1 className="text-4xl font-bold">Categories</h1>
      <p className="font-medium text-center text-gray-500">
        Find any item that suits you the best.
      </p>
      <div className="grid grid-cols-3 w-full mt-4 gap-4">
        <div className="group relative h-36 border rounded overflow-hidden">
          <Image
            src="/images/image-backpack.webp"
            fill
            alt="Backpack Category"
            className="object-cover rounded transition duration-300 ease-in-out group-hover:scale-105"
          />
          <div className="absolute flex flex-col bg-black/50 top-0 left-0 w-full h-full rounded text-white p-4 justify-between font-semibold">
            <div className="flex h-8 w-8 rounded-full bg-white justify-center items-center align-middle">
              <IconBackpack />
            </div>
            <div>
              <p>Backpack</p>
              <p className="text-gray-300">{backpackCount} Products</p>
            </div>
          </div>
        </div>
        <div className="group relative h-36 border rounded overflow-hidden">
          <Image
            src="/images/image-clothing.webp"
            fill
            alt="Clothing Category"
            className="object-cover rounded transition duration-300 ease-in-out group-hover:scale-105"
          />
          <div className="absolute flex flex-col bg-black/50 top-0 left-0 w-full h-full rounded text-white p-4 justify-between font-semibold">
            <div className="flex h-8 w-8 rounded-full bg-white justify-center items-center align-middle">
              <IconTshirt />
            </div>
            <div>
              <p>Clothing</p>
              <p className="text-gray-300">{clothingCount} Products</p>
            </div>
          </div>
        </div>
        <div className="group relative h-36 border rounded overflow-hidden">
          <Image
            src="/images/image-shoe.webp"
            fill
            alt="Shoes Category"
            className="object-cover rounded transition duration-300 ease-in-out group-hover:scale-105"
          />
          <div className="absolute flex flex-col bg-black/50 top-0 left-0 w-full h-full rounded text-white p-4 justify-between font-semibold">
            <div className="flex h-8 w-8 rounded-full bg-white justify-center items-center align-middle">
              <IconShoes />
            </div>
            <div>
              <p>Shoes</p>
              <p className="text-gray-300">{shoesCount} Products</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
