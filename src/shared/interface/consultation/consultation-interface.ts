export interface ConsultationRequest {
  diagnosis: string;
  symptoms: string;
  medicalRecommendations: string;
}

export interface ConsultationResponse {
  id: number;
  diagnosis: string;
  symptoms: string;
  medicalRecommendations: string;
}

export const convertConsultationResponseToConsultationRequest = (
  consultationResponse: ConsultationResponse
) => {
  const consultationRequest: ConsultationRequest = {
    diagnosis: consultationResponse.diagnosis,
    symptoms: consultationResponse.symptoms,
    medicalRecommendations: consultationResponse.medicalRecommendations,
  };
  return consultationRequest;
};
