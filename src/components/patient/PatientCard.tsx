import { useTranslations } from "next-intl";
import { Card } from "react-bootstrap";

interface PatientCardProps {
  patientForm: React.ReactNode;
}

const PatientCard: React.FC<PatientCardProps> = ({ patientForm }) => {
  const tSpecificPatientPage = useTranslations("SpecificPatientPage");

  return (
    <Card>
      <Card.Header>
        {tSpecificPatientPage("patient_card_header")}
      </Card.Header>
      <Card.Body>{patientForm}</Card.Body>
    </Card>
  );
};

export default PatientCard;
