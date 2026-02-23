-- Update RLS policy to allow public read of all product fields including reserved_by
-- Drop the old policy
DROP POLICY IF EXISTS "Public can view active products" ON products;

-- Create new policy that allows viewing all products regardless of status
CREATE POLICY "Public can view all products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);
