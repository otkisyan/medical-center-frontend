"use client";
import { DoctorDisabledSelect } from "@/components/doctor/DoctorDisabledSelect";
import { DoctorSelect } from "@/components/doctor/DoctorSelect";
import SpinnerCenter from "@/components/loading/spinner/SpinnerCenter";
import TimeTable from "@/components/timetable/TimeTable";
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
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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

export default function TimeTablePage() {
  const tCommon = useTranslations("Common");
  const tNavigation = useTranslations("PagesNavigation");
  const tTimetablePage = useTranslations("TimetablePage");
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
  const { timeTable, loadingTimeTable, fetchTimeTable, setTimeTable, error } =
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
          tTimetablePage(
            "new_appointment_modal.input_validity.time_invalid_message"
          )
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
        notifySuccess(tTimetablePage("toasts.success.new_appointment"));
      } catch (error: any) {
        const errorMessage = error.response.data.message;
        if (error.response && error.response.status === 409) {
          if (errorMessage.includes("The doctor already has an appointment")) {
            notifyError(tTimetablePage("toasts.error.doctor_conflict"));
          } else if (
            errorMessage.includes("The patient already has an appointment")
          ) {
            notifyError(tTimetablePage("toasts.error.patient_conflict"));
          } else {
            notifyError(tTimetablePage("toasts.error.unexpected"));
          }
        } else if (error.response && error.response.status === 400) {
          if (
            errorMessage &&
            errorMessage.includes(
              "Appointment is outside the doctor's working hours"
            )
          ) {
            notifyError(tTimetablePage("toasts.error.outside_workschedule"));
          } else if (
            errorMessage &&
            errorMessage.includes(
              "The start time of the appointment cannot be greater than the end time"
            )
          ) {
            notifyError(
              tTimetablePage("toasts.error.outside_invalid_time_range")
            );
          }
        } else {
          notifyError(tTimetablePage("toasts.error.unexpected"));
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
        notifySuccess(tTimetablePage("toasts.success.reschedule_appointment"));
      } catch (error: any) {
        const errorMessage = error.response.data.message;
        if (error.response && error.response.status === 409) {
          if (errorMessage.includes("The doctor already has an appointment")) {
            notifyError(tTimetablePage("toasts.error.doctor_conflict"));
          } else if (
            errorMessage.includes("The patient already has an appointment")
          ) {
            notifyError(tTimetablePage("toasts.error.patient_conflict"));
          } else {
            notifyError(tTimetablePage("toasts.error.unexpected"));
          }
        } else if (error.response && error.response.status === 400) {
          if (
            errorMessage &&
            errorMessage.includes(
              "Appointment is outside the doctor's working hours"
            )
          ) {
            notifyError(tTimetablePage("toasts.error.outside_workschedule"));
          } else if (
            errorMessage &&
            errorMessage.includes(
              "The start time of the appointment cannot be greater than the end time"
            )
          ) {
            notifyError(
              tTimetablePage("toasts.error.outside_invalid_time_range")
            );
          }
        } else {
          notifyError(tTimetablePage("toasts.error.unexpected"));
        }
      }
    }
  };

  return initialLoading ||
    loadingDoctorsOptions ||
    loadingPatient ||
    (hasAnyRole([Role.Doctor]) && loadingDoctor) ? (
    <>
      <br></br>
      <SpinnerCenter />
    </>
  ) : (
    <>
      <br></br>
      <Modal show={showAppointmentModal} onHide={handleCloseAppointmentModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {tTimetablePage("new_appointment_modal.title")}
          </Modal.Title>
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
                <Form.Label>{tCommon("patient")}</Form.Label>
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
                <Form.Label>{tCommon("doctor")}</Form.Label>
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
                  <Form.Label>{tCommon("date")}</Form.Label>
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
                  <Form.Label>{tCommon("appointment.time_start")}</Form.Label>
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
                  <Form.Label>{tCommon("appointment.time_end")}</Form.Label>
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
              {appointment
                ? tTimetablePage(
                    "new_appointment_modal.submit_button.reschedule_appointment_label"
                  )
                : tTimetablePage(
                    "new_appointment_modal.submit_button.new_appointment_label"
                  )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <Breadcrumb>
        <Link href="/" passHref legacyBehavior>
          <Breadcrumb.Item className="link">
            {tNavigation("home_page")}
          </Breadcrumb.Item>
        </Link>
        {!appointment ? (
          <>
            {patient || patientId ? (
              <Link href="/patients" passHref legacyBehavior>
                <Breadcrumb.Item className="link">
                  {tNavigation("patients")}
                </Breadcrumb.Item>
              </Link>
            ) : (
              <Link href="/appointments" passHref legacyBehavior>
                <Breadcrumb.Item className="link">
                  {tNavigation("appointments")}
                </Breadcrumb.Item>
              </Link>
            )}
          </>
        ) : (
          <Link href="/appointments" passHref legacyBehavior>
            <Breadcrumb.Item className="link">
              {tNavigation("appointments")}
            </Breadcrumb.Item>
          </Link>
        )}
        {!appointment ? (
          <>
            {patient || patientId ? (
              <Breadcrumb.Item active>
                {tTimetablePage("breadcrumb_active_page.new_appointment")}
              </Breadcrumb.Item>
            ) : (
              <Breadcrumb.Item active>
                {tTimetablePage("breadcrumb_active_page.timetable")}
              </Breadcrumb.Item>
            )}
          </>
        ) : (
          <>
            <Breadcrumb.Item active>
              {tTimetablePage("breadcrumb_active_page.reschedule_appointment")}
            </Breadcrumb.Item>
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
            <Form.Label>{tCommon("doctor")}</Form.Label>
            {!isDoctor ? (
              <DoctorSelect
                doctorsOptions={doctorsOptions}
                loadingDoctorsOptions={loadingDoctorsOptions}
                selectDoctorRef={selectDoctorRef}
                setDoctorId={setDoctorId}
                findDoctorOptionByValue={findDoctorOptionByValue}
                appointment={appointment}
              />
            ) : (
              <DoctorDisabledSelect
                defaultDoctorOption={defaultDoctorOption}
                loadingDoctor={loadingDoctor}
              />
            )}
          </Form.Group>
        </Col>
        {patientId && (
          <>
            {loadingPatient ? (
              <Col sm lg={3}>
                <Form.Group>
                  <Form.Label>{tCommon("patient")}</Form.Label>
                  <Form.Control
                    className="mb-3"
                    max="9999-12-31"
                    type="text"
                    value=""
                    placeholder={tCommon("loading")}
                    disabled
                  />
                </Form.Group>
              </Col>
            ) : patient ? (
              <Col sm lg={3}>
                <Form.Group>
                  <Form.Label>{tCommon("patient")}</Form.Label>
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
            <Form.Label>{tCommon("date")}</Form.Label>
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
            {appointment
              ? tTimetablePage(
                  "control_bar.appointment_action_button.reschedule_appointment_label"
                )
              : tTimetablePage(
                  "control_bar.appointment_action_button.new_appointment_label"
                )}
          </Button>
        </Col>
      </Row>
      {loadingTimeTable ? (
        <SpinnerCenter />
      ) : timeTable !== null ? (
        <TimeTable timeTable={timeTable} appointment={appointment} />
      ) : (
        <>
          {doctorId && error ? (
            <Alert
              variant="danger"
              className="text-center mx-auto"
              style={{ maxWidth: "400px" }}
            >
              {isDoctor
                ? tTimetablePage("alerts.doctor_no_workschedule")
                : tTimetablePage("alerts.no_workschedule")}
            </Alert>
          ) : null}
        </>
      )}
    </>
  );
}
