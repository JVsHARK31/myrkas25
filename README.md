# RKAS SMPN 25 Jakarta

Sistem Rencana Kegiatan dan Anggaran Sekolah (RKAS) untuk SMPN 25 Jakarta. Aplikasi web komprehensif untuk manajemen anggaran, perencanaan kegiatan, dan pelaporan keuangan sekolah.

## 🚀 Fitur Utama

- **Autentikasi Aman**: Login dengan kredensial admin
- **Dashboard Interaktif**: Ringkasan keuangan dan statistik
- **Manajemen Anggaran**: CRUD operations untuk item anggaran
- **Perencanaan Kegiatan**: Manajemen kegiatan sekolah
- **Sistem Pelaporan**: Laporan komprehensif dengan export CSV/PDF
- **Import/Export CSV**: Dukungan untuk file "Kertas Kerja Perubahan"
- **Responsive Design**: Optimal untuk desktop dan mobile

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (Database, Auth, Realtime)
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: Netlify

## 📋 Prerequisites

- Node.js 16+ dan npm/yarn
- Akun Supabase
- Akun Netlify (untuk deployment)
- Akun GitHub (untuk version control)

## 🔧 Setup Development

### 1. Clone Repository

```bash
git clone https://github.com/username/myrkas25.git
cd myrkas25
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Supabase

1. Buat project baru di [Supabase](https://supabase.com)
2. Dapatkan URL dan anon key dari dashboard
3. Copy `.env.example` ke `.env` dan isi dengan kredensial Supabase:

```bash
cp .env.example .env
```

Edit file `.env`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Setup Database

**🚨 CRITICAL - WAJIB DILAKUKAN**: Jalankan SQL berikut di Supabase SQL Editor untuk membuat tabel yang diperlukan:

**Langkah-langkah:**
1. Buka Supabase Dashboard → SQL Editor
2. Copy dan paste SQL berikut
3. Klik "Run" untuk menjalankan
4. Pastikan tidak ada error

```sql
-- =====================================================
-- RKAS Database Setup - WAJIB DIJALANKAN
-- =====================================================

-- Create budget_items table
CREATE TABLE IF NOT EXISTS budget_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  kode_bidang TEXT NOT NULL DEFAULT '',
  nama_bidang TEXT NOT NULL DEFAULT '',
  kode_standar TEXT DEFAULT '',
  nama_standar TEXT DEFAULT '',
  kode_giat TEXT NOT NULL DEFAULT '',
  nama_giat TEXT NOT NULL DEFAULT '',
  kode_dana TEXT DEFAULT '',
  nama_dana TEXT DEFAULT '',
  kode_rekening TEXT DEFAULT '',
  nama_rekening TEXT DEFAULT '',
  nama_komponen TEXT NOT NULL DEFAULT '',
  satuan TEXT NOT NULL DEFAULT '',
  volume DECIMAL DEFAULT 0,
  harga_satuan DECIMAL DEFAULT 0,
  nilai_rincian DECIMAL DEFAULT 0,
  bulan_1 DECIMAL DEFAULT 0,
  bulan_2 DECIMAL DEFAULT 0,
  bulan_3 DECIMAL DEFAULT 0,
  bulan_4 DECIMAL DEFAULT 0,
  bulan_5 DECIMAL DEFAULT 0,
  bulan_6 DECIMAL DEFAULT 0,
  bulan_7 DECIMAL DEFAULT 0,
  bulan_8 DECIMAL DEFAULT 0,
  bulan_9 DECIMAL DEFAULT 0,
  bulan_10 DECIMAL DEFAULT 0,
  bulan_11 DECIMAL DEFAULT 0,
  bulan_12 DECIMAL DEFAULT 0,
  total_akb DECIMAL DEFAULT 0,
  total_realisasi DECIMAL DEFAULT 0,
  status TEXT DEFAULT 'active',
  period_year INTEGER DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama_kegiatan TEXT NOT NULL,
  deskripsi TEXT DEFAULT '',
  tanggal_mulai DATE NOT NULL,
  tanggal_selesai DATE NOT NULL,
  budget_allocated DECIMAL DEFAULT 0,
  budget_used DECIMAL DEFAULT 0,
  status TEXT DEFAULT 'draft',
  bidang TEXT NOT NULL,
  periode TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE budget_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY IF NOT EXISTS "Allow all operations for authenticated users" ON budget_items
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow all operations for authenticated users" ON activities
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create trigger functions for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
DROP TRIGGER IF EXISTS update_budget_items_updated_at ON budget_items;
CREATE TRIGGER update_budget_items_updated_at 
  BEFORE UPDATE ON budget_items 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_activities_updated_at ON activities;
