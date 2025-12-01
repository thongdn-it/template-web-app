"use client";

import { useState } from "react";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@components";
import { useAuth, useI18n } from "@hooks";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (_open: boolean) => void;
}

export const LoginDialog = ({ open, onOpenChange }: LoginDialogProps) => {
  const { t } = useI18n();
  const {
    signInWithEmail,
    signInWithGoogle,
    signUpWithEmail,
    fetchSignInMethodsForEmail,
    sendPasswordResetEmail,
    linkEmailCredentialToCurrentUser,
  } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"email" | "password">("email");
  const [isNewUser, setIsNewUser] = useState<boolean | null>(null);
  const [resolvedEmail, setResolvedEmail] = useState<string | null>(null);
  const [providerMethods, setProviderMethods] = useState<string[] | null>(null);
  const [resetSent, setResetSent] = useState(false);
  const [attemptedPassword, setAttemptedPassword] = useState<string | null>(
    null,
  );
  const [awaitingLinkWithGoogle, setAwaitingLinkWithGoogle] = useState(false);

  const form = useForm<{ email: string; password: string }>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onPasswordSubmit = async (values: {
    email: string;
    password: string;
  }) => {
    try {
      setIsLoading(true);
      setError(null);

      // Re-check provider methods before attempting signup to avoid race where
      // an account already exists with a provider (e.g., Google).
      if (isNewUser) {
        try {
          const methods = await fetchSignInMethodsForEmail(values.email);
          if (methods && methods.length > 0 && !methods.includes("password")) {
            // Account exists but without password provider — show provider flow
            setProviderMethods(methods);
            // If Google is a provider, ask the user to continue with Google to link accounts
            if (methods.includes("google.com")) {
              setAttemptedPassword(values.password ?? null);
              setAwaitingLinkWithGoogle(true);
              setIsLoading(false);
              // set a friendly instruction
              setError(t("continue_with_google_to_link"));
              return;
            }

            // otherwise just switch to provider flow and show message
            setIsNewUser(false);
            setError(t("email_in_use"));
            setIsLoading(false);
            return;
          }
        } catch {
          // ignore fetch error and proceed to attempt signup
        }

        await signUpWithEmail(values.email, values.password);
      } else {
        await signInWithEmail(values.email, values.password);
      }

      onOpenChange(false);
      form.reset();
      setStep("email");
      setIsNewUser(null);
      setResolvedEmail(null);
      setProviderMethods(null);
      setResetSent(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : t("authentication_failed");

      // If signup failed because email already exists, switch to sign-in flow
      if (
        isNewUser &&
        typeof message === "string" &&
        (message.includes("already in use") ||
          message.includes("email-already-in-use"))
      ) {
        // store attempted password so we can link after provider sign-in
        setAttemptedPassword(values.password ?? null);
        // refresh provider methods to detect provider-only accounts
        try {
          const methods = await fetchSignInMethodsForEmail(values.email);
          setProviderMethods(methods || null);
        } catch {
          // ignore; we'll still switch to sign-in flow below
        }
        setIsNewUser(false);
        form.setValue("password", "");
        setError(t("email_in_use"));
      } else {
        setError(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onEmailCheck = async (email: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setResetSent(false);

      // validate email locally
      const emailSchema = z.email({ message: t("invalid_email") });
      emailSchema.parse(email);

      const methods = await fetchSignInMethodsForEmail(email);
      const noMethods = !methods || methods.length === 0;
      setProviderMethods(methods || null);
      setIsNewUser(noMethods);
      setResolvedEmail(email);
      setStep("password");
    } catch (err) {
      // If validation failed from zod, extract the first issue message to show a friendly error
      if (err && typeof err === "object" && "issues" in err) {
        // z.ZodError shape
        const zErr = err as z.ZodError;
        const first =
          zErr.issues && zErr.issues[0]
            ? zErr.issues[0].message
            : t("invalid_email");
        setError(first);
      } else {
        setError(err instanceof Error ? err.message : t("failed_check_email"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendReset = async () => {
    if (!resolvedEmail) return;
    try {
      setIsLoading(true);
      setError(null);
      await sendPasswordResetEmail(resolvedEmail);
      setResetSent(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("failed_send_reset_email"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setError(null);
    setStep("email");
    form.setValue("password", "");
    if (resolvedEmail) form.setValue("email", resolvedEmail);
    setIsNewUser(null);
    setResetSent(false);
    setProviderMethods(null);
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signInWithGoogle();

      // If user previously attempted to sign up with email/password, try to link credentials
      if (attemptedPassword && resolvedEmail) {
        try {
          await linkEmailCredentialToCurrentUser(
            resolvedEmail,
            attemptedPassword,
          );
          // linking succeeded — close dialog
          onOpenChange(false);
          form.reset();
          setAttemptedPassword(null);
          return;
        } catch (linkErr) {
          // show link error but keep user signed in (they are signed in by provider)
          setError(
            linkErr instanceof Error ? linkErr.message : String(linkErr),
          );
          setAttemptedPassword(null);
          return;
        }
      }

      onOpenChange(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("failed_sign_in_with_google"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkWithGoogle = async () => {
    if (!attemptedPassword || !resolvedEmail) return;
    try {
      setIsLoading(true);
      setError(null);
      // Sign in with Google
      await signInWithGoogle();
      // Link the attempted email/password to the signed-in Google account
      await linkEmailCredentialToCurrentUser(resolvedEmail, attemptedPassword);

      // success
      onOpenChange(false);
      form.reset();
      setAttemptedPassword(null);
      setAwaitingLinkWithGoogle(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  const titleText =
    step === "password"
      ? isNewUser
        ? t("create_account")
        : t("welcome_back")
      : t("welcome_back");

  const descriptionText =
    step === "password"
      ? isNewUser
        ? t("create_account_for")
        : t("sign_in_to_continue")
      : t("sign_in_to_continue");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{titleText}</DialogTitle>
          <DialogDescription>{descriptionText}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Form {...form}>
            <form
              onSubmit={
                step === "email"
                  ? (e) => {
                      e.preventDefault();
                      const email = form.getValues("email");
                      onEmailCheck(email);
                    }
                  : form.handleSubmit(onPasswordSubmit)
              }
              className="space-y-4"
            >
              {step === "email" ? (
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("email")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("email_placeholder")}
                          type="email"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <>
                  <div className="space-y-1">
                    <div className="text-muted-foreground text-sm">
                      {t(isNewUser ? "create_account_for" : "sign_in_to")}{" "}
                      <strong>{resolvedEmail}</strong>
                    </div>
                  </div>

                  {/* If providerMethods exists and doesn't include password, prompt provider sign-in */}
                  {providerMethods &&
                  providerMethods.length > 0 &&
                  !providerMethods.includes("password") ? (
                    <div className="space-y-3">
                      <div className="text-muted-foreground text-sm">
                        {providerMethods.includes("google.com")
                          ? t("use_google_to_signin")
                          : t("use_provider_to_signin")}
                      </div>

                      {/* Show Google sign-in option when google is present */}
                      {providerMethods.includes("google.com") && (
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={handleGoogleSignIn}
                          disabled={isLoading}
                        >
                          {t("sign_in_with_google")}
                        </Button>
                      )}
                    </div>
                  ) : (
                    <>
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("password")}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t("password_placeholder")}
                                type="password"
                                disabled={isLoading}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          {isNewUser === false && (
                            <button
                              type="button"
                              className="text-sm underline"
                              onClick={handleSendReset}
                              disabled={isLoading || !resolvedEmail}
                            >
                              {t("forgot_password")}
                            </button>
                          )}
                        </div>
                        {resetSent && (
                          <div className="text-success text-sm">
                            {t("reset_sent")}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </>
              )}
              {/* If we previously stored a password attempt, show explicit link CTA */}
              {providerMethods &&
              providerMethods.includes("google.com") &&
              awaitingLinkWithGoogle &&
              attemptedPassword ? (
                <div className="space-y-2">
                  <div className="text-muted-foreground text-sm">
                    {t("continue_with_google_to_link")}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleLinkWithGoogle}
                    disabled={isLoading}
                  >
                    {t("sign_in_with_google")}
                  </Button>
                </div>
              ) : (
                providerMethods &&
                providerMethods.includes("google.com") && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                  >
                    {t("sign_in_with_google")}
                  </Button>
                )
              )}

              {step === "password" && (
                <div className="flex justify-start">
                  <button
                    type="button"
                    className="text-sm underline"
                    onClick={handleBack}
                    disabled={isLoading}
                  >
                    {t("back")}
                  </button>
                </div>
              )}

              {error && <div className="text-destructive text-sm">{error}</div>}

              {awaitingLinkWithGoogle ? (
                <Button
                  type="button"
                  className="w-full"
                  onClick={handleLinkWithGoogle}
                  disabled={isLoading}
                >
                  {isLoading ? t("loading") : t("link_with_google")}
                </Button>
              ) : (
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading
                    ? t("loading")
                    : step === "email"
                      ? t("continue")
                      : isNewUser
                        ? t("create_account")
                        : t("sign_in")}
                </Button>
              )}
            </form>
          </Form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background text-muted-foreground px-2">
                {t("or_continue_with")}
              </span>
            </div>
          </div>

          {/* Google Sign In Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <Image
              src="/icons/google.svg"
              width={16}
              height={16}
              className="mr-2 h-4 w-4"
              alt="Google"
              unoptimized
            />
            {t("sign_in_with_google")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
