import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enCommon from "./locales/en/common.json";
import esCommon from "./locales/es/common.json";
import frCommon from "./locales/fr/common.json";
import deCommon from "./locales/de/common.json";

// keep these language keys lowercase and use the same codes everywhere
// (resource keys, changeLanguage values, and localStorage values)
const resources = {
  en: {
    common: enCommon,
  },
  es: {
    common: esCommon,
  },
  fr: {
    common: frCommon,
  },
  de: {
    common: deCommon,
  },
};

if (!i18n.isInitialized) {
  // initialize once on the client so every component using useTranslation()
  // shares the same i18n instance
  i18n.use(initReactI18next).init({
    resources,
    // default language shown on first load.
    lng: "en",
    fallbackLng: "en",
    // we use one namespace file: src/locales/<lang: en, fr, de, es>/common.json
    defaultNS: "common",
    ns: ["common"],
    interpolation: {
      escapeValue: false,
    },
  });
}

export default i18n;