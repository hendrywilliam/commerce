"use client";

import { catchError } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useZodForm } from "@/hooks/use-zod-form";
import { IconLoading } from "@/components/ui/icons";
import { registerValidation } from "@/lib/validations/user";
import { Form, FormField, FormInput, FormLabel } from "@/components/ui/form";
import { useAuth } from "@/hooks/use-auth";

export default function SignUpForm() {
    const { registerWithEmail, isLoaded, isLoading } = useAuth();
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
        try {
            await registerWithEmail({
                confirm_password: data.confirmPassword,
                email: data.email,
                fullname: `${data.firstname} ${data.lastname}`,
                password: data.password,
            });
            router.push("/sign-in");
        } catch (error) {
            catchError(errors);
        }
    });

    return (
        <div className="w-[500px] h-max">
            {Object.values(errors)[0] && (
                <p className="text-destructive mb-4">
                    {Object.values(errors)[0].message}
                </p>
            )}
            <Form
                className="flex flex-col gap-4"
                onSubmit={submitRegistration}
                aria-description="Registration Form"
            >
                <FormField>
                    <div className="flex gap-4">
                        <div>
                            <FormLabel htmlFor="firstname">
                                First Name
                            </FormLabel>
                            <FormInput
                                {...register("firstname")}
                                placeholder="Miki"
                                className="w-full"
                            />
                        </div>
                        <div>
                            <FormLabel htmlFor="firstname">Last Name</FormLabel>
                            <FormInput
                                {...register("lastname")}
                                placeholder="Matsubara"
                                className="w-full"
                            />
                        </div>
                    </div>
                </FormField>
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
