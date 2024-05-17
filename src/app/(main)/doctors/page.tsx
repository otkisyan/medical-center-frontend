"use client";
import "@/css/styles.css";
import { useMemo, useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Pagination from "react-bootstrap/Pagination";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import Table from "react-bootstrap/Table";
import Alert from "react-bootstrap/Alert";
import useFetchDoctors from "@/shared/hooks/doctor/useFetchDoctors";
import useFetchDoctorsCount from "@/shared/hooks/doctor/useFetchDoctorsCount";
import { formatDateToString } from "@/shared/utils/date-utils";
import SpinnerCenter from "@/components/spinner/SpinnerCenter";

export default function DoctorsPage() {
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
  const { doctorsCount, loadingDoctorsCount } = useFetchDoctorsCount();
  const { doctorPage, loadingDoctors, fetchDoctors } = useFetchDoctors();

  const clearSearchParams = async () => {
    await fetchDoctors(initialParamsState);
    setParams(initialParamsState);
  };

  const handleSearchFormInput = (event: any) => {
    const { name, value } = event.target;
    setParams((prevParams) => ({
      ...prevParams,
      [name]: value,
    }));
  };

  const handleDoctorSearchFormSubmit = async (event: any) => {
    event.preventDefault();
    await fetchDoctors(params);
  };

  useEffect(() => {
    fetchDoctors(initialParamsState);
  }, [fetchDoctors, doctorsCount, initialParamsState]);

  return (
    <>
      <br></br>
      <Form onSubmit={handleDoctorSearchFormSubmit}>
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
          <a href="/doctors/new" className="link">
            Новий лікар →
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
      {loadingDoctorsCount || loadingDoctors ? (
        <SpinnerCenter></SpinnerCenter>
      ) : doctorPage && doctorPage.content.length > 0 ? (
        <>
          <Table striped responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Прізвище</th>
                <th>{`Ім'я`}</th>
                <th>По батькові</th>
                <th>Дата народження</th>
                <th>Медична спеціальність</th>
                <th>Дія</th>
              </tr>
            </thead>
            <tbody>
              {doctorPage.content.map((doctor, i) => (
                <tr key={i}>
                  <td>{doctor.id}</td>
                  <td>{doctor.surname}</td>
                  <td>{doctor.name}</td>
                  <td>{doctor.middleName}</td>
                  <td>
                    {doctor.birthDate
                      ? formatDateToString(doctor.birthDate)
                      : ""}
                  </td>
                  <td>{doctor.medicalSpecialty}</td>
                  <td>
                    <a
                      className="btn btn-primary"
                      href={`/doctors/${encodeURIComponent(doctor.id ?? "")}`}
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
              onClick={() => fetchDoctors({ ...params, page: 0 })}
              disabled={doctorPage.first === true}
            />
            <Pagination.Prev
              onClick={() =>
                fetchDoctors({ ...params, page: doctorPage.number - 1 })
              }
              disabled={doctorPage.first === true}
            />
            {[...Array(doctorPage.totalPages)].map((_, i) => {
              if (
                i === 0 ||
                i === doctorPage.totalPages - 1 ||
                (i >= doctorPage.number - 2 && i <= doctorPage.number + 2)
              ) {
                return (
                  <Pagination.Item
                    key={i}
                    active={i === doctorPage.number}
                    onClick={() => fetchDoctors({ ...params, page: i })}
                  >
                    {i + 1}
                  </Pagination.Item>
                );
              } else if (
                i === doctorPage.number - 3 ||
                i === doctorPage.number + 3
              ) {
                return <Pagination.Ellipsis key={i} disabled />;
              }
              return null;
            })}
            <Pagination.Next
              onClick={() =>
                fetchDoctors({ ...params, page: doctorPage.number + 1 })
              }
              disabled={doctorPage.last === true}
            />
            <Pagination.Last
              onClick={() =>
                fetchDoctors({ ...params, page: doctorPage.totalPages - 1 })
              }
              disabled={doctorPage.last === true}
            />
          </Pagination>
        </>
      ) : (
        <>
          {doctorsCount > 0 ? (
            <Alert
              variant={"danger"}
              className="text-center mx-auto"
              style={{ maxWidth: "400px" }}
            >
              Лікарів за заданими критеріями не знайдено
            </Alert>
          ) : (
            <Alert
              variant="secondary"
              className="text-center mx-auto"
              style={{ maxWidth: "400px" }}
            >
              Ще не додано жодного лікаря
            </Alert>
          )}
        </>
      )}
    </>
  );
}
