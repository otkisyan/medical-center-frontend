import { useTranslations } from "next-intl";
import { Card, Nav } from "react-bootstrap";

interface ReceptionistCardProps {
  receptionistForm: React.ReactNode;
}

const ReceptionistCard: React.FC<ReceptionistCardProps> = ({
  receptionistForm,
}) => {
  const tSpecificReceptionistPage = useTranslations("SpecificReceptionistPage");

  return (
    <Card>
      <Card.Header>
        {tSpecificReceptionistPage("receptionist_card_header")}
      </Card.Header>
      <Card.Body>{receptionistForm}</Card.Body>
    </Card>
  );
};

export default ReceptionistCard;
