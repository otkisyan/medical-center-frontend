import { useCallback, useEffect, useState } from "react";
import { DoctorService } from "@/shared/service/doctor-service";

const useFetchDoctorsCount = () => {
  const [doctorsCount, setDoctorsCount] = useState<number>(0);
  const [loadingDoctorsCount, setLoadingDoctorsCount] = useState(true);

  const fetchDoctorsCount = useCallback(async () => {
    try {
      setLoadingDoctorsCount(true);
      const count = await DoctorService.countDoctors();
      setDoctorsCount(count);
    } catch (error) {
      console.error("Error fetching doctor count:", error);
    } finally {
      setLoadingDoctorsCount(false);
    }
  }, []);

  useEffect(() => {
    fetchDoctorsCount();
  }, [fetchDoctorsCount]);

  return { doctorsCount, loadingDoctorsCount };
};

export default useFetchDoctorsCount;
