-- =====================================================
-- SCRIPT LENGKAP UNTUK MEMBUAT SEMUA TABEL R-KAS (FIXED VERSION)
-- =====================================================
-- Jalankan script ini di Supabase SQL Editor untuk membuat semua tabel yang diperlukan
-- Script ini sudah diperbaiki untuk menangani objek yang sudah ada

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. TABEL USER_PROFILES
-- =====================================================

-- Users profile table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'user', 'viewer')),
    department VARCHAR(100),
    phone VARCHAR(20),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. TABEL MASTER DATA
-- =====================================================

-- Bidang (Fields)
CREATE TABLE IF NOT EXISTS public.bidang (
    id BIGSERIAL PRIMARY KEY,
    kode VARCHAR(20) UNIQUE NOT NULL,
    nama VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Standar (Standards)
CREATE TABLE IF NOT EXISTS public.standar (
    id BIGSERIAL PRIMARY KEY,
    kode VARCHAR(20) UNIQUE NOT NULL,
    nama VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Giat (Activities)
CREATE TABLE IF NOT EXISTS public.giat (
    id BIGSERIAL PRIMARY KEY,
    kode VARCHAR(20) UNIQUE NOT NULL,
    nama VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dana (Funding Sources)
CREATE TABLE IF NOT EXISTS public.dana (
    id BIGSERIAL PRIMARY KEY,
    kode VARCHAR(20) UNIQUE NOT NULL,
    nama VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rekening (Accounts)
CREATE TABLE IF NOT EXISTS public.rekening (
    id BIGSERIAL PRIMARY KEY,
    kode VARCHAR(20) UNIQUE NOT NULL,
    nama VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Komponen (Components)
CREATE TABLE IF NOT EXISTS public.komponen (
    id BIGSERIAL PRIMARY KEY,
    kode VARCHAR(20) UNIQUE NOT NULL,
    nama VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. TABEL UTAMA KERTAS KERJA PERUBAHAN
-- =====================================================

CREATE TABLE IF NOT EXISTS public.kertas_kerja_perubahan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Identifikasi
    kode_bidang VARCHAR(20),
    nama_bidang VARCHAR(255),
    kode_standar VARCHAR(20),
    nama_standar VARCHAR(255),
    id_giat VARCHAR(50),
    kode_giat VARCHAR(20),
    nama_giat VARCHAR(255),
    kode_dana VARCHAR(20),
    nama_dana VARCHAR(255),
    kode_rekening VARCHAR(20),
    nama_rekening VARCHAR(255),
    kode_komponen VARCHAR(20),
    nama_komponen VARCHAR(255),
    
    -- Detail
    uraian TEXT,
    spesifikasi TEXT,
    satuan VARCHAR(50),
    kuantitas DECIMAL(15,2),
    harga_satuan DECIMAL(15,2),
    jumlah DECIMAL(15,2),
    
    -- Anggaran per bulan
    bulan_1 DECIMAL(15,2) DEFAULT 0,
    bulan_2 DECIMAL(15,2) DEFAULT 0,
    bulan_3 DECIMAL(15,2) DEFAULT 0,
    bulan_4 DECIMAL(15,2) DEFAULT 0,
    bulan_5 DECIMAL(15,2) DEFAULT 0,
    bulan_6 DECIMAL(15,2) DEFAULT 0,
    bulan_7 DECIMAL(15,2) DEFAULT 0,
    bulan_8 DECIMAL(15,2) DEFAULT 0,
    bulan_9 DECIMAL(15,2) DEFAULT 0,
    bulan_10 DECIMAL(15,2) DEFAULT 0,
    bulan_11 DECIMAL(15,2) DEFAULT 0,
    bulan_12 DECIMAL(15,2) DEFAULT 0,
    
    -- Anggaran per triwulan
    tw_1 DECIMAL(15,2) DEFAULT 0,
    tw_2 DECIMAL(15,2) DEFAULT 0,
    tw_3 DECIMAL(15,2) DEFAULT 0,
    tw_4 DECIMAL(15,2) DEFAULT 0,
    
    -- Realisasi per bulan
    realisasi_bulan_1 DECIMAL(15,2) DEFAULT 0,
    realisasi_bulan_2 DECIMAL(15,2) DEFAULT 0,
    realisasi_bulan_3 DECIMAL(15,2) DEFAULT 0,
    realisasi_bulan_4 DECIMAL(15,2) DEFAULT 0,
    realisasi_bulan_5 DECIMAL(15,2) DEFAULT 0,
    realisasi_bulan_6 DECIMAL(15,2) DEFAULT 0,
    realisasi_bulan_7 DECIMAL(15,2) DEFAULT 0,
    realisasi_bulan_8 DECIMAL(15,2) DEFAULT 0,
    realisasi_bulan_9 DECIMAL(15,2) DEFAULT 0,
    realisasi_bulan_10 DECIMAL(15,2) DEFAULT 0,
    realisasi_bulan_11 DECIMAL(15,2) DEFAULT 0,
    realisasi_bulan_12 DECIMAL(15,2) DEFAULT 0,
    
    -- Realisasi per triwulan
    realisasi_tw_1 DECIMAL(15,2) DEFAULT 0,
    realisasi_tw_2 DECIMAL(15,2) DEFAULT 0,
    realisasi_tw_3 DECIMAL(15,2) DEFAULT 0,
    realisasi_tw_4 DECIMAL(15,2) DEFAULT 0,
    
    -- Total
    total_akb DECIMAL(15,2) DEFAULT 0,
    total_realisasi DECIMAL(15,2) DEFAULT 0,
    sisa_anggaran DECIMAL(15,2) DEFAULT 0,
    persentase_realisasi DECIMAL(5,2) DEFAULT 0,
    
    -- Metadata
    tahun INTEGER,
    status VARCHAR(50) DEFAULT 'draft',
    catatan TEXT,
    created_by UUID REFERENCES public.user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. TABEL PENDUKUNG LAINNYA
-- =====================================================

-- Budget Categories
CREATE TABLE IF NOT EXISTS public.budget_categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    budget_limit DECIMAL(15,2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activities
CREATE TABLE IF NOT EXISTS public.activities (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    status VARCHAR(50) DEFAULT 'planned',
    start_date DATE,
    end_date DATE,
    budget DECIMAL(15,2),
    created_by UUID REFERENCES public.user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. INDEXES UNTUK PERFORMA
-- =====================================================

-- User profiles indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_auth_id ON public.user_profiles(auth_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);

-- Kertas kerja perubahan indexes
CREATE INDEX IF NOT EXISTS idx_kkp_tahun ON public.kertas_kerja_perubahan(tahun);
CREATE INDEX IF NOT EXISTS idx_kkp_bidang ON public.kertas_kerja_perubahan(nama_bidang);
CREATE INDEX IF NOT EXISTS idx_kkp_standar ON public.kertas_kerja_perubahan(nama_standar);
CREATE INDEX IF NOT EXISTS idx_kkp_giat ON public.kertas_kerja_perubahan(nama_giat);
CREATE INDEX IF NOT EXISTS idx_kkp_dana ON public.kertas_kerja_perubahan(nama_dana);
CREATE INDEX IF NOT EXISTS idx_kkp_rekening ON public.kertas_kerja_perubahan(nama_rekening);
CREATE INDEX IF NOT EXISTS idx_kkp_status ON public.kertas_kerja_perubahan(status);
CREATE INDEX IF NOT EXISTS idx_kkp_created_at ON public.kertas_kerja_perubahan(created_at);

-- Master data indexes
CREATE INDEX IF NOT EXISTS idx_bidang_kode ON public.bidang(kode);
CREATE INDEX IF NOT EXISTS idx_standar_kode ON public.standar(kode);
CREATE INDEX IF NOT EXISTS idx_giat_kode ON public.giat(kode);
CREATE INDEX IF NOT EXISTS idx_dana_kode ON public.dana(kode);
CREATE INDEX IF NOT EXISTS idx_rekening_kode ON public.rekening(kode);
CREATE INDEX IF NOT EXISTS idx_komponen_kode ON public.komponen(kode);

-- =====================================================
-- 6. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kertas_kerja_perubahan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bidang ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.standar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.giat ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dana ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rekening ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.komponen ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 7. DROP EXISTING POLICIES (JIKA ADA)
-- =====================================================

-- User profiles policies
DROP POLICY IF EXISTS "Users can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.user_profiles;

-- Kertas kerja perubahan policies
DROP POLICY IF EXISTS "Allow read access for authenticated users" ON public.kertas_kerja_perubahan;
DROP POLICY IF EXISTS "Allow write access for authenticated users" ON public.kertas_kerja_perubahan;

-- Master data policies
DROP POLICY IF EXISTS "Allow read access for authenticated users" ON public.bidang;
DROP POLICY IF EXISTS "Allow write access for admin users" ON public.bidang;
DROP POLICY IF EXISTS "Allow read access for authenticated users" ON public.standar;
DROP POLICY IF EXISTS "Allow write access for admin users" ON public.standar;
DROP POLICY IF EXISTS "Allow read access for authenticated users" ON public.giat;
DROP POLICY IF EXISTS "Allow write access for admin users" ON public.giat;
DROP POLICY IF EXISTS "Allow read access for authenticated users" ON public.dana;
DROP POLICY IF EXISTS "Allow write access for admin users" ON public.dana;
DROP POLICY IF EXISTS "Allow read access for authenticated users" ON public.rekening;
DROP POLICY IF EXISTS "Allow write access for admin users" ON public.rekening;
DROP POLICY IF EXISTS "Allow read access for authenticated users" ON public.komponen;
DROP POLICY IF EXISTS "Allow write access for admin users" ON public.komponen;
DROP POLICY IF EXISTS "Allow read access for authenticated users" ON public.budget_categories;
DROP POLICY IF EXISTS "Allow write access for authenticated users" ON public.budget_categories;
DROP POLICY IF EXISTS "Allow read access for authenticated users" ON public.activities;
DROP POLICY IF EXISTS "Allow write access for authenticated users" ON public.activities;

-- =====================================================
-- 8. CREATE NEW POLICIES
-- =====================================================

-- User profiles policies
CREATE POLICY "Users can view all profiles" ON public.user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.user_profiles FOR UPDATE USING (auth_id = auth.uid());
CREATE POLICY "Admins can manage all profiles" ON public.user_profiles FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE auth_id = auth.uid() AND role = 'admin')
);

-- Kertas kerja perubahan policies
CREATE POLICY "Allow read access for authenticated users" ON public.kertas_kerja_perubahan FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow write access for authenticated users" ON public.kertas_kerja_perubahan FOR ALL USING (auth.role() = 'authenticated');

-- Master data policies (read for all, write for admin)
CREATE POLICY "Allow read access for authenticated users" ON public.bidang FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow write access for admin users" ON public.bidang FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE auth_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Allow read access for authenticated users" ON public.standar FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow write access for admin users" ON public.standar FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE auth_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Allow read access for authenticated users" ON public.giat FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow write access for admin users" ON public.giat FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE auth_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Allow read access for authenticated users" ON public.dana FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow write access for admin users" ON public.dana FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE auth_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Allow read access for authenticated users" ON public.rekening FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow write access for admin users" ON public.rekening FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE auth_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Allow read access for authenticated users" ON public.komponen FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow write access for admin users" ON public.komponen FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE auth_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Allow read access for authenticated users" ON public.budget_categories FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow write access for authenticated users" ON public.budget_categories FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow read access for authenticated users" ON public.activities FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow write access for authenticated users" ON public.activities FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- 9. FUNCTIONS DAN TRIGGERS
-- =====================================================

-- Function untuk update timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function untuk membuat user profile otomatis saat signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (
        auth_id,
        email,
        full_name,
        role
    ) VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        'user'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing triggers first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
DROP TRIGGER IF EXISTS update_kertas_kerja_perubahan_updated_at ON public.kertas_kerja_perubahan;
DROP TRIGGER IF EXISTS update_bidang_updated_at ON public.bidang;
DROP TRIGGER IF EXISTS update_standar_updated_at ON public.standar;
DROP TRIGGER IF EXISTS update_giat_updated_at ON public.giat;
DROP TRIGGER IF EXISTS update_dana_updated_at ON public.dana;
DROP TRIGGER IF EXISTS update_rekening_updated_at ON public.rekening;
DROP TRIGGER IF EXISTS update_komponen_updated_at ON public.komponen;
DROP TRIGGER IF EXISTS update_budget_categories_updated_at ON public.budget_categories;
DROP TRIGGER IF EXISTS update_activities_updated_at ON public.activities;

-- Create triggers
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update timestamp triggers
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON public.user_profiles 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_kertas_kerja_perubahan_updated_at 
    BEFORE UPDATE ON public.kertas_kerja_perubahan 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bidang_updated_at 
    BEFORE UPDATE ON public.bidang 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_standar_updated_at 
    BEFORE UPDATE ON public.standar 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_giat_updated_at 
    BEFORE UPDATE ON public.giat 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_dana_updated_at 
    BEFORE UPDATE ON public.dana 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rekening_updated_at 
    BEFORE UPDATE ON public.rekening 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_komponen_updated_at 
    BEFORE UPDATE ON public.komponen 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_budget_categories_updated_at 
    BEFORE UPDATE ON public.budget_categories 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_activities_updated_at 
    BEFORE UPDATE ON public.activities 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- 10. GRANT PERMISSIONS
-- =====================================================

-- Grant permissions untuk authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.kertas_kerja_perubahan TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.budget_categories TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.activities TO authenticated;

-- Grant permissions untuk master data
GRANT SELECT ON public.bidang TO authenticated;
GRANT SELECT ON public.standar TO authenticated;
GRANT SELECT ON public.giat TO authenticated;
GRANT SELECT ON public.dana TO authenticated;
GRANT SELECT ON public.rekening TO authenticated;
GRANT SELECT ON public.komponen TO authenticated;

-- Grant usage pada sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant execute permissions pada functions
GRANT EXECUTE ON FUNCTION public.update_updated_at_column() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;

-- =====================================================
-- 11. INSERT DATA SAMPEL
-- =====================================================

-- Insert sample master data
INSERT INTO public.bidang (kode, nama, deskripsi) VALUES
    ('01', 'Bidang Pendidikan', 'Bidang yang menangani kegiatan pendidikan'),
    ('02', 'Bidang Administrasi', 'Bidang yang menangani administrasi sekolah'),
    ('03', 'Bidang Sarana Prasarana', 'Bidang yang menangani sarana dan prasarana')
ON CONFLICT (kode) DO NOTHING;

INSERT INTO public.standar (kode, nama, deskripsi) VALUES
    ('01', 'Standar Nasional', 'Standar yang ditetapkan oleh pemerintah pusat'),
    ('02', 'Standar Daerah', 'Standar yang ditetapkan oleh pemerintah daerah'),
    ('03', 'Standar Sekolah', 'Standar yang ditetapkan oleh sekolah')
ON CONFLICT (kode) DO NOTHING;

INSERT INTO public.giat (kode, nama, deskripsi) VALUES
    ('001', 'Kegiatan Belajar Mengajar', 'Kegiatan utama proses pembelajaran'),
    ('002', 'Kegiatan Ekstrakurikuler', 'Kegiatan di luar jam pelajaran'),
    ('003', 'Kegiatan Administrasi', 'Kegiatan pengelolaan administrasi')
ON CONFLICT (kode) DO NOTHING;

INSERT INTO public.dana (kode, nama, deskripsi) VALUES
    ('BOS', 'Bantuan Operasional Sekolah', 'Dana dari pemerintah pusat'),
    ('BOSDA', 'Bantuan Operasional Sekolah Daerah', 'Dana dari pemerintah daerah'),
    ('KOMITE', 'Dana Komite Sekolah', 'Dana dari komite sekolah')
ON CONFLICT (kode) DO NOTHING;

INSERT INTO public.rekening (kode, nama, deskripsi) VALUES
    ('5.1.1', 'Belanja Pegawai', 'Belanja untuk kepegawaian'),
    ('5.1.2', 'Belanja Barang dan Jasa', 'Belanja untuk barang dan jasa'),
    ('5.1.3', 'Belanja Modal', 'Belanja untuk modal/investasi')
ON CONFLICT (kode) DO NOTHING;

INSERT INTO public.komponen (kode, nama, deskripsi) VALUES
    ('001', 'Komponen Utama', 'Komponen kegiatan utama'),
    ('002', 'Komponen Pendukung', 'Komponen kegiatan pendukung'),
    ('003', 'Komponen Penunjang', 'Komponen kegiatan penunjang')
ON CONFLICT (kode) DO NOTHING;

-- Insert sample budget categories
INSERT INTO public.budget_categories (name, description, budget_limit) VALUES
    ('Operasional', 'Anggaran untuk kegiatan operasional', 100000000),
    ('Investasi', 'Anggaran untuk investasi dan pengembangan', 50000000),
    ('Pemeliharaan', 'Anggaran untuk pemeliharaan fasilitas', 25000000)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 12. VERIFIKASI DAN INFORMASI
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '=== R-KAS DATABASE SETUP COMPLETED SUCCESSFULLY ===';
    RAISE NOTICE '';
    RAISE NOTICE 'Tables created:';
    RAISE NOTICE '- user_profiles (User management)';
    RAISE NOTICE '- kertas_kerja_perubahan (Main R-KAS data)';
    RAISE NOTICE '- bidang, standar, giat, dana, rekening, komponen (Master data)';
    RAISE NOTICE '- budget_categories, activities (Supporting tables)';
    RAISE NOTICE '';
    RAISE NOTICE 'Features enabled:';
    RAISE NOTICE '- Row Level Security (RLS)';
    RAISE NOTICE '- Automatic user profile creation';
    RAISE NOTICE '- Update timestamp triggers';
    RAISE NOTICE '- Performance indexes';
    RAISE NOTICE '- Sample master data';
    RAISE NOTICE '- Proper permissions';
    RAISE NOTICE '';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '1. Create your first admin user by signing up';
    RAISE NOTICE '2. Run: UPDATE public.user_profiles SET role = ''admin'' WHERE email = ''your-email@example.com'';';
    RAISE NOTICE '3. Start using the R-KAS application!';
    RAISE NOTICE '';
    RAISE NOTICE 'Database is ready for R-KAS application!';
END $$;