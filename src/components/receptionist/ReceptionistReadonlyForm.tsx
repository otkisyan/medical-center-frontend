import { ReceptionistResponse } from "@/shared/interface/receptionist/receptionist-interface";
import { useTranslations } from "next-intl";
import { Form, Row, Col } from "react-bootstrap";

interface ReceptionistReadonlyFormProps {
  receptionist: ReceptionistResponse;
}

const ReceptionistReadonlyForm: React.FC<ReceptionistReadonlyFormProps> = ({
  receptionist,
}) => {
  const tCommon = useTranslations("Common");

  return (
    <Form>
      <fieldset disabled={true}>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridSurname">
            <Form.Label>{tCommon("personal_data.surname")}</Form.Label>
            <Form.Control
              type="text"
              value={receptionist.surname ?? ""}
              name="surname"
              readOnly
            />
          </Form.Group>
          <Form.Group as={Col} controlId="formGridName">
            <Form.Label>{tCommon("personal_data.name")}</Form.Label>
            <Form.Control
              type="text"
              value={receptionist.name ?? ""}
              name="name"
              readOnly
            />
          </Form.Group>
          <Form.Group as={Col} controlId="formGridMiddleName">
            <Form.Label>{tCommon("personal_data.middle_name")}</Form.Label>
            <Form.Control
              type="text"
              value={receptionist.middleName ?? ""}
              name="middleName"
              readOnly
            />
          </Form.Group>
        </Row>
        <Form.Group controlId="formGridBirthDate" className="mb-3">
          <Form.Label>{tCommon("personal_data.birth_date")}</Form.Label>
          <Form.Control
            type="date"
            value={
              receptionist.birthDate ? receptionist.birthDate.toString() : ""
            }
            name="birthDate"
            readOnly
          />
        </Form.Group>
      </fieldset>
    </Form>
  );
};

export default ReceptionistReadonlyForm;
