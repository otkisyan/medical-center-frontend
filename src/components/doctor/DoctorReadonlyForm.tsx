import { customReactSelectStyles } from "@/css/react-select";
import {
  DoctorRequest,
  DoctorResponse,
} from "@/shared/interface/doctor/doctor-interface";
import { useTranslations } from "next-intl";
import { Form, Row } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Select from "react-select";

interface DoctorReadonlyFormProps {
  doctor: DoctorResponse;
  loadingOfficesOptions: boolean;
  officesOptions: { value: string; label: string }[];
  findOfficeOptionByValue: (
    value: any
  ) => { value: string; label: string } | undefined;
}

const DoctorReadonlyForm: React.FC<DoctorReadonlyFormProps> = ({
  doctor: doctor,
  loadingOfficesOptions,
  officesOptions,
  findOfficeOptionByValue,
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
              value={doctor.surname ?? ""}
              name="surname"
              readOnly
            />
          </Form.Group>
          <Form.Group as={Col} controlId="formGridName">
            <Form.Label>{tCommon("personal_data.name")}</Form.Label>
            <Form.Control
              type="text"
              value={doctor.name ?? ""}
              name="name"
              readOnly
            />
          </Form.Group>
          <Form.Group as={Col} controlId="formGridMiddleName">
            <Form.Label>{tCommon("personal_data.middle_name")}</Form.Label>
            <Form.Control
              type="text"
              value={doctor.middleName ?? ""}
              name="middleName"
              readOnly
            />
          </Form.Group>
        </Row>
        <Form.Group controlId="formGridBirthDate" className="mb-3">
          <Form.Label>{tCommon("personal_data.birth_date")}</Form.Label>
          <Form.Control
            type="date"
            value={doctor.birthDate ? doctor.birthDate.toString() : ""}
            name="birthDate"
            readOnly
          />
        </Form.Group>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridPhone">
            <Form.Label>{tCommon("personal_data.phone")}</Form.Label>
            <Form.Control
              type="text"
              value={doctor.phone ?? ""}
              name="phone"
              readOnly
            />
          </Form.Group>
          <Form.Group as={Col} controlId="formGridMessengerContact">
            <Form.Label>
              {tCommon("personal_data.messenger_contact")}
            </Form.Label>
            <Form.Control
              type="text"
              value={doctor.messengerContact ?? ""}
              name="messengerContact"
              readOnly
            />
          </Form.Group>
        </Row>
        <Form.Group controlId="formGridAddress" className="mb-3">
          <Form.Label>{tCommon("personal_data.address")}</Form.Label>
          <Form.Control
            type="text"
            value={doctor.address ?? ""}
            name="address"
            readOnly
          />
        </Form.Group>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridMedicalSpecialty">
            <Form.Label>
              {tCommon("personal_data.doctor.medical_specialty")}
            </Form.Label>
            <Form.Control
              type="text"
              value={doctor.medicalSpecialty ?? ""}
              name="medicalSpecialty"
              readOnly
            />
          </Form.Group>
          <Form.Group as={Col} controlId="formGridQualificationCategory">
            <Form.Label>
              {tCommon("personal_data.doctor.qualification_category")}
            </Form.Label>
            <Form.Control
              type="text"
              value={doctor.qualificationCategory ?? ""}
              name="qualificationCategory"
              readOnly
            />
          </Form.Group>
        </Row>
        <Form.Group as={Col} controlId="formGridOffice">
          <Form.Label>{tCommon("office.label")}</Form.Label>
          <Select
            className="basic-single mb-3"
            classNamePrefix="select"
            isLoading={loadingOfficesOptions}
            value={
              doctor?.office?.id
                ? findOfficeOptionByValue(doctor.office.id)
                : findOfficeOptionByValue("")
            }
            isDisabled={true}
            placeholder={
              loadingOfficesOptions
                ? tCommon("loading")
                : tCommon("office_select.placeholder_label")
            }
            name="officeId"
            loadingMessage={() => tCommon("loading")}
            noOptionsMessage={() => tCommon("office_select.no_options_message")}
            options={officesOptions}
            styles={customReactSelectStyles}
          />
        </Form.Group>
      </fieldset>
    </Form>
  );
};

export default DoctorReadonlyForm;
