"use client";

import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/ui/icons";

export default function OAuthGoogleButton() {
    return (
        <Button
            className="flex gap-2 items-center w-full"
            onClick={() =>
                window.location.replace(
                    `${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/v1/oauth-login`
                )
            }
        >
            <p>Login with Google</p>
            <GoogleIcon />
        </Button>
    );
}
