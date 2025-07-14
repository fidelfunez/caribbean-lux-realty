import { createClient } from '@supabase/supabase-js';
import { dbToFrontend, frontendToDb, dbArrayToFrontend, frontendArrayToDb, validateAndConvertTypes } from './fieldMappers';

// Initialize Supabase client with error handling
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing required Supabase environment variables:', {
    url: !!supabaseUrl,
    anonKey: !!supabaseAnonKey,
    serviceKey: !!supabaseServiceKey
  });
}

// Create two clients: one for public operations (anon key) and one for admin operations (service key)
const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
const supabaseAdmin = createClient(supabaseUrl || '', supabaseServiceKey || supabaseAnonKey || '');

// Properties functions
export const getProperties = async () => {
  try {
    // Check if Supabase is properly configured
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase not configured, returning empty array');
      return [];
    }

    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching properties:', error);
      return [];
    }

    // Convert database format to frontend format
    return dbArrayToFrontend(data || [], 'properties');
  } catch (error) {
    console.error('Error in getProperties:', error);
    return [];
  }
};

export const getPropertyById = async (id) => {
  try {
    // Check if Supabase is properly configured
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase not configured, returning null');
      return null;
    }

    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching property:', error);
      return null;
    }

    // Convert database format to frontend format
    return dbToFrontend(data, 'properties');
  } catch (error) {
    console.error('Error in getPropertyById:', error);
    return null;
  }
};

export const addProperty = async (newPropertyData) => {
  try {
    // Check if Supabase is properly configured
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase not configured. Please check your environment variables.');
    }

    // Validate and convert data types, then convert to database format
    const validatedData = validateAndConvertTypes(newPropertyData, 'properties');
    const dbData = frontendToDb(validatedData, 'properties');

    console.log('Attempting to add property to Supabase...');
    // Use admin client for insert operations
    const { data, error } = await supabaseAdmin
      .from('properties')
      .insert([dbData])
      .select()
      .single();

    if (error) {
      console.error('Supabase error adding property:', error);
      throw error;
    }

    console.log('Property added successfully:', data);
    // Convert back to frontend format
    return dbToFrontend(data, 'properties');
  } catch (error) {
    console.error('Error in addProperty:', error);
    throw error;
  }
};

export const updateProperty = async (propertyId, updatedData) => {
  try {
    // Check if Supabase is properly configured
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase not configured. Please check your environment variables.');
    }

    // Validate and convert data types, then convert to database format
    const validatedData = validateAndConvertTypes(updatedData, 'properties');
    const dbData = frontendToDb(validatedData, 'properties');

    // Use admin client for update operations
    const { data, error } = await supabaseAdmin
      .from('properties')
      .update(dbData)
      .eq('id', propertyId)
      .select()
      .single();

    if (error) {
      console.error('Error updating property:', error);
      throw error;
    }

    // Convert back to frontend format
    return dbToFrontend(data, 'properties');
  } catch (error) {
    console.error('Error in updateProperty:', error);
    throw error;
  }
};

export const deleteProperty = async (propertyId) => {
  try {
    // Check if Supabase is properly configured
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase not configured. Please check your environment variables.');
    }

    // Use admin client for delete operations
    const { error } = await supabaseAdmin
      .from('properties')
      .delete()
      .eq('id', propertyId);

    if (error) {
      console.error('Error deleting property:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteProperty:', error);
    return false;
  }
};

// Blog functions
export const getBlogPosts = async () => {
  try {
    // Check if Supabase is properly configured
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase not configured, returning empty array');
      return [];
    }

    console.log('Supabase URL:', supabaseUrl);
    console.log('Supabase Key exists:', !!supabaseAnonKey);
    
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching blog posts:', error);
      return [];
    }

    console.log('Supabase response:', { data, error });
    // Convert database format to frontend format
    return dbArrayToFrontend(data || [], 'blog_posts');
  } catch (error) {
    console.error('Error in getBlogPosts:', error);
    return [];
  }
};

export const getBlogPostBySlug = async (slug) => {
  try {
    // Check if Supabase is properly configured
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase not configured, returning null');
      return null;
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error fetching blog post:', error);
      return null;
    }

    // Convert database format to frontend format
    return dbToFrontend(data, 'blog_posts');
  } catch (error) {
    console.error('Error in getBlogPostBySlug:', error);
    return null;
  }
};

export const addBlogPost = async (newBlogData) => {
  try {
    // Check if Supabase is properly configured
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase not configured. Please check your environment variables.');
    }

    // Validate and convert data types, then convert to database format
    const validatedData = validateAndConvertTypes(newBlogData, 'blog_posts');
    const dbData = frontendToDb(validatedData, 'blog_posts');

    // Use admin client for insert operations
    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .insert([dbData])
      .select()
      .single();

    if (error) {
      console.error('Error adding blog post:', error);
      throw error;
    }

    // Convert back to frontend format
    return dbToFrontend(data, 'blog_posts');
  } catch (error) {
    console.error('Error in addBlogPost:', error);
    throw error;
  }
};

export const updateBlogPost = async (postId, updatedData) => {
  try {
    // Check if Supabase is properly configured
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase not configured. Please check your environment variables.');
    }

    // Validate and convert data types, then convert to database format
    const validatedData = validateAndConvertTypes(updatedData, 'blog_posts');
    const dbData = frontendToDb(validatedData, 'blog_posts');

    // Use admin client for update operations
    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .update(dbData)
      .eq('id', postId)
      .select()
      .single();

    if (error) {
      console.error('Error updating blog post:', error);
      throw error;
    }

    // Convert back to frontend format
    return dbToFrontend(data, 'blog_posts');
  } catch (error) {
    console.error('Error in updateBlogPost:', error);
    throw error;
  }
};

