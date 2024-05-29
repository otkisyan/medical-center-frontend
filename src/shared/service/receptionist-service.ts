import { axiosInstance } from "@/axios.config";
import { Page } from "@/shared/interface/page/page-interface";
import { DoctorResponse } from "../interface/doctor/doctor-interface";
import {
  ReceptionistRequest,
  ReceptionistResponse,
  ReceptionistResponseWithUserCredentials,
} from "../interface/receptionist/receptionist-interface";

export const ReceptionistService = {
  async findAllReceptionists(params: any) {
    const { data } = await axiosInstance.get<Page<ReceptionistResponse>>(
      "/receptionists",
      {
        params,
      }
    );
    return data;
  },

  async countReceptionists() {
    const { data } = await axiosInstance.get<number>("/receptionists/count");
    return data;
  },

  async findReceptionistById(id: number) {
    const { data } = await axiosInstance.get<ReceptionistResponse>(
      `/receptionists/${id}`
    );
    return data;
  },

  async addReceptionist(newReceptionist: ReceptionistRequest) {
    const { data } =
      await axiosInstance.post<ReceptionistResponseWithUserCredentials>(
        "/receptionists",
        newReceptionist
      );
    return data;
  },

  async updateReceptionist(
    id: number,
    updatedReceptionist: ReceptionistRequest
  ) {
    const { data } = await axiosInstance.put<DoctorResponse>(
      `/receptionists/${id}`,
      updatedReceptionist
    );
    return data;
  },

  async deleteReceptionist(id: number) {
    const { data } = await axiosInstance.delete<any>(`/receptionists/${id}`);
    return data;
  },
};
