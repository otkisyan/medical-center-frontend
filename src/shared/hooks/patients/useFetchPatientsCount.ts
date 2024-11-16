import { useCallback, useEffect, useMemo, useState } from "react";
import { PatientService } from "@/shared/service/patient-service";

const useFetchPatientsCount = () => {
  const [patientsCount, setPatientsCount] = useState<number>(0);
  const [loadingPatientsCount, setLoadingPatientsCount] = useState(true);
  const [error, setError] = useState<any | null>(null);

  const fetchPatientsCount = useCallback(async () => {
    try {
      setLoadingPatientsCount(true);
      const count = await PatientService.countPatients();
      setPatientsCount(count);
    } catch (error) {
      setError(error);
      console.error("Error fetching patient count:", error);
    } finally {
      setLoadingPatientsCount(false);
    }
  }, []);

  useEffect(() => {
    fetchPatientsCount();
  }, [fetchPatientsCount]);

  return { patientsCount, loadingPatientsCount, error };
};

export default useFetchPatientsCount;
