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
      <header className="sticky top-0 z-40 bg-slate-950 border-b border-slate-800 text-white shadow-xl">
        {/* Top Info Bar */}
        <div className="bg-slate-900 border-b border-slate-800/80 px-3 sm:px-6 py-1.5">
          <div className="mx-auto max-w-7xl flex items-center justify-between text-[11px] font-semibold text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-amber-400 font-bold">
                <ShieldCheck className="h-3.5 w-3.5" /> 100% Guaranteed Heavy Duty Specs
              </span>
              <span className="hidden md:inline border-l border-slate-800 pl-4">
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
        <div className="mx-auto max-w-7xl px-3 sm:px-6 py-3 space-y-3">
          {/* Row 1: Brand Logo (PROMINENT & LARGE) + Action Buttons */}
          <div className="flex items-center justify-between gap-4">
            {/* Logo Brand */}
            <Link href="/" className="flex items-center gap-3 sm:gap-4 shrink-0 group">
              {/* eslint-disable-next-html-element-suppression */}
              <img
                src="/logo-mark-dark.png"
                alt="APS Logo"
                className="h-12 sm:h-16 lg:h-20 w-auto object-contain transition group-hover:scale-105"
              />
              <div className="flex flex-col">
                <span className="font-black tracking-tight text-base sm:text-2xl lg:text-3xl leading-none text-white uppercase">
                  ANDALAN <span className="text-amber-500">PART SERVICE</span>
                </span>
                <span className="text-[9px] sm:text-xs font-black tracking-wider text-amber-400 uppercase mt-1">
                  Spare Part Solution For Heavy Equipment & Forklift
                </span>
              </div>
            </Link>

            {/* Top Right Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                onClick={() => setIsEmergencyModalOpen(true)}
                className="flex items-center gap-1.5 sm:gap-2 rounded-xl bg-amber-500 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-black uppercase text-slate-950 shadow-lg hover:bg-amber-400 active:scale-95 transition"
                title="Darurat Breakdown 24 Jam"
              >
                <Siren className="h-4 w-4 sm:h-5 sm:w-5 animate-pulse" />
                <span className="hidden sm:inline">Darurat Breakdown</span>
                <span className="sm:hidden">Darurat</span>
              </button>

              <Link
                href="/cart"
                className="relative flex items-center gap-1.5 sm:gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-slate-200 hover:border-amber-500 hover:bg-slate-800 transition"
              >
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400" />
                <span className="hidden sm:inline">List Order WA</span>
                <span className="sm:hidden">List</span>
                {totalItems > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[11px] font-black text-slate-950">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Row 2: Full Width Dedicated Search Bar */}
          <form onSubmit={handleSearchSubmit} className="w-full">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari Part Number (mis: 1R-0716), Nama Part, atau Brand (Caterpillar, Komatsu, Toyota...)"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 py-2.5 sm:py-3 pl-10 pr-24 text-xs sm:text-sm text-slate-100 placeholder-slate-400 font-mono-part focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition shadow-inner"
              />
              <Search className="absolute left-3.5 top-3 sm:top-3.5 h-4 w-4 text-slate-400" />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 rounded-lg bg-amber-500 px-4 text-xs font-extrabold uppercase text-slate-950 hover:bg-amber-400 transition"
              >
                Cari Part
              </button>
            </div>
          </form>
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
