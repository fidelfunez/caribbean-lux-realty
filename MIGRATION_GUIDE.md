# Caribbean Lux Database & Code Migration Guide

## Overview

This migration fixes all schema inconsistencies, RLS policy conflicts, and field mapping issues that have been causing problems with client submissions, admin displays, and data handling.

## Issues Fixed

### 1. Database Schema Issues
- **Duplicate fields** in properties table (`ownershipYears` vs `ownership_years`, `timeToAttractions` vs `time_to_attractions`)
- **RLS conflicts** - RLS was disabled but policies existed (contradictory state)
- **Field type mismatches** - `area` was integer in properties but numeric in client_submissions
- **Array vs JSONB inconsistencies** - `features` was text[] in properties but jsonb in client_submissions

### 2. Code Issues
- **Field mapping inconsistencies** - Frontend used camelCase, database used snake_case
- **Missing field handling** - Admin displays couldn't show submission details properly
- **Data type mismatches** - Frontend expected different data types than database provided

## Migration Steps

### Step 1: Apply Database Migration

1. **Run the SQL migration script** in your Supabase SQL Editor:
   ```sql
   -- Copy and paste the contents of database-migration.sql
   ```

2. **Verify the migration worked** by running these queries:
   ```sql
   -- Check table structures
   SELECT column_name, data_type, is_nullable 
   FROM information_schema.columns 
   WHERE table_name = 'properties' 
   ORDER BY ordinal_position;
   
   -- Check RLS status
   SELECT schemaname, tablename, rowsecurity 
   FROM pg_tables 
   WHERE tablename IN ('properties', 'client_submissions', 'blog_posts', 'page_content');
   ```

### Step 2: Deploy Code Changes

1. **The following files have been updated**:
   - `src/lib/fieldMappers.js` - NEW: Field mapping utilities
   - `src/lib/supabaseUtils.js` - Updated to use field mappers
   - `src/pages/AdminSubmissions.jsx` - Fixed display issues
   - `src/pages/ClientPropertySubmission.jsx` - Improved data handling

2. **Deploy the changes** to your hosting platform

### Step 3: Test the Fixes

1. **Test client submissions**:
   - Submit a new property through `/submit-property`
   - Verify it appears in admin dashboard with all details visible

2. **Test admin functionality**:
   - View submissions in `/admin/submissions`
   - Approve/reject submissions
   - Verify all contact and property details display correctly

3. **Test blog functionality**:
   - Create/edit blog posts in admin
   - Verify images display correctly

## What the Migration Does

### Database Changes
1. **Enables RLS properly** on all tables
2. **Removes duplicate fields** from properties table
3. **Standardizes field types** across tables
4. **Creates clean RLS policies** without conflicts
5. **Adds performance indexes** for common queries

### Code Changes
1. **Creates field mapping utilities** for consistent data handling
2. **Updates all CRUD operations** to use proper field mapping
3. **Fixes admin display issues** with proper field access
4. **Improves error handling** and data validation
5. **Standardizes data types** across frontend and backend

## Field Mapping

### Properties Table
| Frontend (camelCase) | Database (snake_case) | Type |
|---------------------|----------------------|------|
| `id` | `id` | bigserial |
| `title` | `title` | text |
| `description` | `description` | text |
| `price` | `price` | numeric(12,2) |
| `location` | `location` | text |
| `type` | `type` | text |
| `beds` | `beds` | integer |
| `baths` | `baths` | numeric(3,1) |
| `parking` | `parking` | integer |
| `area` | `area` | numeric(10,2) |
| `image` | `image` | text |
| `images` | `images` | text[] |
| `features` | `features` | jsonb |
| `ownershipYears` | `ownership_years` | integer |
| `timeToAttractions` | `time_to_attractions` | text |
| `status` | `status` | text |
| `createdAt` | `created_at` | timestamp |
| `updatedAt` | `updated_at` | timestamp |

### Client Submissions Table
| Frontend (camelCase) | Database (snake_case) | Type |
|---------------------|----------------------|------|
| `id` | `id` | bigserial |
| `contactName` | `contactname` | text |
| `contactEmail` | `contactemail` | text |
| `contactPhone` | `contactphone` | text |
| `title` | `title` | text |
| `location` | `location` | text |
| `description` | `description` | text |
| `price` | `price` | numeric(12,2) |
| `type` | `type` | text |
| `beds` | `beds` | integer |
| `baths` | `baths` | numeric(4,1) |
| `parking` | `parking` | integer |
| `area` | `area` | numeric(10,2) |
| `image` | `image` | text |
| `images` | `images` | jsonb |
| `features` | `features` | jsonb |
| `status` | `status` | text |
| `createdAt` | `created_at` | timestamp |

### Blog Posts Table
| Frontend (camelCase) | Database (snake_case) | Type |
|---------------------|----------------------|------|
| `id` | `id` | bigserial |
| `title` | `title` | text |
| `content` | `content` | text |
| `excerpt` | `excerpt` | text |
| `author` | `author` | text |
| `featuredImage` | `featured_image` | text |
| `published` | `published` | boolean |
| `slug` | `slug` | text |
| `createdAt` | `created_at` | timestamp |
| `updatedAt` | `updated_at` | timestamp |

## RLS Policies

### Blog Posts
- **SELECT**: Everyone can read
- **INSERT/UPDATE/DELETE**: Authenticated users only

### Client Submissions
- **SELECT**: Authenticated users only
- **INSERT**: Everyone (for client submissions)
- **UPDATE/DELETE**: Authenticated users only

### Properties
- **SELECT**: Everyone can read
- **INSERT/UPDATE/DELETE**: Authenticated users only

### Page Content
- **SELECT**: Everyone can read
- **INSERT/UPDATE/DELETE**: Authenticated users only

## Troubleshooting

### If submissions still don't appear:
1. Check browser console for errors
2. Verify RLS policies are active
3. Ensure admin is authenticated
4. Check that field mapping is working

### If field values are missing:
1. Verify the database migration ran successfully
2. Check that field mappers are being used
3. Clear browser cache and hard refresh

### If RLS errors occur:
1. Ensure admin is properly authenticated
2. Check that RLS is enabled on all tables
3. Verify policies are correctly applied

## Rollback Plan

If issues occur, you can rollback by:
1. Restoring the previous database schema
2. Reverting the code changes
3. Contacting support for assistance

## Benefits After Migration

1. **Consistent data handling** across all components
2. **Proper admin displays** with all submission details visible
3. **Robust error handling** and data validation
4. **Better performance** with optimized indexes
5. **Clean RLS policies** without conflicts
6. **Standardized field types** across all tables

The migration ensures that all client submissions, admin workflows, and data displays work correctly and consistently. 