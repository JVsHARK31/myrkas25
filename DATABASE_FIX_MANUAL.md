# 🔧 Panduan Manual Perbaikan Database

## ❌ Masalah yang Terdeteksi
Aplikasi mengalami error **"infinite recursion detected in policy for relation user_profiles"** yang menyebabkan:
- Dashboard tidak bisa memuat data
- Manajemen R-KAS error loading
- Database Management tidak berfungsi
- Master Data Management gagal memuat semua data

## 🛠️ Solusi Manual (WAJIB DILAKUKAN)

### Langkah 1: Buka Supabase Dashboard
1. Buka browser dan masuk ke [Supabase Dashboard](https://supabase.com/dashboard)
2. Login dengan akun Anda
3. Pilih project R-KAS Anda

### Langkah 2: Jalankan Script Perbaikan
1. Di dashboard Supabase, klik **"SQL Editor"** di sidebar kiri
2. Klik **"New Query"** untuk membuat query baru
3. Buka file `FIX_RECURSION_POLICIES.sql` di folder project ini
4. **Copy semua isi file** (Ctrl+A, Ctrl+C)
5. **Paste di SQL Editor** Supabase (Ctrl+V)
6. Klik tombol **"Run"** atau tekan **Ctrl+Enter**

### Langkah 3: Verifikasi Perbaikan
Setelah script berhasil dijalankan:
1. Refresh aplikasi R-KAS di browser
2. Coba akses semua menu:
   - Dashboard
   - Manajemen R-KAS
   - Database
   - Data Master
3. Pastikan tidak ada lagi error "infinite recursion"

## 🎯 Hasil yang Diharapkan
Setelah menjalankan script:
- ✅ Error rekursi RLS hilang
- ✅ Dashboard bisa memuat data
- ✅ Semua menu berfungsi normal
- ✅ Data master bisa diakses
- ✅ Database management berfungsi

## 🚨 Jika Masih Error
Jika setelah menjalankan script masih ada error:

1. **Cek Console Browser:**
   - Tekan F12 di browser
   - Lihat tab "Console" untuk error detail
   - Screenshot error dan hubungi developer

2. **Cek Environment Variables:**
   - Pastikan file `.env` berisi:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Restart Development Server:**
   ```bash
   # Stop server (Ctrl+C di terminal)
   # Lalu jalankan lagi:
   npm run dev
   ```

## 📞 Bantuan
Jika mengalami kesulitan:
1. Screenshot error yang muncul
2. Catat langkah yang sudah dilakukan
3. Hubungi developer dengan informasi tersebut

---

**⚠️ PENTING:** Script perbaikan database HARUS dijalankan manual di Supabase Dashboard untuk mengatasi masalah rekursi RLS. Tanpa ini, aplikasi tidak akan berfungsi dengan baik.