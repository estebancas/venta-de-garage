import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { CartProvider } from "@/contexts/cart-context";
import { ConfirmProvider } from "@/hooks/use-confirm";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Venta de Garage",
  description: "Online garage sale storefront",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.variable} ${GeistSans.variable} font-sans antialiased`}
      >
        <ConfirmProvider>
          <CartProvider>{children}</CartProvider>
        </ConfirmProvider>
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
