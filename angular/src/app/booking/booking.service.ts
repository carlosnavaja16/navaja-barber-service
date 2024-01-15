import { Injectable } from '@angular/core';
import { TimeSlot } from '@type/time-slot';
import {
  AvailabilityRequest,
  Availability,
  AvailabilityResponse
} from '@type/availability';
import {
  Functions,
  httpsCallable,
  HttpsCallable
} from '@angular/fire/functions';
import {
  catchError,
  defer,
  from,
  map,
  NEVER,
  Observable,
  of,
  switchMap
} from 'rxjs';
import { DateUtils } from './utilities/date.util';
import {
  CollectionReference,
  DocumentData,
  Firestore,
  Query,
  collection,
  collectionData,
  doc,
  orderBy,
  query,
  setDoc
} from '@angular/fire/firestore';
import { Service } from '@type/service';
import { SnackbarService } from '../shared/services/snackbar/snackbar.service';
import { calendar_v3 } from 'googleapis';
import { UserService } from '../user/user.service';
import { AppointmentUtils } from './utilities/appointment.util';
import { Appointment } from '@type/appointment';
import { UserProfile } from '@type/user-profile';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  getAvailabilityFn: HttpsCallable<AvailabilityRequest, AvailabilityResponse>;
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
    private readonly userService: UserService
  ) {
    this.functions.region = 'us-east1';
    this.getAvailabilityFn = httpsCallable(functions, 'getAvailabilityFn');
    this.getBookAppointmentFn = httpsCallable(functions, 'bookAppointmentFn');
    this.servicesCollection = collection(this.firestore, 'Services');
    this.servicesQuery = query(
      this.servicesCollection,
      orderBy('price', 'asc')
    );
  }

  public getServices(): Observable<Service[]> {
    const services$: Observable<Service[]> = collectionData(
      this.servicesQuery
    ) as Observable<Service[]>;
    return services$.pipe(
      catchError((error) => {
        this.snackbarService.pushSnackbar(
          `Could not load services due to error: ${error}`
        );
        return NEVER;
      })
    );
  }

  public getAvailability(service: Service): Observable<Availability> {
    //defer() will wait until we subscribe to the observable to execute the request
    const availability$ = defer(() =>
      this.getAvailabilityFn({
        eventDuration: DateUtils.getMillisecondsFromMinutes(service.duration)
      })
    ).pipe(
      map((result) => result.data),
      map((data: AvailabilityResponse) => {
        const firstAvailableDate = new Date(data.availableTimeSlots[0].start);
        const timeSlotsByDate = new Map<string, TimeSlot[]>();
        data.availableTimeSlots.forEach((timeSlotResponse) => {
          const timeSlot = {
            start: new Date(timeSlotResponse.start),
            end: new Date(timeSlotResponse.end)
          };
          const dateHash = DateUtils.getDateHash(timeSlot.start);
          const timeSlots = timeSlotsByDate.get(dateHash);
          if (timeSlots) {
            timeSlots.push(timeSlot);
          } else {
            timeSlotsByDate.set(dateHash, [timeSlot]);
          }
        });
        const availability: Availability = {
          firstAvailableDate,
          openingHourUTC: data.openingHourUTC,
          closingHourUTC: data.closingHourUTC,
          minDate: new Date(data.minDate),
          maxDate: new Date(data.maxDate),
          timeSlotsByDate,
          dateFilter: (date: Date) => {
            return DateUtils.isDateInAvailableDates(date, timeSlotsByDate);
          }
        };
        return availability;
      }),
      catchError((error) => {
        this.snackbarService.pushSnackbar(
          `Could not load availability due to error: ${error}`
        );
        return NEVER;
      })
    );
    return availability$;
  }

  /**
   * Books an appointment for a given service and time slot.
   * It also creates a record of the appointment in Firestore.
   * @param service - The service for the appointment.
   * @param timeSlot - The time slot for the appointment.
   * @returns An Observable that emits the booked appointment.
   */
  public bookAppointment(
    service: Service,
    timeSlot: TimeSlot
  ): Observable<Appointment> {
    let userProfile: UserProfile;
    let event: calendar_v3.Schema$Event;
    let appointment: Appointment;
    const event$ = this.userService.getUserProfile().pipe(
      switchMap((user) => {
        userProfile = user;
        event = AppointmentUtils.getAppointmentEvent(
          userProfile,
          service,
          timeSlot
        );
        return this.getBookAppointmentFn(event);
      }),
      map((result) => result.data),
      catchError((error) => {
        this.snackbarService.pushSnackbar(
          `Could not book appointment due to error: ${error}`
        );
        return NEVER;
      })
    );

    const appointment$ = event$.pipe(
      switchMap((event) => {
        if (!event.id) {
          throw new Error('Could not book appointment');
        }
        appointment = AppointmentUtils.getAppointment(
          userProfile,
          event,
          service
        );
        return from(
          setDoc(doc(this.firestore, 'Appointments', event.id), appointment)
        );
      }),
      switchMap(() => {
        return of(appointment);
      }),
      catchError((error) => {
        this.snackbarService.pushSnackbar(
          `Could not book appointment due to error: ${error}`
        );
        return NEVER;
      })
    );
    return appointment$;
  }
}
