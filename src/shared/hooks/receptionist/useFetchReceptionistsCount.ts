import { ReceptionistService } from "@/shared/service/receptionist-service";
import { useCallback, useEffect, useState } from "react";

const useFetchReceptionistsCount = () => {
  const [receptionistsCount, setReceptionistsCount] = useState<number>(0);
  const [loadingReceptionistsCount, setLoadingReceptionistsCount] =
    useState(true);

  const fetchReceptionistsCount = useCallback(async () => {
    try {
      setLoadingReceptionistsCount(true);
      const count = await ReceptionistService.countReceptionists();
      setReceptionistsCount(0);
    } catch (error) {
      console.error("Error fetching receptionists count:", error);
    } finally {
      setLoadingReceptionistsCount(false);
    }
  }, []);

  useEffect(() => {
    fetchReceptionistsCount();
  }, [fetchReceptionistsCount]);

  return { receptionistsCount, loadingReceptionistsCount };
};

export default useFetchReceptionistsCount;
