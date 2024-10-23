import { getFirestore } from 'firebase-admin/firestore';
import { firebaseApp } from '../index.js';
import { AppointmentFirestoreResponse } from '@navaja/shared';
import { APPOINTMENT_LIST_LIMIT } from '../constants';
import { AppointmentUtils } from '../util/appointment.util';

export async function getAppointments(userUid: string) {
  const query = await getFirestore(firebaseApp)
    .collection('Appointments')
    .where('userId', '==', userUid)
    .where('cancelled', '==', null)
    .orderBy('start', 'desc')
    .limit(APPOINTMENT_LIST_LIMIT)
    .get();
  return query.docs
    .map((doc) => doc.data() as AppointmentFirestoreResponse)
    .map((response) => AppointmentUtils.transformDates(response));
}

export async function getAppointment(eventId: string) {
  const query = await getFirestore(firebaseApp)
    .collection('Appointments')
    .doc(eventId)
    .get();
  return AppointmentUtils.transformDates(
    query.data() as AppointmentFirestoreResponse
  );
}
