# Setup Guide untuk Integrasi Supabase R-KAS

## Langkah 1: Setup Supabase Project

1. **Buat akun Supabase** di [https://supabase.com](https://supabase.com)
2. **Buat project baru** dengan nama "R-KAS" atau sesuai keinginan
3. **Tunggu hingga project selesai dibuat** (biasanya 1-2 menit)

## Langkah 2: Setup Database

1. **Buka SQL Editor** di dashboard Supabase
2. **Copy dan paste** seluruh isi file `SUPABASE_COMPLETE_SETUP.sql`
3. **Jalankan script** dengan menekan tombol "Run"
4. **Verifikasi** bahwa semua tabel telah dibuat di tab "Table Editor"

## Langkah 3: Konfigurasi Environment

1. **Copy file `.env.example`** menjadi `.env`:
   ```bash
   cp .env.example .env
   ```

2. **Buka dashboard Supabase** → Settings → API
3. **Copy nilai berikut**:
   - **Project URL** (contoh: https://your-project-id.supabase.co)
   - **Anon public key** (key yang panjang dimulai dengan eyJ...)

4. **Edit file `.env`** dan ganti placeholder dengan nilai sebenarnya:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## Langkah 4: Setup Authentication (Opsional)

Jika ingin menggunakan autentikasi Supabase:

1. **Buka Authentication** → Settings di dashboard Supabase
2. **Aktifkan Email provider**
3. **Konfigurasi email templates** sesuai kebutuhan
4. **Tambahkan domain aplikasi** di Site URL (untuk production)

## Langkah 5: Setup Row Level Security (RLS)

Script SQL sudah menyertakan kebijakan RLS dasar. Untuk kustomisasi lebih lanjut:

1. **Buka Table Editor** di dashboard Supabase
2. **Pilih tabel** yang ingin dikonfigurasi
3. **Klik tab "RLS"** untuk melihat dan mengedit kebijakan
4. **Sesuaikan kebijakan** sesuai kebutuhan organisasi

## Langkah 6: Testing Koneksi

1. **Restart development server**:
   ```bash
   npm run dev
   ```

2. **Buka aplikasi** di browser (http://localhost:5173)
3. **Login** dengan kredensial default atau buat akun baru
4. **Test fitur-fitur**:
   - Dashboard (harus menampilkan data)
   - Database Management (CRUD operations)
   - Master Data Management (kelola data referensi)

## Struktur Database

Aplikasi menggunakan tabel-tabel berikut:

### Tabel Utama
- `kertas_kerja_perubahan` - Data anggaran dan realisasi
- `users` - Data pengguna sistem
- `students` - Data siswa
- `inventory` - Data inventaris
- `events` - Data acara dan jadwal
- `documents` - Data dokumen
- `notifications` - Data notifikasi
- `activities` - Data perencanaan aktivitas
- `settings` - Pengaturan sistem
- `audit_logs` - Log audit sistem

### Tabel Master Data
- `bidang` - Data bidang
- `standar` - Data standar
- `giat` - Data kegiatan
- `dana` - Data sumber dana
- `rekening` - Data rekening
- `komponen` - Data komponen

## Fitur yang Tersedia

### 1. Database Management
- Import/Export CSV
- CRUD operations untuk data anggaran
- Filter dan pencarian data
- Statistik real-time

### 2. Master Data Management
- Kelola data referensi (Bidang, Standar, Giat, dll.)
- Interface tab-based untuk navigasi mudah
- CRUD operations untuk semua master data

### 3. Dashboard
- Visualisasi data anggaran
- Grafik realisasi per periode
- Statistik ringkasan
- Filter berdasarkan tahun dan periode

### 4. Reports
- Laporan anggaran dan realisasi
- Export ke berbagai format
- Filter dan grouping data

## Troubleshooting

### Error: "Failed to load data"
- Pastikan file `.env` sudah dikonfigurasi dengan benar
- Cek koneksi internet
- Verifikasi URL dan API key Supabase

### Error: "RLS policy violation"
- Pastikan user sudah login
- Cek kebijakan RLS di dashboard Supabase
- Verifikasi role user sesuai dengan kebijakan

### Error: "Table does not exist"
- Pastikan script SQL sudah dijalankan
- Cek di Table Editor apakah tabel sudah dibuat
- Jalankan ulang script jika perlu

## Support

Jika mengalami masalah:
1. Cek console browser untuk error details
2. Cek logs di dashboard Supabase
3. Pastikan semua dependencies sudah terinstall
4. Restart development server

## Security Notes

- Jangan commit file `.env` ke repository
- Gunakan environment variables untuk production
- Aktifkan RLS untuk semua tabel yang sensitif
- Regularly backup database Supabase
- Monitor usage di dashboard Supabase