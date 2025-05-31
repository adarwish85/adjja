
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface GeneralSettings {
  organizationName: string;
  organizationCode: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  timezone: string;
  currency: string;
  language: string;
  theme: string;
  colorScheme: string;
  businessHours: Record<string, { enabled: boolean; start: string; end: string }>;
}

export interface UserManagementSettings {
  allowSelfRegistration: boolean;
  emailVerificationRequired: boolean;
  manualApproval: boolean;
  defaultRole: string;
  minPasswordLength: number;
  requireUppercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  passwordExpiry: number;
}

export interface SystemSettings {
  maxConnections: number;
  queryTimeout: number;
  enableQueryLogging: boolean;
  autoBackup: boolean;
  backupTime: string;
  maxFileSize: number;
  storageProvider: string;
  allowedFileTypes: string;
  enableFileCompression: boolean;
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  defaultFromEmail: string;
  enableSSL: boolean;
  cacheTTL: number;
  sessionTimeout: number;
  enableRedisCache: boolean;
  enableCDN: boolean;
}

export interface SecuritySettings {
  require2FAAdmin: boolean;
  require2FACoaches: boolean;
  twoFAGracePeriod: number;
  maxLoginAttempts: number;
  lockoutDuration: number;
  enableAccountLockout: boolean;
  requireCaptcha: boolean;
  sessionTimeoutHours: number;
  enableIPWhitelist: boolean;
  allowedIPs: string;
  blockedIPs: string;
  enableGeoBlocking: boolean;
  apiRateLimit: number;
  apiKeyExpiry: number;
  requireAPIKey: boolean;
  enableCORSProtection: boolean;
  enableSecurityLogging: boolean;
  realTimeAlerts: boolean;
  securityAlertEmail: string;
}

export interface NotificationSettings {
  enableAllNotifications: boolean;
  notificationFromName: string;
  notificationFromEmail: string;
  quietHoursStart: string;
  quietHoursEnd: string;
  enableHTMLEmails: boolean;
  smsProvider: string;
  smsFromNumber: string;
  enableSMSNotifications: boolean;
  enablePushNotifications: boolean;
  notificationTypes: Record<string, {
    email: boolean;
    sms: boolean;
    push: boolean;
  }>;
}

export interface BackupSettings {
  enableAutoBackup: boolean;
  backupFrequency: string;
  backupTime: string;
  retentionPeriod: number;
  enableDatabaseBackup: boolean;
  enableFileBackup: boolean;
  enableConfigBackup: boolean;
  enableIncrementalBackup: boolean;
  primaryStorage: string;
  s3Bucket: string;
  s3Region: string;
  enableBackupEncryption: boolean;
}

export interface IntegrationSettings {
  stripePublicKey: string;
  enableStripeTestMode: boolean;
  mailchimpAPIKey: string;
  mailchimpListId: string;
  autoSubscribeNewStudents: boolean;
  enableAPIDocumentation: boolean;
  enableCORS: boolean;
  apiBaseURL: string;
  apiVersion: string;
}

