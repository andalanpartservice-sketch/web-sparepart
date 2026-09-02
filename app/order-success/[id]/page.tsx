import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { getOrderByIdOrCode } from '@/lib/data-service';
import { formatIDR, getWhatsAppUrl } from '@/lib/utils';
import { CheckCircle2, Send, CreditCard, ArrowLeft } from 'lucide-react';

interface OrderSuccessPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderSuccessPage({ params }: OrderSuccessPageProps) {
  const resolvedParams = await params;
  const order = await getOrderByIdOrCode(resolvedParams.id);

  if (!order) {
    notFound();
  }

  const adminWa = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '6281234567890';
  const waMsg = `Halo Admin Andalan Part Service, saya ${order.customer_name} ingin konfirmasi pesanan dengan kode invoice: ${order.order_code}.\n\nTotal Pembayaran: ${formatIDR(order.total_amount)}\nMetode Pembayaran: ${order.payment_method}.\n\nMohon informasi jadwal pengiriman. Terima kasih!`;
  const waUrl = getWhatsAppUrl(adminWa, waMsg);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 flex-1 w-full space-y-8">
        {/* Success Header Banner */}
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950 text-slate-100 p-6 sm:p-8 shadow-xl text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Pemesanan Berhasil Dibuat!</span>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Terima Kasih, Pesanan Anda Telah Diterima</h1>
            <p className="text-xs text-slate-300 max-w-lg mx-auto">
              Nomor invoice pesanan Anda adalah <strong className="text-amber-400 font-mono-part">{order.order_code}</strong>. Tim administrasi kami akan segera memproses pengemasan barang Anda.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-6 py-3 text-xs font-extrabold uppercase text-slate-950 shadow-md hover:bg-emerald-400 transition"
            >
              <Send className="h-4 w-4" />
              Konfirmasi via WhatsApp Admin
            </a>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-6 py-3 text-xs font-bold text-slate-200 hover:bg-slate-800 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Katalog
            </Link>
          </div>
        </div>

        {/* Invoice Card Details */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          {/* Invoice Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Kode Invoice</span>
              <span className="font-mono-part text-xl font-black text-slate-900">{order.order_code}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Status Pesanan</span>
              <span className="inline-block rounded-md bg-amber-100 text-amber-800 px-3 py-1 text-xs font-black uppercase">
                {order.order_status}
              </span>
            </div>
          </div>

          {/* Payment Instructions according to method */}
          {order.payment_method === 'BANK_TRANSFER' && (
            <div className="rounded-xl border border-amber-300 bg-amber-50/50 p-5 space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-extrabold text-xs uppercase">
                <CreditCard className="h-4 w-4 text-amber-600" />
                Instruksi Pembayaran Bank Transfer
              </div>
              <p className="text-xs text-slate-700">
                Silakan lakukan transfer sebesar <strong className="text-slate-900 text-sm font-black">{formatIDR(order.total_amount)}</strong> ke salah satu rekening resmi berikut:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="bg-white p-3 rounded-lg border border-amber-200 space-y-1">
                  <span className="text-xs font-bold text-slate-900 block">BCA (Bank Central Asia)</span>
                  <div className="flex items-center justify-between">
                    <span className="font-mono-part font-black text-slate-900 text-base">883-092-1144</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block">a.n. PT Andalan Part Service Indonesia</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-amber-200 space-y-1">
                  <span className="text-xs font-bold text-slate-900 block">Bank Mandiri</span>
                  <div className="flex items-center justify-between">
                    <span className="font-mono-part font-black text-slate-900 text-base">156-00-99887-123</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block">a.n. PT Andalan Part Service Indonesia</span>
                </div>
              </div>
            </div>
          )}

          {order.payment_method === 'COD' && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-2 text-xs">
              <span className="font-extrabold uppercase text-slate-900 block">Pembayaran COD (Cash on Delivery)</span>
              <p className="text-slate-600">
                Pesanan Anda disetujui untuk pembayaran tunai saat pengiriman oleh armada internal. Harap siapkan uang pas sebesar <strong className="text-slate-900">{formatIDR(order.total_amount)}</strong> saat pengemudi tiba di lokasi site.
              </p>
            </div>
          )}

          {order.payment_method === 'CBD' && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-2 text-xs">
              <span className="font-extrabold uppercase text-slate-900 block">Pembayaran CBD (Cash Before Delivery)</span>
              <p className="text-slate-600">
                Barang Anda sedang dalam tahap penimbangan dan verifikasi kargo. Tim admin kami akan menghubungi WhatsApp <strong className="text-slate-900">{order.customer_phone}</strong> untuk pengiriman foto pengemasan barang dan invoice final sebelum truk diluncurkan.
              </p>
            </div>
          )}

          {/* Customer & Shipping Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Penerima & Kontak</span>
              <div className="text-xs text-slate-800 space-y-1 font-medium">
                <p className="font-bold text-slate-900 text-sm">{order.customer_name}</p>
                <p>No. WA: {order.customer_phone}</p>
                {order.customer_email && <p>Email: {order.customer_email}</p>}
              </div>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Alamat Pengiriman Kargo</span>
              <p className="text-xs text-slate-800 font-medium leading-relaxed">
                {order.shipping_address}
              </p>
            </div>
          </div>

          {/* Order Items Table */}
          <div className="pt-4 border-t border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 block mb-3">Rincian Part Yang Dipesan</span>
            <div className="divide-y divide-slate-100">
              {order.items && order.items.length > 0 ? (
                order.items.map((it, idx) => (
                  <div key={idx} className="py-2.5 flex justify-between text-xs items-center">
                    <div>
                      <span className="font-bold text-slate-900 block">{it.product?.name || `Product #${it.product_id}`}</span>
                      <span className="font-mono-part text-[11px] text-slate-500">
                        {it.product?.part_number || it.product_id} x {it.quantity} unit
                      </span>
                    </div>
                    <span className="font-bold text-slate-900">
                      {formatIDR(it.price_at_purchase * it.quantity)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-2 text-xs text-slate-500">Subtotal: {formatIDR(order.total_amount)}</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
