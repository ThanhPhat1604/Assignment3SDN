import "./globals.css";
import { Inter } from "next/font/google";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import { CartProvider } from "@/contexts/CartContext";
import { Toaster } from "react-hot-toast";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "E-commerce CRUD",
  description: "Assignment 2 by Thanh Phat",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        {/* SessionProviderWrapper nên bao toàn bộ context khác để NextAuth hoạt động đúng */}
        <SessionProviderWrapper>
          <CartProvider>
            {children}
            {/* Toaster nên nằm trong provider để có thể hiển thị toast ở bất kỳ page nào */}
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 3500,
                style: {
                  fontSize: "15px",
                  borderRadius: "10px",
                },
              }}
            />
          </CartProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
