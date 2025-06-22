
import { useAuthFlow } from './useAuthFlow';

// Simple wrapper around useAuthFlow for backward compatibility
export const useAuth = () => {
  return useAuthFlow();
};
