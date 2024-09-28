import Select from "react-select";
import { customReactSelectStyles } from "@/css/react-select";
import { useTranslations } from "next-intl";

interface DoctorSelectProps {
  doctorsOptions: any[];
  loadingDoctorsOptions: boolean;
  selectDoctorRef: any;
  setDoctorId: (value: number) => void;
  findDoctorOptionByValue: (value: number) => any;
  appointment?: any;
}

export const DoctorSelect: React.FC<DoctorSelectProps> = ({
  doctorsOptions,
  loadingDoctorsOptions,
  selectDoctorRef,
  setDoctorId,
  findDoctorOptionByValue,
  appointment,
}) => {
  const tDoctorSelect = useTranslations("DoctorSelect");
  const tCommon = useTranslations("Common");
  return (
    <Select
      className="basic-single mb-3"
      classNamePrefix="select"
      isLoading={loadingDoctorsOptions}
      isSearchable={true}
      ref={selectDoctorRef}
      placeholder={tDoctorSelect("placeholder")}
      name="doctorId"
      onChange={(e) => {
        setDoctorId(e.value);
      }}
      loadingMessage={() => tCommon("loading")}
      noOptionsMessage={() => tDoctorSelect("no_options_message")}
      options={doctorsOptions}
      defaultValue={
        appointment ? findDoctorOptionByValue(appointment.doctor.id) : ""
      }
      styles={customReactSelectStyles}
    />
  );
};
