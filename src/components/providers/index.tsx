"use client";

import { FirebaseProvider } from "@services";
import { DirectionProvider } from "../ui/direction";
import { LanguageProvider } from "./LanguageProvider";
import { QueryProvider } from "./QueryProvider";
import { ThemeProvider } from "./ThemeProvider";

export const AppProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <DirectionProvider>
      <ThemeProvider>
        <LanguageProvider>
          <FirebaseProvider>
            <QueryProvider>{children}</QueryProvider>
          </FirebaseProvider>
        </LanguageProvider>
      </ThemeProvider>
    </DirectionProvider>
  );
};
