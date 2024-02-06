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
import { toast } from "sonner";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { useUploadThing } from "@/lib/uploadthing";
import { IconLoading } from "@/components/ui/icons";
import type { NewProduct, Product } from "@/db/schema";
import { useParams, useRouter } from "next/navigation";
import { catchError, parse_to_json, OmitAndExtend } from "@/lib/utils";
import { addNewProductAction } from "@/actions/products/add-new-product";
import { update_product_action } from "@/actions/products/update-product";
import type { FileWithPreview, UploadData, ProductFormData } from "@/types";
import UploadProductImage from "@/components/dashboard/stores/upload-product-image";

interface ProductFromProps {
  productStatus: "existing-product" | "new-product";
  initialValues?: Product;
}

const defaultValues = {
  name: "",
  description: "",
  image: [],
  price: "1",
  stock: 1,
  category: "",
} satisfies ProductFormData;

export default function ProductForm({
  productStatus = "new-product",
  initialValues,
}: ProductFromProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { storeSlug } = useParams<{ storeSlug: string }>();
  const [imagesToDelete, setImagesToDelete] = useState([] as UploadData[]);
  const [selectedFiles, setSelectedFiles] = useState([] as FileWithPreview[]);
  const [uploadError, setUploadError] = useState(false);

  const [formValues, setFormValues] = useState<ProductFormData>(
    initialValues ?? defaultValues,
  );

  const { startUpload } = useUploadThing("imageUploader", {
    onUploadError: () => {
      toast.error("Error occured while uploading. Please try again later.");
      setUploadError((uploadError) => !uploadError);
    },
  });

  async function onSubmitData(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (uploadError) return;
    setIsLoading((isLoading) => !isLoading);
    // Add new product
    if (productStatus === "new-product") {
      try {
        const uploadFileResponse = await startUpload(selectedFiles);
        const productData = {
          ...formValues,
          price: String(formValues.price),
          stock: Number(formValues.stock),
          image: uploadFileResponse ? [...uploadFileResponse] : [],
        } as OmitAndExtend<
          NewProduct,
          "image" | "slug",
          { image: UploadData[] }
        >;
        await addNewProductAction(productData, storeSlug);
        toast.success("New product added to store.");
        setSelectedFiles([]);
        setFormValues(defaultValues);
      } catch (err) {
        catchError(err);
      } finally {
        setIsLoading((isLoading) => !isLoading);
      }
    } else {
      // Update existing product
      let uploadedFiles;
      if (!!selectedFiles.length) {
        uploadedFiles = await startUpload(selectedFiles);
      }
      const updatedProductData = {
        ...formValues,
        image: [
          ...parse_to_json<UploadData[]>(formValues.image as string),
          ...(uploadedFiles ? uploadedFiles : []),
        ],
      } as OmitAndExtend<NewProduct, "image", { image: UploadData[] }>;
      try {
        await update_product_action({
          imagesToDelete: !!imagesToDelete.length ? imagesToDelete : [],
          input: updatedProductData,
        });
        toast.success("Product updated successfully.");
        setSelectedFiles([]);
      } catch (error) {
        catchError(error);
      } finally {
        setIsLoading((isLoading) => !isLoading);
      }
    }
  }

  return (
    <Form
      onSubmit={(event) => onSubmitData(event)}
      className="flex flex-col space-y-6"
    >
      <FormField>
        <FormLabel>Product image</FormLabel>
        {productStatus === "existing-product" ? (
          <UploadProductImage
            setSelectedFiles={setSelectedFiles}
            selectedFiles={selectedFiles}
            isLoading={isLoading}
            setImagesToDelete={setImagesToDelete}
            existingImages={parse_to_json<UploadData[]>(
              formValues.image as string,
            )}
            formValues={formValues}
            setFormValues={setFormValues}
          />
        ) : (
          <UploadProductImage
            setSelectedFiles={setSelectedFiles}
            selectedFiles={selectedFiles}
            isLoading={isLoading}
          />
        )}
        <FormMessage>
          Upload product images with maximum 4 images, and 4MB each. Only
          support .jpeg, .jpg and .png.
        </FormMessage>
      </FormField>
      <FormField>
        <FormLabel htmlFor="name">Product Name</FormLabel>
        <FormInput
          id="name"
          name="name"
          disabled={isLoading}
          aria-disabled={isLoading ? "true" : "false"}
          value={formValues.name}
          onChange={(event) =>
            setFormValues((formValues) => {
              return { ...formValues, [event.target.name]: event.target.value };
            })
          }
        />
        <FormMessage>
          This is your product identifier and it must be atleast 5 characters.
          e.g. Cool Skateboard.
        </FormMessage>
      </FormField>
      <FormField>
        <FormLabel htmlFor="product-category">Product Category</FormLabel>
        <Select
          name="category"
          disabled={isLoading}
          aria-disabled={isLoading ? "true" : "false"}
          onValueChange={(value) =>
            setFormValues((formValues) => ({
              ...formValues,
              category: value as NewProduct["category"],
            }))
          }
        >
          <SelectTrigger>
            <SelectValue
              placeholder={
                !!formValues.category ? formValues.category : "Select Category"
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="clothing">clothing</SelectItem>
            <SelectItem value="backpack">backpack</SelectItem>
            <SelectItem value="shoes">shoes</SelectItem>
          </SelectContent>
        </Select>
        <FormMessage>
          Select your product category. This is required.
        </FormMessage>
      </FormField>
      <FormField>
        <FormLabel htmlFor="description">Product Description</FormLabel>
        <FormTextarea
          name="description"
          id="description"
          onChange={(event) =>
            setFormValues((formValues) => ({
              ...formValues,
              [event.target.name]: event.target.value,
            }))
          }
          value={formValues.description as string}
          cols={1}
          rows={1}
          disabled={isLoading}
          className="resize-none h-36"
          aria-disabled={isLoading ? "true" : "false"}
        />
        <FormMessage>
          Explain your product in short and precise way.
        </FormMessage>
      </FormField>
      <FormField>
        <FormLabel htmlFor="price">Product Price</FormLabel>
        <FormInput
          min={1}
          id="price"
          name="price"
          onChange={(event) =>
            setFormValues((formValues) => ({
              ...formValues,
              [event.target.name]: event.target.value,
            }))
          }
          value={Number(formValues.price)}
          type="number"
          className="w-full"
          disabled={isLoading}
          aria-disabled={isLoading ? "true" : "false"}
        />
        <FormMessage>Input your product price in dollar.</FormMessage>
      </FormField>
      <FormField>
        <FormLabel htmlFor="stock">Product Stock</FormLabel>
        <FormInput
          id="stock"
          name="stock"
          disabled={isLoading}
          type="number"
          min={1}
          onChange={(event) =>
            setFormValues((formValues) => ({
              ...formValues,
              [event.target.name]: event.target.value,
            }))
          }
          value={formValues.stock}
          className="w-full"
          aria-disabled={isLoading ? "true" : "false"}
        />
        <FormMessage>Input your product stock, minimal value is 1.</FormMessage>
      </FormField>
      <Button
        className="inline-flex gap-2 mt-10"
        aria-disabled={isLoading}
        disabled={isLoading}
        type="submit"
      >
        {isLoading && <IconLoading />}
        {productStatus === "new-product" ? "Submit Product" : "Update Product"}
      </Button>
    </Form>
  );
}
