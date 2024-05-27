"use client";
import Badge from "react-bootstrap/Badge";

import { useEffect, useState } from "react";
import {
  formatDateToString,
  formatDateToStringWithTime,
} from "@/shared/utils/date-utils";
import { useAuth } from "@/shared/context/UserContextProvider";
import { Role } from "@/shared/enum/role";
import useFetchDoctor from "@/shared/hooks/doctor/useFetchDoctor";
import SpinnerCenter from "@/components/loading/spinner/SpinnerCenter";

export default function Home() {
  const { hasAnyRole, userDetails } = useAuth();
  const [greeting, setGreeting] = useState("");
  const [role, setRole] = useState("");
  const [fullName, setFullName] = useState("");
  const { doctor, fetchDoctor, loadingDoctor } = useFetchDoctor(null);
  const currentDate = new Date();

  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour < 13) {
      setGreeting("Добрий ранок");
    } else if (currentHour < 18) {
      setGreeting("Добрий день");
    } else {
      setGreeting("Добрий вечір");
    }
  }, []);

  useEffect(() => {
    if (hasAnyRole([Role.Doctor])) {
      setRole("Лікар");
      if (userDetails) {
        fetchDoctor(userDetails.id);
      }
    } else if (hasAnyRole([Role.RECEPTIONIST])) {
      setRole("Реєстратор");
    } else if (hasAnyRole([Role.ADMIN])) {
      setRole("Адміністратор");
      setFullName("admin");
    }
  }, [hasAnyRole, userDetails, fetchDoctor]);

  useEffect(() => {
    if (doctor) {
      setFullName(
        doctor.surname + " " + doctor.name[0] + "." + doctor.middleName[0]
      );
    }
  }, [doctor]);

  return (
    <>
      <br></br>
      {loadingDoctor ? (
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
