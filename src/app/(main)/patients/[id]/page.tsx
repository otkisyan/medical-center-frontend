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
import useFetchPatient from "@/shared/hooks/patients/useFetchPatient";
import SpinnerCenter from "@/components/loading/spinner/SpinnerCenter";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function PatientPage({ params }: { params: { id: number } }) {
  const tCommon = useTranslations("Common");
  const tPagesNavigation = useTranslations("PagesNavigation");
  const tSpecificPatientPage = useTranslations("SpecificPatientPage");
  const router = useRouter();
  const { patient, setPatient, loadingPatient } = useFetchPatient(params.id);
  const [editedPatient, setEditedPatient] = useState<PatientRequest>(
    initialPatientRequestState
  );
  const [editing, setEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  const handleShowDeleteModal = () => setShowDeleteModal(true);

  const handleEditFormSubmit = async (event: any) => {
    event.preventDefault();
    try {
      const data = await PatientService.updatePatient(params.id, editedPatient);
      setPatient(data);
      setEditedPatient(convertPatientResponseToPatientRequest(data));
      notifySuccess(tSpecificPatientPage("toasts.edit_success"));
    } catch (error) {
      if (patient) {
        setEditedPatient(convertPatientResponseToPatientRequest(patient));
      }
      notifyError(tSpecificPatientPage("toasts.edit_error"));
    } finally {
      setEditing(false);
    }
  };

  const deletePatient = async () => {
    try {
      const data = await PatientService.deletePatient(params.id);
      router.push("/patients");
      notifySuccess(tSpecificPatientPage("toasts.delete_success"));
    } catch (error) {
      notifyError(tSpecificPatientPage("toasts.edit_error"));
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

  useEffect(() => {
    if (patient != null) {
      setEditedPatient(convertPatientResponseToPatientRequest(patient));
    }
  }, [patient]);

  return (
    <>
      <br></br>
      {loadingPatient ? (
        <>
          <SpinnerCenter></SpinnerCenter>
        </>
      ) : patient ? (
        <>
          <Breadcrumb>
            <Link href="/" passHref legacyBehavior>
              <Breadcrumb.Item className="link">
                {tPagesNavigation("home_page")}
              </Breadcrumb.Item>
            </Link>
            <Link href="/patients" passHref legacyBehavior>
              <Breadcrumb.Item className="link">
                {tPagesNavigation("patients")}
              </Breadcrumb.Item>
            </Link>
            <Breadcrumb.Item active>
              {tSpecificPatientPage("breadcrumb_active_page", {
                id: params.id,
              })}
            </Breadcrumb.Item>
          </Breadcrumb>
          <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
            <Modal.Header closeButton>
              <Modal.Title>
                {tSpecificPatientPage("patient_delete_dialog.title")}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>{tSpecificPatientPage("patient_delete_dialog.text")}</p>
              <p>
                <i>{tSpecificPatientPage("patient_delete_dialog.warning")}</i>
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseDeleteModal}>
                {tCommon("action_cancel_button_label")}
              </Button>
              <Button variant="danger" onClick={deletePatient}>
                {tSpecificPatientPage(
                  "patient_delete_dialog.confirm_button_label"
                )}
              </Button>
            </Modal.Footer>
          </Modal>
          <Card onSubmit={handleEditFormSubmit}>
            <Card.Header>
              {tSpecificPatientPage("patient_card_header")}
            </Card.Header>
            <Card.Body>
              <Form>
                <fieldset disabled={!editing}>
                  <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridSurname">
                      <Form.Label>
                        {tCommon("personal_data.surname")}
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={editedPatient.surname ?? ""}
                        name="surname"
                        onChange={handleChangePatient}
                      />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridName">
                      <Form.Label>{tCommon("personal_data.name")}</Form.Label>
                      <Form.Control
                        type="text"
                        value={editedPatient.name ?? ""}
                        name="name"
                        onChange={handleChangePatient}
                      />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridMiddleName">
                      <Form.Label>
                        {tCommon("personal_data.middle_name")}
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={editedPatient.middleName ?? ""}
                        name="middleName"
                        onChange={handleChangePatient}
                      />
                    </Form.Group>
                  </Row>
                  <Form.Group controlId="formGridBirthDate" className="mb-3">
                    <Form.Label>
                      {tCommon("personal_data.birth_date")}
                    </Form.Label>
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
                      <Form.Label> {tCommon("personal_data.phone")}</Form.Label>
                      <Form.Control
                        type="text"
                        value={editedPatient.phone ?? ""}
                        onChange={handleChangePatient}
                        name="phone"
                      />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridMessengerContact">
                      <Form.Label>
                        {" "}
                        {tCommon("personal_data.messenger_contact")}
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={editedPatient.messengerContact ?? ""}
                        name="messengerContact"
                        onChange={handleChangePatient}
                      />
                    </Form.Group>
                  </Row>
                  <Form.Group controlId="formGridAddress" className="mb-3">
                    <Form.Label> {tCommon("personal_data.address")}</Form.Label>
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
                    <Form.Label>
                      {" "}
                      {tCommon("personal_data.preferential_category")}
                    </Form.Label>
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
          <Alert.Heading>
            {tSpecificPatientPage("error_alert.header")}
          </Alert.Heading>
          <p>{tSpecificPatientPage("error_alert.text")}</p>
        </Alert>
      )}
    </>
  );
}
