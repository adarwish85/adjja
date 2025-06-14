
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Student {
  id: string;
  name: string;
  email: string;
  next_due_date: string;
  payment_status: string;
  subscription_plan_id: string;
}

interface SubscriptionPlan {
  id: string;
  title: string;
  standard_price: number;
  sale_price: number | null;
  subscription_period: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Starting payment reminder process...');

    // First, update payment statuses based on due dates
    const { error: updateError } = await supabaseClient.rpc('update_student_payment_status');
    
    if (updateError) {
      console.error('Error updating payment statuses:', updateError);
      throw updateError;
    }

    console.log('Payment statuses updated successfully');

    // Get students with upcoming due dates (3 days or less)
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    const { data: studentsWithReminders, error: studentsError } = await supabaseClient
      .from('students')
      .select(`
        id,
        name,
        email,
        next_due_date,
        payment_status,
        subscription_plan_id
      `)
      .gte('next_due_date', new Date().toISOString().split('T')[0])
      .lte('next_due_date', threeDaysFromNow.toISOString().split('T')[0])
      .eq('status', 'active');

    if (studentsError) {
      console.error('Error fetching students:', studentsError);
      throw studentsError;
    }

    console.log(`Found ${studentsWithReminders?.length || 0} students with upcoming payments`);

    // Get overdue students
    const { data: overdueStudents, error: overdueError } = await supabaseClient
      .from('students')
      .select(`
        id,
        name,
        email,
        next_due_date,
        payment_status,
        subscription_plan_id
      `)
      .lt('next_due_date', new Date().toISOString().split('T')[0])
      .eq('status', 'active');

    if (overdueError) {
      console.error('Error fetching overdue students:', overdueError);
      throw overdueError;
    }

    console.log(`Found ${overdueStudents?.length || 0} overdue students`);

    // Get subscription plans for reference
    const { data: subscriptionPlans, error: plansError } = await supabaseClient
      .from('subscription_plans')
      .select('*');

    if (plansError) {
      console.error('Error fetching subscription plans:', plansError);
      throw plansError;
    }

    // Create notifications for students with upcoming payments
    const upcomingNotifications = (studentsWithReminders || []).map((student: Student) => {
      const plan = subscriptionPlans?.find((p: SubscriptionPlan) => p.id === student.subscription_plan_id);
      const amount = plan?.sale_price || plan?.standard_price || 0;
      const dueDate = new Date(student.next_due_date).toLocaleDateString();
      
      return {
        user_id: student.id, // This should map to auth.users.id, but for now we'll use student id
        title: 'Payment Reminder',
        message: `Your payment of $${amount} for ${plan?.title || 'your subscription'} is due on ${dueDate}.`,
        type: 'payment_reminder'
      };
    });

    // Create notifications for overdue students
    const overdueNotifications = (overdueStudents || []).map((student: Student) => {
      const plan = subscriptionPlans?.find((p: SubscriptionPlan) => p.id === student.subscription_plan_id);
      const amount = plan?.sale_price || plan?.standard_price || 0;
      const dueDate = new Date(student.next_due_date).toLocaleDateString();
      
      return {
        user_id: student.id, // This should map to auth.users.id, but for now we'll use student id
        title: 'Payment Overdue',
        message: `Your payment of $${amount} for ${plan?.title || 'your subscription'} was due on ${dueDate}. Please make payment as soon as possible.`,
        type: 'payment_overdue'
      };
    });

    // Insert notifications
    const allNotifications = [...upcomingNotifications, ...overdueNotifications];
    
    if (allNotifications.length > 0) {
      const { error: notificationError } = await supabaseClient
        .from('notifications')
        .insert(allNotifications);

      if (notificationError) {
        console.error('Error creating notifications:', notificationError);
        throw notificationError;
      }

      console.log(`Created ${allNotifications.length} payment reminder notifications`);
    }

    // Log the activity
    const summary = {
      students_with_upcoming_payments: studentsWithReminders?.length || 0,
      overdue_students: overdueStudents?.length || 0,
      notifications_created: allNotifications.length,
      processed_at: new Date().toISOString()
    };

    console.log('Payment reminder process completed:', summary);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Payment reminders processed successfully',
        summary
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in payment reminders function:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
