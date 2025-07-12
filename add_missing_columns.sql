-- Add missing columns to properties table
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS "ownershipYears" TEXT,
ADD COLUMN IF NOT EXISTS "timeToAttractions" TEXT;

-- Add comments to describe the columns
COMMENT ON COLUMN properties."ownershipYears" IS 'Number of years owned by current owner or "New Construction"';
COMMENT ON COLUMN properties."timeToAttractions" IS 'Time to main attractions (e.g., "5 mins to beach, 10 mins to town")'; 