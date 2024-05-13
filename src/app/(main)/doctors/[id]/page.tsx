"use client";
import React, { useCallback, useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import { Alert, Button, Card, Nav, Row, Table } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import { notifyError, notifySuccess } from "@/shared/toast/toast-notifiers";
import Modal from "react-bootstrap/Modal";
import { useRouter } from "next/navigation";
import { Breadcrumb } from "react-bootstrap";
import {
  DoctorRequest,
  DoctorResponse,
  convertDoctorResponseToDoctorRequest,
  initialDoctorRequestState,
} from "@/shared/interface/doctor/doctor-interface";
import { DoctorService } from "@/shared/service/doctor-service";
import Select from "react-select";
import { customReactSelectStyles } from "@/css/react-select";
import { OfficeService } from "@/shared/service/office-service";
import { OfficeResponse } from "@/shared/interface/office/office-interface";
import { useMemo } from "react";
import {
  WorkScheduleRequest,
  WorkScheduleResponse,
  convertWorkScheduleResponseToWorkScheduleRequest,
} from "@/shared/interface/work-schedule/work-schedule-interface";
import { formatTimeSecondsToTime } from "@/shared/utils/date-utils";
import SpinnerCenter from "@/components/spinner/SpinnerCenter";
import { WorkScheduleService } from "@/shared/service/work-schedule-service";

export default function DoctorPage({ params }: { params: { id: number } }) {
  const initialOfficesOptions = useMemo(
    () => [{ value: "", label: "Без кабінету" }],
    []
  );

  enum Tab {
    Doctor,
    Work_Schedules,
  }

  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Doctor);
  const [doctor, setDoctor] = useState<DoctorResponse | null>(null);
  const [editedDoctor, setEditedDoctor] = useState<DoctorRequest>(
    initialDoctorRequestState
  );
  const [doctorWorkSchedules, setDoctorWorkSchedules] = useState<
    WorkScheduleResponse[]
  >([]);
  const [editedDoctorWorkSchedules, setEditedDoctorWorkSchedules] = useState<
    WorkScheduleRequest[]
  >([]);
  const [workSchedulesValidated, setWorkSchedulesValidated] = useState(true);
  const [showWorkScheduleValidationError, setShowWorkScheduleValidationError] =
    useState(false);
  const [officesOptions, setOfficesOptions] = useState<any[]>([]);

  const [loadingDoctor, setLoadingDoctor] = useState(true);
  const [loadingOffices, setLoadingOffices] = useState(true);
  const [loadingDoctorWorkSchedules, setLoadingDoctorWorkSchedules] =
    useState(true);
  const [editingDoctor, setEditingDoctor] = useState(false);
  const [editingWorkSchedules, setEditingWorkSchedules] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const defaultOfficeOption = officesOptions.find(
    (option) => option.value === ""
  );

  const findOfficeOptionByValue = (value: any) =>
    officesOptions.find((option) => option.value === value);

  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  const handleShowDeleteModal = () => setShowDeleteModal(true);

  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab);
  };

  const handleChangeDoctor = (event: any) => {
    const { name, value } = event.target;
    setEditedDoctor((prevEditedDoctor) => ({
      ...prevEditedDoctor,
      [name]: value,
    }));
  };

  type WorkScheduleField = "workTimeStart" | "workTimeEnd";
  const handleWorkScheduleChange = (
    index: number,
    field: WorkScheduleField,
    newValue: any
  ) => {
    setEditedDoctorWorkSchedules((prevEditedSchedules) => {
      const updatedSchedules = [...prevEditedSchedules];
      const updatedSchedule = { ...updatedSchedules[index] };
      updatedSchedule[field] = newValue;
      updatedSchedules[index] = updatedSchedule;
      return updatedSchedules;
    });
    const endTime = editedDoctorWorkSchedules[index].workTimeEnd;
    const startTime = editedDoctorWorkSchedules[index].workTimeStart;

    if (field === "workTimeStart" && newValue >= endTime) {
      setWorkSchedulesValidated(false);
    } else if (field === "workTimeEnd" && startTime >= newValue) {
      setWorkSchedulesValidated(false);
    } else {
      setWorkSchedulesValidated(true);
    }
  };

  const handleEditDoctor = () => {
    setEditingDoctor(true);
  };

  const handleCancelEditDoctor = () => {
    if (doctor) {
      setEditedDoctor(convertDoctorResponseToDoctorRequest(doctor));
    }
    setEditingDoctor(false);
  };

  const handleEditWorkSchedules = () => {
    setEditingWorkSchedules(true);
  };

  const handleCancelEditWorkSchedules = () => {
    setEditedDoctorWorkSchedules(doctorWorkSchedules);
    setEditingWorkSchedules(false);
    setShowWorkScheduleValidationError(false);
    setWorkSchedulesValidated(true);
  };

  const handleEditDoctorFormSubmit = async (event: any) => {
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
      setEditingDoctor(false);
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

  const fetchAllDoctorWorkSchedules = useCallback(async () => {
    let allWorkSchedules: WorkScheduleResponse[] = [];
    let requestParams = {
      page: 0,
    };
    let totalPages = 1;
    try {
      while (requestParams.page < totalPages) {
        const data = await DoctorService.findDoctorsWorkSchedules(
          requestParams,
          params.id
        );
        allWorkSchedules = [...allWorkSchedules, ...data.content];
        totalPages = data.totalPages;
        requestParams.page++;
      }
      return allWorkSchedules;
    } catch (error) {
      console.error("Error fetching work schedules:", error);
    }
  }, [params.id]);

  const fetchDoctorWorkSchedules = useCallback(async () => {
    try {
      setLoadingDoctorWorkSchedules(true);
      const workSchedules = await fetchAllDoctorWorkSchedules();
      if (workSchedules) {
        setDoctorWorkSchedules(workSchedules);
        const editedSchedules = workSchedules.map(
          (schedule: WorkScheduleResponse) =>
            convertWorkScheduleResponseToWorkScheduleRequest(schedule)
        );
        setEditedDoctorWorkSchedules(editedSchedules);
      }
    } catch (error) {
    } finally {
      setLoadingDoctorWorkSchedules(false);
    }
  }, [fetchAllDoctorWorkSchedules]);

  const updateAllWorkSchedules = async (
    editedWorkSchedules: WorkScheduleRequest[]
  ) => {
    const updatedWorkSchedules: WorkScheduleResponse[] = [];
    for (const editedWorkSchedule of editedWorkSchedules) {
      try {
        const id = editedWorkSchedule.id;
        const updatedWorkSchedule =
          await WorkScheduleService.updateWorkSchedule(id, editedWorkSchedule);
        updatedWorkSchedules.push(updatedWorkSchedule);
      } catch (error) {}
    }

    return updatedWorkSchedules;
  };

  const handleEditWorkSchedulesFormSubmit = async (event: any) => {
    event.preventDefault();
    if (!workSchedulesValidated) {
      setShowWorkScheduleValidationError(true);
      event.stopPropagation();
    } else {
      try {
        const updatedWorkSchedules = await updateAllWorkSchedules(
          editedDoctorWorkSchedules
        );
        setDoctorWorkSchedules(updatedWorkSchedules);
        notifySuccess("Графік роботи лікаря успішно оновлений");
      } catch (error) {
        notifyError(
          "При редагуванні графіку роботи лікаря сталася непердбачена помилка"
        );
      } finally {
        setShowWorkScheduleValidationError(false);
        setEditingWorkSchedules(false);
      }
    }
  };

  useEffect(() => {
    const doctorId = params.id;
    fetchDoctor(doctorId);
  }, [fetchDoctor, params.id]);

  useEffect(() => {
    fetchOffices();
  }, [fetchOffices]);

  useEffect(() => {
    fetchDoctorWorkSchedules();
  }, [fetchDoctorWorkSchedules]);

  const validateTime = (start: any, end: any) => {
    if (start && end) {
      const startTime = new Date(`1970-01-01T${start}`);
      const endTime = new Date(`1970-01-01T${end}`);
      if (startTime >= endTime) {
        return "Час початку роботи не може бути більше часу закінечення роботи";
      }
    }
    return "";
  };

  return (
    <>
      <br></br>
      {loadingDoctor ? (
        <>
          <SpinnerCenter></SpinnerCenter>
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
          <Card>
            <Card.Header>
              <Nav variant="tabs" defaultActiveKey="#doctor">
                <Nav.Item>
                  <Nav.Link
                    href="#doctor"
                    onClick={() => handleTabClick(Tab.Doctor)}
                  >
                    Лікар
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    href="#work-schedules"
                    onClick={() => handleTabClick(Tab.Work_Schedules)}
                  >
                    Графік роботи лікаря
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Header>
            <Card.Body>
              {activeTab === Tab.Doctor && (
                <Form onSubmit={handleEditDoctorFormSubmit}>
                  <fieldset disabled={!editingDoctor}>
                    <Row className="mb-3">
                      <Form.Group as={Col} controlId="formGridSurname">
                        <Form.Label>Прізвище</Form.Label>
                        <Form.Control
                          type="text"
                          required
                          value={editedDoctor.surname ?? ""}
                          name="surname"
                          onChange={handleChangeDoctor}
                        />
                      </Form.Group>
                      <Form.Group as={Col} controlId="formGridName">
                        <Form.Label>{`Ім'я`}</Form.Label>
                        <Form.Control
                          type="text"
                          required
                          value={editedDoctor.name ?? ""}
                          name="name"
                          onChange={handleChangeDoctor}
                        />
                      </Form.Group>
                      <Form.Group as={Col} controlId="formGridMiddleName">
                        <Form.Label>По батькові</Form.Label>
                        <Form.Control
                          type="text"
                          required
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
                        required
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
                          required
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
                          required
                          type="text"
                          value={editedDoctor.medicalSpecialty ?? ""}
                          name="medicalSpecialty"
                          onChange={handleChangeDoctor}
                        />
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        controlId="formGridQualificationCategory"
                      >
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
                        isDisabled={!editingDoctor}
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
                                (option) =>
                                  option.value === editedDoctor.officeId
                              )
                        }
                      />
                    </Form.Group>
                  </fieldset>
                  <Button
                    variant="primary"
                    type="button"
                    className="me-2"
                    hidden={editingDoctor}
                    onClick={handleEditDoctor}
                  >
                    <i className="bi bi-pencil-square" id="editButton"></i>
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    className="me-2"
                    hidden={!editingDoctor}
                    id="confirmEdit"
                  >
                    Зберегти
                  </Button>
                  <Button
                    variant="secondary"
                    type="button"
                    id="cancelButton"
                    hidden={!editingDoctor}
                    onClick={handleCancelEditDoctor}
                  >
                    Скасувати
                  </Button>
                  <Button
                    variant="danger"
                    type="button"
                    hidden={editingDoctor}
                    id="deleteButton"
                    onClick={handleShowDeleteModal}
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                </Form>
              )}
              {activeTab === Tab.Work_Schedules && (
                <>
                  {loadingDoctorWorkSchedules ? (
                    <SpinnerCenter></SpinnerCenter>
                  ) : (
                    <Form onSubmit={handleEditWorkSchedulesFormSubmit}>
                      {showWorkScheduleValidationError && (
                        <Alert variant="danger">
                          <Alert.Heading>Помилка!</Alert.Heading>
                          <p>
                            Час початку роботи, не може бути пізніше часу
                            закінчення роботи.
                            <br></br>
                            Будь ласка, перегляньте уважно графік роботи.
                          </p>
                        </Alert>
                      )}
                      <Table responsive>
                        <thead>
                          <tr>
                            <th>День тижня</th>
                            <th>Час початку роботи</th>
                            <th>Час закінчення роботи</th>
                          </tr>
                        </thead>
                        <tbody>
                          {editedDoctorWorkSchedules !== null &&
                            editedDoctorWorkSchedules.map((workSchedule, i) => (
                              <tr key={i}>
                                <td>
                                  {
                                    doctorWorkSchedules[i].dayOfWeekResponseDto
                                      .name
                                  }
                                </td>
                                <td>
                                  <Form.Group controlId={`workTimeStart${i}`}>
                                    <Form.Control
                                      disabled={!editingWorkSchedules}
                                      type="time"
                                      value={
                                        workSchedule.workTimeStart
                                          ? formatTimeSecondsToTime(
                                              workSchedule.workTimeStart
                                            )
                                          : ""
                                      }
                                      onChange={(e) => {
                                        handleWorkScheduleChange(
                                          i,
                                          "workTimeStart",
                                          e.target.value
                                        );
                                      }}
                                    />
                                  </Form.Group>
                                  <br></br>
                                </td>
                                <td>
                                  <Form.Group controlId={`workTimeEnd${i}`}>
                                    <Form.Control
                                      disabled={!editingWorkSchedules}
                                      type="time"
                                      value={
                                        workSchedule.workTimeEnd
                                          ? formatTimeSecondsToTime(
                                              workSchedule.workTimeEnd
                                            )
                                          : ""
                                      }
                                      onChange={(e) => {
                                        handleWorkScheduleChange(
                                          i,
                                          "workTimeEnd",
                                          e.target.value
                                        );
                                      }}
                                    />
                                  </Form.Group>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </Table>
                      <Button
                        variant="primary"
                        type="button"
                        className="me-2"
                        hidden={editingWorkSchedules}
                        onClick={handleEditWorkSchedules}
                      >
                        <i className="bi bi-pencil-square" id="editButton"></i>
                      </Button>
                      <Button
                        variant="primary"
                        type="submit"
                        className="me-2"
                        hidden={!editingWorkSchedules}
                        id="confirmEdit"
                      >
                        Зберегти
                      </Button>
                      <Button
                        variant="secondary"
                        type="button"
                        id="cancelButton"
                        hidden={!editingWorkSchedules}
                        onClick={handleCancelEditWorkSchedules}
                      >
                        Скасувати
                      </Button>
                    </Form>
                  )}
                </>
              )}
            </Card.Body>
          </Card>
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
