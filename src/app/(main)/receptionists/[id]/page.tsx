"use client";
import SpinnerCenter from "@/components/loading/spinner/SpinnerCenter";
import ReceptionistCard from "@/components/receptionist/ReceptionistCard";
import ReceptionistUpdateForm from "@/components/receptionist/ReceptionistUpdateForm";
import useFetchReceptionist from "@/shared/hooks/receptionist/useFetchReceptionist";
import {
  ReceptionistRequest,
  convertReceptionistResponseToReceptionistRequest,
  initialReceptionistRequestState,
} from "@/shared/interface/receptionist/receptionist-interface";
import { ReceptionistService } from "@/shared/service/receptionist-service";
import { notifyError, notifySuccess } from "@/shared/toast/toast-notifiers";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Alert, Breadcrumb, Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";

export default function ReceptionistPage({
  params,
}: {
  params: { id: number };
}) {
  const tCommon = useTranslations("Common");
  const tPagesNavigation = useTranslations("PagesNavigation");
  const tSpecificReceptionistPage = useTranslations("SpecificReceptionistPage");
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
      notifySuccess(tSpecificReceptionistPage("toasts.edit_success"));
    } catch (error) {
      if (receptionist) {
        setEditedReceptionist(
          convertReceptionistResponseToReceptionistRequest(receptionist)
        );
      }
      notifyError(tSpecificReceptionistPage("toasts.edit_error"));
    } finally {
      setEditing(false);
    }
  };

  const deleteReceptionist = async () => {
    try {
      await ReceptionistService.deleteReceptionist(params.id);
      router.push("/receptionists");
      notifySuccess(tSpecificReceptionistPage("toasts.delete_success"));
    } catch (error) {
      notifyError(tSpecificReceptionistPage("toasts.delete_error"));
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
                {tPagesNavigation("home_page")}
              </Breadcrumb.Item>
            </Link>
            <Link href="/receptionists" passHref legacyBehavior>
              <Breadcrumb.Item className="link">
                {tPagesNavigation("receptionists")}
              </Breadcrumb.Item>
            </Link>
            <Breadcrumb.Item active>
              {tSpecificReceptionistPage("breadcrumb_active_page", {
                id: params.id,
              })}
            </Breadcrumb.Item>
          </Breadcrumb>
          <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
            <Modal.Header closeButton>
              <Modal.Title>
                {tSpecificReceptionistPage("receptionist_delete_dialog.title")}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                {tSpecificReceptionistPage("receptionist_delete_dialog.text")}
              </p>
              <p>
                <i>
                  {tSpecificReceptionistPage(
                    "receptionist_delete_dialog.warning"
                  )}
                </i>
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseDeleteModal}>
                {tCommon("action_cancel_button_label")}
              </Button>
              <Button variant="danger" onClick={deleteReceptionist}>
                {tSpecificReceptionistPage(
                  "receptionist_delete_dialog.confirm_button_label"
                )}
              </Button>
            </Modal.Footer>
          </Modal>

          <ReceptionistCard
            receptionistForm={
              <ReceptionistUpdateForm
                editedReceptionist={editedReceptionist}
                handleChangeReceptionist={handleChangeReceptionist}
                handleEditFormSubmit={handleEditFormSubmit}
                onClickEdit={handleEdit}
                handleCancelEdit={handleCancelEdit}
                handleShowDeleteModal={handleShowDeleteModal}
                editing={editing}
              ></ReceptionistUpdateForm>
            }
          ></ReceptionistCard>
        </>
      ) : (
        <Alert variant="danger">
          <Alert.Heading>
            {tSpecificReceptionistPage("error_alert.header")}
          </Alert.Heading>
          <p>{tSpecificReceptionistPage("error_alert.text")}</p>
        </Alert>
      )}
    </>
  );
}
