-- Fix security vulnerability: Remove NULL user_id conditions from orders RLS policies
-- This prevents unauthenticated users from viewing or modifying any orders directly
-- Edge functions using service role key will continue to work for guest checkout

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;

-- Recreate policies without the NULL user_id condition
-- Only authenticated users can view their own orders
CREATE POLICY "Users can view their own orders" 
ON public.orders 
FOR SELECT 
USING (auth.uid() = user_id);

-- Only authenticated users can update their own orders
CREATE POLICY "Users can update their own orders" 
ON public.orders 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Note: The "Admins can view all orders" and "Anyone can create orders" policies remain unchanged
-- Edge functions will continue to work using the service role key which bypasses RLS