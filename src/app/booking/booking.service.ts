import { Injectable } from '@angular/core';
import {
  Availability,
  AvailableTimeSlotsRequest,
  AvailabilityResponse,
  TimeSlot,
} from './types/time-slot';
import {
  Functions,
  httpsCallable,
  HttpsCallable,
} from '@angular/fire/functions';
import { catchError, defer, map, NEVER, Observable } from 'rxjs';
import { DateUtils } from './utilities/date.util';
import {
  CollectionReference,
  DocumentData,
  Firestore,
  Query,
  collection,
  collectionData,
  orderBy,
  query,
} from '@angular/fire/firestore';
import { Service } from './types/service';
import { SnackbarService } from '../shared/services/snackbar/snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  getAvailabilityFn: HttpsCallable<
    AvailableTimeSlotsRequest,
    AvailabilityResponse
  >;
  servicesCollection: CollectionReference<DocumentData>;
  servicesQuery: Query<DocumentData>;
  selectedService: Service | null;

  constructor(
    private readonly functions: Functions,
    private readonly firestore: Firestore,
    private readonly snackbarService: SnackbarService,
  ) {
    this.functions.region = 'us-east1';
    this.getAvailabilityFn = httpsCallable(functions, 'getAvailabilityFn');
    this.servicesCollection = collection(this.firestore, 'Services');
    this.servicesQuery = query(
      this.servicesCollection,
      orderBy('price', 'asc'),
    );
  }

  getServices(): Observable<Service[]> {
    const services$: Observable<Service[]> = collectionData(
      this.servicesQuery,
    ) as Observable<Service[]>;
    return services$.pipe(
      catchError((error) => {
        this.snackbarService.pushSnackbar(
          `Could not load services due to error: ${error}`,
        );
        return NEVER;
      }),
    );
  }

  getAvailability(service: Service): Observable<Availability> {
    const availability$ = defer(() =>
      this.getAvailabilityFn({
        eventDuration: DateUtils.getMillisecondsFromMinutes(service.duration),
      }),
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
      catchError((error) => {
        this.snackbarService.pushSnackbar(
          `Could not load availability due to error: ${error}`,
        );
        return NEVER;
      }),
    );
    return availability$;
  }
}
