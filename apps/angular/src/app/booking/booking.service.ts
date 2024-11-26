import { Injectable } from '@angular/core';
import {
  Appointment,
  Availability,
  AvailabilityResponse,
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
  from,
  map,
  of,
  switchMap,
  tap
} from 'rxjs';
import { DateUtils } from '@booking/utilities/date.util';
import { SnackbarService } from '@app/common/services/snackbar/snackbar.service';
import { TRPCService } from '../trpc/trpc.service';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  selectedService: Service | null;

  constructor(
    private readonly snackbarService: SnackbarService,
    private readonly trpcService: TRPCService,
    private readonly userService: UserService
  ) {}

  public getServices$(): Observable<Service[]> {
    return from(this.trpcService.client.booking.getServices.query()).pipe(
      tap((c) => console.log('services', c)),
      catchError((error) => {
        this.snackbarService.pushSnackbar(
          `Could not load services due to error: ${error}`
        );
        return EMPTY;
      })
    );
  }

  public getAppointments$(): Observable<Appointment[]> {
    return defer(() =>
      this.trpcService.client.booking.getAppointments.query()
    ).pipe(
      catchError((error) => {
        this.snackbarService.pushSnackbar(
          `Could not load appointments due to error: ${error}`
        );
        return EMPTY;
      })
    );
  }

  public getAppointment$(eventId: string): Observable<Appointment> {
    return defer(() =>
      this.trpcService.client.booking.getAppointment.query(eventId)
    ).pipe(
      catchError((error) => {
        this.snackbarService.pushSnackbar(
          `Could not get appointment due to error: ${error}`
        );
        return EMPTY;
      })
    );
  }

  public getAvailability$(service: Service): Observable<Availability> {
    /**
     * getAvailabilityFn returns a promise which execute immediately
     * since we are turning said promise into an observable, we use defer
     * in order to delay the execution of the promise until the observable is subscribed to
     */
    return defer(() =>
      this.trpcService.client.booking.getAvailability.query(service.duration)
    ).pipe(
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
  public bookAppointment$(
    service: Service,
    timeSlot: TimeSlot
  ): Observable<Appointment> {
    return of(this.userService.userProfile()).pipe(
      filter((userProfile) => userProfile != undefined),
      switchMap((userProfile) => {
        return from(
          this.trpcService.client.booking.bookAppointment.mutate({
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

  public rescheduleAppointment$(rescheduleRequest: RescheduleRequest) {
    return defer(() =>
      this.trpcService.client.booking.rescheduleAppointment.mutate(
        rescheduleRequest
      )
    ).pipe(
      catchError((error) => {
        this.snackbarService.pushSnackbar(
          `Could not reschedule appointment due to error: ${error}`
        );
        return EMPTY;
      })
    );
  }

  /**
   * Cancels an appointment for a given event id.
   * It also sets a cancelled date on the appointment in Firestore.
   * @param eventId - The event id for the appointment.
   * @returns An Observable that emits the cancelled appointment.
   */
  public cancelAppointment$(appointment: Appointment): Observable<void> {
    return defer(() =>
      this.trpcService.client.booking.cancelAppointment.mutate(
        appointment.eventId
      )
    ).pipe(
      tap(() =>
        this.snackbarService.pushSnackbar(
          `Your appointment for ${DateUtils.getDateString(appointment.start)} has been cancelled.`
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
