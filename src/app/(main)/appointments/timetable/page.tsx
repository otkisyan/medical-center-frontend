"use client";
import SpinnerCenter from "@/components/loading/spinner/SpinnerCenter";
import TimeTable from "@/components/timetable/TimeTable";
import { customReactSelectStyles } from "@/css/react-select";
import { useAuth } from "@/shared/context/UserContextProvider";
import { Role } from "@/shared/enum/role";
import useFetchAppointment from "@/shared/hooks/appointment/useFetchAppointment";
import useFetchDoctor from "@/shared/hooks/doctor/useFetchDoctor";
import useFetchDoctorTimeTable from "@/shared/hooks/doctor/useFetchDoctorTimeTable";
import useFetchDoctorsOptions from "@/shared/hooks/doctor/useFetchDoctorsOptions";
import useFetchPatient from "@/shared/hooks/patients/useFetchPatient";
import { AppointmentService } from "@/shared/service/appointment-service";
import { notifyError, notifySuccess } from "@/shared/toast/toast-notifiers";
import { formatDateToHtml5 } from "@/shared/utils/date-utils";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Breadcrumb,
  Button,
  Col,
  Form,
  InputGroup,
  Modal,
  Row,
} from "react-bootstrap";
import Select from "react-select";

export default function TimeTablePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { hasAnyRole, userDetails } = useAuth();

  const [isDoctor, setIsDoctor] = useState<boolean>(false);
  const [doctorId, setDoctorId] = useState<number | null>(null);
  const [patientId, setPatientId] = useState<number | null>(null);
  const { patient, loadingPatient, setPatient } = useFetchPatient(patientId);
  const { doctor, loadingDoctor } = useFetchDoctor(doctorId);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const {
    loadingDoctorsOptions,
    doctorsOptions,
    findDoctorOptionByValue,
    fetchDoctorsOptions,
  } = useFetchDoctorsOptions();
  const [initialLoading, setInitialLoading] = useState(true);
  const { timeTable, loadingTimeTable, fetchTimeTable, setTimeTable } =
    useFetchDoctorTimeTable(doctorId, currentDate);
  const { appointment, loadingAppointment, fetchAppointment, setAppointment } =
    useFetchAppointment();
  const appointmentTimeInitialState = {
    timeStart: "",
    timeEnd: "",
  };
  const [appointmentTime, setAppointmentTime] = useState<any>(
    appointmentTimeInitialState
  );
  const [defaultDoctorOption, setDefaultDoctorOption] = useState<any>(null);
  const selectDoctorRef = useRef<any>();

  const generateDefaultDoctorOption = useCallback(() => {
    if (doctor) {
      return {
        value: doctor.id,
        label:
          doctor.surname +
          " " +
          doctor.name[0] +
          "." +
          doctor.middleName[0] +
          " - " +
          doctor.medicalSpecialty,
      };
    }
  }, [doctor]);

  const isSearchParamsEmpty = useCallback(() => {
    if (!searchParams.has("patientId") && !searchParams.has("appointmentId")) {
      return true;
    }
    return false;
  }, [searchParams]);

  useEffect(() => {
    if (isSearchParamsEmpty()) {
      setInitialLoading(true);
      setAppointment(null);
      setPatientId(null);
      setCurrentDate(new Date());
      setPatient(null);
      setTimeTable(null);
      if (selectDoctorRef.current) {
        selectDoctorRef.current.setValue("");
      }
    }
    const appointmentIdParam = searchParams.get("appointmentId");
    const patientIdParam = searchParams.get("patientId");
    if (appointmentIdParam != null) {
      fetchAppointment(parseInt(appointmentIdParam)).catch(() => {
        if (patientIdParam != null) {
          setPatientId(Number(patientIdParam));
        }
      });
    } else if (patientIdParam != null) {
      setPatientId(Number(patientIdParam));
    }
    setInitialLoading(false);
  }, [
    searchParams,
    fetchAppointment,
    isSearchParamsEmpty,
    setAppointment,
    setPatient,
    setTimeTable,
  ]);

  useEffect(() => {
    if (!hasAnyRole([Role.Doctor])) {
      fetchDoctorsOptions();
    } else {
      if (userDetails) {
        setDoctorId(userDetails.id);
      }
      setIsDoctor(true);
    }
  }, [userDetails, fetchDoctorsOptions, hasAnyRole]);

  useEffect(() => {
    if (hasAnyRole([Role.Doctor])) {
      setDefaultDoctorOption(generateDefaultDoctorOption());
    }
  }, [doctor, generateDefaultDoctorOption, hasAnyRole]);

  useEffect(() => {
    const patientIdParam = searchParams.get("patientId");
    const appointmentIdParam = searchParams.get("appointmentId");
    if (appointment && appointmentIdParam) {
      if (isDoctor) {
        if (userDetails) {
          if (appointment.doctor.id === userDetails.id) {
            setPatientId(appointment.patient.id);
            setDoctorId(userDetails.id);
            setCurrentDate(appointment.date);
          } else {
            if (patientIdParam) {
              setPatientId(Number(patientIdParam));
            }
            setAppointment(null);
          }
        }
      } else {
        setPatientId(appointment.patient.id);
        setDoctorId(appointment.doctor.id);
        setCurrentDate(appointment.date);
      }
    }
  }, [appointment, isDoctor, userDetails, setAppointment, searchParams]);

  const [showAppointmentModal, setShowAppointmentModal] = useState(false);

  const handleCloseAppointmentModal = () => setShowAppointmentModal(false);
  const handleShowAppointmentModal = () => setShowAppointmentModal(true);

  const handleChangeAppointmentTime = (event: any) => {
    const { name, value } = event.target;
    setAppointmentTime((prevAppointmentTime: any) => ({
      ...prevAppointmentTime,
      [name]: value,
    }));
    const timeStartInput = document.getElementsByName(
      "timeStart"
    )[0] as HTMLInputElement;
    const timeEndInput = document.getElementsByName(
      "timeEnd"
    )[0] as HTMLInputElement;

    if (name === "timeStart" || name === "timeEnd") {
      if (
        timeStartInput.value &&
        timeEndInput.value &&
        timeStartInput.value >= timeEndInput.value
      ) {
        timeEndInput.setCustomValidity(
          "Час початку прийому не може бути більше або дорівнювати часу закінчення прийому"
        );
      } else {
        timeEndInput.setCustomValidity("");
      }
    }
  };

  const handleNewAppointmentFormSubmit = async (event: any) => {
    event.preventDefault();
    if (patient != null && doctorId != null) {
      try {
        await AppointmentService.newAppointment({
          date: currentDate,
          timeStart: appointmentTime.timeStart,
          timeEnd: appointmentTime.timeEnd,
          patientId: patient.id,
          doctorId: doctorId,
          diagnosis: null,
          symptoms: null,
          medicalRecommendations: null,
        });
        handleCloseAppointmentModal();
        fetchTimeTable(doctorId, { date: formatDateToHtml5(currentDate) });
        setAppointmentTime(appointmentTimeInitialState);
        notifySuccess("Новий прийом успішно призначено!");
      } catch (error: any) {
        const errorMessage = error.response.data.message;
        if (error.response && error.response.status === 409) {
          if (errorMessage.includes("The doctor already has an appointment")) {
            notifyError("Лікар вже має інший прийом на обраний час!");
          } else if (
            errorMessage.includes("The patient already has an appointment")
          ) {
            notifyError("Пацієнт вже має інший прийом на обраний час!");
          } else {
            notifyError(
              "Непередбачена помилка конфлікту при призначенні прийому"
            );
          }
        } else if (error.response && error.response.status === 400) {
          if (
            errorMessage &&
            errorMessage.includes(
              "Appointment is outside the doctor's working hours"
            )
          ) {
            notifyError("Час прийому виходить за межі графіку роботи лікаря!");
          } else if (
            errorMessage &&
            errorMessage.includes(
              "The start time of the appointment cannot be greater than the end time"
            )
          ) {
            notifyError(
              "Час початку прийому не може бути більше часу закінчення прийому"
            );
          }
        } else {
          notifyError(
            "При створенні нового прийому сталася непередбачена помилка!"
          );
        }
      }
    }
  };

  const handleUpdateAppointmentFormSubmit = async (event: any) => {
    event.preventDefault();
    if (patient != null && doctorId != null && appointment) {
      try {
        await AppointmentService.updateAppointment(appointment.id, {
          date: currentDate,
          timeStart: appointmentTime.timeStart,
          timeEnd: appointmentTime.timeEnd,
          patientId: patient.id,
          doctorId: doctorId,
          diagnosis: null,
          symptoms: null,
          medicalRecommendations: null,
        });
        handleCloseAppointmentModal();
        fetchTimeTable(doctorId, { date: formatDateToHtml5(currentDate) });
        setAppointmentTime(appointmentTimeInitialState);
        notifySuccess("Прийом успішно переплановано!");
      } catch (error: any) {
        const errorMessage = error.response.data.message;
        if (error.response && error.response.status === 409) {
          if (errorMessage.includes("The doctor already has an appointment")) {
            notifyError("Лікар вже має інший прийом на обраний час!");
          } else if (
            errorMessage.includes("The patient already has an appointment")
          ) {
            notifyError("Пацієнт вже має інший прийом на обраний час!");
          } else {
            notifyError(
              "Непередбачена помилка конфлікту при переплануванні прийому"
            );
          }
        } else if (error.response && error.response.status === 400) {
          if (
            errorMessage &&
            errorMessage.includes(
              "Appointment is outside the doctor's working hours"
            )
          ) {
            notifyError("Час прийому виходить за межі графіку роботи лікаря!");
          } else if (
            errorMessage &&
            errorMessage.includes(
              "The start time of the appointment cannot be greater than the end time"
            )
          ) {
            notifyError(
              "Час початку прийому не може бути більше часу закінчення прийому"
            );
          }
        } else {
          notifyError(
            "При переплануванніприйому сталася непередбачена помилка!"
          );
        }
      }
    }
  };

  return initialLoading || loadingDoctorsOptions || loadingPatient ? (
    <>
      <br></br>
      <SpinnerCenter />
    </>
  ) : (
    <>
      <br></br>
      <Modal show={showAppointmentModal} onHide={handleCloseAppointmentModal}>
        <Modal.Header closeButton>
          <Modal.Title>Інформація про прийом</Modal.Title>
        </Modal.Header>
        <Form
          onSubmit={
            appointment
              ? handleUpdateAppointmentFormSubmit
              : handleNewAppointmentFormSubmit
          }
        >
          <Modal.Body>
            {patient && (
              <>
                <Form.Label>Пацієнт</Form.Label>
                <InputGroup className="mb-3">
                  <Form.Control
                    type="text"
                    value={`${patient.surname} ${patient.name.charAt(
                      0
                    )}.${patient.middleName.charAt(0)}`}
                    disabled
                  />
                  <Link href={`/patients/${patientId}`} passHref legacyBehavior>
                    <Button
                      variant="primary"
                      id="button-addon2"
                      target="_blank"
                    >
                      <i className="bi bi-eye"></i>
                    </Button>
                  </Link>
                </InputGroup>
              </>
            )}
            {doctorId && (
              <>
                <Form.Label>Лікар</Form.Label>
                {!isDoctor ? (
                  <InputGroup className="mb-3">
                    <Form.Control
                      type="text"
                      value={findDoctorOptionByValue(doctorId).label}
                      disabled
                    />
                    <Link href={`/doctors/${doctorId}`} passHref legacyBehavior>
                      <Button
                        variant="primary"
                        id="button-addon2"
                        target="_blank"
                      >
                        <i className="bi bi-eye"></i>
                      </Button>
                    </Link>
                  </InputGroup>
                ) : (
                  <>
                    {defaultDoctorOption && (
                      <InputGroup className="mb-3">
                        <Form.Control
                          type="text"
                          value={defaultDoctorOption.label}
                          disabled
                        />
                      </InputGroup>
                    )}
                  </>
                )}
              </>
            )}
            <Row>
              <Col lg={4} sm>
                <Form.Group>
                  <Form.Label>Дата</Form.Label>
                  <Form.Control
                    className="mb-3"
                    max="9999-12-31"
                    type="date"
                    disabled
                    value={formatDateToHtml5(currentDate)}
                  />
                </Form.Group>
              </Col>
              <Col sm>
                <Form.Group>
                  <Form.Label>Час початку</Form.Label>
                  <Form.Control
                    required
                    className="mb-3"
                    type="time"
                    name="timeStart"
                    value={appointmentTime.timeStart}
                    onChange={handleChangeAppointmentTime}
                  />
                </Form.Group>
              </Col>
              <Col sm>
                <Form.Group>
                  <Form.Label>Час закінчення</Form.Label>
                  <Form.Control
                    className="mb-3"
                    type="time"
                    required
                    name="timeEnd"
                    value={appointmentTime.timeEnd}
                    onChange={handleChangeAppointmentTime}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" type="submit">
              {appointment ? "Перепланувати прийом" : "Призначити прийом"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <Breadcrumb>
        <Link href="/" passHref legacyBehavior>
          <Breadcrumb.Item className="link">Домашня сторінка</Breadcrumb.Item>
        </Link>
        {!appointment ? (
          <>
            {patient || patientId ? (
              <Link href="/patients" passHref legacyBehavior>
                <Breadcrumb.Item className="link">Пацієнти</Breadcrumb.Item>
              </Link>
            ) : (
              <Link href="/appointments" passHref legacyBehavior>
                <Breadcrumb.Item className="link">Прийоми</Breadcrumb.Item>
              </Link>
            )}
          </>
        ) : (
          <Link href="/appointments" passHref legacyBehavior>
            <Breadcrumb.Item className="link">Прийоми</Breadcrumb.Item>
          </Link>
        )}
        {!appointment ? (
          <>
            {patient || patientId ? (
              <Breadcrumb.Item active>
                Призначення нового прийому
              </Breadcrumb.Item>
            ) : (
              <Breadcrumb.Item active>Розклад</Breadcrumb.Item>
            )}
          </>
        ) : (
          <>
            <Breadcrumb.Item active>Перепланування прийому</Breadcrumb.Item>
            &nbsp;
            <Link
              href={`/appointments/${appointment.id}`}
              style={{ textDecoration: "none" }}
              target="_blank"
            >
              {"#" + appointment.id}
            </Link>
          </>
        )}
      </Breadcrumb>
      <Row className="mb-3">
        <Col sm lg={4}>
          <Form.Group>
            <Form.Label>Лікар</Form.Label>
            {!isDoctor ? (
              <Select
                className="basic-single mb-3"
                classNamePrefix="select"
                isLoading={loadingDoctorsOptions}
                isSearchable={true}
                ref={selectDoctorRef}
                placeholder={"Оберіть лікаря"}
                name="doctorId"
                onChange={(e) => {
                  setDoctorId(e.value);
                }}
                loadingMessage={() => "Завантаження..."}
                noOptionsMessage={() => "Лікарів не знайдено"}
                options={doctorsOptions}
                defaultValue={
                  appointment
                    ? findDoctorOptionByValue(appointment.doctor.id)
                    : ""
                }
                styles={customReactSelectStyles}
              />
            ) : (
              <Select
                isDisabled
                className="basic-single mb-3"
                classNamePrefix="select"
                isLoading={loadingDoctor}
                isSearchable={true}
                value={defaultDoctorOption}
                placeholder={"Завантаження..."}
                name="doctorId"
                loadingMessage={() => "Завантаження..."}
                noOptionsMessage={() => "Лікаря не знайдено"}
                styles={customReactSelectStyles}
              />
            )}
          </Form.Group>
        </Col>
        {patientId && (
          <>
            {loadingPatient ? (
              <Col sm lg={3}>
                <Form.Group>
                  <Form.Label>Пацієнт</Form.Label>
                  <Form.Control
                    className="mb-3"
                    max="9999-12-31"
                    type="text"
                    value=""
                    placeholder={"Завантаження..."}
                    disabled
                  />
                </Form.Group>
              </Col>
            ) : patient ? (
              <Col sm lg={3}>
                <Form.Group>
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
                </Form.Group>
              </Col>
            ) : null}
          </>
        )}
        <Col sm lg={2}>
          <Form.Group>
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
          </Form.Group>
        </Col>
        <Col sm lg={3} className="d-flex align-self-center">
          <Button
            variant="primary"
            className="w-100"
            onClick={handleShowAppointmentModal}
            hidden={!patient || !doctorId || !patientId}
          >
            {appointment ? "Перепланувати прийом" : "Призначити прийом"}
          </Button>
        </Col>
      </Row>
      {loadingTimeTable ? (
        <SpinnerCenter />
      ) : timeTable !== null ? (
        <TimeTable timeTable={timeTable} appointment={appointment} />
      ) : (
        <>
          {doctorId ? (
            <Alert
              variant="danger"
              className="text-center mx-auto"
              style={{ maxWidth: "400px" }}
            >
              {isDoctor
                ? "Ви не маєте графіку роботи на обрану дату!"
                : "Лікар не має графіку роботи на обрану дату!"}
            </Alert>
          ) : null}
        </>
      )}
    </>
  );
}
