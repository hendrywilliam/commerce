"use client";

import { toast } from "sonner";
import { catchError } from "@/lib/utils";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { IconLoading } from "@/components/ui/icons";
import { useCallback, useState, FormEvent } from "react";
import { Form, FormField, FormInput, FormLabel } from "@/components/ui/form";

export default function SignInForm() {
  const [identifier, setIdentifer] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  const submitLogin = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!isLoaded) return;
      setIsLoading(true);
      try {
        const createSession = await signIn.create({
          identifier: identifier.email,
          password: identifier.password,
        });

        if (createSession.status === "complete") {
          setActive({ session: createSession.createdSessionId });
          toast.success("Login succeeded. Redirecting to lobby.");
          router.push("/");
        }
      } catch (error) {
        catchError(error);
      } finally {
        setIsLoading(false);
      }
    },
    // eslint-disable-next-line
    [identifier],
  );

  return (
    <div className="w-full h-max">
      <Form
        className="flex flex-col gap-4"
        onSubmit={(event) => submitLogin(event)}
        aria-description="Registration Form"
      >
        <FormField>
          <FormLabel>Email</FormLabel>
          <FormInput
            onChange={(event) =>
              setIdentifer({
                ...identifier,
                [event.target.name]: event.target.value,
              })
            }
            placeholder="miki_matsubara@gmail.com"
            aria-description="Email input"
            name="email"
          />
        </FormField>
        <FormField>
          <FormLabel>Password</FormLabel>
          <FormInput
            onChange={(event) =>
              setIdentifer({
                ...identifier,
                [event.target.name]: event.target.value,
              })
            }
            aria-description="Password input"
            type="password"
            name="password"
          />
        </FormField>
        <Button
          aria-disabled={isLoading}
          disabled={isLoading}
          className="flex gap-1"
          type="submit"
        >
          {isLoading && <IconLoading />}
          Sign in
        </Button>
      </Form>
    </div>
  );
}
