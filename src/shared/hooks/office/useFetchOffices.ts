import { OfficeResponse } from "@/shared/interface/office/office-interface";
import { Page } from "@/shared/interface/page/page-interface";
import { OfficeService } from "@/shared/service/office-service";
import { useCallback, useState } from "react";

export default function useFetchOffices() {
  const initialOfficePageState: Page<OfficeResponse> = {
    content: [],
    totalPages: 0,
    totalElements: 0,
    size: 0,
    number: 0,
    first: false,
    last: false,
  };

  const [officePage, setOfficesPage] = useState<Page<OfficeResponse>>(
    initialOfficePageState
  );
  const [loadingOffices, setLoadingOffices] = useState(true);

  const fetchOffices = useCallback(async (params: any) => {
    try {
      setLoadingOffices(true);
      const data = await OfficeService.findAllOffices(params);
      console.log(data);
      setOfficesPage(data);
    } catch (error) {
      console.error("Error fetching offices:", error);
    } finally {
      setLoadingOffices(false);
    }
  }, []);

  return {
    officePage,
    loadingOffices,
    fetchOffices,
  };
}
