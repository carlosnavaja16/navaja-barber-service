import { inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Appointment,
  Availability,
  DateTimeSlots,
  Service,
  TimeSlot,
} from '@navaja/shared';
import { tapResponse } from '@ngrx/operators';
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { BookingService } from '@src/app/booking/booking.service';
import { pipe, switchMap, map, filter, tap } from 'rxjs';

export type ReschedulePageState = {
  appointment: Appointment | null;
  appointmentLoading: boolean;
  appointmentError: boolean;
  availability: Availability | null;
  availabilityLoading: boolean;
  availabilityError: boolean;
  selectedDateTimeSlots: DateTimeSlots | null;
  selectedTimeSlot: TimeSlot | null;
  rescheduleLoading: boolean;
  rescheduleError: boolean;
};

export const initialState: ReschedulePageState = {
  appointment: null,
  appointmentLoading: true,
  appointmentError: false,
  availability: null,
  availabilityLoading: true,
  availabilityError: false,
  selectedDateTimeSlots: null,
  selectedTimeSlot: null,
  rescheduleLoading: false,
  rescheduleError: false,
};

export const ReschedulePageStore = signalStore(
  withState(initialState),
  withMethods(
    (
      store,
      bookingService = inject(BookingService),
      route = inject(ActivatedRoute),
      router = inject(Router)
    ) => {
      const loadAppointment = rxMethod<void>(
        pipe(
          switchMap(() => route.paramMap),
          map((paramMap) => paramMap.get('id')),
          filter((id) => id !== null),
          tap(() =>
            patchState(store, {
              appointmentLoading: true,
              appointmentError: false,
            })
          ),
          switchMap((id) => bookingService.getAppointment$(id)),
          tapResponse({
            next: (appointment) => {
              patchState(store, {
                appointment,
                appointmentLoading: false,
                appointmentError: false,
              });
              loadAvailability(appointment.service);
            },
            error: () =>
              patchState(store, {
                appointment: null,
                appointmentLoading: false,
                appointmentError: true,
              }),
          })
        )
      );

      const loadAvailability = rxMethod<Service>(
        pipe(
          tap(() =>
            patchState(store, {
              availabilityLoading: true,
              availabilityError: false,
            })
          ),
          switchMap((service) => bookingService.getAvailability$(service)),
          tapResponse({
            next: (availability) =>
              patchState(store, {
                availability,
                availabilityLoading: false,
                availabilityError: false,
              }),
            error: () =>
              patchState(store, {
                availability: null,
                availabilityLoading: false,
                availabilityError: true,
              }),
          })
        )
      );

      const setDateTimeSlots = (dateTimeSlot: DateTimeSlots) =>
        patchState(store, { selectedDateTimeSlots: dateTimeSlot });
      const setTimeSlot = (timeSlot: TimeSlot) =>
        patchState(store, { selectedTimeSlot: timeSlot });

      const rescheduleAppointment = rxMethod<void>(
        pipe(
          tap(() =>
            patchState(store, {
              rescheduleLoading: true,
              rescheduleError: false,
            })
          ),
          switchMap(() =>
            bookingService.rescheduleAppointment$({
              eventId: store.appointment()!.eventId,
              timeSlot: store.selectedTimeSlot()!,
            })
          ),
          tapResponse({
            next: () => {
              patchState(store, {
                rescheduleLoading: false,
                rescheduleError: false,
              });
              router.navigate(['/booking']);
            },
            error: () =>
              patchState(store, {
                rescheduleLoading: false,
                rescheduleError: true,
              }),
          })
        )
      );

      return {
        loadAppointment,
        loadAvailability,
        setDateTimeSlots,
        setTimeSlot,
        rescheduleAppointment,
      };
    }
  )
);
