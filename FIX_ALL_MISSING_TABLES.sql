-- =====================================================
-- SCRIPT LENGKAP UNTUK MENGATASI ERROR MISSING TABLES
-- =====================================================
-- Script ini akan membuat semua tabel yang diperlukan secara berurutan

-- =====================================================
-- BAGIAN 1: SETUP DASAR DAN USER_PROFILES
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

-- Indexes untuk user_profiles
CREATE INDEX IF NOT EXISTS idx_user_profiles_auth_id ON public.user_profiles(auth_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_active ON public.user_profiles(is_active);

-- Enable RLS untuk user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Kebijakan RLS untuk USER_PROFILES
DROP POLICY IF EXISTS "Users can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.user_profiles;

CREATE POLICY "Users can view all profiles" ON public.user_profiles 
FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.user_profiles 
FOR UPDATE USING (auth_id = auth.uid());

CREATE POLICY "Admins can manage all profiles" ON public.user_profiles 
FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE auth_id = auth.uid() AND role = 'admin')
);

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

-- Trigger untuk membuat user profile otomatis saat signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger untuk update timestamp
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON public.user_profiles 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- BAGIAN 2: TABEL MASTER DATA
-- =====================================================

-- 1. BIDANG (Field/Department)
CREATE TABLE IF NOT EXISTS public.bidang (
    id BIGSERIAL PRIMARY KEY,
    kode VARCHAR(20) UNIQUE NOT NULL,
    nama VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. STANDAR (Standards)
CREATE TABLE IF NOT EXISTS public.standar (
    id BIGSERIAL PRIMARY KEY,
    kode VARCHAR(20) UNIQUE NOT NULL,
    nama VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. GIAT (Activities)
CREATE TABLE IF NOT EXISTS public.giat (
    id BIGSERIAL PRIMARY KEY,
    kode VARCHAR(20) UNIQUE NOT NULL,
    nama VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. DANA (Funding Sources)
CREATE TABLE IF NOT EXISTS public.dana (
    id BIGSERIAL PRIMARY KEY,
    kode VARCHAR(20) UNIQUE NOT NULL,
    nama VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. REKENING (Accounts)
CREATE TABLE IF NOT EXISTS public.rekening (
    id BIGSERIAL PRIMARY KEY,
    kode VARCHAR(20) UNIQUE NOT NULL,
    nama VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. KOMPONEN (Components)
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
-- BAGIAN 3: INDEXES UNTUK PERFORMA
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_bidang_kode ON public.bidang(kode);
CREATE INDEX IF NOT EXISTS idx_bidang_active ON public.bidang(is_active);

CREATE INDEX IF NOT EXISTS idx_standar_kode ON public.standar(kode);
CREATE INDEX IF NOT EXISTS idx_standar_active ON public.standar(is_active);

CREATE INDEX IF NOT EXISTS idx_giat_kode ON public.giat(kode);
CREATE INDEX IF NOT EXISTS idx_giat_active ON public.giat(is_active);

CREATE INDEX IF NOT EXISTS idx_dana_kode ON public.dana(kode);
CREATE INDEX IF NOT EXISTS idx_dana_active ON public.dana(is_active);

CREATE INDEX IF NOT EXISTS idx_rekening_kode ON public.rekening(kode);
CREATE INDEX IF NOT EXISTS idx_rekening_active ON public.rekening(is_active);

CREATE INDEX IF NOT EXISTS idx_komponen_kode ON public.komponen(kode);
CREATE INDEX IF NOT EXISTS idx_komponen_active ON public.komponen(is_active);

-- =====================================================
-- BAGIAN 4: ROW LEVEL SECURITY UNTUK MASTER DATA
-- =====================================================

-- Enable RLS untuk semua tabel master data
ALTER TABLE public.bidang ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.standar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.giat ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dana ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rekening ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.komponen ENABLE ROW LEVEL SECURITY;

-- Kebijakan RLS untuk BIDANG
DROP POLICY IF EXISTS "Allow read access for authenticated users" ON public.bidang;
DROP POLICY IF EXISTS "Allow write access for admin users" ON public.bidang;

CREATE POLICY "Allow read access for authenticated users" ON public.bidang 
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow write access for admin users" ON public.bidang 
FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE auth_id = auth.uid() AND role = 'admin')
);

-- Kebijakan RLS untuk STANDAR
DROP POLICY IF EXISTS "Allow read access for authenticated users" ON public.standar;
DROP POLICY IF EXISTS "Allow write access for admin users" ON public.standar;

CREATE POLICY "Allow read access for authenticated users" ON public.standar 
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow write access for admin users" ON public.standar 
FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE auth_id = auth.uid() AND role = 'admin')
);

-- Kebijakan RLS untuk GIAT
DROP POLICY IF EXISTS "Allow read access for authenticated users" ON public.giat;
DROP POLICY IF EXISTS "Allow write access for admin users" ON public.giat;

CREATE POLICY "Allow read access for authenticated users" ON public.giat 
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow write access for admin users" ON public.giat 
FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE auth_id = auth.uid() AND role = 'admin')
);

