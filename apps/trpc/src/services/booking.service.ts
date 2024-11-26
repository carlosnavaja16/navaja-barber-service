import {
  AppointmentRequest,
  AvailabilityResponse,
  RescheduleRequest
} from '@navaja/shared';
import { FirestoreService } from './firestore.service';
import { DateUtils } from '../utils/date.util';
import { TimeSlotUtils } from '../utils/timeSlot.util';
import { CalendarService } from './calendar.service';
import { AppointmentUtils } from '../utils/appointment.util';

export class BookingService {
  /**
   * Retrieves all services from Firestore.
   * @returns The services.
   */
  public static async getServices() {
    return await FirestoreService.getServices();
  }

  /**
   * Retrieves the availability for a given event duration.
   * @param eventDuration - The duration of the event in minutes.
   * @returns The availability response.
   */
  public static async getAvailability(
    eventDuration: number
  ): Promise<AvailabilityResponse> {
    const eventDurationMillis = eventDuration * 60 * 1000;
    const openingHourUTC = DateUtils.getOpeningHourUtc();
    const closingHourUTC = DateUtils.getClosingHourUtc();
    const minDate = DateUtils.getMinDate();
    const maxDate = DateUtils.getMaxDate();

    //Get all time slots for the given date range
    const allTimeSlots = TimeSlotUtils.getAllTimeSlots(
      eventDurationMillis,
      minDate,
      maxDate
    );

    const busyTimes = await CalendarService.getCalendarFreeBusy(
      minDate,
      maxDate
    );

    const busyTimeSlots = TimeSlotUtils.getBusyTimeSlots(busyTimes);

    const availableTimeSlots = TimeSlotUtils.getAvailableTimeSlots(
      allTimeSlots,
      busyTimeSlots
    );

    return {
      firstAvailableDate: availableTimeSlots[0].start,
      openingHourUTC,
      closingHourUTC,
      minDate,
      maxDate,
      availableTimeSlots
    };
  }

  /**
   * Books an appointment by creating an event in the calendar and inserting
   * the appointment into Firestore.
   * @param appointmentRequest - The appointment request object containing
   * the details of the appointment.
   * @returns The created appointment object.
   */
  public static async bookAppointment(appointmentRequest: AppointmentRequest) {
    // Generate the a new event and add it to the google calendar
    const appointmentEvent =
      AppointmentUtils.buildAppointmentEvent(appointmentRequest);
    const savedAppointmentEvent =
      await CalendarService.insertEvent(appointmentEvent);

    // Generate the appointment object and add it to the firestore database
    const appointment = AppointmentUtils.buildAppointment(
      savedAppointmentEvent.id,
      appointmentRequest
    );

    await FirestoreService.saveAppointment(appointment);

    return appointment;
  }

  /**
   * Retrieves all appointments for a given user.
   * @param userUid - The UID of the user to retrieve appointments for.
   * @returns The appointments.
   */
  public static async getAppointments(userUid: string) {
    return await FirestoreService.getAppointments(userUid);
  }

  /**
   * Retrieves a single appointment by its event ID.
   * @param eventId - The ID of the event to retrieve.
   * @returns The appointment.
   */
  public static async getAppointment(eventId: string) {
    return await FirestoreService.getAppointment(eventId);
  }

  /**
   * Cancels an appointment by updating the appointment in Firestore
   * and canceling the event in the calendar.
   * @param eventId - The ID of the event to cancel.
   */
  public static async cancelAppointment(eventId: string) {
    await Promise.all([
      FirestoreService.cancelAppointment(eventId),
      CalendarService.deleteEvent(eventId)
    ]);
  }

  /**
   * Reschedules an appointment by updating the appointment in Firestore
   * and rescheduling the event in the calendar.
   * @param rescheduleRequest - The reschedule request object containing
   * the details of the reschedule.
   */
  public static async rescheduleAppointment(
    rescheduleAppointment: RescheduleRequest
  ) {
    await Promise.all([
      FirestoreService.rescheduleAppointment(
        rescheduleAppointment.eventId,
        rescheduleAppointment.timeSlot
      ),
      CalendarService.getEvent(rescheduleAppointment.eventId).then((event) =>
        CalendarService.rescheduleEvent(event, rescheduleAppointment.timeSlot)
      )
    ]);
  }
}
