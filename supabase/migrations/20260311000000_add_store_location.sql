-- Create store_location table for managing store pickup location
CREATE TABLE store_location (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provincia text NOT NULL,
  canton text NOT NULL,
  distrito text NOT NULL,
  codigo_postal text NOT NULL,
  direccion_exacta text,
  map_link text,
  coordenadas text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Add comment to table
COMMENT ON TABLE store_location IS 'Store location information for product pickup';

-- Add comments to columns
COMMENT ON COLUMN store_location.provincia IS 'Province in Costa Rica (e.g., San José, Alajuela)';
COMMENT ON COLUMN store_location.canton IS 'Canton/County in Costa Rica';
COMMENT ON COLUMN store_location.distrito IS 'District in Costa Rica';
COMMENT ON COLUMN store_location.codigo_postal IS 'Postal code';
COMMENT ON COLUMN store_location.direccion_exacta IS 'Detailed address or "señas" for exact location';
COMMENT ON COLUMN store_location.map_link IS 'Google Maps or Waze link to the location';
COMMENT ON COLUMN store_location.coordenadas IS 'GPS coordinates in format: latitude,longitude';
COMMENT ON COLUMN store_location.is_active IS 'Only one location should be active at a time';

-- Create index on is_active for faster queries
CREATE INDEX idx_store_location_active ON store_location(is_active) WHERE is_active = true;

-- Enable Row Level Security
ALTER TABLE store_location ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view active location (public)
CREATE POLICY "Anyone can view active location"
  ON store_location
  FOR SELECT
  USING (is_active = true);

-- Policy: Authenticated users (admin) can insert location
CREATE POLICY "Authenticated users can insert location"
  ON store_location
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Authenticated users (admin) can update location
CREATE POLICY "Authenticated users can update location"
  ON store_location
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Authenticated users (admin) can delete location
CREATE POLICY "Authenticated users can delete location"
  ON store_location
  FOR DELETE
  TO authenticated
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_store_location_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER store_location_updated_at
  BEFORE UPDATE ON store_location
  FOR EACH ROW
  EXECUTE FUNCTION update_store_location_updated_at();
