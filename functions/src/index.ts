import * as functions from "firebase-functions";
import { from } from 'rxjs'

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

export createAppointment = functions.https.onCall((data, context) => {
  // ...
});