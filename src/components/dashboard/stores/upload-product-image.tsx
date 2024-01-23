"use client";

import { useDropzone } from "@uploadthing/react/hooks";
import { useCallback, useTransition } from "react";
import type { FileRejection, FileWithPath } from "@uploadthing/react";
import { FileWithPreview } from "@/types";
import { useEffect } from "react";
import { Dispatch, SetStateAction } from "react";
import { IconUpload } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { IconTrashCan } from "@/components/ui/icons";
import { UseFormSetValue } from "react-hook-form";
import { newProductValidation } from "@/lib/validations/product";
import { z } from "zod";
import Image from "next/image";
import { toast } from "sonner";

interface UploadProductImageProps {
  isLoading: boolean;
  isFieldHavingError: boolean;
  selectedFiles: FileWithPreview[];
  setSelectedFiles: Dispatch<SetStateAction<FileWithPreview[]>>;
  setValue: UseFormSetValue<z.infer<typeof newProductValidation>>;
  type?: "upload" | "edit";
  maxFiles?: number;
  maxSize?: number;
  accept?: Record<string, string[]>;
}

export default function UploadProductImage({
  type = "upload",
  setValue,
  isLoading,
  maxFiles = 4,
  selectedFiles,
  accept = {
    "image/*": [],
  },
  setSelectedFiles,
  isFieldHavingError,
  maxSize = 1024 * 1024 * 4,
}: UploadProductImageProps) {
  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setValue("image", acceptedFiles);
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
        <input
          aria-invalid={isFieldHavingError ? "true" : "false"}
          {...getInputProps()}
        />
        <div className="relative w-full h-full flex flex-col justify-center items-center shadow-sm">
          <IconUpload className="w-4 h-4" />
          <p className="text-xs">Product Image</p>
        </div>
      </div>
      <p>Preview Images</p>
      {!!selectedFiles.length && (
        <div className="grid grid-cols-4 gap-2" id="preview-images">
          {selectedFiles.map((item, index) => {
            return (
              <div
                key={index}
                className="relative w-full h-36 border rounded shadow-sm"
              >
                <Button
                  variant={"secondary"}
                  size={"icon"}
                  disabled={isLoading}
                  aria-disabled={isLoading ? "true" : "false"}
                  type="button"
                  className="absolute top-2 right-2 h-6 w-6 z-10"
                  onClick={(event) => {
                    event.stopPropagation();
                    URL.revokeObjectURL(item.preview);

                    const filteredImages = selectedFiles.filter(
                      (_, i) => i !== index,
                    ) as FileWithPreview[];

                    setSelectedFiles([...filteredImages]);
                    setValue("image", [...filteredImages]);
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
      )}
    </>
  );
}
