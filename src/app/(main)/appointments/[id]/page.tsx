"use client";
import SpinnerCenter from "@/components/loading/spinner/SpinnerCenter";
import { useAuth } from "@/shared/context/UserContextProvider";
import { Role } from "@/shared/enum/role";
import useFetchAppointment from "@/shared/hooks/appointment/useFetchAppointment";
import {
  AppointmentRequest,
  AppointmentResponse,
  convertAppointmentResponseToAppointmentRequest,
} from "@/shared/interface/appointment/appointment-interface";
import { AppointmentService } from "@/shared/service/appointment-service";
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
  const [editedAppointment, setEditedAppointment] =
    useState<AppointmentRequest | null>(null);
  const [editing, setEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  const handleShowDeleteModal = () => setShowDeleteModal(true);

  const handleChangeAppointment = (event: any) => {
    const { name, value } = event.target;
    setEditedAppointment((prevAppointment) => {
      if (prevAppointment) {
        return {
          ...prevAppointment,
          [name]: value,
        };
      }
      return prevAppointment;
    });
  };

  const handleEditFormSubmit = async () => {
    if (!editedAppointment) return;
    try {
      const data = await AppointmentService.updateAppointment(
        params.id,
        editedAppointment
      );
      setAppointment(data);
      setEditedAppointment(
        convertAppointmentResponseToAppointmentRequest(data)
      );
      notifySuccess("Редагування інформації про прийом успішне!");
    } catch (error) {
      if (appointment) {
        setEditedAppointment(
          convertAppointmentResponseToAppointmentRequest(appointment)
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
      router.push("/appointments");
      notifySuccess("Прийом було успішно видалено!");
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
    if (appointment) {
      setEditedAppointment(
        convertAppointmentResponseToAppointmentRequest(appointment)
      );
    }
    setEditing(false);
  };

  useEffect(() => {
    fetchAppointment(params.id);
  }, [fetchAppointment, params.id]);

  useEffect(() => {
    if (appointment) {
      setEditedAppointment(
        convertAppointmentResponseToAppointmentRequest(appointment)
      );
    }
  }, [appointment]);

  return (
    <>
      <br></br>
      {loadingAppointment ? (
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
              <Form>
                <fieldset disabled={!editing}>
                  <Form.Group controlId="formGridDiagnosis" className="mb-3">
                    <Form.Label>Діагноз</Form.Label>
                    <Form.Control
                      type="text"
                      value={editedAppointment?.diagnosis ?? ""}
                      name="diagnosis"
                      onChange={handleChangeAppointment}
                    />
                  </Form.Group>
                  <Form.Group controlId="formGridSymptoms" className="mb-3">
                    <Form.Label>Симптоми</Form.Label>
                    <Form.Control
                      type="text"
                      value={editedAppointment?.symptoms ?? ""}
                      name="symptoms"
                      onChange={handleChangeAppointment}
                    />
                  </Form.Group>
                  <Form.Group
                    controlId="formGridMedicalRecommendations"
                    className="mb-3"
                  >
                    <Form.Label>Медичні рекомендації</Form.Label>
                    <Form.Control
                      type="text"
                      value={editedAppointment?.medicalRecommendations ?? ""}
                      name="medicalRecommendations"
                      onChange={handleChangeAppointment}
                    />
                  </Form.Group>
                </fieldset>
                <fieldset disabled>
                  <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridDate">
                      <Form.Label>Дата</Form.Label>
                      <Form.Control
                        type="date"
                        value={editedAppointment?.date.toString() ?? ""}
                        name="date"
                        onChange={handleChangeAppointment}
                      />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridTimeStart">
                      <Form.Label>Час початку</Form.Label>
                      <Form.Control
                        type="time"
                        value={
                          editedAppointment?.timeStart
                            ? formatTimeSecondsToTime(appointment.timeStart)
                            : ""
                        }
                        name="timeStart"
                        onChange={handleChangeAppointment}
                      />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridTimeEnd">
                      <Form.Label>Час закінчення</Form.Label>
                      <Form.Control
                        type="time"
                        value={
                          editedAppointment?.timeEnd
                            ? formatTimeSecondsToTime(appointment.timeEnd)
                            : ""
                        }
                        name="timeEnd"
                        onChange={handleChangeAppointment}
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
                      type="button"
                      className="me-2"
                      hidden={!editing}
                      id="confirmEdit"
                      onClick={handleEditFormSubmit}
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
