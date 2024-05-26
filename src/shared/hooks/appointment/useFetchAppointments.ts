import { AppointmentResponse } from "@/shared/interface/appointment/appointment-interface";
import { DoctorResponse } from "@/shared/interface/doctor/doctor-interface";
import { Page } from "@/shared/interface/page/page-interface";
import { AppointmentService } from "@/shared/service/appointment-service";
import { useCallback, useState } from "react";

export default function useFetchAppointments() {
  const initialAppointmentPageState: Page<AppointmentResponse> = {
    content: [],
    totalPages: 0,
    totalElements: 0,
    size: 0,
    number: 0,
    first: false,
    last: false,
  };

  const [appointmentPage, setAppointmentPage] = useState<
    Page<AppointmentResponse>
  >(initialAppointmentPageState);
  const [loadingAppointments, setLoadingAppointments] = useState(true);

  const fetchAppointments = useCallback(async (params: any) => {
    try {
      setLoadingAppointments(true);
      const data = await AppointmentService.findAllAppointments(params);
      console.log(data);
      setAppointmentPage(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoadingAppointments(false);
    }
  }, []);

  return { appointmentPage, loadingAppointments, fetchAppointments };
}
