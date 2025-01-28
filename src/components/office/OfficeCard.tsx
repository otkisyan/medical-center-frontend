import { useTranslations } from "next-intl";
import { Card } from "react-bootstrap";

interface OfficeCardProps {
  officeForm: React.ReactNode;
}

const OfficeCard: React.FC<OfficeCardProps> = ({ officeForm }) => {
  const tSpecificOfficePage = useTranslations("SpecificOfficePage");

  return (
    <Card>
      <Card.Header>
        {tSpecificOfficePage("office_card_header")}
      </Card.Header>
      <Card.Body>{officeForm}</Card.Body>
    </Card>
  );
};

export default OfficeCard;
