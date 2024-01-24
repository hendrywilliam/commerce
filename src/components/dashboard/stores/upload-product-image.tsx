"use client";

import Image from "next/image";
import { toast } from "sonner";
import { useEffect } from "react";
import { useCallback } from "react";
import { parse_to_json } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction } from "react";
import { IconUpload } from "@/components/ui/icons";
import { IconTrashCan } from "@/components/ui/icons";
import { useDropzone } from "@uploadthing/react/hooks";
import type { FileRejection, FileWithPath } from "@uploadthing/react";
import type { FileWithPreview, UploadData, ProductFormData } from "@/types";

interface UploadProductImageProps {
  isLoading: boolean;
  selectedFiles: FileWithPreview[];
  setSelectedFiles: Dispatch<SetStateAction<FileWithPreview[]>>;
  accept?: Record<string, string[]>;
  maxSize?: number;
  maxFiles?: number;
  existingImages?: UploadData[];
  setImagesToDelete?: Dispatch<SetStateAction<UploadData[]>>;
  setFormValues?: Dispatch<SetStateAction<ProductFormData>>;
  formValues?: ProductFormData;
}

export default function UploadProductImage({
  isLoading,
  maxFiles = 4,
  selectedFiles,
  accept = {
    "": [".png", ".jpg", ".jpeg"],
  },
  setSelectedFiles,
  maxSize = 1024 * 1024 * 4,
  existingImages = [],
  setImagesToDelete,
  setFormValues,
  formValues,
}: UploadProductImageProps) {
  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      const embedPreviewFiles = acceptedFiles.map((file) => {
        return Object.assign(file, {
          preview: URL.createObjectURL(file),
        });
      });
      setSelectedFiles(embedPreviewFiles);
    },
    // eslint-disable-next-line
    [],
  );

  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
    toast.error(
      fileRejections[0].errors.map((error) => error.message).join(". "),
    );
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles,
    onDropRejected,
  });

  useEffect(() => {
    return () =>
      selectedFiles.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [selectedFiles]);

  return (
    <>
      <div
        className="border border-dashed w-1/4 rounded h-36 shadow-sm"
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <div className="relative w-full h-full flex flex-col justify-center items-center shadow-sm">
          <IconUpload className="w-4 h-4" />
          <p className="text-xs">Product Image</p>
        </div>
      </div>
      <p>Preview Images</p>
      <div className="grid grid-cols-4 gap-2" id="preview-images">
        {!!existingImages.length &&
          existingImages.map((existingImage) => (
            <div
              key={existingImage.name}
              className="relative w-full h-36 border rounded shadow-sm"
            >
              <Button
                variant="secondary"
                size="icon"
                disabled={isLoading}
                aria-disabled={isLoading ? "true" : "false"}
                type="button"
                className="absolute top-2 right-2 h-6 w-6 z-[9]"
                onClick={() => {
                  const productFilteredImages = parse_to_json<UploadData[]>(
                    formValues!.image as string,
                  ).filter((image) => image.name !== existingImage.name);
                  setFormValues!((formValues) => ({
                    ...formValues,
                    image: JSON.stringify(
                      !!productFilteredImages.length
                        ? productFilteredImages
                        : [],
                    ),
                  }));
                  setImagesToDelete!((imagesToDelete) => [
                    ...imagesToDelete,
                    existingImage,
                  ]);
                }}
              >
                <IconTrashCan />
              </Button>
              <Image
                src={existingImage.url}
                fill
                alt={existingImage.name}
                className="object-cover rounded"
              />
            </div>
          ))}
        {!!selectedFiles.length &&
          selectedFiles.map((item, index) => {
            return (
              <div
                key={index}
                className="relative w-full h-36 border rounded shadow-sm"
              >
                <Button
                  variant="secondary"
                  size="icon"
                  disabled={isLoading}
                  aria-disabled={isLoading ? "true" : "false"}
                  type="button"
                  className="absolute top-2 right-2 h-6 w-6 z-[9]"
                  onClick={(event) => {
                    event.stopPropagation();
                    URL.revokeObjectURL(item.preview);

                    const filteredImages = selectedFiles.filter(
                      (_, i) => i !== index,
                    ) as FileWithPreview[];

                    setSelectedFiles([...filteredImages]);
                  }}
                >
                  <IconTrashCan />
                </Button>
                <Image
                  src={item.preview}
                  fill
                  alt={item.name}
                  className="object-cover rounded"
                />
              </div>
            );
          })}
      </div>
    </>
  );
}
