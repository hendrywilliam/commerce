"use client";

import Image from "next/image";
import { toast } from "sonner";
import { useEffect } from "react";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction } from "react";
import { IconUpload } from "@/components/ui/icons";
import { TrashcanIcon } from "@/components/ui/icons";
import { FileRejection, useDropzone } from "react-dropzone";
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
    "image/jpeg": [],
    "image/png": [],
  },
  setSelectedFiles,
  maxSize = 1024 * 1024 * 4,
  existingImages = [],
  setImagesToDelete,
  setFormValues,
  formValues,
}: UploadProductImageProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
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
    toast.error("Invalid file, Please check your image type or size.");
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
        className="h-44 w-1/4 rounded border border-dashed shadow-sm"
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <div className="relative flex h-full w-full flex-col items-center justify-center shadow-sm">
          <IconUpload className="h-4 w-4" />
          <p className="text-xs">Product Image</p>
        </div>
      </div>
      <p>Preview Images</p>
      <div className="grid grid-cols-4 gap-2" id="preview-images">
        {!!existingImages.length &&
          existingImages.map((existingImage) => (
            <div
              key={existingImage.name}
              className="relative h-44 w-full rounded border shadow-sm"
            >
              <Button
                variant="secondary"
                size="icon"
                disabled={isLoading}
                aria-disabled={isLoading ? "true" : "false"}
                type="button"
                className="absolute right-2 top-2 z-[9] h-6 w-6"
                onClick={() => {
                  const productFilteredImages = formValues!.image.filter(
                    (image) => image.name !== existingImage.name,
                  );
                  setFormValues!((formValues) => ({
                    ...formValues,
                    image:
                      productFilteredImages.length > 0
                        ? productFilteredImages
                        : [],
                  }));
                  setImagesToDelete!((imagesToDelete) => [
                    ...imagesToDelete,
                    existingImage,
                  ]);
                }}
              >
                <TrashcanIcon />
              </Button>
              <Image
                src={existingImage.url}
                fill
                alt={existingImage.name}
                className="rounded object-cover"
              />
            </div>
          ))}
        {!!selectedFiles.length &&
          selectedFiles.map((item, index) => {
            return (
              <div
                key={index}
                className="relative h-44 w-full rounded border shadow-sm"
              >
                <Button
                  variant="secondary"
                  size="icon"
                  disabled={isLoading}
                  aria-disabled={isLoading ? "true" : "false"}
                  type="button"
                  className="absolute right-2 top-2 z-[9] h-6 w-6"
                  onClick={(event) => {
                    event.stopPropagation();
                    URL.revokeObjectURL(item.preview);

                    const filteredImages = selectedFiles.filter(
                      (_, i) => i !== index,
                    ) as FileWithPreview[];

                    setSelectedFiles([...filteredImages]);
                  }}
                >
                  <TrashcanIcon />
                </Button>
                <Image
                  src={item.preview}
                  fill
                  alt={item.name}
                  className="rounded object-cover"
                />
              </div>
            );
          })}
      </div>
    </>
  );
}
