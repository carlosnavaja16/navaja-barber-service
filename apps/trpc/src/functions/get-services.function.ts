/* eslint-disable @typescript-eslint/no-explicit-any */
import { firebaseApp } from '..';
import { firestore } from 'firebase-admin';
import { Service } from '../../../../libs/shared/src/types/service';

export async function getServices() {
  const query = await firestore(firebaseApp)
    .collection('Services')
    .orderBy('price', 'asc')
    .get();
  return query.docs.map((doc) => doc.data() as Service);
}