CREATE TRIGGER update_activities_updated_at 
  BEFORE UPDATE ON activities 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional)
INSERT INTO budget_items (
  kode_bidang, nama_bidang, kode_giat, nama_giat, nama_komponen, 
  satuan, volume, harga_satuan, total_akb, status
) VALUES 
  ('1', 'Kurikulum', '01.3.02.01.2.001', 'Pengembangan Perpustakaan', 'Kaos Lengan Panjang', 'Buah', 4, 214245, 857000, 'active'),
  ('2', 'Kesiswaan', '02.3.01.01.3.002', 'Kegiatan Ekstrakurikuler', 'Pompa Bola', 'Buah', 2, 174749, 349500, 'active')
ON CONFLICT DO NOTHING;

INSERT INTO activities (
  nama_kegiatan, deskripsi, tanggal_mulai, tanggal_selesai, 
  budget_allocated, bidang, periode, status
) VALUES 
  ('Pengembangan Perpustakaan', 'Kegiatan pemberdayaan perpustakaan untuk minat baca', '2024-01-01', '2024-12-31', 5000000, 'Kurikulum', 'Tahun Ajaran', 'active'),
  ('Kegiatan Ekstrakurikuler', 'Pelaksanaan kegiatan ekstrakurikuler siswa', '2024-01-01', '2024-12-31', 3000000, 'Kesiswaan', 'Tahun Ajaran', 'active')
ON CONFLICT DO NOTHING;
```

### 5. Setup Authentication

1. Di Supabase Dashboard, masuk ke Authentication → Settings
2. Disable "Enable email confirmations" untuk development
3. Buat user admin dengan email: `admin@rkas.com` dan password: `123456`

### 6. Run Development Server

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

## 🚀 Deployment

### Deploy ke Netlify

1. Push code ke GitHub repository
2. Connect repository di Netlify
3. Set environment variables di Netlify:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy otomatis akan dimulai

### Build Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📊 Struktur Data CSV

Aplikasi mendukung import file CSV dengan struktur berikut:

```
KODE_BIDANG,NAMA_BIDANG,KODE_STANDAR,NAMA_STANDAR,KODE_GIAT,NAMA_GIAT,KODE_DANA,NAMA_DANA,KODE_REKENING,NAMA_REKENING,NAMA_KOMPONEN,SATUAN,VOLUME,HARGA_SATUAN,NILAI_RINCIAN,BULAN_1,BULAN_2,BULAN_3,BULAN_4,BULAN_5,BULAN_6,BULAN_7,BULAN_8,BULAN_9,BULAN_10,BULAN_11,BULAN_12,Total_AKB,Total_REALISASI
```

## 👤 Default Login

- **Email**: admin@rkas.com  
- **Password**: 123456

## 📱 Fitur Aplikasi

### Dashboard
- Ringkasan keuangan real-time
- Grafik alokasi anggaran bulanan
- Statistik kegiatan aktif
- Chart anggaran per bidang

### Manajemen Anggaran
- Tambah, edit, hapus item anggaran
- Filter berdasarkan bidang dan status
- Pencarian real-time
- Pagination dan sorting
- Import/export CSV

### Perencanaan Kegiatan
- Manajemen kegiatan sekolah
- Tracking budget dan progress
- Filter berdasarkan status dan bidang
- Timeline kegiatan

### Sistem Pelaporan
- Laporan anggaran komprehensif
- Export ke CSV dan PDF
- Filter berdasarkan periode dan bidang
- Visualisasi data dengan charts

## 🔒 Security

- Row Level Security (RLS) di Supabase
- Authenticated user policies
- Session management
- Input validation dan sanitization

## 📋 Todo

- [ ] Multi-user support dengan roles
- [ ] Email notifications
- [ ] Advanced reporting features
- [ ] Mobile app version
- [ ] API documentation

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Support

Untuk support dan pertanyaan:
- Email: admin@smpn25jakarta.sch.id
- GitHub Issues: [Create Issue](https://github.com/username/myrkas25/issues)

---

**RKAS SMPN 25 Jakarta** - Sistem manajemen anggaran sekolah yang modern dan efisien.