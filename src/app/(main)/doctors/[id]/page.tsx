"use client";
import SpinnerCenter from "@/components/loading/spinner/SpinnerCenter";
import { customReactSelectStyles } from "@/css/react-select";
import { dayOfWeekMap } from "@/i18n/day-of-week-map";
import { useAuth } from "@/shared/context/UserContextProvider";
import { Role } from "@/shared/enum/role";
import useFetchAllDoctorWorkSchedules from "@/shared/hooks/doctor/useFetchAllDoctorWorkSchedules";
import useFetchDoctor from "@/shared/hooks/doctor/useFetchDoctor";
import useFetchOfficesOptions from "@/shared/hooks/office/useFetchOfficesOptions";
import {
  DoctorRequest,
  convertDoctorResponseToDoctorRequest,
  initialDoctorRequestState,
} from "@/shared/interface/doctor/doctor-interface";
import {
  WorkScheduleRequest,
  WorkScheduleResponse,
  convertWorkScheduleResponseToWorkScheduleRequest,
} from "@/shared/interface/work-schedule/work-schedule-interface";
import { DoctorService } from "@/shared/service/doctor-service";
import { WorkScheduleService } from "@/shared/service/work-schedule-service";
import { notifyError, notifySuccess } from "@/shared/toast/toast-notifiers";
import {
  formatTimeSecondsToTime,
  timeStartBiggerThanEnd,
} from "@/shared/utils/date-utils";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Alert,
  Breadcrumb,
  Button,
  Card,
  Nav,
  Row,
  Table,
} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Select from "react-select";

