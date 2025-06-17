"use client";
import { AppointmentResponse } from "@/shared/interface/appointment/appointment-interface";
import { TimeSlotResponse } from "@/shared/interface/time-slot/time-slot-interface";
import { useTranslations } from "next-intl";
import { Calendar, momentLocalizer, SlotInfo } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "moment/locale/en-gb";
import "moment/locale/uk";
import { useState } from "react";
import { useLocale } from "next-intl";
import { notifyError } from "@/shared/toast/toast-notifiers";

const localizer = momentLocalizer(moment);

interface TimeTableProps {
  timeTable: TimeSlotResponse[] | null;
  appointment?: AppointmentResponse | null;
  currentDate: Date;
  onNavigate: (newDate: Date) => void;
  onSelectSlot: (slotInfo: SlotInfo) => void;
  selectable: boolean;
}

const TimeTable: React.FC<TimeTableProps> = ({
  timeTable,
  appointment,
  currentDate,
  onNavigate,
  onSelectSlot,
  selectable,
}) => {
  const locale = useLocale();
  const [conflictedEvents, setConflictedEvents] = useState<number[]>([]);
  const tTimetable = useTranslations("Timetable");
  const tTimetablePage = useTranslations("TimetablePage");
  const uniqueAppointments = new Set<number>();
  const events = timeTable
    ? timeTable.flatMap((timeSlot) =>
        timeSlot.appointments
          .filter((app) => {
            if (!uniqueAppointments.has(app.id) && app.id != appointment?.id) {
              uniqueAppointments.add(app.id);
              return true; // Include this appointment in the events
            }
            return false; // Skip duplicate appointment
          })
          .map((app: AppointmentResponse) => {
            const appointmentDateStart = moment(app.date).toDate();
            const timeStart = moment(app.timeStart, "HH:mm:ss").toDate();
            const timeEnd = moment(app.timeEnd, "HH:mm:ss").toDate();
            appointmentDateStart.setHours(timeStart.getHours());
            appointmentDateStart.setMinutes(timeStart.getMinutes());
            const appointmentDateEnd = moment(app.date).toDate();
            appointmentDateEnd.setHours(timeEnd.getHours());
            appointmentDateEnd.setMinutes(timeEnd.getMinutes());

            return {
              id: app.id,
              title: `${app.patient.surname} ${app.patient.name.charAt(
                0
              )}.${app.patient.middleName.charAt(0)}`,
              start: appointmentDateStart,
              end: appointmentDateEnd,
              allDay: false,
            };
          })
      )
    : [];

  const checkForConflicts = (slotInfo: { start: Date; end: Date }) => {
    const conflicts = events.filter((event) => {
      return slotInfo.start < event.end && slotInfo.end > event.start;
    });
    setConflictedEvents(conflicts.map((event) => event.id));
    return conflicts.length > 0;
  };

  const handleSlotSelect = (slotInfo: SlotInfo) => {
    if (checkForConflicts(slotInfo)) {
      notifyError(tTimetablePage("toasts.error.doctor_conflict"));
      return;
    } else {
      onSelectSlot(slotInfo);
    }
  };

  const slotPropGetter = () => {
    if (!timeTable) {
      // Make all slots red if timeTable is null
      return { style: { backgroundColor: "#de5c52", color: "white" } };
    }
    return {};
  };

  const messages = {
    week: tTimetable("week"),
    work_week: tTimetable("work_week"),
    day: tTimetable("day"),
    month: tTimetable("month"),
    previous: tTimetable("previous"),
    next: tTimetable("next"),
    today: tTimetable("today"),
    agenda: tTimetable("agenda"),
    showMore: (total: any) => tTimetable("showMore", { total }),
  };

  const handleNavigate = (newDate: Date) => {
    const formattedDate = moment(newDate).format("YYYY-MM-DD");
    onNavigate(new Date(formattedDate));
  };

  return (
    <Calendar
      localizer={localizer}
      defaultView="day"
      views={{
        month: false,
        week: false,
        work_week: false,
        day: true,
        agenda: false,
      }}
      min={
        timeTable
          ? moment(timeTable[0].startTime, "HH:mm:ss").toDate()
          : undefined
      }
      max={
        timeTable
          ? moment(timeTable[timeTable.length - 1].endTime, "HH:mm:ss").toDate()
          : undefined
      }
      events={events}
      culture={locale}
      date={currentDate}
      onSelectSlot={handleSlotSelect}
      onNavigate={handleNavigate}
      step={10}
      messages={messages}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 600 }}
      slotPropGetter={slotPropGetter}
      selectable={timeTable && selectable ? true : false}
      onSelectEvent={(event) => {
        window.open(`/appointments/${event.id}`, "_blank");
      }}
    />
  );
};

export default TimeTable;
