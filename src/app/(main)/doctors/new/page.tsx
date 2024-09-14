"use client";
import { customReactSelectStyles } from "@/css/react-select";
import "@/css/styles.css";
import useFetchOfficesOptions from "@/shared/hooks/office/useFetchOfficesOptions";
import {
  DoctorRequest,
  DoctorResponseWithUserCredentials,
  initialDoctorRequestState,
} from "@/shared/interface/doctor/doctor-interface";
import { DoctorService } from "@/shared/service/doctor-service";
import { notifyError } from "@/shared/toast/toast-notifiers";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, Breadcrumb, Modal } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Select from "react-select";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { saveAs } from "file-saver";
import { RegisterSuccessCredentials } from "@/shared/interface/user/register-success-credentials-interface";
import { useTranslations } from "next-intl";

export default function NewDoctorPage() {
  const tCommon = useTranslations("Common");
  const tPagesNavigation = useTranslations("PagesNavigation");
  const tNewDoctorPage = useTranslations("NewDoctorPage");
  const tUser = useTranslations("User");
  const router = useRouter();

  const [doctor, setDoctor] = useState<DoctorRequest>(
    initialDoctorRequestState
  );

  const [doctorCredentials, setDoctorCredentials] =
    useState<RegisterSuccessCredentials | null>(null);
  const [showDoctorModal, setShowDoctorModal] = useState(false);

  const handleCloseDoctorModal = () => setShowDoctorModal(false);
  const handleShowDoctorModal = () => setShowDoctorModal(true);

  const {
    loadingOfficesOptions,
    officesOptions,
    defaultOfficeOption,
    findOfficeOptionByValue,
  } = useFetchOfficesOptions();

  const handleInputDoctor = (event: any) => {
    const { name, value } = event.target;
    setDoctor((prevParams) => ({
      ...prevParams,
      [name]: value,
    }));
  };

  const handleNewDoctorFormSubmit = async (event: any) => {
    event.preventDefault();
    await addNewDoctor();
  };

  const addNewDoctor = async () => {
    try {
      const data: DoctorResponseWithUserCredentials =
        await DoctorService.addDoctor(doctor);
      setDoctorCredentials({
        id: data.doctor.id,
        fullName:
          data?.doctor.surname +
          " " +
          data?.doctor.name +
          " " +
          data?.doctor.middleName,
        userCredentials: {
          username: data.userCredentials.username,
          password: data.userCredentials.password,
        },
      });
      setDoctor(initialDoctorRequestState);
      handleShowDoctorModal();
    } catch (error) {
      notifyError(tNewDoctorPage("toasts.new_doctor_error"));
    }
  };

  const renderDownloadTooltip = (props: any) => (
    <Tooltip id="button-tooltip" {...props}>
      {tNewDoctorPage("new_doctor.success_dialog.credentials_download_tooltip")}
    </Tooltip>
  );

  const downloadDoctorUserCredentials = () => {
    if (doctorCredentials) {
      let data = {
        Лікар: doctorCredentials.fullName,
        Логін: doctorCredentials.userCredentials.username,
        Пароль: doctorCredentials.userCredentials.password,
      };
      const jsonDoctorCredentials = JSON.stringify(data, null, 4);
      let blob = new Blob([jsonDoctorCredentials], {
        type: "text/plain;charset=utf-8",
      });
      saveAs(blob, `Лікар - ${doctorCredentials.fullName}`);
    }
  };

  return (
    <>
      <br></br>
      <Breadcrumb>
        <Breadcrumb.Item href="/" className="link">
          {tPagesNavigation("home_page")}
        </Breadcrumb.Item>
        <Breadcrumb.Item href="/doctors" className="link">
          {tPagesNavigation("doctors")}
        </Breadcrumb.Item>
        <Breadcrumb.Item active>
          {" "}
          {tPagesNavigation("new_doctor")}
        </Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        {doctorCredentials && (
          <Modal
            show={showDoctorModal}
            onHide={handleCloseDoctorModal}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>
                {tNewDoctorPage("new_doctor.success_dialog.header_title")}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3" controlId="doctorResponse">
                <Form.Label>{tCommon("doctor")}</Form.Label>
                <Form.Control
                  type="text"
                  value={doctorCredentials.fullName}
                  disabled
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="doctorResponseLogin">
                <Form.Label>{tUser("login")}</Form.Label>
                <Form.Control
                  type="text"
                  value={doctorCredentials.userCredentials.username}
                  disabled
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="doctorResponseLogin">
                <Form.Label>{tUser("password")}</Form.Label>
                <Form.Control
                  type="text"
                  value={doctorCredentials.userCredentials.password}
                  disabled
                />
              </Form.Group>
              <Alert variant="danger">
                {tNewDoctorPage("new_doctor.success_dialog.warning_alert")}
              </Alert>
            </Modal.Body>
            <Modal.Footer>
              <OverlayTrigger
                placement="left"
                delay={{ show: 250, hide: 400 }}
                overlay={renderDownloadTooltip}
              >
                <Button
                  variant="secondary"
                  onClick={downloadDoctorUserCredentials}
                >
                  <i className="bi bi-cloud-arrow-down-fill"></i>
                </Button>
              </OverlayTrigger>
              <Button
                variant="primary"
                onClick={() => {
                  router.push(`/doctors/${doctorCredentials?.id}`);
                }}
              >
                {tNewDoctorPage(
                  "new_doctor.success_dialog.accept_button_label"
                )}
              </Button>
            </Modal.Footer>
          </Modal>
        )}
        <Card.Header>{tNewDoctorPage("new_doctor.card.header")}</Card.Header>
        <Card.Body>
          <Form onSubmit={handleNewDoctorFormSubmit}>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridSurname">
                <Form.Label>{tCommon("personal_data.surname")}</Form.Label>
                <Form.Control
                  type="text"
                  required
                  value={doctor.surname ?? ""}
                  name="surname"
                  onChange={handleInputDoctor}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridName">
                <Form.Label>{tCommon("personal_data.name")}</Form.Label>
                <Form.Control
                  type="text"
                  required
                  value={doctor.name ?? ""}
                  name="name"
                  onChange={handleInputDoctor}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridMiddleName">
                <Form.Label>{tCommon("personal_data.middle_name")}</Form.Label>
                <Form.Control
                  type="text"
                  required
                  value={doctor.middleName ?? ""}
                  name="middleName"
                  onChange={handleInputDoctor}
                />
              </Form.Group>
            </Row>
            <Form.Group controlId="formGridBirthDate" className="mb-3">
              <Form.Label>{tCommon("personal_data.birth_date")}</Form.Label>
              <Form.Control
                type="date"
                required
                value={doctor.birthDate ? doctor.birthDate.toString() : ""}
                name="birthDate"
                max="9999-12-31"
                onChange={handleInputDoctor}
              />
            </Form.Group>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridPhone">
                <Form.Label>{tCommon("personal_data.phone")}</Form.Label>
                <Form.Control
                  required
                  type="text"
                  value={doctor.phone ?? ""}
                  onChange={handleInputDoctor}
                  name="phone"
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridMessengerContact">
                <Form.Label>
                  {tCommon("personal_data.messenger_contact")}
                </Form.Label>
                <Form.Control
                  type="text"
                  value={doctor.messengerContact ?? ""}
                  name="messengerContact"
                  onChange={handleInputDoctor}
                />
              </Form.Group>
            </Row>
            <Form.Group controlId="formGridAddress" className="mb-3">
              <Form.Label>{tCommon("personal_data.address")}</Form.Label>
              <Form.Control
                type="text"
                value={doctor.address ?? ""}
                name="address"
                onChange={handleInputDoctor}
              />
            </Form.Group>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridMedicalSpecialty">
                <Form.Label>
                  {tCommon("personal_data.doctor.medical_specialty")}
                </Form.Label>
                <Form.Control
                  required
                  type="text"
                  value={doctor.medicalSpecialty ?? ""}
                  name="medicalSpecialty"
                  onChange={handleInputDoctor}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridQualificationCategory">
                <Form.Label>
                  {tCommon("personal_data.doctor.qualification_category")}
                </Form.Label>
                <Form.Control
                  type="text"
                  value={doctor.qualificationCategory ?? ""}
                  name="qualificationCategory"
                  onChange={handleInputDoctor}
                />
              </Form.Group>
            </Row>
            <Form.Group as={Col} controlId="formGridOffice">
              <Form.Label>{tCommon("office")}</Form.Label>
              <Select
                className="basic-single mb-3"
                classNamePrefix="select"
                isLoading={loadingOfficesOptions}
                isSearchable={true}
                placeholder={
                  loadingOfficesOptions
                    ? tCommon("loading")
                    : tCommon("office_select.placeholder_label")
                }
                name="officeId"
                onChange={(e) => {
                  setDoctor((prevDoctor) => ({
                    ...prevDoctor,
                    officeId: e.value,
                  }));
                }}
                loadingMessage={() => tCommon("loading")}
                noOptionsMessage={() =>
                  tCommon("office_select.no_options_message")
                }
                options={officesOptions}
                styles={customReactSelectStyles}
              />
            </Form.Group>
            <Button variant="primary" type="submit" id="confirmAddNewDoctor">
              {tNewDoctorPage("new_doctor.add_button_label")}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}
