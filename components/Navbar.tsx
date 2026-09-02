'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingCart, Siren, Wrench, ShieldCheck, LayoutDashboard } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { EmergencyModal } from './EmergencyModal';

interface NavbarProps {
  initialSearch?: string;
}

export function Navbar({ initialSearch = '' }: NavbarProps) {
  const router = useRouter();
  const { totalItems } = useCart();
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

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
      <header className="sticky top-0 z-40 w-full bg-slate-900 border-b border-slate-800 text-slate-100 shadow-md">
        {/* Top Announcement Bar */}
        <div className="bg-slate-950 px-3 sm:px-4 py-1 text-center text-[10px] sm:text-[11px] font-medium text-slate-400 border-b border-slate-800/80 flex items-center justify-between">
          <div className="hidden sm:flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-amber-400">
              <ShieldCheck className="h-3.5 w-3.5" /> 100% Guaranteed Heavy Duty Specs
            </span>
            <span className="text-slate-600">|</span>
            <span>Pengiriman Kargo Ekspres Jabodetabek & All Indonesia Site</span>
          </div>
          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto text-[10px] sm:text-[11px]">
            <span className="sm:hidden text-amber-400 font-bold flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" /> Heavy Duty Specs
            </span>
            <Link href="/admin" className="flex items-center gap-1 text-slate-400 hover:text-amber-400 transition font-bold">
              <LayoutDashboard className="h-3.5 w-3.5" /> Portal Admin
            </Link>
          </div>
        </div>

        {/* Main Navbar Container */}
        <div className="mx-auto max-w-7xl px-3 sm:px-6 py-2.5 sm:py-3.5">
          {/* Mobile Layout (Stack Top Row & Search Row) */}
          <div className="sm:hidden space-y-2">
            {/* Top Row: Logo + Right Action Buttons */}
            <div className="flex items-center justify-between gap-2">
              <Link href="/" className="flex items-center gap-2 shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-slate-950 font-black shadow-md">
                  <Wrench className="h-4 w-4 stroke-[2.5]" />
                </div>
                <div>
                  <span className="block font-black tracking-tight text-base leading-none uppercase text-white">
                    EQUIP<span className="text-amber-500">PART</span>
                  </span>
                  <span className="block text-[9px] font-bold tracking-wider text-slate-400 uppercase">
                    Sparepart Forklift & Alat Berat
                  </span>
                </div>
              </Link>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setIsEmergencyModalOpen(true)}
                  className="flex items-center gap-1 rounded-lg bg-amber-500 px-2.5 py-1.5 text-[10px] font-black uppercase text-slate-950 shadow-md active:scale-95 transition"
                  title="Darurat Breakdown"
                >
                  <Siren className="h-3.5 w-3.5" />
                  <span>Darurat</span>
                </button>

                <Link
                  href="/cart"
                  className="relative flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-[10px] font-bold text-slate-200"
                >
                  <ShoppingCart className="h-3.5 w-3.5 text-amber-400" />
                  <span>List</span>
                  {totalItems > 0 && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-black text-slate-950">
                      {totalItems}
                    </span>
                  )}
                </Link>
              </div>
            </div>

            {/* Bottom Row: Full Width Search Input */}
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari Part Number, Nama, atau Brand..."
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2 pl-8 pr-16 text-sm text-slate-100 placeholder-slate-400 font-mono-part focus:border-amber-500 focus:outline-none"
                />
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 rounded-md bg-amber-500 px-3 text-[11px] font-extrabold uppercase text-slate-950 hover:bg-amber-400 transition"
                >
                  Cari
                </button>
              </div>
            </form>
          </div>

          {/* Desktop Layout (1 Row) */}
          <div className="hidden sm:flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500 text-slate-950 font-black shadow-md group-hover:bg-amber-400 transition">
                <Wrench className="h-6 w-6 stroke-[2.5]" />
              </div>
              <div>
                <span className="block font-black tracking-tight text-lg leading-none uppercase text-white">
                  EQUIP<span className="text-amber-500">PART</span>
                </span>
                <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  Heavy Equipment & Forklift
                </span>
              </div>
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl mx-2">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari Part Number, Nama Part, atau Brand..."
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-24 text-sm text-slate-100 placeholder-slate-400 font-mono-part focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition shadow-inner"
                />
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bottom-1.5 rounded-md bg-amber-500 px-3 text-xs font-extrabold uppercase text-slate-950 hover:bg-amber-400 transition"
                >
                  Cari
                </button>
              </div>
            </form>

            {/* Right Actions */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setIsEmergencyModalOpen(true)}
                className="flex items-center gap-2 rounded-lg bg-amber-500 px-3.5 py-2 text-xs font-black uppercase text-slate-950 shadow-md hover:bg-amber-400 active:scale-95 transition animate-pulse"
              >
                <Siren className="h-4 w-4" />
                <span>Darurat Breakdown</span>
              </button>

              <Link
                href="/cart"
                className="relative flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-bold text-slate-200 hover:border-amber-500 hover:bg-slate-800 transition"
              >
                <ShoppingCart className="h-4 w-4 text-amber-400" />
                <span>List Order WA</span>
                {totalItems > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[11px] font-black text-slate-950">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Emergency Modal */}
      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />
    </>
  );
}
