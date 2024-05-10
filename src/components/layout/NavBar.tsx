"use client";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useAuth } from "@/shared/context/UserContextProvider";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const { userDetails, logout } = useAuth();
  const pathname = usePathname();
  return (
    <Navbar expand="sm" className="bg-body-tertiary">
      <Container style={{ maxWidth: "960px" }}>
        <Navbar.Brand href="/">
          <i className="bi bi-house-door-fill"></i>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/patients" active={pathname == "/patients"}>
              Пацієнти
            </Nav.Link>
            <Nav.Link href="/doctors" active={pathname == "/doctors"}>
              Лікарі
            </Nav.Link>
            <NavDropdown title="Link" id="navbarScrollingDropdown">
              <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action4">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action5">
                Something else here
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <a href="" onClick={logout}>
            <i className="bi bi-box-arrow-left link-black"></i>
          </a>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
