/**
 * Firebase Authentication Service
 * Provides comprehensive authentication methods with error handling
 */

import {
  Auth,
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  fetchSignInMethodsForEmail,
  deleteUser as firebaseDeleteUser,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  getAuth,
  GoogleAuthProvider,
  linkWithCredential,
  linkWithPopup,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  unlink,
  updateProfile,
  User,
  UserCredential,
} from "firebase/auth";

import { getFirebaseApp } from "./app";
import type { AuthService } from "./types";
import { handleFirebaseError, isClient } from "./utils";

// Auth instance
let _auth: Auth | undefined;

/**
 * Initialize Firebase Auth
 * This function is called only once to avoid multiple initializations.
 */
export const initAuth = (): Auth | undefined => {
  if (_auth) {
    console.log(
      "[initAuth] Auth already initialized, returning cached instance",
    );
    return _auth;
  }

  if (!isClient()) {
    console.warn("[initAuth] Auth can only be initialized on the client side");
    return undefined;
  }

  try {
    console.log("[initAuth] Initializing Firebase Auth...");
    const app = getFirebaseApp();
    console.log("[initAuth] Firebase app obtained:", !!app);
    _auth = getAuth(app);
    console.log("[initAuth] Auth instance created:", !!_auth);

    // Connect to Auth emulator in development if configured
    if (
      process.env.NODE_ENV === "development" &&
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST
    ) {
      const [host, port] =
        process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST.split(":");
      connectAuthEmulator(_auth, `http://${host}:${port}`, {
        disableWarnings: true,
      });
      console.log(`[initAuth] Auth connected to emulator at ${host}:${port}`);
    }

    console.log("[initAuth] Firebase Auth initialized successfully");
    return _auth;
  } catch (error) {
    console.error("[initAuth] Failed to initialize Auth:", error);
    return undefined;
  }
};

/**
 * Firebase Auth Service
 * Provides authentication methods and utilities
 */
export class FirebaseAuthService implements AuthService {
  private auth: Auth | undefined;
  private googleProvider: GoogleAuthProvider;

  constructor() {
    console.log("[AuthService] Initializing FirebaseAuthService");
    this.auth = initAuth();
    console.log("[AuthService] Auth initialized:", !!this.auth);
    this.googleProvider = new GoogleAuthProvider();
    this.googleProvider.setCustomParameters({
      prompt: "select_account",
    });
  }

  /**
   * Check if auth is initialized and ready
   */
  private ensureAuth(): Auth {
    if (!this.auth) {
      throw new Error("Firebase Auth not initialized");
    }
    return this.auth;
  }

  /**
   * Sign in with Google
   */
  async signInWithGoogle(): Promise<UserCredential> {
    try {
      console.log("[AuthService] Starting Google sign-in...");
      const auth = this.ensureAuth();
      console.log("[AuthService] Auth instance:", !!auth);
      const result = await signInWithPopup(auth, this.googleProvider);
      console.log("[AuthService] Google sign-in result:", {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
      });
      return result;
    } catch (error) {
      console.error("[AuthService] Google sign-in error:", error);
      throw handleFirebaseError(error, "Google sign-in failed");
    }
  }

  /**
   * Sign in with email and password
   */
  async signInWithEmail(
    email: string,
    password: string,
  ): Promise<UserCredential> {
    try {
      const auth = this.ensureAuth();
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result;
    } catch (error) {
      throw handleFirebaseError(error, "Email sign-in failed");
    }
  }

  /**
   * Sign up with email and password
   */
  async signUpWithEmail(
    email: string,
    password: string,
  ): Promise<UserCredential> {
    try {
      const auth = this.ensureAuth();
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      return result;
    } catch (error) {
      throw handleFirebaseError(error, "Email sign-up failed");
    }
  }

