import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Footer } from "@/components/Footer";
import { WhatsAppFloatingButton } from "@/components/WhatsAppFloatingButton";

export const metadata: Metadata = {
  title: "EquipPart | Etalase Catalog Sparepart Alat Berat & Forklift Original",
  description: "Etalase katalog sparepart resmi alat berat (Caterpillar, Komatsu) & forklift (Toyota, TCM, Mitsubishi). Konsultasi stok & penawaran kilat via WhatsApp Sales.",
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
          <WhatsAppFloatingButton />
        </CartProvider>
      </body>
    </html>
  );
}
