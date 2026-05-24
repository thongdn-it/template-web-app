"use client";

import { useState } from "react";

import { useI18n } from "@hooks";
import { ClientPage } from "@src/components/shared/client-page";
import { useHomePageController } from "./controller";
import { ColorItemView } from "./views/color-item-view";

export default function HomePage() {
  const { data, isLoading, query, setQuery } = useHomePageController();
  const [copied, setCopied] = useState<number | string | null>(null);

  const handleCopy = async (colorHex: string) => {
    try {
      console.log("Copying to clipboard:", colorHex);
      await navigator.clipboard.writeText(colorHex);
      setCopied(colorHex);
      setTimeout(() => setCopied(null), 1500);
    } catch (e) {
      console.error("Failed to copy to clipboard:", e);
    }
  };
  const { t } = useI18n();

  return (
    <ClientPage>
      <div className="mx-auto max-w-7xl space-y-8 px-4 md:px-6">
        <div className="flex flex-col items-start justify-stretch gap-2 py-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold tracking-tight">{t("Hello")}</h1>
            <p className="text-muted-foreground text-lg">
              {t("explore_palette")}
            </p>
          </div>

          <div className="flex w-full flex-1 lg:justify-end">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("search_placeholder")}
              className="w-full max-w-lg rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm"
            />
          </div>
        </div>
        {isLoading ? (
          <div className="flex h-96 items-center justify-center">
            <div className="space-y-3 text-center">
              <div className="border-primary mx-auto h-10 w-10 animate-spin rounded-full border-4 border-t-transparent" />
              <p className="text-muted-foreground">{t("loading_colors")}</p>
            </div>
          </div>
        ) : data && data.length > 0 ? (
          <div className="grid grid-cols-4 gap-3 md:grid-cols-6 lg:grid-cols-8">
            {data.map((color) => (
              <ColorItemView
                key={color.id}
                color={color}
                onPress={() => handleCopy(color.hex)}
                isCopied={copied === color.hex}
              />
            ))}
          </div>
        ) : (
          <div className="border-muted flex h-96 items-center justify-center rounded-lg border-2 border-dashed">
            <p className="text-muted-foreground text-lg">{t("no_colors")}</p>
          </div>
        )}
      </div>
    </ClientPage>
  );
}
