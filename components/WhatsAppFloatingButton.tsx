'use client';

import React from 'react';
import { MessageSquare } from 'lucide-react';
import { getWhatsAppUrl } from '@/lib/utils';

export function WhatsAppFloatingButton() {
  const adminWa = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '6281234567890';
  const defaultMsg = 'Halo Admin Andalan Part Service, saya ingin berkonsultasi mengenai kebutuhan sparepart forklift / alat berat dan menanyakan ketersediaan stok.';
  const waUrl = getWhatsAppUrl(adminWa, defaultMsg);

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="hidden sm:flex fixed bottom-5 right-5 z-40 items-center gap-2.5 rounded-full bg-emerald-600 px-4 py-3 text-xs font-black uppercase text-white shadow-2xl hover:bg-emerald-500 hover:scale-105 active:scale-95 transition group"
      title="Hubungi Sales WhatsApp (Respon 5 Menit)"
    >
      <div className="relative">
        <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 fill-white text-emerald-600" />
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
        </span>
      </div>
      <span className="hidden sm:inline font-black tracking-wide">
        Chat Sales WA <span className="text-amber-300 font-extrabold text-[10px] ml-1">(Respon 5 Mnt)</span>
      </span>
    </a>
  );
}
