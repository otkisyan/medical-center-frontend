"use client";
import React, { useCallback, useEffect, useState } from "react";
import { PatientService } from "@/shared/service/patient-service";
import {
  convertPatientResponseToPatientRequest,
  initialPatientRequestState,
  initialPatientResponseState,
  PatientRequest,
  PatientResponse,
} from "@/shared/interface/patient/patient-interface";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import { Alert, Button, Card, Row } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import { notifyError, notifySuccess } from "@/shared/toast/toast-notifiers";
import Modal from "react-bootstrap/Modal";
import { useRouter } from "next/navigation";
import { Breadcrumb } from "react-bootstrap";

export default function PatientPage({ params }: { params: { id: number } }) {
  const router = useRouter();
  const [patient, setPatient] = useState<PatientResponse | null>(null);
  const [editedPatient, setEditedPatient] = useState<PatientRequest>(
    initialPatientRequestState
  );
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  const handleShowDeleteModal = () => setShowDeleteModal(true);

  const handleEditFormSubmit = async () => {
    try {
      const data = await PatientService.updatePatient(params.id, editedPatient);
      setPatient(data);
      setEditedPatient(convertPatientResponseToPatientRequest(data));
      notifySuccess("Редагування інформації про пацієнта успішне!");
    } catch (error) {
      if (patient) {
        setEditedPatient(convertPatientResponseToPatientRequest(patient));
      }
      notifyError("При редагуванні сталася непередбачена помилка!");
    } finally {
      setEditing(false);
    }
  };

  const deletePatient = async () => {
    try {
      const data = await PatientService.deletePatient(params.id);
      router.push("/patients");
      notifySuccess("Пацієнт був успішно видалений!");
    } catch (error) {
      notifyError("При видаленні пацієнта сталася непередбачена помилка!");
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleChangePatient = (event: any) => {
    const { name, value } = event.target;
    setEditedPatient((prevPatient) => ({
      ...prevPatient,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancelEdit = () => {
    if (patient) {
      setEditedPatient(patient);
    }
    setEditing(false);
  };

  const fetchPatient = useCallback(async (patientId: number) => {
    try {
      setLoading(true);
      const data = await PatientService.findPatientById(patientId);
      setPatient(data);
      setEditedPatient(convertPatientResponseToPatientRequest(data));
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const patientId = params.id;
    fetchPatient(patientId);
  }, [fetchPatient, params.id]);

  return (
    <>
      <br></br>
      {loading ? (
        <>
          <div className="d-flex justify-content-center">
            <Spinner animation="grow" role="status" variant="secondary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        </>
      ) : patient ? (
        <>
          <Breadcrumb>
            <Breadcrumb.Item href="/" className="link">
              Домашня сторінка
            </Breadcrumb.Item>
            <Breadcrumb.Item href="/patients" className="link">
              Пацієнти
            </Breadcrumb.Item>
            <Breadcrumb.Item active>
              Інформація про пацієнта #{params.id}
            </Breadcrumb.Item>
          </Breadcrumb>
          <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
            <Modal.Header closeButton>
              <Modal.Title>Видалення пацієнта</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Ви впевнені що хочете видалити пацієнта?</p>
              <p>
                <i>
                  Ви не сможете відновити інформацію про пацієнта після
                  підтвердження видалення!
                </i>
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseDeleteModal}>
                Скасувати
              </Button>
              <Button variant="danger" onClick={deletePatient}>
                Видалити пацієнта
              </Button>
            </Modal.Footer>
          </Modal>
          <Card>
            <Card.Header>Пацієнт</Card.Header>
            <Card.Body>
              <Form>
                <fieldset disabled={!editing}>
                  <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridSurname">
                      <Form.Label>Прізвище</Form.Label>
                      <Form.Control
                        type="text"
                        value={editedPatient.surname ?? ""}
                        name="surname"
                        onChange={handleChangePatient}
                      />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridName">
                      <Form.Label>{`Ім'я`}</Form.Label>
                      <Form.Control
                        type="text"
                        value={editedPatient.name ?? ""}
                        name="name"
                        onChange={handleChangePatient}
                      />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridMiddleName">
                      <Form.Label>По батькові</Form.Label>
                      <Form.Control
                        type="text"
                        value={editedPatient.middleName ?? ""}
                        name="middleName"
                        onChange={handleChangePatient}
                      />
                    </Form.Group>
                  </Row>
                  <Form.Group controlId="formGridBirthDate" className="mb-3">
                    <Form.Label>Дата народження</Form.Label>
                    <Form.Control
                      type="date"
                      value={
                        editedPatient.birthDate
                          ? editedPatient.birthDate.toString()
                          : ""
                      }
                      name="birthDate"
                      max="9999-12-31"
                      onChange={handleChangePatient}
                    />
                  </Form.Group>
                  <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridPhone">
                      <Form.Label>Номер телефону</Form.Label>
                      <Form.Control
                        type="text"
                        value={editedPatient.phone ?? ""}
                        onChange={handleChangePatient}
                        name="phone"
                      />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridMessengerContact">
                      <Form.Label>Контактний номер Viber/Telegram</Form.Label>
                      <Form.Control
                        type="text"
                        value={editedPatient.messengerContact ?? ""}
                        name="messengerContact"
                        onChange={handleChangePatient}
                      />
                    </Form.Group>
                  </Row>
                  <Form.Group controlId="formGridAddress" className="mb-3">
                    <Form.Label>Домашня адреса</Form.Label>
                    <Form.Control
                      type="text"
                      value={editedPatient.address ?? ""}
                      name="address"
                      onChange={handleChangePatient}
                    />
                  </Form.Group>
                  <Form.Group
                    controlId="formGridPreferentialCategory"
                    className="mb-3"
                  >
                    <Form.Label>Пільгова категорія</Form.Label>
                    <Form.Control
                      type="text"
                      value={editedPatient.preferentialCategory ?? ""}
                      name="preferentialCategory"
                      onChange={handleChangePatient}
                    />
                  </Form.Group>
                </fieldset>
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
              </Form>
            </Card.Body>
          </Card>
        </>
      ) : (
        <Alert variant="danger">
          <Alert.Heading>Ууупсс...</Alert.Heading>
          <p>
            При виконанні запиту виникла помилка або запитуваного пацієнта не
            існує
          </p>
        </Alert>
      )}
    </>
  );
}
