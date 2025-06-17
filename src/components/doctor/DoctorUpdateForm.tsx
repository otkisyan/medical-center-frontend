import { customReactSelectStyles } from "@/css/react-select";
import { useAuth } from "@/shared/context/UserContextProvider";
import { Role } from "@/shared/enum/role";
import { DoctorRequest } from "@/shared/interface/doctor/doctor-interface";
import { useTranslations } from "next-intl";
import { Button, Form, Row } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Select from "react-select";

interface DoctorUpdateFormProps {
  editedDoctor: DoctorRequest;
  handleChangeDoctor: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEditDoctorFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleEditDoctor: () => void;
  handleChangeDoctorOffice: (e: any) => void;
  handleCancelEditDoctor: () => void;
  handleShowDeleteModal: () => void;
  loadingOfficesOptions: boolean;
  editingDoctor: boolean;
  officesOptions: { value: string; label: string }[];
  findOfficeOptionByValue: (
    value: any
  ) => { value: string; label: string } | undefined;
}

const DoctorUpdateForm: React.FC<DoctorUpdateFormProps> = ({
  editedDoctor,
  handleChangeDoctor,
  handleChangeDoctorOffice,
  handleEditDoctorFormSubmit,
  handleEditDoctor,
  handleCancelEditDoctor,
  handleShowDeleteModal,
  loadingOfficesOptions,
  editingDoctor,
  officesOptions,
  findOfficeOptionByValue,
}) => {
  const tCommon = useTranslations("Common");
  const { hasAnyRole } = useAuth();

  return (
    <Form onSubmit={handleEditDoctorFormSubmit}>
      <fieldset disabled={!editingDoctor}>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridSurname">
            <Form.Label>{tCommon("personal_data.surname")}</Form.Label>
            <Form.Control
              type="text"
              required
              value={editedDoctor.surname ?? ""}
              name="surname"
              onChange={handleChangeDoctor}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="formGridName">
            <Form.Label>{tCommon("personal_data.name")}</Form.Label>
            <Form.Control
              type="text"
              required
              value={editedDoctor.name ?? ""}
              name="name"
              onChange={handleChangeDoctor}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="formGridMiddleName">
            <Form.Label>{tCommon("personal_data.middle_name")}</Form.Label>
            <Form.Control
              type="text"
              required
              value={editedDoctor.middleName ?? ""}
              name="middleName"
              onChange={handleChangeDoctor}
            />
          </Form.Group>
        </Row>
        <Form.Group controlId="formGridBirthDate" className="mb-3">
          <Form.Label>{tCommon("personal_data.birth_date")}</Form.Label>
          <Form.Control
            type="date"
            required
            value={
              editedDoctor.birthDate ? editedDoctor.birthDate.toString() : ""
            }
            name="birthDate"
            max="9999-12-31"
            onChange={handleChangeDoctor}
          />
        </Form.Group>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridPhone">
            <Form.Label>{tCommon("personal_data.phone")}</Form.Label>
            <Form.Control
              required
              type="text"
              value={editedDoctor.phone ?? ""}
              onChange={handleChangeDoctor}
              name="phone"
            />
          </Form.Group>
          <Form.Group as={Col} controlId="formGridMessengerContact">
            <Form.Label>
              {tCommon("personal_data.messenger_contact")}
            </Form.Label>
            <Form.Control
              type="text"
              value={editedDoctor.messengerContact ?? ""}
              name="messengerContact"
              onChange={handleChangeDoctor}
            />
          </Form.Group>
        </Row>
        <Form.Group controlId="formGridAddress" className="mb-3">
          <Form.Label>{tCommon("personal_data.address")}</Form.Label>
          <Form.Control
            type="text"
            value={editedDoctor.address ?? ""}
            name="address"
            onChange={handleChangeDoctor}
          />
        </Form.Group>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridMedicalSpecialty">
            <Form.Label>
              {tCommon("personal_data.doctor.medical_specialty")}
            </Form.Label>
            <Form.Control
              required
              type="text"
              value={editedDoctor.medicalSpecialty ?? ""}
              name="medicalSpecialty"
              onChange={handleChangeDoctor}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="formGridQualificationCategory">
            <Form.Label>
              {tCommon("personal_data.doctor.qualification_category")}
            </Form.Label>
            <Form.Control
              type="text"
              value={editedDoctor.qualificationCategory ?? ""}
              name="qualificationCategory"
              onChange={handleChangeDoctor}
            />
          </Form.Group>
        </Row>
        <Form.Group controlId="formGridEducation" className="mb-3">
          <Form.Label>{tCommon("personal_data.doctor.education")}</Form.Label>
          <Form.Control
            type="text"
            value={editedDoctor.education ?? ""}
            name="education"
            onChange={handleChangeDoctor}
          />
        </Form.Group>
        <Form.Group as={Col} controlId="formGridOffice">
          <Form.Label>{tCommon("office.label")}</Form.Label>
          <Select
            className="basic-single mb-3"
            classNamePrefix="select"
            isLoading={loadingOfficesOptions}
            isSearchable={true}
            value={
              editedDoctor.officeId
                ? findOfficeOptionByValue(editedDoctor.officeId)
                : findOfficeOptionByValue("")
            }
            isDisabled={!editingDoctor}
            placeholder={
              loadingOfficesOptions
                ? tCommon("loading")
                : tCommon("office_select.placeholder_label")
            }
            name="officeId"
            onChange={handleChangeDoctorOffice}
            loadingMessage={() => tCommon("loading")}
            noOptionsMessage={() => tCommon("office_select.no_options_message")}
            options={officesOptions}
            styles={customReactSelectStyles}
          />
        </Form.Group>
      </fieldset>
      {hasAnyRole([Role.ADMIN]) && (
        <>
          <Button
            variant="primary"
            type="button"
            className="me-2"
            hidden={editingDoctor}
            onClick={handleEditDoctor}
          >
            <i className="bi bi-pencil-square" id="editButton"></i>
          </Button>
          <Button
            variant="primary"
            type="submit"
            className="me-2"
            hidden={!editingDoctor}
            id="confirmEdit"
          >
            {tCommon("action_save_button_label")}
          </Button>
          <Button
            variant="secondary"
            type="button"
            id="cancelButton"
            hidden={!editingDoctor}
            onClick={handleCancelEditDoctor}
          >
            {tCommon("action_cancel_button_label")}
          </Button>
          <Button
            variant="danger"
            type="button"
            hidden={editingDoctor}
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

export default DoctorUpdateForm;
