
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId } = await req.json();

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // PayPal API credentials
    const PAYPAL_CLIENT_ID = Deno.env.get('PAYPAL_CLIENT_ID');
    const PAYPAL_CLIENT_SECRET = Deno.env.get('PAYPAL_CLIENT_SECRET');
    const PAYPAL_API_BASE = Deno.env.get('PAYPAL_ENVIRONMENT') === 'live' 
      ? 'https://api-m.paypal.com' 
      : 'https://api-m.sandbox.paypal.com';

    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error('PayPal credentials not configured');
    }

    // Get PayPal access token
    const authResponse = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`)}`,
      },
      body: 'grant_type=client_credentials',
    });

    const authData = await authResponse.json();
    const accessToken = authData.access_token;

    // Capture the PayPal order
    const captureResponse = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!captureResponse.ok) {
      const errorData = await captureResponse.text();
      console.error('PayPal capture failed:', errorData);
      throw new Error('Failed to capture PayPal payment');
    }

    const captureData = await captureResponse.json();
    
    if (captureData.status !== 'COMPLETED') {
      throw new Error('PayPal payment not completed');
    }

    // Extract transaction details
    const transaction = captureData.purchase_units[0].payments.captures[0];
    const customId = captureData.purchase_units[0].custom_id;
    const amount = parseFloat(transaction.amount.value);
    
    // Parse student and plan IDs from custom_id
    const customIdParts = customId.split('_');
    const studentId = customIdParts[1];
    const planId = customIdParts.includes('plan') ? customIdParts[3] : null;

    console.log('Processing payment:', {
      orderId,
      transactionId: transaction.id,
      studentId,
      planId,
      amount
    });

    // Record the transaction in database
    const { data: transactionRecord, error: transactionError } = await supabaseClient
      .from('payment_transactions')
      .insert([{
        student_id: studentId,
        subscription_plan_id: planId,
        amount: amount,
        paypal_transaction_id: transaction.id,
        paypal_order_id: orderId,
        status: 'completed',
        transaction_date: new Date().toISOString(),
      }])
      .select()
      .single();

    if (transactionError) {
      console.error('Failed to record transaction:', transactionError);
      throw new Error('Failed to record payment transaction');
    }

    // Update student's payment status and next due date if plan is provided
    if (planId) {
      // Get the subscription plan details
      const { data: plan, error: planError } = await supabaseClient
        .from('subscription_plans')
        .select('subscription_period')
        .eq('id', planId)
        .single();

      if (planError) {
        console.error('Failed to get plan details:', planError);
      } else {
        // Calculate next due date
        const { data: nextDueDate, error: dueDateError } = await supabaseClient
          .rpc('calculate_next_due_date', { 
            period_type: plan.subscription_period 
          });

        if (dueDateError) {
          console.error('Failed to calculate due date:', dueDateError);
        }

        // Update student record
        const { error: studentUpdateError } = await supabaseClient
          .from('students')
          .update({
            subscription_plan_id: planId,
            payment_status: 'paid',
            next_due_date: nextDueDate || null,
          })
          .eq('id', studentId);

        if (studentUpdateError) {
          console.error('Failed to update student:', studentUpdateError);
        }

        // Create or update student subscription record
        const { error: subscriptionError } = await supabaseClient
          .from('student_subscriptions')
          .upsert([{
            student_id: studentId,
            subscription_plan_id: planId,
            payment_status: 'paid',
            next_due_date: nextDueDate || null,
            start_date: new Date().toISOString(),
          }], {
            onConflict: 'student_id,subscription_plan_id'
          });

        if (subscriptionError) {
          console.error('Failed to update subscription:', subscriptionError);
        }
      }
    } else {
      // For manual payments, just update payment status
      const { error: studentUpdateError } = await supabaseClient
        .from('students')
        .update({
          payment_status: 'paid',
        })
        .eq('id', studentId);

      if (studentUpdateError) {
        console.error('Failed to update student payment status:', studentUpdateError);
      }
    }

    console.log('Payment processed successfully:', {
      transactionId: transactionRecord.id,
      paypalTransactionId: transaction.id,
      studentId,
      amount
    });

    return new Response(
      JSON.stringify({
        success: true,
        transactionId: transactionRecord.id,
        paypalTransactionId: transaction.id,
        amount: amount,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in capture-paypal-order:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
