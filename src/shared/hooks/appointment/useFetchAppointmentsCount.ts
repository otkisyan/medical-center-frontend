import { AppointmentService } from "@/shared/service/appointment-service";
import { useCallback, useEffect, useState } from "react";

const useFetchAppointmentsCount = () => {
  const [appointmentsCount, setAppointmentsCount] = useState<number>(0);
  const [loadingAppointmentsCount, setLoadingAppointmentsCount] =
    useState(true);

  const fetchAppointmentsCount = useCallback(async () => {
    try {
      setLoadingAppointmentsCount(true);
      const count = await AppointmentService.countAppointments();
      setAppointmentsCount(count);
    } catch (error) {
      console.error("Error fetching appointments count:", error);
    } finally {
      setLoadingAppointmentsCount(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointmentsCount();
  }, [fetchAppointmentsCount]);

  return {
    appointmentsCount,
    loadingAppointmentsCount,
  };
};

export default useFetchAppointmentsCount;
