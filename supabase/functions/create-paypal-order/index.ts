
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Input validation functions
const validateAmount = (amount: any): number => {
  const parsed = parseFloat(amount);
  if (isNaN(parsed) || parsed <= 0 || parsed > 10000) {
    throw new Error('Invalid amount: must be between 0.01 and 10000');
  }
  return parsed;
};

const validateCurrency = (currency: any): string => {
  const validCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];
  if (!currency || !validCurrencies.includes(currency.toUpperCase())) {
    throw new Error('Invalid currency: must be one of ' + validCurrencies.join(', '));
  }
  return currency.toUpperCase();
};

const validateUUID = (id: any, fieldName: string): string => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!id || !uuidRegex.test(id)) {
    throw new Error(`Invalid ${fieldName}: must be a valid UUID`);
  }
  return id;
};

const logSecurityEvent = async (supabase: any, action: string, details: any, severity = 'medium') => {
  try {
    await supabase.from('security_audit_logs').insert({
      action,
      resource: 'payment_processing',
      severity,
      details,
      user_agent: 'PayPal Edge Function',
    });
  } catch (error) {
    console.warn('Failed to log security event:', error);
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount, currency = 'USD', studentId, planId } = await req.json();

    // Initialize Supabase client for logging
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Validate inputs
    const validatedAmount = validateAmount(amount);
    const validatedCurrency = validateCurrency(currency);
    const validatedStudentId = validateUUID(studentId, 'studentId');
    const validatedPlanId = planId ? validateUUID(planId, 'planId') : null;

    // Log payment initiation
    await logSecurityEvent(supabase, 'payment_order_created', {
      studentId: validatedStudentId,
      planId: validatedPlanId,
      amount: validatedAmount,
      currency: validatedCurrency
    });

    // PayPal API credentials from secure environment variables
    const PAYPAL_CLIENT_ID = Deno.env.get('PAYPAL_CLIENT_ID');
    const PAYPAL_CLIENT_SECRET = Deno.env.get('PAYPAL_CLIENT_SECRET');
    const PAYPAL_ENVIRONMENT = Deno.env.get('PAYPAL_ENVIRONMENT');
    
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      await logSecurityEvent(supabase, 'payment_configuration_error', { error: 'Missing PayPal credentials' }, 'high');
      throw new Error('PayPal credentials not configured in environment');
    }

    const PAYPAL_API_BASE = PAYPAL_ENVIRONMENT === 'live'
      ? 'https://api-m.paypal.com' 
      : 'https://api-m.sandbox.paypal.com';

    console.log('PayPal API Base:', PAYPAL_API_BASE);
    console.log('Environment:', PAYPAL_ENVIRONMENT);

    // Get PayPal access token
    const authResponse = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`)}`,
      },
      body: 'grant_type=client_credentials',
    });

    if (!authResponse.ok) {
      const errorText = await authResponse.text();
      console.error('PayPal auth error:', errorText);
      throw new Error('Failed to get PayPal access token');
    }

    const authData = await authResponse.json();
    const accessToken = authData.access_token;

    // Create PayPal order
    const orderData = {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: currency,
          value: amount,
        },
        description: planId ? 'BJJ Academy Subscription' : 'BJJ Academy Payment',
        custom_id: `student_${studentId}${planId ? `_plan_${planId}` : ''}`,
      }],
      application_context: {
        return_url: `${req.headers.get('origin')}/payment-success`,
        cancel_url: `${req.headers.get('origin')}/payment-cancelled`,
        shipping_preference: 'NO_SHIPPING',
        user_action: 'PAY_NOW',
      },
    };

    const orderResponse = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(orderData),
    });

    if (!orderResponse.ok) {
      const errorData = await orderResponse.text();
      console.error('PayPal order creation failed:', errorData);
      throw new Error('Failed to create PayPal order');
    }

    const order = await orderResponse.json();

    console.log('PayPal order created:', {
      orderId: order.id,
      studentId,
      planId,
      amount
    });

    return new Response(
      JSON.stringify({
        orderId: order.id,
        approvalUrl: order.links.find((link: any) => link.rel === 'approve')?.href,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in create-paypal-order:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
