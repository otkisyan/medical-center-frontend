import { useCallback, useEffect, useMemo, useState } from "react";
import { TimeSlotResponse } from "@/shared/interface/time-slot/time-slot-interface";
import { AppointmentService } from "@/shared/service/appointment-service";
import { formatDateToHtml5 } from "@/shared/utils/date-utils";

export default function useFetchDoctorTimeTable(
  doctorId: number | null,
  date: Date
) {
  const [timeTable, setTimeTable] = useState<TimeSlotResponse[] | null>(null);
  const [loadingTimeTable, setLoadingTimeTable] = useState(true);
  const [error, setError] = useState<any | null>(null);
  const params = useMemo(
    () => ({
      date: formatDateToHtml5(date),
    }),
    [date]
  );

  const fetchTimeTable = useCallback(async (id: number, params: any) => {
    try {
      setLoadingTimeTable(true);
      const data = await AppointmentService.getTimeTable(id, params);
      setTimeTable(data);
      setError(null);
    } catch (error: any) {
      if (error.response) {
        setError({
          message: error.response.message,
          status: error.response.status,
        });
      } else {
        setError(error);
      }
      setTimeTable(null);
      console.error("Error fetching timetable:", error);
    } finally {
      setLoadingTimeTable(false);
    }
  }, []);

  useEffect(() => {
    if (doctorId) {
      fetchTimeTable(doctorId, params);
    } else {
      setLoadingTimeTable(false);
    }

    const interval = setInterval(() => {
      if (doctorId) {
        fetchTimeTable(doctorId, params);
      }
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [fetchTimeTable, doctorId, params]);

  return { timeTable, loadingTimeTable, fetchTimeTable, setTimeTable, error };
}
