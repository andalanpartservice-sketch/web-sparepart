'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, MessageSquare, CheckCircle, Clock } from 'lucide-react';
import { Product } from '@/lib/types';
import { getWhatsAppUrl } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const isReady = product.stock_status === 'READY';

  const adminWa = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '6281234567890';
  const waMsg = `Halo Admin EquipPart, saya ingin menanyakan penawaran harga terbaik untuk part number: ${product.part_number} (${product.name}). Apakah stok tersedia?`;
  const waUrl = getWhatsAppUrl(adminWa, waMsg);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div className="group relative flex flex-col rounded-xl border border-slate-200 bg-white shadow-xs hover:shadow-lg transition-all duration-200 overflow-hidden">
      {/* Image Container */}
      <Link href={`/product/${product.id}`} className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden block">
        {/* eslint-disable-next-html-element-suppression */}
        <img
          src={product.image_url || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80'}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />

        {/* Stock & Fast Moving Badges */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 items-start">
          {isReady ? (
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-[11px] font-extrabold uppercase tracking-wide text-white shadow-xs">
              <CheckCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> READY
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-800 px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-[11px] font-bold uppercase tracking-wide text-slate-200 shadow-xs">
              <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-amber-400" /> INDENT
            </span>
          )}

          {product.is_fast_moving && (
            <span className="inline-flex items-center gap-0.5 rounded-md bg-amber-500 px-1.5 py-0.5 text-[8px] sm:text-[10px] font-black uppercase tracking-wider text-slate-950 shadow-xs">
              🔥 FAST PART
            </span>
          )}
        </div>

        {/* Brand Tag */}
        <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 rounded-md bg-slate-900/90 px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-[11px] font-black uppercase text-amber-400 backdrop-blur-xs">
          {product.brand}
        </div>
      </Link>

      {/* Details Container */}
      <div className="flex flex-1 flex-col p-2.5 sm:p-4">
        {/* Category & Part Number */}
        <div className="mb-1 flex items-center justify-between gap-1">
          <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate">
            {product.category}
          </span>
          <span className="font-mono-part text-[10px] sm:text-xs font-black tracking-tight text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 shrink-0">
            {product.part_number}
          </span>
        </div>

        {/* Product Title */}
        <Link href={`/product/${product.id}`} className="group-hover:text-amber-600 transition">
          <h3 className="line-clamp-2 text-xs sm:text-base font-bold text-slate-900 leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Compatibility Chips */}
        <div className="mt-2 flex flex-wrap gap-1">
          {product.compatible_models.slice(0, 2).map((model, idx) => (
            <span
              key={idx}
              className="inline-block text-[9px] sm:text-[10px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded truncate max-w-[110px]"
            >
              {model}
            </span>
          ))}
          {product.compatible_models.length > 2 && (
            <span className="text-[9px] font-medium text-slate-400 self-center">
              +{product.compatible_models.length - 2}
            </span>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1 min-h-2" />

        {/* Price Box & Actions */}
        <div className="mt-2.5 pt-2 border-t border-slate-100">
          <div className="mb-2 flex items-center justify-between bg-amber-50 border border-amber-200/80 rounded-lg p-1.5 sm:p-2.5">
            <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-amber-800">
              Harga
            </span>
            <span className="text-[10px] sm:text-xs font-black text-amber-900">
              Tanya via WA
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-1 rounded-lg border border-slate-300 bg-white py-1.5 sm:py-2 px-1 text-[10px] sm:text-xs font-bold text-slate-800 hover:border-slate-400 hover:bg-slate-50 transition"
            >
              <ShoppingCart className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-slate-600" />
              <span className="hidden xs:inline">+ List</span>
              <span className="xs:hidden">+ List</span>
            </button>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1 rounded-lg bg-emerald-600 py-1.5 sm:py-2 px-1 text-[10px] sm:text-xs font-extrabold uppercase text-white hover:bg-emerald-500 shadow-xs transition"
            >
              <MessageSquare className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span>WA</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
