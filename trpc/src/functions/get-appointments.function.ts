import { firestore } from 'firebase-admin';
import { firebaseApp } from '..';
import { Appointment } from '../../../shared/schema/appointment';
import { APPOINTMENT_LIST_LIMIT } from '../constants';

export async function getAppointments(userUid: string) {
  const query = await firestore(firebaseApp)
    .collection('Appointments')
    .where('userId', '==', userUid)
    .where('cancelled', '==', null)
    .orderBy('start', 'desc')
    .limit(APPOINTMENT_LIST_LIMIT)
    .get();
  return query.docs.map((doc) => doc.data() as Appointment);
}
