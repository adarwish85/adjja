
import { useState, useEffect } from "react";

export interface SystemMetrics {
  cpu: {
    usage: number;
    cores: number;
    temperature: number;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  storage: {
    used: number;
    total: number;
    percentage: number;
  };
  network: {
    inbound: number;
    outbound: number;
  };
  database: {
    connections: number;
    maxConnections: number;
    queryTime: number;
  };
}

export const useSystemMetrics = () => {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: { usage: 45, cores: 8, temperature: 62 },
    memory: { used: 8.2, total: 16, percentage: 51 },
    storage: { used: 425, total: 500, percentage: 85 },
    network: { inbound: 150, outbound: 89 },
    database: { connections: 23, maxConnections: 100, queryTime: 45 }
  });
  const [isLoading, setIsLoading] = useState(false);

  const refreshMetrics = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate live metrics with small variations
      setMetrics(prev => ({
        cpu: {
          ...prev.cpu,
          usage: Math.max(20, Math.min(80, prev.cpu.usage + (Math.random() - 0.5) * 10))
        },
        memory: {
          ...prev.memory,
          percentage: Math.max(30, Math.min(90, prev.memory.percentage + (Math.random() - 0.5) * 5))
        },
        storage: { ...prev.storage },
        network: {
          inbound: Math.max(50, Math.min(300, prev.network.inbound + (Math.random() - 0.5) * 20)),
          outbound: Math.max(20, Math.min(200, prev.network.outbound + (Math.random() - 0.5) * 15))
        },
        database: {
          ...prev.database,
          connections: Math.max(10, Math.min(95, prev.database.connections + Math.floor((Math.random() - 0.5) * 6))),
          queryTime: Math.max(20, Math.min(100, prev.database.queryTime + (Math.random() - 0.5) * 10))
        }
      }));
    } catch (error) {
      console.error('Error refreshing metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(refreshMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  return {
    metrics,
    isLoading,
    refreshMetrics
  };
};
