import { createUploadthing, type FileRouter } from "uploadthing/next";
import { currentUser } from "@clerk/nextjs";
import { logger as l } from "@/lib/utils";
const logger = l();

const f = createUploadthing();

export const uploadFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      const isAuthenticated = await currentUser();

      if (!isAuthenticated)
        throw new Error("Unauthorized, please login before proceed");

      return {
        user_id: isAuthenticated.id,
      };
    })
    .onUploadComplete(async (resolver) => {
      logger?.log(`File url ${resolver.file}`);
    }),
} satisfies FileRouter;

export type UploadFileRouter = typeof uploadFileRouter;
