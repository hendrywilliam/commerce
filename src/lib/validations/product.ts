import { z } from "zod";
import { UploadData } from "@/types";

const MAXIMUM_FILE_UPLOAD_IN_BYTES = 1024 * 1024 * 4;
const ALLOWED_FILE_EXTENSION = ["jpeg", "png", "jpg"];

export const newProductValidation = z.object({
  name: z.string().min(5, {
    message: "Product name must be 5 or more characters long.",
  }),
  category: z.enum(["clothing", "backpack", "shoes"], {
    errorMap: (issue, ctx) => ({
      message: "Invalid category value. Please select product category.",
    }),
  }),
  description: z
    .string({
      required_error: "Product description is required.",
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
      message: "Product image is required.",
    })
    .max(4)
    .superRefine((files: UploadData[], ctx) => {
      const isExceedingSizeLimit = files.every(
        (file) => file.size > MAXIMUM_FILE_UPLOAD_IN_BYTES,
      );

      if (isExceedingSizeLimit) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "File size exceeds limit.",
        });
      }

      const isInvalidType = files.every((file) => {
        const fileExtension = file.name.split(".").pop();
        return !ALLOWED_FILE_EXTENSION.includes(fileExtension!);
      });

      if (isInvalidType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Invalid image file format. Only support .jpeg, .jpg and .png.",
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

export const productCommentValidation = z.object({
  productId: z.number({ required_error: "Product ID is required." }),
  orderId: z.number({ required_error: "Order ID is required." }),
  userId: z
    .string({
      required_error: "User ID is required.",
    })
    .min(1, { message: "User ID is required." }),
  content: z
    .string()
    .min(10, { message: "Comment must be at least 10 characters long." }),
  fullname: z.string().min(1, { message: "Fullname is required." }),
  rating: z.number().positive(),
});
