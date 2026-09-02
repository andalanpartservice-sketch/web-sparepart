'use client';

import React, { useState } from 'react';
import { EmergencyInquiry, InquiryStatus } from '@/lib/types';
import { getWhatsAppUrl } from '@/lib/utils';
import { updateInquiryStatus } from '@/lib/data-service';
import { Siren, Send, CheckCircle2, Clock, Image as ImageIcon, AlertTriangle } from 'lucide-react';

interface InquiriesClientProps {
  initialInquiries: EmergencyInquiry[];
}

export function InquiriesClient({ initialInquiries }: InquiriesClientProps) {
  const [inquiries, setInquiries] = useState<EmergencyInquiry[]>(initialInquiries);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = async (inquiryId: string, newStatus: InquiryStatus) => {
    setUpdatingId(inquiryId);
    try {
      await updateInquiryStatus(inquiryId, newStatus);
      setInquiries((prev) =>
        prev.map((i) => (i.id === inquiryId ? { ...i, status: newStatus } : i))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const adminWa = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '6281234567890';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black uppercase text-slate-900 tracking-tight flex items-center gap-2">
            <Siren className="h-6 w-6 text-amber-500 animate-pulse" />
            Laporan Breakdown & Emergency Inquiries
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Daftar foto alat berat/forklift yang mengalami kendala di lapangan dari para teknisi & supervisor site.
          </p>
        </div>
        <div className="text-xs font-bold text-slate-500">
          Total {inquiries.length} Inquiries
        </div>
      </div>

      {/* Inquiry Cards Grid */}
      {inquiries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-400">
          Belum ada inquiry darurat.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inquiries.map((inq) => {
            const waMsg = `Halo Kak ${inq.customer_name}, kami dari Tim Technical Support EquipPart merespon laporan darurat unit ${inq.machine_model}.\n\nKendala: ${inq.description}.\n\nApakah part number / foto komponen sudah sesuai?`;
            const waUrl = getWhatsAppUrl(inq.whatsapp_number || adminWa, waMsg);

            return (
              <div
                key={inq.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4"
              >
                <div className="space-y-3">
                  {/* Status & Date */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-block rounded px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
                        inq.status === 'NEW'
                          ? 'bg-amber-500 text-slate-950 animate-pulse'
                          : inq.status === 'CONTACTED'
                          ? 'bg-blue-600 text-white'
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {inq.status === 'NEW' ? 'NEW INQUIRY' : inq.status}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {new Date(inq.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {/* Machine Model Title */}
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base leading-tight">
                      {inq.machine_model}
                    </h3>
                    <span className="text-xs font-bold text-amber-600 block mt-0.5">
                      PIC: {inq.customer_name} ({inq.whatsapp_number})
                    </span>
                  </div>

                  {/* Damage Description */}
                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs text-slate-700 space-y-1">
                    <span className="font-bold text-slate-900 block text-[10px] uppercase tracking-wider">
                      Deskripsi Kendala:
                    </span>
                    <p className="line-clamp-3 leading-relaxed">{inq.description}</p>
                  </div>

                  {/* Photo Previews */}
                  {inq.photo_urls && inq.photo_urls.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                        <ImageIcon className="h-3 w-3" /> Foto Komponen ({inq.photo_urls.length}):
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {inq.photo_urls.map((url, idx) => (
                          <div key={idx} className="h-16 w-16 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden">
                            {/* eslint-disable-next-html-element-suppression */}
                            <img src={url} alt="Part Damage" className="h-full w-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <select
                    disabled={updatingId === inq.id}
                    value={inq.status}
                    onChange={(e) => handleStatusChange(inq.id, e.target.value as InquiryStatus)}
                    className="rounded-lg border border-slate-300 bg-slate-50 px-2 py-1.5 text-xs font-bold text-slate-800 focus:outline-none"
                  >
                    <option value="NEW">Status: NEW</option>
                    <option value="CONTACTED">Status: CONTACTED</option>
                    <option value="SOLVED">Status: SOLVED</option>
                  </select>

                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-extrabold text-white hover:bg-emerald-500 transition shadow-xs"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Hubungi WA
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
