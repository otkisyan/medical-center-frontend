"use client";
import { AppointmentResponse } from "@/shared/interface/appointment/appointment-interface";
import { TimeSlotResponse } from "@/shared/interface/time-slot/time-slot-interface";
import { formatTimeSecondsToTime } from "@/shared/utils/date-utils";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Table } from "react-bootstrap";

interface TimeTableProps {
  timeTable: TimeSlotResponse[];
  appointment?: AppointmentResponse | null;
}

const TimeTable: React.FC<TimeTableProps> = ({ timeTable, appointment }) => {
  const tTimetable = useTranslations("Timetable");
  return (
    <Table striped>
      <thead>
        <tr>
          <th>{tTimetable("time_header")}</th>
          <th>{tTimetable("appointment_header")}</th>
        </tr>
      </thead>
      <tbody>
        {timeTable.map((timeSlot) => {
          const filteredAppointments = timeSlot.appointments.filter(
            (timeSlotAppointment) => timeSlotAppointment.id !== appointment?.id
          );
          return (
            <tr key={timeSlot.startTime.toString()}>
              <td>{`${formatTimeSecondsToTime(
                timeSlot.startTime
              )} - ${formatTimeSecondsToTime(timeSlot.endTime)}`}</td>
              <td>
                {filteredAppointments.length === 0 ? (
                  <span className="text-success">
                    {tTimetable("status_free")}
                  </span>
                ) : (
                  filteredAppointments.map((timeSlotAppointment) => (
                    <div key={timeSlotAppointment.id}>
                      <Link
                        href={`/appointments/${timeSlotAppointment.id}`}
                        style={{ textDecoration: "none" }}
                        target="_blank"
                      >
                        <span>{`${
                          timeSlotAppointment.patient.surname
                        } ${timeSlotAppointment.patient.name.charAt(
                          0
                        )}.${timeSlotAppointment.patient.middleName.charAt(
                          0
                        )}. ${formatTimeSecondsToTime(
                          timeSlotAppointment.timeStart
                        )} - ${formatTimeSecondsToTime(
                          timeSlotAppointment.timeEnd
                        )}`}</span>
                      </Link>
                    </div>
                  ))
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default TimeTable;
