import { Injectable } from "@angular/core";
import {
  AvailableSlotsRequest,
  Timeslot,
  TimeslotResponse,
} from "../../types/timeslot";
import {
  Functions,
  httpsCallable,
  HttpsCallable,
  HttpsCallableResult,
} from "@angular/fire/functions";
import { from, map, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CalendarService {
  availableTimeslots: HttpsCallable<AvailableSlotsRequest, TimeslotResponse[]>;

  constructor(public functions: Functions) {
    this.availableTimeslots = httpsCallable(functions, "getAvailableTimeSlots");
  }

  getAvailableTimeslots(
    eventDurationMilliseconds: number,
  ): Observable<Timeslot[]> {
    const requestData = {
      eventDurationMilliseconds,
    };

    const processedAvailableTimeslots$ = from(
      this.availableTimeslots(requestData),
    ).pipe(
      map((availableTimeslotsResponse) => {
        return availableTimeslotsResponse.data.map((timeslotResponse) => {
          return {
            start: new Date(timeslotResponse.start),
            end: new Date(timeslotResponse.end),
          };
        });
      }),
    );
    return processedAvailableTimeslots$;
  }
}
