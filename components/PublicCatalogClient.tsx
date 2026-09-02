'use client';

import React, { useState, useEffect } from 'react';
import { Product } from '@/lib/types';
import { ProductCard } from '@/components/ProductCard';
import { getProducts } from '@/lib/data-service';
import { Siren } from 'lucide-react';
import Link from 'next/link';

interface PublicCatalogClientProps {
  initialProducts: Product[];
  search: string;
  brand: string;
  category: string;
  fastMovingOnly: boolean;
}

export function PublicCatalogClient({
  initialProducts,
  search,
  brand,
  category,
  fastMovingOnly,
}: PublicCatalogClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  useEffect(() => {
    getProducts(search, brand, category, fastMovingOnly).then((latest) => {
      if (latest) {
        setProducts(latest);
      }
    });
  }, [search, brand, category, fastMovingOnly]);

  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center my-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600 mb-3">
          <Siren className="h-7 w-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Part Number Tidak Ditemukan</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-5">
          Part number yang Anda cari belum terdaftar di katalog publik kami. Jangan khawatir, kami memiliki stok gudang offline lebih dari 50.000 part number.
        </p>
        <Link
          href="/emergency"
          className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-xs font-extrabold uppercase text-slate-950 hover:bg-amber-400 transition"
        >
          <Siren className="h-4 w-4" />
          Tanyakan via Emergency Finder
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
