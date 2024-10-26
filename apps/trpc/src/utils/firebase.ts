import admin from 'firebase-admin';
import { cert } from 'firebase-admin/app';
import { firebaseSvcAccCreds } from '../credentials';

export const firebaseApp = admin.initializeApp({
  credential: cert(firebaseSvcAccCreds)
});
