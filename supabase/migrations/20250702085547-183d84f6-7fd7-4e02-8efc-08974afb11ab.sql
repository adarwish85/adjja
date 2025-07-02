
-- Drop the problematic RLS policy that causes infinite recursion
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;

-- Create new RLS policies that use the security definer function to avoid recursion
CREATE POLICY "super_admins_can_manage_all_roles"
ON public.user_roles FOR ALL
USING (public.get_current_user_role() = 'Super Admin')
WITH CHECK (public.get_current_user_role() = 'Super Admin');

-- Allow authenticated users to view roles (needed for dropdowns, etc.)
CREATE POLICY "authenticated_users_can_view_roles"
ON public.user_roles FOR SELECT
USING (auth.role() = 'authenticated');

-- Allow users to create roles if they are Super Admin
CREATE POLICY "super_admins_can_create_roles"
ON public.user_roles FOR INSERT
WITH CHECK (public.get_current_user_role() = 'Super Admin');

-- Allow users to update roles if they are Super Admin  
CREATE POLICY "super_admins_can_update_roles"
ON public.user_roles FOR UPDATE
USING (public.get_current_user_role() = 'Super Admin')
WITH CHECK (public.get_current_user_role() = 'Super Admin');

-- Allow users to delete non-system roles if they are Super Admin
CREATE POLICY "super_admins_can_delete_non_system_roles"
ON public.user_roles FOR DELETE
USING (public.get_current_user_role() = 'Super Admin' AND NOT is_system);
