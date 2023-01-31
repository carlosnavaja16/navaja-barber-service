import * as functions from 'firebase-functions';
import { AppointmentData } from '../../src/app/shared/types/appointmentData';
import { google } from 'googleapis';
import { BARBER_SERVICE_CALENDAR_ID } from './shared/constants/constants';

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredappointmentData: true});
//   response.send("Hello from Firebase!");
// });

exports.createAppointment = functions.https.onCall(
  (appointmentData: AppointmentData, context) => {
    const auth = new google.auth.GoogleAuth({
      keyFile: 'keys/barber-service-45e86-155c38de5abf.json',
      scopes: ['https://www.googleapis.com/auth/calendar.events'],
    });

    const calendar = google.calendar({
      auth: auth,
      version: 'v3',
    });

    const res = calendar.events.insert({
      calendarId: BARBER_SERVICE_CALENDAR_ID,
      requestBody: {
        summary: `${appointmentData.firstName} ${appointmentData.lastName}`,
        description: `${appointmentData.service.name} \n ${appointmentData.service.duration} mins \n $${appointmentData.service.price}`,
        location: appointmentData.location,
        start: {
          dateTime: appointmentData.startTime,
        },
        end: {
          dateTime: appointmentData.endTime,
        },
      },
    });
  });
