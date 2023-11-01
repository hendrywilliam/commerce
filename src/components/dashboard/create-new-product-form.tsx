"use client";

import {
  Form,
  FormField,
  FormInput,
  FormLabel,
  FormTextarea,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UploadProductImage from "@/components/dashboard/upload-product-image";
import { useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import { Button } from "@/components/ui/button";
import { newProductValidation } from "@/lib/validations/product";
import { useZodForm } from "@/hooks/use-zod-form";
import { IconLoading } from "@/components/ui/icons";
import { FieldErrors } from "react-hook-form";
import { z } from "zod";
import type { NewProduct } from "@/db/schema";
import type { FileWithPreview } from "@/types";
import { toast } from "sonner";
import { catchError } from "@/lib/utils";
import { useParams } from "next/navigation";
import { insertNewProduct } from "@/actions/products/insert-new-product";

type NewProductInput = z.infer<typeof newProductValidation>;

export default function CreateNewProductForm() {
  const [selectedFiles, setSelectedFiles] = useState([] as FileWithPreview[]);
  const [isLoading, setIsLoading] = useState(false);
  const { startUpload } = useUploadThing("imageUploader");
  const routeParams = useParams();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useZodForm({
    schema: newProductValidation,
    mode: "onSubmit",
  });

  async function onSubmit(data: NewProductInput) {
    setIsLoading((isLoading) => !isLoading);
    try {
      const returnFromUploadedFile = await startUpload(data.image);
      const productData = {
        ...data,
        image: returnFromUploadedFile
          ? JSON.stringify([...returnFromUploadedFile])
          : JSON.stringify([]),
        storeId: Number(routeParams.storeId),
      } satisfies NewProduct;

      await insertNewProduct(productData);
      toast.success("Success add new product.");
    } catch (err) {
      catchError(err);
    } finally {
      setIsLoading((isLoading) => !isLoading);
    }
  }

  function onError(error: FieldErrors<NewProductInput>) {
    const firstErrorInErrorList = Object.values(error)[0];
    toast.error(String(firstErrorInErrorList.message));
  }

  return (
    <div className="flex flex-col gap-2">
      <Form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="flex flex-col gap-2"
      >
        <FormField>
          <FormLabel htmlFor="product-name-input">Product Name</FormLabel>
          <FormInput
            aria-invalid={errors["name"] ? "true" : "false"}
            {...register("name")}
            id="product-name-input"
          />
        </FormField>
        <FormField>
          <FormLabel htmlFor="product-description-input">
            Product Description
          </FormLabel>
          <FormTextarea
            {...register("description")}
            id="product-description-input"
            aria-invalid={errors["description"] ? "true" : "false"}
            cols={1}
            rows={1}
            className="resize-none h-36"
          />
        </FormField>
        <div className="grid grid-cols-2 w-full gap-2">
          <FormField>
            <FormLabel htmlFor="product-price-input">Product Price</FormLabel>
            <div className="inline-flex gap-2">
              <Button
                className="flex self-center h-6"
                size={"icon"}
                variant={"outline"}
              >
                &#43;
              </Button>
              <FormInput
                aria-invalid={errors["price"] ? "true" : "false"}
                {...register("price")}
                className="w-full"
                id="product-price-input"
              />
              <Button
                className="flex self-center h-6"
                size={"icon"}
                variant={"outline"}
              >
                &#8722;
              </Button>
            </div>
          </FormField>
          <FormField>
            <FormLabel htmlFor="product-stock-input">Product Stock</FormLabel>
            <div className="inline-flex gap-2">
              <Button
                className="flex self-center h-6"
                size={"icon"}
                variant={"outline"}
              >
                &#43;
              </Button>
              <FormInput
                aria-invalid={errors["stock"] ? "true" : "false"}
                {...register("stock", {
                  valueAsNumber: true,
                })}
                className="w-full"
                id="product-stock-input"
              />
              <Button
                className="flex self-center h-6"
                size={"icon"}
                variant={"outline"}
              >
                &#8722;
              </Button>
            </div>
          </FormField>
        </div>
        <FormField>
          <FormLabel>Product Category</FormLabel>
          <Select
            onValueChange={(value) =>
              setValue(
                "category",
                value as Pick<NewProduct, "category">["category"]
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select product category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="clothing">Clothing</SelectItem>
              <SelectItem value="backpack">Backpack</SelectItem>
              <SelectItem value="shoes">Shoes</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
        <FormField>
          <FormLabel>Product image</FormLabel>
          <UploadProductImage
            isFieldHavingError={Boolean(errors["image"])}
            setValue={setValue}
            setSelectedFiles={setSelectedFiles}
            selectedFiles={selectedFiles}
          />
        </FormField>
        <Button
          className="inline-flex gap-2"
          aria-disabled={isLoading}
          disabled={isLoading}
          type="submit"
        >
          {isLoading && <IconLoading />}Submit Product
        </Button>
      </Form>
    </div>
  );
}
