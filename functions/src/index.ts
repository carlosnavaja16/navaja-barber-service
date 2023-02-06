import * as functions from 'firebase-functions';
import { google } from 'googleapis';
import { 
  BARBER_SERVICE_CALENDAR_ID,
  API_KEY_FILE,
  SCOPES
} from './shared/constants/constants';
import { from } from 'rxjs'

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
  (data: {date: Date}) => {
    const currDateAsString = data.date.toISOString();
    data.date.setDate(data.date.getDate() + 14);
    const limit = data.date;
    const limitDateAsString = limit.toISOString();
    
    const requestBody = {
      items: [{
        id: BARBER_SERVICE_CALENDAR_ID
      }],
      timeMin: currDateAsString,
      timeMax: limitDateAsString,
      timeZone: 'EST'
    };

    calendar.freebusy.query({ requestBody: requestBody})
    .then((res) => {
      console.log(res)
      return res
    })
    .catch((err) => {
      console.log(err)
      return err
    });
  }
);