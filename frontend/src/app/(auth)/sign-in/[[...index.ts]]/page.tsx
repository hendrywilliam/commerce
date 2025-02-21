import Link from "next/link";
import SignInForm from "@/components/auth/signin-form";
import OAuthGoogleButton from "@/components/auth/oauth-google";

export default function SigninPage() {
    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen">
            <div className="flex flex-col w-full max-w-md space-y-4">
                <div>
                    <h1 className="text-2xl font-bold">Login to Commerce</h1>
                    <p>
                        Dont have an account?{" "}
                        <span className="font-semibold">
                            <Link href="/sign-up">Sign up</Link>
                        </span>
                    </p>
                </div>
                <SignInForm />
                <div className="flex justify-between items-center w-full">
                    <div className="w-full border-t h-0"></div>
                    <p className="mx-4">OR</p>
                    <div className="w-full border-t h-0"></div>
                </div>
                <div>
                    <OAuthGoogleButton />
                </div>
            </div>
        </div>
    );
}
