-- Add shipping address fields to orders table
ALTER TABLE public.orders
ADD COLUMN shipping_address TEXT,
ADD COLUMN shipping_city TEXT,
ADD COLUMN shipping_state TEXT,
ADD COLUMN shipping_pincode TEXT;