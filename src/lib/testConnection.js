import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with error handling
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

// Create admin client
const supabaseAdmin = createClient(supabaseUrl || '', supabaseServiceKey || supabaseAnonKey || '');

export const testDatabaseConnection = async () => {
  try {
    console.log('=== DATABASE CONNECTION TEST ===');
    console.log('Supabase URL:', supabaseUrl);
    console.log('Service key exists:', !!supabaseServiceKey);
    
    // Test 1: Check if we can connect to the database
    const { data: testData, error: testError } = await supabaseAdmin
      .from('client_submissions')
      .select('count')
      .limit(1);
    
    console.log('Connection test result:', { testData, testError });
    
    // Test 2: Check RLS policies
    const { data: policies, error: policiesError } = await supabaseAdmin
      .rpc('get_policies', { table_name: 'client_submissions' });
    
    console.log('RLS policies:', { policies, policiesError });
    
    // Test 3: Try to fetch actual submissions
    const { data: submissions, error: submissionsError } = await supabaseAdmin
      .from('client_submissions')
      .select('*')
      .limit(5);
    
    console.log('Submissions test:', { 
      count: submissions?.length || 0, 
      error: submissionsError,
      sample: submissions?.[0] 
    });
    
    // Test 4: Check table structure
    const { data: columns, error: columnsError } = await supabaseAdmin
      .rpc('get_table_columns', { table_name: 'client_submissions' });
    
    console.log('Table structure:', { columns, columnsError });
    
    return {
      success: !testError && !submissionsError,
      connection: !testError,
      submissions: submissions?.length || 0,
      error: testError || submissionsError
    };
  } catch (error) {
    console.error('Database test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const testRLSPolicies = async () => {
  try {
    console.log('=== RLS POLICY TEST ===');
    
    // Test with regular client (should fail due to RLS)
    const regularClient = createClient(supabaseUrl || '', supabaseAnonKey || '');
    const { data: regularData, error: regularError } = await regularClient
      .from('client_submissions')
      .select('*')
      .limit(1);
    
    console.log('Regular client test:', { data: regularData, error: regularError });
    
    // Test with admin client (should succeed)
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from('client_submissions')
      .select('*')
      .limit(1);
    
    console.log('Admin client test:', { data: adminData, error: adminError });
    
    return {
      regularClientWorks: !regularError,
      adminClientWorks: !adminError,
      regularError,
      adminError
    };
  } catch (error) {
    console.error('RLS test failed:', error);
    return {
      error: error.message
    };
  }
}; 