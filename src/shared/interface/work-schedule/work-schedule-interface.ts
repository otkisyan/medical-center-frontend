import { DayOfWeekResponse } from "../day-of-week/day-of-week-interface";

export interface WorkScheduleResponse {
  id: number;
  dayOfWeekResponseDto: DayOfWeekResponse;
  workTimeStart: Date;
  workTimeEnd: Date;
}

export interface WorkScheduleRequest {
  id: number;
  workTimeStart: Date;
  workTimeEnd: Date;
}

export const convertWorkScheduleResponseToWorkScheduleRequest = (
  workScheduleResponse: WorkScheduleResponse
) => {
  const workScheduleRequest: WorkScheduleRequest = {
    id: workScheduleResponse.id,
    workTimeStart: workScheduleResponse.workTimeStart,
    workTimeEnd: workScheduleResponse.workTimeEnd,
  };
  return workScheduleRequest;
};
