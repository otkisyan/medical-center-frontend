import { useCallback, useEffect, useState } from "react";
import { AppointmentService } from "@/shared/service/appointment-service";
import { AppointmentResponse } from "@/shared/interface/appointment/appointment-interface";

export default function useFetchAppointment() {
  const [appointment, setAppointment] = useState<AppointmentResponse | null>(
    null
  );
  const [loadingAppointment, setLoadingAppointment] = useState(true);

  const fetchAppointment = useCallback(async (id: number) => {
    try {
      setLoadingAppointment(true);
      const data = await AppointmentService.findAppointmentById(id);
      setAppointment(data);
    } catch (error) {
      console.error("Error fetching appointment:", error);
      throw error;
    } finally {
      setLoadingAppointment(false);
    }
  }, []);

  return {
    appointment,
    loadingAppointment,
    fetchAppointment,
    setAppointment,
  };
}
