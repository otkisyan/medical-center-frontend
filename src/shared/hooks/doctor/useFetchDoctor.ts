import { useCallback, useEffect, useState } from "react";
import { DoctorService } from "@/shared/service/doctor-service";
import { DoctorResponse } from "@/shared/interface/doctor/doctor-interface";
import { delay } from "@/shared/utils/delay";

export default function useFetchDoctor(doctorId: number | null) {
  const [doctor, setDoctor] = useState<DoctorResponse | null>(null);
  const [loadingDoctor, setLoadingDoctor] = useState(true);

  const fetchDoctor = useCallback(async (id: number) => {
    try {
      setLoadingDoctor(true);
      const data = await DoctorService.findDoctorById(id);
      setDoctor(data);
    } catch (error) {
      console.error("Error fetching doctor:", error);
    } finally {
      setLoadingDoctor(false);
    }
  }, []);

  useEffect(() => {
    if (doctorId) {
      fetchDoctor(doctorId);
    } else {
      setLoadingDoctor(false);
    }
  }, [fetchDoctor, doctorId]);

  return { doctor, loadingDoctor, setDoctor, fetchDoctor };
}
