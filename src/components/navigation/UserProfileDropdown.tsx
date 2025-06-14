
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { User, Settings, Lock, LogOut, Edit } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useRef, useState } from "react";
import { ProfileEditModal } from "./ProfileEditModal";
import { ChangePasswordModal } from "./ChangePasswordModal";
import { AccountSettingsModal } from "./AccountSettingsModal";

interface UserProfileDropdownProps {
  onClose: () => void;
}

export const UserProfileDropdown = ({ onClose }: UserProfileDropdownProps) => {
  const { user, signOut } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showAccountSettings, setShowAccountSettings] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  const handleEditProfile = () => {
    setShowEditProfile(true);
    onClose();
  };

  const handleChangePassword = () => {
    setShowChangePassword(true);
    onClose();
  };

  const handleAccountSettings = () => {
    setShowAccountSettings(true);
    onClose();
  };

  return (
    <>
      <div ref={dropdownRef} className="absolute right-0 top-12 w-64 z-50">
        <Card className="shadow-lg border bg-white">
          <CardContent className="p-0">
            {/* User Info Section */}
            <div className="p-4 bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-bjj-gold rounded-full flex items-center justify-center">
                  <span className="text-white text-lg font-semibold">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-bjj-navy truncate">
                    {user?.user_metadata?.name || 'Admin User'}
                  </h4>
                  <p className="text-sm text-bjj-gray truncate">
                    {user?.email || 'admin@example.com'}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Menu Items */}
            <div className="p-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-left hover:bg-gray-100"
                onClick={handleEditProfile}
              >
                <Edit className="h-4 w-4 mr-3" />
                Edit Profile
              </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-start text-left hover:bg-gray-100"
                onClick={handleChangePassword}
              >
                <Lock className="h-4 w-4 mr-3" />
                Change Password
              </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-start text-left hover:bg-gray-100"
                onClick={handleAccountSettings}
              >
                <Settings className="h-4 w-4 mr-3" />
                Account Settings
              </Button>
            </div>

            <Separator />

            <div className="p-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-left text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-3" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <ProfileEditModal 
        open={showEditProfile} 
        onOpenChange={setShowEditProfile}
      />
      
      <ChangePasswordModal 
        open={showChangePassword} 
        onOpenChange={setShowChangePassword}
      />

      <AccountSettingsModal 
        open={showAccountSettings} 
        onOpenChange={setShowAccountSettings}
      />
    </>
  );
};
