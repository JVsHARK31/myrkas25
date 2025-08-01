-- =====================================================
-- COMPLETE DATABASE SETUP FOR RKAS APPLICATION
-- =====================================================

-- Enable Row Level Security
ALTER DATABASE postgres SET row_security = on;

-- Create schema if not exists
CREATE SCHEMA IF NOT EXISTS public;

-- =====================================================
-- MASTER DATA TABLES
-- =====================================================

-- 1. Bidang (Field/Department)
CREATE TABLE IF NOT EXISTS public.bidang (
    id SERIAL PRIMARY KEY,
    kode VARCHAR(10) UNIQUE NOT NULL,
    nama VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Standar (Standards)
CREATE TABLE IF NOT EXISTS public.standar (
    id SERIAL PRIMARY KEY,
    kode VARCHAR(20) UNIQUE NOT NULL,
    nama VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Kegiatan (Activities)
CREATE TABLE IF NOT EXISTS public.giat (
    id SERIAL PRIMARY KEY,
    kode VARCHAR(20) UNIQUE NOT NULL,
    nama VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Sumber Dana (Fund Sources)
CREATE TABLE IF NOT EXISTS public.dana (
    id SERIAL PRIMARY KEY,
    kode VARCHAR(10) UNIQUE NOT NULL,
    nama VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Rekening (Accounts)
CREATE TABLE IF NOT EXISTS public.rekening (
    id SERIAL PRIMARY KEY,
    kode VARCHAR(20) UNIQUE NOT NULL,
    nama VARCHAR(255) NOT NULL,
    jenis VARCHAR(50),
    deskripsi TEXT,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Komponen (Components)
CREATE TABLE IF NOT EXISTS public.komponen (
    id SERIAL PRIMARY KEY,
    kode VARCHAR(20) UNIQUE NOT NULL,
    nama VARCHAR(255) NOT NULL,
    satuan VARCHAR(50),
    harga_satuan DECIMAL(15,2) DEFAULT 0,
    deskripsi TEXT,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- MAIN BUDGET TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.kertas_kerja_perubahan (
    id SERIAL PRIMARY KEY,
    kode_bidang VARCHAR(10) REFERENCES public.bidang(kode),
    nama_bidang VARCHAR(255),
    kode_standar VARCHAR(20) REFERENCES public.standar(kode),
    nama_standar VARCHAR(255),
    kode_giat VARCHAR(20) REFERENCES public.giat(kode),
    nama_giat VARCHAR(255),
    kode_dana VARCHAR(10) REFERENCES public.dana(kode),
    nama_dana VARCHAR(255),
    kode_rekening VARCHAR(20) REFERENCES public.rekening(kode),
    nama_rekening VARCHAR(255),
    nama_komponen VARCHAR(255),
    satuan VARCHAR(50),
    volume DECIMAL(10,2) DEFAULT 0,
    harga_satuan DECIMAL(15,2) DEFAULT 0,
    nilai_rincian DECIMAL(15,2) DEFAULT 0,
    
    -- Monthly budget allocation
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
    
    total_akb DECIMAL(15,2) DEFAULT 0,
    total_realisasi DECIMAL(15,2) DEFAULT 0,
    sisa_anggaran DECIMAL(15,2) GENERATED ALWAYS AS (total_akb - total_realisasi) STORED,
    
    status VARCHAR(20) DEFAULT 'active',
    period_year INTEGER DEFAULT EXTRACT(YEAR FROM NOW()),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Master data indexes
CREATE INDEX IF NOT EXISTS idx_bidang_kode ON public.bidang(kode);
CREATE INDEX IF NOT EXISTS idx_bidang_status ON public.bidang(status);

CREATE INDEX IF NOT EXISTS idx_standar_kode ON public.standar(kode);
CREATE INDEX IF NOT EXISTS idx_standar_status ON public.standar(status);

CREATE INDEX IF NOT EXISTS idx_giat_kode ON public.giat(kode);
CREATE INDEX IF NOT EXISTS idx_giat_status ON public.giat(status);

CREATE INDEX IF NOT EXISTS idx_dana_kode ON public.dana(kode);
CREATE INDEX IF NOT EXISTS idx_dana_status ON public.dana(status);

CREATE INDEX IF NOT EXISTS idx_rekening_kode ON public.rekening(kode);
CREATE INDEX IF NOT EXISTS idx_rekening_status ON public.rekening(status);

CREATE INDEX IF NOT EXISTS idx_komponen_kode ON public.komponen(kode);
CREATE INDEX IF NOT EXISTS idx_komponen_status ON public.komponen(status);

-- Budget table indexes
CREATE INDEX IF NOT EXISTS idx_kkp_bidang ON public.kertas_kerja_perubahan(kode_bidang);
CREATE INDEX IF NOT EXISTS idx_kkp_standar ON public.kertas_kerja_perubahan(kode_standar);
CREATE INDEX IF NOT EXISTS idx_kkp_giat ON public.kertas_kerja_perubahan(kode_giat);
CREATE INDEX IF NOT EXISTS idx_kkp_dana ON public.kertas_kerja_perubahan(kode_dana);
CREATE INDEX IF NOT EXISTS idx_kkp_rekening ON public.kertas_kerja_perubahan(kode_rekening);
CREATE INDEX IF NOT EXISTS idx_kkp_year ON public.kertas_kerja_perubahan(period_year);
CREATE INDEX IF NOT EXISTS idx_kkp_status ON public.kertas_kerja_perubahan(status);

-- =====================================================
-- SAMPLE DATA INSERTION
-- =====================================================

-- Insert sample bidang data
INSERT INTO public.bidang (kode, nama, deskripsi) VALUES
    ('BID001', 'Pendidikan', 'Bidang pendidikan dan pembelajaran'),
    ('BID002', 'Kesiswaan', 'Bidang kesiswaan dan ekstrakurikuler'),
    ('BID003', 'Sarana Prasarana', 'Bidang sarana dan prasarana sekolah'),
    ('BID004', 'Administrasi', 'Bidang administrasi dan tata usaha'),
    ('BID005', 'Keuangan', 'Bidang keuangan dan akuntansi')
ON CONFLICT (kode) DO NOTHING;

-- Insert sample standar data
INSERT INTO public.standar (kode, nama, deskripsi) VALUES
    ('STD001', 'Standar Nasional Pendidikan', 'Standar nasional untuk pendidikan'),
    ('STD002', 'Standar Pelayanan Minimal', 'Standar pelayanan minimal sekolah'),
    ('STD003', 'Standar Akreditasi', 'Standar untuk akreditasi sekolah'),
    ('STD004', 'Standar ISO 9001', 'Standar manajemen mutu ISO 9001'),
    ('STD005', 'Standar Kurikulum', 'Standar kurikulum nasional')
ON CONFLICT (kode) DO NOTHING;

-- Insert sample giat data
INSERT INTO public.giat (kode, nama, deskripsi) VALUES
    ('GIAT001', 'Kegiatan Belajar Mengajar', 'Kegiatan pembelajaran di kelas'),
    ('GIAT002', 'Ekstrakurikuler', 'Kegiatan ekstrakurikuler siswa'),
    ('GIAT003', 'Perawatan Sarana', 'Perawatan dan pemeliharaan sarana'),
    ('GIAT004', 'Pengembangan SDM', 'Pengembangan sumber daya manusia'),
    ('GIAT005', 'Evaluasi dan Monitoring', 'Kegiatan evaluasi dan monitoring')
ON CONFLICT (kode) DO NOTHING;

-- Insert sample dana data
INSERT INTO public.dana (kode, nama, deskripsi) VALUES
    ('BOS', 'Bantuan Operasional Sekolah', 'Dana dari pemerintah pusat'),
    ('BOSDA', 'Bantuan Operasional Sekolah Daerah', 'Dana dari pemerintah daerah'),
    ('SWADAYA', 'Dana Swadaya', 'Dana dari masyarakat/komite sekolah'),
    ('APBD', 'Anggaran Pendapatan dan Belanja Daerah', 'Dana dari APBD'),
    ('HIBAH', 'Dana Hibah', 'Dana hibah dari berbagai sumber')
ON CONFLICT (kode) DO NOTHING;

-- Insert sample rekening data
INSERT INTO public.rekening (kode, nama, jenis, deskripsi) VALUES
    ('REK001', 'Belanja Pegawai', 'Operasional', 'Belanja untuk pegawai'),
    ('REK002', 'Belanja Barang', 'Operasional', 'Belanja barang dan jasa'),
    ('REK003', 'Belanja Modal', 'Modal', 'Belanja modal/investasi'),
    ('REK004', 'Belanja Pemeliharaan', 'Operasional', 'Belanja pemeliharaan'),
    ('REK005', 'Belanja Perjalanan', 'Operasional', 'Belanja perjalanan dinas')
ON CONFLICT (kode) DO NOTHING;

-- Insert sample komponen data
INSERT INTO public.komponen (kode, nama, satuan, harga_satuan, deskripsi) VALUES
    ('KOMP001', 'Alat Tulis Kantor', 'Paket', 500000, 'Paket alat tulis kantor'),
    ('KOMP002', 'Buku Pelajaran', 'Eksemplar', 75000, 'Buku pelajaran siswa'),
    ('KOMP003', 'Komputer', 'Unit', 8000000, 'Komputer untuk laboratorium'),
    ('KOMP004', 'Meja Siswa', 'Unit', 750000, 'Meja untuk siswa'),
    ('KOMP005', 'Kursi Siswa', 'Unit', 350000, 'Kursi untuk siswa')
ON CONFLICT (kode) DO NOTHING;

-- =====================================================
-- VIEWS FOR REPORTING
-- =====================================================

-- Budget summary view
CREATE OR REPLACE VIEW public.budget_summary AS
SELECT 
    period_year,
    kode_bidang,
    nama_bidang,
    COUNT(*) as total_items,
    SUM(total_akb) as total_budget,
    SUM(total_realisasi) as total_realization,
    SUM(sisa_anggaran) as remaining_budget,
    CASE 
        WHEN SUM(total_akb) > 0 THEN (SUM(total_realisasi) / SUM(total_akb)) * 100
        ELSE 0
    END as realization_percentage
FROM public.kertas_kerja_perubahan
WHERE status = 'active'
GROUP BY period_year, kode_bidang, nama_bidang
ORDER BY period_year DESC, kode_bidang;

-- Monthly budget view
CREATE OR REPLACE VIEW public.monthly_budget AS
SELECT 
    period_year,
    kode_bidang,
    nama_bidang,
    SUM(bulan_1) as januari,
    SUM(bulan_2) as februari,
    SUM(bulan_3) as maret,
    SUM(bulan_4) as april,
    SUM(bulan_5) as mei,
    SUM(bulan_6) as juni,
    SUM(bulan_7) as juli,
    SUM(bulan_8) as agustus,
    SUM(bulan_9) as september,
    SUM(bulan_10) as oktober,
    SUM(bulan_11) as november,
    SUM(bulan_12) as desember
FROM public.kertas_kerja_perubahan
WHERE status = 'active'
GROUP BY period_year, kode_bidang, nama_bidang
ORDER BY period_year DESC, kode_bidang;

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_bidang_updated_at BEFORE UPDATE ON public.bidang FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_standar_updated_at BEFORE UPDATE ON public.standar FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_giat_updated_at BEFORE UPDATE ON public.giat FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dana_updated_at BEFORE UPDATE ON public.dana FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rekening_updated_at BEFORE UPDATE ON public.rekening FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_komponen_updated_at BEFORE UPDATE ON public.komponen FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_kkp_updated_at BEFORE UPDATE ON public.kertas_kerja_perubahan FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.bidang ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.standar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.giat ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dana ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rekening ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.komponen ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kertas_kerja_perubahan ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed)
CREATE POLICY "Allow all operations" ON public.bidang FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON public.standar FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON public.giat FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON public.dana FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON public.rekening FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON public.komponen FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON public.kertas_kerja_perubahan FOR ALL USING (true);

-- =====================================================
-- GRANTS AND PERMISSIONS
-- =====================================================

-- Grant permissions to authenticated users
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Grant permissions to anon users (read-only)
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

-- Insert completion log
DO $$
BEGIN
    RAISE NOTICE 'Database setup completed successfully!';
    RAISE NOTICE 'Tables created: bidang, standar, giat, dana, rekening, komponen, kertas_kerja_perubahan';
    RAISE NOTICE 'Sample data inserted for all master tables';
    RAISE NOTICE 'Indexes, views, and triggers created';
    RAISE NOTICE 'Row Level Security enabled with public access policies';
END $$;