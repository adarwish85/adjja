
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User } from "lucide-react";

interface ProfileEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProfileEditModal = ({ open, onOpenChange }: ProfileEditModalProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });

  useEffect(() => {
    if (user && open) {
      setFormData({
        name: user.user_metadata?.name || "",
        email: user.email || "",
        phone: user.user_metadata?.phone || ""
      });
    }
  }, [user, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Update auth user metadata and email
      const { error: authError } = await supabase.auth.updateUser({
        email: formData.email,
        data: {
          name: formData.name,
          phone: formData.phone
        }
      });

      if (authError) throw authError;

      // Update profile table if it exists
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        })
        .eq('id', user.id);

      // Don't throw error if profiles table doesn't exist
      if (profileError && !profileError.message.includes('relation "profiles" does not exist')) {
        throw profileError;
      }

      toast.success("Profile updated successfully");
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Edit Profile
          </DialogTitle>
          <DialogDescription>
            Update your personal information
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter your full name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter your email address"
              required
            />
            <p className="text-xs text-gray-500">You may need to verify your new email address</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="Enter your phone number"
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Profile"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
