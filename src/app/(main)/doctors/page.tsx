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
import SpinnerCenter from "@/components/loading/spinner/SpinnerCenter";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function DoctorsPage() {
  const tCommon = useTranslations("Common");
  const tDoctorsPage = useTranslations("DoctorsPage");
  const initialParamsState = useMemo(
    () => ({
      surname: "",
      name: "",
      middleName: "",
      birthDate: "",
      medicalSpecialty: "",
      office: "",
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
          <Col sm>
            <FloatingLabel
              controlId="medicalSpecialty"
              label={tCommon("personal_data.doctor.medical_specialty_short")}
            >
              <Form.Control
                type="text"
                name="medicalSpecialty"
                value={params.medicalSpecialty}
                onChange={handleSearchFormInput}
              />
            </FloatingLabel>
          </Col>
          <Col>
            <FloatingLabel controlId="number" label={tCommon("office.label")}>
              <Form.Control
                type="number"
                name="office"
                value={params.office}
                onChange={handleSearchFormInput}
              />
            </FloatingLabel>
          </Col>
          <Col sm>
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
          <Link href="/doctors/new" className="link">
            {tDoctorsPage("new_doctor_link_label")}
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
      {loadingDoctorsCount || loadingDoctors ? (
        <SpinnerCenter></SpinnerCenter>
      ) : doctorPage && doctorPage.content.length > 0 ? (
        <>
          <Table striped responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>{tCommon("personal_data.surname")}</th>
                <th>{tCommon("personal_data.name")}</th>
                <th>{tCommon("personal_data.middle_name")}</th>
                <th>{tCommon("personal_data.birth_date")}</th>
                <th>{tCommon("personal_data.doctor.medical_specialty")}</th>
                <th>{tCommon("office.label")}</th>
                <th>{tCommon("action_label")}</th>
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
                    {doctor.office
                      ? doctor.office.number
                      : tCommon("personal_data.doctor.no_office")}
                  </td>
                  <td>
                    <Link
                      className="btn btn-primary"
                      href={`/doctors/${encodeURIComponent(doctor.id ?? "")}`}
                      role="button"
                    >
                      <i className="bi bi-eye"></i>
                    </Link>
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
              {tDoctorsPage("alerts.no_doctors_found")}
            </Alert>
          ) : (
            <Alert
              variant="secondary"
              className="text-center mx-auto"
              style={{ maxWidth: "400px" }}
            >
              {tDoctorsPage("alerts.no_doctors")}
            </Alert>
          )}
        </>
      )}
    </>
  );
}
