"use client";

import SpinnerCenter from "@/components/loading/spinner/SpinnerCenter";
import PaginationBar from "@/components/pagination/PaginationBar";
import useFetchOffices from "@/shared/hooks/office/useFetchOffices";
import useFetchOfficesCount from "@/shared/hooks/office/useFetchOfficesCount";
import { OfficeResponse } from "@/shared/interface/office/office-interface";
import { useTranslations } from "next-intl";
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
  const tCommon = useTranslations("Common");
  const tOfficesPage = useTranslations("OfficesPage");
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
            <FloatingLabel controlId="number" label={tCommon("office.number")}>
              <Form.Control
                type="number"
                name="number"
                value={params.number}
                onChange={handleSearchFormInput}
              />
            </FloatingLabel>
          </Col>
          <Col sm>
            <FloatingLabel controlId="name" label={tCommon("office.name")}>
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
            {tOfficesPage("new_office_link_label")}
          </Link>
          <Button
            variant="link"
            className="ms-auto text-secondary"
            style={{ textDecoration: "none" }}
            onClick={clearSearchParams}
          >
            {tCommon("search.clear_button_label")}
          </Button>
          <Button variant="primary" type="submit" className="d-grid col-3">
            {tCommon("search.button_label")}
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
                <th>{tCommon("office.number_short")}</th>
                <th>{tCommon("office.name_short")}</th>
                <th>{tCommon("action_label")}</th>
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
          <PaginationBar
            currentPage={officePage.number}
            totalPages={officePage.totalPages}
            onPageChange={(page) => fetchOffices({ ...params, page })}
            isFirst={officePage.first}
            isLast={officePage.last}
          />
        </>
      ) : (
        <>
          {officesCount > 0 ? (
            <Alert
              variant={"danger"}
              className="text-center mx-auto"
              style={{ maxWidth: "400px" }}
            >
              {tOfficesPage("alerts.no_offices_found")}
            </Alert>
          ) : (
            <Alert
              variant="secondary"
              className="text-center mx-auto"
              style={{ maxWidth: "400px" }}
            >
              {tOfficesPage("alerts.no_offices")}
            </Alert>
          )}
        </>
      )}
    </>
  );
}
