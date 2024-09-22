"use client";
import { Suspense, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useAuth } from "@/shared/context/UserContextProvider";
import { Alert } from "react-bootstrap";
import { InputGroup } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);

  const handleLogin = async (event: any) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      setError(false);
      return;
    }
    setValidated(true);
    setError(false);
    setLoading(true);
    try {
      await login(username, password);
    } catch (error) {
      setLoading(false);
      setError(true);
    } finally {
      if (!error) {
        let loadingTimer = setTimeout(() => setLoading(false), 1000);
      }
    }
    if (!localStorage.getItem("access_token")) {
      setLoading(false);
    }
  };

  return (
    <>
      <br></br>
      <h1 className="text-center">Авторизація</h1>
      <br></br>
      {loading ? (
        <>
          <div className="d-flex justify-content-center">
            <Spinner animation="grow" role="status" variant="secondary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
          <br></br>
        </>
      ) : (
        <>
          <Alert
            variant={"danger"}
            hidden={!error}
            className="text-center mx-auto"
            style={{ maxWidth: "400px" }}
          >
            Неправильний логін або пароль!
          </Alert>
        </>
      )}
      <div className="login-page mx-auto" style={{ maxWidth: "300px" }}>
        <Form noValidate onSubmit={handleLogin}>
          <fieldset disabled={loading}>
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">
                <i className="bi bi-person-fill"></i>
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Логін"
                aria-label="Username"
                aria-describedby="basic-addon1"
                value={username}
                isInvalid={validated && !username}
                required
                onChange={(e) => setUsername(e.target.value)}
              />
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">
                <i className="bi bi-shield-lock-fill"></i>
              </InputGroup.Text>
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Пароль"
                value={password}
                required
                isInvalid={validated && !password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                variant="secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <i className="bi bi-eye-fill"></i>
                ) : (
                  <i className="bi bi-eye-slash-fill"></i>
                )}{" "}
              </Button>
            </InputGroup>
            <div className="text-center">
              <Button
                variant="primary"
                type="submit"
                className="text-center"
                disabled={!username || !password}
              >
                Увійти
              </Button>
            </div>
          </fieldset>
        </Form>
      </div>
    </>
  );
}
