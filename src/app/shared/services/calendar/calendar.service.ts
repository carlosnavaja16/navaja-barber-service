import { Injectable } from "@angular/core";
import {
  AvailableTimeSlotsRequest,
  TimeSlot,
  TimeSlotResponse,
} from "../../types/time-slot";
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
  availableTimeSlotsFunc: HttpsCallable<
    AvailableTimeSlotsRequest,
    TimeSlotResponse[]
  >;

  constructor(public functions: Functions) {
    this.functions.region = "us-east1";
    this.availableTimeSlotsFunc = httpsCallable(
      functions,
      "getAvailableTimeSlots",
    );
  }

  getAvailableTimeSlots(
    eventDurationMilliseconds: number,
  ): Observable<TimeSlot[]> {
    const processedAvailableTimeSlots$ = from(
      this.availableTimeSlotsFunc({ eventDurationMilliseconds }),
    ).pipe(
      map((availableTimeSlotsResponse) => {
        return availableTimeSlotsResponse.data.map((timeSlotResponse) => {
          return {
            start: new Date(timeSlotResponse.start),
            end: new Date(timeSlotResponse.end),
          };
        });
      }),
    );
    return processedAvailableTimeSlots$;
  }
}
