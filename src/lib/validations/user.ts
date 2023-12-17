import { z } from "zod";

export const registerValidation = z
  .object({
    email: z
      .string({
        required_error: "Email is required.",
      })
      .email({
        message: "Invalid email. Please provide a proper email.",
      }),
    password: z
      .string({
        required_error: "Password is required.",
      })
      .regex(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/, {
        message:
          "Password must contains atleast 8 characters, including 1 non numerical character, with a number and an uppercase character.",
      }),
    confirmPassword: z.string({
      required_error: "Confirm Password is required.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password does not match with confirm password.",
    path: ["confirmPassword"],
  });

export const loginValidation = z.object({
  email: z
    .string({
      required_error: "Email is required.",
    })
    .min(1, {
      message: "Please input your email.",
    }),
  password: z
    .string({
      required_error: "Password is required.",
    })
    .min(1, {
      message: "Please input your password.",
    }),
});

export const manageSubscriptionValidation = z.string().min(1, {
  message: "Subscription ID is required.",
});

export type CreateUser = z.infer<typeof registerValidation>;
