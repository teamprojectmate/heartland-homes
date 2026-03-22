import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enAccommodations from './locales/en/accommodations.json';
import enAdmin from './locales/en/admin.json';
import enApiErrors from './locales/en/apiErrors.json';
import enAuth from './locales/en/auth.json';
import enBooking from './locales/en/booking.json';
import enCommon from './locales/en/common.json';
import enInfo from './locales/en/info.json';
import enPayment from './locales/en/payment.json';
import ukAccommodations from './locales/uk/accommodations.json';
import ukAdmin from './locales/uk/admin.json';
import ukApiErrors from './locales/uk/apiErrors.json';
import ukAuth from './locales/uk/auth.json';
import ukBooking from './locales/uk/booking.json';
import ukCommon from './locales/uk/common.json';
import ukInfo from './locales/uk/info.json';
import ukPayment from './locales/uk/payment.json';

const savedLang = localStorage.getItem('language') || 'en';

i18n.use(initReactI18next).init({
	resources: {
		en: {
			translation: {
				...enCommon,
				...enAuth,
				...enAccommodations,
				...enBooking,
				...enPayment,
				...enAdmin,
				...enInfo,
				...enApiErrors,
			},
		},
		uk: {
			translation: {
				...ukCommon,
				...ukAuth,
				...ukAccommodations,
				...ukBooking,
				...ukPayment,
				...ukAdmin,
				...ukInfo,
				...ukApiErrors,
			},
		},
	},
	lng: savedLang,
	fallbackLng: 'en',
	interpolation: {
		escapeValue: false,
	},
});

export default i18n;
