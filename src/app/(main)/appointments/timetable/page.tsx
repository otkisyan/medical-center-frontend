"use client";
import Select from "react-select";
import { useRouter, useSearchParams } from "next/navigation";
import { Col, Form, Row, Table } from "react-bootstrap";
import { customReactSelectStyles } from "@/css/react-select";
import useFetchDoctorsOptions from "@/shared/hooks/doctor/useFetchDoctorsOptions";
import { useState } from "react";

export default function TimeTablePage() {
  const router = useRouter;
  const searchParams = useSearchParams();

  const [doctorId, setDoctorId] = useState<number | null>(null);
  const { loadingDoctorsOptions, doctorsOptions } = useFetchDoctorsOptions();

  return (
    <>
      <br></br>
      <Row>
        <Col>
          <Form.Label>Лікар</Form.Label>
          <Select
            className="basic-single mb-3"
            classNamePrefix="select"
            isLoading={loadingDoctorsOptions}
            isSearchable={true}
            placeholder={"Оберіть лікаря"}
            name="officeId"
            onChange={(e) => {
              setDoctorId(e.value);
            }}
            loadingMessage={() => "Завантаження..."}
            noOptionsMessage={() => "Кабінетів не знайдено"}
            options={doctorsOptions}
            styles={customReactSelectStyles}
          />
        </Col>
        <Col>
          <Form.Control placeholder="Last name" />
        </Col>
      </Row>
      <Table striped responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
          </tr>
          <tr>
            <td>3</td>
            <td colSpan={2}>Larry the Bird</td>
            <td>@twitter</td>
          </tr>
        </tbody>
      </Table>
    </>
  );
}
