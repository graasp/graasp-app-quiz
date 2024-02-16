import i18n from 'i18next';

import { initReactI18next } from 'react-i18next';

import ar from '../langs/ar.json';
import de from '../langs/de.json';
import en from '../langs/en.json';
import es from '../langs/es.json';
import fr from '../langs/fr.json';
import it from '../langs/it.json';

const QUIZ_NAMESPACE = 'quiz';

i18n.use(initReactI18next).init({
  resources: {
    en,
    fr,
  },
  fallbackLng: 'en',
  // debug only when not in production
  debug: process.env.NODE_ENV !== 'production',
  defaultNS: QUIZ_NAMESPACE,
  keySeparator: false,
  interpolation: {
    escapeValue: false,
    formatSeparator: ',',
  },
  returnNull: false,
});

i18n.addResourceBundle('ar', QUIZ_NAMESPACE, ar);
i18n.addResourceBundle('de', QUIZ_NAMESPACE, de);
i18n.addResourceBundle('en', QUIZ_NAMESPACE, en);
i18n.addResourceBundle('es', QUIZ_NAMESPACE, es);
i18n.addResourceBundle('fr', QUIZ_NAMESPACE, fr);
i18n.addResourceBundle('it', QUIZ_NAMESPACE, it);

export default i18n;
