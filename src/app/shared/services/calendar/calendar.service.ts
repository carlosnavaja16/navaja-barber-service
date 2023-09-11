import { Injectable } from '@angular/core';
import {
  Availability,
  AvailableTimeSlotsRequest,
  AvailabilityResponse,
  TimeSlot,
} from '../../types/time-slot';
import {
  Functions,
  httpsCallable,
  HttpsCallable,
} from '@angular/fire/functions';
import { defer, map, Observable } from 'rxjs';
import { DateUtils } from '../../utilities/date.util';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  getAvailabilityFn: HttpsCallable<
    AvailableTimeSlotsRequest,
    AvailabilityResponse
  >;

  constructor(public functions: Functions) {
    this.functions.region = 'us-east1';
    this.getAvailabilityFn = httpsCallable(functions, 'getAvailabilityFn');
  }

  getAvailability(eventDuration: number): Observable<Availability> {
    const availability$ = defer(() =>
      this.getAvailabilityFn({ eventDuration }),
    ).pipe(
      map((result) => result.data),
      map((data: AvailabilityResponse) => {
        const firstAvailableDate = new Date(data.availableTimeSlots[0].start);
        const timeSlotsByDate = new Map<string, TimeSlot[]>();
        data.availableTimeSlots.forEach((timeSlotResponse) => {
          const timeSlot = {
            start: new Date(timeSlotResponse.start),
            end: new Date(timeSlotResponse.end),
          };
          const dateHash = DateUtils.getDateHash(timeSlot.start);
          const timeSlots = timeSlotsByDate.get(dateHash);
          if (timeSlots) {
            timeSlots.push(timeSlot);
          } else {
            timeSlotsByDate.set(dateHash, [timeSlot]);
          }
        });
        const availability = {
          firstAvailableDate,
          openingHourUTC: data.openingHourUTC,
          closingHourUTC: data.closingHourUTC,
          minDate: new Date(data.minDate),
          maxDate: new Date(data.maxDate),
          timeSlotsByDate,
          dateFilter: (date: Date) => {
            return DateUtils.isDateInAvailableDates(date, timeSlotsByDate);
          },
        };
        return availability;
      }),
    );
    return availability$;
  }
}
