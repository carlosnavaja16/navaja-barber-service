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
} from "@angular/fire/functions";
import { from, map, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CalendarService {
  availableTimeslots: HttpsCallable<AvailableSlotsRequest, TimeslotResponse[]>;

  constructor(public functions: Functions) {
    this.functions.region = "us-east1";
    this.availableTimeslots = httpsCallable(functions, "getAvailableTimeSlots");
  }

  getAvailableTimeslots(
    eventDurationMilliseconds: number,
  ): Observable<Timeslot[]> {
    const processedAvailableTimeslots$ = from(
      this.availableTimeslots({ eventDurationMilliseconds }),
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
