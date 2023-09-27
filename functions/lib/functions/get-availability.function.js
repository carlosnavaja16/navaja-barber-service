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
exports.getAvailability = void 0;
var barber_service_constants_1 = require('../constants/barber-service.constants');
var google_calendar_util_1 = require('../utilities/google-calendar.util');
var date_util_1 = require('../utilities/date.util');
/**
 * Retrieves availability for a barber service based on the provided event duration and calendar busy times.
 * @param credentials - The service account credentials used to authenticate with the Google Calendar API.
 * @param eventDuration - The duration of the barber service event in milliseconds.
 * @returns an Availability object.
 */
function getAvailability(credentials, eventDuration) {
  return __awaiter(this, void 0, void 0, function () {
    var openingHourUTC,
      closingHourUTC,
      minDate,
      maxDate,
      allTimeSlots,
      busyTimes,
      error_1,
      busyTimeSlots,
      availableTimeSlots;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          openingHourUTC = date_util_1.DateUtils.getOpeningHourUtc();
          closingHourUTC = date_util_1.DateUtils.getClosingHourUtc();
          minDate = date_util_1.DateUtils.getMinDate();
          maxDate = date_util_1.DateUtils.getMaxDate();
          allTimeSlots = date_util_1.DateUtils.getAllTimeSlots(
            eventDuration,
            minDate,
            maxDate,
          );
          _a.label = 1;
        case 1:
          _a.trys.push([1, 3, , 4]);
          return [
            4 /*yield*/,
            (0, google_calendar_util_1.getCalendarBusy)(
              credentials,
              minDate,
              maxDate,
            ),
          ];
        case 2:
          busyTimes = _a.sent();
          return [3 /*break*/, 4];
        case 3:
          error_1 = _a.sent();
          console.error(
            'Failed to get calendar busy times for calendarId: '
              .concat(
                barber_service_constants_1.BARBER_SERVICE_CALENDAR_ID,
                ' due to error: ',
              )
              .concat(error_1),
          );
          throw new Error(
            'Failed to get calendar busy times for calendarId: '
              .concat(
                barber_service_constants_1.BARBER_SERVICE_CALENDAR_ID,
                ' due to error: ',
              )
              .concat(error_1),
          );
        case 4:
          busyTimeSlots = busyTimes
            .filter(function (busyTime) {
              return busyTime.start && busyTime.end;
            })
            .map(function (busyTime) {
              return {
                start: new Date(busyTime.start),
                end: new Date(busyTime.end),
              };
            });
          availableTimeSlots = allTimeSlots
            .filter(function (timeSlot) {
              return !busyTimeSlots.some(function (busyTimeSlot) {
                return (
                  timeSlot.start === busyTimeSlot.start ||
                  timeSlot.end === busyTimeSlot.end ||
                  (timeSlot.start >= busyTimeSlot.start &&
                    timeSlot.start < busyTimeSlot.end) ||
                  (timeSlot.end > busyTimeSlot.start &&
                    timeSlot.end <= busyTimeSlot.end)
                );
              });
            })
            .map(function (timeSlot) {
              return {
                start: timeSlot.start.toISOString(),
                end: timeSlot.end.toISOString(),
              };
            });
          return [
            2 /*return*/,
            {
              openingHourUTC: openingHourUTC,
              closingHourUTC: closingHourUTC,
              minDate: minDate.toISOString(),
              maxDate: maxDate.toISOString(),
              availableTimeSlots: availableTimeSlots,
            },
          ];
      }
    });
  });
}
exports.getAvailability = getAvailability;
