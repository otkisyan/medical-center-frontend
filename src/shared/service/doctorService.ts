import { axiosInstance } from "@/axios.config";
import { Page } from "@/shared/interface/page/pageInterface";
import {
  DoctorRequest,
  DoctorResponse,
} from "../interface/doctor/doctorInterface";

export const DoctorService = {
  async findAllDoctors(params: any) {
    const { data } = await axiosInstance.get<Page<DoctorResponse>>("/doctors", {
      params,
    });
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
    const { data } = await axiosInstance.post<DoctorResponse>(
      "/doctors",
      newDoctor
    );
    return data;
  },

  async updateDoctor(id: number, updatedDoctor: DoctorRequest) {
    console.log(updatedDoctor);
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
