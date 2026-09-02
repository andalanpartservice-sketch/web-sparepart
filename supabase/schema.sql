-- Enable pgcrypto for UUID generation if needed
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    part_number TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    category TEXT NOT NULL,
    compatible_models TEXT[] NOT NULL,
    price NUMERIC(12, 2) NOT NULL,
    stock_status TEXT CHECK (stock_status IN ('READY', 'INDENT')) DEFAULT 'READY',
    image_url TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_code TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    shipping_address TEXT NOT NULL,
    payment_method TEXT CHECK (payment_method IN ('BANK_TRANSFER', 'COD', 'CBD')) NOT NULL,
    payment_proof_url TEXT,
    order_status TEXT CHECK (order_status IN ('PENDING', 'VERIFIED', 'PROCESSING', 'SHIPPED', 'CANCELLED')) DEFAULT 'PENDING',
    total_amount NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE RESTRICT,
    quantity INT NOT NULL CHECK (quantity > 0),
    price_at_purchase NUMERIC(12, 2) NOT NULL
);

-- 4. EMERGENCY INQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.emergency_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    whatsapp_number TEXT NOT NULL,
    machine_model TEXT NOT NULL,
    description TEXT NOT NULL,
    photo_urls TEXT[] DEFAULT '{}',
    status TEXT CHECK (status IN ('NEW', 'CONTACTED', 'SOLVED')) DEFAULT 'NEW',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for high speed search on part_number, brand, and category
CREATE INDEX IF NOT EXISTS idx_products_part_number ON public.products (part_number);
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products (brand);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products (category);
CREATE INDEX IF NOT EXISTS idx_orders_order_code ON public.orders (order_code);
CREATE INDEX IF NOT EXISTS idx_emergency_status ON public.emergency_inquiries (status);

-- SUPABASE STORAGE BUCKET CREATION (Execute via Supabase SQL Editor if buckets do not exist)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('emergency-parts', 'emergency-parts', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('payment-proofs', 'payment-proofs', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- STORAGE POLICIES
CREATE POLICY "Public Read Emergency Bucket" ON storage.objects FOR SELECT USING (bucket_id = 'emergency-parts');
CREATE POLICY "Public Insert Emergency Bucket" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'emergency-parts');

CREATE POLICY "Public Read Payment Proofs Bucket" ON storage.objects FOR SELECT USING (bucket_id = 'payment-proofs');
CREATE POLICY "Public Insert Payment Proofs Bucket" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'payment-proofs');

CREATE POLICY "Public Read Products Bucket" ON storage.objects FOR SELECT USING (bucket_id = 'products');

