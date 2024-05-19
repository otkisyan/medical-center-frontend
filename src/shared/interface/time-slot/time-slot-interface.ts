import { AppointmentResponse } from "../appointment/appointment-interface";

export interface TimeSlotResponse {
  startTime: Date;
  endTime: Date;
  appointments: AppointmentResponse[];
}
