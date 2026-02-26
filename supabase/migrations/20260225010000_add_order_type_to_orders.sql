-- Add order_type enum to distinguish purchases from reservations
ALTER TABLE orders
ADD COLUMN order_type text CHECK (order_type IN ('purchase', 'reservation')) DEFAULT 'purchase' NOT NULL;

-- Make sinpe_reference nullable since reservations don't require payment proof
ALTER TABLE orders
ALTER COLUMN sinpe_reference DROP NOT NULL;

-- Add index for order_type to improve query performance
CREATE INDEX idx_orders_order_type ON orders(order_type);

-- Add comment for clarity
COMMENT ON COLUMN orders.order_type IS 'Type of order: purchase (immediate payment) or reservation (deferred payment)';
COMMENT ON COLUMN orders.sinpe_reference IS 'SINPE payment reference number (required for purchases, optional for reservations)';
