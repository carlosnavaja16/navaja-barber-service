import { getFirestore } from 'firebase-admin/firestore';
import { cancelEvent } from '../util/google-calendar.util.js';
import { firebaseApp } from '../index.js';

export async function cancelAppointment(eventId: string) {
  await getFirestore(firebaseApp)
    .collection('Appointments')
    .doc(eventId)
    .update({
      cancelled: new Date()
    });
  return await cancelEvent(eventId);
}
