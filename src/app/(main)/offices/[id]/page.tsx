// OfficePage.tsx
"use client";
import React, { useCallback, useEffect, useState } from "react";
import { OfficeService } from "@/shared/service/office-service";
import {
  convertOfficeResponseToOfficeRequest,
  initialOfficeRequestState,
  initialOfficeResponseState,
  OfficeRequest,
  OfficeResponse,
} from "@/shared/interface/office/office-interface";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import { Alert, Button, Card, Row } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import { notifyError, notifySuccess } from "@/shared/toast/toast-notifiers";
import Modal from "react-bootstrap/Modal";
import { useRouter } from "next/navigation";
import { Breadcrumb } from "react-bootstrap";
import SpinnerCenter from "@/components/loading/spinner/SpinnerCenter";
import Link from "next/link";
import useFetchOffice from "@/shared/hooks/office/useFetchOffice";

export default function OfficePage({ params }: { params: { id: number } }) {
  const router = useRouter();
  const { office, setOffice, loadingOffice } = useFetchOffice(params.id);
  const [editedOffice, setEditedOffice] = useState<OfficeRequest>(
    initialOfficeRequestState
  );
  const [editing, setEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  const handleShowDeleteModal = () => setShowDeleteModal(true);

  const handleEditFormSubmit = async () => {
    try {
      const data = await OfficeService.updateOffice(params.id, editedOffice);
      setOffice(data);
      setEditedOffice(convertOfficeResponseToOfficeRequest(data));
      notifySuccess("Редагування інформації про кабінет успішне!");
    } catch (error) {
      if (office) {
        setEditedOffice(convertOfficeResponseToOfficeRequest(office));
      }
      notifyError("При редагуванні сталася непередбачена помилка!");
    } finally {
      setEditing(false);
    }
  };

  const deleteOffice = async () => {
    try {
      await OfficeService.deleteOffice(params.id);
      router.push("/offices");
      notifySuccess("Кабінет був успішно видалений!");
    } catch (error) {
      notifyError("При видаленні кабінету сталася непередбачена помилка!");
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleChangeOffice = (event: any) => {
    const { name, value } = event.target;
    setEditedOffice((prevOffice) => ({
      ...prevOffice,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancelEdit = () => {
    if (office) {
      setEditedOffice(office);
    }
    setEditing(false);
  };

  useEffect(() => {
    if (office != null) {
      setEditedOffice(convertOfficeResponseToOfficeRequest(office));
    }
  }, [office]);

  return (
    <>
      <br />
      {loadingOffice ? (
        <>
          <SpinnerCenter />
        </>
      ) : office ? (
        <>
          <Breadcrumb>
            <Link href="/" passHref legacyBehavior>
              <Breadcrumb.Item className="link">
                Домашня сторінка
              </Breadcrumb.Item>
            </Link>
            <Link href="/offices" passHref legacyBehavior>
              <Breadcrumb.Item className="link">Кабінети</Breadcrumb.Item>
            </Link>
            <Breadcrumb.Item active>
              Інформація про кабінет #{params.id}
            </Breadcrumb.Item>
          </Breadcrumb>
          <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
            <Modal.Header closeButton>
              <Modal.Title>Видалення кабінету</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Ви впевнені, що хочете видалити кабінету?</p>
              <p>
                <i>
                  Ви не зможете відновити інформацію про кабінет після
                  підтвердження видалення!
                </i>
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseDeleteModal}>
                Скасувати
              </Button>
              <Button variant="danger" onClick={deleteOffice}>
                Видалити кабінет
              </Button>
            </Modal.Footer>
          </Modal>
          <Card>
            <Card.Header>Кабінет</Card.Header>
            <Card.Body>
              <Form>
                <fieldset disabled={!editing}>
                  <Form.Group controlId="formGridNumber" className="mb-3">
                    <Form.Label>Номер</Form.Label>
                    <Form.Control
                      type="number"
                      value={editedOffice.number.toString()}
                      name="number"
                      onChange={handleChangeOffice}
                    />
                  </Form.Group>
                  <Form.Group controlId="formGridName" className="mb-3">
                    <Form.Label>Назва</Form.Label>
                    <Form.Control
                      type="text"
                      value={editedOffice.name}
                      name="name"
                      onChange={handleChangeOffice}
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
            При виконанні запиту виникла помилка або запитуваного кабінету не
            існує.
          </p>
        </Alert>
      )}
    </>
  );
}
