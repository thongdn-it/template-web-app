/**
 * Firebase Configuration
 * Centralized configuration management for Firebase services
 */

import type { FirebaseConfig } from "./types";

/**
 * Load Firebase configuration from environment variables or JSON file
 */
export const loadFirebaseConfig = (): FirebaseConfig => {
  // Try to load from environment variables first
  if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    return {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
      messagingSenderId:
        process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    };
  }

  // Fallback to JSON config file
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const config = require("./firebase.json") as FirebaseConfig;
    return config;
  } catch (error) {
    console.error("Failed to load Firebase config:", error);
    throw new Error(
      "Firebase configuration not found. Please set environment variables or create firebase.json",
    );
  }
};

/**
 * Validate Firebase configuration
 */
export const validateFirebaseConfig = (config: FirebaseConfig): boolean => {
  const requiredFields: (keyof FirebaseConfig)[] = [
    "apiKey",
    "authDomain",
    "projectId",
    "storageBucket",
    "messagingSenderId",
    "appId",
  ];

  for (const field of requiredFields) {
    if (!config[field]) {
      console.error(`Missing required Firebase config field: ${field}`);
      return false;
    }
  }

  return true;
};

/**
 * Get Firebase configuration with validation
 */
export const getFirebaseConfig = (): FirebaseConfig => {
  const config = loadFirebaseConfig();

  if (!validateFirebaseConfig(config)) {
    throw new Error("Invalid Firebase configuration");
  }

  return config;
};