-- Kebijakan RLS untuk DANA
DROP POLICY IF EXISTS "Allow read access for authenticated users" ON public.dana;
DROP POLICY IF EXISTS "Allow write access for admin users" ON public.dana;

CREATE POLICY "Allow read access for authenticated users" ON public.dana 
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow write access for admin users" ON public.dana 
FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE auth_id = auth.uid() AND role = 'admin')
);

-- Kebijakan RLS untuk REKENING
DROP POLICY IF EXISTS "Allow read access for authenticated users" ON public.rekening;
DROP POLICY IF EXISTS "Allow write access for admin users" ON public.rekening;

CREATE POLICY "Allow read access for authenticated users" ON public.rekening 
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow write access for admin users" ON public.rekening 
FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE auth_id = auth.uid() AND role = 'admin')
);

-- Kebijakan RLS untuk KOMPONEN
DROP POLICY IF EXISTS "Allow read access for authenticated users" ON public.komponen;
DROP POLICY IF EXISTS "Allow write access for admin users" ON public.komponen;

CREATE POLICY "Allow read access for authenticated users" ON public.komponen 
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow write access for admin users" ON public.komponen 
FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE auth_id = auth.uid() AND role = 'admin')
);

-- =====================================================
-- BAGIAN 5: TRIGGERS UNTUK UPDATE TIMESTAMP
-- =====================================================

-- Tambahkan triggers untuk semua tabel master data
DROP TRIGGER IF EXISTS update_bidang_updated_at ON public.bidang;
CREATE TRIGGER update_bidang_updated_at 
    BEFORE UPDATE ON public.bidang 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_standar_updated_at ON public.standar;
CREATE TRIGGER update_standar_updated_at 
    BEFORE UPDATE ON public.standar 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_giat_updated_at ON public.giat;
CREATE TRIGGER update_giat_updated_at 
    BEFORE UPDATE ON public.giat 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_dana_updated_at ON public.dana;
CREATE TRIGGER update_dana_updated_at 
    BEFORE UPDATE ON public.dana 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_rekening_updated_at ON public.rekening;
CREATE TRIGGER update_rekening_updated_at 
    BEFORE UPDATE ON public.rekening 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_komponen_updated_at ON public.komponen;
CREATE TRIGGER update_komponen_updated_at 
    BEFORE UPDATE ON public.komponen 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- BAGIAN 6: DATA SAMPLE UNTUK TESTING
-- =====================================================

-- Insert sample data untuk BIDANG
INSERT INTO public.bidang (kode, nama, deskripsi) VALUES
    ('01', 'Bidang Pendidikan', 'Bidang yang menangani kegiatan pendidikan'),
    ('02', 'Bidang Administrasi', 'Bidang yang menangani administrasi sekolah'),
    ('03', 'Bidang Sarana Prasarana', 'Bidang yang menangani sarana dan prasarana'),
    ('04', 'Bidang Keuangan', 'Bidang yang menangani keuangan sekolah'),
    ('05', 'Bidang Kesiswaan', 'Bidang yang menangani kegiatan kesiswaan')
ON CONFLICT (kode) DO NOTHING;

-- Insert sample data untuk STANDAR
INSERT INTO public.standar (kode, nama, deskripsi) VALUES
    ('01', 'Standar Nasional Pendidikan', 'Standar yang ditetapkan secara nasional'),
    ('02', 'Standar Daerah', 'Standar yang ditetapkan oleh pemerintah daerah'),
    ('03', 'Standar Sekolah', 'Standar yang ditetapkan oleh sekolah'),
    ('04', 'Standar ISO', 'Standar internasional ISO'),
    ('05', 'Standar Akreditasi', 'Standar untuk akreditasi sekolah')
ON CONFLICT (kode) DO NOTHING;

-- Insert sample data untuk GIAT
INSERT INTO public.giat (kode, nama, deskripsi) VALUES
    ('001', 'Kegiatan Belajar Mengajar', 'Kegiatan utama proses pembelajaran'),
    ('002', 'Kegiatan Ekstrakurikuler', 'Kegiatan di luar jam pelajaran'),
    ('003', 'Kegiatan Administrasi', 'Kegiatan pengelolaan administrasi'),
    ('004', 'Kegiatan Pemeliharaan', 'Kegiatan pemeliharaan sarana prasarana'),
    ('005', 'Kegiatan Pengembangan', 'Kegiatan pengembangan sekolah')
