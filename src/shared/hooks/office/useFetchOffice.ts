import { OfficeResponse } from "@/shared/interface/office/office-interface";
import { OfficeService } from "@/shared/service/office-service";
import { useCallback, useEffect, useState } from "react";

export default function useFetchOffice(officeId: number | null) {
  const [office, setOffice] = useState<OfficeResponse | null>(null);
  const [loadingOffice, setLoadingOffice] = useState(true);

  const fetchOffice = useCallback(async (id: number) => {
    try {
      setLoadingOffice(true);
      const data = await OfficeService.findOfficeById(id);
      setOffice(data);
    } catch (error) {
      console.error("Error fetching office:", error);
    } finally {
      setLoadingOffice(false);
    }
  }, []);

  useEffect(() => {
    if (officeId) {
      fetchOffice(officeId);
    } else {
      setLoadingOffice(false);
    }
  }, [fetchOffice, officeId]);

  return { office, loadingOffice, setOffice };
}
