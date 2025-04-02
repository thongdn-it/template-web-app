"use client";

import { useI18n } from "@hooks";
import { ClientPage, LanguageButton, ThemeButton } from "@components";

export default function Page() {
  const { t } = useI18n();
  return (
    <ClientPage>
      <div className="gap-2 flex">
        <span>{t("change-theme", { ns: "buttons" })}</span>
        <ThemeButton />
      </div>
      <div className="gap-2 flex">
        <span>{t("change-language", { ns: "buttons" })}</span>
        <LanguageButton />
      </div>
    </ClientPage>
  );
}
