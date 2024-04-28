"use client";
import React, { useState, useEffect, use } from "react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { PatientService } from "@/service/patient.service";
import { IPatient } from "@/interface/patient/patient.interface";
import { IPage } from "@/interface/page/page.interface";
import "@/css/styles.css";
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import Pagination from "react-bootstrap/Pagination";

export default function PatientsPage() {
  const initialPageState: IPage<IPatient> = {
    content: [],
    totalPages: 0,
    totalElements: 0,
    size: 0,
    number: 0,
    first: false,
    last: false,
  };

  const initialParamsState = {
    surname: "",
    name: "",
    middleName: "",
    birthDate: null,
    page: 0,
  };

  const [patientPage, setPatientPage] =
    useState<IPage<IPatient>>(initialPageState);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useState(initialParamsState);

  const clearSearchParams = async () => {
    await fetchPatients(initialParamsState);
    setParams(initialParamsState);
  };

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setParams((prevParams) => ({
      ...prevParams,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (event: any) => {
    event.preventDefault();
    await fetchPatients(params);
  };

  const fetchPatients = async (params: any) => {
    try {
      setLoading(true);
      const data = await PatientService.findAllPatients(params);
      setPatientPage(data);
    } catch (error) {
      console.error("Error fetching patient data:", error);
    } finally {
      console.log(patientPage);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients(initialParamsState);
  }, []);

  return (
    <div className="wrapper">
      <br></br>
      <Form onSubmit={handleFormSubmit}>
        <Row className="g-2">
          <Col md>
            <FloatingLabel controlId="name" label="Ім'я">
              <Form.Control
                type="text"
                name="name"
                value={params.name}
                onChange={handleInputChange}
              />
            </FloatingLabel>
          </Col>
          <Col md>
            <FloatingLabel
              controlId="surname"
              label="Прізвище"
              className="mb-3"
            >
              <Form.Control
                type="text"
                name="surname"
                value={params.surname}
                onChange={handleInputChange}
              />
            </FloatingLabel>
          </Col>
          <Col md>
            <FloatingLabel
              controlId="middleName"
              label="По батькові"
              className="mb-3"
            >
              <Form.Control
                type="text"
                name="middleName"
                value={params.middleName}
                onChange={handleInputChange}
              />
            </FloatingLabel>
          </Col>
        </Row>
        <Stack direction="horizontal" gap={3}>
          <Button
            variant="link"
            className="ms-auto text-secondary"
            style={{ textDecoration: "none" }}
            onClick={clearSearchParams}
          >
            Очистити пошук
          </Button>
          <Button variant="primary" type="submit" className="d-grid col-3">
            Пошук
          </Button>
        </Stack>
      </Form>

      <br></br>
      {loading ? (
        // Display a loading spinner while data is being fetched
        <span className="sr-only">Loading...</span>
      ) : patientPage && patientPage.content ? (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>First Name</th>
                <th>Last Name</th>
              </tr>
            </thead>
            <tbody>
              {patientPage.content.map((patient, i) => (
                <tr key={i}>
                  <td>{patient.id}</td>
                  <td>{patient.name}</td>
                  <td>{patient.surname}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination>
            <Pagination.First
              onClick={() => fetchPatients({ ...params, page: 0 })}
              disabled={patientPage.first === true}
            />
            <Pagination.Prev
              onClick={() =>
                fetchPatients({ ...params, page: patientPage.number - 1 })
              }
              disabled={patientPage.first === true}
            />
            {[...Array(patientPage.totalPages)].map((_, i) => {
              if (
                i === 0 ||
                i === patientPage.totalPages - 1 ||
                (i >= patientPage.number - 2 && i <= patientPage.number + 2)
              ) {
                return (
                  <Pagination.Item
                    key={i}
                    active={i === patientPage.number}
                    onClick={() => fetchPatients({ ...params, page: i })}
                  >
                    {i + 1}
                  </Pagination.Item>
                );
              } else if (
                i === patientPage.number - 3 ||
                i === patientPage.number + 3
              ) {
                return <Pagination.Ellipsis key={i} disabled />;
              }
              return null;
            })}
            <Pagination.Next
              onClick={() =>
                fetchPatients({ ...params, page: patientPage.number + 1 })
              }
              disabled={patientPage.last === true}
            />
            <Pagination.Last
              onClick={() =>
                fetchPatients({ ...params, page: patientPage.totalPages - 1 })
              }
              disabled={patientPage.last === true}
            />
          </Pagination>
        </>
      ) : (
        <p>No patient data available.</p>
      )}
    </div>
  );
}
