import { router } from 'expo-router';

export const HOME = '';
export const LOGIN = 'login';
export const SIGN_UP = 'sign-up';
export const APPOINTMENTS = 'appointments';

export const goToHome = () => router.replace(HOME);
export const goToLogin = () => router.push(LOGIN);
export const goToSignUp = () => router.push(SIGN_UP);
export const goToAppointments = () => router.push(APPOINTMENTS);
