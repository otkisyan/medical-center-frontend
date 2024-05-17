"use client";
import { customReactSelectStyles } from "@/css/react-select";
import "@/css/styles.css";
import useFetchOfficesOptions from "@/shared/hooks/office/useFetchOfficesOptions";
import {
  DoctorRequest,
  DoctorResponseWithUserCredentials,
  DoctorUserCredentials,
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

export default function NewDoctorPage() {
  const router = useRouter();

  const [doctor, setDoctor] = useState<DoctorRequest>(
    initialDoctorRequestState
  );

  const [doctorCredentials, setDoctorCredentials] =
    useState<DoctorUserCredentials | null>(null);
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
        doctorId: data.doctorResponseDto.id,
        fullName:
          data?.doctorResponseDto.surname +
          " " +
          data?.doctorResponseDto.name +
          " " +
          data?.doctorResponseDto.middleName,
        userCredentials: {
          username: data.userCredentialsDto.username,
          password: data.userCredentialsDto.password,
        },
      });
      handleShowDoctorModal();
    } catch (error) {
      notifyError(
        "При додаванні нового лікаря сталася непередбачувана помилка!"
      );
    }
  };

  const renderDownloadTooltip = (props: any) => (
    <Tooltip id="button-tooltip" {...props}>
      Завантажити облікові дані
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
          Домашня сторінка
        </Breadcrumb.Item>
        <Breadcrumb.Item href="/doctors" className="link">
          Лікар
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Новий лікар</Breadcrumb.Item>
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
              <Modal.Title>Лікаря успішно зареєстровано!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3" controlId="doctorResponse">
                <Form.Label>Лікар</Form.Label>
                <Form.Control
                  type="text"
                  value={doctorCredentials.fullName}
                  disabled
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="doctorResponseLogin">
                <Form.Label>Логін</Form.Label>
                <Form.Control
                  type="text"
                  value={doctorCredentials.userCredentials.username}
                  disabled
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="doctorResponseLogin">
                <Form.Label>Пароль</Form.Label>
                <Form.Control
                  type="text"
                  value={doctorCredentials.userCredentials.password}
                  disabled
                />
              </Form.Group>
              <Alert variant="danger">
                Тримайте у секреті! Нікому не повідомляйте ці облікові дані
                окрім самого лікаря!
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
                  router.push(`/doctors/${doctorCredentials?.doctorId}`);
                }}
              >
                Зрозуміло
              </Button>
            </Modal.Footer>
          </Modal>
        )}
        <Card.Header>Інформація про нового лікаря</Card.Header>
        <Card.Body>
          <Form onSubmit={handleNewDoctorFormSubmit}>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridSurname">
                <Form.Label>Прізвище</Form.Label>
                <Form.Control
                  type="text"
                  required
                  value={doctor.surname ?? ""}
                  name="surname"
                  onChange={handleInputDoctor}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridName">
                <Form.Label>{`Ім'я`}</Form.Label>
                <Form.Control
                  type="text"
                  required
                  value={doctor.name ?? ""}
                  name="name"
                  onChange={handleInputDoctor}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridMiddleName">
                <Form.Label>По батькові</Form.Label>
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
              <Form.Label>Дата народження</Form.Label>
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
                <Form.Label>Номер телефону</Form.Label>
                <Form.Control
                  required
                  type="text"
                  value={doctor.phone ?? ""}
                  onChange={handleInputDoctor}
                  name="phone"
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridMessengerContact">
                <Form.Label>Контактний номер Viber/Telegram</Form.Label>
                <Form.Control
                  type="text"
                  value={doctor.messengerContact ?? ""}
                  name="messengerContact"
                  onChange={handleInputDoctor}
                />
              </Form.Group>
            </Row>
            <Form.Group controlId="formGridAddress" className="mb-3">
              <Form.Label>Домашня адреса</Form.Label>
              <Form.Control
                type="text"
                value={doctor.address ?? ""}
                name="address"
                onChange={handleInputDoctor}
              />
            </Form.Group>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridMedicalSpecialty">
                <Form.Label>Медична спеціальність</Form.Label>
                <Form.Control
                  required
                  type="text"
                  value={doctor.medicalSpecialty ?? ""}
                  name="medicalSpecialty"
                  onChange={handleInputDoctor}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridQualificationCategory">
                <Form.Label>Кваліфікаційна категорія</Form.Label>
                <Form.Control
                  type="text"
                  value={doctor.qualificationCategory ?? ""}
                  name="qualificationCategory"
                  onChange={handleInputDoctor}
                />
              </Form.Group>
            </Row>
            <Form.Group as={Col} controlId="formGridOffice">
              <Form.Label>Кабінет</Form.Label>
              <Select
                className="basic-single mb-3"
                classNamePrefix="select"
                isLoading={loadingOfficesOptions}
                isSearchable={true}
                placeholder={"Оберіть кабінет"}
                name="officeId"
                onChange={(e) => {
                  setDoctor((prevDoctor) => ({
                    ...prevDoctor,
                    officeId: e.value,
                  }));
                }}
                loadingMessage={() => "Завантаження..."}
                noOptionsMessage={() => "Кабінетів не знайдено"}
                options={officesOptions}
                styles={customReactSelectStyles}
              />
            </Form.Group>
            <Button variant="primary" type="submit" id="confirmAddNewPatient">
              Додати нового лікаря
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}
