import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "EquipPart | Catalog Spare Part Alat Berat & Forklift Emergency",
  description: "Katalog sparepart alat berat (Caterpillar, Komatsu) & forklift (Toyota, TCM, Mitsubishi) dengan fitur pencarian part number kilat dan layanan darurat breakdown.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="flex min-h-screen flex-col bg-slate-50 text-slate-900 antialiased">
        <CartProvider>
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
