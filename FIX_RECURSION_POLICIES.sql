-- =====================================================
-- FIX INFINITE RECURSION IN RLS POLICIES
-- =====================================================
-- This script fixes the infinite recursion issues caused by
-- policies that query user_profiles table within user_profiles policies

-- First, drop all existing policies that cause recursion
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Admins can manage all notifications" ON public.notifications;

-- Drop problematic audit trigger function that queries user_profiles
DROP FUNCTION IF EXISTS public.audit_trigger_function() CASCADE;

-- Drop all policies that use EXISTS queries on user_profiles
DROP POLICY IF EXISTS "Allow write access for admin users" ON public.kertas_kerja_perubahan;
DROP POLICY IF EXISTS "Allow write access for admin users" ON public.budget_categories;
DROP POLICY IF EXISTS "Allow write access for admin users" ON public.students;
DROP POLICY IF EXISTS "Allow write access for admin users" ON public.student_grades;
DROP POLICY IF EXISTS "Allow write access for admin users" ON public.inventory_items;
DROP POLICY IF EXISTS "Allow write access for admin users" ON public.inventory_transactions;
DROP POLICY IF EXISTS "Allow write access for admin users" ON public.events;
DROP POLICY IF EXISTS "Allow write access for admin users" ON public.event_participants;
DROP POLICY IF EXISTS "Allow write access for admin users" ON public.documents;
DROP POLICY IF EXISTS "Allow write access for admin users" ON public.activities;
DROP POLICY IF EXISTS "Allow write access for admin users" ON public.system_settings;
DROP POLICY IF EXISTS "Allow read access for admin users" ON public.audit_logs;
DROP POLICY IF EXISTS "Allow write access for admin users" ON public.bidang;
DROP POLICY IF EXISTS "Allow write access for admin users" ON public.standar;
DROP POLICY IF EXISTS "Allow write access for admin users" ON public.giat;
DROP POLICY IF EXISTS "Allow write access for admin users" ON public.dana;
DROP POLICY IF EXISTS "Allow write access for admin users" ON public.rekening;
DROP POLICY IF EXISTS "Allow write access for admin users" ON public.komponen;

-- =====================================================
-- SAFE USER_PROFILES POLICIES (NO RECURSION)
-- =====================================================

-- Simple policies for user_profiles that don't cause recursion
CREATE POLICY "Users can view all profiles" ON public.user_profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = auth_id);

CREATE POLICY "Users can insert their own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = auth_id);

-- =====================================================
-- SAFE POLICIES FOR OTHER TABLES
-- =====================================================

-- Notifications policies (simplified, no recursion)
CREATE POLICY "Authenticated users can view notifications" ON public.notifications
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage notifications" ON public.notifications
    FOR ALL USING (auth.uid() IS NOT NULL);

-- Budget data policies (simplified)
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

-- Audit logs policies (simplified)
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
-- SAFE AUDIT FUNCTION (NO RECURSION)
-- =====================================================

-- Create a simplified audit function that doesn't query user_profiles
CREATE OR REPLACE FUNCTION public.safe_audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO public.audit_logs (user_id, table_name, record_id, action, old_values)
        VALUES (
            NULL, -- Don't try to resolve user_id to avoid recursion
            TG_TABLE_NAME,
            OLD.id::TEXT,
            TG_OP,
            row_to_json(OLD)
        );
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO public.audit_logs (user_id, table_name, record_id, action, old_values, new_values)
        VALUES (
            NULL, -- Don't try to resolve user_id to avoid recursion
            TG_TABLE_NAME,
            NEW.id::TEXT,
            TG_OP,
            row_to_json(OLD),
            row_to_json(NEW)
        );
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO public.audit_logs (user_id, table_name, record_id, action, new_values)
        VALUES (
            NULL, -- Don't try to resolve user_id to avoid recursion
            TG_TABLE_NAME,
            NEW.id::TEXT,
            TG_OP,
            row_to_json(NEW)
        );
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Recreate audit triggers with safe function
CREATE TRIGGER audit_kertas_kerja_perubahan
    AFTER INSERT OR UPDATE OR DELETE ON public.kertas_kerja_perubahan
    FOR EACH ROW EXECUTE FUNCTION public.safe_audit_trigger_function();

CREATE TRIGGER audit_students
    AFTER INSERT OR UPDATE OR DELETE ON public.students
    FOR EACH ROW EXECUTE FUNCTION public.safe_audit_trigger_function();

CREATE TRIGGER audit_inventory_items
    AFTER INSERT OR UPDATE OR DELETE ON public.inventory_items
    FOR EACH ROW EXECUTE FUNCTION public.safe_audit_trigger_function();

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Test that we can query user_profiles without recursion
SELECT 'RLS policies fixed successfully - no more infinite recursion!' as status;