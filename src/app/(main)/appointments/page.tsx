"use client";
import { useMemo, useState, useEffect, useCallback } from "react";
import {
  formatDateToString,
  formatTimeSecondsToTime,
} from "@/shared/utils/date-utils";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Pagination from "react-bootstrap/Pagination";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import Table from "react-bootstrap/Table";
import Alert from "react-bootstrap/Alert";
import Link from "next/link";
import { ButtonGroup } from "react-bootstrap";
import SpinnerCenter from "@/components/loading/spinner/SpinnerCenter";
import useFetchAppointmentsCount from "@/shared/hooks/appointment/useFetchAppointmentsCount";
import useFetchAppointments from "@/shared/hooks/appointment/useFetchAppointments";

export default function AppointmentsPage() {
  const initialParamsState = useMemo(
    () => ({
      patient: "",
      doctor: "",
      date: "",
      timeStart: "",
      page: 0,
    }),
    []
  );

  const [params, setParams] = useState(initialParamsState);
  const { appointmentsCount, loadingAppointmentsCount } =
    useFetchAppointmentsCount();
  const { appointmentPage, loadingAppointments, fetchAppointments } =
    useFetchAppointments();

  const clearSearchParams = async () => {
    await fetchAppointments(initialParamsState);
    setParams(initialParamsState);
  };

  const handleSearchFormInput = (event: any) => {
    const { name, value } = event.target;
    setParams((prevParams) => ({
      ...prevParams,
      [name]: value,
    }));
  };

  const handleAppointmentSearchFormSubmit = async (event: any) => {
    event.preventDefault();
    await fetchAppointments(params);
  };

  useEffect(() => {
    fetchAppointments(initialParamsState);
  }, [fetchAppointments, appointmentsCount, initialParamsState]);

  return (
    <>
      <br />
      <Form onSubmit={handleAppointmentSearchFormSubmit}>
        <Row className="g-3 mb-3">
          <Col sm>
            <FloatingLabel controlId="patient" label="Пацієнт">
              <Form.Control
                type="text"
                name="patient"
                value={params.patient}
                onChange={handleSearchFormInput}
              />
            </FloatingLabel>
          </Col>
          <Col sm>
            <FloatingLabel controlId="doctor" label="Лікар">
              <Form.Control
                type="text"
                name="doctor"
                value={params.doctor}
                onChange={handleSearchFormInput}
              />
            </FloatingLabel>
          </Col>
          <Col sm>
            <FloatingLabel controlId="date" label="Дата">
              <Form.Control
                type="date"
                name="date"
                max="9999-12-31"
                value={params.date}
                onChange={handleSearchFormInput}
              />
            </FloatingLabel>
          </Col>
          <Col sm>
            <FloatingLabel controlId="timeStart" label="Час початку">
              <Form.Control
                type="time"
                name="timeStart"
                value={params.timeStart}
                onChange={handleSearchFormInput}
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

      <br />
      {loadingAppointmentsCount || loadingAppointments ? (
        <SpinnerCenter />
      ) : appointmentPage && appointmentPage.content.length > 0 ? (
        <>
          <Table striped responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Пацієнт</th>
                <th>Лікар</th>
                <th>Спеціальність</th>
                <th>Дата</th>
                <th>Час</th>
                <th>Кабінет</th>
                <th>Дія</th>
              </tr>
            </thead>
            <tbody>
              {appointmentPage.content.map((appointment, i) => (
                <tr key={i}>
                  <td>{appointment.id}</td>
                  <td>
                    {appointment.patient.surname +
                      " " +
                      appointment.patient.name[0] +
                      "." +
                      appointment.patient.middleName[0] +
                      "."}
                  </td>
                  <td>
                    {appointment.doctor.surname +
                      " " +
                      appointment.doctor.name[0] +
                      "." +
                      appointment.doctor.middleName[0] +
                      "."}
                  </td>
                  <td>{appointment.doctor.medicalSpecialty}</td>
                  <td>{formatDateToString(appointment.date)}</td>
                  <td>
                    {formatTimeSecondsToTime(appointment.timeStart) +
                      " - " +
                      formatTimeSecondsToTime(appointment.timeEnd)}
                  </td>
                  <td>
                    {appointment.doctor.office
                      ? appointment.doctor.office.number
                      : "-"}
                  </td>
                  <td>
                    <ButtonGroup>
                      <Link
                        className="btn btn-primary me-2 rounded"
                        href={`/appointments/${encodeURIComponent(
                          appointment.id
                        )}`}
                        role="button"
                      >
                        <i className="bi bi-eye"></i>
                      </Link>
                    </ButtonGroup>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination className="d-flex justify-content-center">
            <Pagination.First
              onClick={() => fetchAppointments({ ...params, page: 0 })}
              disabled={appointmentPage.first === true}
            />
            <Pagination.Prev
              onClick={() =>
                fetchAppointments({
                  ...params,
                  page: appointmentPage.number - 1,
                })
              }
              disabled={appointmentPage.first === true}
            />
            {[...Array(appointmentPage.totalPages)].map((_, i) => (
              <Pagination.Item
                key={i}
                active={i === appointmentPage.number}
                onClick={() => fetchAppointments({ ...params, page: i })}
              >
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() =>
                fetchAppointments({
                  ...params,
                  page: appointmentPage.number + 1,
                })
              }
              disabled={appointmentPage.last === true}
            />
            <Pagination.Last
              onClick={() =>
                fetchAppointments({
                  ...params,
                  page: appointmentPage.totalPages - 1,
                })
              }
              disabled={appointmentPage.last === true}
            />
          </Pagination>
        </>
      ) : (
        <>
          {appointmentsCount > 0 ? (
            <Alert
              variant="danger"
              className="text-center mx-auto"
              style={{ maxWidth: "400px" }}
            >
              Прийомів за заданими критеріями не знайдено
            </Alert>
          ) : (
            <Alert
              variant="secondary"
              className="text-center mx-auto"
              style={{ maxWidth: "400px" }}
            >
              Ще не додано жодного прийому
            </Alert>
          )}
        </>
      )}
    </>
  );
}