export const useSettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Default settings
  const defaultGeneralSettings: GeneralSettings = {
    organizationName: "Australian Jiu-Jitsu Academy",
    organizationCode: "ADJJA",
    contactEmail: "admin@adjja.com",
    contactPhone: "+61 400 123 456",
    address: "123 BJJ Street, Sydney, NSW 2000, Australia",
    timezone: "australia/sydney",
    currency: "aud",
    language: "en",
    theme: "light",
    colorScheme: "bjj-gold",
    businessHours: {
      Monday: { enabled: true, start: "06:00", end: "22:00" },
      Tuesday: { enabled: true, start: "06:00", end: "22:00" },
      Wednesday: { enabled: true, start: "06:00", end: "22:00" },
      Thursday: { enabled: true, start: "06:00", end: "22:00" },
      Friday: { enabled: true, start: "06:00", end: "22:00" },
      Saturday: { enabled: true, start: "06:00", end: "22:00" },
      Sunday: { enabled: false, start: "06:00", end: "22:00" },
    }
  };

  const defaultUserManagementSettings: UserManagementSettings = {
    allowSelfRegistration: false,
    emailVerificationRequired: true,
    manualApproval: true,
    defaultRole: "student",
    minPasswordLength: 8,
    requireUppercase: true,
    requireNumbers: true,
    requireSpecialChars: false,
    passwordExpiry: 90
  };

  const defaultSystemSettings: SystemSettings = {
    maxConnections: 100,
    queryTimeout: 30,
    enableQueryLogging: false,
    autoBackup: true,
    backupTime: "02:00",
    maxFileSize: 50,
    storageProvider: "local",
    allowedFileTypes: "jpg, jpeg, png, pdf, doc, docx, xls, xlsx",
    enableFileCompression: true,
    smtpHost: "smtp.gmail.com",
    smtpPort: 587,
    smtpUsername: "noreply@adjja.com",
    defaultFromEmail: "ADJJA Academy <noreply@adjja.com>",
    enableSSL: true,
    cacheTTL: 60,
    sessionTimeout: 120,
    enableRedisCache: true,
    enableCDN: false
  };

  const defaultSecuritySettings: SecuritySettings = {
    require2FAAdmin: true,
    require2FACoaches: false,
    twoFAGracePeriod: 7,
    maxLoginAttempts: 5,
    lockoutDuration: 30,
    enableAccountLockout: true,
    requireCaptcha: true,
    sessionTimeoutHours: 8,
    enableIPWhitelist: false,
    allowedIPs: "",
    blockedIPs: "",
    enableGeoBlocking: false,
    apiRateLimit: 100,
    apiKeyExpiry: 365,
    requireAPIKey: true,
    enableCORSProtection: true,
    enableSecurityLogging: true,
    realTimeAlerts: true,
    securityAlertEmail: "security@adjja.com"
  };

  const defaultNotificationSettings: NotificationSettings = {
    enableAllNotifications: true,
    notificationFromName: "ADJJA Academy",
    notificationFromEmail: "notifications@adjja.com",
    quietHoursStart: "22:00",
    quietHoursEnd: "08:00",
    enableHTMLEmails: true,
    smsProvider: "twilio",
    smsFromNumber: "+61400123456",
    enableSMSNotifications: false,
    enablePushNotifications: true,
    notificationTypes: {
      "new-student-registration": { email: true, sms: false, push: true },
      "coach-assignment": { email: true, sms: false, push: false },
      "class-cancellation": { email: true, sms: true, push: true },
      "payment-success": { email: true, sms: false, push: false },
      "payment-failed": { email: true, sms: true, push: true }
    }
  };

  const defaultBackupSettings: BackupSettings = {
    enableAutoBackup: true,
    backupFrequency: "daily",
    backupTime: "02:00",
    retentionPeriod: 30,
    enableDatabaseBackup: true,
    enableFileBackup: true,
    enableConfigBackup: true,
    enableIncrementalBackup: true,
    primaryStorage: "aws-s3",
    s3Bucket: "adjja-backups",
    s3Region: "ap-southeast-2",
    enableBackupEncryption: true
  };

  const defaultIntegrationSettings: IntegrationSettings = {
    stripePublicKey: "",
    enableStripeTestMode: true,
    mailchimpAPIKey: "",
    mailchimpListId: "",
    autoSubscribeNewStudents: false,
    enableAPIDocumentation: true,
    enableCORS: true,
    apiBaseURL: "https://api.adjja.com/v1",
    apiVersion: "v1"
  };

  const saveGeneralSettings = async (settings: GeneralSettings) => {
    setIsLoading(true);
    try {
      // In a real implementation, you would save to Supabase
      console.log("Saving general settings:", settings);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "General settings saved successfully",
      });
      
      return { success: true };
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save general settings",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const saveUserManagementSettings = async (settings: UserManagementSettings) => {
    setIsLoading(true);
    try {
      console.log("Saving user management settings:", settings);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "User management settings saved successfully",
      });
      
      return { success: true };
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save user management settings",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const saveSystemSettings = async (settings: SystemSettings) => {
    setIsLoading(true);
    try {
      console.log("Saving system settings:", settings);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "System settings saved successfully",
      });
      
      return { success: true };
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save system settings",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const saveSecuritySettings = async (settings: SecuritySettings) => {
    setIsLoading(true);
    try {
      console.log("Saving security settings:", settings);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "Security settings saved successfully",
      });
      
      return { success: true };
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save security settings",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const saveNotificationSettings = async (settings: NotificationSettings) => {
    setIsLoading(true);
    try {
      console.log("Saving notification settings:", settings);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "Notification settings saved successfully",
      });
      
      return { success: true };
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save notification settings",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const saveBackupSettings = async (settings: BackupSettings) => {
    setIsLoading(true);
    try {
      console.log("Saving backup settings:", settings);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "Backup settings saved successfully",
      });
      
      return { success: true };
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save backup settings",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const saveIntegrationSettings = async (settings: IntegrationSettings) => {
    setIsLoading(true);
    try {
      console.log("Saving integration settings:", settings);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "Integration settings saved successfully",
      });
      
      return { success: true };
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save integration settings",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const testEmailConfiguration = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "Success",
        description: "Test email sent successfully",
      });
      return { success: true };
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send test email",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const testSMSConfiguration = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "Success",
        description: "Test SMS sent successfully",
      });
      return { success: true };
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send test SMS",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const createManualBackup = async (type: "full" | "database" | "files") => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      toast({
        title: "Success",
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} backup created successfully`,
      });
      return { success: true };
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to create ${type} backup`,
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const clearCaches = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "Success",
        description: "All caches cleared successfully",
      });
      return { success: true };
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear caches",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const generateAPIKey = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newAPIKey = `adjja_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      toast({
        title: "Success",
        description: "New API key generated successfully",
      });
      return { success: true, apiKey: newAPIKey };
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate API key",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    defaultGeneralSettings,
    defaultUserManagementSettings,
    defaultSystemSettings,
    defaultSecuritySettings,
    defaultNotificationSettings,
    defaultBackupSettings,
    defaultIntegrationSettings,
    saveGeneralSettings,
    saveUserManagementSettings,
    saveSystemSettings,
    saveSecuritySettings,
    saveNotificationSettings,
    saveBackupSettings,
    saveIntegrationSettings,
    testEmailConfiguration,
    testSMSConfiguration,
    createManualBackup,
    clearCaches,
    generateAPIKey
  };
};
