import React from 'react';
import Link from 'next/link';
import { getOrders, getEmergencyInquiries, getProducts } from '@/lib/data-service';
import { formatIDR } from '@/lib/utils';
import { ShoppingBag, Siren, Package, DollarSign, ArrowRight, Clock, Wrench } from 'lucide-react';

export default async function AdminDashboardPage() {
  const orders = await getOrders();
  const inquiries = await getEmergencyInquiries();
  const products = await getProducts();

  const totalRevenue = orders.reduce((sum, o) => sum + o.total_amount, 0);
  const pendingOrders = orders.filter((o) => o.order_status === 'PENDING').length;
  const newInquiries = inquiries.filter((i) => i.status === 'NEW').length;

  return (
    <div className="space-y-8">
      {/* Top Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-slate-100 p-6 rounded-2xl border border-slate-800 shadow-md">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Wrench className="h-4 w-4" /> Admin Operations Center
          </div>
          <h1 className="text-2xl font-black uppercase text-white">Ringkasan Sistem & Operasional Gudang</h1>
          <p className="text-xs text-slate-400 mt-0.5">Kelola transaksi masuk, persetujuan bukti transfer, dan inquiry breakdown darurat.</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/orders"
            className="rounded-lg bg-amber-500 px-4 py-2.5 text-xs font-extrabold uppercase text-slate-950 hover:bg-amber-400 transition"
          >
            Kelola Orders
          </Link>
          <Link
            href="/admin/inquiries"
            className="rounded-lg bg-slate-800 border border-slate-700 px-4 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-700 transition"
          >
            Inquiry Darurat ({newInquiries})
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Orders */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Pesanan</span>
            <div className="rounded-lg bg-slate-100 p-2 text-slate-800">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{orders.length}</div>
          <div className="text-[11px] font-semibold text-amber-600 flex items-center gap-1">
            <Clock className="h-3 w-3" /> {pendingOrders} Menunggu Verifikasi
          </div>
        </div>

        {/* Emergency Inquiries */}
        <div className="rounded-xl border border-amber-500/30 bg-amber-50/50 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-amber-800">
            <span className="text-xs font-bold uppercase tracking-wider">Inquiry Darurat</span>
            <div className="rounded-lg bg-amber-500 p-2 text-slate-950">
              <Siren className="h-4 w-4 animate-pulse" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{inquiries.length}</div>
          <div className="text-[11px] font-bold text-amber-700">
            {newInquiries} Laporan Baru Membutuhkan Respon
          </div>
        </div>

        {/* Total Catalog Products */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Katalog Produk</span>
            <div className="rounded-lg bg-slate-100 p-2 text-slate-800">
              <Package className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{products.length} SKU</div>
          <div className="text-[11px] font-semibold text-emerald-600">
            {products.filter((p) => p.stock_status === 'READY').length} Ready Stock
          </div>
        </div>

        {/* Total Omset */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Nilai Pesanan</span>
            <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900">{formatIDR(totalRevenue)}</div>
          <div className="text-[11px] font-semibold text-slate-500">
            Kombinasi Transfer, COD & CBD
          </div>
        </div>
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders Table */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold uppercase text-slate-900 text-sm">Pesanan Terbaru</h3>
            <Link href="/admin/orders" className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1">
              Lihat Semua <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {orders.slice(0, 4).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono-part font-extrabold text-slate-900">{order.order_code}</span>
                    <span className="rounded bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                      {order.payment_method}
                    </span>
                  </div>
                  <span className="text-slate-500 block font-medium mt-0.5">{order.customer_name}</span>
                </div>
                <div className="text-right">
                  <span className="font-black text-slate-900 block">{formatIDR(order.total_amount)}</span>
                  <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold uppercase mt-0.5 ${
                    order.order_status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {order.order_status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Inquiries Card List */}
        <div className="rounded-2xl border border-amber-500/30 bg-slate-950 text-slate-100 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-extrabold uppercase text-amber-400 text-sm flex items-center gap-2">
              <Siren className="h-4 w-4" /> Inquiry Darurat Terbaru
            </h3>
            <Link href="/admin/inquiries" className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1">
              Lihat Semua <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {inquiries.slice(0, 3).map((inq) => (
              <div key={inq.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{inq.machine_model}</span>
                  <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                    inq.status === 'NEW' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {inq.status}
                  </span>
                </div>
                <p className="text-slate-400 line-clamp-1">{inq.description}</p>
                <div className="text-slate-500 text-[10px] font-medium">
                  PIC: {inq.customer_name} ({inq.whatsapp_number})
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
