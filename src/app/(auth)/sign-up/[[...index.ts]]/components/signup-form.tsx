"use client";

import { useZodForm } from "@/hooks/use-zod-form";
import { registerValidation } from "@/lib/validations/user";
import { Form, FormField, FormInput, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useSignUp } from "@clerk/nextjs";
import { toast } from "sonner";
import { IconLoading } from "@/components/ui/icons";
import { useState } from "react";
import { catchError } from "@/lib/utils";

export default function SignUpForm() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useZodForm({
    schema: registerValidation,
    mode: "onSubmit",
  });

  const submitRegistration = handleSubmit(async (data) => {
    if (!isLoaded) return;
    setLoading(true);
    await signUp
      .create({
        emailAddress: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      })
      .then((res) => {
        if (res.status === "complete") {
          setActive({ session: res.createdSessionId });
        }
        toast("Registration success. You may login now.");
      })
      .catch((err) => catchError(err))
      .finally(() => setLoading(false));
  });

  return (
    <div className="w-full h-max">
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
          <FormLabel>First Name</FormLabel>
          <FormInput
            aria-description="First name input"
            {...register("firstName")}
            type="text"
            name="firstName"
          />
        </FormField>
        <FormField>
          <FormLabel>Last Name</FormLabel>
          <FormInput
            aria-description="Last name input"
            {...register("lastName")}
            type="text"
            name="lastName"
          />
        </FormField>
        <FormField>
          <FormLabel>Email</FormLabel>
          <FormInput
            {...register("email")}
            placeholder="casey_stoner27@gmail.com"
            aria-description="Email input"
            name="email"
          />
        </FormField>
        <FormField>
          <FormLabel>Password</FormLabel>
          <FormInput
            aria-description="Password input"
            {...register("password")}
            type="password"
            name="password"
          />
        </FormField>
        <FormField>
          <FormLabel>Confirm Password</FormLabel>
          <FormInput
            aria-description="Confirm password input"
            {...register("confirmPassword")}
            type="password"
            name="confirmPassword"
          />
        </FormField>
        <p className="text-xs text-gray-600">
          By registering, you agree to processing your personal data by
          twopointone
        </p>
        <Button className="flex gap-1" type="submit" size="sm">
          {loading && <IconLoading />}
          Sign up
        </Button>
      </Form>
    </div>
  );
}
