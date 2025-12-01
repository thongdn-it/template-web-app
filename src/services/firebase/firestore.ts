/**
 * Firebase Firestore Service
 * Provides Firestore database functionality
 */

import {
  connectFirestoreEmulator,
  Firestore,
  getFirestore,
} from "firebase/firestore";

import { getFirebaseApp } from "./app";
import { isClient } from "./utils";

// Firestore instance
let _firestore: Firestore | undefined;

/**
 * Initialize Firestore
 */
export const initFirestore = (): Firestore | undefined => {
  if (_firestore) return _firestore;

  if (!isClient()) {
    console.warn("Firestore can only be initialized on the client side");
    return undefined;
  }

  try {
    const app = getFirebaseApp();
    _firestore = getFirestore(app);

    // Connect to Firestore emulator in development if configured
    if (
      process.env.NODE_ENV === "development" &&
      process.env.NEXT_PUBLIC_FIREBASE_EMULATOR_HOST
    ) {
      const [host, port] =
        process.env.NEXT_PUBLIC_FIREBASE_EMULATOR_HOST.split(":");
      connectFirestoreEmulator(_firestore, host, parseInt(port));
      console.log(`Firestore connected to emulator at ${host}:${port}`);
    }

    if (process.env.NODE_ENV === "development") {
      console.log("Firestore initialized");
    }

    return _firestore;
  } catch (error) {
    console.error("Failed to initialize Firestore:", error);
    return undefined;
  }
};

/**
 * Get Firestore instance
 */
export const getFirestoreInstance = (): Firestore | undefined => {
  return _firestore || initFirestore();
};

/**
 * Firebase Firestore Service Class
 */
export class FirebaseFirestoreService {
  private db: Firestore | undefined;

  constructor() {
    this.db = initFirestore();
  }

  /**
   * Check if Firestore is enabled
   */
  isEnabled(): boolean {
    return !!this.db;
  }

  /**
   * Get Firestore instance for direct usage
   */
  getDatabase(): Firestore | undefined {
    return this.db;
  }
}

// Export singleton instance
export const firestoreService = new FirebaseFirestoreService();
