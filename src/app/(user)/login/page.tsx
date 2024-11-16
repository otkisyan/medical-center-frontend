"use client";
import { Suspense, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useAuth } from "@/shared/context/UserContextProvider";
import { Alert } from "react-bootstrap";
import { InputGroup } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const tLoginPage = useTranslations("LoginPage");
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);

  const handleLogin = async (event: any) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      setError(null);
      return;
    }
    setValidated(true);
    setError(null);
    setLoading(true);
    try {
      await login(username, password);
      router.push("/");
    } catch (error: any) {
      if (error.response && error.response.status == 401) {
        setError(tLoginPage("alerts.error.invalid_credentials"));
      }
      if (
        (error.response && error.response.status !== 401) ||
        !error.response
      ) {
        setError(tLoginPage("alerts.error.unexpected"));
      }
      setLoading(false);
    } finally {
      if (!error) {
        let loadingTimer = setTimeout(() => setLoading(false), 1000);
      }
    }
  };

  return (
    <>
      <br></br>
      <h1 className="text-center">{tLoginPage("title")}</h1>
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
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Alert
              variant={"danger"}
              hidden={!error}
              className="text-center mx-auto"
              style={{ display: "inline-block" }}
            >
              {error}
            </Alert>
          </div>
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
                placeholder={tLoginPage("username")}
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
                placeholder={tLoginPage("password")}
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
                {tLoginPage("login_submit_button_label")}
              </Button>
            </div>
          </fieldset>
        </Form>
      </div>
    </>
  );
}
