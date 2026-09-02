'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { Product } from '@/lib/types';
import { ProductCard } from '@/components/ProductCard';
import { getProducts } from '@/lib/data-service';
import { Siren, SlidersHorizontal, Flame } from 'lucide-react';
import Link from 'next/link';

interface PublicCatalogClientProps {
  initialProducts: Product[];
  search: string;
  brand: string;
  category: string;
  fastMovingOnly: boolean;
}

const BRANDS = ['ALL', 'Caterpillar', 'Komatsu', 'Toyota', 'TCM', 'Mitsubishi'];
const CATEGORIES = ['ALL', 'Filter', 'Hydraulic', 'Brake', 'Engine', 'Electrical'];

export function PublicCatalogClient({
  initialProducts,
  search: initialSearch,
  brand: initialBrand,
  category: initialCategory,
  fastMovingOnly: initialFastMoving,
}: PublicCatalogClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selectedBrand, setSelectedBrand] = useState<string>(initialBrand);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedFilter, setSelectedFilter] = useState<string>(initialFastMoving ? 'FAST_MOVING' : 'ALL');
  const [isPending, startTransition] = useTransition();

  // Sync state if initial props change
  useEffect(() => {
    setSelectedBrand(initialBrand);
    setSelectedCategory(initialCategory);
    setSelectedFilter(initialFastMoving ? 'FAST_MOVING' : 'ALL');
  }, [initialBrand, initialCategory, initialFastMoving]);

  // Load products whenever filters change
  useEffect(() => {
    const isFastMoving = selectedFilter === 'FAST_MOVING';
    getProducts(initialSearch, selectedBrand, selectedCategory, isFastMoving).then((latest) => {
      if (latest) {
        setProducts(latest);
      }
    });
  }, [initialSearch, selectedBrand, selectedCategory, selectedFilter]);

  const handleBrandClick = (b: string) => {
    startTransition(() => {
      setSelectedBrand(b);
      const newParams = new URLSearchParams(window.location.search);
      if (b === 'ALL') newParams.delete('brand');
      else newParams.set('brand', b);
      const newUrl = newParams.toString() ? `/?${newParams.toString()}` : '/';
      window.history.replaceState(null, '', newUrl);
    });
  };

  const handleFilterClick = (f: string) => {
    startTransition(() => {
      setSelectedFilter(f);
      const newParams = new URLSearchParams(window.location.search);
      if (f === 'ALL') newParams.delete('filter');
      else newParams.set('filter', f);
      const newUrl = newParams.toString() ? `/?${newParams.toString()}` : '/';
      window.history.replaceState(null, '', newUrl);
    });
  };

  const handleCategoryClick = (c: string) => {
    startTransition(() => {
      setSelectedCategory(c);
      const newParams = new URLSearchParams(window.location.search);
      if (c === 'ALL') newParams.delete('category');
      else newParams.set('category', c);
      const newUrl = newParams.toString() ? `/?${newParams.toString()}` : '/';
      window.history.replaceState(null, '', newUrl);
    });
  };

  return (
    <div className="space-y-6">
      {/* Filter Chips Bar (INSTANT CLIENT RESPONSE 0ms) */}
      <div className="space-y-3 bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-xs">
        {/* Brands Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar whitespace-nowrap">
          <span className="text-[11px] sm:text-xs font-bold uppercase text-slate-500 shrink-0 mr-1 flex items-center gap-1">
            <SlidersHorizontal className="h-3.5 w-3.5 text-amber-600" /> Brand:
          </span>
          {BRANDS.map((b) => {
            const isActive = selectedBrand === b;
            return (
              <button
                key={b}
                type="button"
                onClick={() => handleBrandClick(b)}
                className={`rounded-lg px-3 py-1.5 text-[11px] sm:text-xs font-black uppercase tracking-wider shrink-0 transition-all duration-150 active:scale-95 touch-manipulation cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-amber-400 shadow-xs ring-2 ring-amber-500/50'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {b === 'ALL' ? 'Semua Brand' : b}
              </button>
            );
          })}
        </div>

        {/* Quick Filter: Fast Moving vs All */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 overflow-x-auto pb-1 no-scrollbar whitespace-nowrap">
          <span className="text-[11px] sm:text-xs font-bold uppercase text-slate-500 shrink-0 mr-1 flex items-center gap-1">
            <Flame className="h-3.5 w-3.5 text-amber-500" /> Tipe Part:
          </span>

          <button
            type="button"
            onClick={() => handleFilterClick('ALL')}
            className={`rounded-lg px-3 py-1 text-[11px] sm:text-xs font-bold shrink-0 transition-all duration-150 active:scale-95 touch-manipulation cursor-pointer ${
              selectedFilter === 'ALL'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua Sparepart
          </button>

          <button
            type="button"
            onClick={() => handleFilterClick('FAST_MOVING')}
            className={`rounded-lg px-3 py-1 text-[11px] sm:text-xs font-extrabold shrink-0 transition-all duration-150 active:scale-95 touch-manipulation cursor-pointer flex items-center gap-1 ${
              selectedFilter === 'FAST_MOVING'
                ? 'bg-amber-500 text-slate-950 shadow-xs ring-1 ring-amber-600 font-black'
                : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            🔥 Yang Sering Dipakai (Fast-Moving)
          </button>
        </div>

        {/* Categories Filter */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 overflow-x-auto pb-1 no-scrollbar whitespace-nowrap">
          <span className="text-[11px] sm:text-xs font-bold uppercase text-slate-500 shrink-0 mr-1">Kategori:</span>
          {CATEGORIES.map((c) => {
            const isActive = selectedCategory === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => handleCategoryClick(c)}
                className={`rounded-lg px-3 py-1 text-[11px] sm:text-xs font-bold shrink-0 transition-all duration-150 active:scale-95 touch-manipulation cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-xs font-black'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c === 'ALL' ? 'Semua Kategori' : c}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Grid / Empty State */}
      {products.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 sm:p-12 text-center my-4">
          <div className="mx-auto flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600 mb-3">
            <Siren className="h-6 w-6 sm:h-7 sm:w-7" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">Part Number Tidak Ditemukan</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-5">
            Part number yang Anda cari belum terdaftar di katalog publik kami. Kami memiliki stok gudang offline lebih dari 50.000 part number.
          </p>
          <Link
            href="/emergency"
            className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 sm:px-5 py-2.5 text-xs font-extrabold uppercase text-slate-950 hover:bg-amber-400 transition"
          >
            <Siren className="h-4 w-4" />
            Tanyakan via Emergency Finder
          </Link>
        </div>
      ) : (
        <div className={`grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 transition-opacity duration-150 ${isPending ? 'opacity-60' : 'opacity-100'}`}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
