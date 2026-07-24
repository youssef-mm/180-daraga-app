import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager } from 'react-native';

// النصوص باللغتين
const resources = {
  en: {
    translation: {
      // General & Top Bar
      appTitle: 'General Assembly',
      attendancePortal: 'Attendance Portal',
      login: 'Highboard Login',
      logout: 'Logout',
      upcomingMeetings: 'Upcoming Meetings',
      tapToConfirm: 'Tap a meeting to confirm your attendance',
      addMeeting: '+ Add Meeting',
      viewResponses: 'View Responses',
      back: 'Back to meetings',

      // Login Screen
      highboardPortal: 'HIGHBOARD PORTAL',
      email: 'Email',
      password: 'Password',
      signIn: 'Login',
      signingIn: 'Signing in...',

      // Add Meeting Screen
      newMeeting: 'New General Meeting',
      meetingTitle: 'Meeting Title',
      date: 'Date',
      time: 'Time',
      deadline: 'Confirmation Deadline',
      createMeeting: 'Create Meeting',
      creating: 'Creating...',
      done: 'Done',

      // Language Switcher
      changeLanguage: 'تغيير للغة العربية',
    },
  },
  ar: {
    translation: {
      // General & Top Bar
      appTitle: 'الجمعية العمومية',
      attendancePortal: 'بوابة تسجيل الحضور',
      login: 'تسجيل دخول الهيورد',
      logout: 'تسجيل الخروج',
      upcomingMeetings: 'الاجتماعات القادمة',
      tapToConfirm: 'اضغط على الاجتماع لتأكيد حضورك',
      addMeeting: '+ إضافة اجتماع',
      viewResponses: 'عرض الاستجابات',
      back: 'الرجوع للاجتماعات',

      // Login Screen
      highboardPortal: 'بوابة الـ HIGHBOARD',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      signIn: 'تسجيل الدخول',
      signingIn: 'جاري الدخول...',

      // Add Meeting Screen
      newMeeting: 'اجتماع عام جديد',
      meetingTitle: 'عنوان الاجتماع',
      date: 'التاريخ',
      time: 'الوقت',
      deadline: 'آخر موعد للتأكيد',
      createMeeting: 'إنشاء الاجتماع',
      creating: 'جاري الإنشاء...',
      done: 'تم',

      // Language Switcher
      changeLanguage: 'Switch to English',
    },
  },
};

const LANGUAGE_KEY = 'user_language';

// تهيئة i18n
i18n.use(initReactI18next).init({
  resources,
  lng: 'en', // اللغة الافتراضية
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

// دالة لتغيير اللغة وتحفيظها
export const changeAppLanguage = async (lang) => {
  try {
    await i18n.changeLanguage(lang);
    await AsyncStorage.setItem(LANGUAGE_KEY, lang);
  } catch (e) {
    console.log('Language change error:', e);
  }
};

// تحميل اللغة المحفوظة عند فتح التطبيق
export const loadSavedLanguage = async () => {
  try {
    const savedLang = await AsyncStorage.getItem(LANGUAGE_KEY);
    if (savedLang) {
      await i18n.changeLanguage(savedLang);
    }
  } catch (e) {
    console.log('Error loading language:', e);
  }
};

export default i18n;