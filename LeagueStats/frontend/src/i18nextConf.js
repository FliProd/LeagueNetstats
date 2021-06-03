import i18n from 'i18next'
import {initReactI18next} from 'react-i18next'
import Backend from 'i18next-xhr-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import translationEN from '../../static/translations/en.json'
import translationDE from '../../static/translations/de.json'


const resources = {
    en: {
        translation: translationEN
    },
    de: {
        translation: translationDE
    }
}
const availableLanguages = ['en', 'de']

i18n
    .use(Backend) // load translations using http (default                                               public/assets/locals/en/translations)
    .use(LanguageDetector) // detect user language
    .use(initReactI18next) // pass the i18n instance to react-i18next.
    .init({
        resources,
        lng: localStorage.getItem('i18nextLng') ||'en', // fallback language is english.
        fallbackLng: 'en',


        detection: {
            checkWhitelist: true, // options for language detection
        },

        debug: false,
        react: {
            useSuspense: false
        },

        whitelist: availableLanguages,

        interpolation: {
            escapeValue: false, // no need for react. it escapes by default
        },

        keySeparator: 'false'
    })

export default i18n