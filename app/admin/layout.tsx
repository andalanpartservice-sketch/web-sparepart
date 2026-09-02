import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Siren, Package, Home } from 'lucide-react';
import { AdminAuthGuard } from '@/components/AdminAuthGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthGuard>
      <div className="flex min-h-screen flex-col bg-slate-100">
        {/* Admin Top Header */}
        <header className="sticky top-0 z-40 bg-white border-b border-slate-200 text-slate-900 shadow-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/admin" className="flex items-center gap-2.5">
                {/* eslint-disable-next-html-element-suppression */}
                <img
                  src="/logo-mark-clean.png"
                  alt="APS Logo Mark"
                  className="h-12 w-auto object-contain"
                />
                <div className="flex flex-col">
                  <span className="font-black uppercase tracking-tight text-sm text-slate-950">
                    ANDALAN <span className="text-amber-500">PART SERVICE</span>
                  </span>
                  <span className="text-[9px] font-black uppercase text-slate-500">
                    ADMIN PORTAL
                  </span>
                </div>
              </Link>
              <span className="hidden sm:inline text-xs text-slate-400 font-bold border-l border-slate-200 pl-3">
                Control Panel & Warehouse Logistics
              </span>
            </div>

            <nav className="flex items-center gap-2 sm:gap-4 text-xs font-bold">
              <Link href="/admin" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition">
                Overview
              </Link>
              <Link href="/admin/orders" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition">
                <ShoppingBag className="h-3.5 w-3.5 text-amber-600" /> Orders
              </Link>
              <Link href="/admin/inquiries" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition">
                <Siren className="h-3.5 w-3.5 text-amber-600 animate-pulse" /> Inquiries
              </Link>
              <Link href="/admin/products" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition">
                <Package className="h-3.5 w-3.5 text-amber-600" /> Products
              </Link>
              <Link href="/" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-amber-400 hover:bg-slate-800 transition ml-2 font-black">
                <Home className="h-3.5 w-3.5" /> Frontend site
              </Link>
            </nav>
          </div>
        </header>

        {/* Main Content Body */}
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 flex-1 w-full">
          {children}
        </main>
      </div>
    </AdminAuthGuard>
  );
}
