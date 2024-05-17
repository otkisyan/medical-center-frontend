import { useCallback, useEffect, useMemo, useState } from "react";
import { PatientService } from "@/shared/service/patient-service";
import { PatientResponse } from "../../interface/patient/patient-interface";
import { Page } from "../../interface/page/page-interface";

export default function useFetchPatients() {
  const initialPatientsPageState: Page<PatientResponse> = {
    content: [],
    totalPages: 0,
    totalElements: 0,
    size: 0,
    number: 0,
    first: false,
    last: false,
  };

  const [patientPage, setPatientPage] = useState<Page<PatientResponse>>(
    initialPatientsPageState
  );
  const [loadingPatients, setLoadingPatients] = useState(true);

  const fetchPatients = useCallback(async (params: any) => {
    try {
      setLoadingPatients(true);
      const data = await PatientService.findAllPatients(params);
      setPatientPage(data);
    } catch (error) {
      console.error("Error fetching patient data:", error);
    } finally {
      setLoadingPatients(false);
    }
  }, []);

  return { patientPage, loadingPatients, fetchPatients };
}
