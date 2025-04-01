"use client";

import React from "react";

/**
 * Checks if the component is mounted on the client side.
 * This is useful for components that should only render on the client side.
 */
export const ClientPage = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <></>;
  }
  return children;
};
