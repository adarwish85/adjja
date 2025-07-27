import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type SecurityAuditSeverity = 'low' | 'medium' | 'high' | 'critical';

interface SecurityAuditLog {
  action: string;
  resource?: string;
  severity?: SecurityAuditSeverity;
  details?: Record<string, any>;
}

export const useSecurityAuditLogger = () => {
  const logSecurityEvent = useCallback(async (event: SecurityAuditLog) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.from('security_audit_logs').insert({
        user_id: user?.id || null,
        action: event.action,
        resource: event.resource,
        severity: event.severity || 'info',
        details: event.details || {},
        ip_address: null, // Would need to be populated server-side
        user_agent: navigator.userAgent
      });
    } catch (error) {
      // Don't throw errors from logging - just log to console
      console.warn('Failed to log security event:', error);
    }
  }, []);

  const logLoginAttempt = useCallback((success: boolean, email?: string) => {
    logSecurityEvent({
      action: success ? 'login_success' : 'login_failed',
      resource: 'authentication',
      severity: success ? 'low' : 'medium',
      details: { email: email ? email.substring(0, 3) + '***' : undefined }
    });
  }, [logSecurityEvent]);

  const logPasswordChange = useCallback(() => {
    logSecurityEvent({
      action: 'password_changed',
      resource: 'authentication',
      severity: 'medium'
    });
  }, [logSecurityEvent]);

  const logRoleChange = useCallback((oldRole: string, newRole: string, targetUserId: string) => {
    logSecurityEvent({
      action: 'role_changed',
      resource: 'user_management',
      severity: 'high',
      details: { oldRole, newRole, targetUserId }
    });
  }, [logSecurityEvent]);

  const logDataAccess = useCallback((resource: string, action: string) => {
    logSecurityEvent({
      action: `data_${action}`,
      resource,
      severity: 'low'
    });
  }, [logSecurityEvent]);

  const logSuspiciousActivity = useCallback((description: string, details?: Record<string, any>) => {
    logSecurityEvent({
      action: 'suspicious_activity',
      severity: 'critical',
      details: { description, ...details }
    });
  }, [logSecurityEvent]);

  return {
    logSecurityEvent,
    logLoginAttempt,
    logPasswordChange,
    logRoleChange,
    logDataAccess,
    logSuspiciousActivity
  };
};