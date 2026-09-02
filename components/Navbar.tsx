'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingCart, Siren, ShieldCheck, LayoutDashboard } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { EmergencyModal } from './EmergencyModal';

interface NavbarProps {
  initialSearch?: string;
}

export function Navbar({ initialSearch = '' }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const { totalItems } = useCart();
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 text-slate-900 shadow-sm w-full max-w-full overflow-x-hidden">
        {/* Top Info Bar */}
        <div className="bg-slate-950 border-b border-slate-900 px-3 sm:px-6 py-1.5 text-white">
          <div className="mx-auto max-w-7xl flex items-center justify-between text-[10px] sm:text-[11px] font-semibold text-slate-300">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-amber-400 font-bold">
                <ShieldCheck className="h-3.5 w-3.5" /> 100% Guaranteed Heavy Duty Specs
              </span>
              <span className="hidden md:inline border-l border-slate-800 pl-4 text-slate-400">
                Pengiriman Kargo Ekspres Jabodetabek & All Indonesia Site
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/admin" className="flex items-center gap-1 text-slate-300 hover:text-amber-400 transition font-bold">
                <LayoutDashboard className="h-3.5 w-3.5 text-amber-500" /> Portal Admin
              </Link>
            </div>
          </div>
        </div>

        {/* Main Navbar Container */}
        <div className="mx-auto max-w-7xl px-3 sm:px-6 py-2.5 sm:py-3.5 space-y-2 sm:space-y-3">
          {/* Mobile Layout (sm:hidden) */}
          <div className="sm:hidden space-y-2">
            {/* Line 1: Logo Mark + Brand Title */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              {/* eslint-disable-next-html-element-suppression */}
              <img
                src="/logo-mark-clean.png"
                alt="APS Logo Mark"
                className="h-12 w-auto object-contain shrink-0"
              />
              <div className="flex flex-col min-w-0">
                <span className="font-black tracking-tight text-sm leading-none uppercase text-slate-950 truncate">
                  ANDALAN <span className="text-amber-500">PART SERVICE</span>
                </span>
                <span className="text-[9px] font-black tracking-wider text-slate-600 uppercase mt-0.5 truncate">
                  Forklift & Heavy Equipment Parts
                </span>
              </div>
            </Link>

            {/* Line 2: 2 Action Buttons (Grid 2-Columns) */}
            <div className="grid grid-cols-2 gap-2 w-full pt-1">
              <button
                onClick={() => setIsEmergencyModalOpen(true)}
                className="flex items-center justify-center gap-1.5 rounded-lg bg-amber-500 py-2 text-xs font-black uppercase text-slate-950 shadow-sm active:scale-95 transition"
              >
                <Siren className="h-3.5 w-3.5 animate-pulse" />
                <span>Darurat</span>
              </button>

              <Link
                href="/cart"
                className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-slate-900 py-2 text-xs font-bold text-white transition shadow-xs"
              >
                <ShoppingCart className="h-3.5 w-3.5 text-amber-400" />
                <span>List Order WA</span>
                {totalItems > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-black text-slate-950">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>

            {/* Line 3: Full Width Search Bar */}
            <form onSubmit={handleSearchSubmit} className="w-full pt-0.5">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari Part Number, Nama, atau Brand..."
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 py-2 pl-8 pr-20 text-xs text-slate-900 placeholder-slate-400 font-mono-part focus:border-amber-500 focus:outline-none"
                />
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 rounded-md bg-amber-500 px-3 text-[11px] font-extrabold uppercase text-slate-950 active:scale-95 transition"
                >
                  Cari Part
                </button>
              </div>
            </form>
          </div>

          {/* Desktop Layout (hidden sm:block) */}
          <div className="hidden sm:block space-y-3">
            {/* Row 1: Logo Brand + Right Action Buttons */}
            <div className="flex items-center justify-between gap-4">
              <Link href="/" className="flex items-center gap-3 sm:gap-4 shrink-0 group">
                {/* eslint-disable-next-html-element-suppression */}
                <img
                  src="/logo-mark-clean.png"
                  alt="APS Logo Mark"
                  className="h-16 lg:h-20 w-auto object-contain transition group-hover:scale-105"
                />
                <div className="flex flex-col">
                  <span className="font-black tracking-tight text-2xl lg:text-3xl leading-none uppercase text-slate-950">
                    ANDALAN <span className="text-amber-500">PART SERVICE</span>
                  </span>
                  <span className="text-xs font-black tracking-wider text-slate-600 uppercase mt-1">
                    Heavy Equipment & Forklift Parts Solution
                  </span>
                </div>
              </Link>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => setIsEmergencyModalOpen(true)}
                  className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-black uppercase text-slate-950 shadow-md hover:bg-amber-400 active:scale-95 transition"
                  title="Darurat Breakdown 24 Jam"
                >
                  <Siren className="h-5 w-5 animate-pulse" />
                  <span>Darurat Breakdown</span>
                </button>

                <Link
                  href="/cart"
                  className="relative flex items-center gap-2 rounded-xl border border-slate-300 bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800 transition shadow-sm"
                >
                  <ShoppingCart className="h-5 w-5 text-amber-400" />
                  <span>List Order WA</span>
                  {totalItems > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[11px] font-black text-slate-950">
                      {totalItems}
                    </span>
                  )}
                </Link>
              </div>
            </div>

            {/* Row 2: Dedicated Search Bar */}
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari Part Number (mis: 1R-0716), Nama Part, atau Brand (Caterpillar, Komatsu, Toyota...)"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-10 pr-28 text-sm text-slate-900 placeholder-slate-400 font-mono-part focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition shadow-xs"
                />
                <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bottom-1.5 rounded-lg bg-amber-500 px-5 text-xs font-extrabold uppercase text-slate-950 hover:bg-amber-400 transition"
                >
                  Cari Part
                </button>
              </div>
            </form>
          </div>
        </div>
      </header>

      {/* Emergency Request Modal */}
      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />
    </>
  );
}
