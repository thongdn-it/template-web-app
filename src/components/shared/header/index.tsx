"use client";

import { ProfileDropdown } from "../profile-dropdown";

export const Header = () => {
  return (
    <header className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <div className="flex flex-1 items-center">
          <h1 className="text-xl font-bold tracking-tight">Template Web App</h1>
        </div>

        {/* Profile */}
        <div className="flex flex-1 items-center justify-end gap-4">
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
};
