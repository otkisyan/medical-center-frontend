import React, { useState } from "react";
import { Button, Form, InputGroup, Modal, Alert } from "react-bootstrap";
import { useTranslations } from "next-intl";
import {
  ChangePasswordRequest,
  initialChangePasswordRequestState,
} from "@/shared/interface/user/password-change";
import { UserService } from "@/shared/service/user-service";
import { notifySuccess } from "@/shared/toast/toast-notifiers";
import SpinnerCenter from "../loading/spinner/SpinnerCenter";

interface ChangePasswordModalProps {
  show: boolean;
  onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  show,
  onClose,
}) => {
  const tUserPage = useTranslations("UserPage");
  const tCommon = useTranslations("Common");
  const [changePasswordRequest, setChangePasswordRequest] =
    useState<ChangePasswordRequest>(initialChangePasswordRequestState);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const [changePasswordValidationError, setChangePasswordValidationError] =
    useState(false);
  const [apiError, setApiError] = useState("");

  const handleChangePasswordRequest = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    setChangePasswordRequest((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChangePasswordFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setApiError("");
    if (
      changePasswordRequest.newPassword !==
      changePasswordRequest.confirmPassword
    ) {
      setChangePasswordValidationError(true);
      event.stopPropagation();
      return;
    } else {
      setChangePasswordValidationError(false);
    }

    try {
      setChangePasswordLoading(true);
      await UserService.changePassword(changePasswordRequest);
      notifySuccess(tUserPage("toasts.change_password_success"));
      onClose();
    } catch (error: any) {
      const errorMessage = error.response.data.message;
      if (error.response && error.response.status === 400) {
        if (
          errorMessage.includes(
            "The password provided does not match the real password"
          )
        ) {
          setApiError(tUserPage("toasts.current_password_incorrect"));
        } else if (
          errorMessage.includes(
            "The confirmation password does not match the new password"
          )
        ) {
          setApiError(tUserPage("toasts.confirm_password_incorrect"));
        }
      }
    } finally {
      setChangePasswordLoading(false);
    }
  };

  const handleCloseChangePasswordModal = () => {
    onClose();
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setChangePasswordRequest(initialChangePasswordRequestState);
    setChangePasswordValidationError(false);
    setApiError("");
  };
  return (
    <Modal show={show} onHide={handleCloseChangePasswordModal}>
      <Form onSubmit={handleChangePasswordFormSubmit}>
        <fieldset disabled={changePasswordLoading}>
          <Modal.Header closeButton>
            <Modal.Title>
              {tUserPage("change_password_dialog.dialog_label")}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {changePasswordLoading ? (
              <>
                <SpinnerCenter></SpinnerCenter>
                <br></br>
              </>
            ) : (
              <>
                <Alert
                  variant={"danger"}
                  hidden={!apiError}
                  className="text-center mx-auto"
                >
                  {apiError}
                </Alert>
              </>
            )}
            <Form.Label>
              {tUserPage("change_password_dialog.current_password")}
            </Form.Label>
            <InputGroup className="mb-3">
              <Form.Control
                type={showCurrentPassword ? "text" : "password"}
                name="currentPassword"
                value={changePasswordRequest.currentPassword}
                required
                onChange={handleChangePasswordRequest}
              />
              <Button
                variant="secondary"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? (
                  <i className="bi bi-eye-fill"></i>
                ) : (
                  <i className="bi bi-eye-slash-fill"></i>
                )}
              </Button>
            </InputGroup>

            <Form.Label>
              {tUserPage("change_password_dialog.new_password")}
            </Form.Label>
            <InputGroup className="mb-3">
              <Form.Control
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                id="newPassword"
                value={changePasswordRequest.newPassword}
                required
                onChange={handleChangePasswordRequest}
              />
              <Button
                variant="secondary"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <i className="bi bi-eye-fill"></i>
                ) : (
                  <i className="bi bi-eye-slash-fill"></i>
                )}{" "}
              </Button>
            </InputGroup>
            <Form.Label>
              {tUserPage("change_password_dialog.confirm_password")}
            </Form.Label>
            <InputGroup className="mb-3" hasValidation>
              <Form.Control
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                id="confirmPassword"
                isInvalid={changePasswordValidationError}
                value={changePasswordRequest.confirmPassword}
                required
                onChange={handleChangePasswordRequest}
              />
              <Button
                variant="secondary"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <i className="bi bi-eye-fill"></i>
                ) : (
                  <i className="bi bi-eye-slash-fill"></i>
                )}{" "}
              </Button>
              <Form.Control.Feedback type="invalid">
                {tUserPage("toasts.confirm_password_incorrect")}
              </Form.Control.Feedback>
            </InputGroup>
            <Form.Text id="passwordHelpBlock" muted>
              {tUserPage("change_password_dialog.confirm_password_tip")}
            </Form.Text>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={handleCloseChangePasswordModal}
            >
              {tCommon("action_cancel_button_label")}
            </Button>
            <Button variant="primary" type="submit">
              {tUserPage("change_password_dialog.confirm_button_label")}
            </Button>
          </Modal.Footer>
        </fieldset>
      </Form>
    </Modal>
  );
};

export default ChangePasswordModal;
