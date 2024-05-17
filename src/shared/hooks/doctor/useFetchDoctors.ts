import { useCallback, useState } from "react";
import { DoctorService } from "@/shared/service/doctor-service";
import { DoctorResponse } from "@/shared/interface/doctor/doctor-interface";
import { Page } from "@/shared/interface/page/page-interface";

export default function useFetchDoctors() {
  const initialDoctorPageState: Page<DoctorResponse> = {
    content: [],
    totalPages: 0,
    totalElements: 0,
    size: 0,
    number: 0,
    first: false,
    last: false,
  };

  const [doctorPage, setDoctorPage] = useState<Page<DoctorResponse>>(
    initialDoctorPageState
  );
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  const fetchDoctors = useCallback(async (params: any) => {
    try {
      setLoadingDoctors(true);
      const data = await DoctorService.findAllDoctors(params);
      setDoctorPage(data);
    } catch (error) {
      console.error("Error fetching doctor data:", error);
    } finally {
      setLoadingDoctors(false);
    }
  }, []);

  return { doctorPage, loadingDoctors, fetchDoctors };
}
