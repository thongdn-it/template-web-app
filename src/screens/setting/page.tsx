"use client";

import { ClientPage, LanguageButton, ThemeButton } from "@components";
import { useI18n } from "@hooks";

export default function Page() {
  const { t } = useI18n();
  return (
    <ClientPage>
      <div className="flex gap-2">
        <span>{t("change-theme", { ns: "buttons" })}</span>
        <ThemeButton />
      </div>
      <div className="flex gap-2">
        <span>{t("change-language", { ns: "buttons" })}</span>
        <LanguageButton />
      </div>
    </ClientPage>
  );
}
