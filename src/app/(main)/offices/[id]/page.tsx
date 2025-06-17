"use client";
import React, { useEffect, useState } from "react";
import { OfficeService } from "@/shared/service/office-service";
import {
  convertOfficeResponseToOfficeRequest,
  initialOfficeRequestState,
  OfficeRequest,
} from "@/shared/interface/office/office-interface";
import { Alert, Button } from "react-bootstrap";
import { notifyError, notifySuccess } from "@/shared/toast/toast-notifiers";
import Modal from "react-bootstrap/Modal";
import { useRouter } from "next/navigation";
import { Breadcrumb } from "react-bootstrap";
import SpinnerCenter from "@/components/loading/spinner/SpinnerCenter";
import Link from "next/link";
import useFetchOffice from "@/shared/hooks/office/useFetchOffice";
import { useTranslations } from "use-intl";
import OfficeCard from "@/components/office/OfficeCard";
import OfficeUpdateForm from "@/components/office/OfficeUpdateForm";

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
          <OfficeCard
            officeForm={
              <OfficeUpdateForm
                editedOffice={editedOffice}
                handleChangeOffice={handleChangeOffice}
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
            {tSpecificOfficePage("error_alert.header")}
          </Alert.Heading>
          <p>{tSpecificOfficePage("error_alert.text")}</p>
        </Alert>
      )}
    </>
  );
}
