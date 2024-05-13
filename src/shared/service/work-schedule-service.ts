import { axiosInstance } from "@/axios.config";
import {
  WorkScheduleRequest,
  WorkScheduleResponse,
} from "../interface/work-schedule/work-schedule-interface";

export const WorkScheduleService = {
  async updateWorkSchedule(
    id: number,
    updatedWorkSchedule: WorkScheduleRequest
  ) {
    const { data } = await axiosInstance.put<WorkScheduleResponse>(
      `/work-schedules/${id}`,
      updatedWorkSchedule
    );
    return data;
  },
};
