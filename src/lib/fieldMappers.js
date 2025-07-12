// Field mapping utilities for consistent data handling between frontend and database
// This ensures all components use the same field names and data types

// Database field names (snake_case)
export const DB_FIELDS = {
  // Common fields
  ID: 'id',
  CREATED_AT: 'created_at',
  UPDATED_AT: 'updated_at',
  STATUS: 'status',
  
  // Properties table fields
  TITLE: 'title',
  DESCRIPTION: 'description',
  PRICE: 'price',
  LOCATION: 'location',
  TYPE: 'type',
  BEDS: 'beds',
  BATHS: 'baths',
  PARKING: 'parking',
  AREA: 'area',
  IMAGE: 'image',
  IMAGES: 'images',
  FEATURES: 'features',
  OWNERSHIP_YEARS: 'ownership_years',
  TIME_TO_ATTRACTIONS: 'time_to_attractions',
  
  // Client submissions table fields
  NAME: 'name',
  EMAIL: 'email',
  PHONE: 'phone',
  PROPERTY_TYPE: 'property_type',
  BUDGET: 'budget',
  MESSAGE: 'message',
  CONTACT_NAME: 'contactname',
  CONTACT_EMAIL: 'contactemail',
  CONTACT_PHONE: 'contactphone',
  
  // Blog posts table fields
  CONTENT: 'content',
  EXCERPT: 'excerpt',
  AUTHOR: 'author',
  FEATURED_IMAGE: 'featured_image',
  PUBLISHED: 'published',
  SLUG: 'slug',
  
  // Page content table fields
  PAGE_NAME: 'page_name',
  SECTION_NAME: 'section_name'
};

// Frontend field names (camelCase)
export const FRONTEND_FIELDS = {
  // Common fields
  ID: 'id',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
  STATUS: 'status',
  
  // Properties table fields
  TITLE: 'title',
  DESCRIPTION: 'description',
  PRICE: 'price',
  LOCATION: 'location',
  TYPE: 'type',
  BEDS: 'beds',
  BATHS: 'baths',
  PARKING: 'parking',
  AREA: 'area',
  IMAGE: 'image',
  IMAGES: 'images',
  FEATURES: 'features',
  OWNERSHIP_YEARS: 'ownershipYears',
  TIME_TO_ATTRACTIONS: 'timeToAttractions',
  
  // Client submissions table fields
  NAME: 'name',
  EMAIL: 'email',
  PHONE: 'phone',
  PROPERTY_TYPE: 'propertyType',
  BUDGET: 'budget',
  MESSAGE: 'message',
  CONTACT_NAME: 'contactName',
  CONTACT_EMAIL: 'contactEmail',
  CONTACT_PHONE: 'contactPhone',
  
  // Blog posts table fields
  CONTENT: 'content',
  EXCERPT: 'excerpt',
  AUTHOR: 'author',
  FEATURED_IMAGE: 'featuredImage',
  PUBLISHED: 'published',
  SLUG: 'slug',
  
  // Page content table fields
  PAGE_NAME: 'pageName',
  SECTION_NAME: 'sectionName'
};

// Convert database object to frontend format (snake_case to camelCase)
export const dbToFrontend = (dbObject, tableType = 'properties') => {
  if (!dbObject) return null;
  
  const frontendObject = { ...dbObject };
  
  // Convert common fields
  if (frontendObject.created_at) {
    frontendObject.createdAt = frontendObject.created_at;
    delete frontendObject.created_at;
  }
  
  if (frontendObject.updated_at) {
    frontendObject.updatedAt = frontendObject.updated_at;
    delete frontendObject.updated_at;
  }
  
  // Convert table-specific fields
  if (tableType === 'properties') {
    if (frontendObject.ownership_years) {
      frontendObject.ownershipYears = frontendObject.ownership_years;
      delete frontendObject.ownership_years;
    }
    
    if (frontendObject.time_to_attractions) {
      frontendObject.timeToAttractions = frontendObject.time_to_attractions;
      delete frontendObject.time_to_attractions;
    }
  }
  
  if (tableType === 'client_submissions') {
    if (frontendObject.contactname) {
      frontendObject.contactName = frontendObject.contactname;
      delete frontendObject.contactname;
    }
    
    if (frontendObject.contactemail) {
      frontendObject.contactEmail = frontendObject.contactemail;
      delete frontendObject.contactemail;
    }
    
    if (frontendObject.contactphone) {
      frontendObject.contactPhone = frontendObject.contactphone;
      delete frontendObject.contactphone;
    }
    
    if (frontendObject.property_type) {
      frontendObject.propertyType = frontendObject.property_type;
      delete frontendObject.property_type;
    }
  }
  
  if (tableType === 'blog_posts') {
    if (frontendObject.featured_image) {
      frontendObject.featuredImage = frontendObject.featured_image;
      delete frontendObject.featured_image;
    }
  }
  
  return frontendObject;
};

