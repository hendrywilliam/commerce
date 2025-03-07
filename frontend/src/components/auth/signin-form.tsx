"use client";

import { toast } from "sonner";
import { catchError } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { IconLoading } from "@/components/ui/icons";
import { useCallback, useState, FormEvent } from "react";
import { Form, FormField, FormInput, FormLabel } from "@/components/ui/form";
import { useAuth } from "@/hooks/use-auth";

export default function SignInForm() {
    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    });
    const router = useRouter();
    const { isLoaded, loginWithEmail, isLoading } = useAuth();

    const submitLogin = useCallback(
        async (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            if (!isLoaded) return;
            try {
                await loginWithEmail(credentials);
                // router.push("/");
            } catch (error) {
                catchError(error);
            }
        },
        [credentials]
    );

    return (
        <div className="h-max w-full">
            <Form
                className="flex flex-col gap-4"
                onSubmit={(event) => submitLogin(event)}
                aria-description="Login Form"
            >
                <FormField>
                    <FormLabel>Email</FormLabel>
                    <FormInput
                        onChange={(event) =>
                            setCredentials({
                                ...credentials,
                                [event.target.name]: event.target.value,
                            })
                        }
                        placeholder="miki_matsubara@gmail.com"
                        aria-description="Email input"
                        name="email"
                        data-testid="email"
                    />
                </FormField>
                <FormField>
                    <FormLabel>Password</FormLabel>
                    <FormInput
                        onChange={(event) =>
                            setCredentials({
                                ...credentials,
                                [event.target.name]: event.target.value,
                            })
                        }
                        aria-description="Password input"
                        type="password"
                        name="password"
                        data-testid="password"
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
