import { OfficeService } from "@/shared/service/office-service";
import { useCallback, useEffect, useState } from "react";

const useFetchOfficesCount = () => {
  const [officesCount, setOfficesCount] = useState<number>(0);
  const [loadingOfficesCount, setLoadingOfficesCount] = useState(true);

  const fetchOfficesCount = useCallback(async () => {
    try {
      setLoadingOfficesCount(true);
      const count = await OfficeService.countOffices();
      setOfficesCount(count);
    } catch (error) {
      console.error("Error fetching office count:", error);
    } finally {
      setLoadingOfficesCount(false);
    }
  }, []);

  useEffect(() => {
    fetchOfficesCount();
  }, [fetchOfficesCount]);

  return { officesCount, loadingOfficesCount };
};

export default useFetchOfficesCount;
