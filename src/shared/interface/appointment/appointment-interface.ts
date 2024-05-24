import { DoctorResponse } from "../doctor/doctor-interface";
import { PatientResponse } from "../patient/patient-interface";

export interface AppointmentResponse {
  id: number;
  date: Date;
  timeStart: Date;
  timeEnd: Date;
  diagnosis: string | null;
  symptoms: string | null;
  medicalRecommendations: string | null;
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

export const convertAppointmentResponseToAppointmentRequest = (
  appointmentResponse: AppointmentResponse
) => {
  const appointmentRequest: AppointmentRequest = {
    date: appointmentResponse.date,
    timeStart: appointmentResponse.timeStart,
    timeEnd: appointmentResponse.timeEnd,
    diagnosis: appointmentResponse?.diagnosis,
    symptoms: appointmentResponse?.symptoms,
    medicalRecommendations: appointmentResponse?.medicalRecommendations,
    patientId: appointmentResponse.patient.id,
    doctorId: appointmentResponse.doctor.id,
  };
  return appointmentRequest;
};
