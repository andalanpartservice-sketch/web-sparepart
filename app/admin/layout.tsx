import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Siren, Package, Home } from 'lucide-react';
import { AdminAuthGuard } from '@/components/AdminAuthGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthGuard>
      <div className="flex min-h-screen flex-col bg-slate-100">
        {/* Admin Top Header */}
        <header className="sticky top-0 z-40 bg-slate-950 border-b border-slate-800 text-white shadow-md">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/admin" className="flex items-center gap-2.5">
                <div className="bg-white rounded-lg p-1 border-2 border-amber-500/60 shadow-xs flex items-center justify-center h-10 w-10 shrink-0">
                  {/* eslint-disable-next-html-element-suppression */}
                  <img
                    src="/logo.png"
                    alt="APS Logo"
                    className="h-8 w-auto object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-black uppercase tracking-tight text-sm text-white">
                    ANDALAN <span className="text-amber-500">PART SERVICE</span>
                  </span>
                  <span className="text-[9px] font-black uppercase text-amber-400">
                    ADMIN PORTAL
                  </span>
                </div>
              </Link>
              <span className="hidden sm:inline text-xs text-slate-500 font-bold border-l border-slate-800 pl-3">
                Control Panel & Warehouse Logistics
              </span>
            </div>

            <nav className="flex items-center gap-2 sm:gap-4 text-xs font-bold">
              <Link href="/admin" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 transition">
                Overview
              </Link>
              <Link href="/admin/orders" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 transition">
                <ShoppingBag className="h-3.5 w-3.5 text-amber-500" /> Orders
              </Link>
              <Link href="/admin/inquiries" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 transition">
                <Siren className="h-3.5 w-3.5 text-amber-500 animate-pulse" /> Inquiries
              </Link>
              <Link href="/admin/products" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 transition">
                <Package className="h-3.5 w-3.5 text-amber-500" /> Products
              </Link>
              <Link href="/" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 transition ml-2">
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
