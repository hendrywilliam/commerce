import "./globals.css";

import type { Metadata } from "next";
import Toast from "@/components/toast";
// import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import { Inter } from "next/font/google";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "commerce by hendryw",
    description: "A fictional marketplace by hendryw",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        // <ClerkProvider>
        <html lang="en">
            <body className={`${inter.className} antialiased`}>
                <Toast />
                {children}
                <Analytics />
            </body>
        </html>
        // </ClerkProvider>
    );
}
