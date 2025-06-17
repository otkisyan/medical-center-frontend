import { PatientRequest } from "@/shared/interface/patient/patient-interface";
import { useTranslations } from "next-intl";
import { Button, Col, Form, Row } from "react-bootstrap";

interface PatientUpdateFormProps {
  editedPatient: PatientRequest;
  handleChangePatient: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEditFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onClickEdit: () => void;
  handleCancelEdit: () => void;
  handleShowDeleteModal: () => void;
  editing: boolean;
}

const PatientUpdateForm: React.FC<PatientUpdateFormProps> = ({
  editedPatient,
  handleChangePatient,
  handleEditFormSubmit,
  onClickEdit,
  handleCancelEdit,
  handleShowDeleteModal,
  editing,
}) => {
  const tCommon = useTranslations("Common");

  return (
    <Form onSubmit={handleEditFormSubmit}>
      <fieldset disabled={!editing}>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridSurname">
            <Form.Label>{tCommon("personal_data.surname")}</Form.Label>
            <Form.Control
              type="text"
              value={editedPatient.surname ?? ""}
              name="surname"
              onChange={handleChangePatient}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="formGridName">
            <Form.Label>{tCommon("personal_data.name")}</Form.Label>
            <Form.Control
              type="text"
              value={editedPatient.name ?? ""}
              name="name"
              onChange={handleChangePatient}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="formGridMiddleName">
            <Form.Label>{tCommon("personal_data.middle_name")}</Form.Label>
            <Form.Control
              type="text"
              value={editedPatient.middleName ?? ""}
              name="middleName"
              onChange={handleChangePatient}
            />
          </Form.Group>
        </Row>
        <Form.Group controlId="formGridBirthDate" className="mb-3">
          <Form.Label>{tCommon("personal_data.birth_date")}</Form.Label>
          <Form.Control
            type="date"
            value={
              editedPatient.birthDate ? editedPatient.birthDate.toString() : ""
            }
            name="birthDate"
            max="9999-12-31"
            onChange={handleChangePatient}
          />
        </Form.Group>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridPhone">
            <Form.Label> {tCommon("personal_data.phone")}</Form.Label>
            <Form.Control
              type="text"
              value={editedPatient.phone ?? ""}
              onChange={handleChangePatient}
              name="phone"
            />
          </Form.Group>
          <Form.Group as={Col} controlId="formGridMessengerContact">
            <Form.Label>
              {" "}
              {tCommon("personal_data.messenger_contact")}
            </Form.Label>
            <Form.Control
              type="text"
              value={editedPatient.messengerContact ?? ""}
              name="messengerContact"
              onChange={handleChangePatient}
            />
          </Form.Group>
        </Row>
        <Form.Group controlId="formGridAddress" className="mb-3">
          <Form.Label> {tCommon("personal_data.address")}</Form.Label>
          <Form.Control
            type="text"
            value={editedPatient.address ?? ""}
            name="address"
            onChange={handleChangePatient}
          />
        </Form.Group>
        <Form.Group controlId="formGridPreferentialCategory" className="mb-3">
          <Form.Label>
            {" "}
            {tCommon("personal_data.preferential_category")}
          </Form.Label>
          <Form.Control
            type="text"
            value={editedPatient.preferentialCategory ?? ""}
            name="preferentialCategory"
            onChange={handleChangePatient}
          />
        </Form.Group>
      </fieldset>
      <Button
        variant="primary"
        type="button"
        className="me-2"
        hidden={editing}
        onClick={onClickEdit}
      >
        <i className="bi bi-pencil-square" id="editButton"></i>
      </Button>
      <Button
        variant="primary"
        type="submit"
        className="me-2"
        hidden={!editing}
        id="confirmEdit"
      >
        {tCommon("action_save_button_label")}
      </Button>
      <Button
        variant="secondary"
        type="button"
        id="cancelButton"
        hidden={!editing}
        onClick={handleCancelEdit}
      >
        {tCommon("action_cancel_button_label")}
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
  );
};

export default PatientUpdateForm;