// Convert frontend object to database format (camelCase to snake_case)
export const frontendToDb = (frontendObject, tableType = 'properties') => {
  if (!frontendObject) return null;
  
  const dbObject = { ...frontendObject };
  
  // Convert common fields
  if (dbObject.createdAt) {
    dbObject.created_at = dbObject.createdAt;
    delete dbObject.createdAt;
  }
  
  if (dbObject.updatedAt) {
    dbObject.updated_at = dbObject.updatedAt;
    delete dbObject.updatedAt;
  }
  
  // Convert table-specific fields
  if (tableType === 'properties') {
    if (dbObject.ownershipYears) {
      dbObject.ownership_years = dbObject.ownershipYears;
      delete dbObject.ownershipYears;
    }
    
    if (dbObject.timeToAttractions) {
      dbObject.time_to_attractions = dbObject.timeToAttractions;
      delete dbObject.timeToAttractions;
    }
  }
  
  if (tableType === 'client_submissions') {
    if (dbObject.contactName) {
      dbObject.contactname = dbObject.contactName;
      delete dbObject.contactName;
    }
    
    if (dbObject.contactEmail) {
      dbObject.contactemail = dbObject.contactEmail;
      delete dbObject.contactEmail;
    }
    
    if (dbObject.contactPhone) {
      dbObject.contactphone = dbObject.contactPhone;
      delete dbObject.contactPhone;
    }
    
    if (dbObject.propertyType) {
      dbObject.property_type = dbObject.propertyType;
      delete dbObject.propertyType;
    }
  }
  
  if (tableType === 'blog_posts') {
    if (dbObject.featuredImage) {
      dbObject.featured_image = dbObject.featuredImage;
      delete dbObject.featuredImage;
    }
  }
  
  return dbObject;
};

// Convert array of database objects to frontend format
export const dbArrayToFrontend = (dbArray, tableType = 'properties') => {
  if (!Array.isArray(dbArray)) return [];
  return dbArray.map(item => dbToFrontend(item, tableType));
};

// Convert array of frontend objects to database format
export const frontendArrayToDb = (frontendArray, tableType = 'properties') => {
  if (!Array.isArray(frontendArray)) return [];
  return frontendArray.map(item => frontendToDb(item, tableType));
};

// Data type validation and conversion
export const validateAndConvertTypes = (data, tableType = 'properties') => {
  const validated = { ...data };
  
  // Common numeric fields
  const numericFields = ['price', 'beds', 'baths', 'parking', 'area'];
  numericFields.forEach(field => {
    if (validated[field] !== undefined && validated[field] !== null && validated[field] !== '') {
      if (field === 'beds' || field === 'parking') {
        validated[field] = parseInt(validated[field]) || null;
      } else {
        validated[field] = parseFloat(validated[field]) || null;
      }
    } else if (field === 'price' || field === 'area') {
      validated[field] = 0;
    } else {
      validated[field] = null;
    }
  });
  
  // Boolean fields
  if (tableType === 'blog_posts' && validated.published !== undefined) {
    validated.published = Boolean(validated.published);
  }
  
  // Array/JSON fields
  if (validated.features && Array.isArray(validated.features)) {
    validated.features = validated.features.filter(feat => feat && feat.trim() !== '');
  }
  
  if (validated.images && Array.isArray(validated.images)) {
    validated.images = validated.images.filter(img => img && img.trim() !== '');
  }
  
  return validated;
};

// Get display value for a field (handles null/undefined gracefully)
export const getDisplayValue = (obj, field, defaultValue = 'N/A') => {
  if (!obj || !field) return defaultValue;
  
  const value = obj[field];
  if (value === null || value === undefined || value === '') {
    return defaultValue;
  }
  
  // Format specific field types
  if (field === 'price' && typeof value === 'number') {
    return `$${value.toLocaleString()}`;
  }
  
  if (field === 'area' && typeof value === 'number') {
    return `${value.toLocaleString()} sq ft`;
  }
  
  if (field === 'createdAt' || field === 'created_at') {
    try {
      return new Date(value).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return defaultValue;
    }
  }
  
  return value.toString();
}; 