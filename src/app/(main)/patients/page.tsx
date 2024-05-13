"use client";
import "@/css/styles.css";
import { Page } from "@/shared/interface/page/page-interface";
import { PatientResponse } from "@/shared/interface/patient/patient-interface";
import { PatientService } from "@/shared/service/patient-service";
import { formatDateToString } from "@/shared/utils/date-utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Pagination from "react-bootstrap/Pagination";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import Stack from "react-bootstrap/Stack";
import Table from "react-bootstrap/Table";
import Alert from "react-bootstrap/Alert";

export default function PatientsPage() {
  const initialPatientsPageState: Page<PatientResponse> = {
    content: [],
    totalPages: 0,
    totalElements: 0,
    size: 0,
    number: 0,
    first: false,
    last: false,
  };

  const initialParamsState = useMemo(
    () => ({
      surname: "",
      name: "",
      middleName: "",
      birthDate: "",
      page: 0,
    }),
    []
  );

  const [patientPage, setPatientPage] = useState<Page<PatientResponse>>(
    initialPatientsPageState
  );
  const [patientsCount, setPatientsCount] = useState<number>(0);
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

  const fetchPatients = useCallback(async (params: any) => {
    try {
      setLoading(true);
      const data = await PatientService.findAllPatients(params);
      setPatientPage(data);
    } catch (error) {
      console.error("Error fetching patient data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPatientsCount = useCallback(async () => {
    try {
      const count = await PatientService.countPatients();
      setPatientsCount(count);
    } catch (error) {
      console.error("Error fetching patient data:", error);
    } finally {
    }
  }, []);

  useEffect(() => {
    fetchPatientsCount();
    if (patientsCount > 0) {
      fetchPatients(initialParamsState);
    }
  }, [fetchPatientsCount, fetchPatients, initialParamsState, patientsCount]);

  return (
    <>
      <br></br>
      <Form onSubmit={handleFormSubmit}>
        <Row className="g-3">
          <Col sm>
            <FloatingLabel controlId="surname" label="Прізвище">
              <Form.Control
                type="text"
                name="surname"
                value={params.surname}
                onChange={handleInputChange}
              />
            </FloatingLabel>
          </Col>
          <Col sm>
            <FloatingLabel controlId="name" label="Ім'я">
              <Form.Control
                type="text"
                name="name"
                value={params.name}
                onChange={handleInputChange}
              />
            </FloatingLabel>
          </Col>
          <Col sm>
            <FloatingLabel controlId="middleName" label="По батькові">
              <Form.Control
                type="text"
                name="middleName"
                value={params.middleName}
                onChange={handleInputChange}
              />
            </FloatingLabel>
          </Col>
          <Col>
            <FloatingLabel
              controlId="birthDate"
              label="Дата народження"
              className="mb-3"
            >
              <Form.Control
                type="date"
                name="birthDate"
                value={params.birthDate}
                onChange={handleInputChange}
              />
            </FloatingLabel>
          </Col>
        </Row>
        <Stack direction="horizontal" gap={3}>
          <a href="/patients/new" className="link">
            Новий пацієнт →
          </a>
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
        <>
          <div className="d-flex justify-content-center">
            <Spinner animation="grow" role="status" variant="secondary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        </>
      ) : patientPage && patientPage.content.length > 0 ? (
        <>
          <Table striped responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Прізвище</th>
                <th>{`Ім'я`}</th>
                <th>По батькові</th>
                <th>Дата народження</th>
                <th>Дія</th>
              </tr>
            </thead>
            <tbody>
              {patientPage.content.map((patient, i) => (
                <tr key={i}>
                  <td>{patient.id}</td>
                  <td>{patient.surname}</td>
                  <td>{patient.name}</td>
                  <td>{patient.middleName}</td>
                  <td>
                    {patient.birthDate
                      ? formatDateToString(patient.birthDate)
                      : ""}
                  </td>
                  <td>
                    <a
                      className="btn btn-primary"
                      href={`/patients/${encodeURIComponent(patient.id ?? "")}`}
                      role="button"
                    >
                      <i className="bi bi-eye"></i>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination className="d-flex justify-content-center">
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
        <Alert
          variant={"danger"}
          className="text-center mx-auto"
          style={{ maxWidth: "400px" }}
        >
          Пацієнтів за заданими критеріями не знайдено
        </Alert>
      )}
    </>
  );
}
