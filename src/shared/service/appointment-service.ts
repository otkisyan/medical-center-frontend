import { axiosInstance } from "@/axios.config";
import { TimeSlotResponse } from "../interface/time-slot/time-slot-interface";

export const AppointmentService = {
  async getTimeTable(doctorId: number, params: any) {
    const { data } = await axiosInstance.get<TimeSlotResponse[]>(
      `/appointments/timetable/${doctorId}`,
      { params }
    );
    return data;
  },
};
