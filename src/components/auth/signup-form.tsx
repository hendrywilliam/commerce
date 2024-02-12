"use client";

import { toast } from "sonner";
import { useState } from "react";
import { catchError } from "@/lib/utils";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useZodForm } from "@/hooks/use-zod-form";
import { IconLoading } from "@/components/ui/icons";
import { registerValidation } from "@/lib/validations/user";
import { Form, FormField, FormInput, FormLabel } from "@/components/ui/form";
import { createStripeCustomerAction } from "@/actions/stripe/create-stripe-customer";

export default function SignUpForm() {
  const { isLoaded } = useSignUp();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useZodForm({
    schema: registerValidation,
    mode: "onSubmit",
  });
  const router = useRouter();

  const submitRegistration = handleSubmit(async (data) => {
    if (!isLoaded) return;
    setIsLoading((isLoading) => !isLoading);
    try {
      await createStripeCustomerAction({
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      toast.success("Registration completed. You may log in now.");
      router.push("/sign-in");
    } catch (error) {
      catchError(errors);
    } finally {
      setIsLoading((isLoading) => !isLoading);
    }
  });

  return (
    <div className="w-[500px] h-max">
      {Object.values(errors)[0] && (
        <div className="w-full border-l-2 border-destructive py-4 px-2 mb-4 bg-destructive/20">
          <p className="text-xs">{Object.values(errors)[0].message}</p>
        </div>
      )}
      <Form
        className="flex flex-col gap-4"
        onSubmit={submitRegistration}
        aria-description="Registration Form"
      >
        <FormField>
          <FormLabel htmlFor="email">Email</FormLabel>
          <FormInput
            {...register("email")}
            placeholder="miki_matsubara@gmail.com"
            aria-description="Email input"
            name="email"
            data-testid="email"
          />
        </FormField>
        <FormField>
          <FormLabel htmlFor="password">Password</FormLabel>
          <FormInput
            aria-description="Password input"
            {...register("password")}
            type="password"
            name="password"
            data-testid="password"
          />
        </FormField>
        <FormField>
          <FormLabel>Confirm Password</FormLabel>
          <FormInput
            aria-description="Confirm password input"
            {...register("confirmPassword")}
            type="password"
            name="confirmPassword"
            data-testid="confirmPassword"
          />
        </FormField>
        <Button
          disabled={isLoading}
          aria-disabled={isLoading ? "true" : "false"}
          className="flex gap-1"
          type="submit"
          data-testid="submit"
        >
          {isLoading && <IconLoading />}
          Sign up
        </Button>
      </Form>
    </div>
  );
}
