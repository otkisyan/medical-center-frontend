import { useCallback, useState } from "react";
import { Page } from "@/shared/interface/page/page-interface";
import { ReceptionistResponse } from "@/shared/interface/receptionist/receptionist-interface";
import { ReceptionistService } from "@/shared/service/receptionist-service";

export default function useFetchReceptionists() {
  const initialReceptionistPageState: Page<ReceptionistResponse> = {
    content: [],
    totalPages: 0,
    totalElements: 0,
    size: 0,
    number: 0,
    first: false,
    last: false,
  };

  const [receptionistPage, setReceptionistPage] = useState<
    Page<ReceptionistResponse>
  >(initialReceptionistPageState);
  const [loadingReceptionists, setLoadingReceptionists] = useState(true);

  const fetchReceptionists = useCallback(async (params: any) => {
    try {
      setLoadingReceptionists(true);
      const data = await ReceptionistService.findAllReceptionists(params);
      setReceptionistPage(data);
    } catch (error) {
      console.error("Error fetching receptionist data:", error);
    } finally {
      setLoadingReceptionists(false);
    }
  }, []);

  return { receptionistPage, loadingReceptionists, fetchReceptionists };
}
