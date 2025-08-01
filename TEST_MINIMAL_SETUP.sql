-- =====================================================
-- MINIMAL TEST SETUP FOR R-KAS APPLICATION
-- Testing basic tables and policies without recursion
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CORE TABLES
-- =====================================================

-- User profiles table (core table)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Budget table (main business table)
CREATE TABLE IF NOT EXISTS public.kertas_kerja_perubahan (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tahun INTEGER NOT NULL,
    kode_rekening VARCHAR(50) NOT NULL,
    uraian TEXT NOT NULL,
    anggaran_murni DECIMAL(15,2) DEFAULT 0,
    perubahan DECIMAL(15,2) DEFAULT 0,
    anggaran_setelah_perubahan DECIMAL(15,2) DEFAULT 0,
    created_by UUID REFERENCES public.user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Simple master data table
CREATE TABLE IF NOT EXISTS public.bidang (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kode VARCHAR(10) UNIQUE NOT NULL,
    nama VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kertas_kerja_perubahan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bidang ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view budget data" ON public.kertas_kerja_perubahan;
DROP POLICY IF EXISTS "Authenticated users can manage budget data" ON public.kertas_kerja_perubahan;
DROP POLICY IF EXISTS "Users can view master data" ON public.bidang;
DROP POLICY IF EXISTS "Authenticated users can manage master data" ON public.bidang;

-- Simple policies without recursion
CREATE POLICY "Users can view all profiles" ON public.user_profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = auth_id);

CREATE POLICY "Users can view budget data" ON public.kertas_kerja_perubahan
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage budget data" ON public.kertas_kerja_perubahan
    FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view master data" ON public.bidang
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage master data" ON public.bidang
    FOR ALL USING (auth.uid() IS NOT NULL);

-- =====================================================
-- BASIC FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
DROP TRIGGER IF EXISTS update_kertas_kerja_perubahan_updated_at ON public.kertas_kerja_perubahan;
DROP TRIGGER IF EXISTS update_bidang_updated_at ON public.bidang;

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_kertas_kerja_perubahan_updated_at
    BEFORE UPDATE ON public.kertas_kerja_perubahan
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bidang_updated_at
    BEFORE UPDATE ON public.bidang
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (auth_id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- SAMPLE DATA
-- =====================================================

-- Insert sample bidang data
INSERT INTO public.bidang (kode, nama) VALUES 
('01', 'Bidang Pendidikan'),
('02', 'Bidang Kesehatan'),
('03', 'Bidang Infrastruktur')
ON CONFLICT (kode) DO NOTHING;

-- Success message
SELECT 'Database setup completed successfully!' as status;