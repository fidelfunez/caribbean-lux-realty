# Environment Variables Setup

## Required Environment Variables

You need to add these environment variables to your Netlify deployment:

### 1. Supabase URL
- **Key:** `VITE_SUPABASE_URL`
- **Value:** Your Supabase project URL (e.g., `https://your-project-id.supabase.co`)

### 2. Supabase Anon Key
- **Key:** `VITE_SUPABASE_ANON_KEY`
- **Value:** Your Supabase anon key (for public read operations)

### 3. Supabase Service Role Key (NEW)
- **Key:** `VITE_SUPABASE_SERVICE_ROLE_KEY`
- **Value:** Your Supabase service role key (for admin operations)

## How to Get Your Service Role Key

1. Go to your Supabase dashboard
2. Navigate to **Settings** → **API**
3. Copy the **service_role** key (not the anon key)
4. Add it to your Netlify environment variables

## Netlify Setup

1. Go to your Netlify dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Add the three variables above
4. Redeploy your site

## Local Development

If you're developing locally, create a `.env` file in your project root with:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Security Note

The service role key bypasses Row Level Security (RLS) policies, so it should only be used for admin operations. The anon key is used for public read operations and respects RLS policies. 