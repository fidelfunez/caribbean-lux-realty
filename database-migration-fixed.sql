-- Caribbean Lux Database Migration Script (FIXED VERSION)
-- This script fixes all schema inconsistencies and standardizes the database

-- ===========================================
-- 1. FIX RLS POLICIES (Enable RLS properly)
-- ===========================================

-- Enable RLS on all tables
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- 2. FIX PROPERTIES TABLE (Remove duplicates)
-- ===========================================

-- Remove duplicate camelCase fields from properties table
ALTER TABLE public.properties DROP COLUMN IF EXISTS "ownershipYears";
ALTER TABLE public.properties DROP COLUMN IF EXISTS "timeToAttractions";

-- Standardize area field type to match client_submissions
ALTER TABLE public.properties ALTER COLUMN area TYPE numeric(10,2);

-- ===========================================
-- 3. STANDARDIZE FIELD TYPES (SAFE APPROACH)
-- ===========================================

-- Check current features column type and handle conversion safely
DO $$
BEGIN
    -- Check if features column exists and its current type
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'features'
    ) THEN
        -- If features is text[], convert it safely to jsonb
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'properties' 
            AND column_name = 'features' 
            AND data_type = 'ARRAY'
        ) THEN
            -- Convert text[] to jsonb safely
            ALTER TABLE public.properties ALTER COLUMN features TYPE jsonb USING 
                CASE 
                    WHEN features IS NULL THEN NULL
                    WHEN array_length(features, 1) IS NULL THEN '[]'::jsonb
                    ELSE to_jsonb(features)
                END;
        END IF;
    END IF;
END $$;

-- ===========================================
-- 4. ADD MISSING INDEXES FOR PERFORMANCE
-- ===========================================

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_properties_location ON public.properties USING btree (location);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON public.properties USING btree (created_at);
CREATE INDEX IF NOT EXISTS idx_client_submissions_created_at ON public.client_submissions USING btree (created_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON public.blog_posts USING btree (created_at);

-- ===========================================
-- 5. UPDATE RLS POLICIES (Clean up duplicates)
-- ===========================================

-- Drop any duplicate policies and recreate clean ones
-- Blog posts policies
DROP POLICY IF EXISTS "Blog posts are viewable by everyone" ON public.blog_posts;
DROP POLICY IF EXISTS "Blog posts are insertable by authenticated users" ON public.blog_posts;
DROP POLICY IF EXISTS "Blog posts are updatable by authenticated users" ON public.blog_posts;
DROP POLICY IF EXISTS "Blog posts are deletable by authenticated users" ON public.blog_posts;

-- Client submissions policies  
DROP POLICY IF EXISTS "Submissions are viewable by authenticated users" ON public.client_submissions;
DROP POLICY IF EXISTS "Submissions are insertable by everyone" ON public.client_submissions;
DROP POLICY IF EXISTS "Submissions are updatable by authenticated users" ON public.client_submissions;
DROP POLICY IF EXISTS "Submissions are deletable by authenticated users" ON public.client_submissions;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.client_submissions;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.client_submissions;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.client_submissions;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.client_submissions;

-- Properties policies
DROP POLICY IF EXISTS "Properties are viewable by everyone" ON public.properties;
DROP POLICY IF EXISTS "Properties are insertable by authenticated users" ON public.properties;
DROP POLICY IF EXISTS "Properties are updatable by authenticated users" ON public.properties;
DROP POLICY IF EXISTS "Properties are deletable by authenticated users" ON public.properties;

-- Page content policies
DROP POLICY IF EXISTS "Page content is viewable by everyone" ON public.page_content;
DROP POLICY IF EXISTS "Page content is insertable by authenticated users" ON public.page_content;
DROP POLICY IF EXISTS "Page content is updatable by authenticated users" ON public.page_content;
DROP POLICY IF EXISTS "Page content is deletable by authenticated users" ON public.page_content;

-- Create clean, consistent policies
-- Blog posts: Everyone can read, authenticated users can write
CREATE POLICY "blog_posts_select_policy" ON public.blog_posts FOR SELECT USING (true);
CREATE POLICY "blog_posts_insert_policy" ON public.blog_posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "blog_posts_update_policy" ON public.blog_posts FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "blog_posts_delete_policy" ON public.blog_posts FOR DELETE USING (auth.role() = 'authenticated');

-- Client submissions: Everyone can insert, authenticated users can read/write/delete
CREATE POLICY "client_submissions_select_policy" ON public.client_submissions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "client_submissions_insert_policy" ON public.client_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "client_submissions_update_policy" ON public.client_submissions FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "client_submissions_delete_policy" ON public.client_submissions FOR DELETE USING (auth.role() = 'authenticated');

-- Properties: Everyone can read, authenticated users can write
CREATE POLICY "properties_select_policy" ON public.properties FOR SELECT USING (true);
CREATE POLICY "properties_insert_policy" ON public.properties FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "properties_update_policy" ON public.properties FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "properties_delete_policy" ON public.properties FOR DELETE USING (auth.role() = 'authenticated');

-- Page content: Everyone can read, authenticated users can write
CREATE POLICY "page_content_select_policy" ON public.page_content FOR SELECT USING (true);
CREATE POLICY "page_content_insert_policy" ON public.page_content FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "page_content_update_policy" ON public.page_content FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "page_content_delete_policy" ON public.page_content FOR DELETE USING (auth.role() = 'authenticated');

-- ===========================================
-- 6. VERIFICATION QUERIES
-- ===========================================

-- Verify the migration worked correctly
SELECT 'Properties table structure:' as info;
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'properties' 
ORDER BY ordinal_position;

SELECT 'Client submissions table structure:' as info;
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'client_submissions' 
ORDER BY ordinal_position;

SELECT 'Blog posts table structure:' as info;
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'blog_posts' 
ORDER BY ordinal_position;

SELECT 'RLS status:' as info;
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('properties', 'client_submissions', 'blog_posts', 'page_content');

SELECT 'Active policies:' as info;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('properties', 'client_submissions', 'blog_posts', 'page_content');  