"use client";
import "@/css/styles.css";
import {
  PatientRequest,
  PatientResponse,
  initialPatientResponseState as initialPatientRequestState,
} from "@/shared/interface/patient/patient-interface";
import { PatientService } from "@/shared/service/patient-service";
import { notifyError, notifySuccess } from "@/shared/toast/toast-notifiers";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Breadcrumb } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import { useTranslations } from "next-intl";

export default function NewPatientPage() {
  const tCommon = useTranslations("Common");
  const tPagesNavigation = useTranslations("PagesNavigation");
  const tNewPatientPage = useTranslations("NewPatientPage");
  const router = useRouter();

  const [patient, setPatient] = useState<PatientRequest>(
    initialPatientRequestState
  );

  const handleInputPatient = (event: any) => {
    const { name, value } = event.target;
    setPatient((prevParams) => ({
      ...prevParams,
      [name]: value,
    }));
  };

  const handleNewPatientFormSubmit = async (event: any) => {
    event.preventDefault();
    await addNewPatient();
  };

  const addNewPatient = async () => {
    try {
      const data = await PatientService.addPatient(patient);
      router.push(`/patients/${data.id}`);
      notifySuccess(tNewPatientPage("toasts.new_patient_success"));
    } catch (error) {
      notifyError(tNewPatientPage("toasts.new_patient_error"));
    }
  };

  return (
    <>
      <br></br>
      <Breadcrumb>
        <Breadcrumb.Item href="/" className="link">
          {tPagesNavigation("home_page")}
        </Breadcrumb.Item>
        <Breadcrumb.Item href="/patients" className="link">
          {tPagesNavigation("patients")}
        </Breadcrumb.Item>
        <Breadcrumb.Item active>
          {" "}
          {tPagesNavigation("new_patient")}
        </Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <Card.Header>{tNewPatientPage("new_patient.card.header")}</Card.Header>
        <Card.Body>
          <Form onSubmit={handleNewPatientFormSubmit}>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridSurname">
                <Form.Label>{tCommon("personal_data.surname")}</Form.Label>
                <Form.Control
                  type="text"
                  value={patient.surname ?? ""}
                  name="surname"
                  onChange={handleInputPatient}
                  required
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridName">
                <Form.Label>{tCommon("personal_data.name")}</Form.Label>
                <Form.Control
                  type="text"
                  value={patient.name ?? ""}
                  name="name"
                  onChange={handleInputPatient}
                  required
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridMiddleName">
                <Form.Label>{tCommon("personal_data.middle_name")}</Form.Label>
                <Form.Control
                  type="text"
                  value={patient.middleName ?? ""}
                  name="middleName"
                  onChange={handleInputPatient}
                  required
                />
              </Form.Group>
            </Row>
            <Form.Group controlId="formGridBirthDate" className="mb-3">
              <Form.Label>{tCommon("personal_data.birth_date")}</Form.Label>
              <Form.Control
                type="date"
                value={patient.birthDate ? patient.birthDate.toString() : ""}
                name="birthDate"
                max="9999-12-31"
                onChange={handleInputPatient}
                required
              />
            </Form.Group>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridPhone">
                <Form.Label>{tCommon("personal_data.phone")}</Form.Label>
                <Form.Control
                  type="text"
                  value={patient.phone ?? ""}
                  onChange={handleInputPatient}
                  name="phone"
                  required
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridMessengerContact">
                <Form.Label>
                  {tCommon("personal_data.messenger_contact")}
                </Form.Label>
                <Form.Control
                  type="text"
                  value={patient.messengerContact ?? ""}
                  name="messengerContact"
                  onChange={handleInputPatient}
                />
              </Form.Group>
            </Row>
            <Form.Group controlId="formGridAddress" className="mb-3">
              <Form.Label>{tCommon("personal_data.address")}</Form.Label>
              <Form.Control
                type="text"
                value={patient.address ?? ""}
                name="address"
                onChange={handleInputPatient}
              />
            </Form.Group>
            <Form.Group
              controlId="formGridPreferentialCategory"
              className="mb-3"
            >
              <Form.Label>
                {tCommon("personal_data.preferential_category")}
              </Form.Label>
              <Form.Control
                type="text"
                value={patient.preferentialCategory ?? ""}
                name="preferentialCategory"
                onChange={handleInputPatient}
              />
            </Form.Group>
            <Button variant="primary" type="submit" id="confirmAddNewPatient">
              {tNewPatientPage("new_patient.add_button_label")}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}
