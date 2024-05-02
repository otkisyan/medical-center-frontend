import { axiosInstance } from "@/api.config";
import { IPatient } from "@/interface/patient/patient.interface";
import { IPage } from "@/interface/page/page.interface";

export const PatientService = {
  async findAllPatients(params: any) {
    const { data } = await axiosInstance.get<IPage<IPatient>>("/patients", {
      params,
    });
    return data;
  },

  async countPatients() {
    const { data } = await axiosInstance.get<number>("/patients/count");
    return data;
  },
};
