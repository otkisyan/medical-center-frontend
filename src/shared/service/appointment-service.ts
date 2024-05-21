import { axiosInstance } from "@/axios.config";
import { TimeSlotResponse } from "../interface/time-slot/time-slot-interface";
import {
  AppointmentRequest,
  AppointmentResponse,
} from "../interface/appointment/appointment-interface";

export const AppointmentService = {
  async getTimeTable(doctorId: number, params: any) {
    const { data } = await axiosInstance.get<TimeSlotResponse[]>(
      `/appointments/timetable/${doctorId}`,
      { params }
    );
    return data;
  },

  async findAppointmentById(id: number) {
    const { data } = await axiosInstance.get<AppointmentResponse>(
      `/appointments/${id}`
    );
    return data;
  },

  async newAppointment(newAppointment: AppointmentRequest) {
    const { data } = await axiosInstance.post<AppointmentResponse>(
      "/appointments",
      newAppointment
    );
    return data;
  },
};