export const deleteBlogPost = async (postId) => {
  try {
    // Check if Supabase is properly configured
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase not configured. Please check your environment variables.');
    }

    // Use admin client for delete operations
    const { error } = await supabaseAdmin
      .from('blog_posts')
      .delete()
      .eq('id', postId);

    if (error) {
      console.error('Error deleting blog post:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteBlogPost:', error);
    return false;
  }
};

// Client submissions functions
export const getClientSubmissions = async () => {
  try {
    // Check if Supabase is properly configured
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase not configured, returning empty array');
      return [];
    }

    console.log('Fetching client submissions with admin client...');
    console.log('Supabase URL:', supabaseUrl);
    console.log('Service key exists:', !!supabaseServiceKey);

    // Use admin client since RLS requires authentication for SELECT
    const { data, error } = await supabaseAdmin
      .from('client_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    console.log('Raw Supabase response:', { data, error });

    if (error) {
      console.error('Error fetching client submissions:', error);
      return [];
    }

    console.log('Raw data before conversion:', data);
    console.log('Raw data length:', data ? data.length : 0);
    
    if (data && data.length > 0) {
      console.log('First raw submission:', data[0]);
      console.log('First raw submission keys:', Object.keys(data[0]));
    }
    
    // Convert database format to frontend format
    console.log('About to call dbArrayToFrontend...');
    const convertedData = dbArrayToFrontend(data || [], 'client_submissions');
    console.log('Converted data:', convertedData);
    console.log('Converted data length:', convertedData ? convertedData.length : 0);
    
    if (convertedData && convertedData.length > 0) {
      console.log('First converted submission:', convertedData[0]);
      console.log('First converted submission keys:', Object.keys(convertedData[0]));
    }
    
    return convertedData;
  } catch (error) {
    console.error('Error in getClientSubmissions:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return [];
  }
};

export const addClientSubmission = async (submissionData) => {
  try {
    // Check if Supabase is properly configured
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase not configured. Please check your environment variables.');
    }

    // Validate and convert data types, then convert to database format
    const validatedData = validateAndConvertTypes(submissionData, 'client_submissions');
    const dbData = frontendToDb(validatedData, 'client_submissions');

    // Use admin client for insert operations
    const { data, error } = await supabaseAdmin
      .from('client_submissions')
      .insert([dbData])
      .select()
      .single();

    if (error) {
      console.error('Error adding client submission:', error);
      throw error;
    }

    // Convert back to frontend format
    return dbToFrontend(data, 'client_submissions');
  } catch (error) {
    console.error('Error in addClientSubmission:', error);
    throw error;
  }
};

export const updateClientSubmission = async (submissionId, updatedData) => {
  try {
    // Check if Supabase is properly configured
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase not configured. Please check your environment variables.');
    }

    // Validate and convert data types, then convert to database format
    const validatedData = validateAndConvertTypes(updatedData, 'client_submissions');
    const dbData = frontendToDb(validatedData, 'client_submissions');

    // Use admin client for update operations
    const { data, error } = await supabaseAdmin
      .from('client_submissions')
      .update(dbData)
      .eq('id', submissionId)
      .select()
      .single();

    if (error) {
      console.error('Error updating client submission:', error);
      throw error;
    }

    // Convert back to frontend format
    return dbToFrontend(data, 'client_submissions');
  } catch (error) {
    console.error('Error in updateClientSubmission:', error);
    throw error;
  }
};

export const deleteClientSubmission = async (submissionId) => {
  try {
    // Check if Supabase is properly configured
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase not configured. Please check your environment variables.');
    }

    // Use admin client for delete operations
    const { error } = await supabaseAdmin
      .from('client_submissions')
      .delete()
      .eq('id', submissionId);

    if (error) {
      console.error('Error deleting client submission:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteClientSubmission:', error);
    return false;
  }
}; 

// Page content functions
export const getPageContent = async (pageName, sectionName = null) => {
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase not configured, returning empty object');
      return {};
    }
    let query = supabase
      .from('page_content')
      .select('*')
      .eq('page_name', pageName);
    if (sectionName) {
      query = query.eq('section_name', sectionName);
    }
    const { data, error } = await query;
    if (error) {
      console.error('Error fetching page content:', error);
      return {};
    }
    // Convert the flat structure to nested object format
    const content = {};
    data.forEach(item => {
      if (!content[item.section_name]) {
        content[item.section_name] = {};
      }
      content[item.section_name] = item.content;
    });
    return content;
  } catch (error) {
    console.error('Error in getPageContent:', error);
    return {};
  }
};

export const getAllPageContent = async () => {
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase not configured, returning empty object');
      return {};
    }
    const { data, error } = await supabase
      .from('page_content')
      .select('*')
      .order('page_name')
      .order('section_name');
    if (error) {
      console.error('Error fetching all page content:', error);
      return {};
    }
    // Convert the flat structure to nested object format
    const content = {};
    data.forEach(item => {
      if (!content[item.page_name]) {
        content[item.page_name] = {};
      }
      if (!content[item.page_name][item.section_name]) {
        content[item.page_name][item.section_name] = {};
      }
      content[item.page_name][item.section_name] = item.content;
    });
    return content;
  } catch (error) {
    console.error('Error in getAllPageContent:', error);
    return {};
  }
};

export const updatePageContent = async (pageName, sectionName, content) => {
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase not configured. Please check your environment variables.');
    }
    const { data, error } = await supabaseAdmin
      .from('page_content')
      .upsert({
        page_name: pageName,
        section_name: sectionName,
        content: content,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    if (error) {
      console.error('Error updating page content:', error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error in updatePageContent:', error);
    throw error;
  }
}; 