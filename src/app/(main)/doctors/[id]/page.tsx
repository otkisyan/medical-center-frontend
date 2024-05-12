"use client";
import React, { use, useCallback, useEffect, useState } from "react";
import { PatientService } from "@/shared/service/patientService";
import {
  initialPatientResponseState,
  PatientResponse,
} from "@/shared/interface/patient/patientInterface";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import { Alert, Button, Row } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import { notifyError, notifySuccess } from "@/shared/toast/toastsNotifiers";
import Modal from "react-bootstrap/Modal";
import { useRouter } from "next/navigation";
import { Breadcrumb } from "react-bootstrap";
import {
  DoctorRequest,
  DoctorResponse,
  convertDoctorResponseToDoctorRequest,
  initialDoctorRequestState,
  initialDoctorResponseState,
} from "@/shared/interface/doctor/doctorInterface";
import { DoctorService } from "@/shared/service/doctorService";
import Select from "react-select";
import { customReactSelectStyles } from "@/css/select";
import { OfficeService } from "@/shared/service/officeService";
import { OfficeResponse } from "@/shared/interface/office/officeInterface";
import { Page } from "@/shared/interface/page/pageInterface";
import { useMemo } from "react";
import { delay } from "@/shared/utils/delay";

export default function PatientPage({ params }: { params: { id: number } }) {
  const initialOfficesOptions = useMemo(
    () => [{ value: "", label: "Без кабінету" }],
    []
  );

  const router = useRouter();
  const [doctor, setDoctor] = useState<DoctorResponse | null>(null);
  const [officesOptions, setOfficesOptions] = useState<any[]>([]);
  const [editedDoctor, setEditedDoctor] = useState<DoctorRequest>(
    initialDoctorRequestState
  );
  const [loadingDoctor, setLoadingDoctor] = useState(true);
  const [loadingOffices, setLoadingOffices] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const defaultOfficeOption = officesOptions.find(
    (option) => option.value === ""
  );

  const findOfficeOptionByValue = (value: any) =>
    officesOptions.find((option) => option.value === value);

  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  const handleShowDeleteModal = () => setShowDeleteModal(true);

  const handleChangeDoctor = (event: any) => {
    const { name, value } = event.target;
    setEditedDoctor((prevEditedDoctor) => ({
      ...prevEditedDoctor,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancelEdit = () => {
    if (doctor) {
      setEditedDoctor(convertDoctorResponseToDoctorRequest(doctor));
    }
    setEditing(false);
  };

  const handleEditFormSubmit = async (event: any) => {
    event.preventDefault();
    try {
      const data = await DoctorService.updateDoctor(params.id, editedDoctor);
      setDoctor(data);
      setEditedDoctor(convertDoctorResponseToDoctorRequest(data));
      notifySuccess("Редагування інформації про лікаря успішне!");
    } catch (error) {
      if (doctor) {
        setEditedDoctor(convertDoctorResponseToDoctorRequest(doctor));
      }
      notifyError("При редагуванні сталася непередбачена помилка!");
    } finally {
      setEditing(false);
    }
  };

  const deleteDoctor = async () => {
    try {
      const data = await DoctorService.deleteDoctor(params.id);
      router.push("/doctors");
      notifySuccess("Лікар був успішно видалений!");
    } catch (error) {
      notifyError("При видаленні лікаря сталася непередбачена помилка!");
    } finally {
      setShowDeleteModal(false);
    }
  };

  const fetchDoctor = useCallback(async (patientId: number) => {
    try {
      setLoadingDoctor(true);
      const data = await DoctorService.findDoctorById(patientId);
      setDoctor(data);
      setEditedDoctor(convertDoctorResponseToDoctorRequest(data));
    } catch (error) {
    } finally {
      setLoadingDoctor(false);
    }
  }, []);

  const fetchAllOffices = async () => {
    let allOffices: OfficeResponse[] = [];
    let params = {
      page: 0,
    };
    let totalPages = 1;

    try {
      while (params.page < totalPages) {
        const data = await OfficeService.findAllOffices(params);
        allOffices = [...allOffices, ...data.content];
        totalPages = data.totalPages;
        params.page++;
      }
      return allOffices;
    } catch (error) {
      console.error("Error fetching offices:", error);
    }
  };

  const fetchOffices = useCallback(async () => {
    try {
      setLoadingOffices(true);
      const offices = await fetchAllOffices();
      if (offices) {
        setOfficesOptions([
          ...initialOfficesOptions,
          ...offices.map((office) => ({
            value: office.id,
            label: office.number + " - " + office.name,
          })),
        ]);
      }
    } catch (error) {
    } finally {
      setLoadingOffices(false);
    }
  }, [initialOfficesOptions]);

  useEffect(() => {
    const doctorId = params.id;
    fetchDoctor(doctorId);
  }, [fetchDoctor, params.id]);

  useEffect(() => {
    fetchOffices();
  }, [fetchOffices]);

  return (
    <>
      <br></br>
      {loadingDoctor ? (
        <>
          <div className="d-flex justify-content-center">
            <Spinner animation="grow" role="status" variant="secondary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        </>
      ) : doctor ? (
        <>
          <Breadcrumb>
            <Breadcrumb.Item href="/" className="link">
              Домашня сторінка
            </Breadcrumb.Item>
            <Breadcrumb.Item href="/patients" className="link">
              Лікарі
            </Breadcrumb.Item>
            <Breadcrumb.Item active>
              Інформація про лікаря #{params.id}
            </Breadcrumb.Item>
          </Breadcrumb>
          <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
            <Modal.Header closeButton>
              <Modal.Title>Видалення лікаря</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Ви впевнені що хочете видалити лікаря?</p>
              <p>
                <i>
                  Ви не сможете відновити інформацію про лікаря після
                  підтвердження видалення!
                </i>
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseDeleteModal}>
                Скасувати
              </Button>
              <Button variant="danger" onClick={deleteDoctor}>
                Видалити лікаря
              </Button>
            </Modal.Footer>
          </Modal>
          <Form onSubmit={handleEditFormSubmit}>
            <fieldset disabled={!editing}>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridSurname">
                  <Form.Label>Прізвище</Form.Label>
                  <Form.Control
                    type="text"
                    value={editedDoctor.surname ?? ""}
                    name="surname"
                    onChange={handleChangeDoctor}
                  />
                </Form.Group>
                <Form.Group as={Col} controlId="formGridName">
                  <Form.Label>{`Ім'я`}</Form.Label>
                  <Form.Control
                    type="text"
                    value={editedDoctor.name ?? ""}
                    name="name"
                    onChange={handleChangeDoctor}
                  />
                </Form.Group>
                <Form.Group as={Col} controlId="formGridMiddleName">
                  <Form.Label>По батькові</Form.Label>
                  <Form.Control
                    type="text"
                    value={editedDoctor.middleName ?? ""}
                    name="middleName"
                    onChange={handleChangeDoctor}
                  />
                </Form.Group>
              </Row>
              <Form.Group controlId="formGridBirthDate" className="mb-3">
                <Form.Label>Дата народження</Form.Label>
                <Form.Control
                  type="date"
                  value={
                    editedDoctor.birthDate
                      ? editedDoctor.birthDate.toString()
                      : ""
                  }
                  name="birthDate"
                  max="9999-12-31"
                  onChange={handleChangeDoctor}
                />
              </Form.Group>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridPhone">
                  <Form.Label>Номер телефону</Form.Label>
                  <Form.Control
                    type="text"
                    value={editedDoctor.phone ?? ""}
                    onChange={handleChangeDoctor}
                    name="phone"
                  />
                </Form.Group>
                <Form.Group as={Col} controlId="formGridMessengerContact">
                  <Form.Label>Контактний номер Viber/Telegram</Form.Label>
                  <Form.Control
                    type="text"
                    value={editedDoctor.messengerContact ?? ""}
                    name="messengerContact"
                    onChange={handleChangeDoctor}
                  />
                </Form.Group>
              </Row>
              <Form.Group controlId="formGridAddress" className="mb-3">
                <Form.Label>Домашня адреса</Form.Label>
                <Form.Control
                  type="text"
                  value={editedDoctor.address ?? ""}
                  name="address"
                  onChange={handleChangeDoctor}
                />
              </Form.Group>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridMedicalSpecialty">
                  <Form.Label>Медична спеціальність</Form.Label>
                  <Form.Control
                    type="text"
                    value={editedDoctor.medicalSpecialty ?? ""}
                    name="medicalSpecialty"
                    onChange={handleChangeDoctor}
                  />
                </Form.Group>
                <Form.Group as={Col} controlId="formGridQualificationCategory">
                  <Form.Label>Кваліфікаційна категорія</Form.Label>
                  <Form.Control
                    type="text"
                    value={editedDoctor.qualificationCategory ?? ""}
                    name="qualificationCategory"
                    onChange={handleChangeDoctor}
                  />
                </Form.Group>
              </Row>
              <Form.Group as={Col} controlId="formGridOffice">
                <Form.Label>Кабінет</Form.Label>
                <Select
                  className="basic-single mb-3"
                  classNamePrefix="select"
                  isLoading={loadingOffices}
                  isSearchable={true}
                  value={
                    editedDoctor.officeId
                      ? findOfficeOptionByValue(editedDoctor.officeId)
                      : findOfficeOptionByValue("")
                  }
                  isDisabled={!editing}
                  placeholder={
                    loadingOffices ? "Завантаження..." : "Оберіть кабінет"
                  }
                  name="officeId"
                  onChange={(e) => {
                    setEditedDoctor((prevEditedDoctor) => ({
                      ...prevEditedDoctor,
                      officeId: e.value,
                    }));
                  }}
                  loadingMessage={() => "Завантаження..."}
                  noOptionsMessage={() => "Кабінетів не знайдено"}
                  options={officesOptions}
                  styles={customReactSelectStyles}
                  defaultValue={
                    editedDoctor.officeId === null
                      ? defaultOfficeOption
                      : officesOptions.find(
                          (option) => option.value === editedDoctor.officeId
                        )
                  }
                />
              </Form.Group>
            </fieldset>
            <Button
              variant="primary"
              type="button"
              className="me-2"
              hidden={editing}
              onClick={handleEdit}
            >
              <i className="bi bi-pencil-square" id="editButton"></i>
            </Button>
            <Button
              variant="primary"
              type="submit"
              className="me-2"
              hidden={!editing}
              id="confirmEdit"
              onClick={handleEditFormSubmit}
            >
              Зберегти
            </Button>
            <Button
              variant="secondary"
              type="button"
              id="cancelButton"
              hidden={!editing}
              onClick={handleCancelEdit}
            >
              Скасувати
            </Button>
            <Button
              variant="danger"
              type="button"
              hidden={editing}
              id="deleteButton"
              onClick={handleShowDeleteModal}
            >
              <i className="bi bi-trash"></i>
            </Button>
          </Form>
        </>
      ) : (
        <Alert variant="danger">
          <Alert.Heading>Ууупсс...</Alert.Heading>
          <p>
            При виконанні запиту виникла помилка або запитуваного лікаря не
            існує
          </p>
        </Alert>
      )}
    </>
  );
}
