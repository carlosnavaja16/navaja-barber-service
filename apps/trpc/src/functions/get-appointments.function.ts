import { getFirestore } from 'firebase-admin/firestore';
import { firebaseApp } from '../index.js';
import { Appointment } from '@navaja/shared';
import { APPOINTMENT_LIST_LIMIT } from '../constants.js';

export async function getAppointments(userUid: string) {
  const query = await getFirestore(firebaseApp)
    .collection('Appointments')
    .where('userId', '==', userUid)
    .where('cancelled', '==', null)
    .orderBy('start', 'desc')
    .limit(APPOINTMENT_LIST_LIMIT)
    .get();
  const result = query.docs
    .map((doc) => doc.data())
    .map((a) => {
      // TODO: we should make this cleaner
      return {
        ...a,
        start: a.start.toDate()
      } as Appointment;
    });

  console.log('result: ', result);
  return result;
}

export async function getAppointment(eventId: string) {
  const query = await getFirestore(firebaseApp)
    .collection('Appointments')
    .doc(eventId)
    .get();
  return query.data() as Appointment;
}
