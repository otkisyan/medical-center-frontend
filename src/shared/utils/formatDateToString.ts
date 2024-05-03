import { format } from "date-fns";

export function formatDateToString(date: Date) {
    return format(date, "dd.MM.yyyy").toString()
}