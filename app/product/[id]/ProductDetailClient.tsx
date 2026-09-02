'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Product } from '@/lib/types';
import { getProductByIdOrPartNumber } from '@/lib/data-service';
import { getWhatsAppUrl } from '@/lib/utils';
import { CheckCircle, Clock, ShieldCheck, ArrowLeft, Wrench, MessageSquare, Flame } from 'lucide-react';
import { AddToCartDetailActions } from './AddToCartDetailActions';

interface ProductDetailClientProps {
  initialProduct: Product;
  id: string;
}

export function ProductDetailClient({ initialProduct, id }: ProductDetailClientProps) {
  const [product, setProduct] = useState<Product>(initialProduct);

  useEffect(() => {
    getProductByIdOrPartNumber(id).then((latest) => {
      if (latest) {
        setProduct(latest);
      }
    });
  }, [id]);

  const isReady = product.stock_status === 'READY';
  const adminWa = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '6281234567890';
  const waMsg = `Halo Admin EquipPart, saya ingin menanyakan penawaran harga terbaik untuk part number: ${product.part_number} (${product.name}). Mohon info stok & diskon quantity. Terima kasih!`;
  const waUrl = getWhatsAppUrl(adminWa, waMsg);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="mx-auto max-w-7xl px-3 sm:px-6 py-4 sm:py-8 flex-1 w-full pb-28 sm:pb-8">
        {/* Breadcrumb / Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-amber-600 transition"
          >
            <ArrowLeft className="h-4 w-4" /> Kembali ke Katalog Sparepart
          </Link>
        </div>

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          {/* Product Image Column */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-4/3 w-full rounded-xl bg-slate-100 overflow-hidden border border-slate-200">
              {/* eslint-disable-next-html-element-suppression */}
              <img
                src={product.image_url || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80'}
                alt={product.name}
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start">
                {isReady ? (
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-extrabold uppercase text-white shadow-md">
                    <CheckCircle className="h-4 w-4" /> READY STOCK
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-800 px-3 py-1.5 text-xs font-bold uppercase text-slate-200 shadow-md">
                    <Clock className="h-4 w-4 text-amber-400" /> INDENT 7 HARI
                  </span>
                )}

                {product.is_fast_moving && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-amber-500 px-2.5 py-1 text-[11px] font-black uppercase tracking-wider text-slate-950 shadow-md">
                    <Flame className="h-3.5 w-3.5 fill-slate-950 text-slate-950" /> FAST MOVING
                  </span>
                )}
              </div>
            </div>

            {/* Technical Service Note */}
            <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-50/60 p-4 text-slate-800 text-xs">
              <ShieldCheck className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-slate-900 mb-0.5">Garansi Kesesuaian Part Number</span>
                <span>Pastikan part number lama Anda sesuai dengan <strong>{product.part_number}</strong>. Tim teknis kami siap memverifikasi nomor seri unit Anda via WhatsApp.</span>
              </div>
            </div>
          </div>

          {/* Product Specs Column */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div>
              {/* Brand & Category */}
              <div className="flex items-center gap-3 mb-2">
                <span className="rounded-md bg-slate-900 px-3 py-1 text-xs font-black uppercase text-amber-400">
                  {product.brand}
                </span>
                <span className="text-xs font-bold uppercase text-slate-400">
                  {product.category}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mb-2">
                {product.name}
              </h1>

              {/* Part Number Badge */}
              <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-slate-100 border border-slate-200 px-3 py-1.5">
                <span className="text-xs font-bold uppercase text-slate-500">PART NUMBER:</span>
                <span className="font-mono-part text-sm font-black text-slate-900 tracking-wider">
                  {product.part_number}
                </span>
              </div>

              {/* WhatsApp Price Box */}
              <div className="my-4 rounded-xl bg-amber-50/80 border border-amber-300 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold uppercase text-amber-800 block mb-0.5">Informasi Penawaran Harga</span>
                  <span className="text-lg font-black text-amber-950 block">Hubungi Sales via WhatsApp</span>
                  <span className="text-[11px] text-amber-900/80 block mt-0.5">Harga menyesuaikan kuantitas pemesanan & diskon kargo site</span>
                </div>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-xs font-extrabold uppercase text-white shadow-md hover:bg-emerald-500 transition shrink-0"
                >
                  <MessageSquare className="h-4 w-4" />
                  Chat Sales WA
                </a>
              </div>

              {/* Compatible Models */}
              <div className="space-y-2 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Wrench className="h-4 w-4 text-amber-600" /> Model Alat Berat / Forklift Kompatibel:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {product.compatible_models.map((model, idx) => (
                    <span
                      key={idx}
                      className="rounded-md bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-bold text-slate-800"
                    >
                      {model}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5 text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-900 uppercase block">Spesifikasi Teknis & Deskripsi:</span>
                <p>{product.description}</p>
              </div>
            </div>

            {/* Client Add to Cart Actions */}
            <div className="pt-4 border-t border-slate-200">
              <AddToCartDetailActions product={product} waUrl={waUrl} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
