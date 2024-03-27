import { firestore } from 'firebase-admin';
import { cancelEvent } from '../util/google-calendar.util';
import { firebaseApp } from '..';

export async function cancelAppointment(eventId: string) {
  await firestore(firebaseApp).collection('Appointments').doc(eventId).update({
    cancelled: new Date()
  });
  return await cancelEvent(eventId);
}
