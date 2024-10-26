import { getFirestore } from 'firebase-admin/firestore';
import { firebaseApp } from '../utils/firebase';
import { CalendarService } from './calendar.service';
import { AppointmentUtils } from '../utils/appointment.util';
import {
  AppointmentFirestoreResponse,
  AppointmentRequest,
  AvailabilityResponse,
  Service,
  TODO
} from '@navaja/shared';
import {
  APPOINTMENT_COLLECTION,
  APPOINTMENT_LIST_LIMIT,
  ASCENDING_ORDER,
  CANCELLED_FIELD,
  DESCENDING_ORDER,
  PRICE_FIELD,
  SERVICE_COLLECTION,
  START_FIELD,
  USER_ID_FIELD
} from '../utils/constants';
import { DateUtils } from '../utils/date.util';
import { TimeSlotUtils } from '../utils/timeSlot.util';

export class FirestoreService {
  /**
   * Retrieves a list of services from Firestore.
   * @returns An array of services.
   */
  public static async getServices() {
    const query = await getFirestore(firebaseApp)
      .collection(SERVICE_COLLECTION)
      .orderBy(PRICE_FIELD, ASCENDING_ORDER)
      .get();
    return query.docs.map((doc) => doc.data() as Service);
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
    await getFirestore(firebaseApp)
      .doc(`${APPOINTMENT_COLLECTION}/${savedAppointmentEvent.id}`)
      .set(appointment);

    return appointment;
  }

  /**
   * Retrieves a list of appointments for a specific user from Firestore.
   * @param userUid - The UID of the user to retrieve appointments for.
   * @returns An array of appointments for the specified user.
   */
  public static async getAppointments(userUid: string) {
    const query = await getFirestore(firebaseApp)
      .collection(APPOINTMENT_COLLECTION)
      .where(USER_ID_FIELD, '==', userUid)
      .where(CANCELLED_FIELD, '==', null)
      .orderBy(START_FIELD, DESCENDING_ORDER)
      .limit(APPOINTMENT_LIST_LIMIT)
      .get();
    return query.docs
      .map((doc) => doc.data() as AppointmentFirestoreResponse)
      .map((response) => AppointmentUtils.transformDates(response));
  }

  /**
   * Retrieves a single appointment by its event ID from Firestore.
   * @param eventId - The ID of the event to retrieve.
   * @returns The retrieved appointment object.
   */
  public static async getAppointment(eventId: string) {
    const query = await getFirestore(firebaseApp)
      .collection(APPOINTMENT_COLLECTION)
      .doc(eventId)
      .get();
    return AppointmentUtils.transformDates(
      query.data() as AppointmentFirestoreResponse
    );
  }

  /**
   * Cancels an appointment by updating the appointment in Firestore
   * and canceling the event in the calendar.
   * @param eventId - The ID of the event to cancel.
   * @returns The cancelled appointment object.
   */
  public static async cancelAppointment(eventId: string) {
    await getFirestore(firebaseApp)
      .collection(APPOINTMENT_COLLECTION)
      .doc(eventId)
      .update({
        cancelled: new Date()
      });
    return await CalendarService.deleteEvent(eventId);
  }

  /**
   * Reschedules an appointment by updating the appointment in Firestore
   * and rescheduling the event in the calendar.
   */
  public static async rescheduleAppointment(rescheduleRequest: TODO) {
    return CalendarService.rescheduleEvent(rescheduleRequest);
  }
}
