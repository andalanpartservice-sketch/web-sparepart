import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, ShieldCheck, Truck, Clock } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-800 bg-slate-950 text-slate-400 text-sm">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="bg-white p-2 rounded-xl border border-slate-700 shadow-md inline-block">
              {/* eslint-disable-next-html-element-suppression */}
              <img
                src="/logo.png"
                alt="Andalan Part Service Logo"
                className="h-14 sm:h-16 w-auto object-contain"
              />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Distributor Utama Sparepart Alat Berat & Forklift Original & OEM High Quality. Solusi cepat penanganan unit breakdown lapangan.
            </p>
            <div className="pt-2 text-xs font-semibold text-slate-300">
              © {new Date().getFullYear()} PT Andalan Part Service Indonesia. All rights reserved.
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-extrabold uppercase tracking-wider text-white text-xs mb-4 text-amber-500">
              Kategori Sparepart
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/?category=Filter" className="hover:text-amber-400 transition">Engine & Fuel Filters</Link></li>
              <li><Link href="/?category=Hydraulic" className="hover:text-amber-400 transition">Hydraulic Pump & Seal Kits</Link></li>
              <li><Link href="/?category=Brake" className="hover:text-amber-400 transition">Brake Shoes & Cylinders</Link></li>
              <li><Link href="/?category=Engine" className="hover:text-amber-400 transition">Engine Gaskets & Pistons</Link></li>
              <li><Link href="/?category=Electrical" className="hover:text-amber-400 transition">Starter Motors & Alternators</Link></li>
            </ul>
          </div>

          {/* Service Guarantees */}
          <div>
            <h4 className="font-extrabold uppercase tracking-wider text-white text-xs mb-4 text-amber-500">
              Layanan Utama
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2">
                <ShieldCheck className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Jaminan Presisi Part Number & Cross-Reference</span>
              </li>
              <li className="flex items-start gap-2">
                <Truck className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Pengiriman Kargo Internal & Ekspedisi Lintas Pulau</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Response Emergency Breakdown 24/7 Hotline</span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-extrabold uppercase tracking-wider text-white text-xs mb-4 text-amber-500">
              Kontak Gudang & Admin
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-amber-500" />
                <span>WhatsApp: +62 812-9876-5432</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-amber-500" />
                <span>sales@andalanpartservice.co.id</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Kawasan Logistik Cikarang Dry Port, Blok B4 No. 18, Bekasi - Jawa Barat</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
