import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { initI18n, changeLanguage, supportedLanguages, LanguageCode } from '@/lib/i18n';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => Promise<void>;
  isLoading: boolean;
  supportedLanguages: typeof supportedLanguages;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { i18n } = useTranslation();

  useEffect(() => {
    const init = async () => {
      await initI18n();
      setIsInitialized(true);
    };
    init();
  }, []);

  const setLanguage = useCallback(async (code: LanguageCode) => {
    setIsLoading(true);
    try {
      await changeLanguage(code);
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (!isInitialized) {
    return null; // Or a loading spinner
  }

  return (
    <LanguageContext.Provider
      value={{
        language: i18n.language as LanguageCode,
        setLanguage,
        isLoading,
        supportedLanguages,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
