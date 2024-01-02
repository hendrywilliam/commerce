import { UTApi } from "uploadthing/server";
import { generateReactHelpers } from "@uploadthing/react/hooks";

import type { UploadFileRouter } from "@/app/api/uploadthing/core";

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<UploadFileRouter>();
