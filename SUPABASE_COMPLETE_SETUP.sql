-- =====================================================
-- SUPABASE COMPLETE SETUP FOR R-KAS APPLICATION
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. USERS & AUTHENTICATION TABLES
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

-- Note: User profiles will be created automatically when users sign up/login through Supabase Auth
-- The first user to sign up can be manually promoted to admin role in the database

-- =====================================================
-- 2. BUDGET & FINANCIAL TABLES
-- =====================================================

-- Main budget table (existing)
CREATE TABLE IF NOT EXISTS public.kertas_kerja_perubahan (
    id BIGSERIAL PRIMARY KEY,
    tahun INTEGER NOT NULL,
    kode_bidang VARCHAR(20),
    nama_bidang VARCHAR(255),
    kode_standar VARCHAR(20),
    nama_standar VARCHAR(255),
    kode_rekening VARCHAR(50),
    uraian TEXT,
    nama_giat VARCHAR(255),
    nama_komponen VARCHAR(255),
    satuan VARCHAR(50),
    volume DECIMAL(15,2) DEFAULT 0,
    harga_satuan DECIMAL(15,2) DEFAULT 0,
    koefisien DECIMAL(10,4) DEFAULT 1,
    nilai_rincian DECIMAL(15,2) DEFAULT 0,
    pagu_anggaran BIGINT DEFAULT 0,
    realisasi BIGINT DEFAULT 0,
    sisa_anggaran BIGINT GENERATED ALWAYS AS (pagu_anggaran - realisasi) STORED,
    persentase_realisasi DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE 
            WHEN pagu_anggaran > 0 THEN (realisasi::DECIMAL / pagu_anggaran::DECIMAL) * 100
            ELSE 0
        END
    ) STORED,
    -- Monthly budget breakdown
    bulan_1 DECIMAL(15,2) DEFAULT 0,
    bulan_2 DECIMAL(15,2) DEFAULT 0,
    bulan_3 DECIMAL(15,2) DEFAULT 0,
    bulan_4 DECIMAL(15,2) DEFAULT 0,
    bulan_5 DECIMAL(15,2) DEFAULT 0,
    bulan_6 DECIMAL(15,2) DEFAULT 0,
    bulan_7 DECIMAL(15,2) DEFAULT 0,
    bulan_8 DECIMAL(15,2) DEFAULT 0,
    bulan_9 DECIMAL(15,2) DEFAULT 0,
    bulan_10 DECIMAL(15,2) DEFAULT 0,
    bulan_11 DECIMAL(15,2) DEFAULT 0,
    bulan_12 DECIMAL(15,2) DEFAULT 0,
    -- Quarterly totals
    tw_1 DECIMAL(15,2) DEFAULT 0,
    tw_2 DECIMAL(15,2) DEFAULT 0,
    tw_3 DECIMAL(15,2) DEFAULT 0,
    tw_4 DECIMAL(15,2) DEFAULT 0,
    -- Monthly realization
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
    -- Quarterly realization
    realisasi_tw_1 DECIMAL(15,2) DEFAULT 0,
    realisasi_tw_2 DECIMAL(15,2) DEFAULT 0,
    realisasi_tw_3 DECIMAL(15,2) DEFAULT 0,
    realisasi_tw_4 DECIMAL(15,2) DEFAULT 0,
    total_akb DECIMAL(15,2) DEFAULT 0,
    total_realisasi DECIMAL(15,2) DEFAULT 0,
    created_by UUID REFERENCES public.user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Budget categories
