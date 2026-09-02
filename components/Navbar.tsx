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
        <div className="bg-slate-950 px-4 py-1.5 text-center text-[11px] font-medium text-slate-400 border-b border-slate-800/80 flex items-center justify-between">
          <div className="hidden sm:flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-amber-400">
              <ShieldCheck className="h-3.5 w-3.5" /> 100% Guaranteed Heavy Duty Specs
            </span>
            <span className="text-slate-600">|</span>
            <span>Pengiriman Kargo Ekspres Jabodetabek & All Indonesia Site</span>
          </div>
          <div className="flex items-center justify-end w-full sm:w-auto gap-3 text-[11px]">
            <Link href="/admin" className="flex items-center gap-1 text-slate-400 hover:text-amber-400 transition">
              <LayoutDashboard className="h-3.5 w-3.5" /> Portal Admin
            </Link>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
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

          {/* Instant Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl mx-2">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari Part Number, Nama Part, atau Brand..."
                className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2.5 pl-9 sm:pl-10 pr-20 sm:pr-24 text-base sm:text-sm text-slate-100 placeholder-slate-400 font-mono-part focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition shadow-inner"
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
            {/* Emergency Button */}
            <button
              onClick={() => setIsEmergencyModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-amber-500 px-3.5 py-2 text-xs font-black uppercase text-slate-950 shadow-md hover:bg-amber-400 active:scale-95 transition animate-pulse"
            >
              <Siren className="h-4 w-4" />
              <span className="hidden md:inline">Darurat Breakdown</span>
            </button>

            {/* Cart / List Order Link */}
            <Link
              href="/cart"
              className="relative flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-bold text-slate-200 hover:border-amber-500 hover:bg-slate-800 transition"
            >
              <ShoppingCart className="h-4 w-4 text-amber-400" />
              <span className="hidden sm:inline">List Order WA</span>
              {totalItems > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[11px] font-black text-slate-950">
                  {totalItems}
                </span>
              )}
            </Link>
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
