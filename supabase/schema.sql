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
    is_fast_moving BOOLEAN DEFAULT false,
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

-- PRODUCTS TABLE RLS POLICIES
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Products" ON public.products;
DROP POLICY IF EXISTS "Public Insert Products" ON public.products;
DROP POLICY IF EXISTS "Public Update Products" ON public.products;
DROP POLICY IF EXISTS "Public Delete Products" ON public.products;

CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public Insert Products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Products" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Public Delete Products" ON public.products FOR DELETE USING (true);

-- SEED INITIAL PRODUCTS DATA FOR ALL 5 FORKLIFT SYSTEMS
INSERT INTO public.products (part_number, name, brand, category, compatible_models, price, stock_status, image_url, description, is_fast_moving) VALUES
('C-1505', 'Engine Oil Filter Sakura C-1505 / Isuzu OEM', 'Toyota', 'Filter', ARRAY['Toyota 8FD25', 'Toyota 8FD30', 'Isuzu C240', 'Isuzu 4JG2'], 185000.00, 'READY', 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&auto=format&fit=crop&q=80', 'Filter oli mesin Sakura C-1505 OEM Isuzu C240 / 4JG2 untuk forklift Toyota & TCM. Efisiensi tinggi menyaring kontaminan oli.', true),

('F-1502', 'Fuel Filter Element Sakura F-1502 / Isuzu OEM', 'TCM', 'Filter', ARRAY['TCM FD30T3', 'TCM FD25T3', 'Isuzu C240'], 210000.00, 'READY', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80', 'Elemen filter bahan bakar Sakura F-1502 untuk mesin diesel Isuzu C240 forklift TCM. Memastikan suplai solar bersih ke pompa injeksi.', true),

('A-1502', 'Air Filter Element Set Sakura A-1502/A-1503 (Outer/Inner)', 'Komatsu', 'Filter', ARRAY['Komatsu FD25T-16', 'Komatsu FD30T-16', 'Komatsu FD35T-10'], 320000.00, 'READY', 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&auto=format&fit=crop&q=80', 'Set filter udara luar dan dalam Sakura A-1502/A-1503 untuk perlindungan ganda mesin forklift Komatsu dari debu pabrik.', true),

('V-BELT-A38', 'Engine Fan Belt V-Belt Heavy Duty Tipe A38', 'Mitsubishi', 'Engine', ARRAY['Mitsubishi S4S', 'Mitsubishi S6S', 'Caterpillar DP30'], 95000.00, 'READY', 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=800&auto=format&fit=crop&q=80', 'V-belt (fan belt) tali kipas mesin diesel tife A38 berbahan karet sintetis tahan gesekan dan panas tinggi.', true),

('11065-43G01', 'Glow Plug Busi Pemanas Diesel 12V', 'Komatsu', 'Engine', ARRAY['Komatsu FD25T-16', 'Nissan TD27', 'Isuzu C240'], 240000.00, 'READY', 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&auto=format&fit=crop&q=80', 'Busi pemanas (glow plug) 12 Volt untuk kemudahan stater mesin diesel forklift saat kondisi suhu dingin.', true),

('91446-10010', 'Engine Water Pump Assembly Mitsubishi S4S', 'Caterpillar', 'Engine', ARRAY['CAT DP20', 'CAT DP25', 'CAT DP30', 'Mitsubishi S4S'], 1650000.00, 'READY', 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=800&auto=format&fit=crop&q=80', 'Pompa air pendingin (water pump) mesin diesel Mitsubishi S4S pada forklift Caterpillar DP25/DP30. Menjaga sirkulasi air radiator.', true),

('32B45-10030', 'Engine Thermostat 76.5°C Assembly', 'Caterpillar', 'Engine', ARRAY['CAT DP20', 'CAT DP25', 'CAT DP30', 'CAT DP50'], 290000.00, 'READY', 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=800&auto=format&fit=crop&q=80', 'Thermostat pengatur suhu air pendingin mesin forklift Caterpillar. Membuka presisi pada 76.5°C cegah mesin overheat.', true),

('093400-5320', 'Fuel Injector Nozzle Solar Diesel', 'Toyota', 'Engine', ARRAY['Toyota 7FD25', 'Toyota 8FD30', 'Toyota 1DZ-II', 'Toyota 2Z'], 450000.00, 'READY', 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=800&auto=format&fit=crop&q=80', 'Nozzle injektor bahan bakar solar presisi tinggi untuk pembakaran optimal & penghematan bahan bakar mesin Toyota 1DZ/2Z.', true),

('5-87813-059-0', 'Engine Piston Kit Set Complete (Piston, Ring, Pin)', 'TCM', 'Engine', ARRAY['TCM FD30T3', 'Isuzu C240', 'Toyota 8FD30'], 2850000.00, 'INDENT', 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=800&auto=format&fit=crop&q=80', 'Set piston mesin komplit (Piston, Ring Piston, Pin, dan Snap Ring) untuk overhaul mesin diesel Isuzu C240 Forklift TCM.', false),

('ME014833', 'Engine Gasket Overhaul Set Top & Bottom', 'Mitsubishi', 'Engine', ARRAY['Mitsubishi S4S', 'Mitsubishi S6S', 'Caterpillar DP30'], 1450000.00, 'READY', 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=800&auto=format&fit=crop&q=80', 'Paking set (top & bottom overhaul) berbahan baja berlapis grafit presisi tinggi untuk mesin Mitsubishi S4S & S6S.', false),

('216A2-80201', 'Torque Converter Assembly Automatic Transmission', 'TCM', 'Engine', ARRAY['TCM FD30T3', 'TCM FD35T3S', 'TCM FG25T3'], 6850000.00, 'INDENT', 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80', 'Unit kopling hidrolik (Torque Converter) transmisi matic Powershift Forklift TCM 3 Ton. Penyaluran tenaga maksimal.', false),

('91446-00600', 'Transmission Clutch Disc Friction Plate', 'Caterpillar', 'Brake', ARRAY['CAT DP25', 'CAT DP30', 'CAT GP25', 'TCM FD30T3'], 480000.00, 'READY', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80', 'Plat kopling transmisi (friction disc) berbahan bronze-metalik tahan gesekan tinggi untuk transmisi matic forklift.', true),

('91366-01300-KIT', 'Automatic Transmission Repair Seal Kit', 'Toyota', 'Brake', ARRAY['Toyota 7FD30', 'Toyota 8FD30', 'Toyota 8FG25'], 890000.00, 'READY', 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80', 'Sil kit perbaikan transmisi otomatis Powershift. Mencegah kebocoran oli transmisi dan tekanan geser berlebih.', true),

('91A46-10100', 'Brake Master Cylinder Assembly', 'Caterpillar', 'Brake', ARRAY['CAT DP20', 'CAT DP25', 'CAT DP30', 'CAT GP25'], 1450000.00, 'READY', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80', 'Master rem utama presisi tinggi untuk unit forklift Caterpillar kapasitas 2.0 - 3.0 Ton. Pengereman hidrolik stabil & pakem.', true),

('91446-00900', 'Wheel Brake Cylinder Assembly Left/Right', 'Caterpillar', 'Brake', ARRAY['CAT DP25', 'CAT DP30', 'CAT GP25', 'CAT GP30'], 450000.00, 'READY', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80', 'Silinder roda pengereman tromol depan forklift Caterpillar. Dilengkapi seal anti bocor tahan cairan rem DOT3/DOT4.', true),

('47400-30510-71', 'Brake Shoe Set Front Heavy Duty', 'Toyota', 'Brake', ARRAY['Toyota 8FD25', 'Toyota 8FD30', 'Toyota 8FG25', 'Toyota 8FG30'], 650000.00, 'READY', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80', 'Kampas rem set roda depan forklift Toyota seri 8FD30 / 8FG30. Daya cengkeram tinggi tahan panas pengereman kontinyu.', true),

('91366-04100', 'Hydraulic Return Oil Filter Element', 'Caterpillar', 'Hydraulic', ARRAY['CAT DP20', 'CAT DP25', 'CAT DP30', 'CAT DP35', 'CAT GP25'], 420000.00, 'READY', 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80', 'Elemen filter oli hidrolik saluran balik (return line) forklift Caterpillar. Menyaring kontaminan hingga 10 mikron.', true),

('91E65-02100', 'Tilt Cylinder Seal Kit Heavy Duty', 'Caterpillar', 'Hydraulic', ARRAY['CAT DP25', 'CAT DP30', 'CAT DP35'], 680000.00, 'READY', 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80', 'Kit seal silinder tilt (karet sil kemiringan mast) forklift Caterpillar. Terdiri dari wiper seal, rod packing, & O-ring.', true),

('91465-01500', 'Main Lift Cylinder Seal Repair Kit', 'Caterpillar', 'Hydraulic', ARRAY['CAT DP25', 'CAT DP30', 'TCM FD30T3'], 850000.00, 'READY', 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80', 'Repair kit seal silinder angkat utama (karet sil silinder lift) forklift Caterpillar. Mencegah penurunan garpu saat bawa beban.', true),

('MG307-2RS', 'Mast Roller Bearing Heavy Duty', 'Toyota', 'Hydraulic', ARRAY['Toyota 7FD30', 'Toyota 8FD30', 'Toyota 8FD25'], 380000.00, 'READY', 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80', 'Bearing roller pada rel tiang mast forklift Toyota. Tahan gesekan beban angkat vertikal hingga 3.5 Ton.', true),

('LH1044-5M', 'Lifting Chain Rantai Angkat Mast 5 Meter', 'TCM', 'Hydraulic', ARRAY['TCM FD30T3', 'Komatsu FD30T-16', 'Toyota 8FD30'], 1750000.00, 'READY', 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80', 'Rantai angkat (lifting chain) mast forklift tipe LH1044 panjang 5 meter. Berbahan baja alloy tempered beban uji 10 Ton.', false),

('CW-FD30-14T', 'Chain Wheel Sprocket Gear Rantai Mast', 'Komatsu', 'Hydraulic', ARRAY['Komatsu FD30T-16', 'Komatsu FD25T-16'], 520000.00, 'READY', 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80', 'Roda puli gear rantai angkat (chain wheel sprocket) tiang mast forklift Komatsu 3 Ton.', false),

('CV-3S-FD30', 'Hydraulic Control Valve Assembly 3-Spool', 'Toyota', 'Hydraulic', ARRAY['Toyota 7FD30', 'Toyota 8FD30', 'Toyota 8FG25'], 4950000.00, 'INDENT', 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80', 'Katup kontrol distribusi hidrolik (Control valve 3-spool) pengatur fungsi lift, tilt, dan attachment tambahan forklift Toyota.', false),

('91343-00200', 'Steering Axle Knuckle Left/Right', 'Caterpillar', 'Hydraulic', ARRAY['CAT DP25', 'CAT DP30', 'CAT GP25'], 1850000.00, 'READY', 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80', 'Steering knuckle (komponen setir roda belakang) forklift Caterpillar. Konstruksi besi tuang heavy-duty.', false),

('91443-02100', 'Steering Tie Rod End Ball Joint', 'Toyota', 'Hydraulic', ARRAY['Toyota 7FD25', 'Toyota 8FD30', 'Toyota 8FG25'], 540000.00, 'READY', 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80', 'Tie rod end (sambungan setir kemudi) roda belakang forklift Toyota. Presisi tinggi meminimalkan speling setir.', true),

('91343-00100', 'Steering Axle Kingpin & Bearing Repair Kit', 'Caterpillar', 'Hydraulic', ARRAY['CAT DP20', 'CAT DP25', 'CAT DP30', 'CAT GP25'], 1120000.00, 'READY', 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80', 'Kit perbaikan king pin (as putar roda kemudi) dilengkapi bearing thrust & bushing kuningan forklift Caterpillar.', true),

('30209-JR', 'Front/Rear Wheel Tapered Roller Bearing', 'Komatsu', 'Brake', ARRAY['Komatsu FD25T-16', 'Komatsu FD30T-16', 'Toyota 8FD30'], 275000.00, 'READY', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80', 'Bearing roda (wheel bearing) tipe tapered roller presisi tinggi tahan beban dorong radial & aksial roda forklift.', true),

('TIRE-700-12', 'Solid Forklift Tire 7.00-12 Industrial Heavy Duty', 'Toyota', 'Hydraulic', ARRAY['Toyota 8FD25', 'Toyota 8FD30', 'TCM FD30T3', 'Komatsu FD30T-16'], 2450000.00, 'READY', 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80', 'Ban mati (Solid Tire) forklift ukuran 7.00-12 bebas bocor & tahan tusukan paku untuk medan pabrik / pergudangan.', true),

('32B66-00100', 'Starter Motor Assembly 12V 2.8kW Heavy Duty', 'Caterpillar', 'Electrical', ARRAY['CAT DP25', 'CAT DP30', 'CAT DP35', 'Mitsubishi S4S'], 3200000.00, 'READY', 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&auto=format&fit=crop&q=80', 'Motor starter (dinamo starter) 12 Volt 2.8kW torsi tinggi untuk menghidupkan mesin diesel forklift kondisi dingin/panas.', true),

('32A68-00800', 'Alternator Assembly 12V 50A Heavy Duty', 'Caterpillar', 'Electrical', ARRAY['CAT DP20', 'CAT DP25', 'CAT DP30', 'CAT GP25'], 2850000.00, 'READY', 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&auto=format&fit=crop&q=80', 'Alternator (dinamo pengisian aki) 12 Volt 50 Ampere heavy-duty dilengkapi IC regulator otomatis.', true),

('ACCU-12V70AH', 'Forklift Heavy Duty Battery Accu 12V 70Ah', 'Komatsu', 'Electrical', ARRAY['Komatsu FD25T-16', 'Toyota 8FD30', 'TCM FD30T3'], 1350000.00, 'READY', 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&auto=format&fit=crop&q=80', 'Aki/Battery forklift 12 Volt 70Ah daya stater tinggi (CCA tinggi) tahan getaran mesin diesel.', true),

('91A28-10010', 'Ignition Starter Key Switch Assembly', 'Caterpillar', 'Electrical', ARRAY['CAT DP25', 'CAT DP30', 'CAT GP25', 'TCM FD30T3'], 350000.00, 'READY', 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&auto=format&fit=crop&q=80', 'Kunci kontak starter (Ignition Key Switch) komplit dengan 2 kunci serep untuk forklift Caterpillar & TCM.', true),

('LAMP-LED-24V', 'Forklift Front Headlamp & Rear Tail Lamp LED Set 24V', 'Toyota', 'Electrical', ARRAY['Toyota 7FD30', 'Toyota 8FD30', 'Komatsu FD30T-16'], 420000.00, 'READY', 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&auto=format&fit=crop&q=80', 'Set lampu depan LED dan lampu belakang kombinasi 24V hemat energi & terang untuk kerja malam di pergudangan.', true)
ON CONFLICT (part_number) DO NOTHING;
