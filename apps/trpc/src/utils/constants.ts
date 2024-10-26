import { getReasonPhrase } from 'http-status-codes';
import { TRPC_PORT } from '@navaja/shared';
// server constants
export const HOST = '0.0.0.0';

// google calendar constants
export const SCOPE = 'https://www.googleapis.com/auth/calendar';
export const BARBER_SERVICE_CALENDAR_ID =
  'em574fr0cq5l93vdnmo91hjsv0@group.calendar.google.com';

// time constants
export const BUFFER_HOURS = 2;
export const LIMIT_DAYS = 14;
export const INCREMENT_MINUTES = 60;
export const INCREMENT_MILLISECONDS = INCREMENT_MINUTES * 60 * 1000;
export const OPENING_HOUR_EST = 9; // 09:00 AM EST luxon hours go from 0 - 23
export const CLOSING_HOUR_EST = 20; // 8:00 PM EST
export const DAYS_CLOSED = [7]; //sundays
export const TIME_ZONE = 'America/New_York';

// firestore constants
export const APPOINTMENT_LIST_LIMIT = 25;
export const APPOINTMENT_COLLECTION = 'Appointments';
export const SERVICE_COLLECTION = 'Services';
export const USER_ID_FIELD = 'userId';
export const CANCELLED_FIELD = 'cancelled';
export const PRICE_FIELD = 'price';
export const START_FIELD = 'start';
export const DESCENDING_ORDER = 'desc';
export const ASCENDING_ORDER = 'asc';

// trpc constants
export const TRPC_RUNNING = `💈 Barber tRPC server listening on port ${TRPC_PORT}`;

// error messages
export const CALENDAR_NOT_FOUND = (calendarId: string) =>
  `No calendar found with calendarId: ${calendarId}`;
export const EVENT_INSERTION_FAILED = (status: number) =>
  `Inserting event failed with status code ${status}:  ${getReasonPhrase(status)}`;
export const EVENT_DELETION_FAILED = (status: number) =>
  `Deleting event failed with status code ${status}:  ${getReasonPhrase(status)}`;
