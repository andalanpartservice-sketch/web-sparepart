'use client';

import React, { useState } from 'react';
import { Order, OrderStatus } from '@/lib/types';
import { formatIDR, getWhatsAppUrl } from '@/lib/utils';
import { updateOrderStatus } from '@/lib/data-service';
import { ShoppingBag, Eye, Send, CheckCircle2, Clock, AlertTriangle, FileText, Search } from 'lucide-react';

interface OrderManagementClientProps {
  initialOrders: Order[];
}

export function OrderManagementClient({ initialOrders }: OrderManagementClientProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProofUrl, setSelectedProofUrl] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, order_status: newStatus } : o))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.order_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer_phone.includes(searchQuery)
  );

  const adminWa = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '6281234567890';

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black uppercase text-slate-900 tracking-tight flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-amber-500" />
            Manajemen Pesanan Masuk (Orders)
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Verifikasi bukti pembayaran transfer, COD, dan CBD serta perbarui status pengiriman kargo.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari Invoice, Nama, atau No. WA..."
            className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-4 text-xs text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-900 text-white uppercase text-[10px] font-black tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5">Kode Invoice</th>
                <th className="px-4 py-3.5">Pelanggan & WA</th>
                <th className="px-4 py-3.5">Alamat Pengiriman</th>
                <th className="px-4 py-3.5">Metode & Bukti</th>
                <th className="px-4 py-3.5">Total Amount</th>
                <th className="px-4 py-3.5">Status Pesanan</th>
                <th className="px-4 py-3.5 text-right">Aksi WA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                    Tidak ada pesanan ditemukan.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const waMsg = `Halo Kak ${order.customer_name}, kami dari Admin EquipPart mengenai pesanan ${order.order_code}.\n\nTotal: ${formatIDR(order.total_amount)}\nStatus: ${order.order_status}.`;
                  const waUrl = getWhatsAppUrl(order.customer_phone || adminWa, waMsg);

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/80 transition">
                      {/* Order Code */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="font-mono-part font-extrabold text-slate-900 block text-xs">
                          {order.order_code}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          {new Date(order.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </td>

                      {/* Customer Info */}
                      <td className="px-4 py-4">
                        <span className="font-bold text-slate-900 block">{order.customer_name}</span>
                        <span className="text-slate-500 font-mono text-[11px] block">{order.customer_phone}</span>
                      </td>

                      {/* Shipping Address */}
                      <td className="px-4 py-4 max-w-xs">
                        <span className="line-clamp-2 text-slate-600 font-normal leading-tight">
                          {order.shipping_address}
                        </span>
                      </td>

                      {/* Payment Method & Proof */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="inline-block rounded bg-slate-100 border border-slate-200 px-2 py-0.5 text-[10px] font-extrabold text-slate-800 mb-1">
                          {order.payment_method}
                        </span>

                        {order.payment_proof_url ? (
                          <button
                            onClick={() => setSelectedProofUrl(order.payment_proof_url || null)}
                            className="flex items-center gap-1 text-[11px] font-bold text-amber-600 hover:text-amber-700 underline block"
                          >
                            <Eye className="h-3 w-3" /> Lihat Bukti Transfer
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 block italic">Belum ada bukti</span>
                        )}
                      </td>

                      {/* Total Amount */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="font-black text-slate-900 text-sm">
                          {formatIDR(order.total_amount)}
                        </span>
                      </td>

                      {/* Status Dropdown */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <select
                          disabled={updatingId === order.id}
                          value={order.order_status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                          className={`rounded-lg border px-2.5 py-1.5 text-xs font-bold focus:outline-none transition ${
                            order.order_status === 'VERIFIED'
                              ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                              : order.order_status === 'SHIPPED'
                              ? 'border-blue-300 bg-blue-50 text-blue-800'
                              : order.order_status === 'CANCELLED'
                              ? 'border-rose-300 bg-rose-50 text-rose-800'
                              : 'border-amber-300 bg-amber-50 text-amber-800'
                          }`}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="VERIFIED">VERIFIED</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>

                      {/* Action WA */}
                      <td className="px-4 py-4 text-right whitespace-nowrap">
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-emerald-500 transition shadow-xs"
                        >
                          <Send className="h-3 w-3" /> WA Client
                        </a>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Proof Modal */}
      {selectedProofUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-xs">
          <div className="relative max-w-lg w-full rounded-2xl bg-white p-6 space-y-4 text-center">
            <h3 className="font-extrabold text-slate-900 text-base">Bukti Transfer Pembayaran</h3>
            <div className="aspect-4/3 w-full rounded-xl bg-slate-100 overflow-hidden border border-slate-200">
              {/* eslint-disable-next-html-element-suppression */}
              <img src={selectedProofUrl} alt="Bukti Transfer" className="h-full w-full object-contain" />
            </div>
            <button
              onClick={() => setSelectedProofUrl(null)}
              className="rounded-lg bg-slate-900 px-6 py-2 text-xs font-bold text-white hover:bg-slate-800"
            >
              Tutup Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
