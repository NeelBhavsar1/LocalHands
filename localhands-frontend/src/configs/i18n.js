/**
 * Internationalization (i18n) Configuration
 * 
 * This file configures multi-language support for the LocalHands platform
 * using react-i18next for React components and i18next for core functionality.
 * 
 * @author LocalHands Frontend Team
 * @version 1.0.0
 * @since 2026-04-13
 */

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import language-specific translation files
import enCommon from "./locales/en/common.json";
import esCommon from "./locales/es/common.json";
import frCommon from "./locales/fr/common.json";
import deCommon from "./locales/de/common.json";

/**
 * Resource object containing all supported languages and their translation files
 * 
 * Structure: { languageCode: { namespace: translationObject } }
 * 
 * @type {Object}
 */
const resources = {
  en: {
    common: enCommon,  // English translations
  },
  es: {
    common: esCommon,  // Spanish translations
  },
  fr: {
    common: frCommon,  // French translations
  },
  de: {
    common: deCommon,  // German translations
  },
};

/**
 * Initialize i18n configuration if not already initialized
 * 
 * This prevents re-initialization during hot module replacement
 * and ensures single i18n instance across the application
 */
if (!i18n.isInitialized) {
  /**
   * Initialize react-i18next with configuration
   * 
   * @param {Object} options - Configuration options
   * @param {Object} options.resources - Translation resources object
   * @param {string} options.lng - Default language (English)
   * @param {string} options.fallbackLng - Fallback language if translation missing
   */
  i18n.use(initReactI18next).init({
    resources,           // All translation resources
    lng: "en",          // Default language: English
    fallbackLng: "en",   // Fallback to English if translation missing
    defaultNS: "common",    // Default namespace for translations
    ns: ["common"],          // Available namespaces
    interpolation: {
      escapeValue: false,    // Allow HTML in translations
    },
  })
}

/**
 * Export configured i18n instance for use throughout application
 * 
 * @type {import('i18next').i18n}
 */
export default i18n;