"use client";
import React, { useState, useEffect, use } from "react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { PatientService } from "@/shared/service/patient.service";
import {
  IPatient,
  initialPatientState,
} from "@/shared/interface/patient/patient.interface";
import { IPage } from "@/shared/interface/page/page.interface";
import "@/css/styles.css";
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import Pagination from "react-bootstrap/Pagination";
import { useCallback } from "react";
import { useMemo } from "react";
import Spinner from "react-bootstrap/Spinner";
import { formatDateToString } from "@/shared/utils/formatDateToString";
import ToastContainerInstance from "@/components/toast/ToastContainerInstance";
import { Breadcrumb } from "react-bootstrap";
import { notifyError, notifySuccess } from "@/shared/toast/toastsNotifiers";
import { useRouter } from "next/navigation";

export default function PatientsPage() {
  const router = useRouter();

  const [patient, setPatient] = useState<IPatient>(initialPatientState);

  const handleInputPatient = (event: any) => {
    const { name, value } = event.target;
    setPatient((prevParams) => ({
      ...prevParams,
      [name]: value,
    }));
  };

  const handleNewPatientFormSubmit = async (event: any) => {
    event.preventDefault();
    await addNewPatient();
  };

  const addNewPatient = async () => {
    try {
      const data = await PatientService.addPatient(patient);
      router.push(`/patients/${data.id}`);
      notifySuccess("Новий пацієнт був успішно доданий!");
    } catch (error) {
      notifyError(
        "При додаванні нового пацієнта сталася непередбачувана помилка!"
      );
    }
  };

  return (
    <>
      <br></br>
      <Breadcrumb>
        <Breadcrumb.Item href="/" className="link">
          Домашня сторінка
        </Breadcrumb.Item>
        <Breadcrumb.Item href="/patients" className="link">
          Пацієнти
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Новий пацієнт</Breadcrumb.Item>
      </Breadcrumb>
      <Form onSubmit={handleNewPatientFormSubmit}>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridSurname">
            <Form.Label>Прізвище</Form.Label>
            <Form.Control
              type="text"
              value={patient.surname ?? ""}
              name="surname"
              onChange={handleInputPatient}
              required
            />
          </Form.Group>
          <Form.Group as={Col} controlId="formGridName">
            <Form.Label>{`Ім'я`}</Form.Label>
            <Form.Control
              type="text"
              value={patient.name ?? ""}
              name="name"
              onChange={handleInputPatient}
              required
            />
          </Form.Group>
          <Form.Group as={Col} controlId="formGridMiddleName">
            <Form.Label>По батькові</Form.Label>
            <Form.Control
              type="text"
              value={patient.middleName ?? ""}
              name="middleName"
              onChange={handleInputPatient}
              required
            />
          </Form.Group>
        </Row>
        <Form.Group controlId="formGridBirthDate" className="mb-3">
          <Form.Label>Дата народження</Form.Label>
          <Form.Control
            type="date"
            value={patient.birthDate ? patient.birthDate.toString() : ""}
            name="birthDate"
            max="9999-12-31"
            onChange={handleInputPatient}
            required
          />
        </Form.Group>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridPhone">
            <Form.Label>Номер телефону</Form.Label>
            <Form.Control
              type="text"
              value={patient.phone ?? ""}
              onChange={handleInputPatient}
              name="phone"
              required
            />
          </Form.Group>
          <Form.Group as={Col} controlId="formGridMessengerContact">
            <Form.Label>Контактний номер Viber/Telegram</Form.Label>
            <Form.Control
              type="text"
              value={patient.messengerContact ?? ""}
              name="messengerContact"
              onChange={handleInputPatient}
            />
          </Form.Group>
        </Row>
        <Form.Group controlId="formGridAddress" className="mb-3">
          <Form.Label>Домашня адреса</Form.Label>
          <Form.Control
            type="text"
            value={patient.address ?? ""}
            name="address"
            onChange={handleInputPatient}
          />
        </Form.Group>
        <Form.Group controlId="formGridPreferentialCategory" className="mb-3">
          <Form.Label>Пільгова категорія</Form.Label>
          <Form.Control
            type="text"
            value={patient.preferentialCategory ?? ""}
            name="preferentialCategory"
            onChange={handleInputPatient}
          />
        </Form.Group>
        <Button variant="primary" type="submit" id="confirmAddNewPatient">
          Додати нового пацієнта
        </Button>
      </Form>
    </>
  );
}
