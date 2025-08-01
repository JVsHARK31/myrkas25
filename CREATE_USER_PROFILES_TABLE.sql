-- =====================================================
-- SCRIPT KHUSUS UNTUK MEMBUAT TABEL USER_PROFILES
-- =====================================================
-- Jalankan script ini SEBELUM script master data

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. TABEL USER_PROFILES
-- =====================================================

-- Users profile table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'user', 'viewer')),
    department VARCHAR(100),
    phone VARCHAR(20),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. INDEXES UNTUK PERFORMA
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_user_profiles_auth_id ON public.user_profiles(auth_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_active ON public.user_profiles(is_active);

-- =====================================================
-- 3. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS untuk user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Kebijakan RLS untuk USER_PROFILES
DROP POLICY IF EXISTS "Users can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.user_profiles;

CREATE POLICY "Users can view all profiles" ON public.user_profiles 
FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.user_profiles 
FOR UPDATE USING (auth_id = auth.uid());

CREATE POLICY "Admins can manage all profiles" ON public.user_profiles 
FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE auth_id = auth.uid() AND role = 'admin')
);

-- =====================================================
-- 4. FUNCTIONS DAN TRIGGERS
-- =====================================================

-- Function untuk update timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function untuk membuat user profile otomatis saat signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (
        auth_id,
        email,
        full_name,
        role
    ) VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        'user'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger untuk membuat user profile otomatis saat signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger untuk update timestamp
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON public.user_profiles 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- 5. GRANT PERMISSIONS
-- =====================================================

-- Grant permissions untuk authenticated users
GRANT SELECT, INSERT, UPDATE ON public.user_profiles TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.user_profiles_id_seq TO authenticated;

-- Grant execute permissions pada functions
GRANT EXECUTE ON FUNCTION public.update_updated_at_column() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;

-- =====================================================
-- 6. VERIFIKASI DAN INFORMASI
-- =====================================================

-- Tampilkan informasi tabel yang telah dibuat
DO $$
BEGIN
    RAISE NOTICE '=== USER_PROFILES TABLE CREATED SUCCESSFULLY ===';
    RAISE NOTICE '';
    RAISE NOTICE 'Table created: public.user_profiles';
    RAISE NOTICE '';
    RAISE NOTICE 'Features enabled:';
    RAISE NOTICE '- UUID primary key';
    RAISE NOTICE '- Reference to auth.users';
    RAISE NOTICE '- Role-based access (admin, user, viewer)';
    RAISE NOTICE '- Row Level Security (RLS)';
    RAISE NOTICE '- Automatic profile creation on signup';
    RAISE NOTICE '- Update timestamp triggers';
    RAISE NOTICE '- Proper indexes for performance';
    RAISE NOTICE '';
    RAISE NOTICE 'Default role: user';
    RAISE NOTICE 'To create admin user:';
    RAISE NOTICE '1. Sign up through your app';
    RAISE NOTICE '2. Run: UPDATE public.user_profiles SET role = ''admin'' WHERE email = ''your-email@example.com'';';
    RAISE NOTICE '';
    RAISE NOTICE 'You can now run the master data tables script!';
END $$;