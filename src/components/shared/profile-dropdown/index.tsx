"use client";

import { useState } from "react";

import { User } from "firebase/auth";
import { Check, Languages, LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  LoginDialog,
} from "@components";
import { useAuth, useI18n, useMounted } from "@hooks";
import { supportedLngs, type Locale } from "@utils";

const UserAvatar = ({ user }: { user: User }) => {
  const displayName = user.displayName || user.email?.split("@")[0] || "User";
  const photoURL = user.photoURL;

  if (photoURL) {
    return (
      <Image
        src={photoURL}
        alt={displayName}
        width={40}
        height={40}
        className="ring-primary size-10 rounded-full object-cover ring-1"
        unoptimized
      />
    );
  }

  // Default avatar with initials
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="ring-primary flex size-10 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-purple-600 ring-2">
      <span className="text-sm font-bold text-white">{initials}</span>
    </div>
  );
};

export const ProfileDropdown = () => {
  const { t, currentLanguage, changeLanguage } = useI18n();
  const {
    user,
    isAuthenticated,
    signOut,
    loading,
    linkWithGoogleToCurrentUser,
    unlinkProvider,
  } = useAuth();
  const { theme, setTheme } = useTheme();
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [linking, setLinking] = useState(false);
  const [unlinking, setUnlinking] = useState(false);
  const mounted = useMounted();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Show placeholder before mount to match server render
  if (!mounted) {
    return (
      <Button variant="ghost" disabled className="h-10 w-10 rounded-full p-0" />
    );
  }

  // Show loading state
  if (loading) {
    return (
      <Button variant="ghost" disabled className="h-10 w-10 rounded-full p-0">
        <span className="text-xs">...</span>
      </Button>
    );
  }

  // If not authenticated, show Login button
  if (!isAuthenticated || !user) {
    return (
      <>
        <Button onClick={() => setLoginDialogOpen(true)} variant="default">
          {t("login")}
        </Button>
        <LoginDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen} />
      </>
    );
  }

  // If authenticated, show user avatar with dropdown
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="hover:bg-accent relative size-10 rounded-full p-0"
        >
          <UserAvatar user={user} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm leading-none font-medium">
              {user.displayName || "User"}
            </p>
            <p className="text-muted-foreground text-xs leading-none">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Language Selector */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Languages className="mr-2 h-4 w-4" />
            <span>{t("language")}</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {supportedLngs.map((lng: Locale) => (
              <DropdownMenuItem
                key={lng}
                onClick={() => changeLanguage(lng)}
                className={currentLanguage === lng ? "bg-accent" : ""}
              >
                {lng === "en" ? "English" : "Tiếng Việt"}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {/* Theme Toggle */}
        <DropdownMenuItem onClick={toggleTheme}>
          {theme === "dark" ? (
            <>
              <Sun className="mr-2 h-4 w-4" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="mr-2 h-4 w-4" />
              <span>Dark Mode</span>
            </>
          )}
        </DropdownMenuItem>

        {/* Google Link / Unlink (third item) */}
        {user &&
          (() => {
            const hasGoogle = !!user.providerData?.some(
              (p) => p.providerId === "google.com",
            );

            const handleLinkGoogle = async () => {
              try {
                setLinking(true);
                await linkWithGoogleToCurrentUser();
              } catch (err) {
                console.error("Failed to link Google provider:", err);
              } finally {
                setLinking(false);
              }
            };

            const handleUnlinkGoogle = async () => {
              try {
                setUnlinking(true);
                await unlinkProvider("google.com");
              } catch (err) {
                console.error("Failed to unlink Google provider:", err);
              } finally {
                setUnlinking(false);
              }
            };

            return (
              <DropdownMenuItem
                onClick={hasGoogle ? handleUnlinkGoogle : handleLinkGoogle}
                disabled={hasGoogle ? unlinking : linking}
              >
                <div className="flex w-full items-center">
                  <span className="mr-2 inline-flex h-4 w-4 items-center">
                    <Image
                      src="/icons/google.svg"
                      width={16}
                      height={16}
                      className="h-4 w-4"
                      alt="Google"
                      unoptimized
                    />
                  </span>

                  <span className="flex-1 text-sm">
                    {hasGoogle
                      ? unlinking
                        ? "Unlinking Google"
                        : "Unlink Google"
                      : linking
                        ? "Linking Google"
                        : "Link Google"}
                  </span>

                  {hasGoogle && !unlinking ? (
                    <Check className="ml-2 h-4 w-4 text-green-600" />
                  ) : null}
                </div>
              </DropdownMenuItem>
            );
          })()}

        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuItem
          className="text-destructive cursor-pointer"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {t("logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
