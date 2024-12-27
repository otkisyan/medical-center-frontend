import { ReceptionistRequest } from "@/shared/interface/receptionist/receptionist-interface";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useTranslations } from "next-intl";

interface ReceptionistUpdateFormProps {
  editedReceptionist: ReceptionistRequest;
  handleChangeReceptionist: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEditFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleEdit: () => void;
  handleCancelEdit: () => void;
  handleShowDeleteModal: () => void;
  editing: boolean;
}

const ReceptionistUpdateForm: React.FC<ReceptionistUpdateFormProps> = ({
  editedReceptionist,
  handleChangeReceptionist,
  handleEditFormSubmit,
  handleEdit,
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
              value={editedReceptionist.surname ?? ""}
              name="surname"
              onChange={handleChangeReceptionist}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="formGridName">
            <Form.Label>{tCommon("personal_data.name")}</Form.Label>
            <Form.Control
              type="text"
              value={editedReceptionist.name ?? ""}
              name="name"
              onChange={handleChangeReceptionist}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="formGridMiddleName">
            <Form.Label>{tCommon("personal_data.middle_name")}</Form.Label>
            <Form.Control
              type="text"
              value={editedReceptionist.middleName ?? ""}
              name="middleName"
              onChange={handleChangeReceptionist}
            />
          </Form.Group>
        </Row>
        <Form.Group controlId="formGridBirthDate" className="mb-3">
          <Form.Label>{tCommon("personal_data.birth_date")}</Form.Label>
          <Form.Control
            type="date"
            value={
              editedReceptionist.birthDate
                ? editedReceptionist.birthDate.toString()
                : ""
            }
            name="birthDate"
            max="9999-12-31"
            onChange={handleChangeReceptionist}
          />
        </Form.Group>
      </fieldset>
      <Button
        variant="primary"
        type="button"
        className="me-2"
        hidden={editing}
        onClick={handleEdit}
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

export default ReceptionistUpdateForm;
