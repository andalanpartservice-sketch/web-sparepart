'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { useCart } from '@/context/CartContext';
import { getWhatsAppUrl } from '@/lib/utils';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShieldCheck, Siren, MessageSquare } from 'lucide-react';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, totalItems } = useCart();

  const adminWa = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '6281234567890';
  const itemSummaryList = cart.map(it => `- ${it.product.part_number} (${it.product.name}) x${it.quantity}`).join('\n');
  const waMsg = `Halo Admin EquipPart, saya ingin meminta penawaran harga resmi untuk list keranjang sparepart berikut:\n\n${itemSummaryList}\n\nMohon informasi ketersediaan stok & diskon kargo pengiriman. Terima kasih!`;
  const waUrl = getWhatsAppUrl(adminWa, waMsg);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 flex-1 w-full">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl font-black uppercase text-slate-900 tracking-tight flex items-center gap-2">
              <ShoppingCart className="h-6 w-6 text-amber-500" />
              Keranjang Belanja Sparepart
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Tinjau daftar komponen yang akan Anda minta penawaran harganya.
            </p>
          </div>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs font-bold text-rose-600 hover:text-rose-800 transition flex items-center gap-1 self-start sm:self-auto"
            >
              <Trash2 className="h-3.5 w-3.5" /> Kosongkan Keranjang
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center my-8 shadow-xs">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4">
              <ShoppingCart className="h-8 w-8" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Keranjang Belanja Anda Kosong</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-6">
              Belum ada part number yang dimasukkan. Cari sparepart yang Anda butuhkan di katalog kami.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-6 py-3 text-xs font-extrabold uppercase text-white hover:bg-slate-800 transition"
              >
                <ArrowLeft className="h-4 w-4" />
                Jelajahi Katalog
              </Link>
              <Link
                href="/emergency"
                className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-3 text-xs font-extrabold uppercase text-slate-950 hover:bg-amber-400 transition"
              >
                <Siren className="h-4 w-4" />
                Layanan Darurat Breakdown
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-xs"
                >
                  {/* Thumbnail & Info */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="h-20 w-20 shrink-0 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden">
                      {/* eslint-disable-next-html-element-suppression */}
                      <img
                        src={item.product.image_url || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80'}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-slate-900 px-2 py-0.5 text-[10px] font-black uppercase text-amber-400">
                          {item.product.brand}
                        </span>
                        <span className="font-mono-part text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                          {item.product.part_number}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm">{item.product.name}</h3>
                      <div className="text-xs font-bold text-amber-800">
                        Harga: <span className="text-amber-900 font-semibold">Tanya via WhatsApp Sales</span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    {/* Quantity controls */}
                    <div className="flex items-center rounded-lg border border-slate-300 bg-slate-50">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1.5 text-slate-600 hover:bg-slate-200 rounded-l-lg transition"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-9 text-center text-xs font-bold text-slate-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1.5 text-slate-600 hover:bg-slate-200 rounded-r-lg transition"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 transition rounded-lg hover:bg-rose-50"
                      title="Hapus barang"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sticky top-24 space-y-5">
                <h3 className="font-extrabold text-base uppercase text-slate-900 border-b border-slate-100 pb-3">
                  Ringkasan Request
                </h3>

                <div className="space-y-2.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Total Item Part:</span>
                    <span className="font-bold text-slate-900">{totalItems} unit</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Penawaran Harga:</span>
                    <span className="font-bold text-amber-700">Dikirim via WA Sales</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 space-y-3">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-600 py-3.5 text-xs font-extrabold uppercase text-white shadow-md hover:bg-emerald-500 active:scale-[0.99] transition"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Minta Penawaran Harga via WA
                  </a>

                  <Link
                    href="/checkout"
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-amber-500 py-3 text-xs font-black uppercase text-slate-950 hover:bg-amber-400 transition"
                  >
                    Buat Pesanan Resmi (PO / Checkout)
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="flex items-start gap-2.5 rounded-lg bg-slate-50 p-3 text-[11px] text-slate-600">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Tim Sales akan menghitung diskon kuantitas dan biaya ekspedisi kargo khusus untuk lokasi site Anda.</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
