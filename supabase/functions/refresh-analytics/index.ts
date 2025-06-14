
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing Authorization header');
    }

    // Extract the token from the Authorization header
    const token = authHeader.replace('Bearer ', '');
    const apiUrl = Deno.env.get('SUPABASE_URL');
    const adminKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!apiUrl || !adminKey) {
      throw new Error('Missing necessary environment variables');
    }

    // Call the refresh_analytics_views function
    const response = await fetch(`${apiUrl}/rest/v1/rpc/refresh_analytics_views`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminKey}`,
        'apikey': adminKey
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to refresh analytics views: ${errorText}`);
    }

    console.log('Successfully refreshed analytics views');

    return new Response(
      JSON.stringify({ 
        message: 'Analytics views refreshed successfully',
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error refreshing analytics views:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});
