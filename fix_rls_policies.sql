-- Fix RLS policies for properties table
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for all users" ON properties;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON properties;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON properties;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON properties;

-- Create new policies
-- Allow all users to read properties (public access)
CREATE POLICY "Enable read access for all users" ON properties
    FOR SELECT USING (true);

-- Allow authenticated users to insert properties
CREATE POLICY "Enable insert for authenticated users only" ON properties
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update properties
CREATE POLICY "Enable update for authenticated users only" ON properties
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete properties
CREATE POLICY "Enable delete for authenticated users only" ON properties
    FOR DELETE USING (auth.role() = 'authenticated');

-- Also fix RLS policies for blog_posts table
DROP POLICY IF EXISTS "Enable read access for all users" ON blog_posts;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON blog_posts;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON blog_posts;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON blog_posts;

CREATE POLICY "Enable read access for all users" ON blog_posts
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON blog_posts
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON blog_posts
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON blog_posts
    FOR DELETE USING (auth.role() = 'authenticated');

-- Fix RLS policies for client_submissions table
DROP POLICY IF EXISTS "Enable read access for all users" ON client_submissions;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON client_submissions;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON client_submissions;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON client_submissions;

CREATE POLICY "Enable read access for all users" ON client_submissions
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON client_submissions
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON client_submissions
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON client_submissions
    FOR DELETE USING (auth.role() = 'authenticated'); 