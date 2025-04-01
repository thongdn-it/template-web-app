"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components";
import { useI18n } from "@hooks";
import { supportedLngs } from "@utils";

export const LanguageButton = () => {
  const { currentLanguage, changeLanguage } = useI18n();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{currentLanguage}</DropdownMenuTrigger>
      <DropdownMenuContent>
        {supportedLngs.map((language) => (
          <DropdownMenuItem
            key={language}
            onSelect={() => changeLanguage(language)}
          >
            {language}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