-- SEED INITIAL PRODUCTS DATA
INSERT INTO public.products (part_number, name, brand, category, compatible_models, price, stock_status, image_url, description) VALUES
('1R-0716', 'Oil Filter Engine High Efficiency', 'Caterpillar', 'Filter', ARRAY['CAT 320D', 'CAT 320E', 'CAT 950H', 'CAT D6R'], 485000.00, 'READY', 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&auto=format&fit=crop&q=80', 'Filter oli mesin efisiensi tinggi untuk ekskavator dan dozer Caterpillar. Melindungi sistem pelumasan dari partikel kontaminan hingga 10 mikron.'),

('600-211-1340', 'Fuel Filter Element Main', 'Komatsu', 'Filter', ARRAY['Komatsu PC200-8', 'Komatsu PC300-8', 'Komatsu WA380-6'], 375000.00, 'READY', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80', 'Elemen filter bahan bakar utama Komatsu Genuine Part. Memastikan suplai solar bersih ke sistem ke sistem injeksi kompresi tinggi.'),

('47400-30510-71', 'Brake Shoe Set Heavy Duty', 'Toyota', 'Brake', ARRAY['Toyota 8FD25', 'Toyota 8FD30', 'Toyota 8FG25', 'Toyota 8FG30'], 650000.00, 'READY', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80', 'Kampas rem set roda depan forklift Toyota seri 8fd30 / 8fg30. Daya cengkeram tinggi tahan panas untuk pengoperasian kontinyu.'),

('214A2-40201', 'Hydraulic Main Pump Seal Kit', 'TCM', 'Hydraulic', ARRAY['TCM FD30T3', 'TCM FD35T3S', 'TCM FG25T3'], 890000.00, 'READY', 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80', 'Kit seal membran dan O-ring silinder hidrolik pompa utama Forklift TCM 3 Ton. Tahan tekanan tinggi hingga 250 Bar.'),

('ME014833', 'Engine Head Gasket Set Steel', 'Mitsubishi', 'Engine', ARRAY['Mitsubishi S4S', 'Mitsubishi S6S', 'Caterpillar DP30'], 1250000.00, 'INDENT', 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=800&auto=format&fit=crop&q=80', 'Gasket cylinder head berbahan baja berlapis grafit presisi tinggi untuk mesin Mitsubishi S4S dan S6S Forklift.'),

('28100-23430-71', 'Starter Motor Assembly 24V', 'Toyota', 'Electrical', ARRAY['Toyota 7FD35', 'Toyota 8FD40', 'Toyota 8FD50'], 3450000.00, 'READY', 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&auto=format&fit=crop&q=80', 'Motor stater 24 Volt heavy duty untuk unit forklift Toyota kapasitas besar 3.5 - 5 Ton.'),

('708-2L-00300', 'Hydraulic Cylinder Rod Packing Kit', 'Komatsu', 'Hydraulic', ARRAY['Komatsu PC130-7', 'Komatsu PC200-7', 'Komatsu PC200-8'], 1150000.00, 'READY', 'https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=800&auto=format&fit=crop&q=80', 'Packing rod silinder arm & boom ekskavator Komatsu PC200. Mencegah kebocoran oli hidrolik pada beban kerja ekstra berat.'),

('1R-0749', 'Secondary Fuel Filter Spin-On', 'Caterpillar', 'Filter', ARRAY['CAT 320D', 'CAT 330D', 'CAT 773F'], 520000.00, 'READY', 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&auto=format&fit=crop&q=80', 'Filter solar sekunder model spin-on untuk perlindungan presisi injektor Common Rail Caterpillar.'),

('91A46-10100', 'Brake Master Cylinder Assembly', 'Caterpillar', 'Brake', ARRAY['CAT DP20', 'CAT DP25', 'CAT DP30', 'CAT GP25'], 1450000.00, 'READY', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80', 'Master rem utama presisi tinggi untuk unit forklift Caterpillar kapasitas 2.0 - 3.0 Ton. Memastikan tekanan fluida pengereman hidrolik stabil dan responsif.'),

('91B46-10313', 'Brake Shoe Set Front Heavy Duty', 'Caterpillar', 'Brake', ARRAY['CAT DP20', 'CAT DP25', 'CAT DP30', 'CAT GP25'], 780000.00, 'READY', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80', 'Set kampas rem roda depan tahan gesekan dan panas tinggi, dirancang khusus untuk forklift Caterpillar tipe DP25 & DP30 pengoperasian beban berat.'),

('91446-00900', 'Wheel Cylinder Assembly Left/Right', 'Caterpillar', 'Brake', ARRAY['CAT DP25', 'CAT DP30', 'CAT GP25', 'CAT GP30'], 450000.00, 'READY', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80', 'Silinder roda pengereman tromol depan forklift Caterpillar. Dilengkapi seal anti bocor tahan cairan rem DOT3/DOT4.'),

('91366-04100', 'Hydraulic Return Oil Filter Element', 'Caterpillar', 'Hydraulic', ARRAY['CAT DP20', 'CAT DP25', 'CAT DP30', 'CAT DP35', 'CAT GP25'], 420000.00, 'READY', 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80', 'Elemen filter oli hidrolik saluran balik (return line) forklift Caterpillar. Menyaring kontaminan hingga 10 mikron untuk menjaga pompa dan katup hidrolik.'),

('91E65-02100', 'Tilt Cylinder Seal Kit Heavy Duty', 'Caterpillar', 'Hydraulic', ARRAY['CAT DP25', 'CAT DP30', 'CAT DP35'], 680000.00, 'READY', 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80', 'Kit seal silinder tilt (kemiringan mast) forklift Caterpillar. Terdiri dari wiper seal, rod packing, dan O-ring tahan tekanan hidrolik tinggi.'),

('91465-01500', 'Main Lift Cylinder Seal Repair Kit', 'Caterpillar', 'Hydraulic', ARRAY['CAT DP25', 'CAT DP30'], 850000.00, 'READY', 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80', 'Repair kit seal silinder angkat utama (main mast lift cylinder) forklift Caterpillar DP25/DP30. Mencegah penurunan garpu saat membawa beban berat.'),

('91446-10010', 'Engine Water Pump Assembly Mitsubishi S4S', 'Caterpillar', 'Engine', ARRAY['CAT DP20', 'CAT DP25', 'CAT DP30', 'CAT DP35'], 1650000.00, 'READY', 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=800&auto=format&fit=crop&q=80', 'Pompa air pendingin (water pump) mesin diesel Mitsubishi S4S / S6S pada forklift Caterpillar DP25 dan DP30. Menjaga sirkulasi pendingin blok mesin.'),

('32B45-10030', 'Engine Thermostat 76.5°C', 'Caterpillar', 'Engine', ARRAY['CAT DP20', 'CAT DP25', 'CAT DP30', 'CAT DP35', 'CAT DP50'], 290000.00, 'READY', 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=800&auto=format&fit=crop&q=80', 'Thermostat kontrol suhu air pendingin mesin forklift Caterpillar. Membuka presisi pada suhu 76.5°C untuk cegah mesin overheat.'),

('32A68-00800', 'Alternator Assembly 12V 50A', 'Caterpillar', 'Electrical', ARRAY['CAT DP20', 'CAT DP25', 'CAT DP30', 'CAT GP25'], 2850000.00, 'READY', 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&auto=format&fit=crop&q=80', 'Alternator pengisian daya aki 12 Volt 50 Ampere heavy duty untuk forklift Caterpillar mesin S4S / K21.'),

('32B66-00100', 'Starter Motor Assembly 12V 2.8kW', 'Caterpillar', 'Electrical', ARRAY['CAT DP25', 'CAT DP30', 'CAT DP35'], 3200000.00, 'READY', 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&auto=format&fit=crop&q=80', 'Motor starter 12 Volt 2.8kW torsi tinggi untuk menghidupkan mesin diesel forklift Caterpillar DP25-DP35 kondisi dingin maupun panas.'),

('91361-00800', 'Air Filter Outer Element Heavy Duty', 'Caterpillar', 'Filter', ARRAY['CAT DP20', 'CAT DP25', 'CAT DP30', 'CAT GP20', 'CAT GP25'], 310000.00, 'READY', 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&auto=format&fit=crop&q=80', 'Filter udara luar pelindung mesin forklift Caterpillar dari debu dan partikel lapangan pabrik / gudang.'),

('91366-01300', 'Torque Converter Transmission Oil Filter', 'Caterpillar', 'Filter', ARRAY['CAT DP25', 'CAT DP30', 'CAT DP35', 'CAT DP50'], 495000.00, 'READY', 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&auto=format&fit=crop&q=80', 'Filter oli transmisi otomatis (Powershift Torque Converter) forklift Caterpillar. Menyaring sisa gesekan plat kopling transmisi.')
ON CONFLICT (part_number) DO NOTHING;
