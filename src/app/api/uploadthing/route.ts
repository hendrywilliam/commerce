import { baseUrl } from "@/config/site";
import { uploadFileRouter } from "./core";
import { createRouteHandler } from "uploadthing/next";
import * as dotenv from "dotenv";

dotenv.config();

//route handler for upload thing
export const { GET, POST } = createRouteHandler({
  router: uploadFileRouter,
  config: {
    callbackUrl: baseUrl,
    uploadthingId: process.env.UPLOADTHING_APP_ID,
    uploadthingSecret: process.env.UPLOADTHING_SECRET,
  },
});
