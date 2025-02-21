import Link from "next/link";
import SignInForm from "@/components/auth/signin-form";
import OAuthGoogleButton from "@/components/auth/oauth-google";

export default function SigninPage() {
    return (
        <div className="flex flex-col space-y-8 items-center justify-center h-screen w-screen">
            <div className="flex flex-col w-full max-w-md space-y-2">
                <SignInForm />
                <p>
                    Dont have an account?{" "}
                    <span className="font-semibold">
                        <Link href="/sign-up">Sign up</Link>
                    </span>
                </p>
            </div>
            <div>
                <OAuthGoogleButton />
            </div>
        </div>
    );
}
