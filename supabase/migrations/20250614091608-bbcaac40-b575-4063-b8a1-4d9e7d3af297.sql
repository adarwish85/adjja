
-- Create subscription_plans table
CREATE TABLE public.subscription_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  number_of_classes INTEGER NOT NULL,
  subscription_period TEXT NOT NULL CHECK (subscription_period IN ('weekly', 'monthly', 'quarterly', 'yearly')),
  standard_price NUMERIC(10,2) NOT NULL,
  sale_price NUMERIC(10,2),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create student_subscriptions table
CREATE TABLE public.student_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  subscription_plan_id UUID NOT NULL REFERENCES public.subscription_plans(id) ON DELETE RESTRICT,
  payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'overdue')),
  next_due_date TIMESTAMP WITH TIME ZONE,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payment_transactions table
CREATE TABLE public.payment_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  subscription_plan_id UUID REFERENCES public.subscription_plans(id) ON DELETE SET NULL,
  amount NUMERIC(10,2) NOT NULL,
  paypal_transaction_id TEXT,
  paypal_order_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled', 'refunded')),
  transaction_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payment_reminders table
CREATE TABLE public.payment_reminders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL CHECK (reminder_type IN ('due_soon', 'overdue', 'escalation')),
  sent_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  next_reminder_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add subscription_plan_id to students table
ALTER TABLE public.students ADD COLUMN subscription_plan_id UUID REFERENCES public.subscription_plans(id) ON DELETE SET NULL;
ALTER TABLE public.students ADD COLUMN payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'overdue'));
ALTER TABLE public.students ADD COLUMN next_due_date TIMESTAMP WITH TIME ZONE;

-- Enable RLS on new tables
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_reminders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for subscription_plans (public read, admin write)
CREATE POLICY "Anyone can view active subscription plans" 
  ON public.subscription_plans 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Admins can manage subscription plans" 
  ON public.subscription_plans 
  FOR ALL 
  USING (true);

-- Create RLS policies for student_subscriptions
CREATE POLICY "Users can view their own subscriptions" 
  ON public.student_subscriptions 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage all subscriptions" 
  ON public.student_subscriptions 
  FOR ALL 
  USING (true);

-- Create RLS policies for payment_transactions
CREATE POLICY "Users can view their own transactions" 
  ON public.payment_transactions 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage all transactions" 
  ON public.payment_transactions 
  FOR ALL 
  USING (true);

-- Create RLS policies for payment_reminders
CREATE POLICY "Admins can manage all reminders" 
  ON public.payment_reminders 
  FOR ALL 
  USING (true);

-- Create indexes for performance
CREATE INDEX idx_student_subscriptions_student_id ON public.student_subscriptions(student_id);
CREATE INDEX idx_student_subscriptions_plan_id ON public.student_subscriptions(subscription_plan_id);
CREATE INDEX idx_payment_transactions_student_id ON public.payment_transactions(student_id);
CREATE INDEX idx_payment_transactions_date ON public.payment_transactions(transaction_date);
CREATE INDEX idx_payment_reminders_student_id ON public.payment_reminders(student_id);
CREATE INDEX idx_payment_reminders_next_date ON public.payment_reminders(next_reminder_date);

-- Create trigger to update updated_at columns
CREATE TRIGGER update_subscription_plans_updated_at
  BEFORE UPDATE ON public.subscription_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_subscriptions_updated_at
  BEFORE UPDATE ON public.student_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payment_transactions_updated_at
  BEFORE UPDATE ON public.payment_transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to calculate next due date based on subscription period
CREATE OR REPLACE FUNCTION public.calculate_next_due_date(
  period_type TEXT,
  from_date TIMESTAMP WITH TIME ZONE DEFAULT now()
)
RETURNS TIMESTAMP WITH TIME ZONE
LANGUAGE plpgsql
AS $$
BEGIN
  CASE period_type
    WHEN 'weekly' THEN
      RETURN from_date + INTERVAL '1 week';
    WHEN 'monthly' THEN
      RETURN from_date + INTERVAL '1 month';
    WHEN 'quarterly' THEN
      RETURN from_date + INTERVAL '3 months';
    WHEN 'yearly' THEN
      RETURN from_date + INTERVAL '1 year';
    ELSE
      RETURN from_date + INTERVAL '1 month'; -- default to monthly
  END CASE;
END;
$$;

-- Insert default subscription plans
INSERT INTO public.subscription_plans (title, description, number_of_classes, subscription_period, standard_price, sale_price, is_active) VALUES
('Basic - 8 Classes/Month', 'Perfect for beginners who want to train 2 times per week', 8, 'monthly', 89.99, 79.99, true),
('Premium - 16 Classes/Month', 'For dedicated students training 4 times per week', 16, 'monthly', 149.99, 129.99, true),
('Unlimited Monthly', 'Train as much as you want with unlimited classes', 999, 'monthly', 199.99, 179.99, true),
('Student Weekly', 'Special rate for students - 4 classes per week', 4, 'weekly', 29.99, 24.99, true),
('Annual Unlimited', 'Best value - unlimited classes for a full year', 999, 'yearly', 1999.99, 1699.99, true);
