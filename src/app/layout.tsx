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
  description: "Productos únicos de segunda mano, en buen estado y a excelentes precios.",
  metadataBase: new URL('https://estebanybiankavendensustiliches.com'),
  openGraph: {
    title: "Venta de Garage",
    description: "Productos únicos de segunda mano, en buen estado y a excelentes precios.",
    url: 'https://estebanybiankavendensustiliches.com',
    siteName: 'Venta de Garage',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Venta de Garage - Esteban y Bianka venden sus tiliches',
      }
    ],
    locale: 'es_CR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Venta de Garage",
    description: "Productos únicos de segunda mano, en buen estado y a excelentes precios.",
    images: ['/og.png'],
  },
  icons: {
    icon: '/favicon.svg',
  },
  themeColor: '#FCD34D',
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
