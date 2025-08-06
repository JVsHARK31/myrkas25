-- =====================================================
-- RKAS Comprehensive Database Schema
-- Tabel Kertas Kerja Perubahan dengan Semua Field
-- =====================================================

-- Drop existing table if exists
DROP TABLE IF EXISTS kertas_kerja_perubahan CASCADE;

-- Create comprehensive kertas_kerja_perubahan table
CREATE TABLE kertas_kerja_perubahan (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Bidang Information
  kode_bidang TEXT NOT NULL DEFAULT '',
  nama_bidang TEXT NOT NULL DEFAULT '',
  
  -- Standar Information
  kode_standar TEXT DEFAULT '',
  nama_standar TEXT DEFAULT '',
  
  -- Kegiatan Information
  id_giat TEXT DEFAULT '',
  kode_giat TEXT NOT NULL DEFAULT '',
  nama_giat TEXT NOT NULL DEFAULT '',
  subtitle TEXT DEFAULT '',
  
  -- Dana Information
  kode_dana TEXT DEFAULT '',
  nama_dana TEXT DEFAULT '',
  
  -- Rekening Information
  kode_rekening TEXT DEFAULT '',
  nama_rekening TEXT DEFAULT '',
  
  -- Rincian Information
  id_rincian TEXT DEFAULT '',
  idkomponen TEXT DEFAULT '',
  kode_komponen TEXT DEFAULT '',
  nama_komponen TEXT NOT NULL DEFAULT '',
  
  -- Spesifikasi Barang
  satuan TEXT NOT NULL DEFAULT '',
  merk TEXT DEFAULT '',
  spek TEXT DEFAULT '',
  pajak TEXT DEFAULT '',
  
  -- Volume dan Harga
  volume DECIMAL(15,2) DEFAULT 0,
  harga_satuan DECIMAL(15,2) DEFAULT 0,
  koefisien TEXT DEFAULT '',
  
  -- Volume Detail (VOL1-VOL4 dengan SAT1-SAT4)
  vol1 DECIMAL(15,2) DEFAULT 0,
  sat1 TEXT DEFAULT '',
  vol2 DECIMAL(15,2) DEFAULT 0,
  sat2 TEXT DEFAULT '',
  vol3 DECIMAL(15,2) DEFAULT 0,
  sat3 TEXT DEFAULT '',
  vol4 DECIMAL(15,2) DEFAULT 0,
  sat4 TEXT DEFAULT '',
  
  -- Nilai Rincian
  nilai_rincian_murni DECIMAL(15,2) DEFAULT 0,
  nilai_rincian DECIMAL(15,2) DEFAULT 0,
  sub_rincian TEXT DEFAULT '',
  keterangan_rincian TEXT DEFAULT '',
  keterangan TEXT DEFAULT '',
  
  -- Anggaran Bulanan (BULAN_1 - BULAN_12)
  anggaran_bulan_1 DECIMAL(15,2) DEFAULT 0,
  anggaran_bulan_2 DECIMAL(15,2) DEFAULT 0,
  anggaran_bulan_3 DECIMAL(15,2) DEFAULT 0,
  anggaran_tw_1 DECIMAL(15,2) DEFAULT 0,
  anggaran_bulan_4 DECIMAL(15,2) DEFAULT 0,
  anggaran_bulan_5 DECIMAL(15,2) DEFAULT 0,
  anggaran_bulan_6 DECIMAL(15,2) DEFAULT 0,
  anggaran_tw_2 DECIMAL(15,2) DEFAULT 0,
  anggaran_bulan_7 DECIMAL(15,2) DEFAULT 0,
  anggaran_bulan_8 DECIMAL(15,2) DEFAULT 0,
  anggaran_bulan_9 DECIMAL(15,2) DEFAULT 0,
  anggaran_tw_3 DECIMAL(15,2) DEFAULT 0,
  anggaran_bulan_10 DECIMAL(15,2) DEFAULT 0,
  anggaran_bulan_11 DECIMAL(15,2) DEFAULT 0,
  anggaran_bulan_12 DECIMAL(15,2) DEFAULT 0,
  anggaran_tw_4 DECIMAL(15,2) DEFAULT 0,
  total_akb DECIMAL(15,2) DEFAULT 0,
  
  -- Realisasi Bulanan (BULAN_1 - BULAN_12)
  realisasi_bulan_1 DECIMAL(15,2) DEFAULT 0,
  realisasi_bulan_2 DECIMAL(15,2) DEFAULT 0,
  realisasi_bulan_3 DECIMAL(15,2) DEFAULT 0,
  realisasi_tw_1 DECIMAL(15,2) DEFAULT 0,
  realisasi_bulan_4 DECIMAL(15,2) DEFAULT 0,
  realisasi_bulan_5 DECIMAL(15,2) DEFAULT 0,
  realisasi_bulan_6 DECIMAL(15,2) DEFAULT 0,
  realisasi_tw_2 DECIMAL(15,2) DEFAULT 0,
  realisasi_bulan_7 DECIMAL(15,2) DEFAULT 0,
  realisasi_bulan_8 DECIMAL(15,2) DEFAULT 0,
  realisasi_bulan_9 DECIMAL(15,2) DEFAULT 0,
  realisasi_tw_3 DECIMAL(15,2) DEFAULT 0,
  realisasi_bulan_10 DECIMAL(15,2) DEFAULT 0,
  realisasi_bulan_11 DECIMAL(15,2) DEFAULT 0,
  realisasi_bulan_12 DECIMAL(15,2) DEFAULT 0,
  realisasi_tw_4 DECIMAL(15,2) DEFAULT 0,
  total_realisasi DECIMAL(15,2) DEFAULT 0,
  
  -- Metadata
  status TEXT DEFAULT 'active',
  period_year INTEGER DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE kertas_kerja_perubahan ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow all operations for authenticated users" ON kertas_kerja_perubahan
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow read access for anon users" ON kertas_kerja_perubahan
  FOR SELECT TO anon USING (true);

-- Create indexes for better performance
CREATE INDEX idx_kertas_kerja_kode_bidang ON kertas_kerja_perubahan(kode_bidang);
CREATE INDEX idx_kertas_kerja_nama_bidang ON kertas_kerja_perubahan(nama_bidang);
CREATE INDEX idx_kertas_kerja_kode_giat ON kertas_kerja_perubahan(kode_giat);
CREATE INDEX idx_kertas_kerja_nama_giat ON kertas_kerja_perubahan(nama_giat);
CREATE INDEX idx_kertas_kerja_kode_rekening ON kertas_kerja_perubahan(kode_rekening);
CREATE INDEX idx_kertas_kerja_nama_komponen ON kertas_kerja_perubahan(nama_komponen);
CREATE INDEX idx_kertas_kerja_period_year ON kertas_kerja_perubahan(period_year);
CREATE INDEX idx_kertas_kerja_status ON kertas_kerja_perubahan(status);
CREATE INDEX idx_kertas_kerja_created_at ON kertas_kerja_perubahan(created_at);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_kertas_kerja_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    -- Auto calculate totals
    NEW.total_akb = COALESCE(NEW.anggaran_bulan_1, 0) + COALESCE(NEW.anggaran_bulan_2, 0) + 
                    COALESCE(NEW.anggaran_bulan_3, 0) + COALESCE(NEW.anggaran_bulan_4, 0) + 
                    COALESCE(NEW.anggaran_bulan_5, 0) + COALESCE(NEW.anggaran_bulan_6, 0) + 
                    COALESCE(NEW.anggaran_bulan_7, 0) + COALESCE(NEW.anggaran_bulan_8, 0) + 
                    COALESCE(NEW.anggaran_bulan_9, 0) + COALESCE(NEW.anggaran_bulan_10, 0) + 
                    COALESCE(NEW.anggaran_bulan_11, 0) + COALESCE(NEW.anggaran_bulan_12, 0);
    
    NEW.total_realisasi = COALESCE(NEW.realisasi_bulan_1, 0) + COALESCE(NEW.realisasi_bulan_2, 0) + 
                          COALESCE(NEW.realisasi_bulan_3, 0) + COALESCE(NEW.realisasi_bulan_4, 0) + 
                          COALESCE(NEW.realisasi_bulan_5, 0) + COALESCE(NEW.realisasi_bulan_6, 0) + 
                          COALESCE(NEW.realisasi_bulan_7, 0) + COALESCE(NEW.realisasi_bulan_8, 0) + 
                          COALESCE(NEW.realisasi_bulan_9, 0) + COALESCE(NEW.realisasi_bulan_10, 0) + 
                          COALESCE(NEW.realisasi_bulan_11, 0) + COALESCE(NEW.realisasi_bulan_12, 0);
    
    -- Auto calculate quarterly totals
    NEW.anggaran_tw_1 = COALESCE(NEW.anggaran_bulan_1, 0) + COALESCE(NEW.anggaran_bulan_2, 0) + COALESCE(NEW.anggaran_bulan_3, 0);
    NEW.anggaran_tw_2 = COALESCE(NEW.anggaran_bulan_4, 0) + COALESCE(NEW.anggaran_bulan_5, 0) + COALESCE(NEW.anggaran_bulan_6, 0);
    NEW.anggaran_tw_3 = COALESCE(NEW.anggaran_bulan_7, 0) + COALESCE(NEW.anggaran_bulan_8, 0) + COALESCE(NEW.anggaran_bulan_9, 0);
    NEW.anggaran_tw_4 = COALESCE(NEW.anggaran_bulan_10, 0) + COALESCE(NEW.anggaran_bulan_11, 0) + COALESCE(NEW.anggaran_bulan_12, 0);
    
    NEW.realisasi_tw_1 = COALESCE(NEW.realisasi_bulan_1, 0) + COALESCE(NEW.realisasi_bulan_2, 0) + COALESCE(NEW.realisasi_bulan_3, 0);
    NEW.realisasi_tw_2 = COALESCE(NEW.realisasi_bulan_4, 0) + COALESCE(NEW.realisasi_bulan_5, 0) + COALESCE(NEW.realisasi_bulan_6, 0);
    NEW.realisasi_tw_3 = COALESCE(NEW.realisasi_bulan_7, 0) + COALESCE(NEW.realisasi_bulan_8, 0) + COALESCE(NEW.realisasi_bulan_9, 0);
    NEW.realisasi_tw_4 = COALESCE(NEW.realisasi_bulan_10, 0) + COALESCE(NEW.realisasi_bulan_11, 0) + COALESCE(NEW.realisasi_bulan_12, 0);
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger
DROP TRIGGER IF EXISTS update_kertas_kerja_perubahan_updated_at ON kertas_kerja_perubahan;
CREATE TRIGGER update_kertas_kerja_perubahan_updated_at 
  BEFORE UPDATE ON kertas_kerja_perubahan 
  FOR EACH ROW EXECUTE FUNCTION update_kertas_kerja_updated_at();

-- Insert sample data based on provided example
INSERT INTO kertas_kerja_perubahan (
  kode_bidang, nama_bidang, kode_standar, nama_standar, id_giat, kode_giat, nama_giat, subtitle,
  kode_dana, nama_dana, kode_rekening, nama_rekening, id_rincian, idkomponen, kode_komponen, nama_komponen,
  satuan, merk, spek, pajak, volume, harga_satuan, koefisien,
  vol1, sat1, vol2, sat2, vol3, sat3, vol4, sat4,
  nilai_rincian_murni, nilai_rincian, sub_rincian, keterangan_rincian, keterangan,
  anggaran_bulan_1, anggaran_bulan_2, anggaran_bulan_3, anggaran_bulan_4, anggaran_bulan_5, anggaran_bulan_6,
  anggaran_bulan_7, anggaran_bulan_8, anggaran_bulan_9, anggaran_bulan_10, anggaran_bulan_11, anggaran_bulan_12,
  realisasi_bulan_1, realisasi_bulan_2, realisasi_bulan_3, realisasi_bulan_4, realisasi_bulan_5, realisasi_bulan_6,
  realisasi_bulan_7, realisasi_bulan_8, realisasi_bulan_9, realisasi_bulan_10, realisasi_bulan_11, realisasi_bulan_12,
  status, period_year
) VALUES (
  '01', 'Kurikulum', '2', 'Pengembangan Standar Isi', '535613', '01.3.02.01.2.001', 
  '02.02. Pengembangan Perpustakaan', '02.02.01. Kegiatan pemberdayaan perpustakaan terutama untuk pengembangan minat baca peserta didik',
  '3.02.01', 'BOP Alokasi Dasar', '5.1.02.01.01.0012', 'Belanja Bahan-Bahan Lainnya',
  '8674237', '3662', '1.1.12.01.03.0009.00032', 'Kaos',
  'Buah', '', 'Lengan Panjang', '12%', 4, 214245, '4 Buah',
  4, 'Buah', 1, '', 1, '', 1, '',
  959818, 959818, '', '', '102.838',
  0, 0, 0, 0, 0, 0, 959818, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 959818, 0, 0, 0, 0, 0,
  'active', 2025
),
(
  '02', 'Kesiswaan', '3', 'Pengembangan Standar Proses', '535614', '02.3.01.01.3.002',
  '03.01. Kegiatan Ekstrakurikuler', '03.01.01. Pengembangan bakat dan minat siswa melalui kegiatan ekstrakurikuler',
  '3.02.01', 'BOP Alokasi Dasar', '5.1.02.01.01.0015', 'Belanja Peralatan Olahraga',
  '8674238', '3663', '1.1.12.01.04.0010.00033', 'Pompa Bola',
  'Buah', 'Mikasa', 'Pompa Manual', '11%', 2, 174749, '2 Buah',
  2, 'Buah', 1, '', 1, '', 1, '',
  349498, 349498, '', '', 'Untuk kegiatan olahraga',
  174749, 0, 0, 0, 174749, 0, 0, 0, 0, 0, 0, 0,
  174749, 0, 0, 0, 174749, 0, 0, 0, 0, 0, 0, 0,
  'active', 2025
),
(
  '03', 'Sarana Prasarana', '4', 'Pengembangan Standar Sarana', '535615', '03.2.01.02.1.003',
  '04.01. Pemeliharaan Gedung', '04.01.01. Pemeliharaan rutin gedung sekolah untuk mendukung proses pembelajaran',
  '3.02.02', 'BOP Alokasi Khusus', '5.1.02.02.01.0020', 'Belanja Bahan Bangunan',
  '8674239', '3664', '1.1.12.02.01.0011.00034', 'Cat Tembok',
  'Kaleng', 'Dulux', 'Cat Interior 5 Liter', '10%', 10, 125000, '10 Kaleng',
  10, 'Kaleng', 1, '', 1, '', 1, '',
  1375000, 1375000, '', '', 'Untuk pengecatan ruang kelas',
  0, 0, 687500, 0, 0, 687500, 0, 0, 0, 0, 0, 0,
  0, 0, 687500, 0, 0, 687500, 0, 0, 0, 0, 0, 0,
  'active', 2025
)
ON CONFLICT DO NOTHING;

-- Create views for easier reporting
CREATE OR REPLACE VIEW v_kertas_kerja_summary AS
SELECT 
  kode_bidang,
  nama_bidang,
  COUNT(*) as total_items,
  SUM(total_akb) as total_anggaran,
  SUM(total_realisasi) as total_realisasi,
  CASE 
    WHEN SUM(total_akb) > 0 THEN ROUND((SUM(total_realisasi) / SUM(total_akb)) * 100, 2)
    ELSE 0
  END as persentase_realisasi
FROM kertas_kerja_perubahan
WHERE status = 'active'
GROUP BY kode_bidang, nama_bidang
ORDER BY kode_bidang;

CREATE OR REPLACE VIEW v_kertas_kerja_monthly AS
SELECT 
  'Januari' as bulan, 1 as bulan_num,
  SUM(anggaran_bulan_1) as total_anggaran,
  SUM(realisasi_bulan_1) as total_realisasi
FROM kertas_kerja_perubahan WHERE status = 'active'
UNION ALL
SELECT 
  'Februari' as bulan, 2 as bulan_num,
  SUM(anggaran_bulan_2) as total_anggaran,
  SUM(realisasi_bulan_2) as total_realisasi
FROM kertas_kerja_perubahan WHERE status = 'active'
UNION ALL
SELECT 
  'Maret' as bulan, 3 as bulan_num,
  SUM(anggaran_bulan_3) as total_anggaran,
  SUM(realisasi_bulan_3) as total_realisasi
FROM kertas_kerja_perubahan WHERE status = 'active'
UNION ALL
SELECT 
  'April' as bulan, 4 as bulan_num,
  SUM(anggaran_bulan_4) as total_anggaran,
  SUM(realisasi_bulan_4) as total_realisasi
FROM kertas_kerja_perubahan WHERE status = 'active'
UNION ALL
SELECT 
  'Mei' as bulan, 5 as bulan_num,
  SUM(anggaran_bulan_5) as total_anggaran,
  SUM(realisasi_bulan_5) as total_realisasi
FROM kertas_kerja_perubahan WHERE status = 'active'
UNION ALL
SELECT 
  'Juni' as bulan, 6 as bulan_num,
  SUM(anggaran_bulan_6) as total_anggaran,
  SUM(realisasi_bulan_6) as total_realisasi
FROM kertas_kerja_perubahan WHERE status = 'active'
UNION ALL
SELECT 
  'Juli' as bulan, 7 as bulan_num,
  SUM(anggaran_bulan_7) as total_anggaran,
  SUM(realisasi_bulan_7) as total_realisasi
FROM kertas_kerja_perubahan WHERE status = 'active'
UNION ALL
SELECT 
  'Agustus' as bulan, 8 as bulan_num,
  SUM(anggaran_bulan_8) as total_anggaran,
  SUM(realisasi_bulan_8) as total_realisasi
FROM kertas_kerja_perubahan WHERE status = 'active'
UNION ALL
SELECT 
  'September' as bulan, 9 as bulan_num,
  SUM(anggaran_bulan_9) as total_anggaran,
  SUM(realisasi_bulan_9) as total_realisasi
FROM kertas_kerja_perubahan WHERE status = 'active'
UNION ALL
SELECT 
  'Oktober' as bulan, 10 as bulan_num,
  SUM(anggaran_bulan_10) as total_anggaran,
  SUM(realisasi_bulan_10) as total_realisasi
FROM kertas_kerja_perubahan WHERE status = 'active'
UNION ALL
SELECT 
  'November' as bulan, 11 as bulan_num,
  SUM(anggaran_bulan_11) as total_anggaran,
  SUM(realisasi_bulan_11) as total_realisasi
FROM kertas_kerja_perubahan WHERE status = 'active'
UNION ALL
SELECT 
  'Desember' as bulan, 12 as bulan_num,
  SUM(anggaran_bulan_12) as total_anggaran,
  SUM(realisasi_bulan_12) as total_realisasi
FROM kertas_kerja_perubahan WHERE status = 'active'
ORDER BY bulan_num;

-- Grant permissions
GRANT ALL ON kertas_kerja_perubahan TO authenticated;
GRANT SELECT ON v_kertas_kerja_summary TO authenticated;
GRANT SELECT ON v_kertas_kerja_monthly TO authenticated;
GRANT SELECT ON kertas_kerja_perubahan TO anon;
GRANT SELECT ON v_kertas_kerja_summary TO anon;
GRANT SELECT ON v_kertas_kerja_monthly TO anon;

-- Success message
SELECT 'RKAS Comprehensive Schema created successfully!' as message;