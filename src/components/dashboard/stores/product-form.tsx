"use client";

import {
  Form,
  FormField,
  FormInput,
  FormLabel,
  FormTextarea,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { catchError } from "@/lib/utils";
import { useParams } from "next/navigation";
import { FieldErrors } from "react-hook-form";
import type { NewProduct } from "@/db/schema";
import type { FileWithPreview } from "@/types";
import { Button } from "@/components/ui/button";
import { useZodForm } from "@/hooks/use-zod-form";
import { useUploadThing } from "@/lib/uploadthing";
import { IconLoading } from "@/components/ui/icons";
import { newProductValidation } from "@/lib/validations/product";
import { addNewProductAction } from "@/actions/products/add-new-product";
import UploadProductImage from "@/components/dashboard/stores/upload-product-image";

type NewProductInput = z.infer<typeof newProductValidation>;

export default function ProductForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { startUpload } = useUploadThing("imageUploader");
  const routeParams = useParams<{ storeSlug: string }>();
  const [selectedFiles, setSelectedFiles] = useState([] as FileWithPreview[]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useZodForm({
    schema: newProductValidation,
    mode: "onSubmit",
  });

  async function onSubmit(data: NewProductInput) {
    setIsLoading((isLoading) => !isLoading);
    try {
      console.log(data);
      const returnFromUploadedFile = await startUpload(data.image);
      const productData = {
        ...data,
        image: returnFromUploadedFile ? [...returnFromUploadedFile] : [],
      } satisfies Omit<NewProduct, "slug" | "storeId">;

      await addNewProductAction(productData, routeParams.storeSlug);
      toast.success("New product added to store.");
      setSelectedFiles([]);
      reset();
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
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      className="flex flex-col space-y-6"
    >
      <FormField>
        <FormLabel>Product image</FormLabel>
        <UploadProductImage
          isFieldHavingError={Boolean(errors["image"])}
          setValue={setValue}
          setSelectedFiles={setSelectedFiles}
          selectedFiles={selectedFiles}
          isLoading={isLoading}
        />
        <FormMessage>
          Upload product images with maximum 4 images, and 4MB each.
        </FormMessage>
      </FormField>
      <FormField>
        <FormLabel htmlFor="product-name-input">Product Name</FormLabel>
        <FormInput
          aria-invalid={errors["name"] ? "true" : "false"}
          disabled={isLoading}
          aria-disabled={isLoading ? "true" : "false"}
          {...register("name")}
          id="product-name-input"
        />
        <FormMessage>
          This is your product identifier and it must be atleast 5 characters.
          e.g. Cool Skateboard.
        </FormMessage>
      </FormField>
      <FormField>
        <FormLabel>Product Category</FormLabel>
        <Select
          disabled={isLoading}
          aria-disabled={isLoading ? "true" : "false"}
          onValueChange={(value) =>
            setValue(
              "category",
              value as Pick<NewProduct, "category">["category"],
            )
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="clothing">Clothing</SelectItem>
            <SelectItem value="backpack">Backpack</SelectItem>
            <SelectItem value="shoes">Shoes</SelectItem>
          </SelectContent>
        </Select>
        <FormMessage>
          Select your product category. This is required.
        </FormMessage>
      </FormField>
      <FormField>
        <FormLabel htmlFor="product-description-input">
          Product Description
        </FormLabel>
        <FormTextarea
          {...register("description")}
          id="product-description-input"
          aria-invalid={errors["description"] ? "true" : "false"}
          disabled={isLoading}
          aria-disabled={isLoading ? "true" : "false"}
          cols={1}
          rows={1}
          className="resize-none h-36"
        />
        <FormMessage>
          Explain your product in short and precise way.
        </FormMessage>
      </FormField>
      <FormField>
        <FormLabel htmlFor="product-price-input">Product Price</FormLabel>
        <FormInput
          aria-invalid={errors["price"] ? "true" : "false"}
          disabled={isLoading}
          defaultValue={1}
          type="number"
          min={1}
          aria-disabled={isLoading ? "true" : "false"}
          {...register("price")}
          className="w-full"
          id="product-price-input"
        />
        <FormMessage>Input your product price in dollar.</FormMessage>
      </FormField>
      <FormField>
        <FormLabel htmlFor="product-stock-input">Product Stock</FormLabel>
        <FormInput
          aria-invalid={errors["stock"] ? "true" : "false"}
          disabled={isLoading}
          type="number"
          min={1}
          defaultValue={1}
          aria-disabled={isLoading ? "true" : "false"}
          {...register("stock", {
            valueAsNumber: true,
          })}
          className="w-full"
          id="product-stock-input"
        />
        <FormMessage>Input your product stock, minimal value is 1.</FormMessage>
      </FormField>
      <Button
        className="inline-flex gap-2 mt-10"
        aria-disabled={isLoading}
        disabled={isLoading}
        type="submit"
      >
        {isLoading && <IconLoading />}Submit Product
      </Button>
    </Form>
  );
}
