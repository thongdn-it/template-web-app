/**
 * Firebase Analytics Service
 * Provides comprehensive analytics tracking with error handling and type safety
 */

import {
  Analytics,
  CustomParams,
  logEvent as firebaseLogEvent,
  setUserId as firebaseSetUserId,
  setUserProperties as firebaseSetUserProperties,
  initializeAnalytics,
  isSupported,
  setDefaultEventParameters,
} from "firebase/analytics";

import { getFirebaseApp } from "./app";
import type { AnalyticsConfig, AnalyticsEventParams } from "./types";
import { isClient, sanitizeEventParams } from "./utils";

// Analytics instance
let _analytics: Analytics | undefined;

/**
 * Initialize Firebase Analytics with configuration
 */
export const initAnalytics = async (
  config?: AnalyticsConfig,
): Promise<Analytics | undefined> => {
  if (_analytics) return _analytics;

  // Skip analytics in development unless explicitly enabled
  if (process.env.NODE_ENV === "development" && !config?.enableInDevelopment) {
    console.log("Analytics disabled in development mode");
    return undefined;
  }

  if (!isClient()) {
    console.warn("Analytics can only be initialized on the client side");
    return undefined;
  }

  try {
    const supported = await isSupported();
    if (supported) {
      const app = getFirebaseApp();
      _analytics = initializeAnalytics(app, {
        config: {
          debug_mode:
            config?.enableDebugMode || process.env.NODE_ENV === "development",
        },
      });

      // Set default event parameters if provided
      if (config?.customEventParameters) {
        setDefaultEventParameters(config.customEventParameters);
      }

      if (process.env.NODE_ENV === "development") {
        console.log("Firebase Analytics initialized");
      }
    } else {
      console.warn("Firebase Analytics is not supported in this environment");
    }
  } catch (error) {
    console.error("Failed to initialize Firebase Analytics:", error);
  }

  return _analytics;
};

/**
 * Predefined event names as constants
 */
export const ANALYTICS_EVENTS = {
  // User engagement
  PAGE_VIEW: "page_view",
  USER_ENGAGEMENT: "user_engagement",
  SCREEN_VIEW: "screen_view",

  // Authentication
  LOGIN: "login",
  SIGN_UP: "sign_up",

  // E-commerce
  PURCHASE: "purchase",
  ADD_TO_CART: "add_to_cart",
  REMOVE_FROM_CART: "remove_from_cart",
  VIEW_ITEM: "view_item",

  // Content
  SELECT_CONTENT: "select_content",
  SEARCH: "search",
  SHARE: "share",

  // Custom app events
  BUTTON_CLICK: "button_click",
  FORM_SUBMIT: "form_submit",
  ERROR_OCCURRED: "error_occurred",
} as const;

export type AnalyticsEventName =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

/**
 * Firebase Analytics Service
 * Provides comprehensive analytics tracking with error handling and type safety
 */
export class FirebaseAnalyticsService {
  private analytics: Analytics | undefined;
  private isEnabled: boolean = false;

  constructor(config?: AnalyticsConfig) {
    this.initializeAnalytics(config);
  }

  private async initializeAnalytics(config?: AnalyticsConfig): Promise<void> {
    this.analytics = await initAnalytics(config);
    this.isEnabled = !!this.analytics;
  }

  /**
   * Ensure analytics is initialized
   */
  private ensureAnalytics(): Analytics {
    if (!this.analytics) {
      throw new Error("Firebase Analytics not initialized or not supported");
    }
    return this.analytics;
  }

  /**
   * Log a custom event with enhanced error handling
   */
  async logEvent(
    eventName: string | AnalyticsEventName,
    eventParams?: AnalyticsEventParams,
    options?: {
      retry?: boolean;
      maxRetries?: number;
    },
  ): Promise<void> {
    if (!this.isEnabled) return;

    try {
      const analytics = this.ensureAnalytics();

      // Sanitize event parameters using utility function
      const sanitizedParams = sanitizeEventParams(eventParams);

      firebaseLogEvent(analytics, eventName, sanitizedParams);

      if (process.env.NODE_ENV === "development") {
        console.log("Analytics Event:", eventName, sanitizedParams);
      }
    } catch (error) {
      console.error("Failed to log analytics event:", error);

      // Retry logic
      if (options?.retry && (options?.maxRetries || 1) > 0) {
        setTimeout(() => {
          this.logEvent(eventName, eventParams, {
            ...options,
            maxRetries: (options.maxRetries || 1) - 1,
          });
        }, 1000);
      }
    }
  }

