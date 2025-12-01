"use client";

import React from "react";

import { useMounted } from "@hooks";

/**
 * Checks if the component is mounted on the client side.
 * This is useful for components that should only render on the client side.
 */
export const ClientPage = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const mounted = useMounted();

  return (
    <div suppressHydrationWarning>
      {mounted ? children : <div className="min-h-screen" />}
    </div>
  );
};
