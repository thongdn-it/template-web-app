/**
 * Firebase Utilities
 * Helper functions for Firebase services
 */

import type { FirebaseError } from "firebase/app";

import { AUTH_ERROR_MESSAGES } from "./types";

/**
 * Check if code is running on client side
 */
export const isClient = (): boolean => {
  return typeof window !== "undefined";
};

/**
 * Check if Firebase service is supported in current environment
 */
export const isFirebaseSupported = (): boolean => {
  return isClient() && "indexedDB" in window;
};

/**
 * Get user-friendly error message from Firebase error
 */
export const getFirebaseErrorMessage = (error: unknown): string => {
  if (!error) return "An unknown error occurred";

  const firebaseError = error as FirebaseError;
  const errorCode = firebaseError.code;

  if (errorCode && AUTH_ERROR_MESSAGES[errorCode]) {
    return AUTH_ERROR_MESSAGES[errorCode];
  }

  return firebaseError.message || "An error occurred";
};

/**
 * Handle Firebase error and return Error instance
 */
export const handleFirebaseError = (
  error: unknown,
  context?: string,
): Error => {
  const message = getFirebaseErrorMessage(error);
  const errorMessage = context ? `${context}: ${message}` : message;

  console.error(errorMessage, error);
  return new Error(errorMessage);
};

/**
 * Retry a Firebase operation with exponential backoff
 */
export const retryOperation = async <T>(
  operation: () => Promise<T>,
  options: {
    maxRetries?: number;
    baseDelay?: number;
    maxDelay?: number;
  } = {},
): Promise<T> => {
  const { maxRetries = 3, baseDelay = 1000, maxDelay = 10000 } = options;

  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (attempt < maxRetries) {
        const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
        console.log(`Retry attempt ${attempt + 1} after ${delay}ms`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
};

/**
 * Sanitize analytics event parameters
 */
export const sanitizeEventParams = (
  params?: Record<string, unknown>,
): Record<string, unknown> | undefined => {
  if (!params) return undefined;

  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(params)) {
    // Firebase Analytics has specific requirements for parameter names and values
    const sanitizedKey = key.replace(/[^a-zA-Z0-9_]/g, "_").substring(0, 40);

    if (value !== null && value !== undefined) {
      // Convert values to acceptable types
      if (typeof value === "string") {
        sanitized[sanitizedKey] = value.substring(0, 100); // Max 100 chars for string values
      } else if (typeof value === "number" || typeof value === "boolean") {
        sanitized[sanitizedKey] = value;
      } else if (Array.isArray(value)) {
        sanitized[sanitizedKey] = value
          .map(String)
          .join(", ")
          .substring(0, 100);
      } else {
        sanitized[sanitizedKey] = String(value).substring(0, 100);
      }
    }
  }

  return sanitized;
};

/**
 * Debounce function for rate-limiting operations
 */
export const debounce = <T extends (..._args: unknown[]) => unknown>(
  func: T,
  wait: number,
): ((..._args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;

  return (..._args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(..._args), wait);
  };
};

/**
 * Throttle function for rate-limiting operations
 */
export const throttle = <T extends (..._args: unknown[]) => unknown>(
  func: T,
  limit: number,
): ((..._args: Parameters<T>) => void) => {
  let inThrottle = false;

  return (..._args: Parameters<T>) => {
    if (!inThrottle) {
      func(..._args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
