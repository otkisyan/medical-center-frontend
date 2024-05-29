"use client";
import SpinnerCenter from "@/components/loading/spinner/SpinnerCenter";
import useFetchReceptionist from "@/shared/hooks/receptionist/useFetchReceptionist";
import {
  ReceptionistRequest,
  convertReceptionistResponseToReceptionistRequest,
  initialReceptionistRequestState,
} from "@/shared/interface/receptionist/receptionist-interface";
import { ReceptionistService } from "@/shared/service/receptionist-service";
import { notifyError, notifySuccess } from "@/shared/toast/toast-notifiers";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Alert, Breadcrumb, Button, Card, Row } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

export default function ReceptionistPage({
  params,
}: {
  params: { id: number };
}) {
  const router = useRouter();
  const { receptionist, setReceptionist, loadingReceptionist } =
    useFetchReceptionist(params.id);
  const [editedReceptionist, setEditedReceptionist] =
    useState<ReceptionistRequest>(initialReceptionistRequestState);
  const [editing, setEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  const handleShowDeleteModal = () => setShowDeleteModal(true);

  const handleEditFormSubmit = async (event: any) => {
    event.preventDefault();
    try {
      const data = await ReceptionistService.updateReceptionist(
        params.id,
        editedReceptionist
      );
      setReceptionist(data);
      setEditedReceptionist(
        convertReceptionistResponseToReceptionistRequest(data)
      );
      notifySuccess("Редагування інформації про реєстратора успішне!");
    } catch (error) {
      if (receptionist) {
        setEditedReceptionist(
          convertReceptionistResponseToReceptionistRequest(receptionist)
        );
      }
      notifyError("При редагуванні сталася непередбачена помилка!");
    } finally {
      setEditing(false);
    }
  };

  const deleteReceptionist = async () => {
    try {
      const data = await ReceptionistService.deleteReceptionist(params.id);
      router.push("/receptionists");
      notifySuccess("Реєстратор був успішно видалений!");
    } catch (error) {
      notifyError("При видаленні реєстратора сталася непередбачена помилка!");
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleChangeReceptionist = (event: any) => {
    const { name, value } = event.target;
    setEditedReceptionist((prevReceptionist) => ({
      ...prevReceptionist,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancelEdit = () => {
    if (receptionist) {
      setEditedReceptionist(
        convertReceptionistResponseToReceptionistRequest(receptionist)
      );
    }
    setEditing(false);
  };

  useEffect(() => {
    if (receptionist != null) {
      setEditedReceptionist(
        convertReceptionistResponseToReceptionistRequest(receptionist)
      );
    }
  }, [receptionist]);

  return (
    <>
      <br></br>
      {loadingReceptionist ? (
        <>
          <SpinnerCenter></SpinnerCenter>
        </>
      ) : receptionist ? (
        <>
          <Breadcrumb>
            <Link href="/" passHref legacyBehavior>
              <Breadcrumb.Item className="link">
                Домашня сторінка
              </Breadcrumb.Item>
            </Link>
            <Link href="/receptionists" passHref legacyBehavior>
              <Breadcrumb.Item className="link">Реєстратори</Breadcrumb.Item>
            </Link>
            <Breadcrumb.Item active>
              Інформація про реєстратора #{params.id}
            </Breadcrumb.Item>
          </Breadcrumb>
          <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
            <Modal.Header closeButton>
              <Modal.Title>Видалення реєстратора</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Ви впевнені що хочете видалити реєстратора?</p>
              <p>
                <i>
                  Ви не сможете відновити інформацію про реєстратора після
                  підтвердження видалення!
                </i>
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseDeleteModal}>
                Скасувати
              </Button>
              <Button variant="danger" onClick={deleteReceptionist}>
                Видалити реєстратора
              </Button>
            </Modal.Footer>
          </Modal>
          <Card>
            <Card.Header>Реєстратор</Card.Header>
            <Card.Body>
              <Form onSubmit={handleEditFormSubmit}>
                <fieldset disabled={!editing}>
                  <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridSurname">
                      <Form.Label>Прізвище</Form.Label>
                      <Form.Control
                        type="text"
                        value={editedReceptionist.surname ?? ""}
                        name="surname"
                        onChange={handleChangeReceptionist}
                      />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridName">
                      <Form.Label>{`Ім'я`}</Form.Label>
                      <Form.Control
                        type="text"
                        value={editedReceptionist.name ?? ""}
                        name="name"
                        onChange={handleChangeReceptionist}
                      />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridMiddleName">
                      <Form.Label>По батькові</Form.Label>
                      <Form.Control
                        type="text"
                        value={editedReceptionist.middleName ?? ""}
                        name="middleName"
                        onChange={handleChangeReceptionist}
                      />
                    </Form.Group>
                  </Row>
                  <Form.Group controlId="formGridBirthDate" className="mb-3">
                    <Form.Label>Дата народження</Form.Label>
                    <Form.Control
                      type="date"
                      value={
                        editedReceptionist.birthDate
                          ? editedReceptionist.birthDate.toString()
                          : ""
                      }
                      name="birthDate"
                      max="9999-12-31"
                      onChange={handleChangeReceptionist}
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
            При виконанні запиту виникла помилка або запитуваного реєстратора не
            існує
          </p>
        </Alert>
      )}
    </>
  );
}
