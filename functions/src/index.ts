import * as functions from 'firebase-functions';
import { AppointmentData } from '../../src/app/shared/types/appointmentData';
import { google } from 'googleapis';
import { 
  BARBER_SERVICE_CALENDAR_ID,
  API_KEY_FILE,
  SCOPES
} from './shared/constants/constants';

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredappointmentData: true});
//   response.send("Hello from Firebase!");
// });

const auth = new google.auth.GoogleAuth({
  keyFile: API_KEY_FILE,
  scopes: SCOPES,
});

const calendar = google.calendar({
  auth: auth,
  version: 'v3',
});
/*
exports.createAppointment = functions.https.onCall(
  (appointmentData: AppointmentData, context) => {


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
  }
);
*/

exports.getTimeSlots = functions.https.onCall(
  (date: Date) => {
    calendar.freebusy.query({
      requestBody: {
        
      }
    });
    
  }
);
