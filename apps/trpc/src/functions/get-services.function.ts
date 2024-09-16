import { firebaseApp } from '../index.js';
import { getFirestore } from 'firebase-admin/firestore';
import { Service } from '@navaja/shared';

export async function getServices() {
  const query = await getFirestore(firebaseApp)
    .collection('Services')
    .orderBy('price', 'asc')
    .get();
  return query.docs.map((doc) => doc.data() as Service);
}
