import { getFirestore } from 'firebase-admin/firestore';
import { firebaseApp } from '../utils/firebase';
import { AppointmentUtils } from '../utils/appointment.util';
import {
  Appointment,
  AppointmentFirestoreResponse,
  RescheduleRequest,
  Service,
  UserProfile
} from '@navaja/shared';
import {
  APPOINTMENT_COLLECTION,
  APPOINTMENT_LIST_LIMIT,
  ASCENDING_ORDER,
  DESCENDING_ORDER,
  PRICE_FIELD,
  SERVICE_COLLECTION,
  START_FIELD,
  USER_ID_FIELD,
  USER_PROFILE_COLLECTION
} from '../utils/constants';

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
   * Retrieves a user profile from Firestore.
   * @param userUid - The UID of the user to retrieve the profile for.
   * @returns The user profile.
   */
  public static async getUserProfile(userId: string) {
    const query = await getFirestore(firebaseApp)
      .doc(`${USER_PROFILE_COLLECTION}/${userId}`)
      .get();
    return query.data() as UserProfile;
  }

  /**
   * Creates a user profile in Firestore.
   * @param userProfile - The user profile to create.
   */
  public static async createUserProfile(userProfile: UserProfile) {
    await getFirestore(firebaseApp)
      .doc(`${USER_PROFILE_COLLECTION}/${userProfile.userId}`)
      .set(userProfile);
    return userProfile;
  }

  /**
   * Updates a user profile in Firestore.
   * @param userProfile - The user profile to update.
   */
  public static async updateUserProfile(userProfile: UserProfile) {
    await getFirestore(firebaseApp)
      .doc(`${USER_PROFILE_COLLECTION}/${userProfile.userId}`)
      .update({ ...userProfile });

    return userProfile;
  }

  /**
   * Updates a user's email in Firestore.
   * @param userId - The UID of the user to update the email for.
   * @param email - The new email to set for the user.
   */
  public static async updateUserEmail(userId: string, email: string) {
    await getFirestore(firebaseApp)
      .doc(`${USER_PROFILE_COLLECTION}/${userId}`)
      .update({ email });
    return email;
  }

  /**
   * Saves an appointment to Firestore.
   * @param appointment - The appointment to save.
   */
  public static async saveAppointment(appointment: Appointment) {
    await getFirestore(firebaseApp)
      .doc(`${APPOINTMENT_COLLECTION}/${appointment.eventId}`)
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
      .orderBy(START_FIELD, DESCENDING_ORDER)
      .limit(APPOINTMENT_LIST_LIMIT)
      .get();
    return query.docs
      .map((doc) => doc.data() as AppointmentFirestoreResponse)
      .map((response) => AppointmentUtils.transformDates(response))
      .filter((appointment) => !appointment.cancelled);
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
   */
  public static async cancelAppointment(eventId: string) {
    const cancelled = new Date();
    await getFirestore(firebaseApp)
      .collection(APPOINTMENT_COLLECTION)
      .doc(eventId)
      .update({
        cancelled
      });
    return cancelled;
  }

  /**
   * Reschedules an appointment by updating the appointment in Firestore
   * and rescheduling the event in the calendar.
   */
  public static async rescheduleAppointment(
    rescheduleRequest: RescheduleRequest
  ) {
    const doc = await getFirestore(firebaseApp).doc(
      `${APPOINTMENT_COLLECTION}/${rescheduleRequest.eventId}`
    );
    doc.update({
      start: rescheduleRequest.startTime
    });
    const query = await doc.get();
    return AppointmentUtils.transformDates(
      query.data() as AppointmentFirestoreResponse
    );
  }
}
