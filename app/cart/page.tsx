'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { useCart } from '@/context/CartContext';
import { getWhatsAppUrl } from '@/lib/utils';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, ShieldCheck, Siren, MessageSquare, Send, Building2, MapPin } from 'lucide-react';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, totalItems } = useCart();
  const [customerName, setCustomerName] = useState('');
  const [location, setLocation] = useState('');

  const adminWa = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '6281234567890';
  
  const itemLines = cart.map(
    (it, index) => `${index + 1}. [${it.product.part_number}] ${it.product.name} - ${it.product.brand} (Qty: ${it.quantity} Pcs)`
  ).join('\n');

  const customerDetail = customerName ? `\n👤 Pemesan/PT: ${customerName}${location ? `\n📍 Lokasi Site/KOTA: ${location}` : ''}\n` : '';

  const waMsg = `Halo Admin EquipPart, saya ingin meminta penawaran resmi & ketersediaan stok untuk list sparepart berikut:${customerDetail}\n📋 DAFTAR ORDER:\n${itemLines}\n\nTotal Item: ${totalItems} Pcs\n\nMohon info total harga penawaran + estimasi kargo pengiriman. Terima kasih!`;
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
              Etalase List Order (Draft PO)
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Kumpulkan daftar part number yang Anda butuhkan lalu kirimkan langsung ke WhatsApp Sales untuk penawaran harga & stok.
            </p>
          </div>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs font-bold text-rose-600 hover:text-rose-800 transition flex items-center gap-1 self-start sm:self-auto"
            >
              <Trash2 className="h-3.5 w-3.5" /> Kosongkan List
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center my-8 shadow-xs">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4">
              <ShoppingCart className="h-8 w-8" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">List Order Anda Masih Kosong</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-6">
              Belum ada part number yang dimasukkan. Cari sparepart yang Anda butuhkan di etalase katalog toko kami.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-6 py-3 text-xs font-extrabold uppercase text-white hover:bg-slate-800 transition"
              >
                <ArrowLeft className="h-4 w-4" />
                Jelajahi Etalase Catalog
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
                      <div className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>Harga & Diskon Kuantitas: <strong>Dikonfirmasi via WA Sales</strong></span>
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
                      title="Hapus dari list"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-4">
              <div className="rounded-2xl border border-amber-500/30 bg-white p-6 shadow-md sticky top-24 space-y-4">
                <h3 className="font-extrabold text-base uppercase text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
                  <span>Kirim Pesanan ke WA</span>
                  <span className="text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full font-bold">Fast Response</span>
                </h3>

                {/* Optional Customer Info */}
                <div className="space-y-3 pt-1 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nama Pemesan / PT (Opsional)</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="mis: Bpk. Heru / PT. Trans Logistik"
                        className="w-full rounded-lg border border-slate-300 py-2 pl-8 pr-3 text-xs focus:border-amber-500 focus:outline-none"
                      />
                      <Building2 className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Lokasi Site / Kota Pengiriman (Opsional)</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="mis: Cikarang / Site Samarinda"
                        className="w-full rounded-lg border border-slate-300 py-2 pl-8 pr-3 text-xs focus:border-amber-500 focus:outline-none"
                      />
                      <MapPin className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                  <div className="flex justify-between">
                    <span>Total Jenis Sparepart:</span>
                    <span className="font-bold text-slate-900">{cart.length} item</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Quantity:</span>
                    <span className="font-bold text-slate-900">{totalItems} Pcs</span>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-4 text-xs font-black uppercase text-white shadow-lg hover:bg-emerald-500 active:scale-[0.99] transition"
                  >
                    <Send className="h-4 w-4" />
                    Kirim Draf PO ke WA Sales Toko
                  </a>
                </div>

                <div className="flex items-start gap-2.5 rounded-lg bg-amber-50/80 border border-amber-200 p-3 text-[11px] text-amber-950">
                  <ShieldCheck className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>Tim Sales kami akan memverifikasi part number, memberikan harga terbaik, dan estimasi kargo dalam 5-15 menit.</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
