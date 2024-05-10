"use client";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useAuth } from "@/shared/context/UserContextProvider";
import { Alert } from "react-bootstrap";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { InputGroup } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import { access } from "fs";

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const logout = searchParams.get("logout");
    const error = searchParams.get("error");
    if (logout) {
      setIsLoggedOut(true);
    } else if (error) {
      setIsLoggedOut(false);
      setError(true);
    }
  }, [searchParams]);

  const handleLogin = async (event: any) => {
    event.preventDefault();
    setIsLoggedOut(false);
    setLoading(true);
    await login(username, password);
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
            variant={"success"}
            hidden={!isLoggedOut}
            className="text-center mx-auto"
            style={{ maxWidth: "400px" }}
          >
            Ви успішно вийшли з облікового запису!
          </Alert>
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
        <Form onSubmit={handleLogin}>
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
              <Button variant="primary" type="submit" className="text-center">
                Увійти
              </Button>
            </div>
          </fieldset>
        </Form>
      </div>
    </>
  );
}
