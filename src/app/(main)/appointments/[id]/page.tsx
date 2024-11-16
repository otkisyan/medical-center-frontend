"use client";
import SpinnerCenter from "@/components/loading/spinner/SpinnerCenter";
import { useAuth } from "@/shared/context/UserContextProvider";
import { Role } from "@/shared/enum/role";
import useFetchAppointment from "@/shared/hooks/appointment/useFetchAppointment";
import useFetchAppointmentConsultation from "@/shared/hooks/appointment/useFetchAppointmentConsultation";
import useFetchAppointmentsCount from "@/shared/hooks/appointment/useFetchAppointmentsCount";
import useAutosizeTextArea from "@/shared/hooks/textarea/useAutoSizeTextArea";
import {
  AppointmentRequest,
  AppointmentResponse,
  convertAppointmentResponseToAppointmentRequest,
} from "@/shared/interface/appointment/appointment-interface";
import {
  ConsultationRequest,
  convertConsultationResponseToConsultationRequest,
} from "@/shared/interface/consultation/consultation-interface";
import { AppointmentService } from "@/shared/service/appointment-service";
import { ConsultationService } from "@/shared/service/consultation-service";
import { notifyError, notifySuccess } from "@/shared/toast/toast-notifiers";
import { formatTimeSecondsToTime } from "@/shared/utils/date-utils";
import { error } from "console";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Breadcrumb,
  Button,
  Card,
  Col,
  Form,
  InputGroup,
  Modal,
  Row,
} from "react-bootstrap";

