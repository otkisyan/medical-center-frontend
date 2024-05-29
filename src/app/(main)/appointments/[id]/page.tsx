"use client";
import SpinnerCenter from "@/components/loading/spinner/SpinnerCenter";
import { useAuth } from "@/shared/context/UserContextProvider";
import { Role } from "@/shared/enum/role";
import useFetchAppointment from "@/shared/hooks/appointment/useFetchAppointment";
import useFetchAppointmentConsultation from "@/shared/hooks/appointment/useFetchAppointmentConsultation";
import useFetchAppointmentsCount from "@/shared/hooks/appointment/useFetchAppointmentsCount";
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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
      notifySuccess("Редагування інформації про прийом успішне!");
    } catch (error) {
      if (consultation) {
        setEditedConsultation(
          convertConsultationResponseToConsultationRequest(consultation)
        );
      }
      notifyError("При редагуванні сталася непередбачена помилка!");
    } finally {
      setEditing(false);
    }
  };

  const deleteAppointment = async () => {
    try {
      const data = await AppointmentService.deleteAppointment(params.id);
      notifySuccess("Прийом було успішно видалено!");
      router.push("/appointments");
    } catch (error) {
      notifyError("При видаленні прийома сталася непередбачена помилка!");
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
                Домашня сторінка
              </Breadcrumb.Item>
            </Link>
            <Link href="/appointments" passHref legacyBehavior>
              <Breadcrumb.Item className="link">Прийоми</Breadcrumb.Item>
            </Link>
            <Breadcrumb.Item active>
              Інформація про прийом #{params.id}
            </Breadcrumb.Item>
          </Breadcrumb>
          <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
            <Modal.Header closeButton>
              <Modal.Title>Видалення прийому</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Ви впевнені що хочете видалити прийом?</p>
              <p>
                <i>
                  Ви не сможете відновити інформацію про прийом після
                  підтвердження видалення!
                </i>
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseDeleteModal}>
                Скасувати
              </Button>
              <Button variant="danger" onClick={deleteAppointment}>
                Видалити прийом
              </Button>
            </Modal.Footer>
          </Modal>
          <Card>
            <Card.Header>Прийом</Card.Header>
            <Card.Body>
              <Form.Label>Пацієнт</Form.Label>
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
              <Form.Label>Лікар</Form.Label>
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

              <Form onSubmit={handleEditFormSubmit}>
                {hasAnyRole([Role.ADMIN, Role.Doctor]) && (
                  <fieldset disabled={!editing}>
                    <Form.Group controlId="formGridDiagnosis" className="mb-3">
                      <Form.Label>Діагноз</Form.Label>
                      <Form.Control
                        type="text"
                        value={editedConsultation?.diagnosis ?? ""}
                        name="diagnosis"
                        onChange={handleChangeConsultation}
                      />
                    </Form.Group>
                    <Form.Group controlId="formGridSymptoms" className="mb-3">
                      <Form.Label>Симптоми</Form.Label>
                      <Form.Control
                        type="text"
                        value={editedConsultation?.symptoms ?? ""}
                        name="symptoms"
                        onChange={handleChangeConsultation}
                      />
                    </Form.Group>
                    <Form.Group
                      controlId="formGridMedicalRecommendations"
                      className="mb-3"
                    >
                      <Form.Label>Медичні рекомендації</Form.Label>
                      <Form.Control
                        as="textarea"
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
                      <Form.Label>Дата</Form.Label>
                      <Form.Control
                        type="date"
                        value={appointment?.date.toString() ?? ""}
                        name="date"
                      />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridTimeStart">
                      <Form.Label>Час початку</Form.Label>
                      <Form.Control
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
                      <Form.Label>Час закінчення</Form.Label>
                      <Form.Control
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
                        Перепланувати
                      </Button>
                    </Link>
                  </>
                )}
                {userDetails?.id === appointment.doctor.id &&
                  hasAnyRole([Role.Doctor]) && (
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
                        Зберегти
                      </Button>
                      <Button
                        variant="secondary"
                        type="button"
                        id="cancelButton"
                        hidden={!editing}
                        onClick={handleCancelEdit}
                      >
                        Скасувати
                      </Button>
                      <Button
                        variant="danger"
                        type="button"
                        hidden={editing}
                        id="deleteButton"
                        onClick={handleShowDeleteModal}
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </>
                  )}
              </Form>
            </Card.Body>
          </Card>
        </>
      ) : (
        <Alert variant="danger">
          <Alert.Heading>Ууупсс...</Alert.Heading>
          <p>
            При виконанні запиту виникла помилка або запитуваного прийому не
            існує
          </p>
        </Alert>
      )}
    </>
  );
}
