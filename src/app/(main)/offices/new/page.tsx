// NewOfficePage.tsx
"use client";
import "@/css/styles.css";
import {
  OfficeRequest,
  initialOfficeRequestState,
} from "@/shared/interface/office/office-interface";
import { OfficeService } from "@/shared/service/office-service";
import { notifyError, notifySuccess } from "@/shared/toast/toast-notifiers";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Breadcrumb } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";

export default function NewOfficePage() {
  const router = useRouter();

  const [office, setOffice] = useState<OfficeRequest>(
    initialOfficeRequestState
  );

  const handleInputOffice = (event: any) => {
    const { name, value } = event.target;
    setOffice((prevParams) => ({
      ...prevParams,
      [name]: value,
    }));
  };

  const handleNewOfficeFormSubmit = async (event: any) => {
    event.preventDefault();
    await addNewOffice();
  };

  const addNewOffice = async () => {
    try {
      const data = await OfficeService.addOffice(office);
      router.push(`/offices/${data.id}`);
      notifySuccess("Новий кабінет був успішно доданий!");
    } catch (error) {
      notifyError(
        "При додаванні нового кабінету сталася непередбачувана помилка!"
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
        <Breadcrumb.Item href="/offices" className="link">
          Кабінети
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Новий кабінет</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <Card.Header>Інформація про новий кабінет</Card.Header>
        <Card.Body>
          <Form onSubmit={handleNewOfficeFormSubmit}>
            <Form.Group controlId="formGridNumber" className="mb-3">
              <Form.Label>Номер</Form.Label>
              <Form.Control
                type="number"
                value={office.number.toString()}
                name="number"
                onChange={handleInputOffice}
                required
              />
            </Form.Group>
            <Form.Group controlId="formGridName" className="mb-3">
              <Form.Label>Назва</Form.Label>
              <Form.Control
                type="text"
                value={office.name}
                name="name"
                onChange={handleInputOffice}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" id="confirmAddNewOffice">
              Додати новий кабінет
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}
