import { useCallback, useEffect, useState } from "react";
import { WorkScheduleResponse } from "../interface/work-schedule/work-schedule-interface";
import { DoctorService } from "../service/doctor-service";

const useFetchAllDoctorWorkSchedules = (doctorId: number) => {
  const [doctorWorkSchedules, setDoctorWorkSchedules] = useState<
    WorkScheduleResponse[]
  >([]);
  const [loadingDoctorWorkSchedules, setLoadingDoctorWorkSchedules] =
    useState(true);

  const fetchAllDoctorWorkSchedules = useCallback(async () => {
    let allWorkSchedules: WorkScheduleResponse[] = [];
    let requestParams = {
      page: 0,
    };
    let totalPages = 1;
    try {
      while (requestParams.page < totalPages) {
        const data = await DoctorService.findDoctorsWorkSchedules(
          requestParams,
          doctorId
        );
        allWorkSchedules = [...allWorkSchedules, ...data.content];
        totalPages = data.totalPages;
        requestParams.page++;
      }
      return allWorkSchedules;
    } catch (error) {
      console.error("Error fetching work schedules:", error);
    }
  }, [doctorId]);

  useEffect(() => {
    const fetchDoctorWorkSchedules = async () => {
      try {
        setLoadingDoctorWorkSchedules(true);
        const workSchedules = await fetchAllDoctorWorkSchedules();
        if (workSchedules) {
          setDoctorWorkSchedules(workSchedules);
        }
      } catch (error) {
        console.error("Error fetching work schedules:", error);
      } finally {
        setLoadingDoctorWorkSchedules(false);
      }
    };

    fetchDoctorWorkSchedules();
  }, [fetchAllDoctorWorkSchedules]);

  return {
    doctorWorkSchedules,
    loadingDoctorWorkSchedules,
    setDoctorWorkSchedules,
  };
};

export default useFetchAllDoctorWorkSchedules;
