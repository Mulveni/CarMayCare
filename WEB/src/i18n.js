import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import translationFI from './locales/translation_fi.json';
import translationEN from './locales/translation_en.json';

const resources = {
    en: {
        translation: translationEN
    },
    fi: {
        translation: translationFI
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: "en",

        keySeparator: false,

        interpolation: {
            escapeValue: false
        }
    });

export default i18n;