export default function DoctorPage({ params }: { params: { id: number } }) {
  const tCommon = useTranslations("Common");
  const tPagesNavigation = useTranslations("PagesNavigation");
  const tSpecificDoctorPage = useTranslations("SpecificDoctorPage");
  const tWorkSchedule = useTranslations("WorkSchedule");
  const router = useRouter();
  const { hasAnyRole, userDetails } = useAuth();
  enum Tab {
    Doctor,
    Work_Schedules,
  }
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Doctor);
  const { doctor, loadingDoctor, setDoctor } = useFetchDoctor(params.id);
  const {
    loadingOfficesOptions,
    officesOptions,
    defaultOfficeOption,
    findOfficeOptionByValue,
  } = useFetchOfficesOptions();

  const {
    doctorWorkSchedules,
    loadingDoctorWorkSchedules,
    setDoctorWorkSchedules,
  } = useFetchAllDoctorWorkSchedules(params.id);

  const [editedDoctor, setEditedDoctor] = useState<DoctorRequest>(
    initialDoctorRequestState
  );
  const [editedDoctorWorkSchedules, setEditedDoctorWorkSchedules] = useState<
    WorkScheduleRequest[]
  >([]);
  const [workSchedulesValidated, setWorkSchedulesValidated] = useState(true);
  const [showWorkScheduleValidationError, setShowWorkScheduleValidationError] =
    useState(false);

  const [editingDoctor, setEditingDoctor] = useState(false);
  const [editingWorkSchedules, setEditingWorkSchedules] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

    if (
      field === "workTimeStart" &&
      !timeStartBiggerThanEnd(newValue, endTime)
    ) {
      setWorkSchedulesValidated(false);
    } else if (
      field === "workTimeEnd" &&
      !timeStartBiggerThanEnd(startTime, newValue)
    ) {
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
      notifySuccess(tSpecificDoctorPage("toasts.doctor.edit_success"));
    } catch (error) {
      if (doctor) {
        setEditedDoctor(convertDoctorResponseToDoctorRequest(doctor));
      }
      notifyError(tSpecificDoctorPage("toasts.doctor.edit_error"));
    } finally {
      setEditingDoctor(false);
    }
  };

  const deleteDoctor = async () => {
    try {
      const data = await DoctorService.deleteDoctor(params.id);
      router.push("/doctors");
      notifySuccess(tSpecificDoctorPage("toasts.doctor.delete_success"));
    } catch (error) {
      notifyError(tSpecificDoctorPage("toasts.doctor.delete_error"));
    } finally {
      setShowDeleteModal(false);
    }
  };

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
        console.log(updatedWorkSchedules);
        setDoctorWorkSchedules(updatedWorkSchedules);
        notifySuccess(tSpecificDoctorPage("toasts.work_schedule.edit_success"));
      } catch (error) {
        notifyError(tSpecificDoctorPage("toasts.work_schedule.edit_error"));
      } finally {
        setShowWorkScheduleValidationError(false);
        setEditingWorkSchedules(false);
      }
    }
  };

  useEffect(() => {
    if (doctor != null) {
      setEditedDoctor(convertDoctorResponseToDoctorRequest(doctor));
    }
  }, [doctor]);

  useEffect(() => {
    if (doctorWorkSchedules != null) {
      const editedSchedules = doctorWorkSchedules.map(
        (schedule: WorkScheduleResponse) =>
          convertWorkScheduleResponseToWorkScheduleRequest(schedule)
      );
      setEditedDoctorWorkSchedules(editedSchedules);
    }
  }, [doctorWorkSchedules]);

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
            <Link href="/" passHref legacyBehavior>
              <Breadcrumb.Item className="link">
                {tPagesNavigation("home_page")}
              </Breadcrumb.Item>
            </Link>
            <Link href="/doctors" passHref legacyBehavior>
              <Breadcrumb.Item className="link">
                {tPagesNavigation("doctors")}
              </Breadcrumb.Item>
            </Link>
            <Breadcrumb.Item active>
              {tSpecificDoctorPage("breadcrumb_active_page", {
                id: params.id,
              })}
            </Breadcrumb.Item>
          </Breadcrumb>
          <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
            <Modal.Header closeButton>
              <Modal.Title>
                {tSpecificDoctorPage("doctor_delete_dialog.title")}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>{tSpecificDoctorPage("doctor_delete_dialog.text")}</p>
              <p>
                <i>{tSpecificDoctorPage("doctor_delete_dialog.warning")}</i>
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseDeleteModal}>
                {tCommon("action_cancel_button_label")}
              </Button>
              <Button variant="danger" onClick={deleteDoctor}>
                {tSpecificDoctorPage(
                  "doctor_delete_dialog.confirm_button_label"
                )}
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
                    {tSpecificDoctorPage("doctor_card.doctor_tab_header")}
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    href="#work-schedules"
                    onClick={() => handleTabClick(Tab.Work_Schedules)}
                  >
                    {tSpecificDoctorPage("doctor_card.workschedule_tab_header")}
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
                        <Form.Label>
                          {tCommon("personal_data.surname")}
                        </Form.Label>
                        <Form.Control
                          type="text"
                          required
                          value={editedDoctor.surname ?? ""}
                          name="surname"
                          onChange={handleChangeDoctor}
                        />
                      </Form.Group>
                      <Form.Group as={Col} controlId="formGridName">
                        <Form.Label>{tCommon("personal_data.name")}</Form.Label>
                        <Form.Control
                          type="text"
                          required
                          value={editedDoctor.name ?? ""}
                          name="name"
                          onChange={handleChangeDoctor}
                        />
                      </Form.Group>
                      <Form.Group as={Col} controlId="formGridMiddleName">
                        <Form.Label>
                          {tCommon("personal_data.middle_name")}
                        </Form.Label>
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
                      <Form.Label>
                        {tCommon("personal_data.birth_date")}
                      </Form.Label>
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
                        <Form.Label>
                          {tCommon("personal_data.phone")}
                        </Form.Label>
                        <Form.Control
                          required
                          type="text"
                          value={editedDoctor.phone ?? ""}
                          onChange={handleChangeDoctor}
                          name="phone"
                        />
                      </Form.Group>
                      <Form.Group as={Col} controlId="formGridMessengerContact">
                        <Form.Label>
                          {tCommon("personal_data.messenger_contact")}
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={editedDoctor.messengerContact ?? ""}
                          name="messengerContact"
                          onChange={handleChangeDoctor}
                        />
                      </Form.Group>
                    </Row>
                    <Form.Group controlId="formGridAddress" className="mb-3">
                      <Form.Label>
                        {tCommon("personal_data.address")}
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={editedDoctor.address ?? ""}
                        name="address"
                        onChange={handleChangeDoctor}
                      />
                    </Form.Group>
                    <Row className="mb-3">
                      <Form.Group as={Col} controlId="formGridMedicalSpecialty">
                        <Form.Label>
                          {tCommon("personal_data.doctor.medical_specialty")}
                        </Form.Label>
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
                        <Form.Label>
                          {tCommon(
                            "personal_data.doctor.qualification_category"
                          )}
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={editedDoctor.qualificationCategory ?? ""}
                          name="qualificationCategory"
                          onChange={handleChangeDoctor}
                        />
                      </Form.Group>
                    </Row>
                    <Form.Group as={Col} controlId="formGridOffice">
                      <Form.Label>{tCommon("office")}</Form.Label>
                      <Select
                        className="basic-single mb-3"
                        classNamePrefix="select"
                        isLoading={loadingOfficesOptions}
                        isSearchable={true}
                        value={
                          editedDoctor.officeId
                            ? findOfficeOptionByValue(editedDoctor.officeId)
                            : findOfficeOptionByValue("")
                        }
                        isDisabled={!editingDoctor}
                        placeholder={
                          loadingOfficesOptions
                            ? tCommon("loading")
                            : tCommon("office_select.placeholder_label")
                        }
                        name="officeId"
                        onChange={(e) => {
                          setEditedDoctor((prevEditedDoctor) => ({
                            ...prevEditedDoctor,
                            officeId: e.value,
                          }));
                        }}
                        loadingMessage={() => tCommon("loading")}
                        noOptionsMessage={() =>
                          tCommon("office_select.no_options_message")
                        }
                        options={officesOptions}
                        styles={customReactSelectStyles}
                      />
                    </Form.Group>
                  </fieldset>
                  {hasAnyRole([Role.ADMIN]) && (
                    <>
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
                        {tCommon("action_save_button_label")}
                      </Button>
                      <Button
                        variant="secondary"
                        type="button"
                        id="cancelButton"
                        hidden={!editingDoctor}
                        onClick={handleCancelEditDoctor}
                      >
                        {tCommon("action_cancel_button_label")}
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
                    </>
                  )}
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
                          <Alert.Heading>
                            {tWorkSchedule(
                              "alerts.time_validation_error.heading"
                            )}
                          </Alert.Heading>
                          <p>
                            {tWorkSchedule("alerts.time_validation_error.text")}
                            <br></br>
                            {tWorkSchedule("alerts.time_validation_error.tip")}
                          </p>
                        </Alert>
                      )}
                      <Table responsive>
                        <thead>
                          <tr>
                            <th>{tWorkSchedule("weekday")}</th>
                            <th>{tWorkSchedule("worktime_start")}</th>
                            <th>{tWorkSchedule("worktime_end")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {editedDoctorWorkSchedules !== null &&
                            editedDoctorWorkSchedules.map((workSchedule, i) => (
                              <tr key={i}>
                                <td>
                                  {tWorkSchedule(
                                    dayOfWeekMap[
                                      doctorWorkSchedules[i]
                                        .dayOfWeekResponseDto.name
                                    ]
                                  )}
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
                        {tCommon("action_save_button_label")}
                      </Button>
                      <Button
                        variant="secondary"
                        type="button"
                        id="cancelButton"
                        hidden={!editingWorkSchedules}
                        onClick={handleCancelEditWorkSchedules}
                      >
                        {tCommon("action_cancel_button_label")}
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
          <Alert.Heading>
            {tSpecificDoctorPage("error_alert.header")}
          </Alert.Heading>
          <p>{tSpecificDoctorPage("error_alert.text")}</p>
        </Alert>
      )}
    </>
  );
}
