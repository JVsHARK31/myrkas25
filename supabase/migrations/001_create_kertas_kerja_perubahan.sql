-- Migration: Create kertas_kerja_perubahan table with comprehensive fields
-- Created: 2024
-- Description: Complete R-KAS management table with all required fields

CREATE TABLE IF NOT EXISTS kertas_kerja_perubahan (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Bidang Information
  kode_bidang VARCHAR(10) NOT NULL,
  nama_bidang VARCHAR(255) NOT NULL,
  
  -- Standar Information
  kode_standar VARCHAR(10),
  nama_standar VARCHAR(255),
  
  -- Kegiatan Information
  id_giat VARCHAR(20),
  kode_giat VARCHAR(50) NOT NULL,
  nama_giat VARCHAR(500) NOT NULL,
  subtitle TEXT,
  
  -- Dana Information
  kode_dana VARCHAR(20),
  nama_dana VARCHAR(255),
  
  -- Rekening Information
  kode_rekening VARCHAR(50) NOT NULL,
  nama_rekening VARCHAR(255) NOT NULL,
  
  -- Rincian Information
  id_rincian VARCHAR(20),
  idkomponen VARCHAR(20),
  kode_komponen VARCHAR(50),
  nama_komponen VARCHAR(255),
  
  -- Spesifikasi
  satuan VARCHAR(50),
  merk VARCHAR(255),
  spek TEXT,
  pajak VARCHAR(10) DEFAULT '0%',
  
  -- Volume dan Harga
  volume DECIMAL(15,2) DEFAULT 0,
  harga_satuan DECIMAL(15,2) DEFAULT 0,
  koefisien VARCHAR(50),
  
  -- Volume Detail (VOL1-VOL4 with SAT1-SAT4)
  vol1 DECIMAL(15,2) DEFAULT 0,
  sat1 VARCHAR(50),
  vol2 DECIMAL(15,2) DEFAULT 0,
  sat2 VARCHAR(50),
  vol3 DECIMAL(15,2) DEFAULT 0,
  sat3 VARCHAR(50),
  vol4 DECIMAL(15,2) DEFAULT 0,
  sat4 VARCHAR(50),
  
  -- Nilai Rincian
  nilai_rincian_murni DECIMAL(15,2) DEFAULT 0,
  nilai_rincian DECIMAL(15,2) DEFAULT 0,
  sub_rincian VARCHAR(255),
  keterangan_rincian TEXT,
  keterangan TEXT,
  
  -- Anggaran Bulanan (BULAN_1 - BULAN_12)
  anggaran_bulan_1 DECIMAL(15,2) DEFAULT 0,
  anggaran_bulan_2 DECIMAL(15,2) DEFAULT 0,
  anggaran_bulan_3 DECIMAL(15,2) DEFAULT 0,
  anggaran_bulan_4 DECIMAL(15,2) DEFAULT 0,
  anggaran_bulan_5 DECIMAL(15,2) DEFAULT 0,
  anggaran_bulan_6 DECIMAL(15,2) DEFAULT 0,
  anggaran_bulan_7 DECIMAL(15,2) DEFAULT 0,
  anggaran_bulan_8 DECIMAL(15,2) DEFAULT 0,
  anggaran_bulan_9 DECIMAL(15,2) DEFAULT 0,
  anggaran_bulan_10 DECIMAL(15,2) DEFAULT 0,
  anggaran_bulan_11 DECIMAL(15,2) DEFAULT 0,
  anggaran_bulan_12 DECIMAL(15,2) DEFAULT 0,
  
  -- Anggaran Triwulanan (TW 1 - TW 4)
  anggaran_tw_1 DECIMAL(15,2) DEFAULT 0,
  anggaran_tw_2 DECIMAL(15,2) DEFAULT 0,
  anggaran_tw_3 DECIMAL(15,2) DEFAULT 0,
  anggaran_tw_4 DECIMAL(15,2) DEFAULT 0,
  
  -- Total AKB
  total_akb DECIMAL(15,2) DEFAULT 0,
  
  -- Realisasi Bulanan (BULAN_1 - BULAN_12)
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
  
  -- Realisasi Triwulanan (TW 1 - TW 4)
  realisasi_tw_1 DECIMAL(15,2) DEFAULT 0,
  realisasi_tw_2 DECIMAL(15,2) DEFAULT 0,
  realisasi_tw_3 DECIMAL(15,2) DEFAULT 0,
  realisasi_tw_4 DECIMAL(15,2) DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Create indexes for better performance
CREATE INDEX idx_kertas_kerja_kode_bidang ON kertas_kerja_perubahan(kode_bidang);
CREATE INDEX idx_kertas_kerja_kode_giat ON kertas_kerja_perubahan(kode_giat);
CREATE INDEX idx_kertas_kerja_kode_rekening ON kertas_kerja_perubahan(kode_rekening);
CREATE INDEX idx_kertas_kerja_nama_bidang ON kertas_kerja_perubahan(nama_bidang);
CREATE INDEX idx_kertas_kerja_created_at ON kertas_kerja_perubahan(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE kertas_kerja_perubahan ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all kertas kerja perubahan" ON kertas_kerja_perubahan
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert kertas kerja perubahan" ON kertas_kerja_perubahan
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own kertas kerja perubahan" ON kertas_kerja_perubahan
  FOR UPDATE USING (auth.uid() = created_by OR auth.role() = 'service_role');

CREATE POLICY "Users can delete their own kertas kerja perubahan" ON kertas_kerja_perubahan
  FOR DELETE USING (auth.uid() = created_by OR auth.role() = 'service_role');

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_kertas_kerja_perubahan_updated_at
  BEFORE UPDATE ON kertas_kerja_perubahan
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data based on the provided example
INSERT INTO kertas_kerja_perubahan (
  kode_bidang, nama_bidang, kode_standar, nama_standar, id_giat, kode_giat, nama_giat, subtitle,
  kode_dana, nama_dana, kode_rekening, nama_rekening, id_rincian, idkomponen, kode_komponen, nama_komponen,
  satuan, merk, spek, pajak, volume, harga_satuan, koefisien,
  vol1, sat1, vol2, sat2, vol3, sat3, vol4, sat4,
  nilai_rincian_murni, nilai_rincian, keterangan,
  anggaran_bulan_1, anggaran_bulan_2, anggaran_bulan_3, anggaran_tw_1,
  anggaran_bulan_4, anggaran_bulan_5, anggaran_bulan_6, anggaran_tw_2,
  anggaran_bulan_7, anggaran_bulan_8, anggaran_bulan_9, anggaran_tw_3,
  anggaran_bulan_10, anggaran_bulan_11, anggaran_bulan_12, anggaran_tw_4,
  total_akb,
  realisasi_bulan_1, realisasi_bulan_2, realisasi_bulan_3, realisasi_tw_1,
  realisasi_bulan_4, realisasi_bulan_5, realisasi_bulan_6, realisasi_tw_2,
  realisasi_bulan_7, realisasi_bulan_8, realisasi_bulan_9, realisasi_tw_3,
  realisasi_bulan_10, realisasi_bulan_11, realisasi_bulan_12, realisasi_tw_4
) VALUES (
  '01', 'Kurikulum', '2', 'Pengembangan Standar Isi', '535613', '01.3.02.01.2.001',
  '02.02. Pengembangan Perpustakaan', '02.02.01. Kegiatan pemberdayaan perpustakaan terutama untuk pengembangan minat baca peserta didik',
  '3.02.01', 'BOP Alokasi Dasar', '5.1.02.01.01.0012', 'Belanja Bahan-Bahan Lainnya',
  '8674237', '3662', '1.1.12.01.03.0009.00032', 'Kaos',
  'Buah', '', 'Lengan Panjang', '12%', 4, 214245, '4 Buah',
  4, 'Buah', 1, '', 1, '', 1, '',
  959818, 959818, '102.838',
  0, 0, 0, 0,
  0, 0, 0, 0,
  959818, 0, 0, 959818,
  0, 0, 0, 0,
  959818,
  0, 0, 0, 0,
  0, 0, 0, 0,
  959818, 0, 0, 959818,
  0, 0, 0, 0
);

-- Add additional sample data for testing
INSERT INTO kertas_kerja_perubahan (
  kode_bidang, nama_bidang, kode_giat, nama_giat, kode_rekening, nama_rekening,
  nama_komponen, satuan, volume, harga_satuan, nilai_rincian,
  anggaran_bulan_1, anggaran_bulan_2, anggaran_bulan_3, anggaran_tw_1, total_akb
) VALUES 
('02', 'Kesiswaan', '02.1.01.01.1.001', 'Pembinaan Kesiswaan', '5.1.02.01.01.0001', 'Belanja Alat Tulis Kantor',
 'Kertas A4', 'Rim', 50, 45000, 2250000, 750000, 750000, 750000, 2250000, 2250000),
('03', 'Sarana Prasarana', '03.1.01.01.1.001', 'Pemeliharaan Gedung', '5.1.02.01.01.0005', 'Belanja Bahan Bangunan',
 'Cat Tembok', 'Kaleng', 20, 125000, 2500000, 0, 1250000, 1250000, 2500000, 2500000),
('04', 'Tenaga Pendidik', '04.1.01.01.1.001', 'Pelatihan Guru', '5.1.02.01.01.0010', 'Belanja Konsumsi',
 'Snack Box', 'Kotak', 100, 25000, 2500000, 2500000, 0, 0, 2500000, 2500000);

COMMIT;