CREATE TABLE IF NOT EXISTS public.budget_categories (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    parent_id BIGINT REFERENCES public.budget_categories(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. STUDENT MANAGEMENT TABLES
-- =====================================================

-- Students table
CREATE TABLE IF NOT EXISTS public.students (
    id BIGSERIAL PRIMARY KEY,
    student_id VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    date_of_birth DATE,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female')),
    class_name VARCHAR(50),
    grade_level INTEGER,
    enrollment_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'graduated', 'transferred')),
    parent_name VARCHAR(255),
    parent_phone VARCHAR(20),
    parent_email VARCHAR(255),
    emergency_contact VARCHAR(255),
    emergency_phone VARCHAR(20),
    photo_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student grades
CREATE TABLE IF NOT EXISTS public.student_grades (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT REFERENCES public.students(id) ON DELETE CASCADE,
    subject VARCHAR(100) NOT NULL,
    semester VARCHAR(20) NOT NULL,
    academic_year VARCHAR(10) NOT NULL,
    grade_value DECIMAL(5,2),
    grade_letter VARCHAR(2),
    teacher_name VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. INVENTORY MANAGEMENT TABLES
-- =====================================================

-- Inventory items
CREATE TABLE IF NOT EXISTS public.inventory_items (
    id BIGSERIAL PRIMARY KEY,
    item_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    brand VARCHAR(100),
    model VARCHAR(100),
    serial_number VARCHAR(100),
    purchase_date DATE,
    purchase_price DECIMAL(15,2),
    current_value DECIMAL(15,2),
    condition VARCHAR(20) DEFAULT 'good' CHECK (condition IN ('excellent', 'good', 'fair', 'poor', 'damaged')),
    location VARCHAR(255),
    responsible_person VARCHAR(255),
    warranty_expiry DATE,
    last_maintenance DATE,
    next_maintenance DATE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'disposed', 'lost')),
    photo_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory transactions
CREATE TABLE IF NOT EXISTS public.inventory_transactions (
    id BIGSERIAL PRIMARY KEY,
    item_id BIGINT REFERENCES public.inventory_items(id) ON DELETE CASCADE,
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('purchase', 'maintenance', 'repair', 'disposal', 'transfer')),
    transaction_date DATE DEFAULT CURRENT_DATE,
    description TEXT,
    cost DECIMAL(15,2),
    performed_by VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. EVENT MANAGEMENT TABLES
-- =====================================================

-- Events
CREATE TABLE IF NOT EXISTS public.events (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_type VARCHAR(50) DEFAULT 'meeting',
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    location VARCHAR(255),
    organizer VARCHAR(255),
    max_participants INTEGER,
    registration_deadline TIMESTAMP WITH TIME ZONE,
    is_public BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'planned' CHECK (status IN ('planned', 'ongoing', 'completed', 'cancelled')),
    budget DECIMAL(15,2),
    actual_cost DECIMAL(15,2),
    notes TEXT,
    created_by UUID REFERENCES public.user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event participants
CREATE TABLE IF NOT EXISTS public.event_participants (
    id BIGSERIAL PRIMARY KEY,
    event_id BIGINT REFERENCES public.events(id) ON DELETE CASCADE,
    participant_name VARCHAR(255) NOT NULL,
    participant_email VARCHAR(255),
    participant_phone VARCHAR(20),
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    attendance_status VARCHAR(20) DEFAULT 'registered' CHECK (attendance_status IN ('registered', 'attended', 'absent', 'cancelled')),
    notes TEXT
);

-- =====================================================
-- 6. DOCUMENT MANAGEMENT TABLES
-- =====================================================

-- Documents
CREATE TABLE IF NOT EXISTS public.documents (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT,
    file_type VARCHAR(50),
    category VARCHAR(100),
    tags TEXT[],
    version VARCHAR(20) DEFAULT '1.0',
    is_public BOOLEAN DEFAULT false,
    download_count INTEGER DEFAULT 0,
    uploaded_by UUID REFERENCES public.user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 7. NOTIFICATION TABLES
-- =====================================================

-- Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info' CHECK (type IN ('info', 'warning', 'error', 'success')),
    is_read BOOLEAN DEFAULT false,
    action_url TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 8. ACTIVITY PLANNING TABLES
-- =====================================================

-- Activities
CREATE TABLE IF NOT EXISTS public.activities (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    activity_type VARCHAR(50),
    start_date DATE,
    end_date DATE,
    budget DECIMAL(15,2),
    actual_cost DECIMAL(15,2),
    status VARCHAR(20) DEFAULT 'planned' CHECK (status IN ('planned', 'ongoing', 'completed', 'cancelled')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    responsible_person VARCHAR(255),
    department VARCHAR(100),
    notes TEXT,
    created_by UUID REFERENCES public.user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 9. SYSTEM SETTINGS TABLES
-- =====================================================

-- System settings
CREATE TABLE IF NOT EXISTS public.system_settings (
    id BIGSERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(50) DEFAULT 'string' CHECK (setting_type IN ('string', 'number', 'boolean', 'json')),
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    updated_by UUID REFERENCES public.user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 10. AUDIT LOG TABLE
-- =====================================================

-- Audit logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id),
    table_name VARCHAR(100) NOT NULL,
    record_id VARCHAR(100),
    action VARCHAR(20) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Budget table indexes
CREATE INDEX IF NOT EXISTS idx_kertas_kerja_tahun ON public.kertas_kerja_perubahan(tahun);
CREATE INDEX IF NOT EXISTS idx_kertas_kerja_kode ON public.kertas_kerja_perubahan(kode_rekening);
CREATE INDEX IF NOT EXISTS idx_kertas_kerja_created_by ON public.kertas_kerja_perubahan(created_by);

-- Student indexes
CREATE INDEX IF NOT EXISTS idx_students_class ON public.students(class_name);
CREATE INDEX IF NOT EXISTS idx_students_status ON public.students(status);
CREATE INDEX IF NOT EXISTS idx_student_grades_student ON public.student_grades(student_id);

-- Inventory indexes
CREATE INDEX IF NOT EXISTS idx_inventory_category ON public.inventory_items(category);
CREATE INDEX IF NOT EXISTS idx_inventory_status ON public.inventory_items(status);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_item ON public.inventory_transactions(item_id);

-- Event indexes
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_event_participants_event ON public.event_participants(event_id);

-- Document indexes
CREATE INDEX IF NOT EXISTS idx_documents_category ON public.documents(category);
CREATE INDEX IF NOT EXISTS idx_documents_uploaded_by ON public.documents(uploaded_by);

-- Notification indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(is_read);

-- Activity indexes
CREATE INDEX IF NOT EXISTS idx_activities_status ON public.activities(status);
CREATE INDEX IF NOT EXISTS idx_activities_date ON public.activities(start_date);

-- Audit log indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table ON public.audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.audit_logs(created_at);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kertas_kerja_perubahan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view all profiles" ON public.user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.user_profiles FOR UPDATE USING (auth_id = auth.uid());
CREATE POLICY "Admins can manage all profiles" ON public.user_profiles FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE auth_id = auth.uid() AND role = 'admin')
);

-- Budget policies
CREATE POLICY "Allow read access for authenticated users" ON public.kertas_kerja_perubahan FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow write access for admin users" ON public.kertas_kerja_perubahan FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE auth_id = auth.uid() AND role = 'admin')
);

-- Student policies
CREATE POLICY "Allow read access for authenticated users" ON public.students FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow write access for admin users" ON public.students FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE auth_id = auth.uid() AND role = 'admin')
);

-- Similar policies for other tables (read for authenticated, write for admin)
CREATE POLICY "Allow read access for authenticated users" ON public.student_grades FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow write access for admin users" ON public.student_grades FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE auth_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Allow read access for authenticated users" ON public.inventory_items FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow write access for admin users" ON public.inventory_items FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE auth_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Allow read access for authenticated users" ON public.events FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow write access for admin users" ON public.events FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE auth_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Allow read access for authenticated users" ON public.documents FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow write access for admin users" ON public.documents FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE auth_id = auth.uid() AND role = 'admin')
);

