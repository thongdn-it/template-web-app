"use client";

import Image from "next/image";
import Link from "next/link";

import { useI18n } from "@hooks";

export const Footer = () => {
  const { t } = useI18n();

  const repoUrl =
    process.env.NEXT_PUBLIC_REPO_URL ||
    "https://github.com/thongdn-it/template-web-app";
  const license = process.env.NEXT_PUBLIC_LICENSE || "MIT";

  return (
    <footer className="mt-8 border-t py-6">
      <div className="text-muted-foreground container mx-auto flex max-w-7xl flex-col items-center justify-between px-4 text-sm sm:flex-row md:px-6">
        <div>
          <span className="mr-2">
            {t("footer.copyright", {
              year: new Date().getFullYear(),
              appName: t("app.name"),
            })}
          </span>
          <span className="opacity-70">•</span>
          <span className="ml-2">
            {t("footer.license")}: <strong>{license}</strong>
          </span>
        </div>

        <div className="mt-3 sm:mt-0">
          <Link
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center underline"
          >
            <Image
              src="/icons/github.svg"
              alt={t("footer.repo_alt")}
              width={24}
              height={24}
              className="mr-2 inline-block"
              unoptimized
            />
            <span className="sr-only">{t("footer.view_on_github")}</span>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
