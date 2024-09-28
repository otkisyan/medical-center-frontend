"use client";
import Badge from "react-bootstrap/Badge";

import SpinnerCenter from "@/components/loading/spinner/SpinnerCenter";
import { useAuth } from "@/shared/context/UserContextProvider";
import { Role } from "@/shared/enum/role";
import useFetchDoctor from "@/shared/hooks/doctor/useFetchDoctor";
import useFetchReceptionist from "@/shared/hooks/receptionist/useFetchReceptionist";
import { formatDateToStringWithTime } from "@/shared/utils/date-utils";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export default function Home() {
  const tHomePage = useTranslations("HomePage");
  const tUser = useTranslations("User");
  const { hasAnyRole, userDetails } = useAuth();
  const [greeting, setGreeting] = useState("");
  const [role, setRole] = useState("");
  const [fullName, setFullName] = useState("");
  const { doctor, fetchDoctor, loadingDoctor } = useFetchDoctor(null);
  const { receptionist, fetchReceptionist, loadingReceptionist } =
    useFetchReceptionist(null);
  const currentDate = new Date();

  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour < 13) {
      setGreeting(tHomePage("welcome_morning_label"));
    } else if (currentHour < 18) {
      setGreeting(tHomePage("welcome_day_label"));
    } else {
      setGreeting(tHomePage("welcome_evening_label"));
    }
  }, [tHomePage]);

  useEffect(() => {
    if (hasAnyRole([Role.Doctor])) {
      setRole(tUser("roles.doctor"));
      if (userDetails) {
        fetchDoctor(userDetails.id);
      }
    } else if (hasAnyRole([Role.RECEPTIONIST])) {
      setRole(tUser("roles.receptionist"));
      if (userDetails) {
        fetchReceptionist(userDetails.id);
      }
    } else if (hasAnyRole([Role.ADMIN])) {
      setRole(tUser("roles.admin"));
      setFullName("admin");
    }
  }, [hasAnyRole, userDetails, fetchDoctor, fetchReceptionist, tUser]);

  useEffect(() => {
    if (doctor) {
      setFullName(
        doctor.surname + " " + doctor.name[0] + "." + doctor.middleName[0]
      );
    } else if (receptionist) {
      setFullName(
        receptionist.surname +
          " " +
          receptionist.name[0] +
          "." +
          receptionist.middleName[0]
      );
    } else {
      setFullName("admin");
    }
  }, [doctor, receptionist, userDetails]);

  return (
    <>
      <br></br>
      {loadingDoctor || loadingReceptionist ? (
        <SpinnerCenter></SpinnerCenter>
      ) : (
        <>
          <span>
            <Badge bg="secondary">
              {formatDateToStringWithTime(currentDate)}
            </Badge>
          </span>
          <br></br>
          <br></br>
          <h2>
            {greeting}, <span className="text-primary">{fullName}</span>
          </h2>
          <h3>
            <Badge bg="light" text="dark" id="role">
              {role}
            </Badge>
          </h3>
        </>
      )}
    </>
  );
}
