"use client";
import Select, { components } from "react-select";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Alert,
  Col,
  Form,
  Placeholder,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import { customReactSelectStyles } from "@/css/react-select";
import useFetchDoctorsOptions from "@/shared/hooks/doctor/useFetchDoctorsOptions";
import { useEffect, useState } from "react";
import useFetchDoctorTimeTable from "@/shared/hooks/doctor/useFetchDoctorTimeTable";
import SpinnerCenter from "@/components/spinner/SpinnerCenter";
import { AppointmentResponse } from "@/shared/interface/appointment/appointment-interface";
import { TimeSlotResponse } from "@/shared/interface/time-slot/time-slot-interface";
import {
  formatDateToHtml5,
  formatTimeSecondsToTime,
} from "@/shared/utils/date-utils";
import useFetchPatient from "@/shared/hooks/patients/useFetchPatient";
import { axiosInstance } from "@/axios.config";
import useSWR from "swr";

export default function TimeTablePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [doctorId, setDoctorId] = useState<number | null>(null);
  const [patientId, setPatientId] = useState<number | null>(null);
  const { patient, loadingPatient } = useFetchPatient(patientId);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const { loadingDoctorsOptions, doctorsOptions } = useFetchDoctorsOptions();
  const [initialLoading, setInitialLoading] = useState(true);
  const { timeTable, loadingTimeTable } = useFetchDoctorTimeTable(
    doctorId,
    currentDate
  );

  useEffect(() => {
    const appointmentIdParam = searchParams.get("appointmentId");
    const patientIdParam = searchParams.get("patientId");
    if (appointmentIdParam != null) {
      //
    } else if (patientIdParam != null) {
      setPatientId(Number(patientIdParam));
      //
    }
    setInitialLoading(false);
  }, [searchParams]);

  return initialLoading || loadingDoctorsOptions || loadingPatient ? (
    <>
      <br></br>
      <SpinnerCenter />
    </>
  ) : (
    <>
      <br></br>
      <Row>
        <Col sm lg={5}>
          <Form.Label>Лікар</Form.Label>
          <Select
            className="basic-single mb-3"
            classNamePrefix="select"
            isLoading={loadingDoctorsOptions}
            isSearchable={true}
            placeholder={"Оберіть лікаря"}
            name="doctorId"
            onChange={(e) => {
              setDoctorId(e.value);
            }}
            loadingMessage={() => "Завантаження..."}
            noOptionsMessage={() => "Кабінетів не знайдено"}
            options={doctorsOptions}
            styles={customReactSelectStyles}
          />
        </Col>
        {patientId && (
          <>
            {loadingPatient ? (
              <Col sm lg={3}>
                <Form.Label>Пацієнт</Form.Label>
                <Form.Control
                  className="mb-3"
                  max="9999-12-31"
                  type="text"
                  value=""
                  placeholder={"Завантаження..."}
                  disabled
                />
              </Col>
            ) : patient ? (
              <Col sm lg={3}>
                <Form.Label>Пацієнт</Form.Label>
                <Form.Control
                  className="mb-3"
                  max="9999-12-31"
                  type="text"
                  disabled
                  value={`${patient.surname} ${patient.name.charAt(
                    0
                  )}.${patient.middleName.charAt(0)}`}
                />
              </Col>
            ) : null}
          </>
        )}
        <Col sm lg={2}>
          <Form.Label>Дата</Form.Label>
          <Form.Control
            className="mb-3"
            max="9999-12-31"
            type="date"
            value={formatDateToHtml5(currentDate)}
            onChange={(e) => {
              setCurrentDate(new Date(e.target.value));
            }}
          />
        </Col>
      </Row>
      {loadingTimeTable ? (
        <SpinnerCenter />
      ) : timeTable && timeTable.length !== 0 ? (
        <Table striped>
          <thead>
            <tr>
              <th>Час</th>
              <th>Прийом</th>
            </tr>
          </thead>
          <tbody>
            {timeTable.map((timeSlot: TimeSlotResponse) => (
              <tr key={timeSlot.startTime.toString()}>
                <td>{`${formatTimeSecondsToTime(
                  timeSlot.startTime
                )} - ${formatTimeSecondsToTime(timeSlot.endTime)}`}</td>
                <td>
                  {timeSlot.appointments.length === 0 ? (
                    <span className="text-success">Вільно</span>
                  ) : (
                    timeSlot.appointments.map(
                      (appointment: AppointmentResponse) => (
                        <div key={appointment.id}>
                          <a
                            href={`/appointments/${appointment.id}`}
                            style={{ textDecoration: "none" }}
                            target="_blank"
                          >
                            <span>{`${
                              appointment.patient.surname
                            } ${appointment.patient.name.charAt(
                              0
                            )}.${appointment.patient.middleName.charAt(
                              0
                            )}. ${formatTimeSecondsToTime(
                              appointment.timeStart
                            )} - ${formatTimeSecondsToTime(
                              appointment.timeEnd
                            )}`}</span>
                          </a>
                        </div>
                      )
                    )
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <>
          <br></br>
          {doctorId && (
            <Alert
              variant="danger"
              className="text-center mx-auto"
              style={{ maxWidth: "400px" }}
            >
              Лікар не має графіку роботи на обрану дату!
            </Alert>
          )}
        </>
      )}
    </>
  );
}
