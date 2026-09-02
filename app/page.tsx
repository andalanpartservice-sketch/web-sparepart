import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { ProductCard } from '@/components/ProductCard';
import { AIRecommendationWidget } from '@/components/AIRecommendationWidget';
import { getProducts } from '@/lib/data-service';
import { Siren, ShieldCheck, Zap, SlidersHorizontal, ArrowRight } from 'lucide-react';

interface HomePageProps {
  searchParams: Promise<{ search?: string; brand?: string; category?: string }>;
}

const BRANDS = ['ALL', 'Caterpillar', 'Komatsu', 'Toyota', 'TCM', 'Mitsubishi'];
const CATEGORIES = ['ALL', 'Filter', 'Hydraulic', 'Brake', 'Engine', 'Electrical'];

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedParams = await searchParams;
  const search = resolvedParams.search || '';
  const brand = resolvedParams.brand || 'ALL';
  const category = resolvedParams.category || 'ALL';

  const products = await getProducts(search, brand, category);
  const allProducts = await getProducts();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar initialSearch={search} />

      {/* Hero Breakdown Emergency Banner */}
      <section className="bg-slate-900 border-b border-slate-800 text-white relative overflow-hidden py-10 sm:py-14">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#eab308_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Main Headline */}
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-400">
                <Siren className="h-4 w-4 animate-pulse text-amber-500" />
                Layanan Penanganan Unit Breakdown Lapangan 24 Jam
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight">
                Pencarian Kilat Sparepart <br className="hidden sm:inline" />
                <span className="text-amber-500">Alat Berat & Forklift</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-2xl font-normal leading-relaxed">
                Akses instan ribuan part number original & heavy-duty aftermarket untuk Caterpillar, Komatsu, Toyota, TCM, dan Mitsubishi dengan kepastian stok dan opsi bayar transfer/COD/CBD.
              </p>

              <div className="pt-2 flex flex-wrap gap-4 items-center">
                <Link
                  href="/emergency"
                  className="flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-3.5 text-sm font-black uppercase tracking-wider text-slate-950 shadow-lg hover:bg-amber-400 active:scale-95 transition"
                >
                  <Siren className="h-5 w-5" />
                  Kirim Request Darurat
                </Link>
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
                  <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-amber-400" /> Garansi Presisi</span>
                  <span className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-amber-400" /> Pengiriman Fast Track</span>
                </div>
              </div>
            </div>

            {/* Quick Emergency Finder Card */}
            <div className="lg:col-span-4 rounded-xl border border-amber-500/30 bg-slate-950 p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-3">
                <Siren className="h-5 w-5 text-amber-500 animate-bounce" />
                <h3 className="font-extrabold uppercase text-amber-400 text-sm">Unit Mati Di Lapangan?</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Foto nameplate alat berat atau komponen rusak Anda. Tim teknis kami akan mendeteksi part number yang tepat dan mengirimkan penawaran dalam 15 menit.
              </p>
              <Link
                href="/emergency"
                className="w-full flex items-center justify-center gap-2 rounded-lg border border-amber-500/50 bg-amber-500/10 py-3 text-xs font-extrabold uppercase text-amber-400 hover:bg-amber-500 hover:text-slate-950 transition"
              >
                Upload Foto Part Rusak
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 flex-1 w-full">
        {/* Filters Header */}
        <div className="mb-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-2xl font-black uppercase text-slate-900 tracking-tight flex items-center gap-2">
                Katalog Sparepart Utama
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {search ? `Menampilkan hasil pencarian untuk "${search}"` : 'Menampilkan daftar komponen ready stock & indent'}
              </p>
            </div>
            <div className="text-xs font-bold text-slate-500">
              Total {products.length} Part Tersedia
            </div>
          </div>

          {/* Filter Chips */}
          <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            {/* Brands Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase text-slate-500 shrink-0 mr-2 flex items-center gap-1">
                <SlidersHorizontal className="h-3.5 w-3.5 text-amber-600" /> Brand:
              </span>
              {BRANDS.map((b) => {
                const isActive = brand === b;
                const newParams = new URLSearchParams();
                if (search) newParams.set('search', search);
                if (category !== 'ALL') newParams.set('category', category);
                if (b !== 'ALL') newParams.set('brand', b);
                const href = newParams.toString() ? `/?${newParams.toString()}` : '/';

                return (
                  <Link
                    key={b}
                    href={href}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                      isActive
                        ? 'bg-slate-900 text-amber-400 shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {b === 'ALL' ? 'Semua Brand' : b}
                  </Link>
                );
              })}
            </div>

            {/* Categories Filter */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold uppercase text-slate-500 shrink-0 mr-2">Kategori:</span>
              {CATEGORIES.map((c) => {
                const isActive = category === c;
                const newParams = new URLSearchParams();
                if (search) newParams.set('search', search);
                if (brand !== 'ALL') newParams.set('brand', brand);
                if (c !== 'ALL') newParams.set('category', c);
                const href = newParams.toString() ? `/?${newParams.toString()}` : '/';

                return (
                  <Link
                    key={c}
                    href={href}
                    className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
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

          {/* AI Smart Recommendation Box */}
          <AIRecommendationWidget
            currentBrand={brand}
            currentCategory={category}
            allProducts={allProducts}
          />
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
