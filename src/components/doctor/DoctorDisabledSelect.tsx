import Select from "react-select";
import { customReactSelectStyles } from "@/css/react-select";
import { useTranslations } from "next-intl";

interface DoctorDisabledSelectProps {
  defaultDoctorOption: any;
  loadingDoctor: boolean;
}

export const DoctorDisabledSelect: React.FC<DoctorDisabledSelectProps> = ({
  defaultDoctorOption,
  loadingDoctor,
}) => {
  const tDoctorSelect = useTranslations("DoctorSelect");
  const tCommon = useTranslations("Common");
  return (
    <Select
      isDisabled
      className="basic-single mb-3"
      classNamePrefix="select"
      isLoading={loadingDoctor}
      isSearchable={true}
      value={defaultDoctorOption}
      placeholder={tCommon("loading")}
      name="doctorId"
      loadingMessage={() => tCommon("loading")}
      noOptionsMessage={() => tDoctorSelect("no_options_message")}
      styles={customReactSelectStyles}
    />
  );
};
