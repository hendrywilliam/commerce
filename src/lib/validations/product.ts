import { FileWithPath } from "@uploadthing/react";
import { z } from "zod";

const MAXIMUM_FILE_UPLOAD_IN_BYTES = 1024 * 1024 * 5;
const ALLOWED_FILE_EXTENSION = ["jpg", "jpeg", "png"];

export const newProductValidation = z.object({
  name: z
    .string()
    .min(5, {
      message: "Product name must be 5 or more characters long.",
    })
    .describe("Name for the new product."),
  category: z
    .enum(["clothing", "backpack", "shoes"], {
      required_error: "Product category is required.",
    })
    .describe("Collection of categories for new product."),
  description: z
    .string({
      required_error: "Product description is required",
    })
    .min(1, {
      message: "Product description is required.",
    })
    .describe("A description for the new product, it is self explained."),
  price: z
    .string({
      required_error: "Product price is required.",
    })
    .default("0")
    .describe("Price for the new product"),
  stock: z
    .number({
      invalid_type_error:
        "Invalid type of data. Please only input numeric value.",
      required_error: "Stock is required.",
    })
    .default(0)
    .describe("Stock amount for the new product."),
  image: z
    .array(z.any())
    .min(1, {
      message: "Product image is required",
    })
    .max(1)
    .superRefine((val: FileWithPath[], ctx) => {
      if (val[0]?.size > MAXIMUM_FILE_UPLOAD_IN_BYTES) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "File size exceeds limit",
        });
      }

      const getImageExtension = val[0].name.split(".");
      if (
        !ALLOWED_FILE_EXTENSION.includes(
          getImageExtension[getImageExtension.length - 1]
        )
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Invalid image file format. Only support .jpeg, .jpg and .png",
        });
      }
    }),
});
