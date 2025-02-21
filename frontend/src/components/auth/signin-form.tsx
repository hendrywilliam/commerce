"use client";

import { toast } from "sonner";
import { catchError } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { IconLoading } from "@/components/ui/icons";
import { useCallback, useState, FormEvent } from "react";
import { Form, FormField, FormInput, FormLabel } from "@/components/ui/form";
import { BackendResponse, FailedBackendResponse } from "@/types";

export default function SignInForm() {
    const [identifier, setIdentifer] = useState({
        email: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const submitLogin = useCallback(
        async (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setIsLoading(true);
            try {
                const response = await fetch(
                    (process.env.NEXT_PUBLIC_BACKEND_SERVER_URL as string) +
                        "/v1/login",
                    {
                        method: "POST",
                        body: JSON.stringify({
                            email: identifier.email,
                            password: identifier.password,
                        }),
                        headers: {
                            "content-type": "application/json",
                            credentials: "include",
                        },
                    }
                );
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(
                        `${(data as FailedBackendResponse).error.message} ${data.error?.details?.[0] || ""}`
                    );
                }
                toast.success((data as BackendResponse).data.message);
                // router.replace("/");
            } catch (error) {
                catchError(error);
            } finally {
                setIsLoading(false);
            }
        },
        [identifier]
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
                            setIdentifer({
                                ...identifier,
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
                            setIdentifer({
                                ...identifier,
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
