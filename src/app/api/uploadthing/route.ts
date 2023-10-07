import { createNextRouteHandler } from "uploadthing/next";
import { uploadFileRouter } from "./core";

//route handler for upload thing
export const { GET, POST } = createNextRouteHandler({
  router: uploadFileRouter,
});
