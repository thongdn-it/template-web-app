"use client";

import { FirebaseProvider } from "@services";
import { LanguageProvider } from "./LanguageProvider";
import { QueryProvider } from "./QueryProvider";
import { ThemeProvider } from "./ThemeProvider";

export const AppProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <FirebaseProvider>
      <ThemeProvider>
        <LanguageProvider>
          <QueryProvider>{children}</QueryProvider>
        </LanguageProvider>
      </ThemeProvider>
    </FirebaseProvider>
  );
};
