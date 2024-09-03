import { router } from 'expo-router';

export const HOME = '/';
export const SIGN_UP = '/sign-up';
export const LOGIN = '/logn';

export const replaceRoute = (route: string) => router.replace(route);
export const pushRoute = (route: string) => router.push(route);
