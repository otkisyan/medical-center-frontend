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
import { useTranslations } from "use-intl";

export default function OfficePage({ params }: { params: { id: number } }) {
  const tCommon = useTranslations("Common");
  const tSpecificOfficePage = useTranslations("SpecificOfficePage");
  const tPagesNavigation = useTranslations("PagesNavigation");
  const router = useRouter();
  const { office, setOffice, loadingOffice } = useFetchOffice(params.id);
  const [editedOffice, setEditedOffice] = useState<OfficeRequest>(
    initialOfficeRequestState
  );
  const [editing, setEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  const handleShowDeleteModal = () => setShowDeleteModal(true);

  const handleEditFormSubmit = async (event: any) => {
    event.preventDefault();
    try {
      const data = await OfficeService.updateOffice(params.id, editedOffice);
      setOffice(data);
      setEditedOffice(convertOfficeResponseToOfficeRequest(data));
      notifySuccess(tSpecificOfficePage("toasts.edit_success"));
    } catch (error) {
      if (office) {
        setEditedOffice(convertOfficeResponseToOfficeRequest(office));
      }
      notifyError(tSpecificOfficePage("toasts.edit_error"));
    } finally {
      setEditing(false);
    }
  };

  const deleteOffice = async () => {
    try {
      await OfficeService.deleteOffice(params.id);
      router.push("/offices");
      notifySuccess(tSpecificOfficePage("toasts.delete_success"));
    } catch (error) {
      notifyError(tSpecificOfficePage("toasts.delete_error"));
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
                {tPagesNavigation("home_page")}
              </Breadcrumb.Item>
            </Link>
            <Link href="/offices" passHref legacyBehavior>
              <Breadcrumb.Item className="link">
                {tPagesNavigation("offices")}
              </Breadcrumb.Item>
            </Link>
            <Breadcrumb.Item active>
              {tSpecificOfficePage("breadcrumb_active_page", {
                id: params.id,
              })}
            </Breadcrumb.Item>
          </Breadcrumb>
          <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
            <Modal.Header closeButton>
              <Modal.Title>
                {tSpecificOfficePage("office_delete_dialog.title")}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>{tSpecificOfficePage("office_delete_dialog.text")}</p>
              <p>
                <i>{tSpecificOfficePage("office_delete_dialog.warning")}</i>
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseDeleteModal}>
                {tCommon("action_cancel_button_label")}
              </Button>
              <Button variant="danger" onClick={deleteOffice}>
                {tSpecificOfficePage(
                  "office_delete_dialog.confirm_button_label"
                )}
              </Button>
            </Modal.Footer>
          </Modal>
          <Card>
            <Card.Header>
              {tSpecificOfficePage("office_card_header")}
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleEditFormSubmit}>
                <fieldset disabled={!editing}>
                  <Form.Group controlId="formGridNumber" className="mb-3">
                    <Form.Label>{tCommon("office.number_short")}</Form.Label>
                    <Form.Control
                      type="number"
                      value={editedOffice.number.toString()}
                      name="number"
                      onChange={handleChangeOffice}
                    />
                  </Form.Group>
                  <Form.Group controlId="formGridName" className="mb-3">
                    <Form.Label>{tCommon("office.name_short")}</Form.Label>
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
            {tSpecificOfficePage("error_alert.header")}
          </Alert.Heading>
          <p>{tSpecificOfficePage("error_alert.text")}</p>
        </Alert>
      )}
    </>
  );
}
