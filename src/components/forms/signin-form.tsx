"use client";

import { useZodForm } from "@/hooks/use-zod-form";
import { Form, FormField, FormInput, FormLabel } from "@/components/ui/form";
import { loginValidation } from "@/lib/validations/user";
import { Button } from "@/components/ui/button";
import { IconLoading } from "@/components/ui/icons";
import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { catchError } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SignInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useZodForm({
    schema: loginValidation,
    mode: "onSubmit",
  });
  const [loading, setLoading] = useState(false);
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  const submitLogin = handleSubmit(async (data) => {
    if (!isLoaded) return;
    setLoading(true);
    await signIn
      .create({
        identifier: data.email,
        password: data.password,
      })
      .then((res) => {
        if (res.status === "complete") {
          setActive({ session: res.createdSessionId });
        }
        toast("Success log in. Redirecting to lobby.");
        router.push("/");
      })
      .catch((err) => catchError(err))
      .finally(() => {
        setLoading(false);
      });
  });

  return (
    <div className="w-full h-max">
      {Object.values(errors)[0] && (
        <div className="border-l-2 border-destructive py-4 px-2 mb-4 bg-destructive/20">
          <p className="text-xs">{Object.values(errors)[0].message}</p>
        </div>
      )}
      <Form
        className="flex flex-col gap-4"
        onSubmit={submitLogin}
        aria-description="Registration Form"
      >
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
        <Button className="flex gap-1" type="submit" size="sm">
          {loading && <IconLoading />}
          Sign in
        </Button>
      </Form>
    </div>
  );
}
