export interface IPatient {
  id: number
  name: string
  surname: string
  middleName: string
  address: string
  phone: string
  messengerContact: string
  birthDate: Date
  preferentialCategory: string
}

export const initialPatientState: IPatient = {
  id: 0,
  name: '',
  surname: '',
  middleName: '',
  address: '',
  phone: '',
  messengerContact: '',
  birthDate: new Date(),
  preferentialCategory: '',
};
