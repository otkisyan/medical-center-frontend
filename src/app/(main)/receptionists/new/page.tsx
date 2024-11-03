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
import { useTranslations } from "next-intl";

export default function NewReceptionistPage() {
  const tPagesNavigation = useTranslations("PagesNavigation");
  const tCommon = useTranslations("Common");
  const tUser = useTranslations("User");
  const tNewReceptionistPage = useTranslations("NewReceptionistPage");
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
      notifyError(tNewReceptionistPage("toasts.new_receptionist_error"));
    }
  };

  const renderDownloadTooltip = (props: any) => (
    <Tooltip id="button-tooltip" {...props}>
      {tNewReceptionistPage(
        "new_receptionist.success_dialog.credentials_download_tooltip"
      )}
    </Tooltip>
  );

  const downloadReceptionistUserCredentials = () => {
    if (receptionistCredentials) {
      let data = {
        [tCommon("receptionist")]: receptionistCredentials.fullName,
        [tUser("login")]: receptionistCredentials.userCredentials.username,
        [tUser("password")]: receptionistCredentials.userCredentials.password,
      };
      const jsonReceptionistCredentials = JSON.stringify(data, null, 4);
      let blob = new Blob([jsonReceptionistCredentials], {
        type: "text/plain;charset=utf-8",
      });
      saveAs(
        blob,
        `${tCommon("receptionist")} - ${receptionistCredentials.fullName}`
      );
    }
  };

  return (
    <>
      <br></br>
      <Breadcrumb>
        <Breadcrumb.Item href="/" className="link">
          {tPagesNavigation("home_page")}
        </Breadcrumb.Item>
        <Breadcrumb.Item href="/receptionists" className="link">
          {tPagesNavigation("receptionists")}
        </Breadcrumb.Item>
        <Breadcrumb.Item active>
          {tPagesNavigation("new_receptionist")}
        </Breadcrumb.Item>
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
              <Modal.Title>
                {tNewReceptionistPage(
                  "new_receptionist.success_dialog.header_title"
                )}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3" controlId="receptionistResponse">
                <Form.Label>{tCommon("receptionist")}</Form.Label>
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
                <Form.Label>{tUser("login")}</Form.Label>
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
                <Form.Label>{tUser("password")}</Form.Label>
                <Form.Control
                  type="text"
                  value={receptionistCredentials.userCredentials.password}
                  disabled
                />
              </Form.Group>
              <Alert variant="danger">
                {tNewReceptionistPage(
                  "new_receptionist.success_dialog.warning_alert"
                )}
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
                {tNewReceptionistPage(
                  "new_receptionist.success_dialog.accept_button_label"
                )}
              </Button>
            </Modal.Footer>
          </Modal>
        )}
        <Card.Header>
          {tNewReceptionistPage("new_receptionist.card.header")}
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleNewReceptionistFormSubmit}>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridSurname">
                <Form.Label>{tCommon("personal_data.surname")}</Form.Label>
                <Form.Control
                  type="text"
                  required
                  value={receptionist.surname ?? ""}
                  name="surname"
                  onChange={handleInputReceptionist}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridName">
                <Form.Label>{tCommon("personal_data.name")}</Form.Label>
                <Form.Control
                  type="text"
                  required
                  value={receptionist.name ?? ""}
                  name="name"
                  onChange={handleInputReceptionist}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridMiddleName">
                <Form.Label>{tCommon("personal_data.middle_name")}</Form.Label>
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
              <Form.Label>{tCommon("personal_data.birth_date")}</Form.Label>
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
              {tNewReceptionistPage("new_receptionist.add_button_label")}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}
