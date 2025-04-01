"use client";
import "intl-pluralrules";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import intervalPlural from "i18next-intervalplural-postprocessor";

import en from "@assets/locales/en";
import vi from "@assets/locales/vi";

const resources = {
  en,
  vi,
};

export type Namespace = keyof typeof en;
export type Locale = keyof typeof resources;
export const supportedLngs = Object.keys(resources) as Locale[];
export const defaultLng: Locale = "en";
const namespaces = Object.keys(en) as Namespace[];

i18n
  .use(LanguageDetector)
  .use(intervalPlural)
  .use(initReactI18next)
  .init({
    resources,
    supportedLngs,
    fallbackLng: defaultLng,
    ns: namespaces,
    defaultNS: namespaces[0],

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