export default function AppointmentPage({
  params,
}: {
  params: { id: number };
}) {
  const tCommon = useTranslations("Common");
  const tPagesNavigation = useTranslations("PagesNavigation");
  const tSpecificAppointmentPage = useTranslations("SpecificAppointmentPage");
  const router = useRouter();
  const { hasAnyRole, userDetails } = useAuth();
  const { appointment, setAppointment, loadingAppointment, fetchAppointment } =
    useFetchAppointment();
  const {
    consultation,
    setConsultation,
    loadingConsultation,
    setLoadingConsultation,
    fetchAppointmentConsultation,
  } = useFetchAppointmentConsultation();
  const [editedConsultation, setEditedConsultation] =
    useState<ConsultationRequest | null>(null);
  const [editing, setEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  const handleShowDeleteModal = () => setShowDeleteModal(true);

  const symptomsRef = useRef(null);
  const medicalRecommendationsRef = useRef(null);

  useAutosizeTextArea(symptomsRef.current, editedConsultation?.symptoms);
  useAutosizeTextArea(
    medicalRecommendationsRef.current,
    editedConsultation?.medicalRecommendations
  );

  const handleChangeConsultation = (event: any) => {
    const { name, value } = event.target;
    setEditedConsultation((prevConsultation) => {
      if (prevConsultation) {
        return {
          ...prevConsultation,
          [name]: value,
        };
      }
      return prevConsultation;
    });
  };

  const handleEditFormSubmit = async (event: any) => {
    event.preventDefault();
    if (!editedConsultation) return;
    try {
      const data = await ConsultationService.updateConsultation(
        params.id,
        editedConsultation
      );
      setConsultation(data);
      setEditedConsultation(
        convertConsultationResponseToConsultationRequest(data)
      );
      notifySuccess(tSpecificAppointmentPage("toasts.edit_success"));
    } catch (error) {
      if (consultation) {
        setEditedConsultation(
          convertConsultationResponseToConsultationRequest(consultation)
        );
      }
      notifyError(tSpecificAppointmentPage("toasts.edit_error"));
    } finally {
      setEditing(false);
    }
  };

  const deleteAppointment = async () => {
    try {
      const data = await AppointmentService.deleteAppointment(params.id);
      notifySuccess(tSpecificAppointmentPage("toasts.delete_success"));
      router.push("/appointments");
    } catch (error) {
      notifyError(tSpecificAppointmentPage("toasts.delete_error"));
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancelEdit = () => {
    if (consultation) {
      setEditedConsultation(
        convertConsultationResponseToConsultationRequest(consultation)
      );
    }
    setEditing(false);
  };

  useEffect(() => {
    fetchAppointment(params.id);
    if (hasAnyRole([Role.ADMIN, Role.Doctor])) {
      fetchAppointmentConsultation(params.id);
    } else {
      setLoadingConsultation(false);
    }
  }, [
    fetchAppointment,
    hasAnyRole,
    fetchAppointmentConsultation,
    params.id,
    setLoadingConsultation,
  ]);

  useEffect(() => {
    if (consultation) {
      setEditedConsultation(
        convertConsultationResponseToConsultationRequest(consultation)
      );
    }
  }, [consultation]);

  return (
    <>
      <br></br>
      {loadingAppointment || loadingConsultation ? (
        <SpinnerCenter></SpinnerCenter>
      ) : appointment ? (
        <>
          <Breadcrumb>
            <Link href="/" passHref legacyBehavior>
              <Breadcrumb.Item className="link">
                {tPagesNavigation("home_page")}
              </Breadcrumb.Item>
            </Link>
            <Link href="/appointments" passHref legacyBehavior>
              <Breadcrumb.Item className="link">
                {" "}
                {tPagesNavigation("appointments")}
              </Breadcrumb.Item>
            </Link>
            <Breadcrumb.Item active>
              {tSpecificAppointmentPage("breadcrumb_active_page", {
                id: params.id,
              })}
            </Breadcrumb.Item>
          </Breadcrumb>
          <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
            <Modal.Header closeButton>
              <Modal.Title>
                {tSpecificAppointmentPage("appointment_delete_dialog.title")}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                {tSpecificAppointmentPage("appointment_delete_dialog.text")}
              </p>
              <p>
                <i>
                  {tSpecificAppointmentPage(
                    "appointment_delete_dialog.warning"
                  )}
                </i>
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseDeleteModal}>
                {tCommon("action_cancel_button_label")}
              </Button>
              <Button variant="danger" onClick={deleteAppointment}>
                {tSpecificAppointmentPage(
                  "appointment_delete_dialog.confirm_button_label"
                )}
              </Button>
            </Modal.Footer>
          </Modal>
          <Card>
            <Card.Header>
              {tSpecificAppointmentPage("appointment_card_header")}
            </Card.Header>
            <Card.Body>
              <Form.Label>{tCommon("patient")}</Form.Label>
              <InputGroup className="mb-3">
                <Form.Control
                  value={
                    appointment.patient.surname +
                    " " +
                    appointment.patient.name +
                    " " +
                    appointment.patient.middleName
                  }
                  disabled
                  readOnly
                />
                <Link
                  href={`/patients/${appointment.patient.id}`}
                  passHref
                  legacyBehavior
                >
                  <Button variant="primary" target="_blank">
                    <i className="bi bi-eye"></i>
                  </Button>
                </Link>
              </InputGroup>
              <Form.Label>{tCommon("doctor")}</Form.Label>
              <InputGroup className="mb-3">
                <Form.Control
                  value={
                    appointment.doctor.surname +
                    " " +
                    appointment.doctor.name +
                    " " +
                    appointment.doctor.middleName
                  }
                  disabled
                  readOnly
                />
                {hasAnyRole([Role.ADMIN, Role.RECEPTIONIST]) && (
                  <Link
                    href={`/doctors/${appointment.doctor.id}`}
                    passHref
                    legacyBehavior
                  >
                    <Button variant="primary" target="_blank">
                      <i className="bi bi-eye"></i>
                    </Button>
                  </Link>
                )}
              </InputGroup>
              <Form.Group controlId="formGridDiagnosis" className="mb-3">
                <Form.Label>
                  {tCommon("appointment.doctor_specialty")}
                </Form.Label>
                <Form.Control
                  disabled
                  type="text"
                  value={appointment.doctor.medicalSpecialty}
                  name="diagnosis"
                  onChange={handleChangeConsultation}
                />
              </Form.Group>

              <Form onSubmit={handleEditFormSubmit}>
                {hasAnyRole([Role.ADMIN, Role.Doctor]) && (
                  <fieldset disabled={!editing}>
                    <Form.Group controlId="formGridDiagnosis" className="mb-3">
                      <Form.Label>
                        {tCommon("appointment.diagnosis")}
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={editedConsultation?.diagnosis ?? ""}
                        name="diagnosis"
                        onChange={handleChangeConsultation}
                      />
                    </Form.Group>
                    <Form.Group controlId="formGridSymptoms" className="mb-3">
                      <Form.Label>
                        {" "}
                        {tCommon("appointment.symptoms")}
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        type="text"
                        ref={symptomsRef}
                        value={editedConsultation?.symptoms ?? ""}
                        name="symptoms"
                        onChange={handleChangeConsultation}
                      />
                    </Form.Group>
                    <Form.Group
                      controlId="formGridMedicalRecommendations"
                      className="mb-3"
                    >
                      <Form.Label>
                        {" "}
                        {tCommon("appointment.medical_recommendations")}
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        ref={medicalRecommendationsRef}
                        type="text"
                        value={editedConsultation?.medicalRecommendations ?? ""}
                        name="medicalRecommendations"
                        onChange={handleChangeConsultation}
                      />
                    </Form.Group>
                  </fieldset>
                )}
                <fieldset disabled>
                  <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridDate">
                      <Form.Label> {tCommon("date")}</Form.Label>
                      <Form.Control
                        readOnly
                        type="date"
                        value={appointment?.date.toString() ?? ""}
                        name="date"
                      />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridTimeStart">
                      <Form.Label>
                        {" "}
                        {tCommon("appointment.time_start")}
                      </Form.Label>
                      <Form.Control
                        readOnly
                        type="time"
                        value={
                          appointment?.timeStart
                            ? formatTimeSecondsToTime(appointment.timeStart)
                            : ""
                        }
                        name="timeStart"
                      />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridTimeEnd">
                      <Form.Label>{tCommon("appointment.time_end")}</Form.Label>
                      <Form.Control
                        readOnly
                        type="time"
                        value={
                          appointment?.timeEnd
                            ? formatTimeSecondsToTime(appointment.timeEnd)
                            : ""
                        }
                        name="timeEnd"
                      />
                    </Form.Group>
                  </Row>
                </fieldset>
                {(userDetails?.id === appointment.doctor.id ||
                  hasAnyRole([Role.ADMIN, Role.RECEPTIONIST])) && (
                  <>
                    <Link
                      href={{
                        pathname: "/appointments/timetable",
                        query: { appointmentId: appointment.id },
                      }}
                      passHref
                      legacyBehavior
                    >
                      <Button
                        variant="primary"
                        type="button"
                        className="me-2"
                        hidden={editing}
                      >
                        {tSpecificAppointmentPage("reschedule_button_label")}
                      </Button>
                    </Link>
                  </>
                )}
                {userDetails?.id === appointment.doctor.id && (
                  <>
                    <Button
                      variant="primary"
                      type="button"
                      className="me-2"
                      hidden={editing}
                      onClick={handleEdit}
                    >
                      <i className="bi bi-pencil-square" id="editButton"></i>
                    </Button>
                    <Button
                      variant="primary"
                      type="submit"
                      className="me-2"
                      hidden={!editing}
                      id="confirmEdit"
                    >
                      {tCommon("action_save_button_label")}
                    </Button>
                    <Button
                      variant="secondary"
                      type="button"
                      id="cancelButton"
                      hidden={!editing}
                      onClick={handleCancelEdit}
                    >
                      {tCommon("action_cancel_button_label")}
                    </Button>
                  </>
                )}
                {(userDetails?.id === appointment.doctor.id ||
                  hasAnyRole([Role.ADMIN, Role.RECEPTIONIST])) && (
                  <Button
                    variant="danger"
                    type="button"
                    hidden={editing}
                    id="deleteButton"
                    onClick={handleShowDeleteModal}
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                )}
              </Form>
            </Card.Body>
          </Card>
        </>
      ) : (
        <Alert variant="danger">
          <Alert.Heading>
            {" "}
            {tSpecificAppointmentPage("error_alert.header")}
          </Alert.Heading>
          <p>{tSpecificAppointmentPage("error_alert.text")}</p>
        </Alert>
      )}
    </>
  );
}
