
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
    const { studentId, amount, planId, notes } = await req.json();

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Recording manual payment:', {
      studentId,
      planId,
      amount
    });

    // Record the manual payment transaction
    const { data: transactionRecord, error: transactionError } = await supabaseClient
      .from('payment_transactions')
      .insert([{
        student_id: studentId,
        subscription_plan_id: planId,
        amount: parseFloat(amount),
        paypal_transaction_id: null,
        paypal_order_id: null,
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
      // For manual payments without a plan, just update payment status
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

    console.log('Manual payment recorded successfully:', {
      transactionId: transactionRecord.id,
      studentId,
      amount
    });

    return new Response(
      JSON.stringify({
        success: true,
        transactionId: transactionRecord.id,
        amount: parseFloat(amount),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in record-manual-payment:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
