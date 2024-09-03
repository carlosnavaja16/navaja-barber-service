export const PORT = 8080;
export const HOST = '0.0.0.0';
export const SCOPE = 'https://www.googleapis.com/auth/calendar';
export const BARBER_SERVICE_CALENDAR_ID =
  'em574fr0cq5l93vdnmo91hjsv0@group.calendar.google.com';
export const BUFFER_HOURS = 2;
export const LIMIT_DAYS = 14;
export const INCREMENT_MINUTES = 60;
export const INCREMENT_MILLISECONDS = INCREMENT_MINUTES * 60 * 1000;
export const OPENING_HOUR_EST = 9; // 09:00 AM EST luxon hours go from 0 - 23
export const CLOSING_HOUR_EST = 20; // 8:00 PM EST
export const DAYS_CLOSED = [7]; //sundays
export const APPOINTMENT_LIST_LIMIT = 25;
export const TIME_ZONE = 'America/New_York';
