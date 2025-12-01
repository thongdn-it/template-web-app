/**
 * FirebaseProvider
 * Initializes Firebase services when the component mounts
 * This provider should be placed at the top level of your app
 */

"use client";

import { useEffect } from "react";

import { initAnalytics } from "./analytics";
import { initAuth } from "./auth";
import { initFirestore } from "./firestore";

interface FirebaseProviderProps {
  children: React.ReactNode;
  enableAnalytics?: boolean;
  enableAnalyticsInDevelopment?: boolean;
  enableAuth?: boolean;
  enableFirestore?: boolean;
}

/**
 * FirebaseProvider initializes Firebase services when the component mounts.
 */
export const FirebaseProvider = ({
  children,
  enableAnalytics = true,
  enableAnalyticsInDevelopment = true,
  enableAuth = true,
  enableFirestore = false,
}: FirebaseProviderProps) => {
  useEffect(() => {
    const initializeServices = async () => {
      try {
        // Initialize services based on configuration
        if (enableAnalytics) {
          await initAnalytics({
            enableInDevelopment: enableAnalyticsInDevelopment,
            enableDebugMode: process.env.NODE_ENV === "development",
          });
        }

        if (enableAuth) {
          initAuth();
        }

        if (enableFirestore) {
          initFirestore();
        }

        if (process.env.NODE_ENV === "development") {
          console.log("Firebase services initialized successfully");
        }
      } catch (error) {
        console.error("Failed to initialize Firebase services:", error);
      }
    };

    initializeServices();
  }, [
    enableAnalytics,
    enableAnalyticsInDevelopment,
    enableAuth,
    enableFirestore,
  ]);

  return children;
};
