import { Injectable } from '@angular/core';
import { TimeSlot } from '@schema/time-slot';
import { Availability, AvailabilityResponse } from '@schema/availability';
import {
  catchError,
  defer,
  from,
  map,
  NEVER,
  Observable,
  of,
  switchMap,
  tap
} from 'rxjs';
import { DateUtils } from '@booking/utilities/date.util';
import {
  CollectionReference,
  DocumentData,
  Firestore,
  Query,
  collection,
  collectionData,
  doc,
  limit,
  orderBy,
  query,
  setDoc
} from '@angular/fire/firestore';
import { Service } from '@schema/service';
import { SnackbarService } from '@app/common/services/snackbar/snackbar.service';
import { UserService } from '@user/user.service';
import { AppointmentUtils } from '@booking/utilities/appointment.util';
import {
  Appointment,
  AppointmentAddress,
  AppointmentEvent
} from '@schema/appointment';
import { UserProfile } from '@schema/user-profile';
import { Timestamp, where } from 'firebase/firestore';
import { Auth, user } from '@angular/fire/auth';
import { formatDate } from '@angular/common';
import { APPOINTMENTS_LIMIT } from '@src/constants';
import { TRPCService } from '../trpc/trpc.service';

interface AppointmentResponse {
  eventId: string;
  userId: string;
  service: Service;
  address: AppointmentAddress;
  start: Timestamp;
  cancelled: Timestamp | null;
}
@Injectable({
  providedIn: 'root'
})
export class BookingService {
  servicesCollection: CollectionReference<DocumentData>;
  servicesQuery: Query<DocumentData>;
  selectedService: Service | null;
  appointmentsCollection: CollectionReference<DocumentData>;
  appointmentsQuery: Query<DocumentData>;

  constructor(
    private readonly firestore: Firestore,
    private readonly snackbarService: SnackbarService,
    private readonly userService: UserService,
    private readonly auth: Auth,
    private readonly trpcService: TRPCService
  ) {
    this.servicesCollection = collection(this.firestore, 'Services');
    this.appointmentsCollection = collection(this.firestore, 'Appointments');
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

  public getAppointments(): Observable<Appointment[]> {
    const appointments$ = user(this.auth).pipe(
      switchMap((user) => {
        if (!user) {
          throw new Error('User is not logged in');
        }
        return collectionData(
          query(
            this.appointmentsCollection,
            where('userId', '==', user.uid),
            where('cancelled', '==', null),
            orderBy('start', 'desc'),
            limit(APPOINTMENTS_LIMIT)
          )
        ) as Observable<AppointmentResponse[]>;
      }),
      map((appointmentResponses) => {
        return appointmentResponses.map((appointmentResponse) => {
          return {
            eventId: appointmentResponse.eventId,
            userId: appointmentResponse.userId,
            service: appointmentResponse.service,
            address: {
              streetAddr: appointmentResponse.address.streetAddr,
              city: appointmentResponse.address.city,
              state: appointmentResponse.address.state,
              zip: appointmentResponse.address.zip
            },
            start: appointmentResponse.start.toDate(),
            cancelled: appointmentResponse.cancelled?.toDate() || null
          };
        });
      }),
      catchError((error) => {
        this.snackbarService.pushSnackbar(
          `Could not load appointments due to error: ${error}`
        );
        return NEVER;
      })
    );

    return appointments$;
  }

  public getAvailability(service: Service): Observable<Availability> {
    /**
     * getAvailabilityFn returns a promise which execute immediately
     * since we are turning said promise into an observable, we use defer
     * in order to delay the execution of the promise until the observable is subscribed to
     */
    const availability$ = defer(() =>
      this.trpcService.client.getAvailability.query(
        DateUtils.getMillisecondsFromMinutes(service.duration)
      )
    ).pipe(
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
    let event: AppointmentEvent;
    let appointment: Appointment;
    const event$ = this.userService.getUserProfile().pipe(
      switchMap((user) => {
        userProfile = user;
        event = AppointmentUtils.getAppointmentEvent(
          userProfile,
          service,
          timeSlot
        );
        return this.trpcService.client.bookAppointment.mutate(event);
      }),
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
        appointment = AppointmentUtils.getAppointmentFromEvent(
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

  /**
   * Cancels an appointment for a given event id.
   * It also sets a cancelled date on the appointment in Firestore.
   * @param eventId - The event id for the appointment.
   * @returns An Observable that emits the cancelled appointment.
   */
  public cancelAppointment(appointment: Appointment): Observable<void> {
    const cancelAppointment$ = defer(() =>
      this.trpcService.client.cancelAppointment.mutate(appointment.eventId)
    ).pipe(
      switchMap(() => {
        return from(
          setDoc(doc(this.firestore, 'Appointments', appointment.eventId), {
            ...appointment,
            cancelled: new Date()
          })
        );
      }),
      tap(() =>
        this.snackbarService.pushSnackbar(
          `Your appointment for ${formatDate(appointment.start, "EEE, MMM d 'at' h:mm a", 'en-US')} has been cancelled.`
        )
      ),
      catchError((error) => {
        this.snackbarService.pushSnackbar(
          `Could not cancel appointment due to error: ${error}`
        );
        return NEVER;
      })
    );

    return cancelAppointment$;
  }
}
