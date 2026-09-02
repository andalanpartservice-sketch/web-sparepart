const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Supabase URL or Key missing in .env.local!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

const SEED_PRODUCTS = [
  {
    part_number: '1R-0716',
    name: 'Oil Filter Engine High Efficiency',
    brand: 'Caterpillar',
    category: 'Filter',
    compatible_models: ['CAT 320D', 'CAT 320E', 'CAT 950H', 'CAT D6R'],
    price: 485000.00,
    stock_status: 'READY',
    image_url: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&auto=format&fit=crop&q=80',
    description: 'Filter oli mesin efisiensi tinggi untuk ekskavator dan dozer Caterpillar. Melindungi sistem pelumasan dari partikel kontaminan hingga 10 mikron.'
  },
  {
    part_number: '600-211-1340',
    name: 'Fuel Filter Element Main',
    brand: 'Komatsu',
    category: 'Filter',
    compatible_models: ['Komatsu PC200-8', 'Komatsu PC300-8', 'Komatsu WA380-6'],
    price: 375000.00,
    stock_status: 'READY',
    image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    description: 'Elemen filter bahan bakar utama Komatsu Genuine Part. Memastikan suplai solar bersih ke sistem injeksi kompresi tinggi.'
  },
  {
    part_number: '47400-30510-71',
    name: 'Brake Shoe Set Heavy Duty',
    brand: 'Toyota',
    category: 'Brake',
    compatible_models: ['Toyota 8FD25', 'Toyota 8FD30', 'Toyota 8FG25', 'Toyota 8FG30'],
    price: 650000.00,
    stock_status: 'READY',
    image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
    description: 'Kampas rem set roda depan forklift Toyota seri 8fd30 / 8fg30. Daya cengkeram tinggi tahan panas untuk pengoperasian kontinyu.'
  },
  {
    part_number: '214A2-40201',
    name: 'Hydraulic Main Pump Seal Kit',
    brand: 'TCM',
    category: 'Hydraulic',
    compatible_models: ['TCM FD30T3', 'TCM FD35T3S', 'TCM FG25T3'],
    price: 890000.00,
    stock_status: 'READY',
    image_url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80',
    description: 'Kit seal membran dan O-ring silinder hidrolik pompa utama Forklift TCM 3 Ton. Tahan tekanan tinggi hingga 250 Bar.'
  },
  {
    part_number: 'ME014833',
    name: 'Engine Head Gasket Set Steel',
    brand: 'Mitsubishi',
    category: 'Engine',
    compatible_models: ['Mitsubishi S4S', 'Mitsubishi S6S', 'Caterpillar DP30'],
    price: 1250000.00,
    stock_status: 'INDENT',
    image_url: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=800&auto=format&fit=crop&q=80',
    description: 'Gasket cylinder head berbahan baja berlapis grafit presisi tinggi untuk mesin Mitsubishi S4S dan S6S Forklift.'
  },
  {
    part_number: '28100-23430-71',
    name: 'Starter Motor Assembly 24V',
    brand: 'Toyota',
    category: 'Electrical',
    compatible_models: ['Toyota 7FD35', 'Toyota 8FD40', 'Toyota 8FD50'],
    price: 3450000.00,
    stock_status: 'READY',
    image_url: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&auto=format&fit=crop&q=80',
    description: 'Motor stater 24 Volt heavy duty untuk unit forklift Toyota kapasitas besar 3.5 - 5 Ton.'
  },
  {
    part_number: '708-2L-00300',
    name: 'Hydraulic Cylinder Rod Packing Kit',
    brand: 'Komatsu',
    category: 'Hydraulic',
    compatible_models: ['Komatsu PC130-7', 'Komatsu PC200-7', 'Komatsu PC200-8'],
    price: 1150000.00,
    stock_status: 'READY',
    image_url: 'https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=800&auto=format&fit=crop&q=80',
    description: 'Packing rod silinder arm & boom ekskavator Komatsu PC200. Mencegah kebocoran oli hidrolik pada beban kerja ekstra berat.'
  },
  {
    part_number: '1R-0749',
    name: 'Secondary Fuel Filter Spin-On',
    brand: 'Caterpillar',
    category: 'Filter',
    compatible_models: ['CAT 320D', 'CAT 330D', 'CAT 773F'],
    price: 520000.00,
    stock_status: 'READY',
    image_url: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&auto=format&fit=crop&q=80',
    description: 'Filter solar sekunder model spin-on untuk perlindungan presisi injektor Common Rail Caterpillar.'
  }
];

async function seed() {
  console.log('Inserting seed products to Supabase...');
  const { data, error } = await supabase.from('products').upsert(SEED_PRODUCTS, { onConflict: 'part_number' }).select();
  
  if (error) {
    console.error('Error seeding products:', error.message);
  } else {
    console.log(`Successfully seeded ${data.length} products to live Supabase database!`);
  }
}

seed();
