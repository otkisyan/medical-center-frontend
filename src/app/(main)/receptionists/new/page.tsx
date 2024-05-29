// NewReceptionistPage
"use client";
import {
  ReceptionistRequest,
  ReceptionistResponseWithUserCredentials,
  initialReceptionistRequestState,
} from "@/shared/interface/receptionist/receptionist-interface";
import { ReceptionistService } from "@/shared/service/receptionist-service";
import { notifyError } from "@/shared/toast/toast-notifiers";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Alert,
  Breadcrumb,
  Modal,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { saveAs } from "file-saver";
import { RegisterSuccessCredentials } from "@/shared/interface/user/register-success-credentials-interface";

export default function NewReceptionistPage() {
  const router = useRouter();

  const [receptionist, setReceptionist] = useState<ReceptionistRequest>(
    initialReceptionistRequestState
  );

  const [receptionistCredentials, setReceptionistCredentials] =
    useState<RegisterSuccessCredentials | null>(null);
  const [showReceptionistModal, setShowReceptionistModal] = useState(false);

  const handleCloseReceptionistModal = () => setShowReceptionistModal(false);
  const handleShowReceptionistModal = () => setShowReceptionistModal(true);

  const handleInputReceptionist = (event: any) => {
    const { name, value } = event.target;
    setReceptionist((prevParams) => ({
      ...prevParams,
      [name]: value,
    }));
  };

  const handleNewReceptionistFormSubmit = async (event: any) => {
    event.preventDefault();
    await addNewReceptionist();
  };

  const addNewReceptionist = async () => {
    try {
      const data: ReceptionistResponseWithUserCredentials =
        await ReceptionistService.addReceptionist(receptionist);
      setReceptionistCredentials({
        id: data.receptionist.id,
        fullName:
          data?.receptionist.surname +
          " " +
          data?.receptionist.name +
          " " +
          data?.receptionist.middleName,
        userCredentials: {
          username: data.userCredentials.username,
          password: data.userCredentials.password,
        },
      });
      setReceptionist(initialReceptionistRequestState);
      handleShowReceptionistModal();
    } catch (error) {
      notifyError(
        "При додаванні нового реєстратора сталася непередбачувана помилка!"
      );
    }
  };

  const renderDownloadTooltip = (props: any) => (
    <Tooltip id="button-tooltip" {...props}>
      Завантажити облікові дані
    </Tooltip>
  );

  const downloadReceptionistUserCredentials = () => {
    if (receptionistCredentials) {
      let data = {
        Реєстратор: receptionistCredentials.fullName,
        Логін: receptionistCredentials.userCredentials.username,
        Пароль: receptionistCredentials.userCredentials.password,
      };
      const jsonReceptionistCredentials = JSON.stringify(data, null, 4);
      let blob = new Blob([jsonReceptionistCredentials], {
        type: "text/plain;charset=utf-8",
      });
      saveAs(blob, `Реєстратор - ${receptionistCredentials.fullName}`);
    }
  };

  return (
    <>
      <br></br>
      <Breadcrumb>
        <Breadcrumb.Item href="/" className="link">
          Домашня сторінка
        </Breadcrumb.Item>
        <Breadcrumb.Item href="/receptionists" className="link">
          Реєстратор
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Новий реєстратор</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        {receptionistCredentials && (
          <Modal
            show={showReceptionistModal}
            onHide={handleCloseReceptionistModal}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>Реєстратора успішно зареєстровано!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3" controlId="receptionistResponse">
                <Form.Label>Реєстратор</Form.Label>
                <Form.Control
                  type="text"
                  value={receptionistCredentials.fullName}
                  disabled
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="receptionistResponseLogin"
              >
                <Form.Label>Логін</Form.Label>
                <Form.Control
                  type="text"
                  value={receptionistCredentials.userCredentials.username}
                  disabled
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="receptionistResponseLogin"
              >
                <Form.Label>Пароль</Form.Label>
                <Form.Control
                  type="text"
                  value={receptionistCredentials.userCredentials.password}
                  disabled
                />
              </Form.Group>
              <Alert variant="danger">
                Тримайте у секреті! Нікому не повідомляйте ці облікові дані
                окрім самого реєстратора!
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
                  onClick={downloadReceptionistUserCredentials}
                >
                  <i className="bi bi-cloud-arrow-down-fill"></i>
                </Button>
              </OverlayTrigger>
              <Button
                variant="primary"
                onClick={() => {
                  router.push(`/receptionists/${receptionistCredentials?.id}`);
                }}
              >
                Зрозуміло
              </Button>
            </Modal.Footer>
          </Modal>
        )}
        <Card.Header>Інформація про нового реєстратора</Card.Header>
        <Card.Body>
          <Form onSubmit={handleNewReceptionistFormSubmit}>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridSurname">
                <Form.Label>Прізвище</Form.Label>
                <Form.Control
                  type="text"
                  required
                  value={receptionist.surname ?? ""}
                  name="surname"
                  onChange={handleInputReceptionist}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridName">
                <Form.Label>{`Ім'я`}</Form.Label>
                <Form.Control
                  type="text"
                  required
                  value={receptionist.name ?? ""}
                  name="name"
                  onChange={handleInputReceptionist}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridMiddleName">
                <Form.Label>По батькові</Form.Label>
                <Form.Control
                  type="text"
                  required
                  value={receptionist.middleName ?? ""}
                  name="middleName"
                  onChange={handleInputReceptionist}
                />
              </Form.Group>
            </Row>
            <Form.Group controlId="formGridBirthDate" className="mb-3">
              <Form.Label>Дата народження</Form.Label>
              <Form.Control
                type="date"
                required
                value={
                  receptionist.birthDate
                    ? receptionist.birthDate.toString()
                    : ""
                }
                name="birthDate"
                max="9999-12-31"
                onChange={handleInputReceptionist}
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              id="confirmAddNewReceptionist"
            >
              Додати нового реєстратора
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}
