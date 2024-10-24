import { Injectable } from '@angular/core';
import {
  Appointment,
  Availability,
  AvailabilityResponse,
  BarberErrors,
  RescheduleRequest,
  Service,
  TimeSlot
} from '@navaja/shared';
import {
  EMPTY,
  Observable,
  catchError,
  defer,
  filter,
  map,
  switchMap,
  tap
} from 'rxjs';
import { DateUtils } from '@booking/utilities/date.util';
import { SnackbarService } from '@app/common/services/snackbar/snackbar.service';
import { formatDate } from '@angular/common';
import { TRPCService } from '../trpc/trpc.service';
import { AppState } from '../app.state';
import { Store } from '@ngrx/store';
import * as UserSelectors from '../user/state/user.selectors';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  // TODO: this can be stored in ngrx store
  selectedService: Service | null;

  constructor(
    private readonly snackbarService: SnackbarService,
    private readonly trpcService: TRPCService,
    private readonly store: Store<AppState>
  ) {}

  public getServices(): Observable<Service[]> {
    const services$ = defer(() => this.trpcService.client.getServices.query());
    return services$.pipe(
      catchError((error) => {
        this.snackbarService.pushSnackbar(
          `Could not load services due to error: ${error}`
        );
        return EMPTY;
      })
    );
  }

  public getAppointments(): Observable<Appointment[]> {
    return this.store.select(UserSelectors.getUserProfile).pipe(
      filter((user) => !!user),
      switchMap((user) => {
        return defer(() =>
          this.trpcService.client.getAppointments.query(user.userId)
        );
      }),
      catchError((error) => {
        this.snackbarService.pushSnackbar(
          `Could not load appointments due to error: ${error}`
        );
        return EMPTY;
      })
    );
  }

  public getAppointment(eventId: string): Observable<Appointment> {
    return defer(() =>
      this.trpcService.client.getAppointment.query(eventId)
    ).pipe(
      catchError((error) => {
        this.snackbarService.pushSnackbar(
          `Could not get appointment due to error: ${error}`
        );
        return EMPTY;
      })
    );
  }

  public getAvailability(service: Service): Observable<Availability> {
    /**
     * getAvailabilityFn returns a promise which execute immediately
     * since we are turning said promise into an observable, we use defer
     * in order to delay the execution of the promise until the observable is subscribed to
     */
    return defer(() =>
      this.trpcService.client.getAvailability.query(service.duration)
    ).pipe(
      tap((availabilityResponse) =>
        console.log('availabilityResponse: ', availabilityResponse)
      ),
      map((AvailabilityResponse: AvailabilityResponse) => {
        const timeSlotsByDate = DateUtils.getTimeSlotsByDate(
          AvailabilityResponse.availableTimeSlots
        );
        return {
          ...AvailabilityResponse,
          timeSlotsByDate,
          dateFilter: (date: Date) => {
            return DateUtils.isDateInAvailableDates(date, timeSlotsByDate);
          }
        };
      }),
      catchError((error) => {
        this.snackbarService.pushSnackbar(
          `Could not load availability due to error: ${error}`
        );
        return EMPTY;
      })
    );
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
    return this.store.select(UserSelectors.getUserProfile).pipe(
      switchMap((userProfile) => {
        if (!userProfile) {
          throw BarberErrors.USER_NOT_LOGGED_IN;
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
        return EMPTY;
      })
    );
  }

  public rescheduleAppointment(rescheduleRequest: RescheduleRequest) {
    return defer(() =>
      this.trpcService.client.rescheduleAppointment.mutate(rescheduleRequest)
    );
  }

  /**
   * Cancels an appointment for a given event id.
   * It also sets a cancelled date on the appointment in Firestore.
   * @param eventId - The event id for the appointment.
   * @returns An Observable that emits the cancelled appointment.
   */
  public cancelAppointment(appointment: Appointment): Observable<void> {
    return defer(() =>
      this.trpcService.client.cancelAppointment.mutate(appointment.eventId)
    ).pipe(
      tap(() =>
        this.snackbarService.pushSnackbar(
          `Your appointment for ${formatDate(
            appointment.start,
            "EEE, MMM d 'at' h:mm a",
            'en-US'
          )} has been cancelled.`
        )
      ),
      catchError((error) => {
        this.snackbarService.pushSnackbar(
          `Could not cancel appointment due to error: ${error}`
        );
        return EMPTY;
      })
    );
  }
}
