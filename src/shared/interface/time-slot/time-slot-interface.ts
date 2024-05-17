import { AppointmentResponse } from "../appointment/appointment-interface";

export interface TimeSlotResponse {
  startTime: Date;
  endtime: Date;
  appointments: AppointmentResponse[];
}
