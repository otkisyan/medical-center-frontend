"use client";

import SpinnerCenter from "@/components/loading/spinner/SpinnerCenter";
import useFetchOffices from "@/shared/hooks/office/useFetchOffices";
import useFetchOfficesCount from "@/shared/hooks/office/useFetchOfficesCount";
import { OfficeResponse } from "@/shared/interface/office/office-interface";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  ButtonGroup,
  Col,
  FloatingLabel,
  Form,
  Pagination,
  Row,
  Stack,
  Table,
} from "react-bootstrap";

export default function OfficesPage() {
  const initialParamsState = useMemo(
    () => ({
      number: "",
      name: "",
    }),
    []
  );

  const [params, setParams] = useState(initialParamsState);
  const { officesCount, loadingOfficesCount } = useFetchOfficesCount();
  const { officePage, loadingOffices, fetchOffices } = useFetchOffices();

  const clearSearchParams = async () => {
    await fetchOffices(initialParamsState);
    setParams(initialParamsState);
  };

  const handleSearchFormInput = (event: any) => {
    const { name, value } = event.target;
    setParams((prevParams) => ({
      ...prevParams,
      [name]: value,
    }));
  };

  const handleOfficeSearchFormSubmit = async (event: any) => {
    event.preventDefault();
    await fetchOffices(params);
  };

  useEffect(() => {
    fetchOffices(initialParamsState);
  }, [fetchOffices, officesCount, initialParamsState]);

  return (
    <>
      <br />
      <Form onSubmit={handleOfficeSearchFormSubmit}>
        <Row className="g-3 mb-3">
          <Col sm>
            <FloatingLabel controlId="number" label="Номер кабінету">
              <Form.Control
                type="text"
                name="number"
                value={params.number}
                onChange={handleSearchFormInput}
              />
            </FloatingLabel>
          </Col>
          <Col sm>
            <FloatingLabel controlId="name" label="Назва кабінету">
              <Form.Control
                type="text"
                name="name"
                value={params.name}
                onChange={handleSearchFormInput}
              />
            </FloatingLabel>
          </Col>
        </Row>
        <Stack direction="horizontal" gap={3}>
          <Link href="/offices/new" className="link">
            Новий кабінет →
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

      <br />
      {loadingOfficesCount || loadingOffices ? (
        <SpinnerCenter />
      ) : officePage && officePage.content.length > 0 ? (
        <>
          <Table striped responsive>
            <thead>
              <tr>
                <th>Номер кабінету</th>
                <th>Назва</th>
                <th>Дія</th>
              </tr>
            </thead>
            <tbody>
              {officePage.content.map((office: OfficeResponse, i: number) => (
                <tr key={i}>
                  <td>{office.number}</td>
                  <td>{office.name}</td>
                  <td>
                    <ButtonGroup>
                      <Link
                        className="btn btn-primary me-2 rounded"
                        href={`/offices/${encodeURIComponent(office.id ?? "")}`}
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
              onClick={() => fetchOffices({ ...params, page: 0 })}
              disabled={officePage.first === true}
            />
            <Pagination.Prev
              onClick={() =>
                fetchOffices({ ...params, page: officePage.number - 1 })
              }
              disabled={officePage.first === true}
            />
            {[...Array(officePage.totalPages)].map((_, i) => {
              if (
                i === 0 ||
                i === officePage.totalPages - 1 ||
                (i >= officePage.number - 2 && i <= officePage.number + 2)
              ) {
                return (
                  <Pagination.Item
                    key={i}
                    active={i === officePage.number}
                    onClick={() => fetchOffices({ ...params, page: i })}
                  >
                    {i + 1}
                  </Pagination.Item>
                );
              } else if (
                i === officePage.number - 3 ||
                i === officePage.number + 3
              ) {
                return <Pagination.Ellipsis key={i} disabled />;
              }
              return null;
            })}
            <Pagination.Next
              onClick={() =>
                fetchOffices({ ...params, page: officePage.number + 1 })
              }
              disabled={officePage.last === true}
            />
            <Pagination.Last
              onClick={() =>
                fetchOffices({ ...params, page: officePage.totalPages - 1 })
              }
              disabled={officePage.last === true}
            />
          </Pagination>
        </>
      ) : (
        <>
          {officesCount > 0 ? (
            <Alert
              variant={"danger"}
              className="text-center mx-auto"
              style={{ maxWidth: "400px" }}
            >
              Кабінетів за заданими критеріями не знайдено
            </Alert>
          ) : (
            <Alert
              variant="secondary"
              className="text-center mx-auto"
              style={{ maxWidth: "400px" }}
            >
              Ще не додано жодного кабінету
            </Alert>
          )}
        </>
      )}
    </>
  );
}
