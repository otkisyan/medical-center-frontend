"use client";
import SpinnerCenter from "@/components/loading/spinner/SpinnerCenter";
import LocaleSwitcher from "@/components/locale/LocaleSwitcher";
import { useAuth } from "@/shared/context/UserContextProvider";
import { Role } from "@/shared/enum/role";
import {
  ChangePasswordRequest,
  initialChangePasswordRequestState,
} from "@/shared/interface/user/password-change";
import { UserService } from "@/shared/service/user-service";
import { notifySuccess } from "@/shared/toast/toast-notifiers";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  InputGroup,
  Modal,
  Row,
} from "react-bootstrap";

export default function UserPage() {
  const tUser = useTranslations("User");
  const tCommon = useTranslations("Common");
  const tUserPage = useTranslations("UserPage");
  const [role, setRole] = useState("");
  const { hasAnyRole, userDetails } = useAuth();
  const [changePasswordRequest, setChangePasswordRequest] =
    useState<ChangePasswordRequest>(initialChangePasswordRequestState);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const [changePasswordValidationError, setChangePasswordValidationError] =
    useState(false);
  const [apiError, setApiError] = useState("");

  const handleCloseChangePasswordModal = () => {
    setShowChangePasswordModal(false);
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setChangePasswordRequest(initialChangePasswordRequestState);
    setChangePasswordValidationError(false);
    setApiError("");
  };
  const handleShowChangePasswordModal = () => setShowChangePasswordModal(true);

  useEffect(() => {
    if (hasAnyRole([Role.Doctor])) {
      setRole(tUser("roles.doctor"));
    } else if (hasAnyRole([Role.RECEPTIONIST])) {
      setRole(tUser("roles.receptionist"));
    } else if (hasAnyRole([Role.ADMIN])) {
      setRole(tUser("roles.admin"));
    }
  }, [hasAnyRole, tUser]);

  const handleChangePasswordRequest = (event: any) => {
    const { name, value } = event.target;
    setChangePasswordRequest((prevChangePasswordRequest) => ({
      ...prevChangePasswordRequest,
      [name]: value,
    }));
  };

  const handleChangePasswordFormSubmit = async (event: any) => {
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
      const data = await UserService.changePassword(changePasswordRequest);
      handleCloseChangePasswordModal();
      notifySuccess(tUserPage("toasts.change_password_success"));
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

  return (
    <>
      <br></br>
      <Card className="mb-3">
        <Card.Header>{tUserPage("security_label")}</Card.Header>
        <Card.Body>
          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>{tUserPage("login_label")}</Form.Label>
                <Form.Control
                  type="text"
                  readOnly
                  disabled
                  value={userDetails?.username}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>{tUserPage("role_label")}</Form.Label>
                <Form.Control type="text" readOnly disabled value={role} />
              </Form.Group>
            </Col>
          </Row>

          <Button type="button" onClick={handleShowChangePasswordModal}>
            {tUserPage("change_password_button_label")}
          </Button>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>{tUserPage("settings_label")}</Card.Header>
        <Card.Body>
          <LocaleSwitcher></LocaleSwitcher>
        </Card.Body>
      </Card>

      <Modal
        show={showChangePasswordModal}
        onHide={handleCloseChangePasswordModal}
      >
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
    </>
  );
}
