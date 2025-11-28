import { Locale as DateLocale, setDefaultOptions } from "date-fns";
import { enUS, vi } from "date-fns/locale";

import { Locale } from "./i18n";

const locales: { [key: string]: DateLocale } = {
  en: enUS,
  vi,
};

export const setDateLocale = (locale: Locale) => {
  setDefaultOptions({
    locale: locales[locale],
  });
};
