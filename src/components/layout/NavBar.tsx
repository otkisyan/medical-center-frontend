"use client";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useAuth } from "@/shared/context/UserContextProvider";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Role } from "@/shared/enum/role";
import React from "react";
import { Button } from "react-bootstrap";

const NavBar = () => {
  const { logout, hasAnyRole, isAuthenticated } = useAuth();
  const pathname = usePathname();

  return (
    <Navbar expand="sm" className="bg-body-tertiary">
      <Container style={{ maxWidth: "960px" }}>
        <Navbar.Brand href="/" as={Link}>
          <i className="bi bi-house-door-fill"></i>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link
              as={Link}
              href="/patients"
              active={pathname == "/patients"}
              hidden={!hasAnyRole([Role.ADMIN, Role.RECEPTIONIST, Role.Doctor])}
            >
              Пацієнти
            </Nav.Link>
            <Nav.Link
              as={Link}
              href="/doctors"
              active={pathname == "/doctors"}
              hidden={!hasAnyRole([Role.ADMIN, Role.RECEPTIONIST])}
            >
              Лікарі
            </Nav.Link>

            <NavDropdown
              title="Прийоми"
              id="navbarScrollingDropdown"
              hidden={!hasAnyRole([Role.ADMIN, Role.RECEPTIONIST, Role.Doctor])}
            >
              <NavDropdown.Item as={Link} href="/appointments">
                Пошук
              </NavDropdown.Item>
              <Link href="/appointments/timetable" passHref legacyBehavior>
                <NavDropdown.Item>Розклад</NavDropdown.Item>
              </Link>
            </NavDropdown>
            <Nav.Link
              as={Link}
              href="/offices"
              active={pathname == "/offices"}
              hidden={!hasAnyRole([Role.ADMIN, Role.RECEPTIONIST, Role.Doctor])}
            >
              Кабінети
            </Nav.Link>
            <Nav.Link
              as={Link}
              href="/receptionists"
              active={pathname == "/receptionists"}
              hidden={!hasAnyRole([Role.ADMIN])}
            >
              Реєстратори
            </Nav.Link>
          </Nav>
          <div className="d-flex align-items-center">
            <Link href="/user" passHref legacyBehavior>
              <Nav.Link
                hidden={!isAuthenticated}
                style={{ marginRight: "10px" }}
              >
                <i className="bi bi-person-workspace"></i>
              </Nav.Link>
            </Link>
            <Button variant="link" onClick={logout}>
              <i className="bi bi-box-arrow-left link-black"></i>
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
export default React.memo(NavBar);
