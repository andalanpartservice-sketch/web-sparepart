'use client';

import React, { useState } from 'react';
import { Siren, X, Upload, Send, CheckCircle2, AlertTriangle } from 'lucide-react';
import { getWhatsAppUrl } from '@/lib/utils';
import { saveEmergencyInquiry } from '@/lib/data-service';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EmergencyModal({ isOpen, onClose }: EmergencyModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [machineModel, setMachineModel] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<{ waUrl: string } | null>(null);

  if (!isOpen) return null;

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
      const waMsg = `Halo Admin, saya ${customerName} (WA: ${whatsappNumber}) membutuhkan part darurat untuk unit ${machineModel}.\n\nKendala: ${description}.\n\nMohon segera dicek melalui Dashboard Admin!`;
      const waUrl = getWhatsAppUrl(adminWa, waMsg);

      setSubmittedData({ waUrl });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setCustomerName('');
    setWhatsappNumber('');
    setMachineModel('');
    setDescription('');
    setPhotos([]);
    setSubmittedData(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="relative w-full max-w-xl rounded-xl border border-amber-500/30 bg-slate-900 text-slate-100 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between bg-amber-500 px-6 py-4 text-slate-950">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-slate-950 p-2 text-amber-500">
              <Siren className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg uppercase tracking-wider">Layanan Darurat Part Breakdown</h2>
              <p className="text-xs font-semibold text-slate-900/80">Respon Cepat Tim Spesialis Sparepart Heavy Equipment</p>
            </div>
          </div>
          <button
            onClick={resetAndClose}
            className="rounded-lg p-1 text-slate-950 hover:bg-amber-600 transition"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[85vh] overflow-y-auto">
          {submittedData ? (
            <div className="text-center py-6 space-y-5">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-100">Laporan Darurat Berhasil Dibuat!</h3>
                <p className="text-sm text-slate-400 max-w-md mx-auto">
                  Data kerusakan unit Anda telah tersimpan di sistem kami. Silakan klik tombol di bawah untuk langsung terhubung dengan Admin via WhatsApp.
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-3">
                <a
                  href={submittedData.waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-3.5 font-bold text-white shadow-lg hover:bg-emerald-500 transition"
                >
                  <Send className="h-5 w-5" />
                  Hubungi Admin via WhatsApp Sekarang
                </a>
                <button
                  onClick={resetAndClose}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-6 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-700 transition"
                >
                  Tutup Dialog
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-amber-400 text-xs font-medium">
                <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500 mt-0.5" />
                <span>Gunakan form ini jika alat berat/forklift Anda mati total di lapangan dan membutuhkan rekomendasi part langsung.</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Nama PIC / Operator <span className="text-amber-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Contoh: Pak Budi (Site Supt)"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    No. WhatsApp Aktif <span className="text-amber-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="Contoh: 081298765432"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Model / Tipe Unit Machine <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={machineModel}
                  onChange={(e) => setMachineModel(e.target.value)}
                  placeholder="Contoh: Forklift Toyota 8FD30 / CAT 320D"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Deskripsi Gejala Kerusakan / Part Dibutuhkan <span className="text-amber-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ceritakan kendala mesin, kode error, atau part yang haus/patah..."
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Foto Part Rusak / Nameplate Mesin
                </label>
                <div className="relative border-2 border-dashed border-slate-700 hover:border-amber-500/50 rounded-lg p-4 text-center cursor-pointer transition bg-slate-950">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center gap-1.5 text-slate-400">
                    <Upload className="h-6 w-6 text-amber-500" />
                    <span className="text-xs font-medium">Klik atau seret foto komponen ke sini</span>
                    <span className="text-[10px] text-slate-500">Mendukung format JPG, PNG</span>
                  </div>
                </div>

                {photos.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {photos.map((src, i) => (
                      <div key={i} className="relative h-16 w-16 rounded-md overflow-hidden border border-amber-500/50">
                        {/* eslint-disable-next-html-element-suppression */}
                        <img src={src} alt="Uploaded preview" className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-amber-500 py-3.5 font-extrabold uppercase tracking-wider text-slate-950 shadow-lg hover:bg-amber-400 active:scale-[0.99] transition disabled:opacity-50"
                >
                  <Send className="h-5 w-5" />
                  {isSubmitting ? 'Mengirim Data...' : 'Kirim Permintaan Darurat'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
