"use client";
import { formatDateToString } from "@/shared/utils/date-utils";
import { useEffect, useMemo, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Pagination from "react-bootstrap/Pagination";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import Table from "react-bootstrap/Table";
import Alert from "react-bootstrap/Alert";
import useFetchPatients from "@/shared/hooks/patients/useFetchPatients";
import useFetchPatientsCount from "@/shared/hooks/patients/useFetchPatientsCount";
import SpinnerCenter from "@/components/loading/spinner/SpinnerCenter";
import Link from "next/link";
import { ButtonGroup } from "react-bootstrap";
import { useTranslations } from "use-intl";
import PaginationBar from "@/components/pagination/PaginationBar";

export default function PatientsPage() {
  const tCommon = useTranslations("Common");
  const tPatientsPage = useTranslations("PatientsPage");
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
  const {
    patientsCount,
    loadingPatientsCount,
    error: errorLoadingPatientsCount,
  } = useFetchPatientsCount();
  const {
    patientPage,
    loadingPatients,
    fetchPatients,
    error: errorLoadingPatients,
  } = useFetchPatients();

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
            <FloatingLabel
              controlId="surname"
              label={tCommon("personal_data.surname")}
            >
              <Form.Control
                type="text"
                name="surname"
                value={params.surname}
                onChange={handleSearchFormInput}
              />
            </FloatingLabel>
          </Col>
          <Col sm>
            <FloatingLabel
              controlId="name"
              label={tCommon("personal_data.name")}
            >
              <Form.Control
                type="text"
                name="name"
                value={params.name}
                onChange={handleSearchFormInput}
              />
            </FloatingLabel>
          </Col>
          <Col sm>
            <FloatingLabel
              controlId="middleName"
              label={tCommon("personal_data.middle_name")}
            >
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
              label={tCommon("personal_data.birth_date")}
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
          <Link href="/patients/new" className="link">
            {tPatientsPage("new_patient_link_label")}
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
                <th>{tCommon("personal_data.surname")}</th>
                <th>{tCommon("personal_data.name")}</th>
                <th>{tCommon("personal_data.middle_name")}</th>
                <th>{tCommon("personal_data.birth_date")}</th>
                <th>{tCommon("action_label")}</th>
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
                    <ButtonGroup>
                      <Link
                        className="btn btn-primary me-2 rounded"
                        href={`/patients/${encodeURIComponent(
                          patient.id ?? ""
                        )}`}
                        role="button"
                      >
                        <i className="bi bi-eye"></i>
                      </Link>
                      <Link
                        className="btn btn-primary rounded"
                        href={{
                          pathname: "/appointments/timetable",
                          query: { patientId: patient.id },
                        }}
                        role="button"
                      >
                        <i className="bi bi-journal-plus"></i>
                      </Link>
                    </ButtonGroup>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <PaginationBar
            currentPage={patientPage.number}
            totalPages={patientPage.totalPages}
            onPageChange={(page) => fetchPatients({ ...params, page })}
            isFirst={patientPage.first}
            isLast={patientPage.last}
          />
        </>
      ) : (
        <>
          {errorLoadingPatients || errorLoadingPatientsCount ? (
            <Alert
              variant={"danger"}
              className="text-center mx-auto"
              style={{ maxWidth: "400px" }}
            >
              {tPatientsPage("alerts.error_fetching_patients")}
            </Alert>
          ) : patientsCount > 0 ? (
            <Alert
              variant={"danger"}
              className="text-center mx-auto"
              style={{ maxWidth: "400px" }}
            >
              {tPatientsPage("alerts.no_patients_found")}
            </Alert>
          ) : (
            <Alert
              variant="secondary"
              className="text-center mx-auto"
              style={{ maxWidth: "400px" }}
            >
              {tPatientsPage("alerts.no_patients")}
            </Alert>
          )}
        </>
      )}
    </>
  );
}