-- Notification policies (users can only see their own)
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (
    user_id = (SELECT id FROM public.user_profiles WHERE auth_id = auth.uid())
);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (
    user_id = (SELECT id FROM public.user_profiles WHERE auth_id = auth.uid())
);
CREATE POLICY "Admins can manage all notifications" ON public.notifications FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE auth_id = auth.uid() AND role = 'admin')
);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (auth_id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        'user'  -- Default role, can be changed to 'admin' manually
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_kertas_kerja_updated_at BEFORE UPDATE ON public.kertas_kerja_perubahan FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_budget_categories_updated_at BEFORE UPDATE ON public.budget_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_student_grades_updated_at BEFORE UPDATE ON public.student_grades FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_inventory_items_updated_at BEFORE UPDATE ON public.inventory_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON public.documents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON public.activities FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON public.system_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
-- Master data table triggers
CREATE TRIGGER update_bidang_updated_at BEFORE UPDATE ON public.bidang FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_standar_updated_at BEFORE UPDATE ON public.standar FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_giat_updated_at BEFORE UPDATE ON public.giat FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_dana_updated_at BEFORE UPDATE ON public.dana FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_rekening_updated_at BEFORE UPDATE ON public.rekening FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_komponen_updated_at BEFORE UPDATE ON public.komponen FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Audit log trigger function
CREATE OR REPLACE FUNCTION public.audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO public.audit_logs (user_id, table_name, record_id, action, old_values)
        VALUES (auth.uid(), TG_TABLE_NAME, OLD.id::TEXT, TG_OP, row_to_json(OLD));
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO public.audit_logs (user_id, table_name, record_id, action, old_values, new_values)
        VALUES (auth.uid(), TG_TABLE_NAME, NEW.id::TEXT, TG_OP, row_to_json(OLD), row_to_json(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO public.audit_logs (user_id, table_name, record_id, action, new_values)
        VALUES (auth.uid(), TG_TABLE_NAME, NEW.id::TEXT, TG_OP, row_to_json(NEW));
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Add audit triggers to important tables
CREATE TRIGGER audit_kertas_kerja_perubahan AFTER INSERT OR UPDATE OR DELETE ON public.kertas_kerja_perubahan FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();
CREATE TRIGGER audit_students AFTER INSERT OR UPDATE OR DELETE ON public.students FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();
CREATE TRIGGER audit_inventory_items AFTER INSERT OR UPDATE OR DELETE ON public.inventory_items FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();
CREATE TRIGGER audit_events AFTER INSERT OR UPDATE OR DELETE ON public.events FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();

-- =====================================================
-- SAMPLE DATA
-- =====================================================

-- Note: User profiles will be created automatically when users first sign up/login
-- No default user profile is inserted here to avoid foreign key constraint violations

-- Insert sample budget categories
INSERT INTO public.budget_categories (code, name, description) VALUES
    ('1.1', 'Belanja Pegawai', 'Belanja untuk gaji dan tunjangan pegawai'),
    ('1.2', 'Belanja Barang dan Jasa', 'Belanja untuk operasional sehari-hari'),
    ('1.3', 'Belanja Modal', 'Belanja untuk aset tetap dan infrastruktur')
ON CONFLICT (code) DO NOTHING;

-- Insert sample system settings
INSERT INTO public.system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
    ('app_name', 'R-KAS SMPN 25 Jakarta', 'string', 'Nama aplikasi', true),
    ('app_version', '1.0.0', 'string', 'Versi aplikasi', true),
    ('maintenance_mode', 'false', 'boolean', 'Mode maintenance', false),
    ('max_file_upload_size', '10485760', 'number', 'Maksimal ukuran file upload (bytes)', false),
    ('default_academic_year', '2024/2025', 'string', 'Tahun akademik default', true)
ON CONFLICT (setting_key) DO NOTHING;

-- =====================================================
-- VIEWS FOR REPORTING
-- =====================================================

-- Budget summary view
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

-- Monthly budget view
CREATE OR REPLACE VIEW public.monthly_budget AS
SELECT 
    tahun,
    'Januari' as bulan, 1 as bulan_num, SUM(bulan_1) as anggaran, SUM(realisasi_bulan_1) as realisasi
FROM public.kertas_kerja_perubahan GROUP BY tahun
UNION ALL
SELECT 
    tahun,
    'Februari' as bulan, 2 as bulan_num, SUM(bulan_2) as anggaran, SUM(realisasi_bulan_2) as realisasi
FROM public.kertas_kerja_perubahan GROUP BY tahun
-- ... (continue for all months)
ORDER BY tahun DESC, bulan_num;

-- Student statistics view
CREATE OR REPLACE VIEW public.student_statistics AS
SELECT 
    class_name,
    grade_level,
    COUNT(*) as total_students,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_students,
    COUNT(CASE WHEN gender = 'male' THEN 1 END) as male_students,
    COUNT(CASE WHEN gender = 'female' THEN 1 END) as female_students
FROM public.students
GROUP BY class_name, grade_level
ORDER BY grade_level, class_name;

-- Inventory summary view
CREATE OR REPLACE VIEW public.inventory_summary AS
SELECT 
    category,
    COUNT(*) as total_items,
    COUNT(CASE WHEN condition = 'excellent' THEN 1 END) as excellent_condition,
    COUNT(CASE WHEN condition = 'good' THEN 1 END) as good_condition,
    COUNT(CASE WHEN condition = 'fair' THEN 1 END) as fair_condition,
    COUNT(CASE WHEN condition = 'poor' THEN 1 END) as poor_condition,
    COUNT(CASE WHEN condition = 'damaged' THEN 1 END) as damaged_condition,
    SUM(current_value) as total_value
FROM public.inventory_items
WHERE status = 'active'
GROUP BY category
ORDER BY total_value DESC;

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

-- Grant usage on sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant permissions on tables
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;

-- Grant execute on functions
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- =====================================================
-- 11. MASTER DATA TABLES
-- =====================================================

-- Bidang (Field/Department)
CREATE TABLE IF NOT EXISTS public.bidang (
    id BIGSERIAL PRIMARY KEY,
    kode VARCHAR(20) UNIQUE NOT NULL,
    nama VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Standar (Standards)
CREATE TABLE IF NOT EXISTS public.standar (
    id BIGSERIAL PRIMARY KEY,
    kode VARCHAR(20) UNIQUE NOT NULL,
    nama VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Giat (Activities)
CREATE TABLE IF NOT EXISTS public.giat (
    id BIGSERIAL PRIMARY KEY,
    kode VARCHAR(20) UNIQUE NOT NULL,
    nama VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dana (Funding Sources)
CREATE TABLE IF NOT EXISTS public.dana (
    id BIGSERIAL PRIMARY KEY,
    kode VARCHAR(20) UNIQUE NOT NULL,
    nama VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rekening (Accounts)
CREATE TABLE IF NOT EXISTS public.rekening (
    id BIGSERIAL PRIMARY KEY,
    kode VARCHAR(20) UNIQUE NOT NULL,
    nama VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Komponen (Components)
CREATE TABLE IF NOT EXISTS public.komponen (
    id BIGSERIAL PRIMARY KEY,
    kode VARCHAR(20) UNIQUE NOT NULL,
    nama VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for master data tables
CREATE INDEX IF NOT EXISTS idx_bidang_kode ON public.bidang(kode);
CREATE INDEX IF NOT EXISTS idx_standar_kode ON public.standar(kode);
CREATE INDEX IF NOT EXISTS idx_giat_kode ON public.giat(kode);
CREATE INDEX IF NOT EXISTS idx_dana_kode ON public.dana(kode);
CREATE INDEX IF NOT EXISTS idx_rekening_kode ON public.rekening(kode);
CREATE INDEX IF NOT EXISTS idx_komponen_kode ON public.komponen(kode);

-- Enable RLS for master data tables
ALTER TABLE public.bidang ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.standar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.giat ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dana ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rekening ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.komponen ENABLE ROW LEVEL SECURITY;

-- RLS policies for master data tables
CREATE POLICY "Allow read access for authenticated users" ON public.bidang FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow write access for admin users" ON public.bidang FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE auth_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Allow read access for authenticated users" ON public.standar FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow write access for admin users" ON public.standar FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE auth_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Allow read access for authenticated users" ON public.giat FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow write access for admin users" ON public.giat FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE auth_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Allow read access for authenticated users" ON public.dana FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow write access for admin users" ON public.dana FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE auth_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Allow read access for authenticated users" ON public.rekening FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow write access for admin users" ON public.rekening FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE auth_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Allow read access for authenticated users" ON public.komponen FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow write access for admin users" ON public.komponen FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE auth_id = auth.uid() AND role = 'admin')
);

-- Insert sample master data
INSERT INTO public.bidang (kode, nama, deskripsi) VALUES
    ('01', 'Bidang Pendidikan', 'Bidang yang menangani kegiatan pendidikan'),
    ('02', 'Bidang Administrasi', 'Bidang yang menangani administrasi sekolah'),
    ('03', 'Bidang Sarana Prasarana', 'Bidang yang menangani sarana dan prasarana')
ON CONFLICT (kode) DO NOTHING;

INSERT INTO public.standar (kode, nama, deskripsi) VALUES
    ('01', 'Standar Nasional Pendidikan', 'Standar yang ditetapkan secara nasional'),
    ('02', 'Standar Daerah', 'Standar yang ditetapkan oleh pemerintah daerah'),
    ('03', 'Standar Sekolah', 'Standar yang ditetapkan oleh sekolah')
ON CONFLICT (kode) DO NOTHING;

INSERT INTO public.giat (kode, nama, deskripsi) VALUES
    ('001', 'Kegiatan Belajar Mengajar', 'Kegiatan utama proses pembelajaran'),
    ('002', 'Kegiatan Ekstrakurikuler', 'Kegiatan di luar jam pelajaran'),
    ('003', 'Kegiatan Administrasi', 'Kegiatan pengelolaan administrasi')
ON CONFLICT (kode) DO NOTHING;

INSERT INTO public.dana (kode, nama, deskripsi) VALUES
    ('BOS', 'Bantuan Operasional Sekolah', 'Dana dari pemerintah pusat'),
    ('BOSDA', 'Bantuan Operasional Sekolah Daerah', 'Dana dari pemerintah daerah'),
    ('SWADAYA', 'Dana Swadaya', 'Dana dari masyarakat/komite sekolah')
ON CONFLICT (kode) DO NOTHING;

INSERT INTO public.rekening (kode, nama, deskripsi) VALUES
    ('5.1.1', 'Belanja Pegawai', 'Belanja untuk gaji dan tunjangan'),
    ('5.1.2', 'Belanja Barang dan Jasa', 'Belanja operasional'),
    ('5.1.3', 'Belanja Modal', 'Belanja untuk aset tetap')
ON CONFLICT (kode) DO NOTHING;

INSERT INTO public.komponen (kode, nama, deskripsi) VALUES
    ('001', 'Gaji Pokok', 'Komponen gaji pokok pegawai'),
    ('002', 'Tunjangan', 'Komponen tunjangan pegawai'),
    ('003', 'ATK', 'Alat Tulis Kantor'),
    ('004', 'Peralatan', 'Peralatan dan perlengkapan')
ON CONFLICT (kode) DO NOTHING;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE 'Supabase setup completed successfully!';
    RAISE NOTICE 'All tables, indexes, policies, and functions have been created.';
    RAISE NOTICE 'You can now use the R-KAS application with full Supabase integration.';
END $$;