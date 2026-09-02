'use client';

import React, { useState } from 'react';
import { ShoppingCart, MessageSquare, Plus, Minus } from 'lucide-react';
import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';

interface AddToCartDetailActionsProps {
  product: Product;
  waUrl: string;
}

export function AddToCartDetailActions({ product, waUrl }: AddToCartDetailActionsProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleDecrease = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-xs font-bold uppercase text-slate-500">Jumlah Qty:</span>
        <div className="flex items-center rounded-lg border border-slate-300 bg-slate-50">
          <button
            onClick={handleDecrease}
            className="p-2 text-slate-600 hover:bg-slate-200 rounded-l-lg transition"
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-12 text-center text-sm font-bold text-slate-900">{quantity}</span>
          <button
            onClick={handleIncrease}
            className="p-2 text-slate-600 hover:bg-slate-200 rounded-r-lg transition"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={handleAddToCart}
          className="flex items-center justify-center gap-2 rounded-lg border-2 border-slate-900 bg-white py-3 px-4 font-bold text-slate-900 hover:bg-slate-100 transition shadow-xs"
        >
          <ShoppingCart className="h-4 w-4" />
          + Tambah Ke Keranjang
        </button>

        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 py-3 px-4 font-extrabold uppercase text-white hover:bg-emerald-500 shadow-md transition"
        >
          <MessageSquare className="h-4 w-4" />
          Minta Penawaran Harga via WA
        </a>
      </div>
    </div>
  );
}
