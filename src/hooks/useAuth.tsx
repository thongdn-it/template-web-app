"use client";

import { useEffect, useState } from "react";

import { User } from "firebase/auth";

import { authService } from "@services";

/**
 * Hook to manage Firebase authentication state
 */
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("[useAuth] Setting up auth listener");
    const unsubscribe = authService.onAuthStateChanged((authUser) => {
      console.log("[useAuth] Auth state changed:", {
        user: authUser
          ? {
              uid: authUser.uid,
              email: authUser.email,
              displayName: authUser.displayName,
              photoURL: authUser.photoURL,
            }
          : null,
      });
      setUser(authUser);
      setLoading(false);
    });

    return () => {
      console.log("[useAuth] Cleaning up auth listener");
      unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      console.log("[useAuth] Starting Google sign-in...");
      setError(null);
      setLoading(true);
      const result = await authService.signInWithGoogle();
      console.log("[useAuth] Google sign-in successful:", result.user.email);
    } catch (err) {
      console.error("[useAuth] Google sign-in failed:", err);
      setError(
        err instanceof Error ? err.message : "Failed to sign in with Google",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      await authService.signUpWithEmail(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign up");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const linkEmailCredentialToCurrentUser = async (
    email: string,
    password: string,
  ) => {
    try {
      setError(null);
      setLoading(true);
      return await authService.linkEmailCredentialToCurrentUser(
        email,
        password,
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to link credential",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const linkWithGoogleToCurrentUser = async () => {
    try {
      setError(null);
      setLoading(true);
      return await authService.linkWithGoogleToCurrentUser();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to link with Google",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const unlinkProvider = async (providerId: string) => {
    try {
      setError(null);
      setLoading(true);
      await authService.unlinkProvider(providerId);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to unlink provider",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchSignInMethodsForEmail = async (email: string) => {
    try {
      setError(null);
      setLoading(true);
      return await authService.fetchSignInMethodsForEmail(email);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch sign-in methods",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const sendPasswordResetEmail = async (email: string) => {
    try {
      setError(null);
      setLoading(true);
      await authService.sendPasswordResetEmail(email);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to send password reset",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      await authService.signInWithEmail(email, password);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to sign in with email",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      setLoading(true);
      await authService.signOut();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign out");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    fetchSignInMethodsForEmail,
    sendPasswordResetEmail,
    linkEmailCredentialToCurrentUser,
    linkWithGoogleToCurrentUser,
    unlinkProvider,
    signOut,
  };
};
