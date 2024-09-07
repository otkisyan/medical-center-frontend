import { format } from "date-fns";
import moment from "moment";

export function formatDateToString(date: Date) {
  return format(date, "dd.MM.yyyy").toString();
}

export function formatDateToHtml5(date: Date) {
  return moment(date).format(moment.HTML5_FMT.DATE);
}

export function formatDateToStringWithTime(date: Date) {
  return moment(date).format("DD.MM.YYYY HH:mm");
}

export function formatTimeSecondsToTime(date: Date) {
  return moment(date, "HH:mm:ss").format("HH:mm");
}

export const timeStartBiggerThanEnd = (start: any, end: any) => {
  if (start && end) {
    const startTime = new Date(`1970-01-01T${start}`);
    const endTime = new Date(`1970-01-01T${end}`);
    if (startTime >= endTime) {
      return false;
    }
  }
  return true;
};