ON CONFLICT (kode) DO NOTHING;

-- Insert sample data untuk DANA
INSERT INTO public.dana (kode, nama, deskripsi) VALUES
    ('BOS', 'Bantuan Operasional Sekolah', 'Dana dari pemerintah pusat'),
    ('BOSDA', 'Bantuan Operasional Sekolah Daerah', 'Dana dari pemerintah daerah'),
    ('SWADAYA', 'Dana Swadaya', 'Dana dari masyarakat/komite sekolah'),
    ('APBD', 'Anggaran Pendapatan dan Belanja Daerah', 'Dana dari APBD'),
    ('HIBAH', 'Dana Hibah', 'Dana hibah dari berbagai sumber')
ON CONFLICT (kode) DO NOTHING;

-- Insert sample data untuk REKENING
INSERT INTO public.rekening (kode, nama, deskripsi) VALUES
    ('5.1.1', 'Belanja Pegawai', 'Belanja untuk gaji dan tunjangan'),
    ('5.1.2', 'Belanja Barang dan Jasa', 'Belanja operasional'),
    ('5.1.3', 'Belanja Modal', 'Belanja untuk aset tetap'),
    ('5.1.4', 'Belanja Pemeliharaan', 'Belanja untuk pemeliharaan'),
    ('5.1.5', 'Belanja Perjalanan Dinas', 'Belanja untuk perjalanan dinas')
ON CONFLICT (kode) DO NOTHING;

-- Insert sample data untuk KOMPONEN
INSERT INTO public.komponen (kode, nama, deskripsi) VALUES
    ('001', 'Gaji Pokok', 'Komponen gaji pokok pegawai'),
    ('002', 'Tunjangan', 'Komponen tunjangan pegawai'),
    ('003', 'ATK', 'Alat Tulis Kantor'),
    ('004', 'Peralatan', 'Peralatan dan perlengkapan'),
    ('005', 'Konsumsi', 'Komponen konsumsi kegiatan'),
    ('006', 'Transport', 'Komponen transport'),
    ('007', 'Honorarium', 'Komponen honorarium')
ON CONFLICT (kode) DO NOTHING;

-- =====================================================
-- BAGIAN 7: GRANT PERMISSIONS
-- =====================================================

-- Grant permissions untuk user_profiles
GRANT SELECT, INSERT, UPDATE ON public.user_profiles TO authenticated;

-- Grant permissions untuk master data tables
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bidang TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.standar TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.giat TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.dana TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rekening TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.komponen TO authenticated;

-- Grant usage pada sequences
GRANT USAGE, SELECT ON SEQUENCE public.bidang_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.standar_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.giat_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.dana_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.rekening_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.komponen_id_seq TO authenticated;

-- Grant execute permissions pada functions
GRANT EXECUTE ON FUNCTION public.update_updated_at_column() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;

-- =====================================================
-- BAGIAN 8: VERIFIKASI DAN INFORMASI
-- =====================================================

-- Tampilkan informasi tabel yang telah dibuat
DO $$
BEGIN
    RAISE NOTICE '=== DATABASE SETUP COMPLETED SUCCESSFULLY ===';
    RAISE NOTICE '';
    RAISE NOTICE 'Tables created:';
    RAISE NOTICE '1. public.user_profiles - User management';
    RAISE NOTICE '2. public.bidang - Bidang/Department';
    RAISE NOTICE '3. public.standar - Standards';
    RAISE NOTICE '4. public.giat - Activities';
    RAISE NOTICE '5. public.dana - Funding Sources';
    RAISE NOTICE '6. public.rekening - Accounts';
    RAISE NOTICE '7. public.komponen - Components';
    RAISE NOTICE '';
    RAISE NOTICE 'Features enabled:';
    RAISE NOTICE '- Row Level Security (RLS)';
    RAISE NOTICE '- Automatic user profile creation';
    RAISE NOTICE '- Update timestamp triggers';
    RAISE NOTICE '- Indexes for performance';
    RAISE NOTICE '- Sample data inserted';
    RAISE NOTICE '';
    RAISE NOTICE 'To create admin user:';
    RAISE NOTICE '1. Sign up through your app';
    RAISE NOTICE '2. Run: UPDATE public.user_profiles SET role = ''admin'' WHERE email = ''your-email@example.com'';';
    RAISE NOTICE '';
    RAISE NOTICE 'Your R-KAS application is now ready to use!';
END $$;