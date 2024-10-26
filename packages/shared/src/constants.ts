// server constants
export const TRPC_PORT = 8080;
export const TRPC_ENDPOINT = '/trpc';
export const LOCAL_HOST = 'http://localhost';

// regex
export const CITY_REGEX = /[a-zA-Z]{2,}/;
export const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
export const PHONE_REGEX = /[0-9]{10}/;
export const STATE_REGEX = /[A-Z]{2}/;
export const ZIP_CODE_REGEX = /[0-9]{5}/;

// error messages
export const USER_NOT_LOGGED_IN = 'User not logged in';
export const EMAIL_INVALID = 'Please enter a valid email';
export const EMAIL_EMPTY = 'Email is required';
export const PASSWORD_INVALID = 'Password must be at least 6 characters';
export const PASSWORD_EMPTY = 'Password is required';

// time constants
export const MORNING = 'morning';
export const AFTERNOON = 'afternoon';
export const EVENING = 'evening';
