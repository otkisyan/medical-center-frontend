export interface PatientResponse {
  id: number;
  name: string;
  surname: string;
  middleName: string;
  address: string;
  phone: string;
  messengerContact: string;
  birthDate: Date | null;
  preferentialCategory: string;
}

export interface PatientRequest {
  name: string;
  surname: string;
  middleName: string;
  address: string;
  phone: string;
  messengerContact: string;
  birthDate: Date | null;
  preferentialCategory: string;
}

export const initialPatientResponseState: PatientResponse = {
  id: 0,
  name: "",
  surname: "",
  middleName: "",
  address: "",
  phone: "",
  messengerContact: "",
  birthDate: null,
  preferentialCategory: "",
};

export const initialPatientRequestState: PatientRequest = {
  name: "",
  surname: "",
  middleName: "",
  address: "",
  phone: "",
  messengerContact: "",
  birthDate: null,
  preferentialCategory: "",
};

export const convertPatientResponseToPatientRequest = (
  patientResponse: PatientResponse
) => {
  const patientRequest: PatientRequest = {
    name: patientResponse.name,
    surname: patientResponse.surname,
    middleName: patientResponse.middleName,
    address: patientResponse.address,
    phone: patientResponse.phone,
    messengerContact: patientResponse.messengerContact,
    birthDate: patientResponse.birthDate,
    preferentialCategory: patientResponse.preferentialCategory,
  };
  return patientRequest;
};
