import { UserCredentials } from "../user/user-credentials-interface";

export interface ReceptionistResponse {
  id: number;
  name: string;
  surname: string;
  middleName: string;
  birthDate: Date | null;
}

export interface ReceptionistRequest {
  name: string;
  surname: string;
  middleName: string;
  birthDate: Date | null;
}

export interface ReceptionistResponseWithUserCredentials {
  receptionist: ReceptionistResponse;
  userCredentials: UserCredentials;
}

export const initialReceptionistResponseState: ReceptionistResponse = {
  id: 0,
  name: "",
  surname: "",
  middleName: "",
  birthDate: null,
};

export const initialReceptionistRequestState: ReceptionistRequest = {
  name: "",
  surname: "",
  middleName: "",
  birthDate: null,
};

export const convertReceptionistResponseToReceptionistRequest = (
  receptionistResponse: ReceptionistResponse
) => {
  const receptionistRequest: ReceptionistRequest = {
    name: receptionistResponse.name,
    surname: receptionistResponse.surname,
    middleName: receptionistResponse.middleName,
    birthDate: receptionistResponse.birthDate,
  };
  return receptionistRequest;
};
