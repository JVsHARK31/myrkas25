-- =====================================================
-- SUPABASE ULTRA SAFE SETUP FOR R-KAS APPLICATION
-- This version checks column existence before adding foreign keys
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
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Budget categories
CREATE TABLE IF NOT EXISTS public.budget_categories (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    parent_id BIGINT,
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
    student_id BIGINT,
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
    item_id BIGINT,
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
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event participants
CREATE TABLE IF NOT EXISTS public.event_participants (
    id BIGSERIAL PRIMARY KEY,
    event_id BIGINT,
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
    uploaded_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 7. NOTIFICATION TABLES
-- =====================================================

-- Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID,
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
    created_by UUID,
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
    updated_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 10. AUDIT LOG TABLE
-- =====================================================

-- Audit logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID,
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
-- 11. MASTER DATA TABLES (WITHOUT FOREIGN KEYS FIRST)
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

-- Standar (Standard) - without foreign key initially
CREATE TABLE IF NOT EXISTS public.standar (
    id BIGSERIAL PRIMARY KEY,
    kode VARCHAR(20) UNIQUE NOT NULL,
    nama VARCHAR(255) NOT NULL,
    bidang_id BIGINT,
    deskripsi TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Giat (Activity) - without foreign key initially
CREATE TABLE IF NOT EXISTS public.giat (
    id BIGSERIAL PRIMARY KEY,
    kode VARCHAR(20) UNIQUE NOT NULL,
    nama VARCHAR(255) NOT NULL,
    standar_id BIGINT,
    deskripsi TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dana (Fund Source)
CREATE TABLE IF NOT EXISTS public.dana (
    id BIGSERIAL PRIMARY KEY,
    kode VARCHAR(20) UNIQUE NOT NULL,
    nama VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rekening (Account) - without foreign key initially
CREATE TABLE IF NOT EXISTS public.rekening (
    id BIGSERIAL PRIMARY KEY,
    kode VARCHAR(50) UNIQUE NOT NULL,
    nama VARCHAR(255) NOT NULL,
    parent_id BIGINT,
    level_rekening INTEGER DEFAULT 1,
    deskripsi TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Komponen (Component) - without foreign key initially
CREATE TABLE IF NOT EXISTS public.komponen (
    id BIGSERIAL PRIMARY KEY,
    kode VARCHAR(20) UNIQUE NOT NULL,
    nama VARCHAR(255) NOT NULL,
    giat_id BIGINT,
    deskripsi TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ADD MISSING COLUMNS IF THEY DON'T EXIST
-- =====================================================

-- Add missing columns to existing tables
DO $$
BEGIN
    -- Add code to budget_categories if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'budget_categories' 
        AND column_name = 'code'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.budget_categories ADD COLUMN code VARCHAR(20) UNIQUE;
    END IF;

    -- Add name to budget_categories if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'budget_categories' 
        AND column_name = 'name'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.budget_categories ADD COLUMN name VARCHAR(255);
    END IF;

    -- Add parent_id to budget_categories if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'budget_categories' 
        AND column_name = 'parent_id'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.budget_categories ADD COLUMN parent_id BIGINT;
    END IF;

    -- Add pagu_anggaran to kertas_kerja_perubahan if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'kertas_kerja_perubahan' 
        AND column_name = 'pagu_anggaran'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.kertas_kerja_perubahan ADD COLUMN pagu_anggaran BIGINT DEFAULT 0;
    END IF;

    -- Add realisasi to kertas_kerja_perubahan if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'kertas_kerja_perubahan' 
        AND column_name = 'realisasi'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.kertas_kerja_perubahan ADD COLUMN realisasi BIGINT DEFAULT 0;
    END IF;

    -- Add sisa_anggaran computed column to kertas_kerja_perubahan if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'kertas_kerja_perubahan' 
        AND column_name = 'sisa_anggaran'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.kertas_kerja_perubahan ADD COLUMN sisa_anggaran BIGINT GENERATED ALWAYS AS (pagu_anggaran - realisasi) STORED;
    END IF;

    -- Add persentase_realisasi computed column to kertas_kerja_perubahan if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'kertas_kerja_perubahan' 
        AND column_name = 'persentase_realisasi'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.kertas_kerja_perubahan ADD COLUMN persentase_realisasi DECIMAL(5,2) GENERATED ALWAYS AS (
            CASE 
                WHEN pagu_anggaran > 0 THEN (realisasi::DECIMAL / pagu_anggaran::DECIMAL) * 100
                ELSE 0
            END
        ) STORED;
    END IF;

    -- Add created_by to kertas_kerja_perubahan if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'kertas_kerja_perubahan' 
        AND column_name = 'created_by'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.kertas_kerja_perubahan ADD COLUMN created_by UUID;
    END IF;

    -- Add student_id to student_grades if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'student_grades' 
        AND column_name = 'student_id'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.student_grades ADD COLUMN student_id BIGINT;
    END IF;

    -- Add item_id to inventory_transactions if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'inventory_transactions' 
        AND column_name = 'item_id'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.inventory_transactions ADD COLUMN item_id BIGINT;
    END IF;

    -- Add created_by to events if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'events' 
        AND column_name = 'created_by'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.events ADD COLUMN created_by UUID;
    END IF;

    -- Add event_id to event_participants if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'event_participants' 
        AND column_name = 'event_id'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.event_participants ADD COLUMN event_id BIGINT;
    END IF;

    -- Add uploaded_by to documents if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'documents' 
        AND column_name = 'uploaded_by'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.documents ADD COLUMN uploaded_by UUID;
    END IF;

    -- Add user_id to notifications if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'notifications' 
        AND column_name = 'user_id'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.notifications ADD COLUMN user_id UUID;
    END IF;

    -- Add created_by to activities if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'activities' 
        AND column_name = 'created_by'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.activities ADD COLUMN created_by UUID;
    END IF;

    -- Add updated_by to system_settings if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'system_settings' 
        AND column_name = 'updated_by'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.system_settings ADD COLUMN updated_by UUID;
    END IF;

    -- Add user_id to audit_logs if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'audit_logs' 
        AND column_name = 'user_id'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.audit_logs ADD COLUMN user_id UUID;
    END IF;

    -- Add bidang_id to standar if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'standar' 
        AND column_name = 'bidang_id'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.standar ADD COLUMN bidang_id BIGINT;
    END IF;

    -- Add standar_id to giat if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'giat' 
        AND column_name = 'standar_id'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.giat ADD COLUMN standar_id BIGINT;
    END IF;

    -- Add parent_id to rekening if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'rekening' 
        AND column_name = 'parent_id'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.rekening ADD COLUMN parent_id BIGINT;
    END IF;

    -- Add giat_id to komponen if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'komponen' 
        AND column_name = 'giat_id'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.komponen ADD COLUMN giat_id BIGINT;
    END IF;

END $$;

-- =====================================================
-- ADD FOREIGN KEY CONSTRAINTS AFTER COLUMNS EXIST
-- =====================================================

-- Add foreign key constraints safely with column existence check
DO $$
BEGIN
    -- Add foreign key for kertas_kerja_perubahan.created_by
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'kertas_kerja_perubahan_created_by_fkey'
        AND table_schema = 'public'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'kertas_kerja_perubahan' 
        AND column_name = 'created_by'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.kertas_kerja_perubahan 
        ADD CONSTRAINT kertas_kerja_perubahan_created_by_fkey 
        FOREIGN KEY (created_by) REFERENCES public.user_profiles(id);
    END IF;

    -- Add foreign key for budget_categories.parent_id
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'budget_categories_parent_id_fkey'
        AND table_schema = 'public'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'budget_categories' 
        AND column_name = 'parent_id'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.budget_categories 
        ADD CONSTRAINT budget_categories_parent_id_fkey 
        FOREIGN KEY (parent_id) REFERENCES public.budget_categories(id);
    END IF;

    -- Add foreign key for student_grades.student_id
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'student_grades_student_id_fkey'
        AND table_schema = 'public'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'student_grades' 
        AND column_name = 'student_id'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.student_grades 
        ADD CONSTRAINT student_grades_student_id_fkey 
        FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;
    END IF;

    -- Add foreign key for inventory_transactions.item_id
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'inventory_transactions_item_id_fkey'
        AND table_schema = 'public'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'inventory_transactions' 
        AND column_name = 'item_id'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.inventory_transactions 
        ADD CONSTRAINT inventory_transactions_item_id_fkey 
        FOREIGN KEY (item_id) REFERENCES public.inventory_items(id) ON DELETE CASCADE;
    END IF;

    -- Add foreign key for events.created_by
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'events_created_by_fkey'
        AND table_schema = 'public'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'events' 
        AND column_name = 'created_by'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.events 
        ADD CONSTRAINT events_created_by_fkey 
        FOREIGN KEY (created_by) REFERENCES public.user_profiles(id);
    END IF;

    -- Add foreign key for event_participants.event_id
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'event_participants_event_id_fkey'
        AND table_schema = 'public'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'event_participants' 
        AND column_name = 'event_id'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.event_participants 
        ADD CONSTRAINT event_participants_event_id_fkey 
        FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;
    END IF;

    -- Add foreign key for documents.uploaded_by
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'documents_uploaded_by_fkey'
        AND table_schema = 'public'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'documents' 
        AND column_name = 'uploaded_by'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.documents 
        ADD CONSTRAINT documents_uploaded_by_fkey 
        FOREIGN KEY (uploaded_by) REFERENCES public.user_profiles(id);
    END IF;

    -- Add foreign key for notifications.user_id
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'notifications_user_id_fkey'
        AND table_schema = 'public'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'notifications' 
        AND column_name = 'user_id'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.notifications 
        ADD CONSTRAINT notifications_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON DELETE CASCADE;
    END IF;

    -- Add foreign key for activities.created_by
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'activities_created_by_fkey'
        AND table_schema = 'public'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'activities' 
        AND column_name = 'created_by'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.activities 
        ADD CONSTRAINT activities_created_by_fkey 
        FOREIGN KEY (created_by) REFERENCES public.user_profiles(id);
    END IF;

    -- Add foreign key for system_settings.updated_by
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'system_settings_updated_by_fkey'
        AND table_schema = 'public'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'system_settings' 
        AND column_name = 'updated_by'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.system_settings 
        ADD CONSTRAINT system_settings_updated_by_fkey 
        FOREIGN KEY (updated_by) REFERENCES public.user_profiles(id);
    END IF;

    -- Add foreign key for audit_logs.user_id
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'audit_logs_user_id_fkey'
        AND table_schema = 'public'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'audit_logs' 
        AND column_name = 'user_id'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.audit_logs 
        ADD CONSTRAINT audit_logs_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES public.user_profiles(id);
    END IF;

    -- Add foreign key for standar.bidang_id
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'standar_bidang_id_fkey'
        AND table_schema = 'public'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'standar' 
        AND column_name = 'bidang_id'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.standar 
        ADD CONSTRAINT standar_bidang_id_fkey 
        FOREIGN KEY (bidang_id) REFERENCES public.bidang(id);
    END IF;

    -- Add foreign key for giat.standar_id
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'giat_standar_id_fkey'
        AND table_schema = 'public'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'giat' 
        AND column_name = 'standar_id'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.giat 
        ADD CONSTRAINT giat_standar_id_fkey 
        FOREIGN KEY (standar_id) REFERENCES public.standar(id);
    END IF;

    -- Add foreign key for rekening.parent_id
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'rekening_parent_id_fkey'
        AND table_schema = 'public'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'rekening' 
        AND column_name = 'parent_id'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.rekening 
        ADD CONSTRAINT rekening_parent_id_fkey 
        FOREIGN KEY (parent_id) REFERENCES public.rekening(id);
    END IF;

    -- Add foreign key for komponen.giat_id
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'komponen_giat_id_fkey'
        AND table_schema = 'public'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'komponen' 
        AND column_name = 'giat_id'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.komponen 
        ADD CONSTRAINT komponen_giat_id_fkey 
        FOREIGN KEY (giat_id) REFERENCES public.giat(id);
    END IF;

END $$;

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Budget table indexes
CREATE INDEX IF NOT EXISTS idx_kertas_kerja_tahun ON public.kertas_kerja_perubahan(tahun);
CREATE INDEX IF NOT EXISTS idx_kertas_kerja_kode ON public.kertas_kerja_perubahan(kode_rekening);
CREATE INDEX IF NOT EXISTS idx_kertas_kerja_created_by ON public.kertas_kerja_perubahan(created_by);

-- Budget categories indexes
CREATE INDEX IF NOT EXISTS idx_budget_categories_parent ON public.budget_categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_budget_categories_code ON public.budget_categories(code);

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

-- Master data indexes
CREATE INDEX IF NOT EXISTS idx_bidang_kode ON public.bidang(kode);
CREATE INDEX IF NOT EXISTS idx_standar_kode ON public.standar(kode);
CREATE INDEX IF NOT EXISTS idx_standar_bidang ON public.standar(bidang_id);
CREATE INDEX IF NOT EXISTS idx_giat_kode ON public.giat(kode);
CREATE INDEX IF NOT EXISTS idx_giat_standar ON public.giat(standar_id);
CREATE INDEX IF NOT EXISTS idx_dana_kode ON public.dana(kode);
CREATE INDEX IF NOT EXISTS idx_rekening_kode ON public.rekening(kode);
CREATE INDEX IF NOT EXISTS idx_rekening_parent ON public.rekening(parent_id);
CREATE INDEX IF NOT EXISTS idx_komponen_kode ON public.komponen(kode);
CREATE INDEX IF NOT EXISTS idx_komponen_giat ON public.komponen(giat_id);

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
ALTER TABLE public.bidang ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.standar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.giat ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dana ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rekening ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.komponen ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.user_profiles;

DROP POLICY IF EXISTS "Users can view budget data" ON public.kertas_kerja_perubahan;
DROP POLICY IF EXISTS "Admins can manage budget data" ON public.kertas_kerja_perubahan;

DROP POLICY IF EXISTS "Users can view budget categories" ON public.budget_categories;
DROP POLICY IF EXISTS "Admins can manage budget categories" ON public.budget_categories;

DROP POLICY IF EXISTS "Users can view students" ON public.students;
DROP POLICY IF EXISTS "Admins can manage students" ON public.students;

DROP POLICY IF EXISTS "Users can view student grades" ON public.student_grades;
DROP POLICY IF EXISTS "Admins can manage student grades" ON public.student_grades;

DROP POLICY IF EXISTS "Users can view inventory" ON public.inventory_items;
DROP POLICY IF EXISTS "Admins can manage inventory" ON public.inventory_items;

DROP POLICY IF EXISTS "Users can view inventory transactions" ON public.inventory_transactions;
DROP POLICY IF EXISTS "Admins can manage inventory transactions" ON public.inventory_transactions;

DROP POLICY IF EXISTS "Users can view events" ON public.events;
DROP POLICY IF EXISTS "Admins can manage events" ON public.events;

DROP POLICY IF EXISTS "Users can view event participants" ON public.event_participants;
DROP POLICY IF EXISTS "Admins can manage event participants" ON public.event_participants;

DROP POLICY IF EXISTS "Users can view documents" ON public.documents;
DROP POLICY IF EXISTS "Admins can manage documents" ON public.documents;

DROP POLICY IF EXISTS "Users can view their notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their notifications" ON public.notifications;
DROP POLICY IF EXISTS "Admins can manage all notifications" ON public.notifications;

DROP POLICY IF EXISTS "Users can view activities" ON public.activities;
DROP POLICY IF EXISTS "Admins can manage activities" ON public.activities;

DROP POLICY IF EXISTS "Admins can view system settings" ON public.system_settings;
DROP POLICY IF EXISTS "Admins can manage system settings" ON public.system_settings;

DROP POLICY IF EXISTS "Admins can view audit logs" ON public.audit_logs;

-- Master data policies
DROP POLICY IF EXISTS "Users can view master data" ON public.bidang;
DROP POLICY IF EXISTS "Admins can manage master data" ON public.bidang;
DROP POLICY IF EXISTS "Users can view master data" ON public.standar;
DROP POLICY IF EXISTS "Admins can manage master data" ON public.standar;
DROP POLICY IF EXISTS "Users can view master data" ON public.giat;
DROP POLICY IF EXISTS "Admins can manage master data" ON public.giat;
DROP POLICY IF EXISTS "Users can view master data" ON public.dana;
DROP POLICY IF EXISTS "Admins can manage master data" ON public.dana;
DROP POLICY IF EXISTS "Users can view master data" ON public.rekening;
DROP POLICY IF EXISTS "Admins can manage master data" ON public.rekening;
DROP POLICY IF EXISTS "Users can view master data" ON public.komponen;
DROP POLICY IF EXISTS "Admins can manage master data" ON public.komponen;

-- User profiles policies (simplified to avoid recursion)
CREATE POLICY "Users can view all profiles" ON public.user_profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = auth_id);

CREATE POLICY "Users can insert their own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = auth_id);

-- Budget data policies
CREATE POLICY "Users can view budget data" ON public.kertas_kerja_perubahan
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage budget data" ON public.kertas_kerja_perubahan
    FOR ALL USING (auth.uid() IS NOT NULL);

-- Budget categories policies
CREATE POLICY "Users can view budget categories" ON public.budget_categories
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage budget categories" ON public.budget_categories
    FOR ALL USING (auth.uid() IS NOT NULL);

-- Students policies
CREATE POLICY "Users can view students" ON public.students
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage students" ON public.students
    FOR ALL USING (auth.uid() IS NOT NULL);

-- Student grades policies
CREATE POLICY "Users can view student grades" ON public.student_grades
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage student grades" ON public.student_grades
    FOR ALL USING (auth.uid() IS NOT NULL);

-- Inventory policies
CREATE POLICY "Users can view inventory" ON public.inventory_items
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage inventory" ON public.inventory_items
    FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view inventory transactions" ON public.inventory_transactions
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage inventory transactions" ON public.inventory_transactions
    FOR ALL USING (auth.uid() IS NOT NULL);

-- Events policies
CREATE POLICY "Users can view events" ON public.events
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage events" ON public.events
    FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view event participants" ON public.event_participants
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage event participants" ON public.event_participants
    FOR ALL USING (auth.uid() IS NOT NULL);

-- Documents policies
CREATE POLICY "Users can view documents" ON public.documents
    FOR SELECT USING (is_public = true OR auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage documents" ON public.documents
    FOR ALL USING (auth.uid() IS NOT NULL);

-- Notifications policies
CREATE POLICY "Authenticated users can view notifications" ON public.notifications
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage notifications" ON public.notifications
    FOR ALL USING (auth.uid() IS NOT NULL);

-- Activities policies
CREATE POLICY "Users can view activities" ON public.activities
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage activities" ON public.activities
    FOR ALL USING (auth.uid() IS NOT NULL);

-- System settings policies
CREATE POLICY "Users can view system settings" ON public.system_settings
    FOR SELECT USING (is_public = true OR auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage system settings" ON public.system_settings
    FOR ALL USING (auth.uid() IS NOT NULL);

-- Audit logs policies
CREATE POLICY "Authenticated users can view audit logs" ON public.audit_logs
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- Master data policies
CREATE POLICY "Users can view master data" ON public.bidang
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage master data" ON public.bidang
    FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view master data" ON public.standar
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage master data" ON public.standar
    FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view master data" ON public.giat
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage master data" ON public.giat
    FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view master data" ON public.dana
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage master data" ON public.dana
    FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view master data" ON public.rekening
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage master data" ON public.rekening
    FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view master data" ON public.komponen
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage master data" ON public.komponen
    FOR ALL USING (auth.uid() IS NOT NULL);

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

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
DROP TRIGGER IF EXISTS update_kertas_kerja_perubahan_updated_at ON public.kertas_kerja_perubahan;
DROP TRIGGER IF EXISTS update_budget_categories_updated_at ON public.budget_categories;
DROP TRIGGER IF EXISTS update_students_updated_at ON public.students;
DROP TRIGGER IF EXISTS update_student_grades_updated_at ON public.student_grades;
DROP TRIGGER IF EXISTS update_inventory_items_updated_at ON public.inventory_items;
DROP TRIGGER IF EXISTS update_events_updated_at ON public.events;
DROP TRIGGER IF EXISTS update_documents_updated_at ON public.documents;
DROP TRIGGER IF EXISTS update_activities_updated_at ON public.activities;
DROP TRIGGER IF EXISTS update_system_settings_updated_at ON public.system_settings;
DROP TRIGGER IF EXISTS update_bidang_updated_at ON public.bidang;
DROP TRIGGER IF EXISTS update_standar_updated_at ON public.standar;
DROP TRIGGER IF EXISTS update_giat_updated_at ON public.giat;
DROP TRIGGER IF EXISTS update_dana_updated_at ON public.dana;
DROP TRIGGER IF EXISTS update_rekening_updated_at ON public.rekening;
DROP TRIGGER IF EXISTS update_komponen_updated_at ON public.komponen;

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_kertas_kerja_perubahan_updated_at
    BEFORE UPDATE ON public.kertas_kerja_perubahan
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_budget_categories_updated_at
    BEFORE UPDATE ON public.budget_categories
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_students_updated_at
    BEFORE UPDATE ON public.students
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_grades_updated_at
    BEFORE UPDATE ON public.student_grades
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_inventory_items_updated_at
    BEFORE UPDATE ON public.inventory_items
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON public.events
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
    BEFORE UPDATE ON public.documents
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_activities_updated_at
    BEFORE UPDATE ON public.activities
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at
    BEFORE UPDATE ON public.system_settings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bidang_updated_at
    BEFORE UPDATE ON public.bidang
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_standar_updated_at
    BEFORE UPDATE ON public.standar
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_giat_updated_at
    BEFORE UPDATE ON public.giat
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_dana_updated_at
    BEFORE UPDATE ON public.dana
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rekening_updated_at
    BEFORE UPDATE ON public.rekening
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_komponen_updated_at
    BEFORE UPDATE ON public.komponen
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

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Audit log function
CREATE OR REPLACE FUNCTION public.audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO public.audit_logs (
            user_id, table_name, record_id, action, old_values, ip_address
        ) VALUES (
            (SELECT id FROM public.user_profiles WHERE auth_id = auth.uid()),
            TG_TABLE_NAME,
            OLD.id::TEXT,
            TG_OP,
            to_jsonb(OLD),
            inet_client_addr()
        );
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO public.audit_logs (
            user_id, table_name, record_id, action, old_values, new_values, ip_address
        ) VALUES (
            (SELECT id FROM public.user_profiles WHERE auth_id = auth.uid()),
            TG_TABLE_NAME,
            NEW.id::TEXT,
            TG_OP,
            to_jsonb(OLD),
            to_jsonb(NEW),
            inet_client_addr()
        );
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO public.audit_logs (
            user_id, table_name, record_id, action, new_values, ip_address
        ) VALUES (
            (SELECT id FROM public.user_profiles WHERE auth_id = auth.uid()),
            TG_TABLE_NAME,
            NEW.id::TEXT,
            TG_OP,
            to_jsonb(NEW),
            inet_client_addr()
        );
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Drop existing audit triggers if they exist
DROP TRIGGER IF EXISTS audit_kertas_kerja_perubahan ON public.kertas_kerja_perubahan;
DROP TRIGGER IF EXISTS audit_students ON public.students;
DROP TRIGGER IF EXISTS audit_inventory_items ON public.inventory_items;
DROP TRIGGER IF EXISTS audit_events ON public.events;
DROP TRIGGER IF EXISTS audit_documents ON public.documents;

-- Create audit triggers for important tables
CREATE TRIGGER audit_kertas_kerja_perubahan
    AFTER INSERT OR UPDATE OR DELETE ON public.kertas_kerja_perubahan
    FOR EACH ROW EXECUTE FUNCTION public.audit_trigger();

CREATE TRIGGER audit_students
    AFTER INSERT OR UPDATE OR DELETE ON public.students
    FOR EACH ROW EXECUTE FUNCTION public.audit_trigger();

CREATE TRIGGER audit_inventory_items
    AFTER INSERT OR UPDATE OR DELETE ON public.inventory_items
    FOR EACH ROW EXECUTE FUNCTION public.audit_trigger();

CREATE TRIGGER audit_events
    AFTER INSERT OR UPDATE OR DELETE ON public.events
    FOR EACH ROW EXECUTE FUNCTION public.audit_trigger();

CREATE TRIGGER audit_documents
    AFTER INSERT OR UPDATE OR DELETE ON public.documents
    FOR EACH ROW EXECUTE FUNCTION public.audit_trigger();

-- =====================================================
-- SAMPLE DATA
-- =====================================================

-- Insert sample master data
INSERT INTO public.bidang (kode, nama, deskripsi) VALUES
('01', 'Pendidikan', 'Bidang Pendidikan dan Pengajaran'),
('02', 'Kesehatan', 'Bidang Kesehatan dan Kesejahteraan'),
('03', 'Infrastruktur', 'Bidang Infrastruktur dan Pembangunan')
ON CONFLICT (kode) DO NOTHING;

INSERT INTO public.standar (kode, nama, bidang_id, deskripsi) VALUES
('01.01', 'Pendidikan Dasar', 1, 'Standar Pendidikan Tingkat Dasar'),
('01.02', 'Pendidikan Menengah', 1, 'Standar Pendidikan Tingkat Menengah'),
('02.01', 'Pelayanan Kesehatan', 2, 'Standar Pelayanan Kesehatan Masyarakat')
ON CONFLICT (kode) DO NOTHING;

INSERT INTO public.dana (kode, nama, deskripsi) VALUES
('APBN', 'Anggaran Pendapatan dan Belanja Negara', 'Dana dari APBN'),
('APBD', 'Anggaran Pendapatan dan Belanja Daerah', 'Dana dari APBD'),
('HIBAH', 'Dana Hibah', 'Dana dari hibah atau bantuan')
ON CONFLICT (kode) DO NOTHING;

-- Insert sample budget categories
INSERT INTO public.budget_categories (code, name, description) VALUES
('OPERASIONAL', 'Biaya Operasional', 'Biaya operasional sehari-hari'),
('INVESTASI', 'Biaya Investasi', 'Biaya untuk investasi dan pengembangan'),
('PEMELIHARAAN', 'Biaya Pemeliharaan', 'Biaya pemeliharaan aset dan fasilitas')
ON CONFLICT (code) DO NOTHING;

-- Insert sample system settings
INSERT INTO public.system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('app_name', 'R-KAS Management System', 'string', 'Nama aplikasi', true),
('app_version', '1.0.0', 'string', 'Versi aplikasi', true),
('max_file_size', '10485760', 'number', 'Ukuran maksimal file upload (bytes)', false),
('enable_notifications', 'true', 'boolean', 'Aktifkan notifikasi sistem', false)
ON CONFLICT (setting_key) DO NOTHING;

-- =====================================================
-- VIEWS FOR REPORTING
-- =====================================================

-- Budget summary view
CREATE OR REPLACE VIEW public.budget_summary AS
SELECT 
    tahun,
    kode_bidang,
    nama_bidang,
    COUNT(*) as total_items,
    SUM(pagu_anggaran) as total_pagu,
    SUM(realisasi) as total_realisasi,
    SUM(sisa_anggaran) as total_sisa,
    CASE 
        WHEN SUM(pagu_anggaran) > 0 THEN 
            ROUND((SUM(realisasi)::DECIMAL / SUM(pagu_anggaran)::DECIMAL) * 100, 2)
        ELSE 0
    END as persentase_realisasi
FROM public.kertas_kerja_perubahan
GROUP BY tahun, kode_bidang, nama_bidang
ORDER BY tahun DESC, kode_bidang;

-- Student summary view (simplified)
CREATE OR REPLACE VIEW public.student_summary AS
SELECT 
    class_name,
    COUNT(*) as total_students,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_students
FROM public.students
GROUP BY class_name
ORDER BY class_name;

-- Inventory summary view (simplified)
CREATE OR REPLACE VIEW public.inventory_summary AS
SELECT 
    category,
    COUNT(*) as total_items,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_items
FROM public.inventory_items
GROUP BY category
ORDER BY category;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE 'Supabase setup completed successfully!';
    RAISE NOTICE 'All tables, indexes, policies, and functions have been created.';
    RAISE NOTICE 'You can now use the R-KAS application with full Supabase integration.';
END $$;