
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSystemSettings } from '@/hooks/useSystemSettings';

interface SettingsContextType {
  // General Settings
  academyName: string;
  academyCode: string;
  timezone: string;
  currency: string;
  defaultAttendanceBuffer: number;
  
  // Student Management
  enableStudentCheckin: boolean;
  defaultStudentStatus: string;
  maxStudentsPerPlan: number;
  
  // Attendance Settings
  enableInstructorValidation: boolean;
  lateThresholdMinutes: number;
  autoAbsenceMinutes: number;
  
  // Payment Settings
  paymentReminderIntervalDays: number;
  allowPartialPayment: boolean;
  latePaymentFeePercentage: number;
  
  // Analytics Settings
  enableRevenueTracking: boolean;
  enableAttendanceHeatmap: boolean;
  cacheRefreshIntervalHours: number;
  
  // Class Settings
  defaultClassDurationMinutes: number;
  maxStudentsPerClass: number;
  autoCancelThresholdStudents: number;
  
  // Notification Settings
  enableEmailNotifications: boolean;
  enableSmsNotifications: boolean;
  planExpiryNotification: boolean;
  
  // Loading states
  isLoading: boolean;
  updateSetting: (category: string, key: string, value: any) => Promise<string>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useAppSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useAppSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settingsByCategory, isLoading, updateSetting } = useSystemSettings();
  
  // Helper function to get setting value with fallback
  const getSetting = (category: string, key: string, defaultValue: any) => {
    return settingsByCategory[category]?.[key] ?? defaultValue;
  };

  const contextValue: SettingsContextType = {
    // General Settings
    academyName: getSetting('general', 'academy_name', 'Australian Jiu-Jitsu Academy'),
    academyCode: getSetting('general', 'academy_code', 'ADJJA'),
    timezone: getSetting('general', 'timezone', 'africa/cairo'),
    currency: getSetting('general', 'currency', 'egp'),
    defaultAttendanceBuffer: getSetting('general', 'default_attendance_buffer', 15),
    
    // Student Management
    enableStudentCheckin: getSetting('student_management', 'enable_student_checkin', true),
    defaultStudentStatus: getSetting('student_management', 'default_student_status', 'active'),
    maxStudentsPerPlan: getSetting('student_management', 'max_students_per_plan', 0),
    
    // Attendance Settings
    enableInstructorValidation: getSetting('attendance', 'enable_instructor_validation', true),
    lateThresholdMinutes: getSetting('attendance', 'late_threshold_minutes', 10),
    autoAbsenceMinutes: getSetting('attendance', 'auto_absence_minutes', 30),
    
    // Payment Settings
    paymentReminderIntervalDays: getSetting('payment', 'payment_reminder_interval_days', 7),
    allowPartialPayment: getSetting('payment', 'allow_partial_payment', false),
    latePaymentFeePercentage: getSetting('payment', 'late_payment_fee_percentage', 5),
    
    // Analytics Settings
    enableRevenueTracking: getSetting('analytics', 'enable_revenue_tracking', true),
    enableAttendanceHeatmap: getSetting('analytics', 'enable_attendance_heatmap', true),
    cacheRefreshIntervalHours: getSetting('analytics', 'cache_refresh_interval_hours', 24),
    
    // Class Settings
    defaultClassDurationMinutes: getSetting('class_schedule', 'default_class_duration_minutes', 60),
    maxStudentsPerClass: getSetting('class_schedule', 'max_students_per_class', 30),
    autoCancelThresholdStudents: getSetting('class_schedule', 'auto_cancel_threshold_students', 3),
    
    // Notification Settings
    enableEmailNotifications: getSetting('notifications', 'enable_email_notifications', true),
    enableSmsNotifications: getSetting('notifications', 'enable_sms_notifications', false),
    planExpiryNotification: getSetting('notifications', 'plan_expiry_notification', true),
    
    isLoading,
    updateSetting
  };

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
};
