"use client";

import { useDropzone } from "@uploadthing/react/hooks";
import { useCallback, useTransition } from "react";
import type { FileWithPath } from "@uploadthing/react";
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

interface UploadProductImageProps {
  maxFiles?: number;
  maxSize?: number;
  isLoading: boolean;
  isFieldHavingError: boolean;
  accept?: Record<string, string[]>;
  selectedFiles: FileWithPreview[];
  setSelectedFiles: Dispatch<SetStateAction<FileWithPreview[]>>;
  setValue: UseFormSetValue<z.infer<typeof newProductValidation>>;
}

export default function UploadProductImage({
  setValue,
  isLoading,
  maxFiles = 1,
  selectedFiles,
  accept = {
    "image/*": [],
  },
  setSelectedFiles,
  isFieldHavingError,
  maxSize = 1024 * 1024 * 5,
}: UploadProductImageProps) {
  const onDrop = useCallback(
    (acceptedFile: FileWithPath[]) => {
      setValue("image", acceptedFile);
      const embedPreviewInFileObject = acceptedFile.map((file) => {
        return Object.assign(file, {
          preview: URL.createObjectURL(file),
        });
      });
      setSelectedFiles(embedPreviewInFileObject);
    },
    // eslint-disable-next-line
    []
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    maxSize,
  });

  useEffect(() => {
    return () =>
      selectedFiles.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [selectedFiles]);

  return (
    <div
      className="border border-dashed rounded h-44 shadow-sm"
      {...getRootProps()}
    >
      <input
        aria-invalid={isFieldHavingError ? "true" : "false"}
        {...getInputProps()}
      />
      <div className="relative w-full h-full flex flex-col justify-center items-center shadow-sm">
        <IconUpload className="w-6 h-6" />
        {selectedFiles.length > 0 ? (
          <>
            <Button
              variant={"secondary"}
              size={"icon"}
              disabled={isLoading}
              aria-disabled={isLoading ? "true" : "false"}
              className="absolute top-2 right-2 h-6 w-6 z-10"
              onClick={(event) => {
                event.stopPropagation();
                // Reset all value
                setSelectedFiles([]);
                setValue("image", []);
              }}
            >
              <IconTrashCan />
            </Button>
            <Image
              src={selectedFiles[0].preview}
              fill
              alt={selectedFiles[0].name}
              className="object-contain rounded"
            />
          </>
        ) : (
          <p>Click or drag your file here.</p>
        )}
      </div>
    </div>
  );
}
