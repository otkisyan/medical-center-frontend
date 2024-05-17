import { DoctorResponse } from "@/shared/interface/doctor/doctor-interface";
import { DoctorService } from "@/shared/service/doctor-service";
import { useState, useEffect, useCallback, useMemo } from "react";

const useFetchDoctorsOptions = () => {
  const [loadingDoctorsOptions, setLoadingDoctors] = useState(false);
  const [doctorsOptions, setDoctorsOptions] = useState<any[]>([]);
  const defaultDoctorOption = doctorsOptions.find(
    (option) => option.value === ""
  );
  const findDoctorOptionByValue = (value: any) =>
    doctorsOptions.find((option) => option.value === value);

  const fetchAllDoctors = async () => {
    let allDoctors: any = [];
    let params = {
      page: 0,
    };
    let totalPages = 1;

    try {
      while (params.page < totalPages) {
        const data = await DoctorService.findAllDoctors(params);
        allDoctors = [...allDoctors, ...data.content];
        totalPages = data.totalPages;
        params.page++;
      }
      return allDoctors;
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const fetchDoctors = useCallback(async () => {
    try {
      setLoadingDoctors(true);
      const doctors = await fetchAllDoctors();
      if (doctors) {
        setDoctorsOptions([
          ...doctors.map((doctor: DoctorResponse) => ({
            value: doctor.id,
            label:
              doctor.surname + " " + doctor.name[0] + "." + doctor.surname[0],
          })),
        ]);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoadingDoctors(false);
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  return {
    loadingDoctorsOptions,
    doctorsOptions,
    defaultDoctorOption,
    findDoctorOptionByValue,
  };
};

export default useFetchDoctorsOptions;