  /**
   * Set user ID with validation
   */
  async setUserId(userId: string | null): Promise<void> {
    if (!this.isEnabled) return;

    try {
      const analytics = this.ensureAnalytics();

      // Validate user ID format
      if (userId && (typeof userId !== "string" || userId.length > 256)) {
        console.warn(
          "Invalid user ID format. Must be string with max 256 characters",
        );
        return;
      }

      firebaseSetUserId(analytics, userId);

      if (process.env.NODE_ENV === "development") {
        console.log("User ID set:", userId ? "***" : "cleared");
      }
    } catch (error) {
      console.error("Failed to set user ID:", error);
    }
  }

  /**
   * Set user properties with validation
   */
  async setUserProperties(
    userProperties: Record<string, unknown>,
  ): Promise<void> {
    if (!this.isEnabled) return;

    try {
      const analytics = this.ensureAnalytics();

      // Validate and sanitize user properties
      const sanitizedProperties = this.sanitizeUserProperties(userProperties);

      firebaseSetUserProperties(analytics, sanitizedProperties);

      if (process.env.NODE_ENV === "development") {
        console.log("User properties set:", Object.keys(sanitizedProperties));
      }
    } catch (error) {
      console.error("Failed to set user properties:", error);
    }
  }

  /**
   * Set current screen name
   * Uses the recommended screen_view event instead of deprecated setCurrentScreen
   */
  async setCurrentScreen(
    screenName: string,
    screenClass?: string,
  ): Promise<void> {
    if (!this.isEnabled) return;

    try {
      await this.logEvent(ANALYTICS_EVENTS.SCREEN_VIEW, {
        firebase_screen: screenName,
        firebase_screen_class: screenClass || screenName,
      });

      if (process.env.NODE_ENV === "development") {
        console.log("Current screen set:", screenName);
      }
    } catch (error) {
      console.error("Failed to set current screen:", error);
    }
  }

  /**
   * Track page views automatically
   */
  async trackPageView(pagePath: string, pageTitle?: string): Promise<void> {
    if (!isClient()) return;

    await this.logEvent(ANALYTICS_EVENTS.PAGE_VIEW, {
      page_location: window.location.href,
      page_path: pagePath,
      page_title: pageTitle || document.title,
    });
  }

  /**
   * Track user authentication events
   */
  async trackAuth(
    method: string,
    success: boolean,
    error?: string,
  ): Promise<void> {
    const eventName = success
      ? ANALYTICS_EVENTS.LOGIN
      : ANALYTICS_EVENTS.ERROR_OCCURRED;
    await this.logEvent(eventName, {
      method,
      success,
      error_message: error,
    });
  }

  /**
   * Track form submissions
   */
  async trackFormSubmit(
    formName: string,
    success: boolean,
    error?: string,
  ): Promise<void> {
    await this.logEvent(ANALYTICS_EVENTS.FORM_SUBMIT, {
      form_name: formName,
      success,
      error_message: error,
    });
  }

  /**
   * Track button clicks
   */
  async trackButtonClick(buttonName: string, location?: string): Promise<void> {
    await this.logEvent(ANALYTICS_EVENTS.BUTTON_CLICK, {
      button_name: buttonName,
      location,
    });
  }

  /**
   * Track errors
   */
  async trackError(errorMessage: string, errorCode?: string): Promise<void> {
    await this.logEvent(ANALYTICS_EVENTS.ERROR_OCCURRED, {
      error_message: errorMessage,
      error_code: errorCode,
    });
  }

  /**
   * Enable/disable analytics
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled && !!this.analytics;

    if (process.env.NODE_ENV === "development") {
      console.log("Analytics", enabled ? "enabled" : "disabled");
    }
  }

  /**
   * Check if analytics is available and enabled
   */
  isAvailable(): boolean {
    return this.isEnabled && !!this.analytics;
  }

  /**
   * Sanitize user properties
   */
  private sanitizeUserProperties(
    properties: Record<string, unknown>,
  ): CustomParams {
    const sanitized: CustomParams = {};

    Object.entries(properties).forEach(([key, value]) => {
      // Property names must be 24 characters or fewer
      const sanitizedKey = key.substring(0, 24);

      // Property values must be strings of 36 characters or fewer
      if (value !== null && value !== undefined) {
        sanitized[sanitizedKey] = String(value).substring(0, 36);
      }
    });

    return sanitized;
  }
}

// Export singleton instance
export const analyticsService = new FirebaseAnalyticsService({
  enableInDevelopment: false,
  enableDebugMode: process.env.NODE_ENV === "development",
});

/**
 * Get analytics instance (for direct Firebase Analytics usage)
 */
export const getAnalyticsInstance = (): Analytics | undefined => {
  return _analytics;
};
