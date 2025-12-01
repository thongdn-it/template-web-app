/**
 * Firebase App Initialization
 * Core Firebase app instance and initialization logic
 */

import { FirebaseApp, initializeApp } from "firebase/app";
import { getFirebaseConfig } from "./config";
import { isClient } from "./utils";

// Firebase app instance
let _firebaseApp: FirebaseApp | undefined;

/**
 * Initialize Firebase App
 * This function ensures Firebase is initialized only once
 */
export const initFirebaseApp = (): FirebaseApp | undefined => {
  if (_firebaseApp) return _firebaseApp;

  // Only initialize on client side
  if (!isClient()) {
    console.warn("Firebase can only be initialized on the client side");
    return undefined;
  }

  try {
    const config = getFirebaseConfig();
    _firebaseApp = initializeApp(config);

    if (process.env.NODE_ENV === "development") {
      console.log("Firebase app initialized:", _firebaseApp.options.appId);
    }

    return _firebaseApp;
  } catch (error) {
    console.error("Failed to initialize Firebase app:", error);
    return undefined;
  }
};

/**
 * Get Firebase app instance
 */
export const getFirebaseApp = (): FirebaseApp => {
  if (!_firebaseApp) {
    const app = initFirebaseApp();
    if (!app) {
      throw new Error("Firebase app not initialized");
    }
    return app;
  }
  return _firebaseApp;
};

// Initialize Firebase app immediately
export const firebaseApp = initFirebaseApp()!;
