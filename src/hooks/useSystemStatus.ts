
import { useState, useEffect } from "react";

export interface SystemService {
  name: string;
  status: "Healthy" | "Warning" | "Critical";
  uptime: string;
  lastCheck: string;
  details?: string;
}

export const useSystemStatus = () => {
  const [services, setServices] = useState<SystemService[]>([
    { 
      name: "Database", 
      status: "Healthy", 
      uptime: "99.9%", 
      lastCheck: "2 minutes ago",
      details: "All connections active, query performance optimal"
    },
    { 
      name: "Email Service", 
      status: "Healthy", 
      uptime: "99.7%", 
      lastCheck: "5 minutes ago",
      details: "SMTP connection stable, delivery queue normal"
    },
    { 
      name: "File Storage", 
      status: "Warning", 
      uptime: "98.5%", 
      lastCheck: "1 minute ago",
      details: "Storage usage at 85%, consider cleanup"
    },
    { 
      name: "Backup System", 
      status: "Healthy", 
      uptime: "100%", 
      lastCheck: "30 minutes ago",
      details: "Last backup completed successfully"
    },
    {
      name: "Cache Service",
      status: "Healthy",
      uptime: "99.8%",
      lastCheck: "3 minutes ago",
      details: "Redis cache performing optimally"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshStatus = async () => {
    setIsLoading(true);
    try {
      // Simulate API call to check system status
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update last check times
      setServices(prev => prev.map(service => ({
        ...service,
        lastCheck: "Just now"
      })));
    } catch (error) {
      console.error('Error refreshing system status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    services,
    isLoading,
    refreshStatus
  };
};
