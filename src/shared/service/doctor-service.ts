import { axiosInstance } from "@/axios.config";
import { Page } from "@/shared/interface/page/page-interface";
import {
  DoctorRequest,
  DoctorResponse,
  DoctorResponseWithUserCredentials,
} from "../interface/doctor/doctor-interface";
import { WorkScheduleResponse } from "../interface/work-schedule/work-schedule-interface";

export const DoctorService = {
  async findAllDoctors(params: any) {
    const { data } = await axiosInstance.get<Page<DoctorResponse>>("/doctors", {
      params,
    });
    return data;
  },

  async findDoctorsWorkSchedules(params: any, doctorId: number) {
    const { data } = await axiosInstance.get<Page<WorkScheduleResponse>>(
      `/doctors/${doctorId}/work-schedules`,
      {
        params,
      }
    );
    return data;
  },

  async countDoctors() {
    const { data } = await axiosInstance.get<number>("/doctors/count");
    return data;
  },

  async findDoctorById(id: number) {
    const { data } = await axiosInstance.get<DoctorResponse>(`/doctors/${id}`);
    return data;
  },

  async addDoctor(newDoctor: DoctorRequest) {
    const { data } =
      await axiosInstance.post<DoctorResponseWithUserCredentials>(
        "/doctors",
        newDoctor
      );
    return data;
  },

  async updateDoctor(id: number, updatedDoctor: DoctorRequest) {
    const { data } = await axiosInstance.put<DoctorResponse>(
      `/doctors/${id}`,
      updatedDoctor
    );
    return data;
  },

  async deleteDoctor(id: number) {
    const { data } = await axiosInstance.delete<any>(`/doctors/${id}`);
    return data;
  },
};
