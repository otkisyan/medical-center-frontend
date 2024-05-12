import { format } from "date-fns";
import moment from "moment";

export function formatDateToString(date: Date) {
  return format(date, "dd.MM.yyyy").toString();
}

export function formatTimeSecondsToTime(date: Date) {
  return moment(date, "HH:mm:ss").format("HH:mm");
}
