// NewOfficePage.tsx
"use client";
import "@/css/styles.css";
import {
  OfficeRequest,
  initialOfficeRequestState,
} from "@/shared/interface/office/office-interface";
import { OfficeService } from "@/shared/service/office-service";
import { notifyError, notifySuccess } from "@/shared/toast/toast-notifiers";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Breadcrumb } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";

export default function NewOfficePage() {
  const tCommon = useTranslations("Common");
  const tPagesNavigation = useTranslations("PagesNavigation");
  const tNewOfficePage = useTranslations("NewOfficePage");
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
      notifySuccess(tNewOfficePage("toasts.new_office_success"));
    } catch (error) {
      notifyError(tNewOfficePage("toasts.new_office_error"));
    }
  };

  return (
    <>
      <br></br>
      <Breadcrumb>
        <Breadcrumb.Item href="/" className="link">
          {tPagesNavigation("home_page")}
        </Breadcrumb.Item>
        <Breadcrumb.Item href="/offices" className="link">
          {tPagesNavigation("offices")}
        </Breadcrumb.Item>
        <Breadcrumb.Item active>
          {tPagesNavigation("new_office")}
        </Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <Card.Header>{tNewOfficePage("new_office.card.header")}</Card.Header>
        <Card.Body>
          <Form onSubmit={handleNewOfficeFormSubmit}>
            <Form.Group controlId="formGridNumber" className="mb-3">
              <Form.Label>{tCommon("office.number_short")}</Form.Label>
              <Form.Control
                type="number"
                value={office.number.toString()}
                name="number"
                onChange={handleInputOffice}
                required
              />
            </Form.Group>
            <Form.Group controlId="formGridName" className="mb-3">
              <Form.Label>{tCommon("office.name_short")}</Form.Label>
              <Form.Control
                type="text"
                value={office.name}
                name="name"
                onChange={handleInputOffice}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" id="confirmAddNewOffice">
              {tNewOfficePage("new_office.add_button_label")}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}
