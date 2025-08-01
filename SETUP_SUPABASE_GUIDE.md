# 🔧 Panduan Setup Supabase untuk Aplikasi R-KAS

## ❌ Masalah Saat Ini
Aplikasi tidak dapat terhubung ke database karena kredensial Supabase belum dikonfigurasi dengan benar.

## ✅ Solusi Langkah demi Langkah

### 1. Buat Project Supabase (Jika Belum Ada)
1. Kunjungi [https://supabase.com](https://supabase.com)
2. Daftar/Login ke akun Supabase
3. Klik "New Project"
4. Isi nama project (contoh: "rkas-app")
5. Pilih region terdekat
6. Tunggu project selesai dibuat (2-3 menit)

### 2. Dapatkan Kredensial Supabase
1. Buka dashboard project Supabase Anda
2. Klik **Settings** di sidebar kiri
3. Klik **API** di menu Settings
4. Copy dua nilai berikut:
   - **Project URL** (contoh: `https://abcdefghijk.supabase.co`)
   - **anon/public key** (string panjang yang dimulai dengan `eyJ...`)

### 3. Update File .env
1. Buka file `.env` di folder project
2. Ganti nilai berikut dengan kredensial Anda:

```env
# Ganti dengan Project URL Anda
VITE_SUPABASE_URL=https://your-project-id.supabase.co

# Ganti dengan anon/public key Anda
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Contoh file .env yang benar:**
```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY5ODc2NTQzMiwiZXhwIjoyMDE0MzQxNDMyfQ.example_signature_here
```

### 4. Setup Database Schema
Setelah kredensial dikonfigurasi, jalankan perintah berikut:

```bash
# Jalankan perbaikan database
node fix-database-comprehensive.js
```

### 5. Restart Development Server
```bash
# Stop server yang sedang berjalan (Ctrl+C)
# Kemudian jalankan ulang
npm run dev
```

## 🔍 Verifikasi Setup

Setelah setup selesai, Anda harus melihat:
- ✅ Supabase connection successful!
- ✅ All tables created/verified
- ✅ RLS enabled on all tables
- ✅ Safe policies created (no recursion)
- ✅ Sample data inserted

## 🚨 Troubleshooting

### Error: "fetch failed"
- Pastikan Project URL dan anon key sudah benar
- Pastikan tidak ada spasi di awal/akhir kredensial
- Pastikan project Supabase sudah aktif (tidak di-pause)

### Error: "infinite recursion"
- Jalankan script perbaikan: `node fix-database-comprehensive.js`
- Script ini akan memperbaiki kebijakan RLS yang bermasalah

### Error: "table does not exist"
- Script perbaikan akan membuat semua tabel yang diperlukan
- Pastikan kredensial Supabase sudah benar sebelum menjalankan script

## 📞 Bantuan Lebih Lanjut

Jika masih mengalami masalah:
1. Periksa console browser untuk error detail
2. Periksa dashboard Supabase untuk status project
3. Pastikan semua langkah di atas sudah diikuti dengan benar

---

**⚠️ PENTING:** Jangan share kredensial Supabase Anda dengan orang lain. Simpan file .env dengan aman dan jangan commit ke repository public.