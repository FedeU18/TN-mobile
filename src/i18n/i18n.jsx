import enTranslations from './locales/en.json';
import esTranslations from './locales/es.json';

const translations = {
  en: enTranslations,
  es: esTranslations,
};

let currentLanguage = 'es'; 

export const setLanguage = (language) => {
  if (translations[language]) {
    currentLanguage = language;
  }
};

export const getCurrentLanguage = () => currentLanguage;

export const t = (key) => {
  const keys = key.split('.');
  let value = translations[currentLanguage];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key; // retorna la key si no encuentra la traducción
    }
  }
  
  return typeof value === 'string' ? value : key;
};

export const useTranslation = () => {
  return { t };
};