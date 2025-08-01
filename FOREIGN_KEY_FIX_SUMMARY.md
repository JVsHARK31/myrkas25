# Perbaikan Foreign Key Constraint Error

## Masalah yang Diperbaiki

Error yang terjadi:
```
ERROR: 23503: insert or update on table "user_profiles" violates foreign key constraint "user_profiles_id_fkey"
DETAIL: Key (id)=(00000000-0000-0000-0000-000000000000) is not present in table "users".
```

## Penyebab Masalah

1. **Struktur tabel `user_profiles` yang salah**: Tabel mencoba menggunakan UUID hardcoded yang tidak ada di tabel `auth.users`
2. **Insert data default yang bermasalah**: Script SQL mencoba memasukkan user profile dengan UUID yang tidak valid
3. **Tidak ada mekanisme otomatis**: Tidak ada fungsi untuk membuat user profile secara otomatis saat user mendaftar

## Solusi yang Diterapkan

### 1. Perbaikan Struktur Tabel `user_profiles`

```sql
-- Struktur baru dengan auth_id terpisah
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'user', 'manager')),
    department VARCHAR(100),
    phone VARCHAR(20),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Penghapusan Insert Data Bermasalah

Menghapus semua insert statement yang menggunakan UUID hardcoded:
- `INSERT INTO public.user_profiles (id, email, full_name, role, department) VALUES ('00000000-0000-0000-0000-000000000000'::UUID, ...)`
- `INSERT INTO public.user_profiles (email, full_name, role, is_active) VALUES ('admin@rkas.com', ...)`

### 3. Fungsi Otomatis untuk Membuat User Profile

```sql
-- Fungsi untuk menangani user baru
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (auth_id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        'user'  -- Default role, dapat diubah ke 'admin' secara manual
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger untuk membuat user profile otomatis saat signup
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 4. Pembaruan Row Level Security (RLS)

Semua kebijakan RLS diperbarui untuk menggunakan `auth_id` alih-alih `id`:

```sql
-- Contoh kebijakan yang diperbarui
CREATE POLICY "Allow write access for admin users" ON public.kertas_kerja_perubahan FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE auth_id = auth.uid() AND role = 'admin')
);
```

## Cara Membuat Admin User Pertama

### Opsi 1: Melalui Supabase Dashboard

1. Buka Supabase Dashboard → Authentication → Users
2. Buat user baru dengan email dan password
3. Setelah user dibuat, buka SQL Editor
4. Jalankan query berikut untuk mengubah role menjadi admin:

```sql
UPDATE public.user_profiles 
SET role = 'admin' 
WHERE email = 'admin@rkas.com';
```

### Opsi 2: Melalui Aplikasi

1. Daftar user baru melalui aplikasi dengan email `admin@rkas.com`
2. User profile akan dibuat otomatis dengan role 'user'
3. Gunakan SQL Editor di Supabase untuk mengubah role:

```sql
UPDATE public.user_profiles 
SET role = 'admin' 
WHERE email = 'admin@rkas.com';
```

### Opsi 3: Menggunakan Supabase CLI

```bash
# Login ke Supabase
supabase auth login

# Update role user
supabase db sql --db-url "your-db-url" --query "UPDATE public.user_profiles SET role = 'admin' WHERE email = 'admin@rkas.com';"
```

## Verifikasi Perbaikan

Setelah menjalankan script SQL yang telah diperbaiki:

1. **Cek struktur tabel**:
```sql
\d public.user_profiles
```

2. **Cek fungsi dan trigger**:
```sql
SELECT proname FROM pg_proc WHERE proname = 'handle_new_user';
SELECT tgname FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

3. **Test signup user baru**:
   - Daftar user baru melalui aplikasi
   - Cek apakah user profile dibuat otomatis
   - Verifikasi `auth_id` terisi dengan benar

## File yang Diperbarui

- `SUPABASE_COMPLETE_SETUP.sql` - Script setup lengkap yang telah diperbaiki
- Semua kebijakan RLS diperbarui
- Fungsi dan trigger baru ditambahkan
- Insert data bermasalah dihapus

## Catatan Penting

1. **Backup Database**: Selalu backup database sebelum menjalankan script perbaikan
2. **Test Environment**: Test script di environment development terlebih dahulu
3. **User Existing**: Jika ada user yang sudah ada, mereka perlu dimigrasi secara manual
4. **Role Management**: Hanya admin yang dapat mengubah role user lain

## Langkah Selanjutnya

1. Jalankan script `SUPABASE_COMPLETE_SETUP.sql` yang telah diperbaiki
2. Buat admin user pertama menggunakan salah satu opsi di atas
3. Test semua fitur aplikasi untuk memastikan semuanya berfungsi
4. Monitor log untuk memastikan tidak ada error lagi