import { useCallback, useEffect, useMemo, useState } from "react";
import { TimeSlotResponse } from "@/shared/interface/time-slot/time-slot-interface";
import { AppointmentService } from "@/shared/service/appointment-service";
import { formatDateToHtml5 } from "@/shared/utils/date-utils";
import { delay } from "@/shared/utils/delay";

export default function useFetchDoctorTimeTable(
  doctorId: number | null,
  date: Date
) {
  const [timeTable, setTimeTable] = useState<TimeSlotResponse[] | null>(null);
  const [loadingTimeTable, setLoadingTimeTable] = useState(true);
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
    } catch (error) {
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
  }, [fetchTimeTable, doctorId, params]);

  return { timeTable, loadingTimeTable, fetchTimeTable, setTimeTable };
}
