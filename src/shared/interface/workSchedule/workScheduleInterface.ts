import { DayOfWeekResponse } from "../dayOfWeek/dayOfWeekInterface";

export interface WorkScheduleResponse {
  id: number;
  dayOfWeekResponseDto: DayOfWeekResponse;
  workTimeStart: Date;
  workTimeEnd: Date;
}
