import { axiosInstance } from "@/axios.config";
import { TimeSlotResponse } from "../interface/time-slot/time-slot-interface";
import {
  AppointmentRequest,
  AppointmentResponse,
} from "../interface/appointment/appointment-interface";
import { Page } from "../interface/page/page-interface";
import { ConsultationResponse } from "../interface/consultation/consultation-interface";

export const AppointmentService = {
  async getTimeTable(doctorId: number, params: any) {
    const { data } = await axiosInstance.get<TimeSlotResponse[]>(
      `/appointments/timetable/${doctorId}`,
      { params }
    );
    return data;
  },

  async findAllAppointments(params: any) {
    const { data } = await axiosInstance.get<Page<AppointmentResponse>>(
      "/appointments",
      {
        params,
      }
    );
    return data;
  },

  async countAppointments() {
    const { data } = await axiosInstance.get<number>("/appointments/count");
    return data;
  },

  async findAppointmentById(id: number) {
    const { data } = await axiosInstance.get<AppointmentResponse>(
      `/appointments/${id}`
    );
    return data;
  },

  async getAppointmentConsultation(id: number) {
    const { data } = await axiosInstance.get<ConsultationResponse>(
      `/appointments/${id}/consultation`
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

  async updateAppointment(id: number, updatedAppointment: AppointmentRequest) {
    const { data } = await axiosInstance.put<AppointmentResponse>(
      `/appointments/${id}`,
      updatedAppointment
    );
    return data;
  },

  async deleteAppointment(id: number) {
    const { data } = await axiosInstance.delete<any>(`/appointments/${id}`);
    return data;
  },
};
