import { Injectable } from '@angular/core';
import { TimeSlot } from '@schema/time-slot';
import { Availability, AvailabilityResponse } from '@schema/availability';
import {
  catchError,
  defer,
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
  collection
} from '@angular/fire/firestore';
import { Service } from '@schema/service';
import { SnackbarService } from '@app/common/services/snackbar/snackbar.service';
import { UserService } from '@user/user.service';
import { Appointment } from '@schema/appointment';
import { formatDate } from '@angular/common';
import { TRPCService } from '../trpc/trpc.service';

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
    private readonly trpcService: TRPCService
  ) {
    this.servicesCollection = collection(this.firestore, 'Services');
    this.appointmentsCollection = collection(this.firestore, 'Appointments');
  }

  public getServices(): Observable<Service[]> {
    const services$ = defer(() => this.trpcService.client.getServices.query());
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
    const appointments$ = of(this.userService.getCurrUserProfile()).pipe(
      switchMap((user) => {
        if (!user) {
          throw new Error('User is not logged in');
        }
        return defer(() =>
          this.trpcService.client.getAppointments.query(user.userId)
        );
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
      this.trpcService.client.getAvailability.query(service.duration)
    ).pipe(
      map((AvailabilityResponse: AvailabilityResponse) => {
        return {
          ...AvailabilityResponse,
          dateFilter: (date: Date) => {
            return DateUtils.isDateInAvailableDates(
              date,
              AvailabilityResponse.timeSlotsByDate
            );
          }
        };
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
    const appointment$ = of(this.userService.getCurrUserProfile()).pipe(
      switchMap((userProfile) => {
        if (!userProfile) {
          throw Error('user is not logged in');
        }
        return defer(() =>
          this.trpcService.client.bookAppointment.mutate({
            userProfile,
            service,
            timeSlot
          })
        );
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
