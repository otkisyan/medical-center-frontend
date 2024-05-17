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
import useFetchPatients from "@/shared/hooks/patients/useFetchPatients";
import useFetchPatientsCount from "@/shared/hooks/patients/useFetchPatientsCount";
import SpinnerCenter from "@/components/spinner/SpinnerCenter";

export default function PatientsPage() {
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

  const [params, setParams] = useState(initialParamsState);
  const { patientsCount, loadingPatientsCount } = useFetchPatientsCount();
  const { patientPage, loadingPatients, fetchPatients } = useFetchPatients();

  const clearSearchParams = async () => {
    await fetchPatients(initialParamsState);
    setParams(initialParamsState);
  };

  const handleSearchFormInput = (event: any) => {
    const { name, value } = event.target;
    setParams((prevParams) => ({
      ...prevParams,
      [name]: value,
    }));
  };

  const handlePatientSearchFormSubmit = async (event: any) => {
    event.preventDefault();
    await fetchPatients(params);
  };

  useEffect(() => {
    fetchPatients(initialParamsState);
  }, [fetchPatients, patientsCount, initialParamsState]);

  return (
    <>
      <br></br>
      <Form onSubmit={handlePatientSearchFormSubmit}>
        <Row className="g-3">
          <Col sm>
            <FloatingLabel controlId="surname" label="Прізвище">
              <Form.Control
                type="text"
                name="surname"
                value={params.surname}
                onChange={handleSearchFormInput}
              />
            </FloatingLabel>
          </Col>
          <Col sm>
            <FloatingLabel controlId="name" label="Ім'я">
              <Form.Control
                type="text"
                name="name"
                value={params.name}
                onChange={handleSearchFormInput}
              />
            </FloatingLabel>
          </Col>
          <Col sm>
            <FloatingLabel controlId="middleName" label="По батькові">
              <Form.Control
                type="text"
                name="middleName"
                value={params.middleName}
                onChange={handleSearchFormInput}
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
                onChange={handleSearchFormInput}
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
      {loadingPatientsCount || loadingPatients ? (
        <>
          <SpinnerCenter></SpinnerCenter>
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
        <>
          {patientsCount > 0 ? (
            <Alert
              variant={"danger"}
              className="text-center mx-auto"
              style={{ maxWidth: "400px" }}
            >
              Пацієнтів за заданими критеріями не знайдено
            </Alert>
          ) : (
            <Alert
              variant="secondary"
              className="text-center mx-auto"
              style={{ maxWidth: "400px" }}
            >
              Ще не додано жодного пацієнта
            </Alert>
          )}
        </>
      )}
    </>
  );
}
