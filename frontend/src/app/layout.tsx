import "./globals.css";

import type { Metadata } from "next";
import Toast from "@/components/toast";
import AuthProvider from "@/contexts/auth-context";
import { Analytics } from "@vercel/analytics/react";
import { Inter } from "next/font/google";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "e-commerce",
    description: "A fictional marketplace where you can buy and sell goods.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider>
            <html lang="en">
                <body className={`${inter.className} antialiased`}>
                    <Toast />
                    {children}
                    <Analytics />
                </body>
            </html>
        </AuthProvider>
    );
}
