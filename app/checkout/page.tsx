'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { getWhatsAppUrl } from '@/lib/utils';
import { Navbar } from '@/components/Navbar';
import { Send, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, totalItems } = useCart();

  const adminWa = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '6281234567890';
  
  const itemLines = cart.map(
    (it, index) => `${index + 1}. [${it.product.part_number}] ${it.product.name} - ${it.product.brand} (Qty: ${it.quantity} Pcs)`
  ).join('\n');

  const waMsg = `Halo Admin EquipPart, saya ingin mengonfirmasi pesanan sparepart berikut:\n\n📋 DRAFT ORDER / PO:\n${itemLines}\n\nTotal Item: ${totalItems} Pcs\n\nMohon informasi total harga penawaran, stok & pengiriman kargo. Terima kasih!`;
  const waUrl = getWhatsAppUrl(adminWa, waMsg);

  useEffect(() => {
    if (cart.length === 0) {
      router.push('/');
    }
  }, [cart, router]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-12 text-center flex-1">
        <div className="rounded-2xl border border-amber-500/30 bg-white p-8 sm:p-12 shadow-xl space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <Send className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black uppercase text-slate-900">
              Penyelesaian Pesanan via WhatsApp Sales
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
              Seluruh transaksi penawaran harga, verifikasi part number, dan pengiriman kargo dilakukan langsung secara aman melalui <strong>WhatsApp Sales Resmi EquipPart</strong>.
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-left max-w-md mx-auto space-y-2 text-xs">
            <span className="font-bold text-slate-900 block border-b border-slate-200 pb-2">
              Daftar Ringkasan Pesanan ({totalItems} Item):
            </span>
            <ul className="space-y-1.5 text-slate-700 max-h-48 overflow-y-auto">
              {cart.map((it) => (
                <li key={it.product.id} className="flex justify-between">
                  <span>• {it.product.name} ({it.product.part_number})</span>
                  <span className="font-bold text-slate-900">x{it.quantity}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-8 py-4 text-xs font-black uppercase text-white shadow-lg hover:bg-emerald-500 active:scale-95 transition"
            >
              <Send className="h-4 w-4" />
              Lanjutkan ke WhatsApp Sales Sekarang
            </a>

            <Link
              href="/cart"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-4 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke List Order
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
