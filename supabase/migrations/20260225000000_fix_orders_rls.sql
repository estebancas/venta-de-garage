-- Drop existing policies on orders table
DROP POLICY IF EXISTS "Anyone can create orders" ON orders;
DROP POLICY IF EXISTS "Admin full access to orders" ON orders;

-- Recreate the insert policy for anonymous and authenticated users
CREATE POLICY "Allow public to create orders"
  ON orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Recreate admin policies for all operations
CREATE POLICY "Allow authenticated users to view all orders"
  ON orders FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete orders"
  ON orders FOR DELETE
  TO authenticated
  USING (true);
