export interface OfficeResponse {
  id: number;
  number: number;
  name: string;
}

export interface OfficeRequest {
  number: number;
  name: string;
}

export const initialOfficeResponseState: OfficeResponse = {
  id: 0,
  number: 0,
  name: "",
};

export const initialOfficeRequestState: OfficeRequest = {
  number: 0,
  name: "",
};

export const convertOfficeResponseToOfficeRequest = (
  officeResponse: OfficeResponse
) => {
  const officeRequest: OfficeRequest = {
    name: officeResponse.name,
    number: officeResponse.number,
  };
  return officeRequest;
};
