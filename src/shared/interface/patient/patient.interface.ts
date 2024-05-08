export interface IPatient {
  id: number | null;
  name: string;
  surname: string;
  middleName: string;
  address: string;
  phone: string;
  messengerContact: string;
  birthDate: Date | null;
  preferentialCategory: string;
}

export const initialPatientState: IPatient = {
  id: null,
  name: "",
  surname: "",
  middleName: "",
  address: "",
  phone: "",
  messengerContact: "",
  birthDate: null,
  preferentialCategory: "",
};
