import React from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroSectionClient } from '@/components/HeroSectionClient';
import { PublicCatalogClient } from '@/components/PublicCatalogClient';
import { getProducts } from '@/lib/data-service';

interface HomePageProps {
  searchParams: Promise<{ search?: string; brand?: string; category?: string; filter?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedParams = await searchParams;
  const search = resolvedParams.search || '';
  const brand = resolvedParams.brand || 'ALL';
  const category = resolvedParams.category || 'ALL';
  const filter = resolvedParams.filter || 'ALL';

  const fastMovingOnly = filter === 'FAST_MOVING';
  const initialProducts = await getProducts(search, brand, category, fastMovingOnly);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar initialSearch={search} />

      {/* Hero Breakdown Emergency Banner (Interactive Modal Enabled) */}
      <HeroSectionClient />

      {/* Main Catalog Section */}
      <main className="mx-auto max-w-7xl px-3 sm:px-6 py-6 sm:py-10 flex-1 w-full pb-28 sm:pb-10">
        {/* Filters Header Title */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black uppercase text-slate-900 tracking-tight flex items-center gap-2">
              Katalog Sparepart Utama
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">
              {brand !== 'ALL'
                ? `Daftar sparepart resmi untuk merk ${brand}`
                : search
                ? `Menampilkan hasil pencarian untuk "${search}"`
                : 'Menampilkan daftar komponen ready stock & indent'}
            </p>
          </div>
          <div className="text-[11px] sm:text-xs font-bold text-slate-500">
            Total {initialProducts.length} Part Tersedia
          </div>
        </div>

        {/* Product Catalog & Instant Filter Chips Client Component */}
        <PublicCatalogClient
          initialProducts={initialProducts}
          search={search}
          brand={brand}
          category={category}
          fastMovingOnly={fastMovingOnly}
        />
      </main>
    </div>
  );
}
