import { useCallback, useEffect, useState } from "react";
import { PatientService } from "@/shared/service/patient-service";
import { PatientResponse } from "@/shared/interface/patient/patient-interface";

export default function useFetchPatient(patientId: number) {
  const [patient, setPatient] = useState<PatientResponse | null>(null);
  const [loadingPatient, setLoadingPatient] = useState(true);

  const fetchPatient = useCallback(async (id: number) => {
    try {
      setLoadingPatient(true);
      const data = await PatientService.findPatientById(id);
      setPatient(data);
    } catch (error) {
      console.error("Error fetching patient:", error);
    } finally {
      setLoadingPatient(false);
    }
  }, []);

  useEffect(() => {
    fetchPatient(patientId);
  }, [fetchPatient, patientId]);

  return { patient, loadingPatient, setPatient };
}