  /**
   * Link an email/password credential to the currently signed-in user
   */
  async linkEmailCredentialToCurrentUser(
    email: string,
    password: string,
  ): Promise<UserCredential> {
    try {
      const auth = this.ensureAuth();
      const user = auth.currentUser;
      if (!user)
        throw new Error("No user is currently signed in to link credentials");

      const credential = EmailAuthProvider.credential(email, password);
      const result = await linkWithCredential(user, credential);
      return result;
    } catch (error) {
      throw handleFirebaseError(error, "Failed to link email credential");
    }
  }

  /**
   * Link Google provider to the currently signed-in user using a popup
   */
  async linkWithGoogleToCurrentUser(): Promise<UserCredential> {
    try {
      const auth = this.ensureAuth();
      const user = auth.currentUser;
      if (!user)
        throw new Error("No user is currently signed in to link provider");

      const result = await linkWithPopup(user, this.googleProvider);
      return result as UserCredential;
    } catch (error) {
      throw handleFirebaseError(error, "Failed to link Google provider");
    }
  }

  /**
   * Unlink a provider (e.g., 'google.com') from the currently signed-in user
   */
  async unlinkProvider(providerId: string): Promise<void> {
    try {
      const auth = this.ensureAuth();
      const user = auth.currentUser;
      if (!user)
        throw new Error("No user is currently signed in to unlink provider");

      await unlink(user, providerId);
    } catch (error) {
      throw handleFirebaseError(error, "Failed to unlink provider");
    }
  }

  /**
   * Fetch sign-in methods for an email to determine whether the account exists
   */
  async fetchSignInMethodsForEmail(email: string): Promise<string[]> {
    try {
      const auth = this.ensureAuth();
      return await fetchSignInMethodsForEmail(auth, email);
    } catch (error) {
      throw handleFirebaseError(error, "Failed to fetch sign-in methods");
    }
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<void> {
    try {
      const auth = this.ensureAuth();
      await signOut(auth);
    } catch (error) {
      throw handleFirebaseError(error, "Sign-out failed");
    }
  }

  /**
   * Get current authenticated user
   */
  getCurrentUser(): User | null {
    return this.auth?.currentUser || null;
  }

  /**
   * Listen to authentication state changes
   */
  onAuthStateChanged(callback: (_user: User | null) => void): () => void {
    console.log("[AuthService] Setting up onAuthStateChanged listener");
    const auth = this.ensureAuth();
    return onAuthStateChanged(auth, (user) => {
      console.log("[AuthService] onAuthStateChanged triggered:", {
        user: user
          ? {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
            }
          : null,
      });
      callback(user);
    });
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.auth?.currentUser;
  }

  /**
   * Get user token
   */
  async getIdToken(forceRefresh = false): Promise<string | null> {
    const user = this.getCurrentUser();
    if (!user) return null;

    try {
      return await user.getIdToken(forceRefresh);
    } catch (error) {
      throw handleFirebaseError(error, "Failed to get ID token");
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      const auth = this.ensureAuth();
      await firebaseSendPasswordResetEmail(auth, email);
    } catch (error) {
      throw handleFirebaseError(error, "Failed to send password reset email");
    }
  }

  /**
   * Update user profile
   */
  async updateUserProfile(
    displayName?: string,
    photoURL?: string,
  ): Promise<void> {
    const user = this.getCurrentUser();
    if (!user) {
      throw new Error("No user is currently signed in");
    }

    try {
      await updateProfile(user, {
        displayName: displayName || user.displayName,
        photoURL: photoURL || user.photoURL,
      });
    } catch (error) {
      throw handleFirebaseError(error, "Failed to update user profile");
    }
  }

  /**
   * Delete current user account
   */
  async deleteUser(): Promise<void> {
    const user = this.getCurrentUser();
    if (!user) {
      throw new Error("No user is currently signed in");
    }

    try {
      await firebaseDeleteUser(user);
    } catch (error) {
      throw handleFirebaseError(error, "Failed to delete user account");
    }
  }
}

// Export singleton instance
export const authService = new FirebaseAuthService();

/**
 * Get auth instance (for direct Firebase Auth usage)
 */
export const getAuthInstance = (): Auth | undefined => {
  return initAuth();
};
