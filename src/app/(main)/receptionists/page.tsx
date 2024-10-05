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
import useFetchReceptionists from "@/shared/hooks/receptionist/useFetchReceptionists";
import useFetchReceptionistsCount from "@/shared/hooks/receptionist/useFetchReceptionistsCount";
import { formatDateToString } from "@/shared/utils/date-utils";
import SpinnerCenter from "@/components/loading/spinner/SpinnerCenter";
import Link from "next/link";
import PaginationBar from "@/components/pagination/PaginationBar";

export default function ReceptionistsPage() {
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
  const { receptionistsCount, loadingReceptionistsCount } =
    useFetchReceptionistsCount();
  const { receptionistPage, loadingReceptionists, fetchReceptionists } =
    useFetchReceptionists();

  const clearSearchParams = async () => {
    await fetchReceptionists(initialParamsState);
    setParams(initialParamsState);
  };

  const handleSearchFormInput = (event: any) => {
    const { name, value } = event.target;
    setParams((prevParams) => ({
      ...prevParams,
      [name]: value,
    }));
  };

  const handleReceptionistSearchFormSubmit = async (event: any) => {
    event.preventDefault();
    await fetchReceptionists(params);
  };

  useEffect(() => {
    fetchReceptionists(initialParamsState);
  }, [fetchReceptionists, receptionistsCount, initialParamsState]);

  return (
    <>
      <br></br>
      <Form onSubmit={handleReceptionistSearchFormSubmit}>
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
          <Link href="/receptionists/new" className="link">
            Новий реєстратор →
          </Link>
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
      {loadingReceptionistsCount || loadingReceptionists ? (
        <SpinnerCenter></SpinnerCenter>
      ) : receptionistPage && receptionistPage.content.length > 0 ? (
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
              {receptionistPage.content.map((receptionist, i) => (
                <tr key={i}>
                  <td>{receptionist.id}</td>
                  <td>{receptionist.surname}</td>
                  <td>{receptionist.name}</td>
                  <td>{receptionist.middleName}</td>
                  <td>
                    {receptionist.birthDate
                      ? formatDateToString(receptionist.birthDate)
                      : ""}
                  </td>
                  <td>
                    <Link
                      className="btn btn-primary"
                      href={`/receptionists/${encodeURIComponent(
                        receptionist.id ?? ""
                      )}`}
                      role="button"
                    >
                      <i className="bi bi-eye"></i>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <PaginationBar
            currentPage={receptionistPage.number}
            totalPages={receptionistPage.totalPages}
            onPageChange={(page) => fetchReceptionists({ ...params, page })}
            isFirst={receptionistPage.first}
            isLast={receptionistPage.last}
          />
        </>
      ) : (
        <>
          {receptionistsCount > 0 ? (
            <Alert
              variant={"danger"}
              className="text-center mx-auto"
              style={{ maxWidth: "450px" }}
            >
              Реєстраторів за заданими критеріями не знайдено
            </Alert>
          ) : (
            <Alert
              variant="secondary"
              className="text-center mx-auto"
              style={{ maxWidth: "400px" }}
            >
              Ще не додано жодного реєстратора
            </Alert>
          )}
        </>
      )}
    </>
  );
}
