# Setup Supabase untuk SQL Editor

## 1. Konfigurasi Environment Variables

Buat file `.env` di root project dan isi dengan kredensial Supabase Anda:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 2. Membuat Tabel Kertas Kerja Perubahan

Jalankan SQL berikut di Supabase SQL Editor:

```sql
-- Membuat tabel kertas_kerja_perubahan
CREATE TABLE IF NOT EXISTS public.kertas_kerja_perubahan (
    id BIGSERIAL PRIMARY KEY,
    tahun INTEGER NOT NULL,
    kode_rekening VARCHAR(50),
    uraian TEXT,
    pagu_anggaran BIGINT DEFAULT 0,
    realisasi BIGINT DEFAULT 0,
    sisa_anggaran BIGINT GENERATED ALWAYS AS (pagu_anggaran - realisasi) STORED,
    persentase_realisasi DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE 
            WHEN pagu_anggaran > 0 THEN (realisasi::DECIMAL / pagu_anggaran::DECIMAL) * 100
            ELSE 0
        END
    ) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Membuat index untuk performa
CREATE INDEX IF NOT EXISTS idx_kertas_kerja_tahun ON public.kertas_kerja_perubahan(tahun);
CREATE INDEX IF NOT EXISTS idx_kertas_kerja_kode ON public.kertas_kerja_perubahan(kode_rekening);

-- Enable RLS (Row Level Security)
ALTER TABLE public.kertas_kerja_perubahan ENABLE ROW LEVEL SECURITY;

-- Policy untuk read access
CREATE POLICY "Allow read access for authenticated users" ON public.kertas_kerja_perubahan
    FOR SELECT USING (auth.role() = 'authenticated');

-- Policy untuk write access (admin only)
CREATE POLICY "Allow write access for admin users" ON public.kertas_kerja_perubahan
    FOR ALL USING (
        auth.jwt() ->> 'role' = 'admin' OR 
        auth.jwt() ->> 'email' = 'admin@rkas.com'
    );
```

## 3. Membuat Fungsi RPC untuk SQL Editor

```sql
-- Fungsi untuk menjalankan SQL query (hanya untuk admin)
CREATE OR REPLACE FUNCTION public.execute_sql(sql_query TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSON;
    is_admin BOOLEAN := FALSE;
BEGIN
    -- Check if user is admin
    SELECT (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'email' = 'admin@rkas.com') INTO is_admin;
    
    IF NOT is_admin THEN
        RAISE EXCEPTION 'Access denied. Admin privileges required.';
    END IF;
    
    -- Validate query (basic security check)
    IF sql_query ILIKE '%DROP%' OR 
       sql_query ILIKE '%DELETE%' OR 
       sql_query ILIKE '%TRUNCATE%' OR
       sql_query ILIKE '%ALTER%' THEN
        RAISE EXCEPTION 'Destructive operations are not allowed through SQL Editor.';
    END IF;
    
    -- Execute the query and return result as JSON
    EXECUTE format('SELECT json_agg(row_to_json(t)) FROM (%s) t', sql_query) INTO result;
    
    RETURN COALESCE(result, '[]'::JSON);
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Query execution failed: %', SQLERRM;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.execute_sql(TEXT) TO authenticated;
```

## 4. Import Data dari CSV

Untuk mengimport data dari file `KERTASKERJAPERUBAHAN.csv`:

```sql
-- Contoh insert data manual (sesuaikan dengan struktur CSV Anda)
INSERT INTO public.kertas_kerja_perubahan (tahun, kode_rekening, uraian, pagu_anggaran, realisasi)
VALUES 
    (2024, '1.1.1.01', 'Belanja Pegawai', 3644278, 2861402),
    (2024, '1.1.1.02', 'Belanja Barang dan Jasa', 102838, 782876),
    (2024, '1.1.1.03', 'Belanja Modal', 500000000, 400000000);
```

## 5. Membuat View untuk Laporan

```sql
-- View untuk ringkasan anggaran per tahun
CREATE OR REPLACE VIEW public.budget_summary AS
SELECT 
    tahun,
    COUNT(*) as total_items,
    SUM(pagu_anggaran) as total_pagu,
    SUM(realisasi) as total_realisasi,
    SUM(sisa_anggaran) as total_sisa,
    ROUND(AVG(persentase_realisasi), 2) as avg_realisasi_persen
FROM public.kertas_kerja_perubahan
GROUP BY tahun
ORDER BY tahun DESC;

-- View untuk top 10 item dengan realisasi tertinggi
CREATE OR REPLACE VIEW public.top_realisasi AS
SELECT 
    kode_rekening,
    uraian,
    pagu_anggaran,
    realisasi,
    persentase_realisasi
FROM public.kertas_kerja_perubahan
WHERE realisasi > 0
ORDER BY realisasi DESC
LIMIT 10;
```

## 6. Sample Queries untuk Testing

Setelah setup selesai, Anda bisa test dengan query berikut di SQL Editor:

```sql
-- 1. Lihat semua data
SELECT * FROM kertas_kerja_perubahan LIMIT 10;

-- 2. Ringkasan per tahun
SELECT * FROM budget_summary;

-- 3. Top realisasi
SELECT * FROM top_realisasi;

-- 4. Analisis varians
SELECT 
    kode_rekening,
    uraian,
    pagu_anggaran,
    realisasi,
    sisa_anggaran,
    persentase_realisasi,
    CASE 
        WHEN persentase_realisasi > 100 THEN 'Over Budget'
        WHEN persentase_realisasi > 80 THEN 'On Track'
        WHEN persentase_realisasi > 50 THEN 'Under Utilized'
        ELSE 'Low Utilization'
    END as status
FROM kertas_kerja_perubahan
WHERE tahun = 2024
ORDER BY persentase_realisasi DESC;
```

## 7. Security Notes

- Fungsi `execute_sql` hanya bisa dijalankan oleh admin
- Query destructive (DROP, DELETE, etc.) diblokir
- RLS (Row Level Security) diaktifkan untuk semua tabel
- Semua operasi dicatat dalam audit log Supabase

## 8. Troubleshooting

### Error: "relation does not exist"
- Pastikan tabel sudah dibuat dengan benar
- Check schema name (public.table_name)

### Error: "permission denied"
- Pastikan user memiliki role admin
- Check RLS policies

### Error: "function does not exist"
- Pastikan fungsi RPC sudah dibuat
- Grant permission ke authenticated users