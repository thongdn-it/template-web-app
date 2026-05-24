"use client";

import { useState } from "react";

import { User } from "firebase/auth";
import { Check, Languages, LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";

import { useAuth, useI18n, useIsMounted } from "@hooks";
import { Button } from "@src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@src/components/ui/dropdown-menu";
import { supportedLngs, type Locale } from "@utils";
import { LoginDialog } from "../login-dialog";

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
        className="size-full rounded-full object-cover"
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
    <div className="flex size-full items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-purple-600 ring-2">
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
  const mounted = useIsMounted();

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
    return null;
  }

  // Show loading state
  if (loading) {
    return (
      <Button variant="ghost" disabled className="size-10 rounded-full p-0">
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
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon-lg" />}>
        <UserAvatar user={user} />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end">
        {/* User info */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col gap-1">
              <p className="text-foreground text-sm leading-none font-medium">
                {user.displayName || "User"}
              </p>
              <p className="text-muted-foreground text-xs leading-none">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Language */}
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Languages />
              <span>{t("language")}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuGroup>
                {supportedLngs.map((lng: Locale) => (
                  <DropdownMenuCheckboxItem
                    key={lng}
                    checked={currentLanguage === lng}
                    onCheckedChange={() => changeLanguage(lng)}
                  >
                    {lng === "en" ? "English" : "Tiếng Việt"}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>

        {/* Theme */}
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={toggleTheme}>
            {theme === "dark" ? <Sun /> : <Moon />}
            <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        {/* Google link / unlink */}
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={hasGoogle ? handleUnlinkGoogle : handleLinkGoogle}
            disabled={hasGoogle ? unlinking : linking}
          >
            <Image
              src="/icons/google.svg"
              width={16}
              height={16}
              alt="Google"
              unoptimized
            />
            <span>
              {hasGoogle
                ? unlinking
                  ? "Unlinking Google"
                  : "Unlink Google"
                : linking
                  ? "Linking Google"
                  : "Link Google"}
            </span>
            {hasGoogle && !unlinking && (
              <Check className="ms-auto text-green-600" />
            )}
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
            <LogOut />
            {t("logout")}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
