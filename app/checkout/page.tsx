'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { useCart } from '@/context/CartContext';
import { formatIDR, generateOrderCode } from '@/lib/utils';
import { PaymentMethod } from '@/lib/types';
import { saveOrder } from '@/lib/data-service';
import { CreditCard, Truck, Upload, AlertCircle, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, totalAmount, clearCart } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [cargoNotes, setCargoNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('BANK_TRANSFER');
  const [paymentProofUrl, setPaymentProofUrl] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentProofUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !shippingAddress) return;
    if (cart.length === 0) return;

    setIsSubmitting(true);
    try {
      const orderCode = generateOrderCode();

      const createdOrder = await saveOrder({
        order_code: orderCode,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail || undefined,
        shipping_address: `${shippingAddress}${cargoNotes ? ` (Catatan Kargo: ${cargoNotes})` : ''}`,
        payment_method: paymentMethod,
        payment_proof_url: paymentProofUrl,
        order_status: 'PENDING',
        total_amount: totalAmount,
        items: cart.map((it) => ({
          product_id: it.product.id,
          quantity: it.quantity,
          price_at_purchase: it.product.price,
          product: it.product,
        })),
      });

      clearCart();
      router.push(`/order-success/${createdOrder.id || createdOrder.order_code}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-16 text-center flex-1">
          <h2 className="text-xl font-bold text-slate-900">Keranjang Belanja Anda Kosong</h2>
          <p className="text-xs text-slate-500 my-4">Silakan pilih produk terlebih dahulu sebelum melakukan checkout.</p>
          <button
            onClick={() => router.push('/')}
            className="rounded-lg bg-slate-900 px-6 py-2.5 text-xs font-bold text-white"
          >
            Kembali ke Katalog
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 flex-1 w-full">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black uppercase text-slate-900 tracking-tight">
              Checkout & Formulir Pemesanan
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Lengkapi data pengiriman dan pilih metode pembayaran resmi Anda.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Form Inputs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Customer Details Box */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Truck className="h-4 w-4 text-amber-500" />
                Data Pelanggan & Alamat Pengiriman Site
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Nama Pemesan / Perusahaan <span className="text-amber-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="PT Tambang Jaya / Budi Kurniawan"
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    No. WhatsApp PIC Site <span className="text-amber-600">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="081298765432"
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Email Invoice (Opsional)
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="purchasing@perusahaan.com"
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Alamat Lengkap Pengiriman Kargo <span className="text-amber-600">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Kawasan Industri Jababeka V, Blok C-12, Cikarang / Site Tambang Balikpapan..."
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Catatan Pengiriman / Pilihan Ekspedisi Kargo
                </label>
                <input
                  type="text"
                  value={cargoNotes}
                  onChange={(e) => setCargoNotes(e.target.value)}
                  placeholder="Contoh: Kirim via Dakota Cargo / Baraka / Armada Internal Jabodetabek"
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Payment Method Radio Selection Box */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-amber-500" />
                Pilihan Metode Pembayaran
              </h2>

              <div className="space-y-3">
                {/* 1. BANK TRANSFER */}
                <label
                  className={`flex flex-col p-4 rounded-xl border cursor-pointer transition ${
                    paymentMethod === 'BANK_TRANSFER'
                      ? 'border-amber-500 bg-amber-50/40 ring-1 ring-amber-500'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment_method"
                      value="BANK_TRANSFER"
                      checked={paymentMethod === 'BANK_TRANSFER'}
                      onChange={() => setPaymentMethod('BANK_TRANSFER')}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500"
                    />
                    <div className="flex-1">
                      <span className="font-bold text-slate-900 text-sm block">Bank Transfer (BCA / Mandiri)</span>
                      <span className="text-xs text-slate-500">Transfer manual ke rekening resmi perusahaan. Bukti transfer diunggah online.</span>
                    </div>
                  </div>

                  {paymentMethod === 'BANK_TRANSFER' && (
                    <div className="mt-4 pt-3 border-t border-amber-200 space-y-3 text-xs text-slate-700">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3 rounded-lg border border-amber-200">
                        <div>
                          <span className="font-bold text-slate-900 block">Bank BCA (Cab. Cikarang)</span>
                          <span className="font-mono-part font-black text-slate-900 text-sm">883-092-1144</span>
                          <span className="text-[10px] text-slate-500 block">a.n. PT EquipPart Heavy Indonesia</span>
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">Bank Mandiri</span>
                          <span className="font-mono-part font-black text-slate-900 text-sm">156-00-99887-123</span>
                          <span className="text-[10px] text-slate-500 block">a.n. PT EquipPart Heavy Indonesia</span>
                        </div>
                      </div>

                      {/* Optional File Upload Proof */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Upload Bukti Transfer (Bisa Diunggah Sekarang atau Nanti):
                        </label>
                        <div className="relative border border-dashed border-slate-300 rounded-lg p-3 text-center bg-slate-50 cursor-pointer">
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={handleProofUpload}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                          <div className="flex items-center justify-center gap-2 text-slate-600">
                            <Upload className="h-4 w-4 text-amber-600" />
                            <span className="text-xs font-medium">
                              {paymentProofUrl ? 'Bukti transfer dipilih! (Klik untuk ganti)' : 'Klik untuk pilih file bukti transfer'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </label>

                {/* 2. COD */}
                <label
                  className={`flex flex-col p-4 rounded-xl border cursor-pointer transition ${
                    paymentMethod === 'COD'
                      ? 'border-amber-500 bg-amber-50/40 ring-1 ring-amber-500'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment_method"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500"
                    />
                    <div className="flex-1">
                      <span className="font-bold text-slate-900 text-sm block">COD (Cash on Delivery)</span>
                      <span className="text-xs text-slate-500">Bayar tunai di tempat saat barang diterima oleh kurir internal.</span>
                    </div>
                  </div>

                  {paymentMethod === 'COD' && (
                    <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-300 text-xs text-amber-900 flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>Catatan Verifikasi COD:</strong> Opsi COD hanya berlaku jika lokasi pengiriman masuk dalam rute pengangkutan armada internal kami (Area Jabodetabek & Karawang-Cikarang Industrial Zone). Tim sales akan melakukan konfirmasi telepon sebelum jalan.
                      </span>
                    </div>
                  )}
                </label>

                {/* 3. CBD */}
                <label
                  className={`flex flex-col p-4 rounded-xl border cursor-pointer transition ${
                    paymentMethod === 'CBD'
                      ? 'border-amber-500 bg-amber-50/40 ring-1 ring-amber-500'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment_method"
                      value="CBD"
                      checked={paymentMethod === 'CBD'}
                      onChange={() => setPaymentMethod('CBD')}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500"
                    />
                    <div className="flex-1">
                      <span className="font-bold text-slate-900 text-sm block">CBD (Cash Before Delivery)</span>
                      <span className="text-xs text-slate-500">Pelunasan via transfer sebelum barang diberangkatkan ke kargo ekspedisi.</span>
                    </div>
                  </div>

                  {paymentMethod === 'CBD' && (
                    <div className="mt-3 p-3 rounded-lg bg-slate-100 border border-slate-300 text-xs text-slate-800 flex items-start gap-2">
                      <ShieldCheck className="h-4 w-4 text-slate-700 shrink-0 mt-0.5" />
                      <span>
                        <strong>Peringatan Verifikasi CBD:</strong> Pesanan disiapkan dan ditimbang di gudang terlebih dahulu. Invoice final kargo akan dikirimkan ke WhatsApp Anda untuk difinalisasi sebelum truk kargo diluncurkan.
                      </span>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sticky top-24 space-y-5">
              <h3 className="font-extrabold text-base uppercase text-slate-900 border-b border-slate-100 pb-3">
                Item Pesanan ({cart.length})
              </h3>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center justify-between text-xs gap-3">
                    <div>
                      <span className="font-bold text-slate-900 block">{item.product.name}</span>
                      <span className="font-mono-part text-[11px] text-slate-500">
                        {item.product.part_number} x {item.quantity}
                      </span>
                    </div>
                    <span className="font-bold text-slate-900 shrink-0">
                      {formatIDR(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal Part:</span>
                  <span className="font-bold text-slate-900">{formatIDR(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Estimasi Pengemasan Heavy Duty:</span>
                  <span className="font-bold text-emerald-600">GRATIS</span>
                </div>
                <div className="flex justify-between text-slate-900 pt-2 border-t border-slate-100 text-sm font-black">
                  <span>Total Pemesanan:</span>
                  <span className="text-xl text-slate-900">{formatIDR(totalAmount)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-amber-500 py-4 text-xs font-black uppercase tracking-wider text-slate-950 shadow-md hover:bg-amber-400 active:scale-[0.99] transition disabled:opacity-50"
              >
                <CheckCircle2 className="h-5 w-5" />
                {isSubmitting ? 'Memproses Pesanan...' : 'Buat Pesanan Sekarang'}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
