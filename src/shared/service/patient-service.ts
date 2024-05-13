import { axiosInstance } from "@/axios.config";
import {
  PatientRequest,
  PatientResponse,
} from "@/shared/interface/patient/patient-interface";
import { Page } from "@/shared/interface/page/page-interface";

export const PatientService = {
  async findAllPatients(params: any) {
    const { data } = await axiosInstance.get<Page<PatientResponse>>(
      "/patients",
      {
        params,
      }
    );
    return data;
  },

  async countPatients() {
    const { data } = await axiosInstance.get<number>("/patients/count");
    return data;
  },

  async findPatientById(id: number) {
    const { data } = await axiosInstance.get<PatientResponse>(
      `/patients/${id}`
    );
    return data;
  },

  async addPatient(newPatient: PatientRequest) {
    const { data } = await axiosInstance.post<PatientResponse>(
      "/patients",
      newPatient
    );
    return data;
  },

  async updatePatient(id: number, updatedPatient: PatientRequest) {
    const { data } = await axiosInstance.put<PatientResponse>(
      `/patients/${id}`,
      updatedPatient
    );
    return data;
  },

  async deletePatient(id: number) {
    const { data } = await axiosInstance.delete<any>(`/patients/${id}`);
    return data;
  },
};
