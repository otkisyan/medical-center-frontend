import { OfficeResponse } from "../office/office-interface";
import { UserCredentials } from "../user/user-credentials-interface";

export interface DoctorResponse {
  id: number;
  name: string;
  surname: string;
  middleName: string;
  address: string;
  phone: string;
  messengerContact: string;
  birthDate: Date | null;
  medicalSpecialty: string;
  qualificationCategory: string;
  office: OfficeResponse | null;
}

export interface DoctorRequest {
  name: string;
  surname: string;
  middleName: string;
  address: string;
  phone: string;
  messengerContact: string;
  birthDate: Date | null;
  medicalSpecialty: string;
  qualificationCategory: string;
  officeId: number | null;
}

export interface DoctorResponseWithUserCredentials {
  doctorResponseDto: DoctorResponse;
  userCredentialsDto: UserCredentials;
}

export interface DoctorUserCredentials {
  doctorId: number;
  fullName: string;
  userCredentials: UserCredentials;
}

export const initialDoctorResponseState: DoctorResponse = {
  id: 0,
  name: "",
  surname: "",
  middleName: "",
  address: "",
  phone: "",
  messengerContact: "",
  birthDate: null,
  qualificationCategory: "",
  medicalSpecialty: "",
  office: null,
};

export const initialDoctorRequestState: DoctorRequest = {
  name: "",
  surname: "",
  middleName: "",
  address: "",
  phone: "",
  messengerContact: "",
  birthDate: null,
  qualificationCategory: "",
  medicalSpecialty: "",
  officeId: null,
};

export const convertDoctorResponseToDoctorRequest = (
  doctorResponse: DoctorResponse
) => {
  const doctorRequest: DoctorRequest = {
    name: doctorResponse.name,
    surname: doctorResponse.surname,
    middleName: doctorResponse.middleName,
    address: doctorResponse.address,
    phone: doctorResponse.phone,
    messengerContact: doctorResponse.messengerContact,
    birthDate: doctorResponse.birthDate,
    medicalSpecialty: doctorResponse.medicalSpecialty,
    qualificationCategory: doctorResponse.qualificationCategory,
    officeId: doctorResponse.office?.id ? doctorResponse.office.id : null,
  };
  return doctorRequest;
};
