"use client";

import { Form, FormField, FormInput, FormLabel } from "@/components/ui/form";
import UploadProductImage from "@/components/dashboard/upload-product-image";
import { useState } from "react";
import { FileWithPreview } from "@/types";

export default function CreateNewProductForm() {
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);
  return (
    <div>
      <Form>
        <FormField>
          <FormLabel></FormLabel>
          <FormInput />
        </FormField>
      </Form>
      <UploadProductImage
        setSelectedFiles={setSelectedFiles}
        selectedFiles={selectedFiles}
      />
    </div>
  );
}
