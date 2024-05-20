import { DoctorResponse } from "../doctor/doctor-interface";
import { PatientResponse } from "../patient/patient-interface";

export interface AppointmentResponse {
  id: number;
  date: Date;
  timeStart: Date;
  timeEnd: Date;
  diagnosis: string;
  symptoms: string;
  medicalRecommendations: string;
  doctor: DoctorResponse;
  patient: PatientResponse;
}

export interface AppointmentRequest {
  date: Date;
  timeStart: Date;
  timeEnd: Date;
  diagnosis: string | null;
  symptoms: string | null;
  medicalRecommendations: string | null;
  doctorId: number;
  patientId: number;
}
