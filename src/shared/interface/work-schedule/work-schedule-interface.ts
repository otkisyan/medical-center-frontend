import { DayOfWeekResponse } from "../day-of-week/day-of-week-interface";

export interface WorkScheduleResponse {
  id: number;
  dayOfWeekResponseDto: DayOfWeekResponse;
  workTimeStart: Date;
  workTimeEnd: Date;
}
