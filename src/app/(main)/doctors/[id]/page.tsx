"use client";
import DoctorCard from "@/components/doctor/DoctorCard";
import DoctorUpdateForm from "@/components/doctor/DoctorUpdateForm";
import SpinnerCenter from "@/components/loading/spinner/SpinnerCenter";
import { WorkScheduleField } from "@/components/workschedule/WorkScheduleField";
import WorkScheduleUpdateForm from "@/components/workschedule/WorkScheduleUpdateForm";
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
import { timeStartBiggerThanEnd } from "@/shared/utils/date-utils";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Alert, Breadcrumb, Button, Card, Nav } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";

export default function DoctorPage({ params }: { params: { id: number } }) {
  const tCommon = useTranslations("Common");
  const tPagesNavigation = useTranslations("PagesNavigation");
  const tSpecificDoctorPage = useTranslations("SpecificDoctorPage");
  const router = useRouter();
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

  const handleChangeDoctor = (event: any) => {
    const { name, value } = event.target;
    setEditedDoctor((prevEditedDoctor) => ({
      ...prevEditedDoctor,
      [name]: value,
    }));
  };

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
      } catch (error) {
        throw error;
      }
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
          <DoctorCard
            loadingDoctorWorkSchedules={loadingDoctorWorkSchedules}
            doctorForm={
              <DoctorUpdateForm
                editedDoctor={editedDoctor}
                handleChangeDoctor={handleChangeDoctor}
                handleEditDoctorFormSubmit={handleEditDoctorFormSubmit}
                handleEditDoctor={handleEditDoctor}
                handleCancelEditDoctor={handleCancelEditDoctor}
                handleShowDeleteModal={handleShowDeleteModal}
                loadingOfficesOptions={loadingOfficesOptions}
                editingDoctor={editingDoctor}
                officesOptions={officesOptions}
                findOfficeOptionByValue={findOfficeOptionByValue}
                handleChangeDoctorOffice={(e) => {
                  setEditedDoctor((prevEditedDoctor) => ({
                    ...prevEditedDoctor,
                    officeId: e.value,
                  }));
                }}
              />
            }
            workScheduleForm={
              <WorkScheduleUpdateForm
                showWorkScheduleValidationError={
                  showWorkScheduleValidationError
                }
                editedDoctorWorkSchedules={editedDoctorWorkSchedules}
                handleWorkScheduleChange={handleWorkScheduleChange}
                doctorWorkSchedules={doctorWorkSchedules}
                editingWorkSchedules={editingWorkSchedules}
                handleEditWorkSchedules={handleEditWorkSchedules}
                handleEditWorkSchedulesFormSubmit={
                  handleEditWorkSchedulesFormSubmit
                }
                handleCancelEditWorkSchedules={handleCancelEditWorkSchedules}
              />
            }
          ></DoctorCard>
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
