import { ConsultationResponse } from "@/shared/interface/consultation/consultation-interface";
import { AppointmentService } from "@/shared/service/appointment-service";
import { useCallback, useState } from "react";

export default function useFetchAppointmentConsultation() {
  const [consultation, setConsultation] = useState<ConsultationResponse | null>(
    null
  );
  const [loadingConsultation, setLoadingConsultation] = useState(true);

  const fetchAppointmentConsultation = useCallback(async (id: number) => {
    try {
      setLoadingConsultation(true);
      const data = await AppointmentService.getAppointmentConsultation(id);
      setConsultation(data);
    } catch (error) {
      console.error("Error fetching appointment consultation:", error);
    } finally {
      setLoadingConsultation(false);
    }
  }, []);

  return {
    consultation,
    loadingConsultation,
    fetchAppointmentConsultation,
    setConsultation,
    setLoadingConsultation,
  };
}
