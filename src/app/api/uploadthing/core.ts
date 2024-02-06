import { createUploadthing, type FileRouter } from "uploadthing/next";
import { currentUser } from "@clerk/nextjs";
import { z } from "zod";

const f = createUploadthing({
  errorFormatter: (err) => {
    return {
      message: err.message,
      zodError: err.cause instanceof z.ZodError ? err.cause.flatten() : null,
    };
  },
});

export const uploadFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 4 } })
    .middleware(async ({ req }) => {
      const isAuthenticated = await currentUser();

      if (!isAuthenticated)
        throw new Error("Unauthorized, please login before proceed");

      return {
        user_id: isAuthenticated.id,
      };
    })
    .onUploadComplete(async (resolver) => {
      console.log(`File url ${resolver.file}`);
    }),
} satisfies FileRouter;

export type UploadFileRouter = typeof uploadFileRouter;
