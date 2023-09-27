'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                  ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.createEvent = exports.getCalendarBusy = void 0;
var googleapis_1 = require('googleapis');
var google_auth_library_1 = require('google-auth-library');
var barber_service_constants_1 = require('../constants/barber-service.constants');
/**
 * Retrieves busy time slots from a Google Calendar for a specific date range.
 * @param credentials - The service account credentials used to authenticate with the Google Calendar API.
 * @param minDate - The minimum date of the range to retrieve busy time slots for.
 * @param maxDate - The maximum date of the range to retrieve busy time slots for.
 * @returns An array of busy time slots for the specified date range.
 * @throws An error if the freebusy query fails or if no calendar is found for the specified calendar ID.
 */
function getCalendarBusy(credentials, minDate, maxDate) {
  return __awaiter(this, void 0, void 0, function () {
    var calendar, freebusyResponse, error_1;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          calendar = googleapis_1.google.calendar({
            version: 'v3',
            auth: new google_auth_library_1.JWT({
              email: credentials.client_email,
              key: credentials.private_key,
              scopes: [barber_service_constants_1.SCOPE],
            }),
          });
          _a.label = 1;
        case 1:
          _a.trys.push([1, 3, , 4]);
          return [
            4 /*yield*/,
            calendar.freebusy.query({
              requestBody: {
                items: [
                  { id: barber_service_constants_1.BARBER_SERVICE_CALENDAR_ID },
                ],
                timeMin: minDate.toISOString(),
                timeMax: maxDate.toISOString(),
              },
            }),
          ];
        case 2:
          freebusyResponse = _a.sent();
          return [3 /*break*/, 4];
        case 3:
          error_1 = _a.sent();
          console.error(
            'Failed to get freebusy response for calendarId: '
              .concat(
                barber_service_constants_1.BARBER_SERVICE_CALENDAR_ID,
                ' due to error: ',
              )
              .concat(error_1),
          );
          throw new Error(
            'Failed to get freebusy response for calendarId: '
              .concat(
                barber_service_constants_1.BARBER_SERVICE_CALENDAR_ID,
                ' due to error: ',
              )
              .concat(error_1),
          );
        case 4:
          if (
            !freebusyResponse.data.calendars ||
            !freebusyResponse.data.calendars[
              barber_service_constants_1.BARBER_SERVICE_CALENDAR_ID
            ]
          ) {
            console.error(
              'No calendar found for calendarId: '.concat(
                barber_service_constants_1.BARBER_SERVICE_CALENDAR_ID,
              ),
            );
            throw new Error(
              'No calendar found for calendarId: '.concat(
                barber_service_constants_1.BARBER_SERVICE_CALENDAR_ID,
              ),
            );
          }
          return [
            2 /*return*/,
            freebusyResponse.data.calendars[
              barber_service_constants_1.BARBER_SERVICE_CALENDAR_ID
            ].busy,
          ];
      }
    });
  });
}
exports.getCalendarBusy = getCalendarBusy;
/**
 * Books an appointment on the Barber Service calendar using the provided credentials and event details.
 * @param credentials The service account credentials used to authenticate with the Google Calendar API.
 * @param event The event details to be added to the calendar.
 * @returns The created event data.
 * @throws An error if the event could not be created.
 */
function createEvent(credentials, event) {
  return __awaiter(this, void 0, void 0, function () {
    var calendar, createEventResponse, error_2;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          calendar = googleapis_1.google.calendar({
            version: 'v3',
            auth: new google_auth_library_1.JWT({
              email: credentials.client_email,
              key: credentials.private_key,
              scopes: [barber_service_constants_1.SCOPE],
            }),
          });
          _a.label = 1;
        case 1:
          _a.trys.push([1, 3, , 4]);
          return [
            4 /*yield*/,
            calendar.events.insert({
              calendarId: barber_service_constants_1.BARBER_SERVICE_CALENDAR_ID,
              requestBody: event,
            }),
          ];
        case 2:
          createEventResponse = _a.sent();
          return [3 /*break*/, 4];
        case 3:
          error_2 = _a.sent();
          console.error(
            'Failed to inser event: '
              .concat(event.summary, ' due to error: ')
              .concat(error_2),
          );
          throw new Error(
            'Failed to inser event: '
              .concat(event.summary, ' due to error: ')
              .concat(error_2),
          );
        case 4:
          return [2 /*return*/, createEventResponse.data];
      }
    });
  });
}
exports.createEvent = createEvent;
