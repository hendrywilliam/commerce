import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Toast from "@/components/toast";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pointaside",
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
        <body className={`${inter.className} text-sm`}>
          <Toast />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
