'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Bot, Sparkles, AlertCircle, Wrench, Clock, CheckCircle, RefreshCw, Send } from 'lucide-react';
import { Product } from '@/lib/types';
import { ProductCard } from '@/components/ProductCard';

interface AIRecommendationWidgetProps {
  currentBrand: string;
  currentCategory: string;
  allProducts: Product[];
}

const SYMPTOMS = [
  { id: 'rem', label: '🛑 Rem Kurang Pakem / Glip', keyword: 'rem' },
  { id: 'overheat', label: '🌡️ Mesin Overheat / Air Panas', keyword: 'panas' },
  { id: 'hidrolik', label: '💧 Bocoran Oli Hidrolik / Seal Aus', keyword: 'hidrolik' },
  { id: 'garpu', label: '🏗️ Garpu Turun Sendiri / Slow Lift', keyword: 'garpu' },
  { id: 'stater', label: '⚡ Starter Motor Berat / Aki Drop', keyword: 'stater' },
];

export function AIRecommendationWidget({
  currentBrand,
  currentCategory,
  allProducts,
}: AIRecommendationWidgetProps) {
  const [activeTab, setActiveTab] = useState<'fastmoving' | 'maintenance' | 'symptoms' | 'ask'>('fastmoving');
  const [selectedSymptom, setSelectedSymptom] = useState<string | null>(null);
  const [userQuery, setUserQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiData, setAiData] = useState<{
    brandSummary?: string;
    fastMovingAdvice?: string;
    recommendedPartNumbers?: string[];
    aiAnalysis?: string;
    maintenance250h?: string;
    maintenance500h?: string;
    maintenance1000h?: string;
    source?: string;
  }>({});

  const fetchAIRecommendations = useCallback(async (symptomKey?: string, queryText?: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: currentBrand === 'ALL' ? undefined : currentBrand,
          category: currentCategory === 'ALL' ? undefined : currentCategory,
          symptom: symptomKey || undefined,
          query: queryText || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAiData(data);
      }
    } catch (err) {
      console.error('Failed to fetch AI recommendation:', err);
    } finally {
      setLoading(false);
    }
  }, [currentBrand, currentCategory]);

  useEffect(() => {
    setSelectedSymptom(null);
    setUserQuery('');
    fetchAIRecommendations();
  }, [currentBrand, currentCategory, fetchAIRecommendations]);

  const handleSymptomClick = (symptom: typeof SYMPTOMS[0]) => {
    if (selectedSymptom === symptom.id) {
      setSelectedSymptom(null);
      fetchAIRecommendations();
    } else {
      setSelectedSymptom(symptom.id);
      fetchAIRecommendations(symptom.label);
    }
  };

  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;
    fetchAIRecommendations(undefined, userQuery);
  };

  // Filter catalog products that match AI recommended part numbers or brand
  const recommendedProducts = allProducts.filter((p) => {
    if (aiData.recommendedPartNumbers && aiData.recommendedPartNumbers.length > 0) {
      return aiData.recommendedPartNumbers.some(
        (pn) => p.part_number.toLowerCase().includes(pn.toLowerCase()) || pn.toLowerCase().includes(p.part_number.toLowerCase())
      );
    }
    if (currentBrand !== 'ALL') {
      return p.brand.toLowerCase() === currentBrand.toLowerCase();
    }
    return false;
  });

  return (
    <div className="mb-8 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/20 p-5 sm:p-6 shadow-xl text-white relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-amber-500/5 blur-3xl" />

      <div className="relative z-10 space-y-4">
        {/* Widget Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <Bot className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black uppercase text-amber-400 tracking-tight">
                  AI Smart Recommendation Engine
                </h3>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30">
                  <Sparkles className="h-3 w-3" /> 9router AI Connected
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {currentBrand !== 'ALL'
                  ? `Analisis teknis & rekomendasi suku cadang khusus unit ${currentBrand}`
                  : 'Sistem pakar kecerdasan buatan untuk deteksi dini & rekomendasi sparepart'}
              </p>
            </div>
          </div>

          <button
            onClick={() => fetchAIRecommendations(selectedSymptom || undefined, userQuery || undefined)}
            disabled={loading}
            className="self-start sm:self-center inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh AI
          </button>
        </div>

        {/* Brand Summary Badge */}
        {aiData.brandSummary && (
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3.5 text-xs text-amber-200/90 flex items-start gap-2.5">
            <Sparkles className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <span><strong>Fokus Analisis AI:</strong> {aiData.brandSummary}</span>
          </div>
        )}

        {/* Tab Selection */}
        <div className="flex flex-wrap gap-2 pt-1 border-b border-slate-800/80 pb-3">
          <button
            onClick={() => setActiveTab('fastmoving')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition ${
              activeTab === 'fastmoving'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Wrench className="h-3.5 w-3.5" />
            Fast-Moving & Komponen Utama
          </button>

          <button
            onClick={() => setActiveTab('maintenance')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition ${
              activeTab === 'maintenance'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            Paket Servis Berkala (HM)
          </button>

          <button
            onClick={() => setActiveTab('symptoms')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition ${
              activeTab === 'symptoms'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <AlertCircle className="h-3.5 w-3.5" />
            Diagnosis Gejala Kerusakan
          </button>

          <button
            onClick={() => setActiveTab('ask')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition ${
              activeTab === 'ask'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Bot className="h-3.5 w-3.5" />
            Tanya AI Assistant
          </button>
        </div>

        {/* Tab 1: Fast-Moving */}
        {activeTab === 'fastmoving' && (
          <div className="space-y-3 pt-1">
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800">
              💡 <strong>Rekomendasi Rutin AI:</strong> {aiData.fastMovingAdvice || 'Pemeriksaan berkala pada filter oli, komponen rem, dan seal hidrolik.'}
            </p>
          </div>
        )}

        {/* Tab 2: Maintenance Intervals */}
        {activeTab === 'maintenance' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 space-y-1.5">
              <span className="inline-block rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-black text-amber-400 uppercase">
                Servis 250 Jam
              </span>
              <p className="text-xs text-slate-300">
                {aiData.maintenance250h || 'Penggantian Filter Oli Mesin & Pembersihan Filter Udara.'}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 space-y-1.5">
              <span className="inline-block rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-black text-amber-400 uppercase">
                Servis 500 Jam
              </span>
              <p className="text-xs text-slate-300">
                {aiData.maintenance500h || 'Penggantian Filter Solar Utama & Filter Solar Sekunder.'}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 space-y-1.5">
              <span className="inline-block rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-black text-amber-400 uppercase">
                Servis 1000 Jam (Major)
              </span>
              <p className="text-xs text-slate-300">
                {aiData.maintenance1000h || 'Penggantian Filter Transmisi, Filter Hidrolik & Seal Kit Silinder.'}
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Symptom Chips */}
        {activeTab === 'symptoms' && (
          <div className="space-y-3 pt-1">
            <p className="text-xs text-slate-400 font-medium">Klik gejala masalah yang dialami unit Anda di lapangan:</p>
            <div className="flex flex-wrap gap-2">
              {SYMPTOMS.map((sym) => {
                const isSelected = selectedSymptom === sym.id;
                return (
                  <button
                    key={sym.id}
                    onClick={() => handleSymptomClick(sym)}
                    className={`rounded-lg px-3.5 py-2 text-xs font-bold border transition ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                        : 'bg-slate-900/90 text-slate-300 border-slate-700 hover:border-amber-500/50 hover:bg-slate-800'
                    }`}
                  >
                    {sym.label}
                  </button>
                );
              })}
            </div>

            {aiData.aiAnalysis && (
              <div className="rounded-xl border border-amber-500/30 bg-slate-900 p-3.5 text-xs text-amber-200 space-y-1">
                <span className="font-extrabold uppercase text-amber-400 flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4" /> Hasil Deteksi Kerusakan AI:
                </span>
                <p className="text-slate-300 leading-relaxed">{aiData.aiAnalysis}</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Natural Language AI Assistant */}
        {activeTab === 'ask' && (
          <div className="space-y-3 pt-1">
            <form onSubmit={handleAskSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  placeholder="Ketik masalah unit (misal: mesin overheat saat bawa beban 3 ton, ganti part apa?)"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !userQuery.trim()}
                className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-black uppercase text-slate-950 hover:bg-amber-400 transition disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                Tanya
              </button>
            </form>

            {aiData.aiAnalysis && (
              <div className="rounded-xl border border-amber-500/30 bg-slate-900 p-3.5 text-xs text-amber-200 space-y-1">
                <span className="font-extrabold uppercase text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4" /> Jawaban Pakar AI:
                </span>
                <p className="text-slate-300 leading-relaxed">{aiData.aiAnalysis}</p>
              </div>
            )}
          </div>
        )}

        {/* AI Recommended Products Carousel / Grid */}
        {recommendedProducts.length > 0 && (
          <div className="pt-3 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                Produk Katalog Terkait Rekomendasi AI ({recommendedProducts.length})
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendedProducts.slice(0, 3).map((prod) => (
                <div key={prod.id} className="text-slate-900">
                  <ProductCard product={prod} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
