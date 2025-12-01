/**
 * Firebase Service Types
 * Centralized type definitions for all Firebase services
 */

import type { CustomParams } from "firebase/analytics";
import type { User, UserCredential } from "firebase/auth";
import type { Firestore } from "firebase/firestore";

/**
 * Firebase Configuration
 */
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
  databaseURL?: string;
}

/**
 * Firebase Services State
 */
export interface FirebaseServices {
  auth: boolean;
  analytics: boolean;
  firestore: boolean;
  storage: boolean;
}

/**
 * Auth Service Types
 */
export interface AuthService {
  signInWithGoogle: () => Promise<UserCredential>;
  signInWithEmail: (
    _email: string,
    _password: string,
  ) => Promise<UserCredential>;
  signUpWithEmail: (
    _email: string,
    _password: string,
  ) => Promise<UserCredential>;
  signOut: () => Promise<void>;
  getCurrentUser: () => User | null;
  onAuthStateChanged: (_callback: (_user: User | null) => void) => () => void;
  isAuthenticated: () => boolean;
  getIdToken: (_forceRefresh?: boolean) => Promise<string | null>;
  sendPasswordResetEmail: (_email: string) => Promise<void>;
  updateUserProfile: (
    _displayName?: string,
    _photoURL?: string,
  ) => Promise<void>;
  deleteUser: () => Promise<void>;
}

/**
 * Analytics Configuration
 */
export interface AnalyticsConfig {
  enableDebugMode?: boolean;
  enableInDevelopment?: boolean;
  customEventParameters?: CustomParams;
}

/**
 * Analytics Event Parameters
 */
export interface AnalyticsEventParams {
  [key: string]: string | number | boolean | string[] | undefined;
}

/**
 * Analytics Service Types
 */
export interface AnalyticsService {
  logEvent: (
    _eventName: string,
    _eventParams?: AnalyticsEventParams,
    _options?: {
      retry?: boolean;
      maxRetries?: number;
    },
  ) => Promise<void>;
  setUserId: (_userId: string | null) => Promise<void>;
  setUserProperties: (_properties: Record<string, unknown>) => Promise<void>;
  trackPageView: (_pagePath: string, _pageTitle?: string) => Promise<void>;
  trackAuth: (_method: string, _success: boolean) => Promise<void>;
  trackFormSubmit: (_formName: string, _success: boolean) => Promise<void>;
  trackButtonClick: (_buttonName: string, _location?: string) => Promise<void>;
  trackError: (_errorMessage: string, _errorCode?: string) => Promise<void>;
}

/**
 * Firestore Service Types
 */
export interface FirestoreService {
  db: Firestore | undefined;
  isEnabled: () => boolean;
}

/**
 * Auth Error Codes
 */
export const AUTH_ERROR_CODES = {
  POPUP_CLOSED: "auth/popup-closed-by-user",
  POPUP_BLOCKED: "auth/popup-blocked",
  CANCELLED_POPUP: "auth/cancelled-popup-request",
  NETWORK_FAILED: "auth/network-request-failed",
  TOO_MANY_REQUESTS: "auth/too-many-requests",
  USER_DISABLED: "auth/user-disabled",
  USER_NOT_FOUND: "auth/user-not-found",
  WRONG_PASSWORD: "auth/wrong-password",
  EMAIL_EXISTS: "auth/email-already-in-use",
  WEAK_PASSWORD: "auth/weak-password",
  INVALID_EMAIL: "auth/invalid-email",
} as const;

export type AuthErrorCode =
  (typeof AUTH_ERROR_CODES)[keyof typeof AUTH_ERROR_CODES];

/**
 * User-friendly error messages
 */
export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  [AUTH_ERROR_CODES.POPUP_CLOSED]: "Sign-in was cancelled by user",
  [AUTH_ERROR_CODES.POPUP_BLOCKED]:
    "Popup was blocked by browser. Please allow popups for this site.",
  [AUTH_ERROR_CODES.CANCELLED_POPUP]:
    "Only one popup request is allowed at a time",
  [AUTH_ERROR_CODES.NETWORK_FAILED]:
    "Network error occurred. Please check your connection",
  [AUTH_ERROR_CODES.TOO_MANY_REQUESTS]:
    "Too many failed attempts. Please try again later",
  [AUTH_ERROR_CODES.USER_DISABLED]: "User account has been disabled",
  [AUTH_ERROR_CODES.USER_NOT_FOUND]: "No user found with this email",
  [AUTH_ERROR_CODES.WRONG_PASSWORD]: "Incorrect password",
  [AUTH_ERROR_CODES.EMAIL_EXISTS]: "Email address is already in use",
  [AUTH_ERROR_CODES.WEAK_PASSWORD]:
    "Password is too weak. Please use a stronger password",
  [AUTH_ERROR_CODES.INVALID_EMAIL]: "Invalid email address",
};
