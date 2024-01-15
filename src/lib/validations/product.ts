import { FileWithPath } from "@uploadthing/react";
import { z } from "zod";

const MAXIMUM_FILE_UPLOAD_IN_BYTES = 1024 * 1024 * 4;
const ALLOWED_FILE_EXTENSION = ["jpg", "jpeg", "png"];

export const newProductValidation = z.object({
  name: z.string().min(5, {
    message: "Product name must be 5 or more characters long.",
  }),
  category: z.enum(["clothing", "backpack", "shoes"], {
    required_error: "Product category is required.",
  }),
  description: z
    .string({
      required_error: "Product description is required",
    })
    .min(1, {
      message: "Product description is required.",
    }),
  price: z
    .string({
      required_error: "Product price is required.",
    })
    .default("0"),
  stock: z
    .number({
      invalid_type_error:
        "Invalid type of data. Please only input numeric value.",
      required_error: "Stock is required.",
    })
    .default(0),
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
          getImageExtension[getImageExtension.length - 1],
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

// Image property value is a string because we cant store plain JSON in db.
export const incomingProductValidation = newProductValidation
  .omit({ image: true })
  .extend({
    image: z.string(),
  })
  .array();

export const updateProductValidation = newProductValidation
  .omit({
    image: true,
  })
  .extend({
    image: z.array(z.any()).min(1, {
      message: "Image is required.",
    }),
  });
