'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Flame, Siren, ShoppingCart, MessageSquare } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { getWhatsAppUrl } from '@/lib/utils';
import { EmergencyModal } from './EmergencyModal';

export function MobileBottomNav() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  const adminWa = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '6281234567890';
  const defaultMsg = 'Halo Admin EquipPart, saya ingin berkonsultasi mengenai kebutuhan sparepart forklift / alat berat.';
  const waUrl = getWhatsAppUrl(adminWa, defaultMsg);

  const isHome = pathname === '/';
  const isCart = pathname === '/cart';

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800/90 backdrop-blur-md sm:hidden pb-safe">
        <div className="grid grid-cols-5 h-14 items-center text-[10px] font-bold text-slate-400">
          {/* 1. Katalog */}
          <Link
            href="/"
            className={`flex flex-col items-center justify-center gap-0.5 h-full transition ${
              isHome ? 'text-amber-400 font-extrabold' : 'hover:text-slate-200'
            }`}
          >
            <Home className="h-4 w-4" />
            <span>Katalog</span>
          </Link>

          {/* 2. Fast Moving */}
          <Link
            href="/?filter=FAST_MOVING"
            className="flex flex-col items-center justify-center gap-0.5 h-full hover:text-amber-400 transition"
          >
            <Flame className="h-4 w-4 text-amber-500" />
            <span className="text-amber-400 font-black">Fast Part</span>
          </Link>

          {/* 3. Darurat Breakdown (Center Emergency Button) */}
          <button
            onClick={() => setIsEmergencyModalOpen(true)}
            className="flex flex-col items-center justify-center gap-0.5 h-full text-amber-400 hover:text-amber-300 transition"
          >
            <div className="relative flex items-center justify-center h-8 w-8 rounded-full bg-amber-500 text-slate-950 shadow-md animate-pulse">
              <Siren className="h-4 w-4" />
            </div>
            <span className="text-[9px] font-black uppercase text-amber-400 -mt-0.5">Darurat</span>
          </button>

          {/* 4. List Order WA */}
          <Link
            href="/cart"
            className={`relative flex flex-col items-center justify-center gap-0.5 h-full transition ${
              isCart ? 'text-amber-400 font-extrabold' : 'hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <ShoppingCart className="h-4 w-4" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-black text-slate-950">
                  {totalItems}
                </span>
              )}
            </div>
            <span>List WA</span>
          </Link>

          {/* 5. WA Sales */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-0.5 h-full text-emerald-400 hover:text-emerald-300 transition"
          >
            <MessageSquare className="h-4 w-4 fill-emerald-500/20 text-emerald-400" />
            <span className="font-extrabold text-emerald-400">WA Sales</span>
          </a>
        </div>
      </nav>

      {/* Emergency Modal Triggered from Bottom Bar */}
      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />
    </>
  );
}
