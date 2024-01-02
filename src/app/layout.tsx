import "./globals.css";

import type { Metadata } from "next";
import Toast from "@/components/toast";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import { GeistSans } from "geist/font/sans";

export const metadata: Metadata = {
  title: "ecremmoce by hendryw",
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
        <body className={`${GeistSans.className} text-sm antialiased`}>
          <Toast />
          {children}
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
