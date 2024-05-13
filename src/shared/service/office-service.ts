import { axiosInstance } from "@/axios.config";
import { Page } from "@/shared/interface/page/page-interface";
import {
  OfficeRequest,
  OfficeResponse,
} from "../interface/office/office-interface";

export const OfficeService = {
  async findAllOffices(params: any) {
    const { data } = await axiosInstance.get<Page<OfficeResponse>>("/offices", {
      params,
    });
    return data;
  },

  async findAllOfficesNotPageable() {
    const { data } = await axiosInstance.get<OfficeResponse[]>("/offices");
    return data;
  },

  async countOffices() {
    const { data } = await axiosInstance.get<number>("/offices/count");
    return data;
  },

  async findOfficeById(id: number) {
    const { data } = await axiosInstance.get<OfficeResponse>(`/offices/${id}`);
    return data;
  },

  async addOffice(newOffice: OfficeResponse) {
    const { data } = await axiosInstance.post<OfficeResponse>(
      "/offices",
      newOffice
    );
    return data;
  },

  async updateOffice(id: number, updatedOffice: OfficeRequest) {
    const { data } = await axiosInstance.put<OfficeResponse>(
      `/offices/${id}`,
      updatedOffice
    );
    return data;
  },

  async deleteOffice(id: number) {
    const { data } = await axiosInstance.delete<any>(`/offices/${id}`);
    return data;
  },
};
