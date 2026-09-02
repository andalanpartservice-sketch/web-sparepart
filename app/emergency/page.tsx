'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { getWhatsAppUrl } from '@/lib/utils';
import { saveEmergencyInquiry } from '@/lib/data-service';
import { Siren, Upload, Send, CheckCircle2, AlertTriangle, ArrowLeft, ShieldCheck, PhoneCall } from 'lucide-react';

export default function EmergencyPage() {
  const [customerName, setCustomerName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [machineModel, setMachineModel] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<{ waUrl: string } | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            setPhotos((prev) => [...prev, reader.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !whatsappNumber || !machineModel || !description) return;

    setIsSubmitting(true);
    try {
      await saveEmergencyInquiry({
        customer_name: customerName,
        whatsapp_number: whatsappNumber,
        machine_model: machineModel,
        description,
        photo_urls: photos.length > 0 ? photos : ['https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80'],
      });

      const adminWa = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '6281234567890';
      const waMsg = `Halo Admin, saya ${customerName} (WA: ${whatsappNumber}) butuh part darurat untuk unit ${machineModel}.\n\nKendala: ${description}.\n\nMohon dicek melalui dashboard.`;
      const waUrl = getWhatsAppUrl(adminWa, waMsg);

      setSubmittedData({ waUrl });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 flex-1 w-full space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 mb-1">
              <Siren className="h-4 w-4 animate-pulse" /> EQUIPPART EMERGENCY FINDER
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase text-slate-900 tracking-tight">
              Formulir Permintaan Part Darurat Lapangan
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Unit alat berat atau forklift mati total? Isi data & foto komponen untuk penanganan langsung dalam 15 menit.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-amber-600 transition self-start sm:self-auto"
          >
            <ArrowLeft className="h-4 w-4" /> Kembali
          </Link>
        </div>

        {submittedData ? (
          <div className="rounded-2xl border border-emerald-500/30 bg-white p-8 shadow-xl text-center space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900">Permintaan Emergency Terkirim!</h2>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Record inquiry telah masuk ke dashboard admin gudang. Klik tombol hijau di bawah untuk membuka percakapan langsung dengan Tim Desk Darurat via WhatsApp.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={submittedData.waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-8 py-4 text-xs font-black uppercase text-white shadow-lg hover:bg-emerald-500 transition"
              >
                <Send className="h-4 w-4" />
                Hubungi Admin via WhatsApp Sekarang
              </a>
              <button
                onClick={() => setSubmittedData(null)}
                className="w-full sm:w-auto rounded-lg border border-slate-300 bg-white px-6 py-4 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Isi Form Lagi
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form */}
            <div className="lg:col-span-8">
              <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-5">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-amber-600 border-b border-slate-100 pb-3">
                  <AlertTriangle className="h-4 w-4" /> Detail Kendala & Identitas Unit
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Nama PIC / Supervisor Site <span className="text-amber-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Contoh: Pak Herman (Mekanik Head)"
                      className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      No. WhatsApp Aktif <span className="text-amber-600">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      placeholder="Contoh: 081298765432"
                      className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Tipe / Model Machine / Forklift / Heavy Equipment <span className="text-amber-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={machineModel}
                    onChange={(e) => setMachineModel(e.target.value)}
                    placeholder="Contoh: Excavator Komatsu PC200-8 / Forklift Toyota 8FD30"
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Deskripsi Gejala Kerusakan & Kebetuhan Part <span className="text-amber-600">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ceritakan kendala teknis (mesin kepanasan, oli bocor dari seal, stater tidak mau ngangkat)..."
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Upload Foto Komponen Rusak / Nameplate Serial Number
                  </label>
                  <div className="relative border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-lg p-5 text-center cursor-pointer transition bg-slate-50">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center justify-center gap-2 text-slate-500">
                      <Upload className="h-8 w-8 text-amber-600" />
                      <span className="text-xs font-bold text-slate-700">Ambil Foto atau Pilih Gambar Komponen</span>
                      <span className="text-[11px] text-slate-400">Membantu mekanik kami mengidentifikasi kode part 100% presisi</span>
                    </div>
                  </div>

                  {photos.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {photos.map((src, i) => (
                        <div key={i} className="relative h-20 w-20 rounded-lg overflow-hidden border border-slate-300">
                          {/* eslint-disable-next-html-element-suppression */}
                          <img src={src} alt="Preview" className="h-full w-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-amber-500 py-4 font-black uppercase tracking-wider text-slate-950 shadow-md hover:bg-amber-400 transition disabled:opacity-50 text-xs"
                >
                  <Send className="h-4 w-4" />
                  {isSubmitting ? 'Mengirim Data...' : 'Kirim Permintaan Emergency Finder'}
                </button>
              </form>
            </div>

            {/* Sidebar Info */}
            <div className="lg:col-span-4 space-y-6">
              <div className="rounded-2xl border border-slate-900 bg-slate-900 text-slate-100 p-6 shadow-md space-y-4">
                <div className="flex items-center gap-2 text-amber-400 font-extrabold text-sm uppercase">
                  <PhoneCall className="h-5 w-5" /> Hotline Fast Track 24/7
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Jika butuh respon instan kurang dari 5 menit, silakan hubungi hotline emergency admin via WhatsApp atau telepon langsung:
                </p>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono-part font-black text-amber-400 text-base">
                  +62 812-9876-5432
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-3 text-xs text-slate-600">
                <span className="font-extrabold uppercase text-slate-900 block">Jaminan Layanan Breakdown</span>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Identifikasi otomatis lintas brand (Caterpillar, Komatsu, Toyota, TCM).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Cross-reference part number aftermarket heavy duty jika stok ori indent.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
