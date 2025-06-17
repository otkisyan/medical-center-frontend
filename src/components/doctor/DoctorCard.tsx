import { useTranslations } from "next-intl";
import { useState } from "react";
import { Card, Nav } from "react-bootstrap";
import SpinnerCenter from "../loading/spinner/SpinnerCenter";

interface DoctorCardProps {
  doctorForm: React.ReactNode;
  workScheduleForm: React.ReactNode;
  loadingDoctorWorkSchedules: boolean;
}

const DoctorCard: React.FC<DoctorCardProps> = ({
  doctorForm,
  workScheduleForm,
  loadingDoctorWorkSchedules,
}) => {
  enum Tab {
    Doctor,
    Work_Schedules,
  }
  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab);
  };
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Doctor);
  const tSpecificDoctorPage = useTranslations("SpecificDoctorPage");
  return (
    <Card>
      <Card.Header>
        <Nav variant="tabs" defaultActiveKey="#doctor">
          <Nav.Item>
            <Nav.Link href="#doctor" onClick={() => handleTabClick(Tab.Doctor)}>
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
        {activeTab === Tab.Doctor && doctorForm}
        {activeTab === Tab.Work_Schedules && (
          <>
            {loadingDoctorWorkSchedules ? (
              <SpinnerCenter></SpinnerCenter>
            ) : (
              workScheduleForm
            )}
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default DoctorCard;
