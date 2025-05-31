
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionId } = await req.json();

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", { 
      apiVersion: "2023-10-16" 
    });

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Update order status
    if (session.mode === "payment") {
      await supabaseService
        .from("orders")
        .update({ status: session.payment_status === "paid" ? "paid" : "failed" })
        .eq("stripe_session_id", sessionId);
    } else if (session.mode === "subscription" && session.subscription) {
      // Handle subscription
      const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
      const subscriptionTier = subscription.items.data[0].price.unit_amount === 1999 ? "Basic" : 
                               subscription.items.data[0].price.unit_amount === 4999 ? "Premium" : "Enterprise";

      await supabaseService.from("subscribers").upsert({
        email: session.customer_email,
        stripe_customer_id: session.customer,
        subscribed: subscription.status === "active",
        subscription_tier: subscriptionTier,
        stripe_subscription_id: subscription.id,
        subscription_end: new Date(subscription.current_period_end * 1000).toISOString(),
      }, { onConflict: 'email' });
    }

    return new Response(JSON.stringify({ 
      status: session.payment_status,
      mode: session.mode 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
