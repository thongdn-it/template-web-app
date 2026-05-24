"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@src/components/lib/utils";

import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { useIsMounted } from "@src/hooks";

export const ThemeButton = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const isMounted = useIsMounted();

  if (!isMounted) {
    return null;
  }

  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
      )}
      checked={resolvedTheme === "dark"}
      onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0",
        )}
      >
        {resolvedTheme == "dark" ? (
          <Moon className="size-full p-0.5" />
        ) : (
          <Sun className="size-full p-0.5" />
        )}
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  );
};
