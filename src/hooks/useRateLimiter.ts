import { useState, useCallback, useRef } from 'react';

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs?: number;
}

interface RateLimitState {
  attempts: number[];
  blockedUntil?: number;
}

export const useRateLimiter = (config: RateLimitConfig) => {
  const [state, setState] = useState<RateLimitState>({ attempts: [] });
  const stateRef = useRef(state);
  stateRef.current = state;

  const isBlocked = useCallback(() => {
    const now = Date.now();
    const current = stateRef.current;
    
    // Check if still in block period
    if (current.blockedUntil && now < current.blockedUntil) {
      return true;
    }

    // Remove old attempts outside the window
    const windowStart = now - config.windowMs;
    const recentAttempts = current.attempts.filter(time => time > windowStart);
    
    // Update state if attempts were cleaned up
    if (recentAttempts.length !== current.attempts.length) {
      setState(prev => ({
        ...prev,
        attempts: recentAttempts,
        blockedUntil: prev.blockedUntil && now >= prev.blockedUntil ? undefined : prev.blockedUntil
      }));
    }

    return recentAttempts.length >= config.maxAttempts;
  }, [config.maxAttempts, config.windowMs]);

  const recordAttempt = useCallback(() => {
    const now = Date.now();
    
    setState(prev => {
      const windowStart = now - config.windowMs;
      const recentAttempts = prev.attempts.filter(time => time > windowStart);
      const newAttempts = [...recentAttempts, now];
      
      // Check if we should block
      const shouldBlock = newAttempts.length >= config.maxAttempts;
      const blockedUntil = shouldBlock && config.blockDurationMs 
        ? now + config.blockDurationMs 
        : undefined;

      return {
        attempts: newAttempts,
        blockedUntil
      };
    });
  }, [config.maxAttempts, config.windowMs, config.blockDurationMs]);

  const getRemainingTime = useCallback(() => {
    const now = Date.now();
    const current = stateRef.current;
    
    if (current.blockedUntil && now < current.blockedUntil) {
      return Math.ceil((current.blockedUntil - now) / 1000);
    }
    
    return 0;
  }, []);

  const reset = useCallback(() => {
    setState({ attempts: [] });
  }, []);

  return {
    isBlocked,
    recordAttempt,
    getRemainingTime,
    reset,
    remainingAttempts: Math.max(0, config.maxAttempts - state.attempts.length)
  };
};