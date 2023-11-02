import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Toast from "@/components/toast";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pointaside by hendryw",
  description: "Fictional marketplace by yrdenh",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} text-sm antialiased`}>
          <Toast />
          {children}
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
