import { useAuth } from "@/shared/context/UserContextProvider";
import { Role } from "@/shared/enum/role";
import { OfficeRequest } from "@/shared/interface/office/office-interface";
import { useTranslations } from "next-intl";
import { Button, Col, Form, Row } from "react-bootstrap";

interface OfficeUpdateFormProps {
  editedOffice: OfficeRequest;
  handleChangeOffice: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEditFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onClickEdit: () => void;
  handleCancelEdit: () => void;
  handleShowDeleteModal: () => void;
  editing: boolean;
}

const OfficeUpdateForm: React.FC<OfficeUpdateFormProps> = ({
  editedOffice,
  handleChangeOffice,
  handleEditFormSubmit,
  onClickEdit,
  handleCancelEdit,
  handleShowDeleteModal,
  editing,
}) => {
  const tCommon = useTranslations("Common");
  const { hasAnyRole } = useAuth();

  return (
    <Form onSubmit={handleEditFormSubmit}>
      <fieldset disabled={!editing}>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridNumber">
            <Form.Label>{tCommon("office.number_short")}</Form.Label>
            <Form.Control
              type="number"
              value={editedOffice.number.toString()}
              name="number"
              onChange={handleChangeOffice}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="formGridName">
            <Form.Label>{tCommon("office.name_short")}</Form.Label>
            <Form.Control
              type="text"
              value={editedOffice.name}
              name="name"
              onChange={handleChangeOffice}
            />
          </Form.Group>
        </Row>
      </fieldset>
      {hasAnyRole([Role.ADMIN]) && (
        <>
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
        </>
      )}
    </Form>
  );
};

export default OfficeUpdateForm;
