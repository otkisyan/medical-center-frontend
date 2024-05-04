import { axiosInstance } from "@/api.config";
import { IPatient } from "@/shared/interface/patient/patient.interface";
import { IPage } from "@/shared/interface/page/page.interface";

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

  async findPatientById(id: number) {
    const {data} = await axiosInstance.get<IPatient>(`/patients/${id}`)
    return data;
  },

  async updatePatient(id: number, updatedPatient: IPatient){
    const {data} = await axiosInstance.put<IPatient>(`/patients/${id}`, {
      surname: updatedPatient.surname,
      name: updatedPatient.name,
      middleName: updatedPatient.middleName,
      address: updatedPatient.address,
      phone: updatedPatient.phone,
      messengerContact: updatedPatient.messengerContact,
      preferentialCategory: updatedPatient.preferentialCategory,
      birthDate: updatedPatient.birthDate,
    })
    return data;
  }
};
