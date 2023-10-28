"use client";

import { useDropzone } from "@uploadthing/react/hooks";
import { useCallback } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import type { FileWithPath } from "@uploadthing/react";
import { FileWithPreview } from "@/types";
import { useEffect } from "react";
import type { NewProduct } from "@/db/schema";
import { db } from "@/db/core";
import { products } from "@/db/schema";
import { Dispatch, SetStateAction } from "react";

interface UploadProductImageProps {
  selectedFiles: FileWithPreview[];
  setSelectedFiles: Dispatch<SetStateAction<FileWithPreview[]>>;
  maxFiles?: number;
  accept?: Record<string, string[]>;
  maxSize?: number;
}

export default function UploadProductImage({
  setSelectedFiles,
  selectedFiles,
  maxFiles = 1,
  accept = {
    "image/*": [],
  },
  maxSize = 1024 * 1024 * 5,
}: UploadProductImageProps) {
  const { startUpload } = useUploadThing("imageUploader");

  const onDrop = useCallback(
    (acceptedFile: FileWithPath[]) => {
      const embedPreviewInFileObject = acceptedFile.map((file) => {
        return Object.assign(file, {
          preview: URL.createObjectURL(file),
        });
      });

      setSelectedFiles(embedPreviewInFileObject);
    },
    [setSelectedFiles]
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
    <div className="border border-dashed rounded h-36" {...getRootProps()}>
      <input {...getInputProps()} />
      <div>
        {selectedFiles.length > 0 && (
          <button onClick={() => startUpload(selectedFiles)}>
            Upload {selectedFiles.length} files
          </button>
        )}
      </div>
      <p>Click this or drag your file to start upload.</p>
    </div>
  );
}
