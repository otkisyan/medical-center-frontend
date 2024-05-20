import { DoctorResponse } from "@/shared/interface/doctor/doctor-interface";
import { DoctorService } from "@/shared/service/doctor-service";
import { useState, useEffect, useCallback } from "react";

export default function useFetchDoctorsOptions() {
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

  const fetchDoctorsOptions = useCallback(async () => {
    try {
      setLoadingDoctors(true);
      const doctors = await fetchAllDoctors();
      if (doctors) {
        setDoctorsOptions([
          ...doctors.map((doctor: DoctorResponse) => ({
            value: doctor.id,
            label:
              doctor.surname +
              " " +
              doctor.name[0] +
              "." +
              doctor.middleName[0] +
              " - " +
              doctor.medicalSpecialty,
          })),
        ]);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoadingDoctors(false);
    }
  }, []);

  return {
    loadingDoctorsOptions,
    doctorsOptions,
    defaultDoctorOption,
    findDoctorOptionByValue,
    setDoctorsOptions,
    fetchDoctorsOptions,
  };
}
