import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation and sanitization functions
const sanitizeText = (text: string, maxLength: number): string => {
  if (!text) return '';
  // Remove any control characters and trim
  return text.replace(/[\x00-\x1F\x7F]/g, '').trim().slice(0, maxLength);
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
};

const validatePhone = (phone: string): boolean => {
  // Allow digits, spaces, +, -, (, )
  const phoneRegex = /^[\d\s\+\-\(\)]+$/;
  return phoneRegex.test(phone) && phone.length <= 20;
};

const validatePincode = (pincode: string): boolean => {
  // Allow only alphanumeric characters
  const pincodeRegex = /^[A-Za-z0-9\s\-]+$/;
  return pincodeRegex.test(pincode) && pincode.length <= 10;
};

const validateAmount = (amount: number): boolean => {
  return Number.isInteger(amount) && amount > 0 && amount <= 10000000; // Max 1 crore
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      amount, 
      currency = 'INR', 
      giftWrap, 
      giftNote, 
      hidePrice, 
      customerEmail, 
      customerPhone, 
      customerName,
      shippingAddress,
      shippingCity,
      shippingState,
      shippingPincode
    } = await req.json();

    // Validate and sanitize all input data
    if (!validateAmount(amount)) {
      throw new Error('Invalid amount: must be a positive integer not exceeding 10000000');
    }

    const sanitizedCustomerName = sanitizeText(customerName, 100);
    const sanitizedCustomerEmail = sanitizeText(customerEmail, 255);
    const sanitizedCustomerPhone = sanitizeText(customerPhone, 20);
    const sanitizedShippingAddress = sanitizeText(shippingAddress, 500);
    const sanitizedShippingCity = sanitizeText(shippingCity, 100);
    const sanitizedShippingState = sanitizeText(shippingState, 100);
    const sanitizedShippingPincode = sanitizeText(shippingPincode, 10);
    const sanitizedGiftNote = sanitizeText(giftNote || '', 500);

    // Validate required fields
    if (!sanitizedCustomerName || sanitizedCustomerName.length < 2) {
      throw new Error('Customer name is required and must be at least 2 characters');
    }

    if (!validateEmail(sanitizedCustomerEmail)) {
      throw new Error('Invalid email address');
    }

    if (!validatePhone(sanitizedCustomerPhone)) {
      throw new Error('Invalid phone number format');
    }

    if (!sanitizedShippingAddress || sanitizedShippingAddress.length < 10) {
      throw new Error('Shipping address is required and must be at least 10 characters');
    }

    if (!sanitizedShippingCity || sanitizedShippingCity.length < 2) {
      throw new Error('Shipping city is required');
    }

    if (!sanitizedShippingState || sanitizedShippingState.length < 2) {
      throw new Error('Shipping state is required');
    }

    if (!validatePincode(sanitizedShippingPincode)) {
      throw new Error('Invalid pincode format');
    }

    // Validate currency
    if (!['INR', 'USD', 'EUR'].includes(currency)) {
      throw new Error('Invalid currency');
    }

    console.log('Creating order with validated amount:', amount);

    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID');
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');

    if (!razorpayKeyId || !razorpayKeySecret) {
      console.error('Razorpay credentials not configured');
      throw new Error('Razorpay credentials not configured');
    }

    // Create Razorpay order
    const basicAuth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);
    const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount * 100, // Convert to paise
        currency,
        receipt: `receipt_${Date.now()}`,
      }),
    });

    if (!razorpayResponse.ok) {
      const errorText = await razorpayResponse.text();
      console.error('Razorpay API error:', errorText);
      throw new Error('Failed to create Razorpay order');
    }

    const razorpayOrder = await razorpayResponse.json();
    console.log('Razorpay order created:', razorpayOrder.id);

    // Save order to database using service role key to bypass RLS
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user ID from auth header if available
    const authHeader = req.headers.get('Authorization');
    let userId = null;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    }

    console.log('Saving order to database, user_id:', userId);

    const { data: order, error: dbError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        razorpay_order_id: razorpayOrder.id,
        amount,
        currency,
        status: 'created',
        gift_wrap: Boolean(giftWrap),
        gift_note: sanitizedGiftNote || null,
        hide_price: Boolean(hidePrice),
        customer_email: sanitizedCustomerEmail,
        customer_phone: sanitizedCustomerPhone,
        customer_name: sanitizedCustomerName,
        shipping_address: sanitizedShippingAddress,
        shipping_city: sanitizedShippingCity,
        shipping_state: sanitizedShippingState,
        shipping_pincode: sanitizedShippingPincode,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error(`Failed to save order: ${dbError.message}`);
    }

    console.log('Order saved successfully:', order.id);

    return new Response(
      JSON.stringify({
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        dbOrderId: order.id,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error creating order:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Unknown error',
        details: error.toString()
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});