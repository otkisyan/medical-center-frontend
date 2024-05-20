import { useState, useEffect, useCallback, useMemo } from "react";
import { OfficeService } from "../../service/office-service";
import { OfficeResponse } from "../../interface/office/office-interface";

const useFetchOfficesOptions = () => {
  const initialOfficesOptions = useMemo(
    () => [{ value: "", label: "Без кабінету" }],
    []
  );

  const [loadingOfficesOptions, setLoadingOffices] = useState(false);
  const [officesOptions, setOfficesOptions] = useState<any[]>([]);

  const defaultOfficeOption = officesOptions.find(
    (option) => option.value === ""
  );

  const findOfficeOptionByValue = (value: any) =>
    officesOptions.find((option) => option.value === value);

  const fetchAllOffices = async () => {
    let allOffices: any = [];
    let params = {
      page: 0,
    };
    let totalPages = 1;

    try {
      while (params.page < totalPages) {
        const data = await OfficeService.findAllOffices(params);
        allOffices = [...allOffices, ...data.content];
        totalPages = data.totalPages;
        params.page++;
      }
      return allOffices;
    } catch (error) {
      console.error("Error fetching offices:", error);
    }
  };

  const fetchOffices = useCallback(async () => {
    try {
      setLoadingOffices(true);
      const offices = await fetchAllOffices();
      if (offices) {
        setOfficesOptions([
          ...initialOfficesOptions,
          ...offices.map((office: OfficeResponse) => ({
            value: office.id,
            label: office.number + " - " + office.name,
          })),
        ]);
      }
    } catch (error) {
      console.error("Error fetching offices:", error);
    } finally {
      setLoadingOffices(false);
    }
  }, [initialOfficesOptions]);

  useEffect(() => {
    fetchOffices();
  }, [fetchOffices]);

  return {
    loadingOfficesOptions,
    officesOptions,
    defaultOfficeOption,
    findOfficeOptionByValue,
  };
};

export default useFetchOfficesOptions;
