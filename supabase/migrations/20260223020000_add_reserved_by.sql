-- Add reserved_by column to products table
ALTER TABLE products ADD COLUMN reserved_by text;

-- Add comment explaining the field
COMMENT ON COLUMN products.reserved_by IS 'Unique token identifying who reserved the product (stored in localStorage)';
