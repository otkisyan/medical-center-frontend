"use client";
import React, { useEffect, useState } from "react";
import { PatientService } from "@/shared/service/patient-service";
import {
  convertPatientResponseToPatientRequest,
  initialPatientRequestState,
  PatientRequest,
} from "@/shared/interface/patient/patient-interface";
import { Alert, Button } from "react-bootstrap";
import { notifyError, notifySuccess } from "@/shared/toast/toast-notifiers";
import Modal from "react-bootstrap/Modal";
import { useRouter } from "next/navigation";
import { Breadcrumb } from "react-bootstrap";
import useFetchPatient from "@/shared/hooks/patients/useFetchPatient";
import SpinnerCenter from "@/components/loading/spinner/SpinnerCenter";
import Link from "next/link";
import { useTranslations } from "next-intl";
import PatientCard from "@/components/patient/PatientCard";
import PatientUpdateForm from "@/components/patient/PatientUpdateForm";

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
      await PatientService.deletePatient(params.id);
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
          <PatientCard
            patientForm={
              <PatientUpdateForm
                editedPatient={editedPatient}
                handleChangePatient={handleChangePatient}
                handleEditFormSubmit={handleEditFormSubmit}
                onClickEdit={handleEdit}
                handleCancelEdit={handleCancelEdit}
                handleShowDeleteModal={handleShowDeleteModal}
                editing={editing}
              />
            }
          />
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
