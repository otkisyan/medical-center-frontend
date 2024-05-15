export const customReactSelectStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isDisabled ? "#EAECEF" : provided.backgroundColor,
    border: state.isFocused ? "1px solid #80bdff" : "1px solid #DFE2E6",
    borderRadius: ".40rem",
    boxShadow: "none",
    "&:hover": {
      borderColor: "#ced4da",
    },
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#007bff" : "transparent",
    color: state.isSelected ? "#ffffff" : "#000000",
    "&:hover": {
      backgroundColor: state.isSelected ? "#007bff" : "#eaecef", // Keep the background color unchanged if selected
      color: state.isSelected ? "#ffffff" : "#000000", // Keep the color unchanged if selected
    },
  }),
  singleValue: (provided: any, state: any) => ({
    ...provided,
    color: "#212529",
  }),
};
