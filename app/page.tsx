import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { PublicCatalogClient } from '@/components/PublicCatalogClient';
import { getProducts } from '@/lib/data-service';
import { Siren, ShieldCheck, Zap, SlidersHorizontal, ArrowRight, Flame } from 'lucide-react';

interface HomePageProps {
  searchParams: Promise<{ search?: string; brand?: string; category?: string; filter?: string }>;
}

const BRANDS = ['ALL', 'Caterpillar', 'Komatsu', 'Toyota', 'TCM', 'Mitsubishi'];
const CATEGORIES = ['ALL', 'Filter', 'Hydraulic', 'Brake', 'Engine', 'Electrical'];

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

      {/* Hero Breakdown Emergency Banner */}
      <section className="bg-slate-900 border-b border-slate-800 text-white relative overflow-hidden py-3 sm:py-5">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#eab308_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="relative mx-auto max-w-7xl px-3 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-center">
            {/* Main Headline */}
            <div className="lg:col-span-8 space-y-2 sm:space-y-2.5">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold text-amber-400">
                <Siren className="h-3 w-3 sm:h-3.5 sm:w-3.5 animate-pulse text-amber-500" />
                Layanan Penanganan Unit Breakdown Lapangan 24 Jam
              </div>

              <h1 className="text-lg sm:text-xl lg:text-2xl font-black uppercase tracking-tight text-white leading-snug">
                Pencarian Kilat Sparepart <span className="text-amber-500">Alat Berat & Forklift</span>
              </h1>

              <p className="text-[11px] sm:text-xs text-slate-300 max-w-xl font-normal leading-normal">
                Akses instan ribuan part number original & heavy-duty aftermarket Caterpillar, Komatsu, Toyota, TCM, Mitsubishi.
              </p>

              <div className="pt-0.5 flex flex-wrap gap-2.5 items-center">
                <Link
                  href="/emergency"
                  className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 py-2 text-xs font-black uppercase tracking-wider text-slate-950 shadow-md hover:bg-amber-400 active:scale-95 transition"
                >
                  <Siren className="h-3.5 w-3.5" />
                  Kirim Request Darurat
                </Link>
                <div className="flex items-center gap-2.5 text-[10px] sm:text-[11px] font-semibold text-slate-400">
                  <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3 text-amber-400" /> Garansi Presisi</span>
                  <span className="flex items-center gap-1"><Zap className="h-3 w-3 text-amber-400" /> Fast Track</span>
                </div>
              </div>
            </div>

            {/* Quick Emergency Finder Card */}
            <div className="lg:col-span-4 rounded-xl border border-amber-500/30 bg-slate-950 p-3 sm:p-4 shadow-xl">
              <div className="flex items-center gap-1.5 mb-1">
                <Siren className="h-3.5 w-3.5 text-amber-500 animate-bounce" />
                <h3 className="font-extrabold uppercase text-amber-400 text-xs">Unit Mati Di Lapangan?</h3>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 leading-normal mb-2">
                Foto nameplate / komponen rusak. Tim teknis kami merespon penawaran dalam 15 menit.
              </p>
              <Link
                href="/emergency"
                className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-amber-500/50 bg-amber-500/10 py-1.5 text-xs font-extrabold uppercase text-amber-400 hover:bg-amber-500 hover:text-slate-950 transition"
              >
                Upload Foto Part Rusak
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <main className="mx-auto max-w-7xl px-3 sm:px-6 py-6 sm:py-10 flex-1 w-full pb-28 sm:pb-10">
        {/* Filters Header */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
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

          {/* Filter Chips Container */}
          <div className="space-y-3 bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-xs">
            {/* Brands Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar whitespace-nowrap">
              <span className="text-[11px] sm:text-xs font-bold uppercase text-slate-500 shrink-0 mr-1 flex items-center gap-1">
                <SlidersHorizontal className="h-3.5 w-3.5 text-amber-600" /> Brand:
              </span>
              {BRANDS.map((b) => {
                const isActive = brand === b;
                const newParams = new URLSearchParams();
                if (search) newParams.set('search', search);
                if (category !== 'ALL') newParams.set('category', category);
                if (filter !== 'ALL') newParams.set('filter', filter);
                if (b !== 'ALL') newParams.set('brand', b);
                const href = newParams.toString() ? `/?${newParams.toString()}` : '/';

                return (
                  <Link
                    key={b}
                    href={href}
                    className={`rounded-lg px-3 py-1.5 text-[11px] sm:text-xs font-black uppercase tracking-wider shrink-0 transition ${
                      isActive
                        ? 'bg-slate-900 text-amber-400 shadow-xs ring-2 ring-amber-500/50'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {b === 'ALL' ? 'Semua Brand' : b}
                  </Link>
                );
              })}
            </div>

            {/* Quick Filter: Fast Moving vs All */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 overflow-x-auto pb-1 no-scrollbar whitespace-nowrap">
              <span className="text-[11px] sm:text-xs font-bold uppercase text-slate-500 shrink-0 mr-1 flex items-center gap-1">
                <Flame className="h-3.5 w-3.5 text-amber-500" /> Tipe Part:
              </span>

              {/* All Parts */}
              {(() => {
                const isActive = filter === 'ALL';
                const newParams = new URLSearchParams();
                if (search) newParams.set('search', search);
                if (brand !== 'ALL') newParams.set('brand', brand);
                if (category !== 'ALL') newParams.set('category', category);
                const href = newParams.toString() ? `/?${newParams.toString()}` : '/';
                return (
                  <Link
                    href={href}
                    className={`rounded-lg px-3 py-1 text-[11px] sm:text-xs font-bold shrink-0 transition ${
                      isActive
                        ? 'bg-slate-800 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Semua Sparepart
                  </Link>
                );
              })()}

              {/* Fast Moving Only */}
              {(() => {
                const isActive = filter === 'FAST_MOVING';
                const newParams = new URLSearchParams();
                if (search) newParams.set('search', search);
                if (brand !== 'ALL') newParams.set('brand', brand);
                if (category !== 'ALL') newParams.set('category', category);
                newParams.set('filter', 'FAST_MOVING');
                const href = `/?${newParams.toString()}`;
                return (
                  <Link
                    href={href}
                    className={`rounded-lg px-3 py-1 text-[11px] sm:text-xs font-extrabold shrink-0 transition flex items-center gap-1 ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 shadow-xs ring-1 ring-amber-600'
                        : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
                    }`}
                  >
                    🔥 Yang Sering Dipakai (Fast-Moving)
                  </Link>
                );
              })()}
            </div>

            {/* Categories Filter */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 overflow-x-auto pb-1 no-scrollbar whitespace-nowrap">
              <span className="text-[11px] sm:text-xs font-bold uppercase text-slate-500 shrink-0 mr-1">Kategori:</span>
              {CATEGORIES.map((c) => {
                const isActive = category === c;
                const newParams = new URLSearchParams();
                if (search) newParams.set('search', search);
                if (brand !== 'ALL') newParams.set('brand', brand);
                if (filter !== 'ALL') newParams.set('filter', filter);
                if (c !== 'ALL') newParams.set('category', c);
                const href = newParams.toString() ? `/?${newParams.toString()}` : '/';

                return (
                  <Link
                    key={c}
                    href={href}
                    className={`rounded-lg px-3 py-1 text-[11px] sm:text-xs font-bold shrink-0 transition ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {c === 'ALL' ? 'Semua Kategori' : c}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Product Grid Client Component */}
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
