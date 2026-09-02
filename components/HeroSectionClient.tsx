'use client';

import React, { useState } from 'react';
import { Siren, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
import { EmergencyModal } from './EmergencyModal';

export function HeroSectionClient() {
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  return (
    <>
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
                <button
                  type="button"
                  onClick={() => setIsEmergencyModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-xs font-black uppercase tracking-wider text-slate-950 shadow-md hover:bg-amber-400 active:scale-95 transition cursor-pointer"
                >
                  <Siren className="h-3.5 w-3.5 animate-pulse" />
                  Kirim Request Darurat
                </button>
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
              <button
                type="button"
                onClick={() => setIsEmergencyModalOpen(true)}
                className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-amber-500/50 bg-amber-500/10 py-2 text-xs font-extrabold uppercase text-amber-400 hover:bg-amber-500 hover:text-slate-950 transition cursor-pointer"
              >
                Upload Foto Part Rusak
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Emergency Modal */}
      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />
    </>
  );
}
