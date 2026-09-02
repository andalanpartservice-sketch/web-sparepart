import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { brand, category, symptom, query } = body;

    const apiKey = process.env.AI_ROUTER_API_KEY || 'sk-0e837468274c06ee-e0trfq-66b4a19b';
    const baseUrl = process.env.AI_ROUTER_BASE_URL || 'https://api.9router.com/v1';

    const systemPrompt = `Anda adalah AI Assistant Pakar Technical Sparepart Alat Berat & Forklift untuk merk Caterpillar, Komatsu, Toyota, TCM, dan Mitsubishi.
Tugas Anda adalah memberikan saran sparepart, perawatan berkala, serta analisis gejala kerusakan secara presisi dalam format JSON murni tanpa markdown fence.`;

    const userPrompt = `Analisis kebutuhan sparepart forklift untuk:
- Brand: ${brand || 'Semua Brand'}
- Kategori: ${category || 'Semua Kategori'}
- Gejala Kerusakan: ${symptom || 'Tidak ada'}
- Pertanyaan Pengguna: ${query || 'Berikan rekomendasi umum dan fast moving'}

Jawab HANYA dalam bentuk JSON valid dengan format persis berikut:
{
  "brandSummary": "Ringkasan teknis singkat mengenai brand dan tipe spesifik ini.",
  "fastMovingAdvice": "Saran komponen cepat aus / fast moving yang paling krusial.",
  "recommendedPartNumbers": ["Daftar part number yang relevan"],
  "aiAnalysis": "Analisis teknis jika ada gejala kerusakan atau pertanyaan.",
  "maintenance250h": "Saran perawatan berkala 250 jam.",
  "maintenance500h": "Saran perawatan berkala 500 jam.",
  "maintenance1000h": "Saran perawatan berkala 1000 jam."
}`;

    try {
      const apiRes = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gemini-1.5-flash',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.3,
        }),
      });

      if (apiRes.ok) {
        const data = await apiRes.json();
        const content = data?.choices?.[0]?.message?.content;
        if (content) {
          const cleanJson = content.replace(/```json\n?|```/g, '').trim();
          const parsed = JSON.parse(cleanJson);
          return NextResponse.json({ success: true, ...parsed, source: '9router-ai' });
        }
      }
    } catch (apiErr) {
      console.warn('9router API call fallback triggered:', apiErr);
    }

    const fallbackResponse = getFallbackRecommendation(brand, category, symptom, query);
    return NextResponse.json({ success: true, ...fallbackResponse, source: 'ai-engine-fallback' });
  } catch (err) {
    console.error('Error in AI route:', err);
    return NextResponse.json({ success: false, error: 'Internal AI Route Error' }, { status: 500 });
  }
}

function getFallbackRecommendation(brand?: string, category?: string, symptom?: string, query?: string) {
  const b = (brand || 'ALL').toUpperCase();

  let brandSummary = 'Rekomendasi sparepart utama & komponen vital teruji heavy-duty.';
  let fastMovingAdvice = 'Pemeriksaan rutin filter oli, filter solar, dan sistem pengereman secara berkala.';
  let recommendedPartNumbers: string[] = [];
  let aiAnalysis = 'Sistem merekomendasikan penggantian komponen penyaring dan pengereman presisi.';
  const maintenance250h = 'Penggantian Filter Oli Mesin & Pembersihan Filter Udara.';
  const maintenance500h = 'Penggantian Filter Solar Utama & Filter Solar Sekunder.';
  const maintenance1000h = 'Penggantian Elemen Filter Hidrolik, Gasket Head, dan Kit Seal Silinder Utama.';

  if (b === 'CATERPILLAR') {
    brandSummary = 'Unit Forklift & Excavator Caterpillar membutuhkan komponen pengereman presisi tinggi dan penyaringan bahan bakar efisiensi 10 mikron.';
    fastMovingAdvice = 'Ganti filter oli 1R-0716 dan periksa kampas rem set 91B46-10313 setiap 250 jam kerja.';
    recommendedPartNumbers = ['91A46-10100', '91B46-10313', '91366-04100', '91446-10010', '1R-0716'];
  } else if (b === 'TOYOTA') {
    brandSummary = 'Forklift Toyota seri 7FD/8FD terkenal andal, sangat sensitif terhadap keausan kampas rem tromol dan starter motor.';
    fastMovingAdvice = 'Utamakan penggantian Kampas Rem Set 47400-30510-71 dan Starter Motor 28100-23430-71.';
    recommendedPartNumbers = ['47400-30510-71', '28100-23430-71'];
  } else if (b === 'TCM') {
    brandSummary = 'Forklift TCM seri FD30T3 mengandalkan tekanan pompa hidrolik utama hingga 250 Bar, membutuhkan O-Ring & Seal Kit berkualitas.';
    fastMovingAdvice = 'Cek kebocoran kit seal pompa hidrolik 214A2-40201 untuk menjaga kecepatan garpu angkat.';
    recommendedPartNumbers = ['214A2-40201'];
  } else if (b === 'KOMATSU') {
    brandSummary = 'Komatsu PC200 & WA380 memerlukan filter solar genuine untuk menjaga kebersihan sistem injeksi kompresi tinggi.';
    fastMovingAdvice = 'Ganti filter bahan bakar 600-211-1340 dan packing rod silinder 708-2L-00300.';
    recommendedPartNumbers = ['600-211-1340', '708-2L-00300'];
  } else if (b === 'MITSUBISHI') {
    brandSummary = 'Mesin Mitsubishi S4S / S6S memerlukan Gasket Head berbahan baja berlapis grafit presisi tinggi tahan suhu tinggi.';
    fastMovingAdvice = 'Ganti Engine Head Gasket ME014833 saat overhaul atau terjadi rembesan kompresi.';
    recommendedPartNumbers = ['ME014833', '91446-10010'];
  }

  if (symptom) {
    const s = symptom.toLowerCase();
    if (s.includes('rem') || s.includes('brake') || s.includes('pakem')) {
      aiAnalysis = 'Gejala pengereman kurang pakem disebabkan keausan kampas rem tromol atau kebocoran seal master cylinder pengereman.';
      recommendedPartNumbers = ['91A46-10100', '91B46-10313', '91446-00900', '47400-30510-71'];
    } else if (s.includes('panas') || s.includes('overheat') || s.includes('air')) {
      aiAnalysis = 'Gejala overheat pada mesin diesel disebabkan kegagalan sirkulasi water pump atau thermostat yang macet.';
      recommendedPartNumbers = ['91446-10010', '32B45-10030'];
    } else if (s.includes('hidrolik') || s.includes('bocor') || s.includes('garpu')) {
      aiAnalysis = 'Turunnya garpu saat angkat beban mengindikasikan ausnya seal packing silinder tilt/lift hidrolik.';
      recommendedPartNumbers = ['91366-04100', '91E65-02100', '91465-01500', '214A2-40201'];
    } else if (s.includes('stater') || s.includes('aki') || s.includes('mati')) {
      aiAnalysis = 'Sulit starter atau arus listrik drop mengindikasikan masalah dinamo stater 12V/24V atau alternator pengisian.';
      recommendedPartNumbers = ['32A68-00800', '32B66-00100', '28100-23430-71'];
    }
  }

  if (query) {
    aiAnalysis = `Hasil Analisis AI untuk "${query}": Disarankan memeriksa spesifikasi part number presisi yang kompatibel dengan tipe mesin unit Anda.`;
  }

  return {
    brandSummary,
    fastMovingAdvice,
    recommendedPartNumbers,
    aiAnalysis,
    maintenance250h,
    maintenance500h,
    maintenance1000h,
  };
}
