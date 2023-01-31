import { Service } from "./service";

export declare interface AppointmentData {
  userUid: string,
  firstName: string, 
  lastName: string,
  location: string,
  startTime: string,
  endTime: string,
  duration: number,
  service: Service
}