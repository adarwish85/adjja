import { useEffect } from "react";
import { StudentLayout } from "@/components/layouts/StudentLayout";
import { useAuth } from "@/hooks/useAuth";
import { StudentProfileHeader } from "@/components/profile/StudentProfileHeader";
import { StudentProfileSidebar } from "@/components/profile/StudentProfileSidebar";
import { StudentProfileMainForm } from "@/components/profile/StudentProfileMainForm";
import { BJJProfileForm } from "@/components/profile/BJJProfileForm";
import { ProfileEditControls } from "@/components/profile/ProfileEditControls";
import { PhotoUploadManager } from "@/components/profile/PhotoUploadManager";
import { PasswordChangeManager } from "@/components/profile/PasswordChangeManager";
import { useProfileDataManager } from "@/hooks/useProfileDataManager";

export default function StudentProfileContainer() {
  const { user } = useAuth();
  const {
    formState,
    loading,
    isEditing,
    hasChanges,
    saveAllState,
    bjjProfile,
    bjjLoading,
    fetchProfile,
    handleFormChange,
    handleBjjProfileChange,
    handleEditToggle,
    handleSaveAll
  } = useProfileDataManager();

  const photoUploadManager = PhotoUploadManager({ 
    onFormChange: handleFormChange, 
    setLoading: () => {} 
  });

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  return (
    <StudentLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Cover Photo & Profile Header */}
        <StudentProfileHeader
          formState={formState}
          onCoverPhotoEdit={isEditing ? photoUploadManager.handleCoverPhotoEdit : undefined}
          onAvatarEdit={isEditing ? photoUploadManager.handleAvatarEdit : undefined}
          loading={loading}
        />

        {/* Main Content Area with Facebook-style layout */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          {/* Edit/Save Controls */}
          <div className="flex justify-end mb-6">
            <ProfileEditControls
              isEditing={isEditing}
              hasChanges={hasChanges}
              saveAllState={saveAllState}
              onEditToggle={handleEditToggle}
              onSaveAll={handleSaveAll}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Sidebar - Profile Info (30%) */}
            <div className="lg:col-span-4 xl:col-span-3">
              <StudentProfileSidebar formState={formState} />
            </div>

            {/* Main Content - Editable Forms (70%) */}
            <div className="lg:col-span-8 xl:col-span-9 space-y-6">
              {/* Basic Profile Information */}
              <StudentProfileMainForm
                data={formState}
                onChange={handleFormChange}
                loading={loading}
                disabled={!isEditing}
              />

              {/* BJJ Athlete Profile */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">BJJ Athlete Profile</h2>
                <BJJProfileForm
                  data={bjjProfile}
                  onChange={handleBjjProfileChange}
                  loading={bjjLoading}
                  disabled={!isEditing}
                />
              </div>

              {/* Change Password Section - Keep separate */}
              <PasswordChangeManager />
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
