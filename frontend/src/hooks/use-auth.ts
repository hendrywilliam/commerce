"use client";

import { useContext, useState } from "react";
import { AuthContext } from "@/contexts/auth-context";
import type {
    User,
    EmailRegistrationCredentials,
    EmailLoginCredentials,
} from "@/types/authentication";
import { toast } from "sonner";
import { catchError } from "@/lib/utils";

type UseAuthReturn = {
    user: User | null;
    isLoaded: boolean;
    isLoading: boolean;
    registerWithEmail: (
        creds: Omit<EmailRegistrationCredentials, "authentication_type">
    ) => Promise<void>;
    loginWithEmail: (creds: EmailLoginCredentials) => Promise<void>;
    isSignedIn: boolean;
};

export function useAuth(): UseAuthReturn {
    const [isLoading, setIsLoading] = useState(false);
    const authCtx = useContext(AuthContext);
    if (!authCtx) {
        throw new Error(
            "The useAuth hook can only be used within AuthContext."
        );
    }
    const { user, isLoaded, isSignedIn } = authCtx;
    const register = async function (
        creds: Omit<EmailRegistrationCredentials, "authentication_type">
    ) {
        try {
            setIsLoading(true);
            const data = await authCtx.registerWithEmail(creds);
            toast.success(data.message);
        } catch (error) {
            catchError(error);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async function (creds: EmailLoginCredentials) {
        try {
            setIsLoading(true);
            const data = await authCtx.loginWithEmail(creds);
            authCtx.setUser(data.data);
            toast.success(data.message);
        } catch (error) {
            catchError(error);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        user,
        isLoaded,
        isLoading,
        registerWithEmail: register,
        loginWithEmail: login,
        isSignedIn,
    };
}
