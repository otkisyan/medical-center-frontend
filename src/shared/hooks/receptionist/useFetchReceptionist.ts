import { DoctorResponse } from "@/shared/interface/doctor/doctor-interface";
import { ReceptionistResponse } from "@/shared/interface/receptionist/receptionist-interface";
import { DoctorService } from "@/shared/service/doctor-service";
import { ReceptionistService } from "@/shared/service/receptionist-service";
import { useCallback, useEffect, useState } from "react";

export default function useFetchReceptionist(receptionistId: number | null) {
  const [receptionist, setReceptionist] = useState<ReceptionistResponse | null>(
    null
  );
  const [loadingReceptionist, setLoadingReceptionist] = useState(true);

  const fetchReceptionist = useCallback(async (id: number) => {
    try {
      setLoadingReceptionist(true);
      const data = await ReceptionistService.findReceptionistById(id);
      setReceptionist(data);
    } catch (error) {
      console.error("Error fetching receptionist:", error);
    } finally {
      setLoadingReceptionist(false);
    }
  }, []);

  useEffect(() => {
    if (receptionistId) {
      fetchReceptionist(receptionistId);
    } else {
      setLoadingReceptionist(false);
    }
  }, [fetchReceptionist, receptionistId]);

  return {
    receptionist,
    loadingReceptionist,
    setReceptionist,
    fetchReceptionist,
  };
}
