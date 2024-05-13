"use client";
import "@/css/styles.css";
import { DoctorResponse } from "@/shared/interface/doctor/doctor-interface";
import { Page } from "@/shared/interface/page/page-interface";
import { DoctorService } from "@/shared/service/doctor-service";
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
  const initialDoctorPageState: Page<DoctorResponse> = {
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

  const [doctorPage, setDoctorPage] = useState<Page<DoctorResponse>>(
    initialDoctorPageState
  );
  const [doctorsCount, setDoctorsCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useState(initialParamsState);

  const clearSearchParams = async () => {
    await fetchDoctors(initialParamsState);
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
    await fetchDoctors(params);
  };

  const fetchDoctors = useCallback(async (params: any) => {
    try {
      setLoading(true);
      const data = await DoctorService.findAllDoctors(params);
      setDoctorPage(data);
    } catch (error) {
      console.error("Error fetching doctor data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDoctorsCount = useCallback(async () => {
    try {
      const count = await DoctorService.countDoctors();
      setDoctorsCount(count);
    } catch (error) {
      console.error("Error fetching doctors data:", error);
    } finally {
    }
  }, []);

  useEffect(() => {
    fetchDoctorsCount();
    if (doctorsCount > 0) {
      fetchDoctors(initialParamsState);
    }
  }, [fetchDoctorsCount, fetchDoctors, initialParamsState, doctorsCount]);

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
      {loading ? (
        <>
          <div className="d-flex justify-content-center">
            <Spinner animation="grow" role="status" variant="secondary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        </>
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
        <Alert
          variant={"danger"}
          className="text-center mx-auto"
          style={{ maxWidth: "400px" }}
        >
          Лікарів за заданими критеріями не знайдено
        </Alert>
      )}
    </>
  );
}
