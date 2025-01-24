"use client";
import DoctorCard from "@/components/doctor/DoctorCard";
import DoctorReadonlyForm from "@/components/doctor/DoctorReadonlyForm";
import SpinnerCenter from "@/components/loading/spinner/SpinnerCenter";
import LocaleSwitcher from "@/components/locale/LocaleSwitcher";
import ReceptionistCard from "@/components/receptionist/ReceptionistCard";
import ReceptionistReadonlyForm from "@/components/receptionist/ReceptionistReadonlyForm";
import ChangePasswordModal from "@/components/user/ChangePasswordModal";
import WorkScheduleReadonlyForm from "@/components/workschedule/WorkScheduleReadonlyForm";
import { useAuth } from "@/shared/context/UserContextProvider";
import { Role } from "@/shared/enum/role";
import useFetchAllDoctorWorkSchedules from "@/shared/hooks/doctor/useFetchAllDoctorWorkSchedules";
import useFetchDoctor from "@/shared/hooks/doctor/useFetchDoctor";
import useFetchOfficesOptions from "@/shared/hooks/office/useFetchOfficesOptions";
import useFetchReceptionist from "@/shared/hooks/receptionist/useFetchReceptionist";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";

export default function UserPage() {
  const tUser = useTranslations("User");
  const tUserPage = useTranslations("UserPage");
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const { hasAnyRole, userDetails } = useAuth();
  const [role, setRole] = useState("");
  const [loadingUserInfo, setLoadingUserInfo] = useState(true);
  const { doctor, fetchDoctor, loadingDoctor } = useFetchDoctor(null);
  const { receptionist, fetchReceptionist, loadingReceptionist } =
    useFetchReceptionist(null);
  const { loadingOfficesOptions, officesOptions, findOfficeOptionByValue } =
    useFetchOfficesOptions(hasAnyRole([Role.Doctor]));

  const {
    doctorWorkSchedules,
    loadingDoctorWorkSchedules,
    fetchDoctorWorkSchedules,
  } = useFetchAllDoctorWorkSchedules(null);

  const handleShowChangePasswordModal = () => setShowChangePasswordModal(true);
  const handleCloseChangePasswordModal = () => {
    setShowChangePasswordModal(false);
  };

  useEffect(() => {
    if (hasAnyRole([Role.Doctor])) {
      setRole(tUser("roles.doctor"));
      if (userDetails) {
        fetchDoctor(userDetails.id);
        fetchDoctorWorkSchedules(userDetails.id);
      }
    } else if (hasAnyRole([Role.RECEPTIONIST])) {
      setRole(tUser("roles.receptionist"));
      if (userDetails) {
        fetchReceptionist(userDetails.id);
      }
    } else if (hasAnyRole([Role.ADMIN])) {
      setRole(tUser("roles.admin"));
    }
  }, [
    hasAnyRole,
    tUser,
    fetchDoctor,
    fetchReceptionist,
    userDetails,
    fetchDoctorWorkSchedules,
    loadingUserInfo,
    setLoadingUserInfo,
  ]);

  return (
    <>
      <br></br>
      {loadingDoctor || loadingReceptionist ? (
        <>
          <SpinnerCenter></SpinnerCenter>
          <br></br>
        </>
      ) : doctor ? (
        <div className="mb-3">
          <DoctorCard
            loadingDoctorWorkSchedules={loadingDoctorWorkSchedules}
            doctorForm={
              <DoctorReadonlyForm
                doctor={doctor}
                officesOptions={officesOptions}
                findOfficeOptionByValue={findOfficeOptionByValue}
                loadingOfficesOptions={loadingOfficesOptions}
              />
            }
            workScheduleForm={
              <WorkScheduleReadonlyForm
                doctorWorkSchedules={doctorWorkSchedules}
              />
            }
          ></DoctorCard>
        </div>
      ) : receptionist ? (
        <>
          <div className="mb-3">
            <ReceptionistCard
              receptionistForm={
                <ReceptionistReadonlyForm receptionist={receptionist} />
              }
            ></ReceptionistCard>
          </div>
        </>
      ) : (
        <> </>
      )}

      {!loadingDoctor && !loadingReceptionist && (
        <>
          <Card className="mb-3">
            <Card.Header>{tUserPage("security_label")}</Card.Header>
            <Card.Body>
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>{tUserPage("login_label")}</Form.Label>
                    <Form.Control
                      type="text"
                      readOnly
                      disabled
                      value={userDetails?.username}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>{tUserPage("role_label")}</Form.Label>
                    <Form.Control type="text" readOnly disabled value={role} />
                  </Form.Group>
                </Col>
              </Row>

              <Button type="button" onClick={handleShowChangePasswordModal}>
                {tUserPage("change_password_button_label")}
              </Button>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>{tUserPage("settings_label")}</Card.Header>
            <Card.Body>
              <LocaleSwitcher></LocaleSwitcher>
            </Card.Body>
          </Card>
        </>
      )}

      <ChangePasswordModal
        show={showChangePasswordModal}
        onClose={handleCloseChangePasswordModal}
      />
      <br></br>
    </>
  );
}
