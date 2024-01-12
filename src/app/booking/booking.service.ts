import { Injectable } from '@angular/core';
import { AvailableTimeSlotsRequest, TimeSlot } from '../../../types/time-slot';
import {
  Availability,
  AvailabilityResponse,
} from '../../../types/availability';
import {
  Functions,
  httpsCallable,
  HttpsCallable,
} from '@angular/fire/functions';
import { catchError, defer, map, NEVER, Observable, switchMap } from 'rxjs';
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
import { Service } from '../../../types/service';
import { SnackbarService } from '../shared/services/snackbar/snackbar.service';
import { calendar_v3 } from 'googleapis';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  getAvailabilityFn: HttpsCallable<
    AvailableTimeSlotsRequest,
    AvailabilityResponse
  >;
  getBookAppointmentFn: HttpsCallable<
    calendar_v3.Schema$Event,
    calendar_v3.Schema$Event
  >;
  servicesCollection: CollectionReference<DocumentData>;
  servicesQuery: Query<DocumentData>;
  selectedService: Service | null;

  constructor(
    private readonly functions: Functions,
    private readonly firestore: Firestore,
    private readonly snackbarService: SnackbarService,
    private readonly userService: UserService,
  ) {
    this.functions.region = 'us-east1';
    this.getAvailabilityFn = httpsCallable(functions, 'getAvailabilityFn');
    this.getBookAppointmentFn = httpsCallable(functions, 'bookAppointmentFn');
    this.servicesCollection = collection(this.firestore, 'Services');
    this.servicesQuery = query(
      this.servicesCollection,
      orderBy('price', 'asc'),
    );
  }

  public getServices(): Observable<Service[]> {
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

  public getAvailability(service: Service): Observable<Availability> {
    //defer() will wait until we subscribe to the observable to execute the request
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

  public bookAppointment(service: Service, timeSlot: TimeSlot): void {
    this.userService
      .getUserProfile()
      .pipe(
        switchMap((userProfile) => {
          const event: calendar_v3.Schema$Event = {
            summary: `${userProfile.firstName} ${userProfile.lastName}`,
            description: `
              Service: ${service.name}\n
              Phone: ${userProfile.phone}\n
              Email: ${userProfile.email}
            `,
            start: {
              dateTime: timeSlot.start.toISOString(),
            },
            end: {
              dateTime: timeSlot.end.toISOString(),
            },
          };

          return defer(() => {
            return this.getBookAppointmentFn(event);
          });
        }),
        map((result) => result.data),
      )
      .subscribe();
  }
}
