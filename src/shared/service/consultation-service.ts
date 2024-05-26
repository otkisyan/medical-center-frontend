import { axiosInstance } from "@/axios.config";
import {
  ConsultationRequest,
  ConsultationResponse,
} from "../interface/consultation/consultation-interface";

export const ConsultationService = {
  async updateConsultation(
    id: number,
    updatedConsultation: ConsultationRequest
  ) {
    const { data } = await axiosInstance.put<ConsultationResponse>(
      `/consultations/${id}`,
      updatedConsultation
    );
    return data;
  },
};
