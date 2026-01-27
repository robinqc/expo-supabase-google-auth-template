import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './locales/en.json';
import es from './locales/es.json';

const LANGUAGE_KEY = 'user-language';

export const resources = {
  en: { translation: en },
  es: { translation: es },
} as const;

export const supportedLanguages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Espanol' },
] as const;

export type LanguageCode = (typeof supportedLanguages)[number]['code'];

const getDeviceLanguage = (): LanguageCode => {
  const deviceLocale = Localization.getLocales()[0]?.languageCode ?? 'en';
  // Check if the device language is supported, otherwise default to English
  const isSupported = supportedLanguages.some((lang) => lang.code === deviceLocale);
  return isSupported ? (deviceLocale as LanguageCode) : 'en';
};

export const initI18n = async () => {
  // Try to get saved language preference
  let savedLanguage: string | null = null;
  try {
    savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
  } catch (error) {
    console.warn('Failed to load saved language:', error);
  }

  const initialLanguage = savedLanguage || getDeviceLanguage();

  await i18n.use(initReactI18next).init({
    resources,
    lng: initialLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

  return i18n;
};

export const changeLanguage = async (languageCode: LanguageCode) => {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, languageCode);
    await i18n.changeLanguage(languageCode);
  } catch (error) {
    console.warn('Failed to save language preference:', error);
  }
};

export const getCurrentLanguage = (): LanguageCode => {
  return i18n.language as LanguageCode;
};

export default i18n;
