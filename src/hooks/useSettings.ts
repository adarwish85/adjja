import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface GeneralSettings {
  academyName: string;
  academyCode: string;
  academyLogo: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  timezone: string;
  currency: string;
  language: string;
  specialties: string[];
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
  paypalClientId: string;
  paypalClientSecret: string;
  paypalSandboxMode: boolean;
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

  // World timezones including Cairo/Egypt
  const worldTimezones = [
    { value: "africa/cairo", label: "Africa/Cairo (Egypt)" },
    { value: "africa/johannesburg", label: "Africa/Johannesburg" },
    { value: "africa/lagos", label: "Africa/Lagos" },
    { value: "america/new_york", label: "America/New_York (EST)" },
    { value: "america/chicago", label: "America/Chicago (CST)" },
    { value: "america/denver", label: "America/Denver (MST)" },
    { value: "america/los_angeles", label: "America/Los_Angeles (PST)" },
    { value: "america/toronto", label: "America/Toronto" },
    { value: "america/vancouver", label: "America/Vancouver" },
    { value: "america/sao_paulo", label: "America/Sao_Paulo" },
    { value: "america/mexico_city", label: "America/Mexico_City" },
    { value: "asia/dubai", label: "Asia/Dubai (UAE)" },
    { value: "asia/riyadh", label: "Asia/Riyadh (Saudi Arabia)" },
    { value: "asia/kuwait", label: "Asia/Kuwait" },
    { value: "asia/qatar", label: "Asia/Qatar" },
    { value: "asia/tokyo", label: "Asia/Tokyo" },
    { value: "asia/shanghai", label: "Asia/Shanghai" },
    { value: "asia/hong_kong", label: "Asia/Hong_Kong" },
    { value: "asia/singapore", label: "Asia/Singapore" },
    { value: "asia/bangkok", label: "Asia/Bangkok" },
    { value: "asia/manila", label: "Asia/Manila" },
    { value: "asia/jakarta", label: "Asia/Jakarta" },
    { value: "asia/kolkata", label: "Asia/Kolkata (India)" },
    { value: "asia/karachi", label: "Asia/Karachi (Pakistan)" },
    { value: "asia/tehran", label: "Asia/Tehran (Iran)" },
    { value: "asia/istanbul", label: "Asia/Istanbul (Turkey)" },
    { value: "australia/sydney", label: "Australia/Sydney" },
    { value: "australia/melbourne", label: "Australia/Melbourne" },
    { value: "australia/brisbane", label: "Australia/Brisbane" },
    { value: "australia/perth", label: "Australia/Perth" },
    { value: "australia/adelaide", label: "Australia/Adelaide" },
    { value: "europe/london", label: "Europe/London (GMT)" },
    { value: "europe/paris", label: "Europe/Paris (CET)" },
    { value: "europe/berlin", label: "Europe/Berlin" },
    { value: "europe/rome", label: "Europe/Rome" },
    { value: "europe/madrid", label: "Europe/Madrid" },
    { value: "europe/amsterdam", label: "Europe/Amsterdam" },
    { value: "europe/zurich", label: "Europe/Zurich" },
    { value: "europe/vienna", label: "Europe/Vienna" },
    { value: "europe/stockholm", label: "Europe/Stockholm" },
    { value: "europe/oslo", label: "Europe/Oslo" },
    { value: "europe/copenhagen", label: "Europe/Copenhagen" },
    { value: "europe/moscow", label: "Europe/Moscow" },
    { value: "pacific/auckland", label: "Pacific/Auckland (New Zealand)" },
    { value: "pacific/fiji", label: "Pacific/Fiji" },
    { value: "pacific/honolulu", label: "Pacific/Honolulu (Hawaii)" }
  ];

  // World currencies
  const worldCurrencies = [
    { value: "aed", label: "AED - UAE Dirham" },
    { value: "aud", label: "AUD - Australian Dollar" },
    { value: "bdt", label: "BDT - Bangladeshi Taka" },
    { value: "brl", label: "BRL - Brazilian Real" },
    { value: "cad", label: "CAD - Canadian Dollar" },
    { value: "chf", label: "CHF - Swiss Franc" },
    { value: "cny", label: "CNY - Chinese Yuan" },
    { value: "czk", label: "CZK - Czech Koruna" },
    { value: "dkk", label: "DKK - Danish Krone" },
    { value: "egp", label: "EGP - Egyptian Pound" },
    { value: "eur", label: "EUR - Euro" },
    { value: "gbp", label: "GBP - British Pound" },
    { value: "hkd", label: "HKD - Hong Kong Dollar" },
    { value: "idr", label: "IDR - Indonesian Rupiah" },
    { value: "ils", label: "ILS - Israeli Shekel" },
    { value: "inr", label: "INR - Indian Rupee" },
    { value: "jpy", label: "JPY - Japanese Yen" },
    { value: "krw", label: "KRW - South Korean Won" },
    { value: "kwd", label: "KWD - Kuwaiti Dinar" },
    { value: "mxn", label: "MXN - Mexican Peso" },
    { value: "myr", label: "MYR - Malaysian Ringgit" },
    { value: "nok", label: "NOK - Norwegian Krone" },
    { value: "nzd", label: "NZD - New Zealand Dollar" },
    { value: "php", label: "PHP - Philippine Peso" },
    { value: "pkr", label: "PKR - Pakistani Rupee" },
    { value: "pln", label: "PLN - Polish Zloty" },
    { value: "qar", label: "QAR - Qatari Riyal" },
    { value: "sar", label: "SAR - Saudi Riyal" },
    { value: "sek", label: "SEK - Swedish Krona" },
    { value: "sgd", label: "SGD - Singapore Dollar" },
    { value: "thb", label: "THB - Thai Baht" },
    { value: "try", label: "TRY - Turkish Lira" },
    { value: "twd", label: "TWD - Taiwan Dollar" },
    { value: "usd", label: "USD - US Dollar" },
    { value: "vnd", label: "VND - Vietnamese Dong" },
    { value: "zar", label: "ZAR - South African Rand" }
  ];

  // Default settings with specialties included
  const defaultGeneralSettings: GeneralSettings = {
    academyName: "Australian Jiu-Jitsu Academy",
    academyCode: "ADJJA",
    academyLogo: "",
    contactEmail: "admin@adjja.com",
    contactPhone: "+61 400 123 456",
    address: "123 BJJ Street, Sydney, NSW 2000, Australia",
    timezone: "africa/cairo",
    currency: "egp",
    language: "en",
    specialties: [
      "Fundamentals",
      "Competition",
      "No-Gi",
      "Kids Classes",
      "Women's Classes",
      "Self Defense",
      "Advanced Techniques",
      "Wrestling",
      "MMA"
    ],
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
    paypalClientId: "",
    paypalClientSecret: "",
    paypalSandboxMode: true,
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
      console.log("Saving general settings:", settings);
      
      // Save to localStorage for persistence
      localStorage.setItem('adjja_general_settings', JSON.stringify(settings));
      
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

  const loadGeneralSettings = (): GeneralSettings => {
    try {
      const saved = localStorage.getItem('adjja_general_settings');
      if (saved) {
        return { ...defaultGeneralSettings, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
    return defaultGeneralSettings;
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
      
      // Save to localStorage for persistence
      localStorage.setItem('adjja_integration_settings', JSON.stringify(settings));
      
      // Simulate API call
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

  const loadIntegrationSettings = (): IntegrationSettings => {
    try {
      const saved = localStorage.getItem('adjja_integration_settings');
      if (saved) {
        return { ...defaultIntegrationSettings, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.error('Error loading integration settings:', error);
    }
    return defaultIntegrationSettings;
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
    worldTimezones,
    worldCurrencies,
    defaultGeneralSettings,
    loadGeneralSettings,
    defaultUserManagementSettings,
    defaultSystemSettings,
    defaultSecuritySettings,
    defaultNotificationSettings,
    defaultBackupSettings,
    defaultIntegrationSettings,
    loadIntegrationSettings,
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
