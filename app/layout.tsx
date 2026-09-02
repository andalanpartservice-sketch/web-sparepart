import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Footer } from "@/components/Footer";
import { WhatsAppFloatingButton } from "@/components/WhatsAppFloatingButton";
import { MobileBottomNav } from "@/components/MobileBottomNav";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0f172a",
};

export const metadata: Metadata = {
  title: "Andalan Part Service | Etalase Catalog Sparepart Alat Berat & Forklift Original",
  description: "Etalase katalog sparepart resmi alat berat (Caterpillar, Komatsu) & forklift (Toyota, TCM, Mitsubishi). Konsultasi stok & penawaran kilat via WhatsApp Sales.",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="flex min-h-screen flex-col bg-slate-50 text-slate-900 antialiased pb-16 sm:pb-0">
        <CartProvider>
          {children}
          <Footer />
          <WhatsAppFloatingButton />
          <MobileBottomNav />
        </CartProvider>
      </body>
    </html>
  );
}
