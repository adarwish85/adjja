
import { useState, useEffect } from "react";

export interface SecurityEvent {
  id: string;
  timestamp: string;
  event: string;
  user: string;
  severity: "low" | "medium" | "high" | "critical";
  ipAddress: string;
  userAgent: string;
  location: string;
  status: "resolved" | "investigating" | "open";
  details: string;
}

export interface SecurityMetrics {
  totalEvents: number;
  criticalEvents: number;
  failedLogins: number;
  suspiciousActivities: number;
  blockedIPs: number;
  activeThreats: number;
}

export const useSecurityMonitoring = () => {
  const [events, setEvents] = useState<SecurityEvent[]>([
    {
      id: "1",
      timestamp: "2024-01-15 10:30:15",
      event: "Multiple failed login attempts",
      user: "unknown@email.com",
      severity: "high",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      location: "Sydney, Australia",
      status: "investigating",
      details: "5 consecutive failed login attempts from this IP"
    },
    {
      id: "2",
      timestamp: "2024-01-15 09:15:22",
      event: "Password changed",
      user: "john@adjja.com",
      severity: "low",
      ipAddress: "10.0.0.15",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      location: "Melbourne, Australia",
      status: "resolved",
      details: "User successfully changed password"
    },
    {
      id: "3",
      timestamp: "2024-01-15 08:45:33",
      event: "Admin access granted",
      user: "sarah@adjja.com",
      severity: "medium",
      ipAddress: "172.16.0.25",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      location: "Brisbane, Australia",
      status: "resolved",
      details: "Admin privileges granted to user"
    },
    {
      id: "4",
      timestamp: "2024-01-15 07:30:45",
      event: "Suspicious API usage",
      user: "api_user",
      severity: "critical",
      ipAddress: "203.45.67.89",
      userAgent: "curl/7.68.0",
      location: "Unknown",
      status: "open",
      details: "Unusual API access pattern detected"
    }
  ]);

  const [metrics, setMetrics] = useState<SecurityMetrics>({
    totalEvents: 24,
    criticalEvents: 2,
    failedLogins: 8,
    suspiciousActivities: 3,
    blockedIPs: 5,
    activeThreats: 1
  });

  const [isLoading, setIsLoading] = useState(false);

  const refreshEvents = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Simulate new events
      console.log("Refreshing security events...");
    } catch (error) {
      console.error("Error refreshing security events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const blockIP = async (ipAddress: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log(`Blocking IP: ${ipAddress}`);
      setMetrics(prev => ({ ...prev, blockedIPs: prev.blockedIPs + 1 }));
    } catch (error) {
      console.error("Error blocking IP:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resolveEvent = async (eventId: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setEvents(prev => prev.map(event => 
        event.id === eventId ? { ...event, status: "resolved" as const } : event
      ));
      console.log(`Resolved security event: ${eventId}`);
    } catch (error) {
      console.error("Error resolving event:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(refreshEvents, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return {
    events,
    metrics,
    isLoading,
    refreshEvents,
    blockIP,
    resolveEvent
  };
};
