"use client";

import { createContext, useState, useEffect } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import type {
    User,
    EmailLoginCredentials,
    EmailRegistrationCredentials,
} from "@/types/authentication";
import { HTTPServerResponse } from "@/types/server-response";

export const AuthContext = createContext<AuthContextType | null>(null);

type AuthContextType = {
    user: User | null;
    loginWithOAuth: () => void;
    loginWithEmail: (
        credentials: EmailLoginCredentials
    ) => Promise<HTTPServerResponse<User>>;
    registerWithEmail: (
        credentials: Omit<EmailRegistrationCredentials, "authentication_type">
    ) => Promise<HTTPServerResponse<Pick<User, "email">>>;
    setUser: Dispatch<SetStateAction<User | null>>;
    isLoaded: boolean;
};

export default function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const loginWithOAuth = function () {
        if (!window) return;
        window.location.replace(
            `${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/v1/oauth-login`
        );
    };

    const loginWithEmail = async function (credentials: EmailLoginCredentials) {
        try {
            const response = await fetch(
                (process.env.NEXT_PUBLIC_BACKEND_SERVER_URL as string) +
                    "/v1/login",
                {
                    method: "POST",
                    body: JSON.stringify({
                        authentication_type: "REGISTRATION",
                        ...credentials,
                    }),
                    headers: {
                        "content-type": "application/json",
                    },
                    credentials: "include",
                }
            );
            const data = await response.json();
            if (!response.ok) {
                throw new Error((data as HTTPServerResponse<null>).message);
            }
            return data as HTTPServerResponse<User>;
        } catch (error) {
            throw error;
        }
    };

    const registerWithEmail = async function (
        creds: Omit<EmailRegistrationCredentials, "authentication_type">
    ) {
        const response = await fetch(
            (process.env.NEXT_PUBLIC_BACKEND_SERVER_URL as string) +
                "/v1/register",
            {
                method: "POST",
                body: JSON.stringify({
                    ...creds,
                    authentication_type: "REGISTRATION",
                }),
                headers: {
                    "content-type": "application/json",
                },
            }
        );
        const data = await response.json();
        if (!response.ok) {
            throw new Error((data as HTTPServerResponse<null>).message);
        }
        return data as HTTPServerResponse<User>;
    };

    useEffect(() => {
        setIsLoaded(true);
        return () => {};
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                loginWithOAuth,
                loginWithEmail,
                registerWithEmail,
                setUser,
                isLoaded,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
