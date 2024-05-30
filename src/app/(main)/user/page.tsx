"use client";
import { Role } from "@/shared/enum/role";
import { useEffect, useState } from "react";
import ua from "@/shared/locale/ua-locale.json";
import { useAuth } from "@/shared/context/UserContextProvider";
import {
  Alert,
  Button,
  Col,
  Form,
  InputGroup,
  Modal,
  Row,
} from "react-bootstrap";
import {
  ChangePasswordRequest,
  initialChangePasswordRequestState,
} from "@/shared/interface/user/password-change";
import { UserService } from "@/shared/service/user-service";
import { notifyError, notifySuccess } from "@/shared/toast/toast-notifiers";
import SpinnerCenter from "@/components/loading/spinner/SpinnerCenter";

export default function UserPage() {
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
    setChangePasswordRequest(initialChangePasswordRequestState);
    setChangePasswordValidationError(false);
    setApiError("");
  };
  const handleShowChangePasswordModal = () => setShowChangePasswordModal(true);

  useEffect(() => {
    if (hasAnyRole([Role.Doctor])) {
      setRole(ua.roles.DOCTOR);
    } else if (hasAnyRole([Role.RECEPTIONIST])) {
      setRole(ua.roles.RECEPTIONIST);
    } else if (hasAnyRole([Role.ADMIN])) {
      setRole(ua.roles.ADMIN);
    }
  }, [hasAnyRole]);

  const handleChangePasswordRequest = (event: any) => {
    const { name, value } = event.target;
    setChangePasswordRequest((prevChangePasswordRequest) => ({
      ...prevChangePasswordRequest,
      [name]: value,
    }));
  };

  const handleChangePasswordFormSubmit = async (event: any) => {
    event.preventDefault();
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
      notifySuccess("Пароль від облікового запису успішно змінено!");
    } catch (error: any) {
      console.log(error);
      const errorMessage = error.response.data.message;
      if (error.response && error.response.status === 400) {
        if (
          errorMessage.includes(
            "The password provided does not match the real password"
          )
        ) {
          setApiError("Поточний пароль не співпадає з реальним!");
        } else if (
          errorMessage.includes(
            "The confirmation password does not match the new password"
          )
        ) {
          setApiError("Підтвердження паролю не співпадає з новим паролем!");
        }
      }
    } finally {
      setChangePasswordLoading(false);
    }
  };

  return (
    <>
      <br></br>
      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label>Логін</Form.Label>
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
            <Form.Label>Роль</Form.Label>
            <Form.Control type="text" readOnly disabled value={role} />
          </Form.Group>
        </Col>
      </Row>

      <Button type="button" onClick={handleShowChangePasswordModal}>
        Змінити пароль
      </Button>

      <Modal
        show={showChangePasswordModal}
        onHide={handleCloseChangePasswordModal}
      >
        <Form onSubmit={handleChangePasswordFormSubmit}>
          <fieldset disabled={changePasswordLoading}>
            <Modal.Header closeButton>
              <Modal.Title>Зміна паролю</Modal.Title>
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
              <Form.Label>Поточний пароль</Form.Label>
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

              <Form.Label>Новий пароль</Form.Label>
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
              <Form.Label>Підтвердження паролю</Form.Label>
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
                  Підтвердження паролю не співпадає з новим паролем
                </Form.Control.Feedback>
              </InputGroup>
              <Form.Text id="passwordHelpBlock" muted>
                У поле &quot;Підтвердження паролю&quot; введіть той самий пароль
                який ви ввели у поле &quot;Новий пароль&quot;
              </Form.Text>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={handleCloseChangePasswordModal}
              >
                Скасувати
              </Button>
              <Button variant="primary" type="submit">
                Змінити пароль
              </Button>
            </Modal.Footer>
          </fieldset>
        </Form>
      </Modal>
    </>
  );
}
