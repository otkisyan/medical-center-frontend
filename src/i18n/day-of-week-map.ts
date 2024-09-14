export type DayOfWeek =
  | "Понеділок"
  | "Вівторок"
  | "Середа"
  | "Четвер"
  | "П'ятниця"
  | "Субота"
  | "Неділя";

export const dayOfWeekMap: Record<DayOfWeek, string> = {
  Понеділок: "days_of_the_week.monday",
  Вівторок: "days_of_the_week.tuesday",
  Середа: "days_of_the_week.wednesday",
  Четвер: "days_of_the_week.thursday",
  "П'ятниця": "days_of_the_week.friday",
  Субота: "days_of_the_week.saturday",
  Неділя: "days_of_the_week.sunday",
};
